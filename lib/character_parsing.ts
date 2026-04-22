// ---------------------------------------------------------------------------
// Character parsing, validation, and cost calculation
// ---------------------------------------------------------------------------

import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type BaseStats,
  type CharacterDescription,
  type CharacterDraft,
  createDefaultBaseStats,
  createDefaultDescription,
  getStartingStatPoints,
  PERK_COST_STAT_POINTS,
  type PerkOrigin,
  type Race,
  RACES,
  type Sex,
  SEX_OPTIONS,
} from "./character_types.ts";
import { FACTION_DEFINITIONS_BY_ID } from "@/data/factions.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
import { getStatFloor } from "./draft_validation.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a JSON string as a plain object, then build a Record by transforming
 * each entry. Returns `defaultValue` on parse failure or non-object input.
 */
function parseJsonRecord<T>(
  raw: string,
  transform: (key: string, value: unknown) => T | undefined,
): Record<string, T> {
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" || parsed === null || Array.isArray(parsed)
    ) {
      return {};
    }
    const result: Record<string, T> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const transformed = transform(key, value);
      if (transformed !== undefined) result[key] = transformed;
    }
    return result;
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

export function parseRace(rawRace: string): Race {
  if (RACES.includes(rawRace as Race)) {
    return rawRace as Race;
  }

  return "Baseliner";
}

export function parseBaseStats(
  raw: string,
  perkIds?: string[],
): BaseStats | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const defaults = createDefaultBaseStats();
    const result = { ...defaults };

    for (const stat of BASE_STAT_FIELDS) {
      const value = parsed[stat.key];
      if (typeof value !== "number" || !Number.isInteger(value)) {
        return null;
      }

      if (value < getStatFloor(stat.key, perkIds ?? [])) return null;

      result[stat.key] = value;
    }

    return result;
  } catch {
    return null;
  }
}

export function parsePerkIds(raw: string): string[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const perkIds = parsed.filter((value): value is string =>
      typeof value === "string"
    );
    return [...new Set(perkIds)];
  } catch {
    return null;
  }
}

export function parsePerkNotes(raw: string): Record<string, string> {
  return parseJsonRecord(raw, (_key, value) => {
    if (typeof value === "string" && value.trim()) return value.trim();
    return undefined;
  });
}

export function parsePerkUpgradeNotes(
  raw: string,
): Record<string, string[]> {
  return parseJsonRecord(raw, (_key, value) => {
    if (Array.isArray(value)) {
      return value.map((v) => typeof v === "string" ? v : "");
    }
    return undefined;
  });
}

export function parsePerkStatChoices(
  raw: string,
): Record<string, BaseStatKey[]> {
  const validStatKeys = BASE_STAT_FIELDS.map((f) => f.key as string);
  return parseJsonRecord(raw, (_key, value) => {
    if (Array.isArray(value)) {
      const choices = value.filter((v): v is BaseStatKey =>
        typeof v === "string" && validStatKeys.includes(v)
      );
      if (choices.length > 0) return choices;
    }
    return undefined;
  });
}

