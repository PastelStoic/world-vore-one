// ---------------------------------------------------------------------------
// Shared types and helpers for inventory components
// ---------------------------------------------------------------------------

import {
  ATTACHMENTS_BY_ID,
  EQUIPMENT_BY_ID,
  MELEE_WEAPONS_BY_ID,
  WEAPONS,
  WEAPONS_BY_ID,
} from "@/data/equipment.ts";
import { LONG_GUN_ATTACHMENTS } from "@/data/weapons.ts";
import type {
  CharacterInventory,
  InventoryAttachment,
  InventoryWeapon,
} from "@/lib/inventory_types.ts";
import {
  countAllItemSlots,
  CREATION_FREE_ITEM_SLOTS,
  EXTRA_ITEM_POINT_COST,
} from "@/lib/inventory_types.ts";

export type InventoryLocation = "carried" | "stowed";

// ── Lookups for weight / slot calculation ──────────────────────────────────

export const weightLookups = {
  getWeapon: (id: string) => WEAPONS_BY_ID.get(id),
  getMeleeWeapon: (id: string) => MELEE_WEAPONS_BY_ID.get(id),
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

export const slotLookups = {
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

// ── Weapon point cost helpers ─────────────────────────────────────────────

export function getWeaponPointCost(
  id: string,
  perkIds?: string[],
  weaponMasterRestrictedUnlocks?: string[],
): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;
  // Weapon Master: non-restricted weapons are free, restricted cost 1pt
  if (perkIds?.includes("weapon-master")) {
    if (weaponMasterRestrictedUnlocks?.includes(id)) return 0;
    if (def.pointCost >= 3) return 1; // Restricted still costs 1pt
    return 0; // Everything else is free from the armory
  }
  // Apply faction discount: restricted weapons cost 1pt if character has a matching faction perk
  if (def.pointCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (
      def.discountFactionPerkIds.some((pid: string) => perkIds.includes(pid))
    ) {
      return 1;
    }
  }
  return def.pointCost;
}

/**
 * Get the point cost for a weapon taking signature weapon status and faction discount into account.
 * Restricted signature weapons cost 1pt instead of 3pt; other signature weapons are free.
 */
export function getSignatureAdjustedPointCost(
  id: string,
  isSignature: boolean,
  perkIds?: string[],
): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;

  // Apply faction discount first
  let baseCost = def.pointCost;
  if (baseCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (
      def.discountFactionPerkIds.some((pid: string) => perkIds.includes(pid))
    ) {
      baseCost = 1;
    }
  }

  if (!isSignature) return baseCost;
  // "If you wish to pick a ranged weapon with the 'restricted' gimmick, you must still pay 1 point.
  //  Every other weapon is free."
  if (def.pointCost >= 3) return 1; // Originally restricted → still 1pt as signature
  return 0;
}

/** Set of attachment IDs that appear in only one weapon's compatibleAttachmentIds. */
const _UNIQUE_ATTACHMENT_IDS: Set<string> = (() => {
  const counts = new Map<string, number>();
  for (const w of WEAPONS) {
    for (const aId of w.compatibleAttachmentIds) {
      counts.set(aId, (counts.get(aId) ?? 0) + 1);
    }
  }
  const unique = new Set<string>();
  for (const [id, count] of counts) {
    if (count === 1) unique.add(id);
  }
  return unique;
})();

export function getSignatureFreeAttachmentIds(
  inventory: CharacterInventory,
  perkIds?: string[],
): Set<string> {
  if (!perkIds?.includes("signature-weapon")) return new Set<string>();

  const signatureWeapon = [
    ...inventory.carried.weapons,
    ...inventory.stowed.weapons,
  ]
    .find((w) => w.isSignatureWeapon);
  if (!signatureWeapon) return new Set<string>();

  const def = WEAPONS_BY_ID.get(signatureWeapon.weaponId);
  if (!def) return new Set<string>();

  // Only attachments unique to this weapon (not compatible with any other) are free
  return new Set(
    def.compatibleAttachmentIds.filter((aId) =>
      !LONG_GUN_ATTACHMENTS.includes(aId)
    ),
  );
}

/** Check if an attachment is a signature-weapon perk attachment for the given weapon.
 * All compatible attachments except generic long-gun attachments (bayonet, scope, bipod,
 * strong-sling) are granted free by the perk.
 */
export function isSignatureUniqueAttachment(
  weaponDef: { compatibleAttachmentIds: string[] } | undefined,
  attachmentId: string,
): boolean {
  return !!weaponDef &&
    weaponDef.compatibleAttachmentIds.includes(attachmentId) &&
    !LONG_GUN_ATTACHMENTS.includes(attachmentId);
}

function mergedFreeAttachmentIds(
  inventory: CharacterInventory,
  perkIds?: string[],
): Set<string> {
  // Only signature-weapon attachment IDs go here; isFree attachments are
  // already skipped directly inside the slot-counting loops.
  return getSignatureFreeAttachmentIds(inventory, perkIds);
}

