// ---------------------------------------------------------------------------
// Inventory types – items a character carries or owns
// ---------------------------------------------------------------------------

/**
 * An instance of a weapon in a character's inventory.
 * Tracks current ammo, attached attachments, and spare magazines.
 */
export interface InventoryWeapon {
  /** Reference to a WeaponDefinition.id */
  weaponId: string;
  /** Current ammo in the magazine (tracked during play) */
  currentAmmo: number;
  /** Attachment IDs currently attached to this weapon */
  attachedIds: string[];
  /**
   * How many spare FULL magazines this weapon has (for magazine-fed weapons).
   * Each spare magazine = 1 weight.
   */
  magazines: number;
  /**
   * Partially-loaded spare magazines (ammo count in each).
   * Created when a partial reload ejects a magazine with rounds remaining.
   */
  partialMagazines: number[];
  /** Whether this is the character's Signature Weapon (from the perk) */
  isSignatureWeapon?: boolean;
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
  /** Whether this is the character's Signature Weapon (from the perk) */
  isSignatureWeapon?: boolean;
}

/**
 * An instance of a piece of equipment in the inventory.
 * For charge-type items, tracks total and used charges separately.
 * Each unused charge contributes weight; used charges do not.
 */
export interface InventoryEquipment {
  /** Reference to an EquipmentDefinition.id */
  equipmentId: string;
  /** Total charges purchased (set during creation / between scenes) */
  totalCharges: number;
  /** How many of those charges have been used this scene */
  usedCharges: number;
}

/**
 * An attachment owned by the character but not currently attached to a weapon.
 * For charge-based attachments, tracks total and used charges.
 */
export interface InventoryAttachment {
  /** Reference to an AttachmentDefinition.id */
  attachmentId: string;
  /** Total charges purchased (for charge-based attachments; 0 for non-charge) */
  totalCharges: number;
  /** How many of those charges have been used this scene */
  usedCharges: number;
  /**
   * Saved individual magazine ammo states when this magazine attachment is detached.
   * Preserved so re-attaching restores the exact magazine state.
   */
  savedMagazineStates?: number[];
}

/**
 * A complete inventory – the items a character has.
 * `carried` = on their person (affects weight/encumbrance).
 * `stowed` = things they own but are NOT carrying.
 *
 * Attachments on a weapon are tracked in weapon.attachedIds.
 * Loose (unattached) attachments are in their own list.
 */
export interface CharacterInventory {
  carried: {
    weapons: InventoryWeapon[];
    meleeWeapons: InventoryMeleeWeapon[];
    equipment: InventoryEquipment[];
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
    slots += 1 + w.attachedIds.length;
  }

  // Loose attachments in inventory
  for (const a of inv.carried.attachments ?? []) {
    const def = lookups?.getAttachment?.(a.attachmentId);
    if (def?.isCharge) {
      slots += a.totalCharges; // Each charge = 1 slot
    } else {
      slots += 1;
    }
  }

  return slots;
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
  const totalSlots = countCarriedItemSlots(inv, slotLookups);
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
 * Backwards-compatible: reads old `charges` field as `totalCharges`.
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
          magazines: typeof w.magazines === "number" ? w.magazines : 0,
          partialMagazines: Array.isArray(w.partialMagazines)
            ? (w.partialMagazines as unknown[]).filter((n): n is number => typeof n === "number")
            : [],
          ...(w.isSignatureWeapon ? { isSignatureWeapon: true } : {}),
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
          ...(w.isSignatureWeapon ? { isSignatureWeapon: true } : {}),
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
          totalCharges: typeof e.totalCharges === "number"
            ? e.totalCharges
            : typeof e.charges === "number"
            ? e.charges
            : 1,
          usedCharges: typeof e.usedCharges === "number" ? e.usedCharges : 0,
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
          totalCharges: typeof a.totalCharges === "number" ? a.totalCharges : 0,
          usedCharges: typeof a.usedCharges === "number" ? a.usedCharges : 0,          ...(Array.isArray(a.savedMagazineStates) ? {
            savedMagazineStates: (a.savedMagazineStates as unknown[]).filter((n): n is number => typeof n === "number"),
          } : {}),        }));
      }
    }

    return inv;
  } catch {
    return null;
  }
}
