import type { BaseStatKey, Faction, OrganType, Race, Sex } from "../lib/character_types.ts";
import { COMBAT_PERKS } from "./perks/combat.ts";
import { VORE_PERKS } from "./perks/vore.ts";
import { SMUT_PERKS } from "./perks/smut.ts";
import { GIMMICK_PERKS } from "./perks/gimmick.ts";
import { PF_TYPE_PERKS } from "./perks/pf-type.ts";
import { FACTION_PERKS } from "./perks/faction.ts";
import { NEGATIVE_PERKS } from "./perks/negative.ts";

export type PerkCategory =
  | "combat"
  | "vore"
  | "smut"
  | "gimmick"
  | "pf-type"
  | "faction"
  | "negative";

export const PERK_CATEGORY_ORDER: PerkCategory[] = [
  "combat",
  "vore",
  "smut",
  "gimmick",
  "pf-type",
  "faction",
  "negative",
];

export const PERK_CATEGORY_LABELS: Record<PerkCategory, string> = {
  combat: "Combat",
  vore: "Vore",
  smut: "Smut",
  gimmick: "Gimmick",
  "pf-type": "PF Type",
  faction: "Faction",
  negative: "Negative",
};

interface PerkModifiers {
  baseStatBonuses?: Partial<Record<BaseStatKey, number>>;
  healthMultiplier?: number;
  carryCapacityMultiplier?: number;
  organCapacityMultiplier?: number;
  digestionResilienceMultiplier?: number;
  digestionStrengthMultiplier?: number;
  statCaps?: Partial<Record<BaseStatKey, number>>;
  /** Organs granted by this perk (e.g. tail from Lamia or Open-ended tail). */
  grantsOrgans?: OrganType[];
  /** Per-organ capacity multipliers (applied on top of the global organCapacityMultiplier). */
  organCapacityMultipliers?: Partial<Record<OrganType, number>>;
}

export interface PerkDefinition {
  id: string;
  name: string;
  category: PerkCategory;
  description: string;
  modifiers?: PerkModifiers;
  requiredRaces?: Race[];
  requiredSex?: Sex[];
  requiredFaction?: Faction | Faction[];
  lockCategory?: string;
  /** When true, this perk costs nothing and doesn't consume the first-perk freebie. */
  isFree?: boolean;
  /** Stat points granted when this perk is taken (e.g. negative perks). */
  pointsGranted?: number;
  /** When set, the player is prompted to enter custom text when taking this perk. */
  customInput?: string;
  /** Perk IDs that cannot be taken alongside this perk (mutual exclusion). */
  excludesPerks?: string[];
  /** When true, the owner can disguise this perk as a different perk on their sheet. */
  canDisguise?: boolean;
  /** When true, this perk can be taken multiple times, stacking its effects. */
  upgradable?: boolean;
  /** Maximum number of times this perk can be taken (undefined = no limit). */
  maxRanks?: number;
  /**
   * When set, the player must select one stat from this list per rank.
   * Prevents the same stat from being chosen twice across ranks of the same perk.
   */
  requiresStatChoice?: BaseStatKey[];
}

export const PERKS: PerkDefinition[] = [
  ...COMBAT_PERKS,
  ...VORE_PERKS,
  ...SMUT_PERKS,
  ...GIMMICK_PERKS,
  ...PF_TYPE_PERKS,
  ...FACTION_PERKS,
  ...NEGATIVE_PERKS,
];

export const PERKS_BY_ID = new Map(PERKS.map((perk) => [perk.id, perk]));
export const PERK_IDS = new Set(PERKS.map((perk) => perk.id));

export function validatePerkRequirements(
  race: Race,
  sex: Sex,
  perkIds: string[],
): string | null {
  const selectedByLockCategory = new Map<string, string>();

  for (const perkId of perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    if (!perk) {
      return "Invalid perk id in payload.";
    }

    if (perk.requiredRaces && !perk.requiredRaces.includes(race)) {
      return `Perk "${perk.name}" requires one of: ${
        perk.requiredRaces.join(", ")
      }.`;
    }

    if (perk.requiredSex && !perk.requiredSex.includes(sex)) {
      return `Perk "${perk.name}" requires sex: ${
        perk.requiredSex.join(" or ")
      }.`;
    }

    if (perk.lockCategory) {
      const lockedByPerkName = selectedByLockCategory.get(perk.lockCategory);
      if (lockedByPerkName && lockedByPerkName !== perk.name) {
        return `Perk "${perk.name}" cannot be combined with "${lockedByPerkName}".`;
      }
      selectedByLockCategory.set(perk.lockCategory, perk.name);
    }

    if (perk.excludesPerks) {
      for (const excludedId of perk.excludesPerks) {
        if (perkIds.includes(excludedId)) {
          const excludedPerk = PERKS_BY_ID.get(excludedId);
          return `Perk "${perk.name}" cannot be combined with "${excludedPerk?.name ?? excludedId}".`;
        }
      }
    }
  }

  return null;
}
