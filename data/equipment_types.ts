// ---------------------------------------------------------------------------
// Equipment type definitions – shared across all equipment data modules
// ---------------------------------------------------------------------------

// ── Nation constants ────────────────────────────────────────────────────────

export const NATIONS = [
  "Any",
  "Civilian",
  "Britain",
  "France",
  "Germany",
  "United States",
  "Japan",
  "Russia",
  "Austria-Hungary",
  "Italy",
  "Switzerland",
] as const;

export type Nation = (typeof NATIONS)[number];

// ── Weapon types ────────────────────────────────────────────────────────────

export type WeaponKind =
  | "bolt-action-rifle"
  | "semiautomatic-rifle"
  | "assault-rifle"
  | "smg"
  | "light-machinegun"
  | "heavy-machinegun"
  | "shotgun"
  | "semiautomatic-shotgun"
  | "pump-action-shotgun"
  | "double-action-revolver"
  | "single-action-revolver"
  | "semiautomatic-pistol"
  | "black-powder-revolver"
  | "flamethrower"
  | "flintlock-musket"
  | "bow"
  | "crossbow"
  | "melee";

export interface WeaponDefinition {
  id: string;
  name: string;
  type: string;
  kind: WeaponKind;
  nation: Nation;
  damage: string;
  ammo: number;
  rateOfFire: number;
  weight: number;
  /** Extra point cost beyond the free 3-item budget (0 = free slot, 1 = costs 1 extra point, 3 = restricted) */
  pointCost: number;
  /** Trait IDs from weapon_traits.ts applied to this weapon */
  traitIds: string[];
  /** IDs of attachments compatible with this weapon */
  compatibleAttachmentIds: string[];
  /** IDs of free items that come with this weapon (e.g. Lewis magazines) */
  freeAccessoryIds?: string[];
  /** Faction perk IDs that grant a discount (restricted → 1pt instead of 3pt) */
  discountFactionPerkIds?: string[];
  /** Whether this weapon REQUIRES magazines to reload (cannot reload without one) */
  requiresMagazines?: boolean;
  /** Whether this weapon reloads one round at a time (tubular magazines, cylinders, etc.) */
  reloadsIndividually?: boolean;
  /** How many turns it takes to reload (default: 1). If > 1, reload button must be pressed that many times. */
  reloadTurns?: number;
}

// ── Attachment types ────────────────────────────────────────────────────────

export interface AttachmentDefinition {
  id: string;
  name: string;
  /** Which weapon(s) or weapon class this attaches to (e.g. "Long guns", "Lee-Enfield") */
  appliesTo: string;
  /** Nation this attachment belongs to (for filtering) */
  nation: Nation;
  weight: number;
  description: string;
  /** Whether buying this attachment uses the charge system */
  isCharge?: boolean;
  /** If set, overrides the weapon's base ammo capacity when this attachment is active */
  ammoOverride?: number;
  /** If set, overrides the weapon's base weight when this attachment is active */
  weightOverride?: number;
  /** If true, the weapon REQUIRES magazines to reload while this attachment is active */
  requiresMagazines?: boolean;
  /** If set, overrides the weapon's reloadTurns when this attachment is active */
  reloadTurnsOverride?: number;
  /** If true, the weapon reloads one round at a time while this attachment is active */
  reloadsIndividually?: boolean;
  /** If set, overrides the weapon's base damage when this attachment is active */
  damageOverride?: number;
  /** If set, adds this value to the weapon's rate of fire when this attachment is active */
  rateOfFireBonus?: number;
  /** Trait IDs added to the weapon's trait list while this attachment is equipped */
  addsTraitIds?: string[];
  /** Trait IDs removed from the weapon's trait list while this attachment is equipped */
  removesTraitIds?: string[];
  /** IDs of attachments that must already be attached before this can be attached */
  requiresAttachmentIds?: string[];
  /** IDs of attachments that cannot be attached at the same time as this one */
  excludesAttachmentIds?: string[];
  /** If true, this attachment does not cost an item slot (always free) */
  isFree?: boolean;
}

// ── General equipment ───────────────────────────────────────────────────────

export interface EquipmentDefinition {
  id: string;
  name: string;
  weight: number;
  description: string;
  /** Equipment that uses charges (grenades, flares, etc.) */
  isCharge?: boolean;
  /** Equipment that is bulky (cannot stack with other bulky kits) */
  isBulky?: boolean;
  /**
   * When true, this item is hidden from the purchase picker and the wiki.
   * It can only be obtained by perk grants.
   */
  isGhost?: boolean;
  /**
   * ID of a ghost version of this item (set on the regular purchasable item).
   * If the player already has the ghost version in their inventory, the regular
   * version is excluded from the purchase picker.
   */
  ghostVersionId?: string;
}

// ── Weapon traits (gun / ranged) ────────────────────────────────────────────

export interface WeaponTraitDefinition {
  id: string;
  name: string;
  description: string;
}

// ── Melee weapon traits ─────────────────────────────────────────────────────

export interface MeleeTraitDefinition {
  id: string;
  name: string;
  description: string;
}

// ── Melee weapon template ───────────────────────────────────────────────────

export interface MeleeWeaponTemplate {
  id: string;
  name: string;
  damage: number;
  weight: number;
  /** Trait IDs applied to this melee weapon */
  traitIds: string[];
  description: string;
}

// ── Free accessories ────────────────────────────────────────────────────────

export interface FreeAccessoryDefinition {
  id: string;
  name: string;
  weight: number;
  ammo: number;
  description: string;
}
