/**
 * Integration tests for shipped Postgres persistence.
 * Requires DATABASE_URL or NEON_CONNECTION_STRING (loaded via --env-file).
 *
 * Run: deno task test:db
 */

import {
  assertEquals,
  assertExists,
  assertNotEquals,
} from "jsr:@std/assert@1";
import {
  createDefaultCharacterDraft,
  type CharacterSheet,
} from "../character_types.ts";
import {
  deleteAllCharactersForUser,
  deleteCharacter,
  getCharacter,
  getCharacterSnapshot,
  listCharacters,
  listCharacterSnapshots,
  upsertCharacter,
  upsertCharacterDirect,
} from "../character_db.ts";
import {
  anyAdminsExist,
  banUser,
  isAdmin,
  isUserBanned,
  listAdmins,
  listBannedUsers,
  removeAdmin,
  setAdmin,
  unbanUser,
} from "../admin.ts";
import {
  createSession,
  deleteSession,
  getSession,
} from "../auth.ts";
import { closeDb, ensureSchema, getDb } from "./client.ts";
import { characterSnapshots, characters } from "./schema.ts";
import { eq, sql } from "drizzle-orm";
import {
  buildDeployKvConnectUrl,
  migrateKvToPostgres,
  ORPHAN_USER_ID,
  resolveKvSource,
} from "../../scripts/migrate_kv_to_postgres.ts";

const PREFIX = `test-pg-${crypto.randomUUID().slice(0, 8)}`;

function testUser(suffix: string) {
  return `${PREFIX}-user-${suffix}`;
}

function draftFor(name: string) {
  const d = createDefaultCharacterDraft();
  d.name = name;
  return d;
}

async function cleanupTestData() {
  const db = getDb();
  // Delete characters whose id or userId starts with our PREFIX (CASCADE snapshots)
  await db.execute(sql`
    DELETE FROM characters
    WHERE id LIKE ${PREFIX + "%"} OR user_id LIKE ${PREFIX + "%"}
  `);
  await db.execute(sql`
    DELETE FROM sessions WHERE id LIKE ${PREFIX + "%"}
       OR "user"->>'id' LIKE ${PREFIX + "%"}
  `);
  await db.execute(sql`
    DELETE FROM admins WHERE user_id LIKE ${PREFIX + "%"}
  `);
  await db.execute(sql`
    DELETE FROM bans WHERE user_id LIKE ${PREFIX + "%"}
  `);
}