export function countAllItemSlotsWithPerks(
  inventory: CharacterInventory,
  perkIds?: string[],
): number {
  return countAllItemSlots(
    inventory,
    slotLookups,
    mergedFreeAttachmentIds(inventory, perkIds),
  );
}

export function calculateInventoryPointCostWithPerks(
  inventory: CharacterInventory,
  perkIds?: string[],
): number {
  const hasSignatureWeaponPerk = perkIds?.includes("signature-weapon") ??
    false;
  const hasWeaponMaster = perkIds?.includes("weapon-master") ?? false;
  const freeAttachmentIds = mergedFreeAttachmentIds(inventory, perkIds);
  const unlockedIds = inventory.weaponMasterRestrictedUnlocks ?? [];

  const totalSlots = countAllItemSlots(
    inventory,
    slotLookups,
    freeAttachmentIds,
  );
  const overFree = Math.max(0, totalSlots - CREATION_FREE_ITEM_SLOTS);
  let cost = overFree * EXTRA_ITEM_POINT_COST;

  if (hasWeaponMaster) {
    const unlocks = new Set(unlockedIds);
    cost += unlocks.size;
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
  }

  return cost;
}

// ── Drum/magazine eject helper ──────────────────────────────────────────────

/**
 * Convert a weapon's magazine state back into an InventoryAttachment with
 * charge data and saved magazine states. Used by both detachFromWeapon and
 * ejectDrumAndReload to avoid duplicating the magazine-to-charge logic.
 *
 * Mutates the weapon in place: clears magazines, partialMagazines, and
 * attachmentChargeData for the given attachment.
 */
export function convertMagazinesToAttachment(
  weapon: InventoryWeapon,
  attachmentId: string,
): InventoryAttachment {
  const attDef = ATTACHMENTS_BY_ID.get(attachmentId);
  const ammoOverride = attDef?.ammoOverride ?? 0;
  const partials = weapon.partialMagazines ?? [];

  // Build array of all magazine ammo states
  const savedStates: number[] = [];
  for (let i = 0; i < weapon.magazines; i++) {
    savedStates.push(ammoOverride);
  }
  for (const p of partials) {
    savedStates.push(p);
  }
  if (weapon.currentAmmo > 0) {
    savedStates.push(weapon.currentAmmo);
  }

  // Restore the original totalCharges so spending magazines only raises
  // usedCharges rather than reducing totalCharges
  const savedChargeData = weapon.attachmentChargeData?.[attachmentId];
  const originalTotalCharges = savedChargeData?.totalCharges ??
    savedStates.length;
  const usedCharges = Math.max(0, originalTotalCharges - savedStates.length);

  // Clean up weapon state
  if (weapon.attachmentChargeData) {
    delete weapon.attachmentChargeData[attachmentId];
  }
  weapon.magazines = 0;
  weapon.partialMagazines = [];

  return {
    attachmentId,
    totalCharges: originalTotalCharges,
    usedCharges,
    savedMagazineStates: savedStates,
  };
}

// ── Attachment prerequisite helpers ────────────────────────────────────────

export function getMissingRequiredAttachmentIds(
  attachmentId: string,
  attachedIds: readonly string[],
): string[] {
  const def = ATTACHMENTS_BY_ID.get(attachmentId);
  if (!def?.requiresAttachmentIds || def.requiresAttachmentIds.length === 0) {
    return [];
  }
  return def.requiresAttachmentIds.filter((requiredId) =>
    !attachedIds.includes(requiredId)
  );
}

export function getConflictingAttachmentIds(
  attachmentId: string,
  attachedIds: readonly string[],
): string[] {
  const def = ATTACHMENTS_BY_ID.get(attachmentId);
  const conflicts: string[] = [];
  // Check this attachment's excludes list
  if (def?.excludesAttachmentIds) {
    for (const excId of def.excludesAttachmentIds) {
      if (attachedIds.includes(excId)) conflicts.push(excId);
    }
  }
  // Check if any already-attached attachment excludes this one
  for (const otherId of attachedIds) {
    if (conflicts.includes(otherId)) continue;
    const otherDef = ATTACHMENTS_BY_ID.get(otherId);
    if (otherDef?.excludesAttachmentIds?.includes(attachmentId)) {
      conflicts.push(otherId);
    }
  }
  return conflicts;
}

export function canAttachToWeapon(
  attachmentId: string,
  attachedIds: readonly string[],
): boolean {
  return getMissingRequiredAttachmentIds(attachmentId, attachedIds).length ===
      0 &&
    getConflictingAttachmentIds(attachmentId, attachedIds).length === 0;
}

export function getDependentAttachmentIds(
  attachmentId: string,
  attachedIds: readonly string[],
): string[] {
  return attachedIds.filter((otherAttachmentId) => {
    if (otherAttachmentId === attachmentId) return false;
    const otherDef = ATTACHMENTS_BY_ID.get(otherAttachmentId);
    return otherDef?.requiresAttachmentIds?.includes(attachmentId) ?? false;
  });
}
