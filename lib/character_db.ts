// ---------------------------------------------------------------------------
// Character database operations (server-only – Neon Postgres via Drizzle)
// ---------------------------------------------------------------------------

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type {
  CharacterDraft,
  CharacterSheet,
  CharacterSnapshot,
  CharacterStatus,
} from "./character_types.ts";
import { PERK_COST_STAT_POINTS } from "./character_types.ts";
import type { CharacterInventory } from "./inventory_types.ts";
import { getPerkAccountLimitError } from "@/data/perks.ts";
import {
  cleanupPerkData,
  normalizeCharacterPerkIds,
  normalizeLoadedDraft,
} from "./perk_state_helpers.ts";
import { getDb } from "./db/client.ts";
import { characterSnapshots, characters } from "./db/schema.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function replacePerkGrantedInventory(
  inventory: CharacterInventory | undefined,
  fromPerkId: string,
  toPerkId: string,
): boolean {
  if (!inventory) return false;

  let changed = false;
  for (const location of ["carried", "stowed"] as const) {
    for (const item of inventory[location].equipment) {
      if (item.perkGranted === fromPerkId) {
        item.perkGranted = toPerkId;
        changed = true;
      }
    }
    for (const item of inventory[location].meleeWeapons) {
      if (item.perkGranted === fromPerkId) {
        item.perkGranted = toPerkId;
        changed = true;
      }
    }
    for (const item of inventory[location].attachments) {
      if (item.perkGranted === fromPerkId) {
        item.perkGranted = toPerkId;
        changed = true;
      }
    }
  }

  return changed;
}

function replacePerkReferences(
  ids: string[] | undefined,
  fromPerkId: string,
  toPerkId: string,
) {
  let changed = false;
  const next: string[] = [];
  for (const id of ids ?? []) {
    const replacement = id === fromPerkId ? toPerkId : id;
    if (replacement !== id) changed = true;
    if (!next.includes(replacement)) next.push(replacement);
  }
  return { ids: next, changed };
}

/** Persist a character as a single-row upsert (no dual-key denormalization). */
async function saveCharacter(character: CharacterSheet): Promise<void> {
  const db = getDb();
  await db
    .insert(characters)
    .values({
      id: character.id,
      userId: character.userId,
      sheet: character,
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
    })
    .onConflictDoUpdate({
      target: characters.id,
      set: {
        userId: character.userId,
        sheet: character,
        updatedAt: character.updatedAt,
      },
    });
}

/**
 * Read-modify-write helper. Fetches a character, applies a mutation, and
 * saves. Returns null if the character doesn't exist.
 */
async function updateCharacter(
  characterId: string,
  mutate: (character: CharacterSheet) => void,
): Promise<CharacterSheet | null> {
  const character = await getCharacter(characterId);
  if (!character) return null;

  mutate(character);
  character.updatedAt = new Date().toISOString();

  await saveCharacter(character);
  return character;
}

export interface ReplacePerkMigrationResult {
  fromPerkId: string;
  toPerkId: string;
  dryRun: boolean;
  scanned: number;
  changed: number;
  addedReplacement: number;
  refunded: number;
  inventoryUpdated: number;
}

