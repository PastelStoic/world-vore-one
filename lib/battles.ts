// ---------------------------------------------------------------------------
// Battle room operations (server-only – Neon Postgres via Drizzle)
// ---------------------------------------------------------------------------

import { desc, eq, or, sql } from "drizzle-orm";
import type { SessionUser } from "./session_types.ts";
import {
  type BattlePlayer,
  type BattleRoom,
  type BattleStatus,
  type BattlerState,
  createEmptyBattlerState,
  parseBattlerState,
} from "./battler_types.ts";
import { getActivePlayer, nextTurnIndex } from "./battler_turn.ts";
import { ensureSchema, getDb } from "./db/client.ts";
import { battles } from "./db/schema.ts";
import { isUserValidated } from "./user_profiles.ts";

let schemaReady: Promise<void> | null = null;
async function ready(): Promise<void> {
  if (!schemaReady) schemaReady = ensureSchema();
  await schemaReady;
}

export class BattleError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "BattleError";
  }
}

function rowToRoom(row: typeof battles.$inferSelect): BattleRoom {
  return {
    id: row.id,
    ownerId: row.ownerId,
    name: row.name,
    status: row.status as BattleStatus,
    players: row.players,
    currentTurnIndex: row.currentTurnIndex,
    turnNumber: row.turnNumber,
    state: row.state,
    stateRevision: row.stateRevision,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function createBattle(
  owner: SessionUser,
  initialState?: BattlerState,
  name?: string | null,
): Promise<BattleRoom> {
  await ready();
  if (!(await isUserValidated(owner.id))) {
    throw new BattleError(
      "You need a moderator-approved character before creating battles.",
      403,
    );
  }
  const id = crypto.randomUUID();
  const ts = nowIso();
  const players: BattlePlayer[] = [{
    userId: owner.id,
    username: owner.username,
    joinedAt: ts,
  }];
  const state = initialState
    ? parseBattlerState(initialState) ?? createEmptyBattlerState()
    : createEmptyBattlerState();

  const row = {
    id,
    ownerId: owner.id,
    name: name?.trim() || null,
    status: "lobby" as const,
    players,
    currentTurnIndex: 0,
    turnNumber: 0,
    state,
    stateRevision: 0,
    createdAt: ts,
    updatedAt: ts,
  };

  const db = getDb();
  await db.insert(battles).values(row);
  return rowToRoom(row);
}

export async function getBattle(id: string): Promise<BattleRoom | null> {
  await ready();
  const db = getDb();
  const rows = await db.select().from(battles).where(eq(battles.id, id))
    .limit(1);
  const row = rows[0];
  return row ? rowToRoom(row) : null;
}

/** Battles the user owns or has joined as a player (not a global catalog). */
export async function listMyBattles(userId: string): Promise<BattleRoom[]> {
  await ready();
  const db = getDb();
  // players is JSONB array of { userId, ... }
  const rows = await db
    .select()
    .from(battles)
    .where(
      or(
        eq(battles.ownerId, userId),
        sql`${battles.players} @> ${
          JSON.stringify([{ userId }])
        }::jsonb`,
      ),
    )
    .orderBy(desc(battles.updatedAt))
    .limit(50);
  return rows.map(rowToRoom);
}

export async function joinBattle(
  id: string,
  user: SessionUser,
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.status === "ended") {
    throw new BattleError("Battle has ended", 400);
  }
  if (room.players.some((p) => p.userId === user.id)) {
    return room; // idempotent
  }
  if (!(await isUserValidated(user.id))) {
    throw new BattleError(
      "You need a moderator-approved character before joining battles.",
      403,
    );
  }

  const players: BattlePlayer[] = [
    ...room.players,
    {
      userId: user.id,
      username: user.username,
      joinedAt: nowIso(),
    },
  ];

  return await updateBattleRow(id, {
    players,
    updatedAt: nowIso(),
  });
}

export async function leaveBattle(
  id: string,
  userId: string,
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.ownerId === userId) {
    throw new BattleError("Owner cannot leave; end the battle instead", 400);
  }
  if (!room.players.some((p) => p.userId === userId)) {
    return room;
  }

  const wasActive = room.status === "active" &&
    getActivePlayer(room.players, room.currentTurnIndex, room.status)
        ?.userId === userId;

  const players = room.players.filter((p) => p.userId !== userId);
  let currentTurnIndex = room.currentTurnIndex;
  let turnNumber = room.turnNumber;
  let stateRevision = room.stateRevision;

  if (players.length === 0) {
    currentTurnIndex = 0;
  } else if (wasActive) {
    // Advance without commit; index already points at removed player — clamp
    currentTurnIndex = currentTurnIndex % players.length;
    turnNumber += 1;
    stateRevision += 1;
  } else if (currentTurnIndex >= players.length) {
    currentTurnIndex = currentTurnIndex % players.length;
  } else {
    // If a player before the current index left, shift index down
    const oldIndex = room.players.findIndex((p) => p.userId === userId);
    if (oldIndex >= 0 && oldIndex < room.currentTurnIndex) {
      currentTurnIndex = Math.max(0, currentTurnIndex - 1);
    }
  }

  return await updateBattleRow(id, {
    players,
    currentTurnIndex,
    turnNumber,
    stateRevision,
    updatedAt: nowIso(),
  });
}

