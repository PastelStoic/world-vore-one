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
  /** How many reload turns have been completed toward the current reload (for multi-turn reloads) */
  reloadProgress?: number;
  /**
   * Charge state for isCharge attachments (without ammoOverride) that are currently attached.
   * Keyed by attachmentId. Preserved so detaching restores the original charge data.
   */
  attachmentChargeData?: Record<string, { totalCharges: number; usedCharges: number }>;
}

/**
 * An instance of a melee weapon in a character's inventory.
 * References a premade MeleeWeaponTemplate by ID.
 */
export interface InventoryMeleeWeapon {
  /** A unique instance id (UUID) */
  instanceId: string;
  /** Reference to a MeleeWeaponTemplate.id */
  meleeWeaponId: string;
  /** Whether this is the character's Signature Weapon (from the perk) */
  isSignatureWeapon?: boolean;
  /** Extra trait chosen for a Signature melee weapon */
  signatureExtraTraitId?: string;
  /** If set, this item was granted by the named perk and cannot be removed manually */
  perkGranted?: string;
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
  /** If set, this item was granted by the named perk and cannot be removed manually */
  perkGranted?: string;
  /** Weight override from the granting perk (e.g. 0 for sapper equipment) */
  weightOverride?: number;
  /** Bulky override from the granting perk (e.g. false for sapper equipment) */
  isBulkyOverride?: boolean;
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

// Re-export calculation and parsing functions for backward compatibility
export {
  calculateInventoryPointCost,
  calculateInventoryWeight,
  countAllItemSlots,
  countCarriedItemSlots,
  hasMultipleCarriedBulkyEquipment,
} from "./inventory_calculations.ts";

export { parseInventory } from "./inventory_parsing.ts";
