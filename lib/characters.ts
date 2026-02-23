import {
  BASE_STAT_FIELDS,
  type BaseStats,
  type CharacterDraft,
  type CharacterSheet,
  createDefaultBaseStats,
  createDefaultCharacterDraft,
  DEFAULT_PERK_POINTS,
  DEFAULT_STAT_POINTS,
  type Race,
  RACES,
} from "./character_types.ts";
import { getKv } from "./kv.ts";

const CHARACTER_PREFIX = ["characters"] as const;

export async function listCharacters() {
  const kv = await getKv();
  const characters: CharacterSheet[] = [];

  for await (
    const entry of kv.list<CharacterSheet>({ prefix: CHARACTER_PREFIX })
  ) {
    if (entry.value) {
      characters.push(entry.value);
    }
  }

  characters.sort((a, b) => a.name.localeCompare(b.name));
  return characters;
}

export async function getCharacter(id: string) {
  const kv = await getKv();
  const entry = await kv.get<CharacterSheet>([...CHARACTER_PREFIX, id]);
  return entry.value;
}

export async function upsertCharacter(
  input: CharacterDraft & Pick<CharacterSheet, "id">,
) {
  const kv = await getKv();
  const now = new Date().toISOString();
  const existing = await getCharacter(input.id);

  const character: CharacterSheet = {
    ...input,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await kv.set([...CHARACTER_PREFIX, input.id], character);
  return character;
}

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

export function validateCharacterProgression(
  input: CharacterDraft,
): string | null {
  if (input.unallocatedStatPoints < 0 || input.unspentPerkPoints < 0) {
    return "Unspent points cannot be negative.";
  }

  const statTotal = BASE_STAT_FIELDS.reduce((total, stat) => {
    return total + input.baseStats[stat.key];
  }, 0);

  const defaultStatTotal = BASE_STAT_FIELDS.length;
  const spentOnStats = statTotal - defaultStatTotal;

  if (spentOnStats < 0) {
    return "Base stats cannot go below their default values.";
  }

  const spentOnPerkPointPurchases = DEFAULT_STAT_POINTS -
    spentOnStats -
    input.unallocatedStatPoints;

  if (spentOnPerkPointPurchases < 0 || spentOnPerkPointPurchases % 3 !== 0) {
    return "Invalid stat/perk point allocation.";
  }

  const perkPointsPurchased = spentOnPerkPointPurchases / 3;
  const expectedUnspentPerkPoints = DEFAULT_PERK_POINTS + perkPointsPurchased -
    input.perkIds.length;

  if (expectedUnspentPerkPoints !== input.unspentPerkPoints) {
    return "Invalid perk point total.";
  }

  return null;
}

export {
  type CharacterDraft,
  type CharacterSheet,
  createDefaultCharacterDraft,
};