export async function kickPlayer(
  id: string,
  ownerId: string,
  targetUserId: string,
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.ownerId !== ownerId) throw new BattleError("Forbidden", 403);
  if (targetUserId === ownerId) {
    throw new BattleError("Cannot kick the owner", 400);
  }
  return leaveBattle(id, targetUserId);
}

export async function updateLobby(
  id: string,
  ownerId: string,
  patch: {
    name?: string | null;
    state?: BattlerState;
    players?: BattlePlayer[]; // reorder / turn order
  },
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.ownerId !== ownerId) throw new BattleError("Forbidden", 403);
  if (room.status !== "lobby") {
    throw new BattleError("Lobby updates only allowed before start", 400);
  }

  const updates: Partial<typeof battles.$inferInsert> = {
    updatedAt: nowIso(),
  };

  if (patch.name !== undefined) {
    updates.name = patch.name?.trim() || null;
  }
  if (patch.state !== undefined) {
    const parsed = parseBattlerState(patch.state);
    if (!parsed) throw new BattleError("Invalid battle state", 400);
    updates.state = parsed;
    updates.stateRevision = room.stateRevision + 1;
  }
  if (patch.players !== undefined) {
    // Must be a permutation of current players (same userIds)
    const currentIds = new Set(room.players.map((p) => p.userId));
    if (patch.players.length !== room.players.length) {
      throw new BattleError("Turn order must include all players", 400);
    }
    const seen = new Set<string>();
    const nextPlayers: BattlePlayer[] = [];
    for (const p of patch.players) {
      if (!currentIds.has(p.userId) || seen.has(p.userId)) {
        throw new BattleError("Invalid turn order", 400);
      }
      seen.add(p.userId);
      const existing = room.players.find((x) => x.userId === p.userId)!;
      nextPlayers.push(existing);
    }
    updates.players = nextPlayers;
  }

  return await updateBattleRow(id, updates);
}

export async function startBattle(
  id: string,
  ownerId: string,
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.ownerId !== ownerId) throw new BattleError("Forbidden", 403);
  if (room.status !== "lobby") {
    throw new BattleError("Battle already started or ended", 400);
  }
  if (room.players.length === 0) {
    throw new BattleError("Cannot start with no players", 400);
  }

  return await updateBattleRow(id, {
    status: "active",
    currentTurnIndex: 0,
    turnNumber: 1,
    stateRevision: room.stateRevision + 1,
    updatedAt: nowIso(),
  });
}

/**
 * Active player commits full board state and advances turn.
 */
export async function endTurn(
  id: string,
  userId: string,
  nextState: unknown,
  expectedRevision: number,
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.status !== "active") {
    throw new BattleError("Battle is not active", 400);
  }
  const active = getActivePlayer(
    room.players,
    room.currentTurnIndex,
    room.status,
  );
  if (!active || active.userId !== userId) {
    throw new BattleError("Not your turn", 403);
  }
  if (room.stateRevision !== expectedRevision) {
    throw new BattleError("Stale revision; resync", 409);
  }

  const parsed = parseBattlerState(nextState);
  if (!parsed) throw new BattleError("Invalid battle state", 400);

  const currentTurnIndex = nextTurnIndex(
    room.players,
    room.currentTurnIndex,
  );

  return await updateBattleRow(id, {
    state: parsed,
    currentTurnIndex,
    turnNumber: room.turnNumber + 1,
    stateRevision: room.stateRevision + 1,
    updatedAt: nowIso(),
  });
}

/**
 * Owner force-ends the current turn without applying any draft state.
 */
export async function forceEndTurn(
  id: string,
  ownerId: string,
  expectedRevision: number,
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.ownerId !== ownerId) throw new BattleError("Forbidden", 403);
  if (room.status !== "active") {
    throw new BattleError("Battle is not active", 400);
  }
  if (room.stateRevision !== expectedRevision) {
    throw new BattleError("Stale revision; resync", 409);
  }
  if (room.players.length === 0) {
    throw new BattleError("No players", 400);
  }

  const currentTurnIndex = nextTurnIndex(
    room.players,
    room.currentTurnIndex,
  );

  return await updateBattleRow(id, {
    // state intentionally unchanged
    currentTurnIndex,
    turnNumber: room.turnNumber + 1,
    stateRevision: room.stateRevision + 1,
    updatedAt: nowIso(),
  });
}

export async function endBattle(
  id: string,
  ownerId: string,
): Promise<BattleRoom> {
  const room = await getBattle(id);
  if (!room) throw new BattleError("Battle not found", 404);
  if (room.ownerId !== ownerId) throw new BattleError("Forbidden", 403);
  if (room.status === "ended") return room;

  return await updateBattleRow(id, {
    status: "ended",
    stateRevision: room.stateRevision + 1,
    updatedAt: nowIso(),
  });
}

async function updateBattleRow(
  id: string,
  updates: Partial<typeof battles.$inferInsert>,
): Promise<BattleRoom> {
  const db = getDb();
  const rows = await db
    .update(battles)
    .set(updates)
    .where(eq(battles.id, id))
    .returning();
  const row = rows[0];
  if (!row) throw new BattleError("Battle not found", 404);
  return rowToRoom(row);
}
