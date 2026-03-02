// ---------------------------------------------------------------------------
// Inventory calculation helpers
// ---------------------------------------------------------------------------

import type { CharacterInventory } from "./inventory_types.ts";
import { CREATION_FREE_ITEM_SLOTS, EXTRA_ITEM_POINT_COST } from "./inventory_types.ts";

/**
 * Count how many "item slots" the carried inventory uses.
 * Each weapon = 1 slot. Each attachment on a weapon = 1 slot.
 * Each non-charge equipment = 1 slot; each charge of a charge-type equipment = 1 slot.
 * Each loose (unattached) attachment = 1 slot (charge-based: each charge = 1 slot).
 * Melee weapons are GM-granted and don't consume creation slots.
 */
export function countCarriedItemSlots(
  inv: CharacterInventory,
  lookups?: {
    getEquipment?: (id: string) => { isCharge?: boolean } | undefined;
    getAttachment?: (id: string) => { isCharge?: boolean } | undefined;
  },
): number {
  let slots = 0;

  for (const e of inv.carried.equipment) {
    const def = lookups?.getEquipment?.(e.equipmentId);
    if (def?.isCharge) {
      slots += e.totalCharges; // Each charge = 1 slot
    } else {
      slots += 1;
    }
  }

  for (const w of inv.carried.weapons) {
    slots += 1; // The weapon itself is 1 slot
    for (const attachmentId of w.attachedIds) {
      const def = lookups?.getAttachment?.(attachmentId);
      if (def?.isCharge) {
        // Charge attachments consume one slot per purchased charge when loose,
        // but while attached we track only the installed instance.
        slots += 1;
      } else {
        slots += 1;
      }
    }
  }

  for (const a of inv.carried.attachments ?? []) {
    const def = lookups?.getAttachment?.(a.attachmentId);
    if (def?.isCharge) {
      slots += a.totalCharges;
    } else {
      slots += 1;
    }
  }

  return slots;
}

/**
 * Count item slots across BOTH carried AND stowed inventory.
 * Used for the shared free-item budget (3 free slots total, regardless of location).
 */
export function countAllItemSlots(
  inv: CharacterInventory,
  lookups?: {
    getEquipment?: (id: string) => { isCharge?: boolean } | undefined;
    getAttachment?: (id: string) => { isCharge?: boolean } | undefined;
  },
): number {
  let slots = countCarriedItemSlots(inv, lookups);

  // Count stowed items the same way as carried
  for (const e of inv.stowed.equipment) {
    const def = lookups?.getEquipment?.(e.equipmentId);
    if (def?.isCharge) {
      slots += e.totalCharges;
    } else {
      slots += 1;
    }
  }

  for (const w of inv.stowed.weapons) {
    slots += 1;
    for (const _attachmentId of w.attachedIds) {
      slots += 1;
    }
  }

  for (const a of inv.stowed.attachments ?? []) {
    const def = lookups?.getAttachment?.(a.attachmentId);
    if (def?.isCharge) {
      slots += a.totalCharges;
    } else {
      slots += 1;
    }
  }

  return slots;
}

export function hasMultipleCarriedBulkyEquipment(
  inv: CharacterInventory,
  getEquipment: (id: string) => { isBulky?: boolean } | undefined,
): boolean {
  let bulkyCount = 0;
  for (const eq of inv.carried.equipment) {
    if (getEquipment(eq.equipmentId)?.isBulky) {
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
    total += mw.weight;
  }

  for (const e of inv.carried.equipment) {
    const def = lookups.getEquipment(e.equipmentId);
    if (def) {
      if (def.isCharge) {
        // Only remaining (unused) charges contribute weight
        const remaining = Math.max(0, e.totalCharges - e.usedCharges);
        total += def.weight * remaining;
      } else {
        total += def.weight;
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

/**
 * Calculate how many extra points the inventory costs beyond the free creation slots.
 * Each weapon also has its own pointCost (for restricted/expensive weapons).
 */
export function calculateInventoryPointCost(
  inv: CharacterInventory,
  getWeaponPointCost: (id: string) => number,
  slotLookups?: {
    getEquipment?: (id: string) => { isCharge?: boolean } | undefined;
    getAttachment?: (id: string) => { isCharge?: boolean } | undefined;
  },
): number {
  const totalSlots = countAllItemSlots(inv, slotLookups);
  const overFree = Math.max(0, totalSlots - CREATION_FREE_ITEM_SLOTS);

  // Slot cost
  let cost = overFree * EXTRA_ITEM_POINT_COST;

  // Weapon-specific costs (restricted weapons etc.)
  for (const w of inv.carried.weapons) {
    cost += getWeaponPointCost(w.weaponId);
  }
  for (const w of inv.stowed.weapons) {
    cost += getWeaponPointCost(w.weaponId);
  }

  return cost;
}
