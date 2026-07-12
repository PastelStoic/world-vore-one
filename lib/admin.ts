import { eq } from "drizzle-orm";
import { getDb } from "./db/client.ts";
import { admins, bans } from "./db/schema.ts";

/** Check whether a user (by Discord ID) is an admin. */
export async function isAdmin(userId: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ userId: admins.userId })
    .from(admins)
    .where(eq(admins.userId, userId))
    .limit(1);
  return rows.length > 0;
}

/** Grant admin status to a user. */
export async function setAdmin(
  userId: string,
  username: string,
): Promise<void> {
  const db = getDb();
  await db
    .insert(admins)
    .values({ userId, username })
    .onConflictDoUpdate({
      target: admins.userId,
      set: { username },
    });
}

/** Revoke admin status from a user. */
export async function removeAdmin(userId: string): Promise<void> {
  const db = getDb();
  await db.delete(admins).where(eq(admins.userId, userId));
}

/** Check whether any admin accounts exist at all. */
export async function anyAdminsExist(): Promise<boolean> {
  const db = getDb();
  const rows = await db.select({ userId: admins.userId }).from(admins).limit(1);
  return rows.length > 0;
}

export interface AdminRecord {
  userId: string;
  username: string;
}

/** List all admin users. */
export async function listAdmins(): Promise<AdminRecord[]> {
  const db = getDb();
  const rows = await db.select().from(admins);
  return rows.map((row) => ({
    userId: row.userId,
    username: row.username,
  }));
}

// ── Ban management ─────────────────────────────────────────────────

export interface BannedRecord {
  userId: string;
  username: string;
  bannedAt: string;
}

/** Check whether a user is banned. */
export async function isUserBanned(userId: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ userId: bans.userId })
    .from(bans)
    .where(eq(bans.userId, userId))
    .limit(1);
  return rows.length > 0;
}

/** Ban a user. */
export async function banUser(
  userId: string,
  username: string,
): Promise<void> {
  const db = getDb();
  const bannedAt = new Date().toISOString();
  await db
    .insert(bans)
    .values({ userId, username, bannedAt })
    .onConflictDoUpdate({
      target: bans.userId,
      set: { username, bannedAt },
    });
}

/** Unban a user. */
export async function unbanUser(userId: string): Promise<void> {
  const db = getDb();
  await db.delete(bans).where(eq(bans.userId, userId));
}

/** List all banned users. */
export async function listBannedUsers(): Promise<BannedRecord[]> {
  const db = getDb();
  const rows = await db.select().from(bans);
  return rows.map((row) => ({
    userId: row.userId,
    username: row.username,
    bannedAt: row.bannedAt,
  }));
}
