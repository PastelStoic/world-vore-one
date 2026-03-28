// ---------------------------------------------------------------------------
// Character database operations (server-only – uses Deno KV)
// ---------------------------------------------------------------------------

import type {
  CharacterDraft,
  CharacterSheet,
  CharacterSnapshot,
  CharacterStatus,
} from "./character_types.ts";
import type { CharacterInventory } from "./inventory_types.ts";
import { getPerkAccountLimitError } from "@/data/perks.ts";
import { normalizeCharacterPerkIds } from "./perk_state_helpers.ts";

const CHARACTER_PREFIX = ["characters"] as const;
const CHARACTER_BY_USER_PREFIX = ["characters_by_user"] as const;
const CHARACTER_SNAPSHOT_PREFIX = ["character_snapshots"] as const;
const CHARACTER_SNAPSHOT_BY_ID_PREFIX = ["character_snapshots_by_id"] as const;

// ---------------------------------------------------------------------------
// KV singleton
// ---------------------------------------------------------------------------

let _kv: Deno.Kv | null = null;

async function getKv(): Promise<Deno.Kv> {
  if (!_kv) _kv = await Deno.openKv();
  return _kv;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Write a character to both KV key paths (by id and by userId) atomically.
 */
async function saveCharacter(
  kv: Deno.Kv,
  character: CharacterSheet,
): Promise<void> {
  await kv.set([...CHARACTER_PREFIX, character.id], character);
  await kv.set(
    [...CHARACTER_BY_USER_PREFIX, character.userId, character.id],
    character,
  );
}

/**
 * Read-modify-write helper. Fetches a character, applies a mutation, and
 * saves to both key paths. Returns null if the character doesn't exist.
 */
async function updateCharacter(
  characterId: string,
  mutate: (character: CharacterSheet) => void,
): Promise<CharacterSheet | null> {
  const kv = await getKv();
  const character = await getCharacter(characterId);
  if (!character) return null;

  mutate(character);
  character.updatedAt = new Date().toISOString();

  await saveCharacter(kv, character);
  return character;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

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
        characters.push(normalizeCharacterPerkIds(entry.value));
      }
    }
  } else {
    for await (
      const entry of kv.list<CharacterSheet>({ prefix: CHARACTER_PREFIX })
    ) {
      if (entry.value) {
        characters.push(normalizeCharacterPerkIds(entry.value));
      }
    }
  }

  characters.sort((a, b) => {
    const ta = a.updatedAt || a.createdAt || "";
    const tb = b.updatedAt || b.createdAt || "";
    return tb.localeCompare(ta);
  });
  return characters;
}

export async function getUserPerkCharacterCounts(
  userId: string,
  options?: { excludeCharacterId?: string },
) {
  const counts: Record<string, number> = {};
  const characters = await listCharacters(userId);

  for (const character of characters) {
    if (character.id === options?.excludeCharacterId) {
      continue;
    }

    for (const perkId of new Set(character.perkIds)) {
      counts[perkId] = (counts[perkId] ?? 0) + 1;
    }
  }

  return counts;
}

export async function validateAccountLimitedPerksForUser(
  userId: string,
  draft: Pick<CharacterDraft, "perkIds">,
  options?: { excludeCharacterId?: string },
) {
  const perkCounts = await getUserPerkCharacterCounts(userId, options);
  return getPerkAccountLimitError(
    draft.perkIds,
    new Map(Object.entries(perkCounts)),
  );
}

export async function getCharacter(id: string) {
  const kv = await getKv();
  const entry = await kv.get<CharacterSheet>([...CHARACTER_PREFIX, id]);
  return entry.value ? normalizeCharacterPerkIds(entry.value) : entry.value;
}

