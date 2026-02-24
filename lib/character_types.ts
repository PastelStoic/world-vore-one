export const RACES = ["Pilzfraun", "Tierfraun", "Baseliner"] as const;
export type Race = (typeof RACES)[number];

export const BASE_STAT_FIELDS = [
  { key: "strength", label: "Strength" },
  { key: "dexterity", label: "Dexterity" },
  { key: "constitution", label: "Constitution" },
  { key: "intelligence", label: "Intelligence" },
  { key: "charisma", label: "Charisma" },
  { key: "escapeTraining", label: "Escape Training" },
  { key: "digestionStrength", label: "Digestion Strength" },
  { key: "digestionResilience", label: "Digestion Resilience" },
] as const;

export type BaseStatKey = (typeof BASE_STAT_FIELDS)[number]["key"];

export interface BaseStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  charisma: number;
  escapeTraining: number;
  digestionStrength: number;
  digestionResilience: number;
}

export interface CharacterDraft {
  name: string;
  race: Race;
  description: string;
  baseStats: BaseStats;
  unallocatedStatPoints: number;
  unspentPerkPoints: number;
  perkIds: string[];
}

export interface CharacterSheet extends CharacterDraft {
  id: string;
  latestSnapshotId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterSnapshot {
  snapshotId: string;
  characterId: string;
  timestamp: string;
  changelog: string;
  data: CharacterDraft;
}

export const DEFAULT_STAT_POINTS = 5;
export const DEFAULT_PERK_POINTS = 1;

export function createDefaultBaseStats(): BaseStats {
  return {
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    charisma: 1,
    escapeTraining: 1,
    digestionStrength: 1,
    digestionResilience: 1,
  };
}

export function createDefaultCharacterDraft(): CharacterDraft {
  return {
    name: "",
    race: "Baseliner",
    description: "",
    baseStats: createDefaultBaseStats(),
    unallocatedStatPoints: DEFAULT_STAT_POINTS,
    unspentPerkPoints: DEFAULT_PERK_POINTS,
    perkIds: [],
  };
}
