// ---------------------------------------------------------------------------
// Shared types and helpers for inventory components
// ---------------------------------------------------------------------------

import {
  ATTACHMENTS_BY_ID,
  EQUIPMENT_BY_ID,
  MELEE_WEAPONS_BY_ID,
  WEAPONS_BY_ID,
} from "@/data/equipment.ts";
import type {
  InventoryAttachment,
  InventoryWeapon,
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

export function getWeaponPointCost(id: string, perkIds?: string[]): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;
  // Weapon Master: non-restricted weapons are free, restricted cost 1pt
  if (perkIds?.includes("weapon-master")) {
    if (def.pointCost >= 3) return 1; // Restricted still costs 1pt
    return 0; // Everything else is free from the armory
  }
  // Apply faction discount: restricted weapons cost 1pt if character has a matching faction perk
  if (def.pointCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (def.discountFactionPerkIds.some((pid: string) => perkIds.includes(pid))) {
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
    if (def.discountFactionPerkIds.some((pid: string) => perkIds.includes(pid))) {
      baseCost = 1;
    }
  }

  if (!isSignature) return baseCost;
  // "If you wish to pick a ranged weapon with the 'restricted' gimmick, you must still pay 1 point.
  //  Every other weapon is free."
  if (def.pointCost >= 3) return 1; // Originally restricted → still 1pt as signature
  return 0;
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
