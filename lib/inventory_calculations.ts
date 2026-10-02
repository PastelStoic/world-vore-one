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
  skipWeaponSlots = false,
): number {
  let slots = 0;

  for (const e of pocket.equipment) {
    if (e.perkGranted || e.isPatron) continue;
    const def = lookups?.getEquipment?.(e.equipmentId);
    if (def?.isCharge) {
      slots += e.totalCharges;
    } else {
      slots += 1;
    }
  }

  for (const w of pocket.weapons) {
    if (w.perkGranted || w.isPatron) continue;
    if (!skipWeaponSlots) slots += 1;
    for (const attachmentId of w.attachedIds) {
      const def = lookups?.getAttachment?.(attachmentId);
      if (def?.isFree) continue;
      slots += 1;
    }
  }

  for (const mw of pocket.meleeWeapons) {
    if (mw.perkGranted || mw.isPatron) continue;
    if (!skipWeaponSlots) slots += 1;
  }

  for (const v of pocket.vehicles ?? []) {
    if (v.isPatron) continue;
    slots += 1;
  }

  for (const a of pocket.attachments ?? []) {
    if (a.isPatron) continue;
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
  let used = 0;
  for (const pocket of pockets) {
    for (const w of pocket.weapons) {
      for (const attachmentId of w.attachedIds) {
        if (freeAttachmentIds.has(attachmentId)) used += 1;
      }
    }
    for (const a of pocket.attachments ?? []) {
      if (freeAttachmentIds.has(a.attachmentId)) used += 1;
    }
  }
  return used;
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
  skipWeaponSlots = false,
): number {
  let slots = countLocationSlots(inv.carried, lookups, skipWeaponSlots);
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
 * Used for the shared free-item budget (base 3 slots, plus Charisma extras).
 */
export function countAllItemSlots(
  inv: CharacterInventory,
  lookups?: SlotLookups,
  freeAttachmentIds?: ReadonlySet<string>,
  skipWeaponSlots = false,
): number {
  // Do not pass freeAttachmentIds into countCarriedItemSlots — the subtract
  // below covers both locations once.
  let slots = countLocationSlots(inv.carried, lookups, skipWeaponSlots) +
    countLocationSlots(inv.stowed, lookups, skipWeaponSlots);

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

export interface EffectiveWeaponStats {
  ammo: number;
  weight: number;
  attachedWeight: number;
  displayedWeight: number;
  damage: string | number;
  rateOfFire: number;
  reloadAmountOverride?: number;
  reloadTurns: number;
  requiresMagazines: boolean;
  attachmentMagazineSystem: boolean;
  attachmentRequiresMags: boolean;
  drumAttachmentId?: string;
}

/**
 * Weapon stats after applying every attached attachment override.
 * Shared by the card UI, ammo clamp, and carried-weight math.
 */
export function getEffectiveWeaponStats(
  weapon: {
    weaponId: string;
    attachedIds: readonly string[];
    currentAmmo?: number;
  },
): EffectiveWeaponStats | null {
  const def = WEAPONS_BY_ID.get(weapon.weaponId);
  if (!def) return null;

  let ammo = def.ammo;
  let weight = def.weight;
  let damage: string | number = def.damage;
  let rateOfFire = def.rateOfFire;
  let reloadAmountOverride = def.reloadAmountOverride;
  let reloadTurns = def.reloadTurns ?? 1;
  let attachmentMagazineSystem = false;
  let attachmentRequiresMags = false;
  let attachedWeight = 0;
  let drumAttachmentId: string | undefined;

  for (const attachmentId of weapon.attachedIds) {
    const attachment = ATTACHMENTS_BY_ID.get(attachmentId);
    if (!attachment) continue;

    if (attachment.ammoOverride) ammo = attachment.ammoOverride;
    if (attachment.weightOverride != null) weight = attachment.weightOverride;
    if (attachment.damageOverride != null) damage = attachment.damageOverride;
    if (attachment.rateOfFireBonus != null) {
      rateOfFire += attachment.rateOfFireBonus;
    }
    if (attachment.requiresMagazines) {
      attachmentRequiresMags = true;
      attachmentMagazineSystem = true;
    }
    if (attachment.reloadAmountOverride != null) {
      reloadAmountOverride = attachment.reloadAmountOverride;
    }
    if (attachment.reloadTurnsOverride != null) {
      reloadTurns = attachment.reloadTurnsOverride;
    }
    if (attachment.ammoOverride && attachment.isCharge) {
      attachmentMagazineSystem = true;
      drumAttachmentId = attachmentId;
    }
    attachedWeight += attachment.weight;
  }

  if (def.id === "c96-mauser" && (weapon.currentAmmo ?? 0) > 0) {
    reloadTurns = 2;
  }

  return {
    ammo,
    weight,
    attachedWeight,
    displayedWeight: weight + attachedWeight,
    damage,
    rateOfFire,
    reloadAmountOverride,
    reloadTurns,
    requiresMagazines: !!def.requiresMagazines || attachmentRequiresMags ||
      attachmentMagazineSystem,
    attachmentMagazineSystem,
    attachmentRequiresMags,
    drumAttachmentId,
  };
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
    const stats = getEffectiveWeaponStats(w);
    if (stats) {
      total += stats.displayedWeight;
    } else {
      const def = lookups.getWeapon(w.weaponId);
      if (def) total += def.weight;
    }
    total += w.magazines;
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

/** How many points Charisma takes off a paid item's cost. */
export function getCharismaItemDiscount(charisma = 1): number {
  return Math.max(0, Math.floor((charisma - 1) / 2));
}

/**
 * Charisma reduces paid item costs (see {@link getCharismaItemDiscount}),
 * down to a minimum of 1. Free items (cost 0) stay free.
 */
export function applyCharismaItemDiscount(
  cost: number,
  charisma = 1,
): number {
  if (cost <= 0) return cost;
  return Math.max(1, cost - getCharismaItemDiscount(charisma));
}

/**
 * How much of the extra-item-slot surcharge the Charisma discount can also
 * absorb for a paid item. The 1-point minimum applies to the item's whole
 * cost (own cost + slot surcharge), not to each part separately, so a paid
 * item whose own cost is already fully discounted should not end up costing
 * more than 1 just because it sits past the free slots.
 *
 * `rawCost` is the item's own point cost before Charisma.
 */
export function getSlotSurchargeSaving(
  rawCost: number,
  charisma = 1,
): number {
  if (rawCost <= 0) return 0;
  const separate = applyCharismaItemDiscount(rawCost, charisma) +
    EXTRA_ITEM_POINT_COST;
  const combined = applyCharismaItemDiscount(
    rawCost + EXTRA_ITEM_POINT_COST,
    charisma,
  );
  return Math.max(0, separate - combined);
}

/** Sum of the `count` largest savings (the player's best allocation). */
function sumLargestSavings(savings: readonly number[], count: number): number {
  if (count <= 0) return 0;
  return [...savings]
    .sort((a, b) => b - a)
    .slice(0, count)
    .reduce((sum, value) => sum + value, 0);
}

export function getWeaponPointCost(
  id: string,
  perkIds?: string[],
  weaponMasterRestrictedUnlocks?: string[],
  charisma = 1,
): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;
  let cost = def.pointCost;
  if (perkIds?.includes("weapon-master")) {
    if (weaponMasterRestrictedUnlocks?.includes(id)) return 0;
    cost = def.pointCost >= 3 ? 1 : 0;
  } else if (def.pointCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (def.discountFactionPerkIds.some((pid) => perkIds.includes(pid))) {
      cost = 1;
    }
  }
  return applyCharismaItemDiscount(cost, charisma);
}

export function getVehiclePointCost(id: string, charisma = 1): number {
  return applyCharismaItemDiscount(
    VEHICLES_BY_ID.get(id)?.pointCost ?? 0,
    charisma,
  );
}

/**
 * Point cost for a weapon taking signature-weapon status and faction discount
 * into account. Restricted signature weapons cost 1pt; others are free.
 */
export function getSignatureAdjustedPointCost(
  id: string,
  isSignature: boolean,
  perkIds?: string[],
  charisma = 1,
): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;

  let baseCost = def.pointCost;
  if (baseCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (def.discountFactionPerkIds.some((pid) => perkIds.includes(pid))) {
      baseCost = 1;
    }
  }

  if (isSignature) {
    if (def.pointCost >= 3) baseCost = 1;
    else baseCost = 0;
  }
  return applyCharismaItemDiscount(baseCost, charisma);
}

/** How many weapons may be marked Signature. Rank 1 = 1, rank 2 = 2. */
export function getSignatureWeaponLimit(
  perkIds?: string[],
  perkRanks?: Record<string, number>,
): number {
  if (!perkIds?.includes("signature-weapon")) return 0;
  const rank = perkRanks?.["signature-weapon"] ?? 1;
  return Math.min(2, Math.max(1, rank));
}

export function getSignatureWeapons(
  inventory: CharacterInventory,
): CharacterInventory["carried"]["weapons"] {
  return [
    ...inventory.carried.weapons,
    ...inventory.stowed.weapons,
  ].filter((w) => w.isSignatureWeapon);
}

export function getSignatureFreeAttachmentIds(
  inventory: CharacterInventory,
  perkIds?: string[],
  perkRanks?: Record<string, number>,
): Set<string> {
  const limit = getSignatureWeaponLimit(perkIds, perkRanks);
  if (limit <= 0) return new Set<string>();

  const ids = new Set<string>();
  let used = 0;
  for (const weapon of getSignatureWeapons(inventory)) {
    if (used >= limit) break;
    used += 1;
    const def = WEAPONS_BY_ID.get(weapon.weaponId);
    for (const attachmentId of def?.compatibleAttachmentIds ?? []) {
      ids.add(attachmentId);
    }
  }
  return ids;
}

export function countAllItemSlotsWithPerks(
  inventory: CharacterInventory,
  perkIds?: string[],
  perkRanks?: Record<string, number>,
): number {
  return countAllItemSlots(
    inventory,
    slotLookups,
    getSignatureFreeAttachmentIds(inventory, perkIds, perkRanks),
    perkIds?.includes("weapon-master") ?? false,
  );
}

/**
 * Free item slots: 3 at Charisma 1, plus 1 more per 2 Charisma points invested.
 */
export function getFreeItemSlots(charisma = 1): number {
  const invested = Math.max(0, charisma - 1);
  return CREATION_FREE_ITEM_SLOTS + Math.floor(invested / 2);
}

export type InventoryPointCostBreakdown = {
  /** Total point cost of the inventory. */
  total: number;
  /** Item slots used (carried + stowed). */
  usedSlots: number;
  /** Free item slots granted by Charisma. */
  freeSlots: number;
  /**
   * Per-item slot-surcharge savings (see {@link getSlotSurchargeSaving}) for
   * paid items that occupy a slot.
   */
  surchargeSavings: number[];
};

/**
 * Extra points the inventory costs beyond the free creation slots, including
 * signature-weapon, weapon-master, faction, and Charisma discounts.
 */
export function calculateInventoryPointCostWithPerks(
  inventory: CharacterInventory,
  perkIds?: string[],
  charisma = 1,
  perkRanks?: Record<string, number>,
): number {
  return getInventoryPointCostBreakdown(
    inventory,
    perkIds,
    charisma,
    perkRanks,
  ).total;
}

/**
 * Same as {@link calculateInventoryPointCostWithPerks}, plus the slot data
 * needed to price adding one more item ({@link getItemAddPointCost}).
 *
 * Paid items past the free slots pay their own (Charisma-discounted) cost
 * plus the extra-item surcharge, but the whole item still bottoms out at the
 * 1-point minimum once Charisma is high enough.
 */
export function getInventoryPointCostBreakdown(
  inventory: CharacterInventory,
  perkIds?: string[],
  charisma = 1,
  perkRanks?: Record<string, number>,
): InventoryPointCostBreakdown {
  const signatureLimit = getSignatureWeaponLimit(perkIds, perkRanks);
  const hasWeaponMaster = perkIds?.includes("weapon-master") ?? false;
  const freeAttachmentIds = getSignatureFreeAttachmentIds(
    inventory,
    perkIds,
    perkRanks,
  );
  const unlockedIds = inventory.weaponMasterRestrictedUnlocks ?? [];

  const totalSlots = countAllItemSlots(
    inventory,
    slotLookups,
    freeAttachmentIds,
    hasWeaponMaster,
  );
  const freeSlots = getFreeItemSlots(charisma);
  const overFree = Math.max(0, totalSlots - freeSlots);
  let cost = overFree * EXTRA_ITEM_POINT_COST;
  const surchargeSavings: number[] = [];

  if (hasWeaponMaster) {
    cost += new Set(unlockedIds).size;
  }

  let signatureSlotsUsed = 0;
  for (const location of ["carried", "stowed"] as const) {
    for (const w of inventory[location].weapons) {
      if (w.isPatron) continue;
      const isSignatureWeapon = !!w.isSignatureWeapon &&
        signatureSlotsUsed < signatureLimit;
      if (isSignatureWeapon) signatureSlotsUsed += 1;
      // Own cost before Charisma (Charisma 1 = no discount).
      const rawCost = isSignatureWeapon && !hasWeaponMaster
        ? getSignatureAdjustedPointCost(w.weaponId, true, perkIds)
        : getWeaponPointCost(w.weaponId, perkIds, unlockedIds);
      cost += applyCharismaItemDiscount(rawCost, charisma);
      // Weapon-master weapons and perk-granted weapons take no slot.
      if (!hasWeaponMaster && !w.perkGranted) {
        surchargeSavings.push(getSlotSurchargeSaving(rawCost, charisma));
      }
    }
    for (const v of inventory[location].vehicles ?? []) {
      if (v.isPatron) continue;
      const rawCost = getVehiclePointCost(v.vehicleId);
      cost += applyCharismaItemDiscount(rawCost, charisma);
      surchargeSavings.push(getSlotSurchargeSaving(rawCost, charisma));
    }
  }

  cost -= sumLargestSavings(surchargeSavings, overFree);

  return { total: cost, usedSlots: totalSlots, freeSlots, surchargeSavings };
}

/**
 * Points it costs to add one more item to an inventory described by
 * `breakdown`: the item's own Charisma-discounted cost, plus the extra-item
 * surcharge if it lands past the free slots, with the whole item floored at
 * the 1-point minimum. Matches the change in
 * {@link calculateInventoryPointCostWithPerks} after adding the item.
 *
 * `rawCost` is the item's own point cost before Charisma (0 for gear and
 * other free items).
 */
export function getItemAddPointCost(
  breakdown: Omit<InventoryPointCostBreakdown, "total">,
  rawCost: number,
  occupiesSlot: boolean,
  charisma = 1,
): number {
  const ownCost = applyCharismaItemDiscount(rawCost, charisma);
  if (!occupiesSlot) return ownCost;

  const { usedSlots, freeSlots, surchargeSavings } = breakdown;
  const overBefore = Math.max(0, usedSlots - freeSlots);
  const overAfter = Math.max(0, usedSlots + 1 - freeSlots);
  const savingsAfter = rawCost > 0
    ? [...surchargeSavings, getSlotSurchargeSaving(rawCost, charisma)]
    : surchargeSavings;

  const surcharge = (overAfter - overBefore) * EXTRA_ITEM_POINT_COST;
  const extraSaving = sumLargestSavings(savingsAfter, overAfter) -
    sumLargestSavings(surchargeSavings, overBefore);
  return ownCost + surcharge - extraSaving;
}

/** @deprecated Use {@link calculateInventoryPointCostWithPerks}. */
export function calculateInventoryPointCost(
  inventory: CharacterInventory,
  perkIds?: string[],
  charisma = 1,
): number {
  return calculateInventoryPointCostWithPerks(inventory, perkIds, charisma);
}
