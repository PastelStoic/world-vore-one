// ---------------------------------------------------------------------------
// Character parsing, validation, and cost calculation
// ---------------------------------------------------------------------------

import {
  BASE_STAT_FIELDS,
  type BaseStats,
  type CharacterDescription,
  type CharacterDraft,
  createDefaultBaseStats,
  createDefaultDescription,
  getStartingStatPoints,
  PERK_COST_STAT_POINTS,
  type Race,
  RACES,
  type Sex,
  SEX_OPTIONS,
} from "./character_types.ts";
import { PERKS_BY_ID } from "../data/perks.ts";

export function parseRace(rawRace: string): Race {
  if (RACES.includes(rawRace as Race)) {
    return rawRace as Race;
  }

  return "Baseliner";
}

export function parseBaseStats(raw: string): BaseStats | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const defaults = createDefaultBaseStats();
    const result = { ...defaults };

    for (const stat of BASE_STAT_FIELDS) {
      const value = parsed[stat.key];
      if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
        return null;
      }

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
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" || parsed === null || Array.isArray(parsed)
    ) {
      return {};
    }
    const notes: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) {
        notes[key] = value.trim();
      }
    }
    return notes;
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
      subfaction: str("subfaction"),
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

export function calculatePerksCost(perkIds: string[]): number {
  if (perkIds.length <= 0) return 0;

  let paidPerkCount = 0;
  let totalPointsGranted = 0;

  for (const perkId of perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    totalPointsGranted += perk?.pointsGranted ?? 0;
    if (!perk?.isFree) {
      paidPerkCount++;
    }
  }

  // First paid perk is free, subsequent paid perks cost PERK_COST_STAT_POINTS each
  const baseCost = Math.max(0, paidPerkCount - 1) * PERK_COST_STAT_POINTS;
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

  const defaultStatTotal = BASE_STAT_FIELDS.length;
  const spentOnStats = statTotal - defaultStatTotal;

  if (spentOnStats < 0) {
    return "Base stats cannot go below their default values.";
  }

  const spentOnPerks = calculatePerksCost(input.perkIds);
  const totalUsed = spentOnStats + spentOnPerks + input.unallocatedStatPoints;

  if (totalUsed < getStartingStatPoints(input.race)) {
    return "Invalid stat/perk point allocation.";
  }

  return null;
}
