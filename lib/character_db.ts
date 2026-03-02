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

  characters.sort((a, b) => {
    const ta = a.updatedAt || a.createdAt || "";
    const tb = b.updatedAt || b.createdAt || "";
    return tb.localeCompare(ta);
  });
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
      inventory: input.inventory,
    },
  };

  const character: CharacterSheet = {
    ...input,
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

/**
 * Save a character directly without creating a snapshot.
 * Used for edits while a character is still pending approval.
 */
export async function upsertCharacterDirect(
  input: CharacterDraft & Pick<CharacterSheet, "id" | "userId"> & { status?: CharacterStatus },
) {
  const kv = await getKv();
  const now = new Date().toISOString();
  const existing = await getCharacter(input.id);

  const character: CharacterSheet = {
    ...input,
    latestSnapshotId: existing?.latestSnapshotId ?? "",
    imageId: existing?.imageId,
    hidden: existing?.hidden,
    status: input.status ?? existing?.status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await kv.set([...CHARACTER_PREFIX, input.id], character);
  await kv.set(
    [...CHARACTER_BY_USER_PREFIX, input.userId, input.id],
    character,
  );
  return character;
}

export async function setCharacterStatus(
  characterId: string,
  status: CharacterStatus,
) {
  const kv = await getKv();
  const character = await getCharacter(characterId);
  if (!character) return null;

  character.status = status;
  character.updatedAt = new Date().toISOString();

  await kv.set([...CHARACTER_PREFIX, characterId], character);
  await kv.set(
    [...CHARACTER_BY_USER_PREFIX, character.userId, characterId],
    character,
  );
  return character;
}

/**
 * Update only the inventory on a saved character (combat state: ammo, charges, magazines).
 * Does NOT create a snapshot – this is for in-session tracking.
 */
export async function updateCharacterInventory(
  characterId: string,
  inventory: CharacterInventory,
) {
  const kv = await getKv();
  const character = await getCharacter(characterId);
  if (!character) return null;

  character.inventory = inventory;
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
