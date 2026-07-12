/**
 * One-shot migration: Deno KV → Neon Postgres.
 *
 * Prefer running this **from your laptop against production Deno Deploy KV**
 * (KV Connect) so data lands in Neon before you ship the Postgres-backed build.
 *
 * ## Production cutover (≈ few minutes downtime)
 *
 * 1. In Deno Deploy (new platform: console.deno.com) → org → Databases:
 *    copy the Deno KV **Database ID**.
 * 2. Create a personal or **organization** access token (`ddo_…`) from the
 *    org settings page (not an old Classic dash.deno.com token unless you
 *    still run Classic).
 * 3. Ensure Neon is ready and `NEON_CONNECTION_STRING` / `DATABASE_URL` works
 *    (same string you will set as a Deploy secret).
 * 4. Pre-copy (site still on old KV build — zero downtime):
 *      DENO_KV_ACCESS_TOKEN=ddo_...
 *      DENO_KV_DATABASE_ID=<uuid>
 *      # optional: DENO_KV_API_VERSION=classic  # only for Deploy Classic KV
 *      deno task migrate:kv:deploy
 *    The script prints a KV inventory first. If total=0, you pointed at the
 *    wrong / empty database (new Deploy does not auto-import Classic KV).
 * 5. Optional: flip Deploy to a static maintenance page / pause traffic.
 * 6. Final re-run (idempotent upserts catch anything written since step 4):
 *      deno task migrate:kv:deploy
 * 7. Deploy this branch + set Deploy env secrets:
 *      DATABASE_URL or NEON_CONNECTION_STRING = Neon connection string
 *    (no DENO_KV_* needed on the new app).
 * 8. Smoke-check login / a character / admin; restore traffic.
 *
 * ## "Bearer token is invalid"
 *
 * Almost always the **Classic** connect URL with a **new-platform** token.
 * This script defaults to `/v2/databases/.../connect`. Set
 * `DENO_KV_API_VERSION=classic` only if your data still lives on Deploy Classic.
 *
 * ## Usage
 *
 *   # Local / default Deno KV file:
 *   deno task migrate:kv
 *
 *   # Production Deploy KV → Neon (recommended cutover path):
 *   deno task migrate:kv:deploy
 *   # or:
 *   deno run --unstable-kv --env-file -A scripts/migrate_kv_to_postgres.ts
 *
 * ## KV source resolution (first match wins)
 *
 * 1. CLI arg: local file path OR full KV Connect URL
 *    (`https://api.deno.com/databases/<id>/connect`)
 * 2. `DENO_KV_URL` — full KV Connect URL
 * 3. `DENO_KV_DATABASE_ID` — UUID; opens
 *    `https://api.deno.com/v2/databases/<id>/connect` by default
 *    (requires `DENO_KV_ACCESS_TOKEN`; use `DENO_KV_API_VERSION=classic` for
 *    the old `/databases/<id>/connect` path)
 * 4. Else: `Deno.openKv()` default local store
 *
 * ## Postgres target
 *
 * `DATABASE_URL` or `NEON_CONNECTION_STRING`
 *
 * Re-runs are safe (ON CONFLICT DO UPDATE). Expired sessions are skipped.
 */

import { sql } from "drizzle-orm";
import { closeDb, ensureSchema, getDb } from "../lib/db/client.ts";
import {
  admins,
  bans,
  characterSnapshots,
  characters,
  sessions,
} from "../lib/db/schema.ts";
import type {
  CharacterSheet,
  CharacterSnapshot,
} from "../lib/character_types.ts";
import type { SessionUser } from "../lib/auth.ts";

const CHUNK = 100;

interface SessionData {
  user: SessionUser;
  expiresAt: number;
}

/** Placeholder owner for KV rows that never had a userId (orphan sheets). */
export const ORPHAN_USER_ID = "__orphaned__";

export interface MigrationCounts {
  characters: number;
  charactersRepairedUserId: number;
  charactersOrphanedUserId: number;
  snapshots: number;
  admins: number;
  bans: number;
  sessions: number;
  sessionsSkippedExpired: number;
}

