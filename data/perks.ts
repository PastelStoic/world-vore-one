import type {
  BaseStatKey,
  Faction,
  OrganType,
  PerkOrigin,
  Race,
  Sex,
} from "@/lib/character_types.ts";
import { FACTION_DEFINITIONS_BY_ID } from "@/data/factions.ts";
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

export interface PerkGrantedEquipment {
  equipmentId: string;
  /** Override the equipment's weight (e.g. 0 for sapper) */
  weightOverride?: number;
  /** Override the equipment's bulky flag (e.g. false for sapper) */
  isBulkyOverride?: boolean;
}

export interface PerkGrantedMeleeWeapon {
  /** Reference to a MeleeWeaponTemplate.id */
  meleeWeaponId: string;
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
  /** When true, the character must be marked as a template. */
  requiresTemplate?: boolean;
  /** Active perk IDs that must already be present. */
  requiredPerkIds?: string[];
  lockCategory?: string;
  /** When true, this perk costs nothing and doesn't consume the first-perk freebie. */
  isFree?: boolean;
  /** Stat points granted when this perk is taken (e.g. negative perks). */
  pointsGranted?: number;
  /** Number of additional free perk slots this perk grants (e.g. custom tierfraun grants 2). */
  freePerks?: number;
  /** When set, the player is prompted to enter custom text when taking this perk. */
  customInput?: string;
  /** Perk IDs that cannot be taken alongside this perk (mutual exclusion). */
  excludesPerks?: string[];
  /** When true, the owner can disguise this perk as a different perk on their sheet. */
  canDisguise?: boolean;
  /**
   * When set, the player chooses a number of stat points to gain within this
   * range (e.g. rival perk lets the player pick 1–6 points). The chosen value
   * is stored in perkPointChoices on the character draft.
   */
  variablePointsGranted?: { min: number; max: number };
  /** When true, this perk can be taken multiple times, stacking its effects. */
  upgradable?: boolean;
  /** Maximum number of times this perk can be taken (undefined = no limit). */
  maxRanks?: number;
  /**
   * Perk IDs that are automatically granted when this perk is taken.
   * Included perks grant rank 1 for free, cannot be removed independently,
   * and are removed automatically when this perk is removed.
   * Any additional ranks beyond the included first rank use normal perk costs.
   */
  includesPerks?: string[];
  /**
   * When set, the player must select one stat from this list per rank.
   * Prevents the same stat from being chosen twice across ranks of the same perk.
   */
  requiresStatChoice?: BaseStatKey[];
  /** Equipment automatically granted when this perk is taken. */
  grantsEquipment?: PerkGrantedEquipment[];
  /** Melee weapons automatically granted when this perk is taken. */
  grantsMeleeWeapons?: PerkGrantedMeleeWeapon[];
  /**
   * When set, taking this perk lets the player choose one or more perks as a
   * free bonus. If the array is non-empty, only those perk IDs are offered; if
   * the field is an empty array the full perk list is shown.
   * Use `selectablePerksCount` to allow more than one choice.
   * Chosen perks are tracked in CharacterDraft.perkSelections and treated as
   * derived (free), equivalent to includesPerks but player-chosen.
   */
  selectablePerkIds?: string[];
  /** How many perks the player may choose via selectablePerkIds (default 1). */
  selectablePerksCount?: number;
  /** Maximum number of characters on one account that may own this perk. */
  maxCharactersPerAccount?: number;
  /** When true, hide this perk from the normal add-perk picker. */
  selectionOnly?: boolean;
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

function formatPerkAccountLimitError(perk: PerkDefinition): string {
  const limit = perk.maxCharactersPerAccount;
  if (!limit) {
    return `Perk "${perk.name}" cannot be taken on this account.`;
  }

  return `Perk "${perk.name}" is limited to ${limit} ${
    limit === 1 ? "character" : "characters"
  } per account.`;
}

function getLegitimateDerivedPerkIds(
  perkIds: string[],
  perkSelections?: Record<string, string[]>,
  faction?: string,
  perkOrigins?: Record<string, PerkOrigin>,
): Set<string> {
  const derived = new Set<string>();
  const queue = [...perkIds];

  if (perkSelections) {
    for (const selectedIds of Object.values(perkSelections)) {
      for (const id of selectedIds) {
        if (derived.has(id)) continue;
        derived.add(id);
        queue.push(id);
      }
    }
  }

  if (faction) {
    for (
      const id of FACTION_DEFINITIONS_BY_ID.get(faction)?.grantsPerkIds ?? []
    ) {
      if (perkOrigins?.[id] !== "faction" || derived.has(id)) continue;
      derived.add(id);
      queue.push(id);
    }
  }

  while (queue.length > 0) {
    const perkId = queue.shift();
    if (!perkId) continue;

    for (const includedId of PERKS_BY_ID.get(perkId)?.includesPerks ?? []) {
      if (derived.has(includedId)) continue;
      derived.add(includedId);
      queue.push(includedId);
    }
  }

  return derived;
}

export function validatePerkRequirements(
  race: Race,
  sex: Sex,
  perkIds: string[],
  faction?: string,
  options?: {
    isTemplate?: boolean;
    perkSelections?: Record<string, string[]>;
    perkOrigins?: Record<string, PerkOrigin>;
  },
): string | null {
  const legitimateDerivedPerkIds = getLegitimateDerivedPerkIds(
    perkIds,
    options?.perkSelections,
    faction,
    options?.perkOrigins,
  );
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

    if (perk.requiresTemplate && !options?.isTemplate) {
      return `Perk "${perk.name}" requires the character to be a template.`;
    }

    if (perk.selectionOnly && !legitimateDerivedPerkIds.has(perkId)) {
      return `Perk "${perk.name}" cannot be selected directly.`;
    }

    if (perk.requiredFaction) {
      const factions = Array.isArray(perk.requiredFaction)
        ? perk.requiredFaction
        : [perk.requiredFaction];
      if (!faction || !factions.includes(faction as typeof factions[number])) {
        return `Perk "${perk.name}" requires faction: ${
          factions.join(" or ")
        }.`;
      }
    }

    if (perk.requiredPerkIds) {
      for (const requiredPerkId of perk.requiredPerkIds) {
        if (!perkIds.includes(requiredPerkId)) {
          const requiredPerk = PERKS_BY_ID.get(requiredPerkId);
          return `Perk "${perk.name}" requires "${
            requiredPerk?.name ?? requiredPerkId
          }".`;
        }
      }
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
          return `Perk "${perk.name}" cannot be combined with "${
            excludedPerk?.name ?? excludedId
          }".`;
        }
      }
    }
  }

  return null;
}

export function getPerkAccountLimitError(
  perkIds: string[],
  perkCountsByAccount: ReadonlyMap<string, number>,
): string | null {
  for (const perkId of new Set(perkIds)) {
    const perk = PERKS_BY_ID.get(perkId);
    if (!perk?.maxCharactersPerAccount) continue;

    if (
      (perkCountsByAccount.get(perkId) ?? 0) >= perk.maxCharactersPerAccount
    ) {
      return formatPerkAccountLimitError(perk);
    }
  }

  return null;
}