export function parsePerkRanks(
  raw: string,
  ownedPerkIds: string[],
): Record<string, number> {
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" || parsed === null || Array.isArray(parsed)
    ) {
      return {};
    }
    const result: Record<string, number> = {};
    for (const perkId of ownedPerkIds) {
      const val = (parsed as Record<string, unknown>)[perkId];
      if (
        typeof val === "number" && Number.isInteger(val) && val >= 1
      ) {
        result[perkId] = val;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function parsePerkDisguises(raw: string): Record<string, string> {
  return parseJsonRecord(raw, (_key, value) => {
    if (typeof value === "string" && value.trim()) return value.trim();
    return undefined;
  });
}

export function parsePerkOrigins(raw: string): Record<string, PerkOrigin> {
  return parseJsonRecord(raw, (_key, value) => {
    if (
      value === "purchased" || value === "race" || value === "faction"
    ) {
      return value;
    }
    return undefined;
  });
}

/**
 * Parse perkSelections — the player-chosen perks for perks with selectablePerkIds.
 * Key = parent perk ID, value = array of chosen derived perk IDs.
 */
export function parsePerkSelections(
  raw: string,
): Record<string, string[]> {
  return parseJsonRecord(raw, (_key, value) => {
    if (Array.isArray(value)) {
      const ids = value.filter((v): v is string =>
        typeof v === "string" && v.trim().length > 0
      );
      if (ids.length > 0) return ids;
    }
    return undefined;
  });
}

/**
 * Parse perkPointChoices — player-chosen point values for perks with
 * variablePointsGranted (e.g. rival). Values are clamped to the perk's range.
 */
export function parsePerkPointChoices(
  raw: string,
  ownedPerkIds: string[],
): Record<string, number> {
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" || parsed === null || Array.isArray(parsed)
    ) {
      return {};
    }
    const result: Record<string, number> = {};
    for (const perkId of ownedPerkIds) {
      const perk = PERKS_BY_ID.get(perkId);
      if (!perk?.variablePointsGranted) continue;
      const val = (parsed as Record<string, unknown>)[perkId];
      if (typeof val === "number" && Number.isInteger(val)) {
        const clamped = Math.min(
          perk.variablePointsGranted.max,
          Math.max(perk.variablePointsGranted.min, val),
        );
        result[perkId] = clamped;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function parseDescription(raw: string): CharacterDescription | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const defaults = createDefaultDescription();

    const str = (key: keyof CharacterDescription): string =>
      typeof parsed[key] === "string"
        ? String(parsed[key]).trim()
        : defaults[key] as string;

    const sex = SEX_OPTIONS.includes(parsed.sex as Sex)
      ? (parsed.sex as Sex)
      : defaults.sex;

    return {
      isTemplate: typeof parsed.isTemplate === "boolean"
        ? parsed.isTemplate
        : false,
      countryOfOrigin: str("countryOfOrigin"),
      faction: str("faction"),
      role: str("role"),
      age: str("age"),
      dateOfBirth: str("dateOfBirth"),
      sex,
      height: str("height"),
      weight: str("weight"),
      skinColor: str("skinColor"),
      hairColor: str("hairColor"),
      eyeColor: str("eyeColor"),
      ethnicity: str("ethnicity"),
      bodyType: str("bodyType"),
      generalAppearance: str("generalAppearance"),
      generalHealth: str("generalHealth"),
      personality: str("personality"),
      biography: str("biography"),
    };
  } catch {
    return null;
  }
}

/**
 * Returns the set of perk IDs that are automatically granted by other perks in
 * the given list. Derived perks are tied to their source perk; rank 1 is free,
 * and extra ranks (if any) are costed normally.
 * Also includes player-chosen perks from perkSelections as derived (free).
 * Also includes perks auto-granted by the character's faction.
 */
export function getDerivedPerkIds(
  perkIds: string[],
  perkSelections?: Record<string, string[]>,
  faction?: string,
  perkOrigins?: Record<string, PerkOrigin>,
): Set<string> {
  const derived = new Set<string>();
  for (const perkId of perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    for (const includedId of perk?.includesPerks ?? []) {
      derived.add(includedId);
    }
  }
  // Player-chosen perks (from selectablePerkIds) are also derived/free
  if (perkSelections) {
    for (const selectedIds of Object.values(perkSelections)) {
      for (const id of selectedIds) {
        derived.add(id);
      }
    }
  }
  // Faction-granted perks are derived/free
  if (faction) {
    const factionDef = FACTION_DEFINITIONS_BY_ID.get(faction);
    if (factionDef?.grantsPerkIds) {
      for (const id of factionDef.grantsPerkIds) {
        if (perkOrigins?.[id] === "faction") {
          derived.add(id);
        }
      }
    }
  }
  return derived;
}

function shouldChargeFactionGrantedPerk(
  perkId: string,
  perkOrigins?: Record<string, PerkOrigin>,
): boolean {
  if (perkOrigins?.[perkId] !== "faction") return false;

  return PERKS_BY_ID.get(perkId)?.lockCategory === "tierfraun-type";
}

export function getFactionPerkCompensation(
  perkIds: string[],
  faction?: string,
  factionCompensatedPerkIds?: string[],
): number {
  if (!faction || !factionCompensatedPerkIds?.length) return 0;

  const grantedPerkIds = new Set(
    FACTION_DEFINITIONS_BY_ID.get(faction)?.grantsPerkIds ?? [],
  );

  return factionCompensatedPerkIds.filter((id) =>
    perkIds.includes(id) && grantedPerkIds.has(id)
  ).length * 2;
}

export function calculatePerksCost(
  perkIds: string[],
  perkRanks?: Record<string, number>,
  perkSelections?: Record<string, string[]>,
  faction?: string,
  perkPointChoices?: Record<string, number>,
  perkOrigins?: Record<string, PerkOrigin>,
): number {
  if (perkIds.length <= 0) return 0;

  const derived = getDerivedPerkIds(
    perkIds,
    perkSelections,
    faction,
    perkOrigins,
  );
  let paidPerkCount = 0;
  let totalPointsGranted = 0;
  let totalFreePerks = 0;

  for (const perkId of perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    const rank = perkRanks?.[perkId] ?? 1;
    if (perk?.variablePointsGranted) {
      totalPointsGranted += (perkPointChoices?.[perkId] ?? 0) * rank;
    } else {
      totalPointsGranted += (perk?.pointsGranted ?? 0) * rank;
    }
    totalFreePerks += (perk?.freePerks ?? 0) * rank;
    if (perk?.isFree) continue;

    if (
      derived.has(perkId) &&
      !shouldChargeFactionGrantedPerk(perkId, perkOrigins)
    ) {
      paidPerkCount += Math.max(0, rank - 1);
      continue;
    }

    paidPerkCount += rank;
  }

  // Faction-granted stat points
  if (faction) {
    const factionDef = FACTION_DEFINITIONS_BY_ID.get(faction);
    totalPointsGranted += factionDef?.grantsStatPoints ?? 0;
  }

  // First paid perk is free, plus any freePerks grants from active perks
  const freeSlots = 1 + totalFreePerks;
  const baseCost = Math.max(0, paidPerkCount - freeSlots) *
    PERK_COST_STAT_POINTS;
  return baseCost - totalPointsGranted;
}

export function validateCharacterProgression(
  input: CharacterDraft,
): string | null {
  if (input.unallocatedStatPoints < 0) {
    return "Unallocated stat points cannot be negative.";
  }

  const statTotal = BASE_STAT_FIELDS.reduce((total, stat) => {
    return total + input.baseStats[stat.key];
  }, 0);

  // Minimum valid stat total is the sum of each stat's floor
  const minStatTotal = BASE_STAT_FIELDS.reduce(
    (total, stat) => total + getStatFloor(stat.key, input.perkIds),
    0,
  );

  if (statTotal < minStatTotal) {
    return "Base stats cannot go below their minimum values.";
  }

  const defaultStatTotal = BASE_STAT_FIELDS.length;
  const spentOnStats = statTotal - defaultStatTotal;

  const spentOnPerks = calculatePerksCost(
    input.perkIds,
    input.perkRanks,
    input.perkSelections,
    input.description.faction,
    input.perkPointChoices,
    input.perkOrigins,
  );
  const totalUsed = spentOnStats + spentOnPerks + input.unallocatedStatPoints;

  if (totalUsed < getStartingStatPoints(input.race)) {
    return "Invalid stat/perk point allocation.";
  }

  return null;
}