export async function replacePerkAcrossCharacters(
  fromPerkId: string,
  toPerkId: string,
  options?: { dryRun?: boolean },
): Promise<ReplacePerkMigrationResult> {
  const db = getDb();
  const dryRun = options?.dryRun ?? true;
  const result: ReplacePerkMigrationResult = {
    fromPerkId,
    toPerkId,
    dryRun,
    scanned: 0,
    changed: 0,
    addedReplacement: 0,
    refunded: 0,
    inventoryUpdated: 0,
  };

  const rows = await db.select().from(characters);
  const toWrite: CharacterSheet[] = [];

  for (const row of rows) {
    if (!row.sheet) continue;

    result.scanned += 1;
    const character = normalizeLoadedDraft(row.sheet);
    const hadFrom = character.perkIds.includes(fromPerkId);
    if (!hadFrom) continue;

    const hadTo = character.perkIds.includes(toPerkId);
    const nextPerkIds = character.perkIds.filter((id) => id !== fromPerkId);
    if (!hadTo) {
      nextPerkIds.push(toPerkId);
      result.addedReplacement += 1;
    } else {
      character.unallocatedStatPoints += PERK_COST_STAT_POINTS;
      result.refunded += 1;
    }
    character.perkIds = [...new Set(nextPerkIds)];

    const cleaned = cleanupPerkData(
      {
        perkNotes: character.perkNotes ?? {},
        perkUpgradeNotes: character.perkUpgradeNotes ?? {},
        perkStatChoices: character.perkStatChoices ?? {},
        perkRanks: character.perkRanks ?? {},
        perkDisguises: character.perkDisguises ?? {},
        perkSelections: character.perkSelections ?? {},
        perkPointChoices: character.perkPointChoices ?? {},
      },
      [fromPerkId],
    );
    character.perkNotes = cleaned.perkNotes;
    character.perkUpgradeNotes = cleaned.perkUpgradeNotes;
    character.perkStatChoices = cleaned.perkStatChoices;
    character.perkRanks = cleaned.perkRanks;
    character.perkPointChoices = cleaned.perkPointChoices;

    const replacedDisguises = Object.fromEntries(
      Object.entries(cleaned.perkDisguises).map(([id, disguiseId]) => [
        id,
        disguiseId === fromPerkId ? toPerkId : disguiseId,
      ]),
    );
    character.perkDisguises = replacedDisguises;

    const replacedSelections: Record<string, string[]> = {};
    for (const [id, selectedIds] of Object.entries(cleaned.perkSelections)) {
      replacedSelections[id] = replacePerkReferences(
        selectedIds,
        fromPerkId,
        toPerkId,
      ).ids;
    }
    character.perkSelections = replacedSelections;

    if (character.perkOrigins) {
      const nextOrigins = { ...character.perkOrigins };
      delete nextOrigins[fromPerkId];
      if (!hadTo && nextOrigins[toPerkId] === undefined) {
        nextOrigins[toPerkId] = "purchased";
      }
      character.perkOrigins = nextOrigins;
    } else if (!hadTo) {
      character.perkOrigins = { [toPerkId]: "purchased" };
    }

    if (character.factionCompensatedPerkIds) {
      character.factionCompensatedPerkIds = replacePerkReferences(
        character.factionCompensatedPerkIds,
        fromPerkId,
        toPerkId,
      ).ids;
    }

    if (
      replacePerkGrantedInventory(character.inventory, fromPerkId, toPerkId)
    ) {
      result.inventoryUpdated += 1;
    }

    character.updatedAt = new Date().toISOString();
    result.changed += 1;
    toWrite.push(character);
  }

  // Batch multi-row upserts in chunks (fewest practical write round trips)
  if (!dryRun && toWrite.length > 0) {
    const CHUNK = 50;
    for (let i = 0; i < toWrite.length; i += CHUNK) {
      const chunk = toWrite.slice(i, i + CHUNK);
      await db
        .insert(characters)
        .values(
          chunk.map((character) => ({
            id: character.id,
            userId: character.userId,
            sheet: character,
            createdAt: character.createdAt,
            updatedAt: character.updatedAt,
          })),
        )
        .onConflictDoUpdate({
          target: characters.id,
          set: {
            userId: sql`excluded.user_id`,
            sheet: sql`excluded.sheet`,
            updatedAt: sql`excluded.updated_at`,
          },
        });
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function listCharacters(userId?: string) {
  const db = getDb();
  const rows = userId
    ? await db
      .select()
      .from(characters)
      .where(eq(characters.userId, userId))
      .orderBy(desc(characters.updatedAt))
    : await db
      .select()
      .from(characters)
      .orderBy(desc(characters.updatedAt));

  return rows.map((row) => normalizeLoadedDraft(row.sheet));
}

export async function getUserPerkCharacterCounts(
  userId: string,
  options?: { excludeCharacterId?: string },
) {
  const counts: Record<string, number> = {};
  const list = await listCharacters(userId);

  for (const character of list) {
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
  const db = getDb();
  const rows = await db
    .select()
    .from(characters)
    .where(eq(characters.id, id))
    .limit(1);
  const row = rows[0];
  return row ? normalizeLoadedDraft(row.sheet) : null;
}

export async function upsertCharacter(
  input: CharacterDraft & Pick<CharacterSheet, "id" | "userId">,
  changelog: string,
  options?: { basedOnSnapshotId?: string },
) {
  const db = getDb();
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
      perkOrigins: normalizedInput.perkOrigins,
      factionCompensatedPerkIds: normalizedInput.factionCompensatedPerkIds,
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

  // Single transaction: character row + snapshot (2 statements, 1 round trip
  // when using a connection that pipelines; atomic either way)
  await db.transaction(async (tx) => {
    // Character first so snapshot FK is satisfied on first insert
    await tx
      .insert(characters)
      .values({
        id: character.id,
        userId: character.userId,
        sheet: character,
        createdAt: character.createdAt,
        updatedAt: character.updatedAt,
      })
      .onConflictDoUpdate({
        target: characters.id,
        set: {
          userId: character.userId,
          sheet: character,
          updatedAt: character.updatedAt,
        },
      });

    await tx.insert(characterSnapshots).values({
      snapshotId: snapshot.snapshotId,
      characterId: snapshot.characterId,
      timestamp: snapshot.timestamp,
      snapshot,
    });
  });

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

  await saveCharacter(character);
  return character;
}

export async function setCharacterStatus(
  characterId: string,
  status: CharacterStatus,
) {
  const character = await updateCharacter(characterId, (c) => {
    c.status = status;
  });
  // First moderator-approved sheet unlocks the account for anti-spam gates
  // (battler join/create, future features).
  if (character && status === "approved") {
    const { markUserValidated } = await import("./user_profiles.ts");
    await markUserValidated(character.userId);
  }
  return character;
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
  const db = getDb();
  const rows = await db
    .select()
    .from(characterSnapshots)
    .where(eq(characterSnapshots.characterId, characterId))
    .orderBy(desc(characterSnapshots.timestamp));

  return rows.map((row) => ({
    ...row.snapshot,
    data: normalizeLoadedDraft(row.snapshot.data),
  }));
}

export async function getCharacterSnapshot(
  characterId: string,
  snapshotId: string,
) {
  const db = getDb();
  const rows = await db
    .select()
    .from(characterSnapshots)
    .where(
      and(
        eq(characterSnapshots.characterId, characterId),
        eq(characterSnapshots.snapshotId, snapshotId),
      ),
    )
    .limit(1);
  const row = rows[0];
  return row
    ? {
      ...row.snapshot,
      data: normalizeLoadedDraft(row.snapshot.data),
    }
    : null;
}

/**
 * Delete a single character and all of its snapshots (CASCADE on FK).
 * One round trip.
 */
export async function deleteCharacter(characterId: string): Promise<void> {
  const db = getDb();
  await db.delete(characters).where(eq(characters.id, characterId));
}

/**
 * Delete all characters (and their snapshots) belonging to a user.
 * One DELETE + CASCADE – no N sequential deletes.
 */
export async function deleteAllCharactersForUser(
  userId: string,
): Promise<void> {
  const db = getDb();
  await db.delete(characters).where(eq(characters.userId, userId));
}

/** Batch-delete characters by id (used by tests / admin tooling). */
export async function deleteCharactersByIds(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const db = getDb();
  await db.delete(characters).where(inArray(characters.id, ids));
}
