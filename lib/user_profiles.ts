// ---------------------------------------------------------------------------
// User profiles (server-only) – validated flag for anti-spam gates
// ---------------------------------------------------------------------------

import { eq } from "drizzle-orm";
import { ensureSchema, getDb } from "./db/client.ts";
import { userProfiles } from "./db/schema.ts";
import type { SessionUser } from "./session_types.ts";

export interface UserProfile {
  userId: string;
  username: string;
  validated: boolean;
  createdAt: string;
  updatedAt: string;
}

let schemaReady: Promise<void> | null = null;
async function ready(): Promise<void> {
  if (!schemaReady) schemaReady = ensureSchema();
  await schemaReady;
}

function nowIso(): string {
  return new Date().toISOString();
}

function rowToProfile(
  row: typeof userProfiles.$inferSelect,
): UserProfile {
  return {
    userId: row.userId,
    username: row.username,
    validated: row.validated,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  await ready();
  const db = getDb();
  const rows = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
  const row = rows[0];
  return row ? rowToProfile(row) : null;
}

/** True if the user has a profile with validated=true. Missing profile => false. */
export async function isUserValidated(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.validated === true;
}

/**
 * Ensure a profile row exists for this Discord user.
 * New accounts default to validated=false.
 * Does not demote an already-validated user; refreshes username.
 */
export async function ensureUserProfile(
  user: SessionUser,
): Promise<UserProfile> {
  await ready();
  const db = getDb();
  const ts = nowIso();
  const existing = await getUserProfile(user.id);
  if (existing) {
    if (existing.username !== user.username) {
      await db
        .update(userProfiles)
        .set({ username: user.username, updatedAt: ts })
        .where(eq(userProfiles.userId, user.id));
      return { ...existing, username: user.username, updatedAt: ts };
    }
    return existing;
  }

  await db.insert(userProfiles).values({
    userId: user.id,
    username: user.username,
    validated: false,
    createdAt: ts,
    updatedAt: ts,
  });

  return {
    userId: user.id,
    username: user.username,
    validated: false,
    createdAt: ts,
    updatedAt: ts,
  };
}

/**
 * Mark a user as validated (first approved character, or admin tooling).
 * Creates a minimal profile if missing.
 */
export async function markUserValidated(
  userId: string,
  username?: string,
): Promise<void> {
  await ready();
  const db = getDb();
  const ts = nowIso();
  const existing = await getUserProfile(userId);
  if (existing) {
    if (existing.validated) return;
    await db
      .update(userProfiles)
      .set({ validated: true, updatedAt: ts })
      .where(eq(userProfiles.userId, userId));
    return;
  }

  await db.insert(userProfiles).values({
    userId,
    username: username?.trim() || userId,
    validated: true,
    createdAt: ts,
    updatedAt: ts,
  });
}