async function bulkUpsertCharacters(
  rows: {
    id: string;
    userId: string;
    sheet: CharacterSheet;
    createdAt: string;
    updatedAt: string;
  }[],
) {
  if (rows.length === 0) return;
  const db = getDb();
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await db
      .insert(characters)
      .values(chunk)
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

async function bulkUpsertSnapshots(
  rows: {
    snapshotId: string;
    characterId: string;
    timestamp: string;
    snapshot: CharacterSnapshot;
  }[],
) {
  if (rows.length === 0) return;
  const db = getDb();
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await db
      .insert(characterSnapshots)
      .values(chunk)
      .onConflictDoUpdate({
        target: characterSnapshots.snapshotId,
        set: {
          characterId: sql`excluded.character_id`,
          timestamp: sql`excluded.timestamp`,
          snapshot: sql`excluded.snapshot`,
        },
      });
  }
}

async function bulkUpsertAdmins(
  rows: { userId: string; username: string }[],
) {
  if (rows.length === 0) return;
  const db = getDb();
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await db
      .insert(admins)
      .values(chunk)
      .onConflictDoUpdate({
        target: admins.userId,
        set: { username: sql`excluded.username` },
      });
  }
}

async function bulkUpsertBans(
  rows: { userId: string; username: string; bannedAt: string }[],
) {
  if (rows.length === 0) return;
  const db = getDb();
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await db
      .insert(bans)
      .values(chunk)
      .onConflictDoUpdate({
        target: bans.userId,
        set: {
          username: sql`excluded.username`,
          bannedAt: sql`excluded.banned_at`,
        },
      });
  }
}

async function bulkUpsertSessions(
  rows: { id: string; user: SessionUser; expiresAt: string }[],
) {
  if (rows.length === 0) return;
  const db = getDb();
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await db
      .insert(sessions)
      .values(chunk)
      .onConflictDoUpdate({
        target: sessions.id,
        set: {
          user: sql`excluded."user"`,
          expiresAt: sql`excluded.expires_at`,
        },
      });
  }
}

/**
 * Build characterId → userId from the denormalized by-user index.
 * Used to repair sheets that lost their userId field.
 */
async function loadUserIdByCharacterId(
  kv: Deno.Kv,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for await (
    const entry of kv.list<CharacterSheet>({ prefix: ["characters_by_user"] })
  ) {
    // ["characters_by_user", userId, characterId]
    if (entry.key.length < 3) continue;
    const userIdFromKey = entry.key[1];
    const charIdFromKey = entry.key[2];
    if (typeof userIdFromKey !== "string" || typeof charIdFromKey !== "string") {
      continue;
    }
    if (userIdFromKey && !map.has(charIdFromKey)) {
      map.set(charIdFromKey, userIdFromKey);
    }
    const fromValue = entry.value?.userId;
    if (typeof fromValue === "string" && fromValue && !map.has(charIdFromKey)) {
      map.set(charIdFromKey, fromValue);
    }
  }
  return map;
}

function resolveCharacterUserId(
  sheet: Partial<CharacterSheet>,
  characterId: string,
  userIdByCharacterId: Map<string, string>,
): { userId: string; repaired: boolean; orphaned: boolean } {
  const fromSheet = typeof sheet.userId === "string" ? sheet.userId.trim() : "";
  if (fromSheet) {
    return { userId: fromSheet, repaired: false, orphaned: false };
  }
  const fromIndex = userIdByCharacterId.get(characterId)?.trim() ?? "";
  if (fromIndex) {
    return { userId: fromIndex, repaired: true, orphaned: false };
  }
  return { userId: ORPHAN_USER_ID, repaired: true, orphaned: true };
}

