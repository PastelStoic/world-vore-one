import type { BaseStatKey } from "../lib/character_types.ts";

interface PerkModifiers {
  baseStatBonuses?: Partial<Record<BaseStatKey, number>>;
  healthMultiplier?: number;
  carryCapacityMultiplier?: number;
  organCapacityMultiplier?: number;
}

export interface PerkDefinition {
  id: string;
  name: string;
  description: string;
  modifiers?: PerkModifiers;
}

export const PERKS: PerkDefinition[] = [
  {
    id: "tough",
    name: "Tough",
    description: "Doubles your health.",
    modifiers: {
      healthMultiplier: 2,
    },
  },
  {
    id: "unreal-capacity",
    name: "Unreal Capacity",
    description: "Triples your organ capacity.",
    modifiers: {
      organCapacityMultiplier: 3,
    },
  },
  {
    id: "predator-instinct",
    name: "Predator Instinct",
    description: "Gameplay perk: better tracking and ambush awareness.",
  },
];

export const PERKS_BY_ID = new Map(PERKS.map((perk) => [perk.id, perk]));
export const PERK_IDS = new Set(PERKS.map((perk) => perk.id));
