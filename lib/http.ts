// ---------------------------------------------------------------------------
// Shared HTTP helpers for route handlers
// ---------------------------------------------------------------------------

import type { SessionUser } from "./session_types.ts";
import { BattleError } from "./battles.ts";

export interface AuthedState {
  user: SessionUser | null;
  isAdmin: boolean;
  isBanned: boolean;
  isValidated: boolean;
}

export function jsonError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

export function jsonOk(body: unknown = { ok: true }, status = 200): Response {
  return Response.json(body, { status });
}

export function requireUser(
  ctx: { state: AuthedState },
): SessionUser | Response {
  if (!ctx.state.user) return jsonError(401, "Unauthorized");
  return ctx.state.user;
}

export function requireAdmin(
  ctx: { state: AuthedState },
): SessionUser | Response {
  const user = requireUser(ctx);
  if (user instanceof Response) return user;
  if (!ctx.state.isAdmin) return jsonError(403, "Forbidden");
  return user;
}

export function requireOwnerOrAdmin(
  ctx: { state: AuthedState },
  ownerId: string,
): SessionUser | Response {
  const user = requireUser(ctx);
  if (user instanceof Response) return user;
  if (user.id !== ownerId && !ctx.state.isAdmin) {
    return jsonError(403, "Forbidden");
  }
  return user;
}

export function requireNotBanned(
  ctx: { state: AuthedState },
): Response | null {
  if (!ctx.state.user) return null;
  if (!ctx.state.isBanned) return null;
  return jsonError(403, "You have been banned.");
}

export function handleBattleError(error: unknown): Response {
  if (error instanceof BattleError) {
    return jsonError(error.status, error.message);
  }
  throw error;
}