export async function migrateKvToPostgres(
  kv: Deno.Kv,
): Promise<MigrationCounts> {
  await ensureSchema();

  const counts: MigrationCounts = {
    characters: 0,
    charactersRepairedUserId: 0,
    charactersOrphanedUserId: 0,
    snapshots: 0,
    admins: 0,
    bans: 0,
    sessions: 0,
    sessionsSkippedExpired: 0,
  };

  // ── Characters (primary key path only – skip dual write of by-user rows) ──
  const userIdByCharacterId = await loadUserIdByCharacterId(kv);
  const characterRows: {
    id: string;
    userId: string;
    sheet: CharacterSheet;
    createdAt: string;
    updatedAt: string;
  }[] = [];

  for await (
    const entry of kv.list<CharacterSheet>({ prefix: ["characters"] })
  ) {
    // Only direct id keys: ["characters", id]
    if (entry.key.length !== 2 || !entry.value) continue;
    const raw = entry.value;
    const characterId = (typeof raw.id === "string" && raw.id) ||
      String(entry.key[1]);
    if (!characterId) {
      console.warn("Skipping character with no id:", entry.key);
      continue;
    }

    const { userId, repaired, orphaned } = resolveCharacterUserId(
      raw,
      characterId,
      userIdByCharacterId,
    );
    if (repaired) {
      counts.charactersRepairedUserId += 1;
      console.warn(
        orphaned
          ? `Character ${characterId} (${raw.name ?? "?"}) has no userId; ` +
            `assigning ${ORPHAN_USER_ID}`
          : `Character ${characterId} (${raw.name ?? "?"}) missing userId; ` +
            `recovered from characters_by_user → ${userId}`,
      );
    }
    if (orphaned) counts.charactersOrphanedUserId += 1;

    const now = new Date().toISOString();
    const sheet: CharacterSheet = {
      ...raw,
      id: characterId,
      userId,
      createdAt: raw.createdAt || now,
      updatedAt: raw.updatedAt || raw.createdAt || now,
      latestSnapshotId: raw.latestSnapshotId ?? "",
    };

    characterRows.push({
      id: characterId,
      userId,
      sheet,
      createdAt: sheet.createdAt,
      updatedAt: sheet.updatedAt,
    });
  }
  await bulkUpsertCharacters(characterRows);
  counts.characters = characterRows.length;
  console.log(
    `Migrated characters: ${counts.characters}` +
      (counts.charactersRepairedUserId
        ? ` (repaired userId: ${counts.charactersRepairedUserId}, ` +
          `orphaned: ${counts.charactersOrphanedUserId})`
        : ""),
  );

  // ── Snapshots (by-id path only – avoid double-counting timestamp keys) ──
  const snapshotRows: {
    snapshotId: string;
    characterId: string;
    timestamp: string;
    snapshot: CharacterSnapshot;
  }[] = [];
  const seenSnapshotIds = new Set<string>();

  for await (
    const entry of kv.list<CharacterSnapshot>({
      prefix: ["character_snapshots_by_id"],
    })
  ) {
    // ["character_snapshots_by_id", characterId, snapshotId]
    if (entry.key.length !== 3 || !entry.value) continue;
    const snap = entry.value;
    if (seenSnapshotIds.has(snap.snapshotId)) continue;
    seenSnapshotIds.add(snap.snapshotId);
    snapshotRows.push({
      snapshotId: snap.snapshotId,
      characterId: snap.characterId,
      timestamp: snap.timestamp,
      snapshot: snap,
    });
  }

  // Fallback: if by-id index empty, read timestamp-keyed snapshots
  if (snapshotRows.length === 0) {
    for await (
      const entry of kv.list<CharacterSnapshot>({
        prefix: ["character_snapshots"],
      })
    ) {
      if (!entry.value) continue;
      const snap = entry.value;
      if (seenSnapshotIds.has(snap.snapshotId)) continue;
      seenSnapshotIds.add(snap.snapshotId);
      snapshotRows.push({
        snapshotId: snap.snapshotId,
        characterId: snap.characterId,
        timestamp: snap.timestamp,
        snapshot: snap,
      });
    }
  }

  // Characters must exist first (FK). Orphans are skipped with a warning.
  const characterIdSet = new Set(characterRows.map((r) => r.id));
  const validSnapshots = snapshotRows.filter((s) => {
    if (!characterIdSet.has(s.characterId)) {
      console.warn(
        `Skipping snapshot ${s.snapshotId}: missing character ${s.characterId}`,
      );
      return false;
    }
    return true;
  });
  await bulkUpsertSnapshots(validSnapshots);
  counts.snapshots = validSnapshots.length;
  console.log(`Migrated snapshots: ${counts.snapshots}`);

  // ── Admins ──────────────────────────────────────────────────────────
  const adminFlag = new Map<string, boolean>();
  const adminUsername = new Map<string, string>();

  for await (const entry of kv.list({ prefix: ["admins"] })) {
    if (entry.key.length === 2 && entry.value === true) {
      adminFlag.set(entry.key[1] as string, true);
    } else if (
      entry.key.length === 3 && entry.key[2] === "username" &&
      typeof entry.value === "string"
    ) {
      adminUsername.set(entry.key[1] as string, entry.value);
    }
  }
  const adminRows = [...adminFlag.keys()].map((userId) => ({
    userId,
    username: adminUsername.get(userId) ?? userId,
  }));
  await bulkUpsertAdmins(adminRows);
  counts.admins = adminRows.length;
  console.log(`Migrated admins: ${counts.admins}`);

  // ── Bans ────────────────────────────────────────────────────────────
  const banFlag = new Map<string, boolean>();
  const banUsername = new Map<string, string>();
  const banAt = new Map<string, string>();

  for await (const entry of kv.list({ prefix: ["bans"] })) {
    const userId = entry.key[1] as string;
    if (entry.key.length === 2 && entry.value === true) {
      banFlag.set(userId, true);
    } else if (
      entry.key.length === 3 && entry.key[2] === "username" &&
      typeof entry.value === "string"
    ) {
      banUsername.set(userId, entry.value);
    } else if (
      entry.key.length === 3 && entry.key[2] === "bannedAt" &&
      typeof entry.value === "string"
    ) {
      banAt.set(userId, entry.value);
    }
  }
  const banRows = [...banFlag.keys()].map((userId) => ({
    userId,
    username: banUsername.get(userId) ?? userId,
    bannedAt: banAt.get(userId) ?? new Date(0).toISOString(),
  }));
  await bulkUpsertBans(banRows);
  counts.bans = banRows.length;
  console.log(`Migrated bans: ${counts.bans}`);

  // ── Sessions (skip already-expired) ─────────────────────────────────
  const now = Date.now();
  const sessionRows: { id: string; user: SessionUser; expiresAt: string }[] =
    [];

  for await (
    const entry of kv.list<SessionData>({ prefix: ["sessions"] })
  ) {
    if (entry.key.length !== 2 || !entry.value) continue;
    const sessionId = entry.key[1] as string;
    const data = entry.value;
    if (data.expiresAt < now) {
      counts.sessionsSkippedExpired += 1;
      continue;
    }
    sessionRows.push({
      id: sessionId,
      user: data.user,
      expiresAt: new Date(data.expiresAt).toISOString(),
    });
  }
  await bulkUpsertSessions(sessionRows);
  counts.sessions = sessionRows.length;
  console.log(
    `Migrated sessions: ${counts.sessions} (skipped expired: ${counts.sessionsSkippedExpired})`,
  );

  return counts;
}

