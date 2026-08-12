// ---------------------------------------------------------------------------
// Inventory calculation helpers
// ---------------------------------------------------------------------------

import {
  ATTACHMENTS_BY_ID,
  EQUIPMENT_BY_ID,
  MELEE_WEAPONS_BY_ID,
  VEHICLES_BY_ID,
  WEAPONS_BY_ID,
} from "@/data/equipment.ts";
import type { CharacterInventory } from "./inventory_types.ts";
import {
  CREATION_FREE_ITEM_SLOTS,
  EXTRA_ITEM_POINT_COST,
} from "./inventory_types.ts";

export type SlotLookups = {
  getEquipment?: (id: string) => { isCharge?: boolean } | undefined;
  getAttachment?: (
    id: string,
  ) => { isCharge?: boolean; isFree?: boolean } | undefined;
};

export const weightLookups = {
  getWeapon: (id: string) => WEAPONS_BY_ID.get(id),
  getMeleeWeapon: (id: string) => MELEE_WEAPONS_BY_ID.get(id),
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

export const slotLookups: SlotLookups = {
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

type InventoryPocket = CharacterInventory["carried"];

export function countLocationSlots(
  pocket: InventoryPocket,
  lookups?: SlotLookups,
): number {
  let slots = 0;

  for (const e of pocket.equipment) {
    if (e.perkGranted) continue;
    const def = lookups?.getEquipment?.(e.equipmentId);
    if (def?.isCharge) {
      slots += e.totalCharges;
    } else {
      slots += 1;
    }
  }

  for (const w of pocket.weapons) {
    slots += 1;
    for (const attachmentId of w.attachedIds) {
      const def = lookups?.getAttachment?.(attachmentId);
      if (def?.isFree) continue;
      slots += 1;
    }
  }

  for (const mw of pocket.meleeWeapons) {
    if (mw.perkGranted) continue;
    slots += 1;
  }

  slots += (pocket.vehicles ?? []).length;

  for (const a of pocket.attachments ?? []) {
    const def = lookups?.getAttachment?.(a.attachmentId);
    if (def?.isFree) continue;
    if (def?.isCharge) {
      slots += a.totalCharges;
    } else {
      slots += 1;
    }
  }

  return slots;
}

function countUsedFreeAttachments(
  pockets: InventoryPocket[],
  freeAttachmentIds: ReadonlySet<string>,
): number {
  const freeUsed = new Set<string>();
  for (const pocket of pockets) {
    for (const w of pocket.weapons) {
      for (const attachmentId of w.attachedIds) {
        if (freeAttachmentIds.has(attachmentId)) {
          freeUsed.add(attachmentId);
        }
      }
    }
    for (const a of pocket.attachments ?? []) {
      if (freeAttachmentIds.has(a.attachmentId)) {
        freeUsed.add(a.attachmentId);
      }
    }
  }
  return freeUsed.size;
}

/**
 * Count how many "item slots" the carried inventory uses.
 * Each weapon = 1 slot. Each attachment on a weapon = 1 slot.
 * Each non-charge equipment = 1 slot; each charge of a charge-type equipment = 1 slot.
 * Each vehicle = 1 slot.
 * Each loose (unattached) attachment = 1 slot (charge-based: each charge = 1 slot).
 * Perk-granted melee weapons are free; all other melee weapons = 1 slot each.
 */
export function countCarriedItemSlots(
  inv: CharacterInventory,
  lookups?: SlotLookups,
  freeAttachmentIds?: ReadonlySet<string>,
): number {
  let slots = countLocationSlots(inv.carried, lookups);
  if (freeAttachmentIds && freeAttachmentIds.size > 0) {
    slots = Math.max(
      0,
      slots - countUsedFreeAttachments([inv.carried], freeAttachmentIds),
    );
  }
  return slots;
}

/**
 * Count item slots across BOTH carried AND stowed inventory.
 * Used for the shared free-item budget (3 free slots total, regardless of location).
 */
export function countAllItemSlots(
  inv: CharacterInventory,
  lookups?: SlotLookups,
  freeAttachmentIds?: ReadonlySet<string>,
): number {
  // Do not pass freeAttachmentIds into countCarriedItemSlots — the subtract
  // below covers both locations once.
  let slots = countLocationSlots(inv.carried, lookups) +
    countLocationSlots(inv.stowed, lookups);

  if (freeAttachmentIds && freeAttachmentIds.size > 0) {
    slots = Math.max(
      0,
      slots -
        countUsedFreeAttachments(
          [inv.carried, inv.stowed],
          freeAttachmentIds,
        ),
    );
  }

  return slots;
}

export function hasMultipleCarriedBulkyEquipment(
  inv: CharacterInventory,
  getEquipment: (id: string) => { isBulky?: boolean } | undefined,
): boolean {
  let bulkyCount = 0;
  for (const eq of inv.carried.equipment) {
    const isBulky = eq.isBulkyOverride ?? getEquipment(eq.equipmentId)?.isBulky;
    if (isBulky) {
      bulkyCount += 1;
      if (bulkyCount > 1) return true;
    }
  }
  return false;
}

/**
 * Calculate the total weight contributed by the carried inventory.
 */
export function calculateInventoryWeight(
  inv: CharacterInventory,
  lookups: {
    getWeapon: (id: string) => { weight: number } | undefined;
    getMeleeWeapon: (id: string) => { weight: number } | undefined;
    getEquipment: (
      id: string,
    ) => { weight: number; isCharge?: boolean } | undefined;
    getAttachment: (
      id: string,
    ) =>
      | { weight: number; isCharge?: boolean; weightOverride?: number }
      | undefined;
  },
): number {
  let total = 0;

  for (const w of inv.carried.weapons) {
    const def = lookups.getWeapon(w.weaponId);
    if (def) {
      // Check for weight override from attached attachments
      let weaponWeight = def.weight;
      for (const aId of w.attachedIds) {
        const aDef = lookups.getAttachment(aId);
        if (aDef && aDef.weightOverride != null) {
          weaponWeight = aDef.weightOverride;
        }
      }
      total += weaponWeight;
    }
    // Attached attachment weight
    for (const aId of w.attachedIds) {
      const aDef = lookups.getAttachment(aId);
      if (aDef) total += aDef.weight;
    }
    // Spare full magazine weight (each = 1)
    total += w.magazines;
    // Spare partial magazine weight (each = 1)
    total += (w.partialMagazines ?? []).length;
  }

  for (const mw of inv.carried.meleeWeapons) {
    const def = lookups.getMeleeWeapon(mw.meleeWeaponId);
    if (def) total += def.weight;
  }

  for (const e of inv.carried.equipment) {
    const def = lookups.getEquipment(e.equipmentId);
    if (def) {
      const effectiveWeight = e.weightOverride ?? def.weight;
      if (def.isCharge) {
        // Only remaining (unused) charges contribute weight
        const remaining = Math.max(0, e.totalCharges - e.usedCharges);
        total += effectiveWeight * remaining;
      } else {
        total += effectiveWeight;
      }
    }
  }

  // Loose attachment weight
  for (const a of inv.carried.attachments ?? []) {
    const aDef = lookups.getAttachment(a.attachmentId);
    if (aDef) {
      if (aDef.isCharge) {
        const remaining = Math.max(0, a.totalCharges - a.usedCharges);
        total += aDef.weight * remaining;
      } else {
        total += aDef.weight;
      }
    }
  }

  return total;
}

export function getWeaponPointCost(
  id: string,
  perkIds?: string[],
  weaponMasterRestrictedUnlocks?: string[],
): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;
  if (perkIds?.includes("weapon-master")) {
    if (weaponMasterRestrictedUnlocks?.includes(id)) return 0;
    if (def.pointCost >= 3) return 1;
    return 0;
  }
  if (def.pointCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (def.discountFactionPerkIds.some((pid) => perkIds.includes(pid))) {
      return 1;
    }
  }
  return def.pointCost;
}

export function getVehiclePointCost(id: string): number {
  return VEHICLES_BY_ID.get(id)?.pointCost ?? 0;
}

/**
 * Point cost for a weapon taking signature-weapon status and faction discount
 * into account. Restricted signature weapons cost 1pt; others are free.
 */
export function getSignatureAdjustedPointCost(
  id: string,
  isSignature: boolean,
  perkIds?: string[],
): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;

  let baseCost = def.pointCost;
  if (baseCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (def.discountFactionPerkIds.some((pid) => perkIds.includes(pid))) {
      baseCost = 1;
    }
  }

  if (!isSignature) return baseCost;
  if (def.pointCost >= 3) return 1;
  return 0;
}

