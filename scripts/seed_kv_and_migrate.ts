/**
 * Disposable helper: seed a KV file, migrate twice, assert via shipped getters.
 * Used for verification evidence (not production).
 *
 *   deno run --unstable-kv --env-file -A scripts/seed_kv_and_migrate.ts <kv-path>
 */

import { eq, sql } from "drizzle-orm";
import { migrateKvToPostgres } from "./migrate_kv_to_postgres.ts";
import {
  createDefaultCharacterDraft,
  type CharacterSheet,
} from "../lib/character_types.ts";
import { closeDb, getDb } from "../lib/db/client.ts";
import { characters } from "../lib/db/schema.ts";
import {
  getCharacter,
  listCharacterSnapshots,
} from "../lib/character_db.ts";
import { isAdmin, isUserBanned } from "../lib/admin.ts";
import { getSession } from "../lib/auth.ts";

const kvPath = Deno.args[0];
if (!kvPath) {
  console.error("Usage: seed_kv_and_migrate.ts <kv-path>");
  Deno.exit(1);
}

const kv = await Deno.openKv(kvPath);
const prefix = `cli-mig-${crypto.randomUUID().slice(0, 8)}`;
const userId = `${prefix}-u`;
const charId = `${prefix}-c`;
const snapId = `${prefix}-s`;
const adminId = `${prefix}-a`;
const banId = `${prefix}-b`;
const sessId = `${prefix}-sess`;
const now = new Date().toISOString();

const sheet: CharacterSheet = {
  ...createDefaultCharacterDraft(),
  name: "CLI Migrated",
  id: charId,
  userId,
  latestSnapshotId: snapId,
  createdAt: now,
  updatedAt: now,
};
const snapshot = {
  snapshotId: snapId,
  characterId: charId,
  timestamp: now,
  changelog: "cli seed",
  data: {
    name: sheet.name,
    race: sheet.race,
    description: sheet.description,
    baseStats: sheet.baseStats,
    unallocatedStatPoints: sheet.unallocatedStatPoints,
    perkIds: sheet.perkIds,
  },
};

await kv.set(["characters", charId], sheet);
await kv.set(["characters_by_user", userId, charId], sheet);
await kv.set(["character_snapshots_by_id", charId, snapId], snapshot);
await kv.set(["admins", adminId], true);
await kv.set(["admins", adminId, "username"], "CliAdmin");
await kv.set(["bans", banId], true);
await kv.set(["bans", banId, "username"], "CliBan");
await kv.set(["bans", banId, "bannedAt"], now);
await kv.set(["sessions", sessId], {
  user: { id: userId, username: "cli", avatar: null },
  expiresAt: Date.now() + 86_400_000,
});

const c1 = await migrateKvToPostgres(kv);
console.log("FIRST_RUN", JSON.stringify(c1));
const c2 = await migrateKvToPostgres(kv);
console.log("SECOND_RUN", JSON.stringify(c2));

const got = await getCharacter(charId);
console.log("CHARACTER", got?.name, got?.userId);
const snaps = await listCharacterSnapshots(charId);
console.log("SNAPSHOTS", snaps.length, snaps[0]?.changelog);
console.log("ADMIN", await isAdmin(adminId));
console.log("BANNED", await isUserBanned(banId));
console.log("SESSION", (await getSession(sessId))?.id);

const db = getDb();
const rows = await db.select().from(characters).where(eq(characters.id, charId));
console.log("PK_COUNT", rows.length);

// cleanup test rows
await db.execute(sql`DELETE FROM characters WHERE id = ${charId}`);
await db.execute(sql`DELETE FROM admins WHERE user_id = ${adminId}`);
await db.execute(sql`DELETE FROM bans WHERE user_id = ${banId}`);
await db.execute(sql`DELETE FROM sessions WHERE id = ${sessId}`);

kv.close();
await closeDb();
console.log("OK");
