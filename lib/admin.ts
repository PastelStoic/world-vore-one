const ADMIN_PREFIX = ["admins"] as const;

/** Check whether a user (by Discord ID) is an admin. */
export async function isAdmin(userId: string): Promise<boolean> {
  const kv = await Deno.openKv();
  const entry = await kv.get<boolean>([...ADMIN_PREFIX, userId]);
  return entry.value === true;
}

/** Grant admin status to a user. */
export async function setAdmin(
  userId: string,
  username: string,
): Promise<void> {
  const kv = await Deno.openKv();
  await kv.set([...ADMIN_PREFIX, userId], true);
  // Also store the username for display purposes
  await kv.set([...ADMIN_PREFIX, userId, "username"], username);
}

/** Revoke admin status from a user. */
export async function removeAdmin(userId: string): Promise<void> {
  const kv = await Deno.openKv();
  await kv.delete([...ADMIN_PREFIX, userId]);
  await kv.delete([...ADMIN_PREFIX, userId, "username"]);
}

/** Check whether any admin accounts exist at all. */
export async function anyAdminsExist(): Promise<boolean> {
  const kv = await Deno.openKv();
  for await (const entry of kv.list<boolean>({ prefix: [...ADMIN_PREFIX] })) {
    // Only count direct admin entries (not sub-keys like "username")
    if (entry.key.length === 2 && entry.value === true) {
      return true;
    }
  }
  return false;
}

export interface AdminRecord {
  userId: string;
  username: string;
}

/** List all admin users. */
export async function listAdmins(): Promise<AdminRecord[]> {
  const kv = await Deno.openKv();
  const admins: AdminRecord[] = [];

  for await (const entry of kv.list<boolean>({ prefix: [...ADMIN_PREFIX] })) {
    if (entry.key.length === 2 && entry.value === true) {
      const userId = entry.key[1] as string;
      const usernameEntry = await kv.get<string>([
        ...ADMIN_PREFIX,
        userId,
        "username",
      ]);
      admins.push({
        userId,
        username: usernameEntry.value ?? userId,
      });
    }
  }

  return admins;
}

// ── Ban management ─────────────────────────────────────────────────

const BAN_PREFIX = ["bans"] as const;

export interface BannedRecord {
  userId: string;
  username: string;
  bannedAt: string;
}

/** Check whether a user is banned. */
export async function isUserBanned(userId: string): Promise<boolean> {
  const kv = await Deno.openKv();
  const entry = await kv.get<boolean>([...BAN_PREFIX, userId]);
  return entry.value === true;
}

/** Ban a user. */
export async function banUser(
  userId: string,
  username: string,
): Promise<void> {
  const kv = await Deno.openKv();
  await kv.set([...BAN_PREFIX, userId], true);
  await kv.set([...BAN_PREFIX, userId, "username"], username);
  await kv.set([...BAN_PREFIX, userId, "bannedAt"], new Date().toISOString());
}

/** Unban a user. */
export async function unbanUser(userId: string): Promise<void> {
  const kv = await Deno.openKv();
  await kv.delete([...BAN_PREFIX, userId]);
  await kv.delete([...BAN_PREFIX, userId, "username"]);
  await kv.delete([...BAN_PREFIX, userId, "bannedAt"]);
}

/** List all banned users. */
export async function listBannedUsers(): Promise<BannedRecord[]> {
  const kv = await Deno.openKv();
  const banned: BannedRecord[] = [];

  for await (const entry of kv.list<boolean>({ prefix: [...BAN_PREFIX] })) {
    if (entry.key.length === 2 && entry.value === true) {
      const userId = entry.key[1] as string;
      const [usernameEntry, bannedAtEntry] = await Promise.all([
        kv.get<string>([...BAN_PREFIX, userId, "username"]),
        kv.get<string>([...BAN_PREFIX, userId, "bannedAt"]),
      ]);
      banned.push({
        userId,
        username: usernameEntry.value ?? userId,
        bannedAt: bannedAtEntry.value ?? "",
      });
    }
  }

  return banned;
}
