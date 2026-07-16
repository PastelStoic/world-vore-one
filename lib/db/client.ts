// ---------------------------------------------------------------------------
// Database client – Neon Postgres via Drizzle + postgres.js
// ---------------------------------------------------------------------------

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

export type Db = PostgresJsDatabase<typeof schema>;

let _sql: ReturnType<typeof postgres> | null = null;
let _db: Db | null = null;

/** Resolve connection string from DATABASE_URL or legacy NEON_CONNECTION_STRING. */
export function getDatabaseUrl(): string {
  const url = Deno.env.get("DATABASE_URL") ??
    Deno.env.get("NEON_CONNECTION_STRING") ??
    "";
  if (!url) {
    throw new Error(
      "DATABASE_URL (or NEON_CONNECTION_STRING) is not set",
    );
  }
  return url;
}

/**
 * Singleton Drizzle client. Uses a small connection pool suitable for
 * Deno/serverless-style usage against Neon (pooler URL preferred).
 */
export function getDb(): Db {
  if (_db) return _db;

  const url = getDatabaseUrl();
  // max: 1 keeps round-trips low and plays well with Neon pooler / serverless
  _sql = postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 30,
    prepare: false, // required for Neon connection pooler (PgBouncer transaction mode)
  });
  _db = drizzle(_sql, { schema });
  return _db;
}

/** Close the underlying pool (tests / migration scripts). */
export async function closeDb(): Promise<void> {
  if (_sql) {
    await _sql.end({ timeout: 5 });
    _sql = null;
    _db = null;
  }
}

/**
 * Create all tables/indexes if missing. Idempotent – safe to call on boot
 * and from migration scripts / tests.
 */
export async function ensureSchema(): Promise<void> {
  const sql = _sql ?? (() => {
    getDb();
    return _sql!;
  })();

  // Suppress "already exists, skipping" NOTICEs on re-runs
  await sql.unsafe(`SET client_min_messages TO WARNING`);
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS characters (
      id text PRIMARY KEY,
      user_id text NOT NULL,
      sheet jsonb NOT NULL,
      created_at text NOT NULL,
      updated_at text NOT NULL
    );
    CREATE INDEX IF NOT EXISTS characters_user_id_idx ON characters (user_id);
    CREATE INDEX IF NOT EXISTS characters_updated_at_idx ON characters (updated_at);

    CREATE TABLE IF NOT EXISTS character_snapshots (
      snapshot_id text PRIMARY KEY,
      character_id text NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      timestamp text NOT NULL,
      snapshot jsonb NOT NULL
    );
    CREATE INDEX IF NOT EXISTS character_snapshots_character_id_idx
      ON character_snapshots (character_id);
    CREATE INDEX IF NOT EXISTS character_snapshots_char_ts_idx
      ON character_snapshots (character_id, timestamp);

    CREATE TABLE IF NOT EXISTS sessions (
      id text PRIMARY KEY,
      "user" jsonb NOT NULL,
      expires_at text NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      user_id text PRIMARY KEY,
      username text NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bans (
      user_id text PRIMARY KEY,
      username text NOT NULL,
      banned_at text NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id text PRIMARY KEY,
      username text NOT NULL,
      validated boolean NOT NULL DEFAULT false,
      created_at text NOT NULL,
      updated_at text NOT NULL
    );
    CREATE INDEX IF NOT EXISTS user_profiles_validated_idx
      ON user_profiles (validated);

    -- Grandfather existing accounts as validated so nobody is locked out.
    -- ON CONFLICT DO NOTHING: never overwrite a profile created at login (default false).
    INSERT INTO user_profiles (user_id, username, validated, created_at, updated_at)
    SELECT DISTINCT c.user_id, c.user_id, true, now()::text, now()::text
    FROM characters c
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO user_profiles (user_id, username, validated, created_at, updated_at)
    SELECT a.user_id, a.username, true, now()::text, now()::text
    FROM admins a
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO user_profiles (user_id, username, validated, created_at, updated_at)
    SELECT b.user_id, b.username, true, now()::text, now()::text
    FROM bans b
    ON CONFLICT (user_id) DO NOTHING;

    -- Note: do NOT seed from sessions — a brand-new login would create a session
    -- before ensureUserProfile runs, and would incorrectly grandfather that user.

    CREATE TABLE IF NOT EXISTS battles (
      id text PRIMARY KEY,
      owner_id text NOT NULL,
      name text,
      status text NOT NULL,
      players jsonb NOT NULL,
      current_turn_index integer NOT NULL,
      turn_number integer NOT NULL,
      state jsonb NOT NULL,
      state_revision integer NOT NULL,
      created_at text NOT NULL,
      updated_at text NOT NULL
    );
    CREATE INDEX IF NOT EXISTS battles_owner_id_idx ON battles (owner_id);
    CREATE INDEX IF NOT EXISTS battles_updated_at_idx ON battles (updated_at);
  `);
}
