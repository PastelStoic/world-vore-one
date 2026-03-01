// ---------------------------------------------------------------------------
// Inventory types – items a character carries or owns
// ---------------------------------------------------------------------------

/**
 * An instance of a weapon in a character's inventory.
 * Tracks current ammo, attached attachments, and free accessories count.
 */
export interface InventoryWeapon {
  /** Reference to a WeaponDefinition.id */
  weaponId: string;
  /** Current ammo in the magazine (tracked during play) */
  currentAmmo: number;
  /** Attachment IDs currently attached to this weapon */
  attachedIds: string[];
}

/**
 * An instance of a melee weapon (custom-created by the GM).
 */
export interface InventoryMeleeWeapon {
  /** A unique instance id (UUID) */
  instanceId: string;
  name: string;
  damage: number;
  weight: number;
  /** Trait IDs from MeleeTraitDefinition */
  traitIds: string[];
  description: string;
}

/**
 * An instance of a piece of equipment in the inventory.
 * For charge-type items, `charges` tracks remaining uses per scene.
 */
export interface InventoryEquipment {
  /** Reference to an EquipmentDefinition.id */
  equipmentId: string;
  /** For charge items: how many charges purchased / remaining */
  charges: number;
}

/**
 * An instance of an attachment that is NOT currently attached to a weapon.
 * (Sitting loose in inventory, ready to be attached.)
 * For charge-type attachments, `charges` tracks remaining.
 */
export interface InventoryAttachment {
  /** Reference to an AttachmentDefinition.id */
  attachmentId: string;
  /** For charge attachments: how many charges */
  charges: number;
}

/**
 * A complete inventory – the items a character has.
 * `carried` = on their person (affects weight/encumbrance).
 * `stowed` = things they own but are NOT carrying.
 */
export interface CharacterInventory {
  carried: {
    weapons: InventoryWeapon[];
    meleeWeapons: InventoryMeleeWeapon[];
    equipment: InventoryEquipment[];
    /** Loose attachments not currently on a weapon */
    attachments: InventoryAttachment[];
  };
  stowed: {
    weapons: InventoryWeapon[];
    meleeWeapons: InventoryMeleeWeapon[];
    equipment: InventoryEquipment[];
    attachments: InventoryAttachment[];
  };
}

/** How many free item slots a character gets at creation */
export const CREATION_FREE_ITEM_SLOTS = 3;

/** Cost in points per additional item beyond the free slots */
export const EXTRA_ITEM_POINT_COST = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function createEmptyInventory(): CharacterInventory {
  return {
    carried: {
      weapons: [],
      meleeWeapons: [],
      equipment: [],
      attachments: [],
    },
    stowed: {
      weapons: [],
      meleeWeapons: [],
      equipment: [],
      attachments: [],
    },
  };
}

/**
 * Count how many "item slots" the carried inventory uses.
 * Each weapon = 1 slot. Each equipment = 1 slot.
 * Attachments and melee weapons don't consume creation slots
 * (attachments modify a weapon, melee weapons are GM-granted).
 * Charge-type items: each charge = 1 slot? No – the item itself is 1 slot,
 * charges are part of it.
 */
export function countCarriedItemSlots(inv: CharacterInventory): number {
  return inv.carried.weapons.length + inv.carried.equipment.length;
}

/**
 * Calculate the total weight contributed by the carried inventory.
 */
export function calculateInventoryWeight(
  inv: CharacterInventory,
  lookups: {
    getWeapon: (id: string) => { weight: number } | undefined;
    getEquipment: (id: string) => { weight: number; isCharge?: boolean } | undefined;
    getAttachment: (id: string) => { weight: number; isCharge?: boolean } | undefined;
  },
): number {
  let total = 0;

  for (const w of inv.carried.weapons) {
    const def = lookups.getWeapon(w.weaponId);
    if (def) total += def.weight;
    // Attached attachment weight
    for (const aId of w.attachedIds) {
      const aDef = lookups.getAttachment(aId);
      if (aDef) total += aDef.weight;
    }
  }

  for (const mw of inv.carried.meleeWeapons) {
    total += mw.weight;
  }

  for (const e of inv.carried.equipment) {
    const def = lookups.getEquipment(e.equipmentId);
    if (def) {
      if (def.isCharge) {
        // Each charge has its own weight
        total += def.weight * e.charges;
      } else {
        total += def.weight;
      }
    }
  }

  for (const a of inv.carried.attachments) {
    const def = lookups.getAttachment(a.attachmentId);
    if (def) {
      if (def.isCharge) {
        total += def.weight * a.charges;
      } else {
        total += def.weight;
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
): number {
  const totalSlots = countCarriedItemSlots(inv);
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

/**
 * Parse an inventory from a JSON string (from form data).
 */
export function parseInventory(raw: string): CharacterInventory | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const inv = createEmptyInventory();

    for (const location of ["carried", "stowed"] as const) {
      const src = parsed[location];
      if (!src || typeof src !== "object") continue;

      if (Array.isArray(src.weapons)) {
        inv[location].weapons = src.weapons.filter(
          (w: unknown) =>
            w &&
            typeof w === "object" &&
            typeof (w as Record<string, unknown>).weaponId === "string",
        ).map((w: Record<string, unknown>) => ({
          weaponId: String(w.weaponId),
          currentAmmo: typeof w.currentAmmo === "number" ? w.currentAmmo : 0,
          attachedIds: Array.isArray(w.attachedIds)
            ? (w.attachedIds as unknown[]).filter((id): id is string => typeof id === "string")
            : [],
        }));
      }

      if (Array.isArray(src.meleeWeapons)) {
        inv[location].meleeWeapons = src.meleeWeapons.filter(
          (w: unknown) =>
            w &&
            typeof w === "object" &&
            typeof (w as Record<string, unknown>).instanceId === "string",
        ).map((w: Record<string, unknown>) => ({
          instanceId: String(w.instanceId),
          name: String(w.name ?? ""),
          damage: typeof w.damage === "number" ? w.damage : 0,
          weight: typeof w.weight === "number" ? w.weight : 1,
          traitIds: Array.isArray(w.traitIds)
            ? (w.traitIds as unknown[]).filter((id): id is string => typeof id === "string")
            : [],
          description: String(w.description ?? ""),
        }));
      }

      if (Array.isArray(src.equipment)) {
        inv[location].equipment = src.equipment.filter(
          (e: unknown) =>
            e &&
            typeof e === "object" &&
            typeof (e as Record<string, unknown>).equipmentId === "string",
        ).map((e: Record<string, unknown>) => ({
          equipmentId: String(e.equipmentId),
          charges: typeof e.charges === "number" ? e.charges : 1,
        }));
      }

      if (Array.isArray(src.attachments)) {
        inv[location].attachments = src.attachments.filter(
          (a: unknown) =>
            a &&
            typeof a === "object" &&
            typeof (a as Record<string, unknown>).attachmentId === "string",
        ).map((a: Record<string, unknown>) => ({
          attachmentId: String(a.attachmentId),
          charges: typeof a.charges === "number" ? a.charges : 1,
        }));
      }
    }

    return inv;
  } catch {
    return null;
  }
}
