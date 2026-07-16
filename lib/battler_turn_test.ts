/**
 * Pure unit tests for turn helpers (no DB).
 * Run: deno test -A lib/battler_turn_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import type { BattlePlayer, BattleRoom } from "./battler_types.ts";
import { createEmptyBattlerState } from "./battler_types.ts";
import {
  canJoinAsPlayer,
  getActivePlayer,
  getBattlerPermissions,
  nextTurnIndex,
} from "./battler_turn.ts";

const players: BattlePlayer[] = [
  { userId: "a", username: "Alice", joinedAt: "t0" },
  { userId: "b", username: "Bob", joinedAt: "t1" },
  { userId: "c", username: "Carol", joinedAt: "t2" },
];

function room(
  overrides: Partial<BattleRoom> = {},
): BattleRoom {
  return {
    id: "uuid",
    ownerId: "a",
    name: "Test",
    status: "active",
    players,
    currentTurnIndex: 0,
    turnNumber: 1,
    state: createEmptyBattlerState(),
    stateRevision: 1,
    createdAt: "t0",
    updatedAt: "t0",
    ...overrides,
  };
}

Deno.test("getActivePlayer returns current seat when active", () => {
  assertEquals(getActivePlayer(players, 1, "active")?.userId, "b");
  assertEquals(getActivePlayer(players, 0, "lobby"), null);
  assertEquals(getActivePlayer([], 0, "active"), null);
});

Deno.test("nextTurnIndex wraps", () => {
  assertEquals(nextTurnIndex(players, 0), 1);
  assertEquals(nextTurnIndex(players, 2), 0);
  assertEquals(nextTurnIndex([], 0), 0);
});

Deno.test("permissions: guest is spectator", () => {
  const p = getBattlerPermissions(room(), null);
  assertEquals(p.isSpectator, true);
  assertEquals(p.canEdit, false);
  assertEquals(p.canEndTurn, false);
});

Deno.test("permissions: active player can edit and end turn", () => {
  const p = getBattlerPermissions(room({ currentTurnIndex: 1 }), "b");
  assertEquals(p.isActive, true);
  assertEquals(p.canEdit, true);
  assertEquals(p.canEndTurn, true);
  assertEquals(p.isOwner, false);
});

Deno.test("permissions: waiting player cannot edit", () => {
  const p = getBattlerPermissions(room({ currentTurnIndex: 0 }), "b");
  assertEquals(p.canEdit, false);
  assertEquals(p.canEndTurn, false);
  assertEquals(p.isPlayer, true);
  assertEquals(p.isSpectator, false);
});

Deno.test("permissions: owner can edit in lobby only", () => {
  const lobby = getBattlerPermissions(room({ status: "lobby" }), "a");
  assertEquals(lobby.canEdit, true);
  assertEquals(lobby.canEndTurn, false);

  const active = getBattlerPermissions(room({ currentTurnIndex: 1 }), "a");
  assertEquals(active.isOwner, true);
  assertEquals(active.canEdit, false); // Bob's turn
});

Deno.test("canJoinAsPlayer", () => {
  assertEquals(canJoinAsPlayer(room({ status: "lobby" }), "d"), true);
  assertEquals(canJoinAsPlayer(room(), "a"), false);
  assertEquals(canJoinAsPlayer(room({ status: "ended" }), "d"), false);
  assertEquals(canJoinAsPlayer(room(), null), false);
});
