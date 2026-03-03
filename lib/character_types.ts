import type { CharacterInventory } from "./inventory_types.ts";
import { createEmptyInventory } from "./inventory_types.ts";

export const RACES = [
  "Pilzfraun",
  "Pilzherr",
  "Tierfraun",
  "Tierherr",
  "Baseliner",
] as const;
export type Race = (typeof RACES)[number];

export const ORGAN_TYPES = [
  "stomach",
  "breasts",
  "womb",
  "testicles",
  "tail",
] as const;
export type OrganType = (typeof ORGAN_TYPES)[number];

export const ORGAN_LABELS: Record<OrganType, string> = {
  stomach: "Stomach",
  breasts: "Breasts",
  womb: "Womb",
  testicles: "Testicles",
  tail: "Tail",
};

export const FACTIONS = [
  "German Imperial Army",
  "Austro-Hungarian Army",
  "Cemaat Janissaries",
  "New Ottoman Army",
  "The 7th Western Army",
  "King's Royal Army",
  "German East African Army",
  "German West African Army",
  "German Eastern European Garrison",
  "Austro-Hungarian Eastern European Garrison",
  "British Expeditionary Force (BEF)",
  "Canadian Expeditionary Force (CEF)",
  "American Expeditionary Force (AEF)",
  "Harlem Hellfighters",
  "Royal Berkshire Regiment",
  "French Standing Army",
  "British Eastern African Army",
  "British Western African Army",
  "French Eastern African Army",
  "French Western African Army",
  "The 21st Red Rifles",
  "Standard White Army",
  "Finnish Southeastern Force",
  "Italian mafia - Las Manos Apertas",
  "Russian mafia - Chernoye Zoloto",
  "Irish mafia - O’Malley Syndicate",
  "Imperial House of Japan",
  "Tokugawa Clan",
  "The Kurokawa Sect (黒川教団) – The Black River Sect",
] as const;
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
  perkNotes?: Record<string, string>;
  /** Maps a disguisable perk ID to the fake perk ID it appears as to non-owners. */
  perkDisguises?: Record<string, string>;
  inventory?: CharacterInventory;
}

export type CharacterStatus = "pending" | "approved";

export interface CharacterSheet extends CharacterDraft {
  id: string;
  userId: string;
  latestSnapshotId: string;
  imageId?: string;
  hidden?: boolean;
  status?: CharacterStatus;
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

export const BASELINER_STAT_POINTS = 7;
export const DEFAULT_STAT_POINTS = 5;
export const PERK_COST_STAT_POINTS = 3;

/** Returns the starting stat points for a given race. Baseliners get 7, others get 5. */
export function getStartingStatPoints(race: Race): number {
  return race === "Baseliner" ? BASELINER_STAT_POINTS : DEFAULT_STAT_POINTS;
}

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
    unallocatedStatPoints: getStartingStatPoints("Baseliner"),
    perkIds: [],
    perkNotes: {},
    inventory: createEmptyInventory(),
  };
}
