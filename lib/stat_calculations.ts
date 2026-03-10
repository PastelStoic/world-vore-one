import { PERKS_BY_ID } from "@/data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDraft,
  type OrganType,
} from "./character_types.ts";

export const ENCUMBRANCE_LEVELS = [
  "Unencumbered",
  "Encumbered",
  "Heavily Encumbered",
  "Immobile",
] as const;

export type EncumbranceLevel = 0 | 1 | 2 | 3;

interface CalculationOptions {
  encumbranceLevel?: EncumbranceLevel;
}

function getBaseStatBonus(input: CharacterDraft, statKey: BaseStatKey): number {
  let bonus = 0;

  for (const perkId of input.perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    bonus += perk?.modifiers?.baseStatBonuses?.[statKey] ?? 0;
  }

  return bonus;
}

function getMultiplier(
  input: CharacterDraft,
  key:
    | "healthMultiplier"
    | "carryCapacityMultiplier"
    | "organCapacityMultiplier"
    | "digestionResilienceMultiplier"
    | "digestionStrengthMultiplier",
) {
  let multiplier = 1;

  for (const perkId of input.perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    const mod = perk?.modifiers?.[key] ?? 1;
    if (mod !== 1) {
      const rank = input.perkRanks?.[perkId] ?? 1;
      multiplier *= Math.pow(mod, rank);
    }
  }

  return multiplier;
}

export function getStatCap(
  input: CharacterDraft,
  statKey: BaseStatKey,
): number | undefined {
  let cap: number | undefined;

  for (const perkId of input.perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    const perkCap = perk?.modifiers?.statCaps?.[statKey];
    if (perkCap !== undefined) {
      cap = cap === undefined ? perkCap : Math.min(cap, perkCap);
    }
    // Perks with requiresStatChoice lock each chosen stat at 1
    if (perk?.requiresStatChoice) {
      const choices = input.perkStatChoices?.[perkId] ?? [];
      if ((choices as string[]).includes(statKey)) {
        cap = cap === undefined ? 1 : Math.min(cap, 1);
      }
    }
  }

  return cap;
}

function applyStatCap(value: number, cap: number | undefined): number {
  return cap !== undefined ? Math.min(value, cap) : value;
}

function applyEncumbrancePenalty(value: number, level: EncumbranceLevel) {
  return Math.max(1, value - level);
}

export function calculateEncumbranceLevel(
  carryCapacity: number,
  carriedWeight: number,
): EncumbranceLevel {
  if (carryCapacity <= 0) {
    return carriedWeight > 0 ? 3 : 0;
  }

  if (carriedWeight > carryCapacity * 3) {
    return 3;
  }

  if (carriedWeight > carryCapacity * 2) {
    return 2;
  }

  if (carriedWeight > carryCapacity) {
    return 1;
  }

  return 0;
}

export function getEncumbranceLabel(level: EncumbranceLevel) {
  return ENCUMBRANCE_LEVELS[level];
}

// ---------------------------------------------------------------------------
// Per-stat configuration for the parameterized calculator
// ---------------------------------------------------------------------------

type MultiplierKey =
  | "digestionStrengthMultiplier"
  | "digestionResilienceMultiplier";

interface StatCalcConfig {
  applyEncumbrance: boolean;
  clampToOne: boolean;
  multiplierKey?: MultiplierKey;
}

const STAT_CONFIG: Record<BaseStatKey, StatCalcConfig> = {
  strength: { applyEncumbrance: true, clampToOne: false },
  dexterity: { applyEncumbrance: true, clampToOne: false },
  constitution: { applyEncumbrance: false, clampToOne: true },
  intelligence: { applyEncumbrance: false, clampToOne: true },
  charisma: { applyEncumbrance: false, clampToOne: true },
  escapeTraining: { applyEncumbrance: false, clampToOne: true },
  digestionStrength: {
    applyEncumbrance: false,
    clampToOne: false,
    multiplierKey: "digestionStrengthMultiplier",
  },
  digestionResilience: {
    applyEncumbrance: false,
    clampToOne: true,
    multiplierKey: "digestionResilienceMultiplier",
  },
};

/**
 * Calculate the effective value of any base stat, applying bonuses,
 * multipliers, caps, and encumbrance as appropriate for that stat.
 */
export function calculateEffectiveStat(
  input: CharacterDraft,
  statKey: BaseStatKey,
  options: CalculationOptions = {},
): number {
  const config = STAT_CONFIG[statKey];
  let effective = input.baseStats[statKey] + getBaseStatBonus(input, statKey);

  if (config.multiplierKey) {
    effective *= getMultiplier(input, config.multiplierKey);
  }

  effective = applyStatCap(effective, getStatCap(input, statKey));

  if (config.clampToOne) {
    effective = Math.max(1, effective);
  }

  if (config.applyEncumbrance) {
    effective = applyEncumbrancePenalty(
      effective,
      options.encumbranceLevel ?? 0,
    );
  }

  return effective;
}

