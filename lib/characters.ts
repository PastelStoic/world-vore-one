import {
  BASE_STAT_FIELDS,
  type BaseStats,
  type CharacterDescription,
  type CharacterDraft,
  type CharacterSheet,
  type CharacterSnapshot,
  createDefaultBaseStats,
  createDefaultCharacterDraft,
  createDefaultDescription,
  getStartingStatPoints,
  PERK_COST_STAT_POINTS,
  type Race,
  RACES,
  type Sex,
  SEX_OPTIONS,
} from "./character_types.ts";
import { getKv } from "./kv.ts";

const CHARACTER_PREFIX = ["characters"] as const;
const CHARACTER_BY_USER_PREFIX = ["characters_by_user"] as const;
const CHARACTER_SNAPSHOT_PREFIX = ["character_snapshots"] as const;
const CHARACTER_SNAPSHOT_BY_ID_PREFIX = ["character_snapshots_by_id"] as const;

export async function listCharacters(userId?: string) {
  const kv = await getKv();
  const characters: CharacterSheet[] = [];

  if (userId) {
    for await (
      const entry of kv.list<CharacterSheet>({
        prefix: [...CHARACTER_BY_USER_PREFIX, userId],
      })
    ) {
      if (entry.value) {
        characters.push(entry.value);
      }
    }
  } else {
    for await (
      const entry of kv.list<CharacterSheet>({ prefix: CHARACTER_PREFIX })
    ) {
      if (entry.value) {
        characters.push(entry.value);
      }
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
  input: CharacterDraft & Pick<CharacterSheet, "id" | "userId">,
  changelog: string,
  options?: { basedOnSnapshotId?: string },
) {
  const kv = await getKv();
  const now = new Date().toISOString();
  const existing = await getCharacter(input.id);
  const snapshotId = crypto.randomUUID();
  const basedOnSnapshotId = options?.basedOnSnapshotId?.trim();
  const changelogWithBase = basedOnSnapshotId && existing &&
      basedOnSnapshotId !== existing.latestSnapshotId
    ? `${changelog} Based on old snapshot ${basedOnSnapshotId}`
    : changelog;

  const snapshot: CharacterSnapshot = {
    snapshotId,
    characterId: input.id,
    timestamp: now,
    changelog: changelogWithBase,
    basedOnSnapshotId: basedOnSnapshotId || undefined,
    data: {
      name: input.name,
      race: input.race,
      description: input.description,
      baseStats: input.baseStats,
      unallocatedStatPoints: input.unallocatedStatPoints,
      perkIds: input.perkIds,
    },
  };

  const character: CharacterSheet = {
    ...input,
    latestSnapshotId: snapshotId,
    imageId: existing?.imageId,
    hidden: existing?.hidden,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await kv.set([
    ...CHARACTER_SNAPSHOT_PREFIX,
    input.id,
    snapshot.timestamp,
    snapshotId,
  ], snapshot);
  await kv.set([
    ...CHARACTER_SNAPSHOT_BY_ID_PREFIX,
    input.id,
    snapshotId,
  ], snapshot);
  await kv.set([...CHARACTER_PREFIX, input.id], character);
  await kv.set(
    [...CHARACTER_BY_USER_PREFIX, input.userId, input.id],
    character,
  );
  return character;
}

export async function setCharacterImageId(
  characterId: string,
  imageId: string | null,
) {
  const kv = await getKv();
  const character = await getCharacter(characterId);
  if (!character) return null;

  if (imageId) {
    character.imageId = imageId;
  } else {
    delete character.imageId;
  }
  character.updatedAt = new Date().toISOString();

  await kv.set([...CHARACTER_PREFIX, characterId], character);
  await kv.set(
    [...CHARACTER_BY_USER_PREFIX, character.userId, characterId],
    character,
  );
  return character;
}

export async function setCharacterHidden(
  characterId: string,
  hidden: boolean,
) {
  const kv = await getKv();
  const character = await getCharacter(characterId);
  if (!character) return null;

  if (hidden) {
    character.hidden = true;
  } else {
    delete character.hidden;
  }
  character.updatedAt = new Date().toISOString();

  await kv.set([...CHARACTER_PREFIX, characterId], character);
  await kv.set(
    [...CHARACTER_BY_USER_PREFIX, character.userId, characterId],
    character,
  );
  return character;
}

export async function listCharacterSnapshots(characterId: string) {
  const kv = await getKv();
  const snapshots: CharacterSnapshot[] = [];

  for await (
    const entry of kv.list<CharacterSnapshot>({
      prefix: [...CHARACTER_SNAPSHOT_PREFIX, characterId],
    })
  ) {
    if (entry.value) {
      snapshots.push(entry.value);
    }
  }

  snapshots.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return snapshots;
}

export async function getCharacterSnapshot(
  characterId: string,
  snapshotId: string,
) {
  const kv = await getKv();
  const entry = await kv.get<CharacterSnapshot>([
    ...CHARACTER_SNAPSHOT_BY_ID_PREFIX,
    characterId,
    snapshotId,
  ]);
  return entry.value;
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

export function calculatePerksCost(perkCount: number): number {
  if (perkCount <= 0) return 0;
  // First perk is free, subsequent perks cost PERK_COST_STAT_POINTS each
  return (perkCount - 1) * PERK_COST_STAT_POINTS;
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

  const spentOnPerks = calculatePerksCost(input.perkIds.length);
  const totalUsed = spentOnStats + spentOnPerks + input.unallocatedStatPoints;

  if (totalUsed < getStartingStatPoints(input.race)) {
    return "Invalid stat/perk point allocation.";
  }

  return null;
}

export {
  type CharacterDescription,
  type CharacterDraft,
  type CharacterSheet,
  type CharacterSnapshot,
  createDefaultCharacterDraft,
  createDefaultDescription,
};