export function getSignatureFreeAttachmentIds(
  inventory: CharacterInventory,
  perkIds?: string[],
): Set<string> {
  if (!perkIds?.includes("signature-weapon")) return new Set<string>();

  const signatureWeapon = [
    ...inventory.carried.weapons,
    ...inventory.stowed.weapons,
  ].find((w) => w.isSignatureWeapon);
  if (!signatureWeapon) return new Set<string>();

  const def = WEAPONS_BY_ID.get(signatureWeapon.weaponId);
  if (!def) return new Set<string>();

  return new Set(def.compatibleAttachmentIds);
}

export function countAllItemSlotsWithPerks(
  inventory: CharacterInventory,
  perkIds?: string[],
): number {
  return countAllItemSlots(
    inventory,
    slotLookups,
    getSignatureFreeAttachmentIds(inventory, perkIds),
  );
}

/**
 * Extra points the inventory costs beyond the free creation slots, including
 * signature-weapon, weapon-master, and faction discounts.
 */
export function calculateInventoryPointCostWithPerks(
  inventory: CharacterInventory,
  perkIds?: string[],
): number {
  const hasSignatureWeaponPerk = perkIds?.includes("signature-weapon") ??
    false;
  const hasWeaponMaster = perkIds?.includes("weapon-master") ?? false;
  const freeAttachmentIds = getSignatureFreeAttachmentIds(inventory, perkIds);
  const unlockedIds = inventory.weaponMasterRestrictedUnlocks ?? [];

  const totalSlots = countAllItemSlots(
    inventory,
    slotLookups,
    freeAttachmentIds,
  );
  const overFree = Math.max(0, totalSlots - CREATION_FREE_ITEM_SLOTS);
  let cost = overFree * EXTRA_ITEM_POINT_COST;

  if (hasWeaponMaster) {
    cost += new Set(unlockedIds).size;
  }

  for (const location of ["carried", "stowed"] as const) {
    for (const w of inventory[location].weapons) {
      const isSignatureWeapon = hasSignatureWeaponPerk && !!w.isSignatureWeapon;
      if (isSignatureWeapon && !hasWeaponMaster) {
        cost += getSignatureAdjustedPointCost(w.weaponId, true, perkIds);
      } else {
        cost += getWeaponPointCost(w.weaponId, perkIds, unlockedIds);
      }
    }
    for (const v of inventory[location].vehicles ?? []) {
      cost += getVehiclePointCost(v.vehicleId);
    }
  }

  return cost;
}

/** @deprecated Use {@link calculateInventoryPointCostWithPerks}. */
export function calculateInventoryPointCost(
  inventory: CharacterInventory,
  perkIds?: string[],
): number {
  return calculateInventoryPointCostWithPerks(inventory, perkIds);
}