Deno.test({
  name: "persistence: schema + character CRUD, snapshots, multi-delete",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    await ensureSchema();
    await cleanupTestData();

    const userId = testUser("alice");
    const charId = `${PREFIX}-char-1`;
    const charId2 = `${PREFIX}-char-2`;

    try {
      // Create with snapshot
      const created = await upsertCharacter(
        { ...draftFor("Alice One"), id: charId, userId },
        "initial create",
      );
      assertEquals(created.id, charId);
      assertEquals(created.userId, userId);
      assertEquals(created.name, "Alice One");
      assertExists(created.latestSnapshotId);
      assertExists(created.createdAt);
      assertExists(created.updatedAt);

      // Get
      const fetched = await getCharacter(charId);
      assertExists(fetched);
      assertEquals(fetched.name, "Alice One");
      assertEquals(fetched.latestSnapshotId, created.latestSnapshotId);

      // List by user
      const listed = await listCharacters(userId);
      assertEquals(listed.length, 1);
      assertEquals(listed[0].id, charId);

      // Update creates new snapshot
      const updated = await upsertCharacter(
        { ...draftFor("Alice Two"), id: charId, userId },
        "rename",
      );
      assertEquals(updated.name, "Alice Two");
      assertNotEquals(updated.latestSnapshotId, created.latestSnapshotId);

      const snaps = await listCharacterSnapshots(charId);
      assertEquals(snaps.length, 2);
      // Newest first
      assertEquals(snaps[0].snapshotId, updated.latestSnapshotId);
      assertEquals(snaps[0].changelog, "rename");
      assertEquals(snaps[1].snapshotId, created.latestSnapshotId);

      const oneSnap = await getCharacterSnapshot(
        charId,
        created.latestSnapshotId,
      );
      assertExists(oneSnap);
      assertEquals(oneSnap.data.name, "Alice One");

      // Direct upsert (no new snapshot)
      const direct = await upsertCharacterDirect({
        ...draftFor("Alice Direct"),
        id: charId,
        userId,
        status: "pending",
      });
      assertEquals(direct.name, "Alice Direct");
      assertEquals(direct.status, "pending");
      const snapsAfterDirect = await listCharacterSnapshots(charId);
      assertEquals(snapsAfterDirect.length, 2);

      // Second character for same user
      await upsertCharacter(
        { ...draftFor("Bob"), id: charId2, userId },
        "bob create",
      );
      assertEquals((await listCharacters(userId)).length, 2);

      // deleteCharacter removes snapshots (CASCADE – single statement)
      await deleteCharacter(charId);
      assertEquals(await getCharacter(charId), null);
      assertEquals((await listCharacterSnapshots(charId)).length, 0);
      assertEquals((await listCharacters(userId)).length, 1);

      // deleteAllCharactersForUser – one multi-row delete
      await deleteAllCharactersForUser(userId);
      assertEquals((await listCharacters(userId)).length, 0);

      // Structural: dual-key KV denorm is gone – only one characters row per id
      await upsertCharacter(
        { ...draftFor("Solo"), id: charId, userId },
        "solo",
      );
      const db = getDb();
      const rows = await db
        .select()
        .from(characters)
        .where(eq(characters.id, charId));
      assertEquals(rows.length, 1);
      // No characters_by_user table
      let dualKeyTableExists = true;
      try {
        await db.execute(sql`SELECT 1 FROM characters_by_user LIMIT 1`);
      } catch {
        dualKeyTableExists = false;
      }
      assertEquals(dualKeyTableExists, false);
    } finally {
      await cleanupTestData();
    }
  },
});

Deno.test({
  name: "persistence: sessions create/get/expire/delete",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    await ensureSchema();
    await cleanupTestData();

    const user = {
      id: testUser("sess"),
      username: "sess-user",
      avatar: null as string | null,
    };

    try {
      const sessionId = await createSession(user);
      assertExists(sessionId);

      const got = await getSession(sessionId);
      assertExists(got);
      assertEquals(got.id, user.id);
      assertEquals(got.username, user.username);

      await deleteSession(sessionId);
      assertEquals(await getSession(sessionId), null);

      // Expired session: insert past expires_at via raw path then getSession cleans it
      const expiredId = `${PREFIX}-expired-session`;
      const db = getDb();
      const { sessions } = await import("./schema.ts");
      await db.insert(sessions).values({
        id: expiredId,
        user,
        expiresAt: new Date(Date.now() - 60_000).toISOString(),
      });
      assertEquals(await getSession(expiredId), null);
      // Row should be deleted on read
      const leftover = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, expiredId));
      assertEquals(leftover.length, 0);
    } finally {
      await cleanupTestData();
    }
  },
});

Deno.test({
  name: "persistence: admins and bans",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    await ensureSchema();
    await cleanupTestData();

    const adminId = testUser("admin");
    const bannedId = testUser("banned");

    try {
      // Isolate: only care about our prefix users
      await setAdmin(adminId, "AdminName");
      assertEquals(await isAdmin(adminId), true);
      const admins = (await listAdmins()).filter((a) =>
        a.userId.startsWith(PREFIX)
      );
      assertEquals(admins.length, 1);
      assertEquals(admins[0].username, "AdminName");
      assertEquals(await anyAdminsExist(), true);

      await removeAdmin(adminId);
      assertEquals(await isAdmin(adminId), false);
      assertEquals(
        (await listAdmins()).filter((a) => a.userId.startsWith(PREFIX)).length,
        0,
      );

      await banUser(bannedId, "BadActor");
      assertEquals(await isUserBanned(bannedId), true);
      const banned = (await listBannedUsers()).filter((b) =>
        b.userId.startsWith(PREFIX)
      );
      assertEquals(banned.length, 1);
      assertEquals(banned[0].username, "BadActor");
      assertExists(banned[0].bannedAt);

      await unbanUser(bannedId);
      assertEquals(await isUserBanned(bannedId), false);
    } finally {
      await cleanupTestData();
    }
  },
});