/**
 * Calculate all effective stats at once. Convenience for building the
 * effectiveByStat record used across the editor and viewer.
 */
export function calculateAllEffectiveStats(
  input: CharacterDraft,
  options: CalculationOptions = {},
): Record<BaseStatKey, number> {
  const result = {} as Record<BaseStatKey, number>;
  for (const { key } of BASE_STAT_FIELDS) {
    result[key] = calculateEffectiveStat(input, key, options);
  }
  return result;
}

// Backward-compatible named exports

export function calculateEffectiveStrength(
  input: CharacterDraft,
  options: CalculationOptions = {},
) {
  return calculateEffectiveStat(input, "strength", options);
}

export function calculateEffectiveDexterity(
  input: CharacterDraft,
  options: CalculationOptions = {},
) {
  return calculateEffectiveStat(input, "dexterity", options);
}

export function calculateEffectiveConstitution(input: CharacterDraft) {
  return calculateEffectiveStat(input, "constitution");
}

export function calculateEffectiveIntelligence(input: CharacterDraft) {
  return calculateEffectiveStat(input, "intelligence");
}

export function calculateEffectiveCharisma(input: CharacterDraft) {
  return calculateEffectiveStat(input, "charisma");
}

export function calculateEffectiveEscapeTraining(input: CharacterDraft) {
  return calculateEffectiveStat(input, "escapeTraining");
}

export function calculateEffectiveDigestionStrength(input: CharacterDraft) {
  return calculateEffectiveStat(input, "digestionStrength");
}

export function calculateEffectiveDigestionResilience(input: CharacterDraft) {
  return calculateEffectiveStat(input, "digestionResilience");
}

export function calculateBaseHealth(input: CharacterDraft) {
  return input.baseStats.constitution;
}

export function calculateEffectiveHealth(input: CharacterDraft) {
  const base = calculateEffectiveConstitution(input);
  const multiplier = getMultiplier(input, "healthMultiplier");
  return base * multiplier;
}

export function calculateBaseCarryCapacity(input: CharacterDraft) {
  return input.baseStats.strength + 2;
}

export function calculateEffectiveCarryCapacity(input: CharacterDraft) {
  const base = calculateEffectiveStrength(input) + 2;
  const multiplier = getMultiplier(input, "carryCapacityMultiplier");
  return base * multiplier;
}

export function calculateBaseOrganCapacity() {
  return 2;
}

export function calculateEffectiveOrganCapacity(input: CharacterDraft) {
  const base = calculateBaseOrganCapacity();
  const multiplier = getMultiplier(input, "organCapacityMultiplier");
  return base * multiplier;
}

/**
 * Returns the list of organs a character has based on race, sex, and perks.
 * Baseliners have no organs. Females get stomach/breasts/womb, males get
 * stomach/testicles, futas get all four. Perks may grant additional organs (e.g. tail).
 */
export function getCharacterOrgans(input: CharacterDraft): OrganType[] {
  if (input.race === "Baseliner") return [];

  const sex = input.description.sex;
  const organs: OrganType[] = ["stomach"];

  if (sex === "Female" || sex === "Futa") {
    organs.push("breasts", "womb");
  }

  if (sex === "Male" || sex === "Futa") {
    organs.push("testicles");
  }

  for (const perkId of input.perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    if (perk?.modifiers?.grantsOrgans) {
      for (const organ of perk.modifiers.grantsOrgans) {
        if (!organs.includes(organ)) {
          organs.push(organ);
        }
      }
    }
  }

  return organs;
}

/**
 * Calculates the effective capacity of each organ the character possesses.
 * Each organ starts at base capacity 2, is multiplied by the global
 * organCapacityMultiplier (from "Unreal capacity"), then by any per-organ
 * multipliers (e.g. Baby Factory gives womb 27x, Lamia gives tail 3x).
 */
export function calculateOrganCapacities(
  input: CharacterDraft,
): { organ: OrganType; capacity: number }[] {
  const organs = getCharacterOrgans(input);
  const base = calculateBaseOrganCapacity();
  const globalMultiplier = getMultiplier(input, "organCapacityMultiplier");

  return organs.map((organ) => {
    let organMultiplier = 1;

    for (const perkId of input.perkIds) {
      const perk = PERKS_BY_ID.get(perkId);
      organMultiplier *= perk?.modifiers?.organCapacityMultipliers?.[organ] ??
        1;
    }

    return { organ, capacity: base * globalMultiplier * organMultiplier };
  });
}
