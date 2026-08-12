// ---------------------------------------------------------------------------
// Shared types and helpers for inventory components
// ---------------------------------------------------------------------------

import { ATTACHMENTS_BY_ID } from "@/data/equipment.ts";
import type { WeaponDefinition } from "@/data/equipment_types.ts";
import type {
  InventoryAttachment,
  InventoryWeapon,
} from "@/lib/inventory_types.ts";
import {
  calculateInventoryPointCostWithPerks,
  countAllItemSlotsWithPerks,
  getSignatureAdjustedPointCost,
  getSignatureFreeAttachmentIds,
  getVehiclePointCost,
  getWeaponPointCost,
  slotLookups,
  weightLookups,
} from "@/lib/inventory_calculations.ts";

export type InventoryLocation = "carried" | "stowed";

export {
  calculateInventoryPointCostWithPerks,
  countAllItemSlotsWithPerks,
  getSignatureAdjustedPointCost,
  getSignatureFreeAttachmentIds,
  getVehiclePointCost,
  getWeaponPointCost,
  slotLookups,
  weightLookups,
};

export function getEffectiveWeaponTraitIds(
  weaponDef: Pick<WeaponDefinition, "traitIds">,
  attachedIds: readonly string[],
): string[] {
  const baseTraitIds = new Set(weaponDef.traitIds);
  const addedTraitIds = new Set<string>();
  const removedTraitIds = new Set<string>();

  for (const attachmentId of attachedIds) {
    const attachmentDef = ATTACHMENTS_BY_ID.get(attachmentId);
    for (const traitId of attachmentDef?.addsTraitIds ?? []) {
      addedTraitIds.add(traitId);
    }
    for (const traitId of attachmentDef?.removesTraitIds ?? []) {
      removedTraitIds.add(traitId);
    }
  }

  const effectiveBaseTraitIds = weaponDef.traitIds.filter((traitId) =>
    !removedTraitIds.has(traitId)
  );
  const effectiveAddedTraitIds = [...addedTraitIds]
    .filter((traitId) =>
      !removedTraitIds.has(traitId) && !baseTraitIds.has(traitId)
    )
    .sort();

  return [...effectiveBaseTraitIds, ...effectiveAddedTraitIds];
}

/** True when the signature-weapon perk grants a free copy of this attachment. */
export function isSignatureFreeAttachment(
  weaponDef: { compatibleAttachmentIds: string[] } | undefined,
  attachmentId: string,
): boolean {
  return !!weaponDef &&
    weaponDef.compatibleAttachmentIds.includes(attachmentId);
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