Deno.test({
  name: "persistence: KV→Postgres migration is idempotent and preserves data",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    await ensureSchema();
    await cleanupTestData();

    const kvPath = await Deno.makeTempFile({ prefix: "kv-migrate-", suffix: ".db" });
    // Deno.openKv needs the path; on Windows it creates sqlite-backed kv
    const kv = await Deno.openKv(kvPath);

    const userId = testUser("migrate");
    const charId = `${PREFIX}-mig-char`;
    const snapshotId = `${PREFIX}-mig-snap`;
    const adminId = testUser("mig-admin");
    const banId = testUser("mig-ban");
    const sessionId = `${PREFIX}-mig-session`;
    const now = new Date().toISOString();

    const sheet: CharacterSheet = {
      ...createDefaultCharacterDraft(),
      name: "Migrated Hero",
      id: charId,
      userId,
      latestSnapshotId: snapshotId,
      createdAt: now,
      updatedAt: now,
    };
    const snapshot = {
      snapshotId,
      characterId: charId,
      timestamp: now,
      changelog: "from kv",
      data: {
        name: sheet.name,
        race: sheet.race,
        description: sheet.description,
        baseStats: sheet.baseStats,
        unallocatedStatPoints: sheet.unallocatedStatPoints,
        perkIds: sheet.perkIds,
      },
    };

    try {
      // Seed KV in the old dual-key layout
      await kv.set(["characters", charId], sheet);
      await kv.set(["characters_by_user", userId, charId], sheet);
      await kv.set(
        ["character_snapshots", charId, now, snapshotId],
        snapshot,
      );
      await kv.set(
        ["character_snapshots_by_id", charId, snapshotId],
        snapshot,
      );
      await kv.set(["admins", adminId], true);
      await kv.set(["admins", adminId, "username"], "MigAdmin");
      await kv.set(["bans", banId], true);
      await kv.set(["bans", banId, "username"], "MigBanned");
      await kv.set(["bans", banId, "bannedAt"], now);
      await kv.set(["sessions", sessionId], {
        user: { id: userId, username: "mig-user", avatar: null },
        expiresAt: Date.now() + 86_400_000,
      });
      // Expired session should be skipped
      await kv.set([`sessions`, `${PREFIX}-expired`], {
        user: { id: userId, username: "old", avatar: null },
        expiresAt: Date.now() - 1000,
      });

      // Also seed an orphan character (missing userId) – production has at least one
      const orphanId = `${PREFIX}-mig-orphan`;
      await kv.set(["characters", orphanId], {
        ...createDefaultCharacterDraft(),
        name: "Orphan Hero",
        id: orphanId,
        // deliberately no userId
        latestSnapshotId: "",
        createdAt: now,
        updatedAt: now,
      });

      const counts1 = await migrateKvToPostgres(kv);
      assertEquals(counts1.characters, 2);
      assertEquals(counts1.charactersOrphanedUserId, 1);
      assertEquals(counts1.charactersRepairedUserId, 1);
      assertEquals(counts1.snapshots, 1);
      assertEquals(counts1.admins, 1);
      assertEquals(counts1.bans, 1);
      assertEquals(counts1.sessions, 1);
      assertEquals(counts1.sessionsSkippedExpired, 1);

      const orphan = await getCharacter(orphanId);
      assertExists(orphan);
      assertEquals(orphan.userId, ORPHAN_USER_ID);
      assertEquals(orphan.name, "Orphan Hero");

      // Spot-check via shipped getters
      const got = await getCharacter(charId);
      assertExists(got);
      assertEquals(got.name, "Migrated Hero");
      assertEquals(got.userId, userId);

      const snaps = await listCharacterSnapshots(charId);
      assertEquals(snaps.length, 1);
      assertEquals(snaps[0].snapshotId, snapshotId);
      assertEquals(snaps[0].changelog, "from kv");

      assertEquals(await isAdmin(adminId), true);
      assertEquals(await isUserBanned(banId), true);
      const sess = await getSession(sessionId);
      assertExists(sess);
      assertEquals(sess.id, userId);

      // Second run: no duplicate PKs, same counts
      const counts2 = await migrateKvToPostgres(kv);
      assertEquals(counts2.characters, 2);
      assertEquals(counts2.snapshots, 1);

      const db = getDb();
      const charCount = await db
        .select()
        .from(characters)
        .where(eq(characters.id, charId));
      assertEquals(charCount.length, 1);
      const snapCount = await db
        .select()
        .from(characterSnapshots)
        .where(eq(characterSnapshots.snapshotId, snapshotId));
      assertEquals(snapCount.length, 1);
    } finally {
      kv.close();
      await cleanupTestData();
      try {
        await Deno.remove(kvPath);
      } catch {
        // Windows may leave -shm/-wal; best-effort
      }
    }
  },
});

