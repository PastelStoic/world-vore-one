export const RACES = ["Pilzfraun", "Pilzherr", "Tierfraun", "Tierherr", "Baseliner"] as const;
export type Race = (typeof RACES)[number];

export const FACTIONS = ["Switzerland", "Germany", "England", "America", "Mafia", "Japanese"] as const;
export type Faction = (typeof FACTIONS)[number];

export const SEX_OPTIONS = ["Female", "Male", "Futa"] as const;
export type Sex = (typeof SEX_OPTIONS)[number];

/** Returns the race options appropriate for the given sex. */
export function getRacesForSex(sex: Sex): Race[] {
  if (sex === "Male") {
    return ["Pilzherr", "Tierherr", "Baseliner"];
  }
  return ["Pilzfraun", "Tierfraun", "Baseliner"];
}

/** Check whether a race is a Pilz-type (Pilzfraun or Pilzherr). */
export function isPilzRace(race: Race): boolean {
  return race === "Pilzfraun" || race === "Pilzherr";
}

/** Check whether a race is a Tier-type (Tierfraun or Tierherr). */
export function isTierRace(race: Race): boolean {
  return race === "Tierfraun" || race === "Tierherr";
}

/** Map a race to its equivalent for the given sex (swaps gendered suffix). */
export function mapRaceForSex(race: Race, sex: Sex): Race {
  const male = sex === "Male";
  if (isPilzRace(race)) return male ? "Pilzherr" : "Pilzfraun";
  if (isTierRace(race)) return male ? "Tierherr" : "Tierfraun";
  return race;
}

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

export interface CharacterDescription {
  isTemplate: boolean;
  countryOfOrigin: string;
  faction: string;
  subfaction: string;
  role: string;
  age: string;
  dateOfBirth: string;
  sex: Sex;
  height: string;
  weight: string;
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  ethnicity: string;
  bodyType: string;
  generalAppearance: string;
  generalHealth: string;
  personality: string;
  biography: string;
}

export interface CharacterDraft {
  name: string;
  race: Race;
  description: CharacterDescription;
  baseStats: BaseStats;
  unallocatedStatPoints: number;
  perkIds: string[];
}

export interface CharacterSheet extends CharacterDraft {
  id: string;
  userId: string;
  latestSnapshotId: string;
  imageId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterSnapshot {
  snapshotId: string;
  characterId: string;
  timestamp: string;
  changelog: string;
  basedOnSnapshotId?: string;
  data: CharacterDraft;
}

export const DEFAULT_STAT_POINTS = 5;
export const PERK_COST_STAT_POINTS = 3;

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

export function createDefaultDescription(): CharacterDescription {
  return {
    isTemplate: false,
    countryOfOrigin: "",
    faction: "",
    subfaction: "",
    role: "",
    age: "",
    dateOfBirth: "",
    sex: "Male",
    height: "",
    weight: "",
    skinColor: "",
    hairColor: "",
    eyeColor: "",
    ethnicity: "",
    bodyType: "",
    generalAppearance: "",
    generalHealth: "",
    personality: "",
    biography: "",
  };
}

export function createDefaultCharacterDraft(): CharacterDraft {
  return {
    name: "",
    race: "Baseliner",
    description: createDefaultDescription(),
    baseStats: createDefaultBaseStats(),
    unallocatedStatPoints: DEFAULT_STAT_POINTS,
    perkIds: [],
  };
}
