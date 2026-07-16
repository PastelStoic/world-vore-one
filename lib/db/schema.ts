// ---------------------------------------------------------------------------
// Drizzle schema – Neon-managed Postgres
// ---------------------------------------------------------------------------

import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import type {
  CharacterSheet,
  CharacterSnapshot,
} from "../character_types.ts";
import type { BattlePlayer, BattlerState } from "../battler_types.ts";

/** Minimal session user shape stored in sessions.user JSON. */
export interface SessionUserRow {
  id: string;
  username: string;
  avatar: string | null;
}

/** Full character sheet document + filter columns for indexed queries. */
export const characters = pgTable(
  "characters",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    /** Full CharacterSheet JSON (source of truth for app reads). */
    sheet: jsonb("sheet").$type<CharacterSheet>().notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("characters_user_id_idx").on(t.userId),
    index("characters_updated_at_idx").on(t.updatedAt),
  ],
);

/** Immutable character version snapshots (single key path – no dual denorm). */
export const characterSnapshots = pgTable(
  "character_snapshots",
  {
    snapshotId: text("snapshot_id").primaryKey(),
    characterId: text("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    timestamp: text("timestamp").notNull(),
    snapshot: jsonb("snapshot").$type<CharacterSnapshot>().notNull(),
  },
  (t) => [
    index("character_snapshots_character_id_idx").on(t.characterId),
    index("character_snapshots_char_ts_idx").on(t.characterId, t.timestamp),
  ],
);

/** Auth sessions with app-enforced expiry (read-time check). */
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  user: jsonb("user").$type<SessionUserRow>().notNull(),
  expiresAt: text("expires_at").notNull(),
});

/** Admin grants – one row per admin (username stored with the flag). */
export const admins = pgTable("admins", {
  userId: text("user_id").primaryKey(),
  username: text("username").notNull(),
});

/** Banned users – one row per ban. */
export const bans = pgTable("bans", {
  userId: text("user_id").primaryKey(),
  username: text("username").notNull(),
  bannedAt: text("banned_at").notNull(),
});

/**
 * App user profile (Discord id).
 * `validated` is anti-spam: true after a moderator-approved character (or grandfathered).
 */
export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey(),
  username: text("username").notNull(),
  /** False until first approved character (new accounts). */
  validated: boolean("validated").notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/** Multiplayer hex battles — UUID id is the public capability link. */
export const battles = pgTable(
  "battles",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(),
    name: text("name"),
    status: text("status").notNull(), // lobby | active | ended
    players: jsonb("players").$type<BattlePlayer[]>().notNull(),
    currentTurnIndex: integer("current_turn_index").notNull(),
    turnNumber: integer("turn_number").notNull(),
    state: jsonb("state").$type<BattlerState>().notNull(),
    stateRevision: integer("state_revision").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("battles_owner_id_idx").on(t.ownerId),
    index("battles_updated_at_idx").on(t.updatedAt),
  ],
);

export type CharacterRow = typeof characters.$inferSelect;
export type SnapshotRow = typeof characterSnapshots.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type AdminRow = typeof admins.$inferSelect;
export type BanRow = typeof bans.$inferSelect;
export type UserProfileRow = typeof userProfiles.$inferSelect;
export type BattleRow = typeof battles.$inferSelect;