Deno.test({
  name: "resolveKvSource: Deploy database id builds v2 KV Connect URL",
  fn() {
    const prevId = Deno.env.get("DENO_KV_DATABASE_ID");
    const prevUrl = Deno.env.get("DENO_KV_URL");
    const prevToken = Deno.env.get("DENO_KV_ACCESS_TOKEN");
    const prevApi = Deno.env.get("DENO_KV_API_VERSION");
    try {
      Deno.env.delete("DENO_KV_URL");
      Deno.env.delete("DENO_KV_API_VERSION");
      Deno.env.set("DENO_KV_DATABASE_ID", "abc-123-uuid");
      Deno.env.set("DENO_KV_ACCESS_TOKEN", "test-token");
      assertEquals(
        buildDeployKvConnectUrl("abc-123-uuid"),
        "https://api.deno.com/v2/databases/abc-123-uuid/connect",
      );
      Deno.env.set("DENO_KV_API_VERSION", "classic");
      assertEquals(
        buildDeployKvConnectUrl("abc-123-uuid"),
        "https://api.deno.com/databases/abc-123-uuid/connect",
      );
      Deno.env.delete("DENO_KV_API_VERSION");
      const source = resolveKvSource();
      assertEquals(source.label.includes("/v2/databases/abc-123-uuid/"), true);
      // CLI https URL wins over env
      const remote = resolveKvSource(
        "https://api.deno.com/v2/databases/xyz/connect",
      );
      assertEquals(
        remote.label.includes("https://api.deno.com/v2/databases/xyz/connect"),
        true,
      );
    } finally {
      if (prevId === undefined) Deno.env.delete("DENO_KV_DATABASE_ID");
      else Deno.env.set("DENO_KV_DATABASE_ID", prevId);
      if (prevUrl === undefined) Deno.env.delete("DENO_KV_URL");
      else Deno.env.set("DENO_KV_URL", prevUrl);
      if (prevToken === undefined) Deno.env.delete("DENO_KV_ACCESS_TOKEN");
      else Deno.env.set("DENO_KV_ACCESS_TOKEN", prevToken);
      if (prevApi === undefined) Deno.env.delete("DENO_KV_API_VERSION");
      else Deno.env.set("DENO_KV_API_VERSION", prevApi);
    }
  },
});

Deno.test({
  name: "persistence: close pool",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    await closeDb();
  },
});