/**
 * Build a Deno Deploy KV Connect URL for a database UUID.
 *
 * New Deno Deploy (console.deno.com / org+app) uses:
 *   https://api.deno.com/v2/databases/<id>/connect
 * Deploy Classic (dash.deno.com, sunsetting) uses:
 *   https://api.deno.com/databases/<id>/connect
 *
 * Using the Classic URL with a new-platform token yields:
 *   "The bearer token is invalid."
 *
 * Override with DENO_KV_API_VERSION=classic|v2 (default: v2).
 */
export function buildDeployKvConnectUrl(databaseId: string): string {
  const version = (Deno.env.get("DENO_KV_API_VERSION") ?? "v2").toLowerCase();
  if (version === "classic" || version === "v1" || version === "1") {
    return `https://api.deno.com/databases/${databaseId}/connect`;
  }
  return `https://api.deno.com/v2/databases/${databaseId}/connect`;
}

/**
 * Resolve which KV to open for migration (Deploy remote or local file).
 * Exported for tests / cutover helpers.
 */
export function resolveKvSource(cliArg?: string): {
  label: string;
  open: () => Promise<Deno.Kv>;
} {
  const arg = cliArg?.trim();
  if (arg) {
    if (arg.startsWith("https://")) {
      return {
        label: `remote KV Connect: ${arg}`,
        open: () => Deno.openKv(arg),
      };
    }
    return {
      label: `local KV file: ${arg}`,
      open: () => Deno.openKv(arg),
    };
  }

  const kvUrl = Deno.env.get("DENO_KV_URL")?.trim();
  if (kvUrl) {
    return {
      label: `remote KV Connect (DENO_KV_URL): ${kvUrl}`,
      open: () => Deno.openKv(kvUrl),
    };
  }

  const dbId = Deno.env.get("DENO_KV_DATABASE_ID")?.trim();
  if (dbId) {
    const token = Deno.env.get("DENO_KV_ACCESS_TOKEN")?.trim();
    if (!token) {
      throw new Error(
        "DENO_KV_DATABASE_ID is set but DENO_KV_ACCESS_TOKEN is missing.\n" +
          "Create a personal or organization access token in the Deno Deploy " +
          "console (token prefix is typically ddo_ on the new platform).",
      );
    }
    const url = buildDeployKvConnectUrl(dbId);
    return {
      label: `remote Deno Deploy KV (database ${dbId}) → ${url}`,
      open: () => Deno.openKv(url),
    };
  }

  return {
    label: "default local Deno KV store",
    open: () => Deno.openKv(),
  };
}

