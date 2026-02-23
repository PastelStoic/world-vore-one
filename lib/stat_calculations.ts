import { PERKS_BY_ID } from "../data/perks.ts";
import type { BaseStatKey, CharacterDraft } from "./character_types.ts";

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
    | "organCapacityMultiplier",
) {
  let multiplier = 1;

  for (const perkId of input.perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    multiplier *= perk?.modifiers?.[key] ?? 1;
  }

  return multiplier;
}

export function calculateEffectiveStrength(input: CharacterDraft) {
  return input.baseStats.strength + getBaseStatBonus(input, "strength");
}

export function calculateEffectiveDexterity(input: CharacterDraft) {
  return input.baseStats.dexterity + getBaseStatBonus(input, "dexterity");
}

export function calculateEffectiveConstitution(input: CharacterDraft) {
  return input.baseStats.constitution + getBaseStatBonus(input, "constitution");
}

export function calculateEffectiveIntelligence(input: CharacterDraft) {
  return input.baseStats.intelligence + getBaseStatBonus(input, "intelligence");
}

export function calculateEffectiveCharisma(input: CharacterDraft) {
  return input.baseStats.charisma + getBaseStatBonus(input, "charisma");
}

export function calculateEffectiveEscapeTraining(input: CharacterDraft) {
  return input.baseStats.escapeTraining +
    getBaseStatBonus(input, "escapeTraining");
}

export function calculateEffectiveDigestionStrength(input: CharacterDraft) {
  return input.baseStats.digestionStrength +
    getBaseStatBonus(input, "digestionStrength");
}

export function calculateEffectiveDigestionResilience(input: CharacterDraft) {
  return input.baseStats.digestionResilience +
    getBaseStatBonus(input, "digestionResilience");
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