export async function upsertCharacter(
  input: CharacterDraft & Pick<CharacterSheet, "id" | "userId">,
  changelog: string,
  options?: { basedOnSnapshotId?: string },
) {
  const kv = await getKv();
  const now = new Date().toISOString();
  const existing = await getCharacter(input.id);
  const normalizedInput = normalizeCharacterPerkIds(input);
  const snapshotId = crypto.randomUUID();
  const basedOnSnapshotId = options?.basedOnSnapshotId?.trim();
  const changelogWithBase = basedOnSnapshotId && existing &&
      basedOnSnapshotId !== existing.latestSnapshotId
    ? `${changelog} Based on old snapshot ${basedOnSnapshotId}`
    : changelog;

  const snapshot: CharacterSnapshot = {
    snapshotId,
    characterId: normalizedInput.id,
    timestamp: now,
    changelog: changelogWithBase,
    basedOnSnapshotId: basedOnSnapshotId || undefined,
    data: {
      name: normalizedInput.name,
      race: normalizedInput.race,
      description: normalizedInput.description,
      baseStats: normalizedInput.baseStats,
      unallocatedStatPoints: normalizedInput.unallocatedStatPoints,
      perkIds: normalizedInput.perkIds,
      perkNotes: normalizedInput.perkNotes,
      perkUpgradeNotes: normalizedInput.perkUpgradeNotes,
      perkStatChoices: normalizedInput.perkStatChoices,
      perkRanks: normalizedInput.perkRanks,
      perkDisguises: normalizedInput.perkDisguises,
      perkSelections: normalizedInput.perkSelections,
      perkPointChoices: normalizedInput.perkPointChoices,
      inventory: normalizedInput.inventory,
    },
  };

  const character: CharacterSheet = {
    ...normalizedInput,
    latestSnapshotId: snapshotId,
    imageId: existing?.imageId,
    hidden: existing?.hidden,
    status: existing?.status,
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
    normalizedInput.id,
    snapshotId,
  ], snapshot);
  await saveCharacter(kv, character);
  return character;
}

export function setCharacterImageId(
  characterId: string,
  imageId: string | null,
) {
  return updateCharacter(characterId, (character) => {
    if (imageId) {
      character.imageId = imageId;
    } else {
      delete character.imageId;
    }
  });
}

/**
 * Save a character directly without creating a snapshot.
 * Used for edits while a character is still pending approval.
 */
export async function upsertCharacterDirect(
  input: CharacterDraft & Pick<CharacterSheet, "id" | "userId"> & {
    status?: CharacterStatus;
  },
) {
  const kv = await getKv();
  const now = new Date().toISOString();
  const existing = await getCharacter(input.id);
  const normalizedInput = normalizeCharacterPerkIds(input);

  const character: CharacterSheet = {
    ...normalizedInput,
    latestSnapshotId: existing?.latestSnapshotId ?? "",
    imageId: existing?.imageId,
    hidden: existing?.hidden,
    status: input.status ?? existing?.status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await saveCharacter(kv, character);
  return character;
}

export function setCharacterStatus(
  characterId: string,
  status: CharacterStatus,
) {
  return updateCharacter(characterId, (character) => {
    character.status = status;
  });
}

/**
 * Update only the inventory on a saved character (combat state: ammo, charges, magazines).
 * Does NOT create a snapshot – this is for in-session tracking.
 */
export function updateCharacterInventory(
  characterId: string,
  inventory: CharacterInventory,
) {
  return updateCharacter(characterId, (character) => {
    character.inventory = inventory;
  });
}

export function setCharacterHidden(
  characterId: string,
  hidden: boolean,
) {
  return updateCharacter(characterId, (character) => {
    if (hidden) {
      character.hidden = true;
    } else {
      delete character.hidden;
    }
  });
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
      snapshots.push({
        ...entry.value,
        data: normalizeCharacterPerkIds(entry.value.data),
      });
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
  return entry.value
    ? { ...entry.value, data: normalizeCharacterPerkIds(entry.value.data) }
    : entry.value;
}

/**
 * Delete a single character and all of its snapshots.
 */
export async function deleteCharacter(characterId: string): Promise<void> {
  const kv = await getKv();
  const character = await getCharacter(characterId);

  // Delete main record and by-user index
  await kv.delete([...CHARACTER_PREFIX, characterId]);
  if (character) {
    await kv.delete([
      ...CHARACTER_BY_USER_PREFIX,
      character.userId,
      characterId,
    ]);
  }

  // Delete all snapshots (by timestamp key)
  for await (
    const entry of kv.list({
      prefix: [...CHARACTER_SNAPSHOT_PREFIX, characterId],
    })
  ) {
    await kv.delete(entry.key);
  }

  // Delete all snapshots (by id key)
  for await (
    const entry of kv.list({
      prefix: [...CHARACTER_SNAPSHOT_BY_ID_PREFIX, characterId],
    })
  ) {
    await kv.delete(entry.key);
  }
}

/**
 * Delete all characters (and their snapshots) belonging to a user.
 */
export async function deleteAllCharactersForUser(
  userId: string,
): Promise<void> {
  const kv = await getKv();
  const characterIds: string[] = [];

  for await (
    const entry of kv.list<CharacterSheet>({
      prefix: [...CHARACTER_BY_USER_PREFIX, userId],
    })
  ) {
    if (entry.value) {
      characterIds.push(entry.value.id);
    }
  }

  for (const id of characterIds) {
    await deleteCharacter(id);
  }
}