/** Quick inventory of top-level key prefixes (for cutover diagnostics). */
export async function summarizeKv(kv: Deno.Kv, limit = 10_000): Promise<{
  total: number;
  byRoot: Record<string, number>;
  truncated: boolean;
}> {
  const byRoot = new Map<string, number>();
  let total = 0;
  let truncated = false;
  for await (const entry of kv.list({ prefix: [] })) {
    total += 1;
    const root = String(entry.key[0] ?? "(empty)");
    byRoot.set(root, (byRoot.get(root) ?? 0) + 1);
    if (total >= limit) {
      truncated = true;
      break;
    }
  }
  return {
    total,
    byRoot: Object.fromEntries(
      [...byRoot.entries()].sort((a, b) => b[1] - a[1]),
    ),
    truncated,
  };
}

// ── CLI entry ─────────────────────────────────────────────────────────

if (import.meta.main) {
  const inventoryOnly = Deno.args.includes("--inventory") ||
    Deno.args.includes("--dry-run");
  const positional = Deno.args.find((a) => !a.startsWith("-"));
  const source = resolveKvSource(positional);
  console.log(`Opening ${source.label}…`);

  // Fail fast with a clear message if Deploy token is required but broken
  let kv: Deno.Kv;
  try {
    kv = await source.open();
  } catch (err) {
    console.error("Failed to open KV source:", err);
    console.error(
      "\nFor production Deploy KV (new platform) you need:\n" +
        "  DENO_KV_ACCESS_TOKEN  – personal/org token (ddo_…) from console.deno.com\n" +
        "  DENO_KV_DATABASE_ID   – UUID from org → Databases\n" +
        "  (script uses /v2/…/connect; set DENO_KV_API_VERSION=classic for Classic)\n" +
        "Or set DENO_KV_URL to the full connect URL.\n" +
        "Plus DATABASE_URL or NEON_CONNECTION_STRING for the Neon target.\n\n" +
        "If you still see bearer token invalid: regenerate the token, ensure it\n" +
        "is from the same platform as the database (new vs Classic), and avoid\n" +
        "wrapping the value in quotes that get stored as part of the secret.",
    );
    Deno.exit(1);
  }

  try {
    console.log("Scanning KV inventory…");
    const summary = await summarizeKv(kv);
    console.log(
      `KV inventory: total=${summary.total}` +
        (summary.truncated ? " (truncated)" : ""),
    );
    console.log("By root prefix:", JSON.stringify(summary.byRoot, null, 2));

    if (summary.total === 0) {
      console.error(
        "\nThis KV database is empty. Migration would write nothing.\n" +
          "Common causes on the new Deno Deploy platform:\n" +
          "  • Wrong Database ID (check org → Databases, not a fresh unused DB)\n" +
          "  • Production data still on Deploy Classic — Classic KV is NOT\n" +
          "    auto-migrated; use DENO_KV_API_VERSION=classic + Classic DB id,\n" +
          "    or ask support@deno.com to move Classic KV, then re-point here\n" +
          "  • App never wrote to this assigned KV instance\n",
      );
      Deno.exit(2);
    }

    if (inventoryOnly) {
      console.log("\n--inventory / --dry-run: skipping Postgres writes.");
      Deno.exit(0);
    }

    const counts = await migrateKvToPostgres(kv);
    console.log("\nMigration complete:");
    console.log(JSON.stringify(counts, null, 2));
    console.log(
      "\nNext: set DATABASE_URL (or NEON_CONNECTION_STRING) on Deno Deploy,\n" +
        "re-run this once more if the old app still wrote data, then deploy\n" +
        "the Postgres-backed build.",
    );
  } finally {
    kv.close();
    await closeDb();
  }
}
