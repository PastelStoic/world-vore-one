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
  "N/A - Civilians and unafilliated",
  "GERMANY - German Imperial Army",
  "GERMANY - The 7th Western Army",
  "GERMANY - German East African Army",
  "GERMANY - German West African Army",
  "GERMANY - German Eastern European Garrison",
  "AUSTRIA - Austro-Hungarian Army",
  "AUSTRIA - Austro-Hungarian Eastern European Garrison",
  "ITALY - Italian Army In Exile",
  "ITALY - Royal italian army remnants - The Arditi",
  "ITALY - Standing Italian Army",
  "OTTOMANS - Cemaat Janissaries",
  "OTTOMANS - New Ottoman Army",
  "SWITZERLAND - King's Royal Army",
  "FRANCE - French Standing Army",
  "FRANCE - French Foreign Legion",
  "FRANCE - Chasseurs Alpins",
  "FRANCE - French Eastern African Army",
  "FRANCE - French Western African Army",
  "BRITAIN - British Expeditionary Force (BEF)",
  "BRITAIN - Canadian Expeditionary Force (CEF)",
  "BRITAIN - Royal Berkshire Regiment",
  "BRITAIN - British Eastern African Army",
  "BRITAIN - British Western African Army",
  "AMERICA - American Expeditionary Force (AEF)",
  "AMERICA - Harlem Hellfighters",
  "AMERICA - 'Las Manos Apertas' Mafia",
  "AMERICA - 'Chernoye Zoloto' Mafia",
  "AMERICA - 'O’Malley Syndicate' Mafia",
  "THE REDS - The 21st Red Rifles",
  "THE WHITES - Standard White Army",
  "FINLAND - Finnish Southeastern Force",
  "JAPAN - Imperial House of Japan",
  "JAPAN - Tokugawa Clan",
  "JAPAN - The Kurokawa Sect (黒川教団) – The Black River Sect",
  "JAPAN - Miscellaneous Japanese Clans",
  "ROLEPLAYER - The Church of Provisional Rations",
  "ROLEPLAYER - Gambling And Guts (GAG)",
  "ROLEPLAYER - The Shinyakaze - Right Hand of the Goddess",
  "ROLEPLAYER - testing purposes do not pick this faction if you're seeing it",
  "SWITZERLAND - King's Royal Artificers",
] as const;
export type Faction = (typeof FACTIONS)[number];

// ── Faction definitions (optional bonuses when a faction is selected) ────────

export interface FactionDefinition {
  id: Faction;
  /** Placeholder description text for the faction. */
  description?: string;
  /** Perk IDs automatically granted when this faction is selected (free, derived). */
  grantsPerkIds?: string[];
  /** Extra stat points granted when this faction is selected. */
  grantsStatPoints?: number;
  /** When true, only moderators may newly assign this faction in the editor. */
  moderatorOnly?: boolean;
}

export type PerkOrigin = "purchased" | "race" | "faction";

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

export function getDisplayedRaceName(
  race: Race,
  perkIds: string[],
): string {
  if (perkIds.includes("japanese-kami-champion") && isTierRace(race)) {
    return race === "Tierherr" ? "Kronprinz Tierherr" : "Kronprinz Tierfraun";
  }

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
  /** Per-rank free-text notes for upgradable perks with customInput (index 0 = rank 1). */
  perkUpgradeNotes?: Record<string, string[]>;
  /** Per-rank stat selections for perks with requiresStatChoice (index 0 = rank 1). */
  perkStatChoices?: Record<string, BaseStatKey[]>;
  /** Rank of each owned upgradable perk (how many times it has been taken). Defaults to 1. */
  perkRanks?: Record<string, number>;
  /** Maps a disguisable perk ID to the fake perk ID it appears as to non-owners. */
  perkDisguises?: Record<string, string>;
  /**
   * Per-parent-perk selected perk IDs (from selectablePerkIds).
   * Key = parent perk ID, value = array of chosen derived perk IDs.
   * Chosen perks are treated as derived / free (like includesPerks but player-chosen).
   */
  perkSelections?: Record<string, string[]>;
  /**
   * Player-chosen stat point values for perks with variablePointsGranted (e.g. rival).
   * Key = perk ID, value = chosen number of points to gain.
   */
  perkPointChoices?: Record<string, number>;
  /** How each directly-owned perk was acquired. */
  perkOrigins?: Record<string, PerkOrigin>;
  /**
   * Perks already owned when the current faction started granting them.
   * Each active ID grants 2 compensation points while that faction remains selected.
   */
  factionCompensatedPerkIds?: string[];
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
