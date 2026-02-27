import { PERKS_BY_ID } from "../data/perks.ts";
import type { BaseStatKey, CharacterDraft } from "./character_types.ts";

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
    multiplier *= perk?.modifiers?.[key] ?? 1;
  }

  return multiplier;
}

function getStatCap(
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
  }

  return cap;
}

function applyStatCap(value: number, cap: number | undefined): number {
  return cap !== undefined ? Math.min(value, cap) : value;
}

function applyEncumbrancePenalty(value: number, level: EncumbranceLevel) {
  return Math.max(0, value - level);
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

export function calculateEffectiveStrength(
  input: CharacterDraft,
  options: CalculationOptions = {},
) {
  const effective = input.baseStats.strength +
    getBaseStatBonus(input, "strength");
  const capped = applyStatCap(effective, getStatCap(input, "strength"));
  const level = options.encumbranceLevel ?? 0;
  return applyEncumbrancePenalty(capped, level);
}

export function calculateEffectiveDexterity(
  input: CharacterDraft,
  options: CalculationOptions = {},
) {
  const effective = input.baseStats.dexterity +
    getBaseStatBonus(input, "dexterity");
  const capped = applyStatCap(effective, getStatCap(input, "dexterity"));
  const level = options.encumbranceLevel ?? 0;
  return applyEncumbrancePenalty(capped, level);
}

export function calculateEffectiveConstitution(input: CharacterDraft) {
  const effective = input.baseStats.constitution +
    getBaseStatBonus(input, "constitution");
  return applyStatCap(effective, getStatCap(input, "constitution"));
}

export function calculateEffectiveIntelligence(input: CharacterDraft) {
  const effective = input.baseStats.intelligence +
    getBaseStatBonus(input, "intelligence");
  return applyStatCap(effective, getStatCap(input, "intelligence"));
}

export function calculateEffectiveCharisma(input: CharacterDraft) {
  const effective = input.baseStats.charisma +
    getBaseStatBonus(input, "charisma");
  return applyStatCap(effective, getStatCap(input, "charisma"));
}

export function calculateEffectiveEscapeTraining(input: CharacterDraft) {
  const effective = input.baseStats.escapeTraining +
    getBaseStatBonus(input, "escapeTraining");
  return applyStatCap(effective, getStatCap(input, "escapeTraining"));
}

export function calculateEffectiveDigestionStrength(input: CharacterDraft) {
  const base = input.baseStats.digestionStrength +
    getBaseStatBonus(input, "digestionStrength");
  const multiplier = getMultiplier(input, "digestionStrengthMultiplier");
  const effective = base * multiplier;
  return applyStatCap(effective, getStatCap(input, "digestionStrength"));
}

export function calculateEffectiveDigestionResilience(input: CharacterDraft) {
  const base = input.baseStats.digestionResilience +
    getBaseStatBonus(input, "digestionResilience");
  const multiplier = getMultiplier(input, "digestionResilienceMultiplier");
  const effective = base * multiplier;
  return applyStatCap(effective, getStatCap(input, "digestionResilience"));
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
