/** Pure turn / role helpers for the battler (client + server safe). */

import type { BattlePlayer, BattleRoom, BattleStatus } from "./battler_types.ts";

export type BattlerRole =
  | "spectator"
  | "player"
  | "active"
  | "owner";

export interface BattlerPermissions {
  /** Can mutate board (local draft or lobby owner write). */
  canEdit: boolean;
  /** Active player may POST end-turn. */
  canEndTurn: boolean;
  /** Owner may force-end / start / lobby / end battle. */
  isOwner: boolean;
  /** Logged-in seat in players[]. */
  isPlayer: boolean;
  /** Active turn seat. */
  isActive: boolean;
  /** Viewing only (not a player, or guest). */
  isSpectator: boolean;
  activePlayer: BattlePlayer | null;
}

export function getActivePlayer(
  players: BattlePlayer[],
  currentTurnIndex: number,
  status: BattleStatus,
): BattlePlayer | null {
  if (status !== "active") return null;
  if (players.length === 0) return null;
  const idx = ((currentTurnIndex % players.length) + players.length) %
    players.length;
  return players[idx] ?? null;
}

export function nextTurnIndex(
  players: BattlePlayer[],
  currentTurnIndex: number,
): number {
  if (players.length === 0) return 0;
  return (currentTurnIndex + 1) % players.length;
}

/**
 * Compute UI/server permissions for a user viewing a room.
 * `userId` null => guest spectator.
 */
export function getBattlerPermissions(
  room: Pick<
    BattleRoom,
    | "ownerId"
    | "status"
    | "players"
    | "currentTurnIndex"
  >,
  userId: string | null,
): BattlerPermissions {
  const isOwner = !!userId && userId === room.ownerId;
  const isPlayer = !!userId &&
    room.players.some((p) => p.userId === userId);
  const activePlayer = getActivePlayer(
    room.players,
    room.currentTurnIndex,
    room.status,
  );
  const isActive = !!userId && !!activePlayer &&
    activePlayer.userId === userId;

  let canEdit = false;
  if (room.status === "lobby" && isOwner) {
    canEdit = true;
  } else if (room.status === "active" && isActive) {
    canEdit = true;
  }
  // ended: no edit

  return {
    canEdit,
    canEndTurn: room.status === "active" && isActive,
    isOwner,
    isPlayer,
    isActive,
    isSpectator: !isPlayer && !isOwner,
    activePlayer,
  };
}

export function canJoinAsPlayer(
  room: Pick<BattleRoom, "status" | "players" | "ownerId">,
  userId: string | null,
): boolean {
  if (!userId) return false;
  if (room.status === "ended") return false;
  if (room.players.some((p) => p.userId === userId)) return false;
  return true;
}
