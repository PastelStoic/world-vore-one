/** Battler domain types — shared client/server. */

export type CoverType = "weak" | "middling" | "strong" | "fortified";

export interface AxialCoord {
  q: number;
  r: number;
}

export interface Combatant {
  id: string; // crypto.randomUUID()
  name: string;
  currentHealth: number;
  maxHealth: number;
  team: "allies" | "enemies" | "neutral";
  /** Short single-letter label (A, B, C...) mainly for dummy NPCs. */
  label?: string;
  /** Original character sheet id when imported from the site. */
  characterId?: string;
}

/**
 * Shape of a character returned by /api/battler/available-characters
 * for use in the import modal.
 */
export interface ImportableCharacter {
  id: string;
  name: string;
  maxHealth: number;
  race: string;
  imageId?: string;
  status: string;
}

export interface Cover {
  id: string;
  type: CoverType;
  passable: boolean;
}

/** Committed board state (local sandbox + online battle `state` column). */
export interface BattlerState {
  version: 1;
  combatants: Combatant[];
  /** coordKey ("q:r") -> combatantId */
  placedCharacters: Record<string, string>;
  /** coordKey ("q:r") -> Cover */
  covers: Record<string, Cover>;
}

export type BattleStatus = "lobby" | "active" | "ended";

export interface BattlePlayer {
  userId: string;
  username: string;
  joinedAt: string;
}

/** Full room snapshot returned by GET /api/battler/battles/:id (public). */
export interface BattleRoom {
  id: string;
  ownerId: string;
  name: string | null;
  status: BattleStatus;
  players: BattlePlayer[];
  currentTurnIndex: number;
  turnNumber: number;
  state: BattlerState;
  stateRevision: number;
  createdAt: string;
  updatedAt: string;
}

export type ToolMode = "select" | "place-cover";

export const COVER_LABELS: Record<CoverType, string> = {
  weak: "Weak (Wire/Crates)",
  middling: "Middling (Sandbags)",
  strong: "Strong (Trench)",
  fortified: "Fortified (Bunker)",
};

export const TEAM_COLORS: Record<Combatant["team"], string> = {
  allies: "#3b82f6", // blue-500
  enemies: "#ef4444", // red-500
  neutral: "#6b7280", // gray-500
};

export const TEAM_ORDER: Combatant["team"][] = [
  "allies",
  "enemies",
  "neutral",
];

export function createEmptyBattlerState(): BattlerState {
  return {
    version: 1,
    combatants: [],
    placedCharacters: {},
    covers: {},
  };
}

/** Stable string key for a hex coord. */
export function coordKey(c: AxialCoord): string {
  return `${c.q}:${c.r}`;
}

export function parseCoordKey(key: string): AxialCoord {
  const [q, r] = key.split(":").map(Number);
  return { q: q || 0, r: r || 0 };
}

export function cloneBattlerState(state: BattlerState): BattlerState {
  return structuredClone(state);
}

const COVER_TYPES = new Set<CoverType>([
  "weak",
  "middling",
  "strong",
  "fortified",
]);

const TEAMS = new Set<Combatant["team"]>(["allies", "enemies", "neutral"]);

/** Validate and normalize a board state blob from the client. Returns null if invalid. */
export function parseBattlerState(raw: unknown): BattlerState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== 1) return null;
  if (!Array.isArray(o.combatants)) return null;
  if (
    typeof o.placedCharacters !== "object" || o.placedCharacters === null ||
    Array.isArray(o.placedCharacters)
  ) {
    return null;
  }
  if (
    typeof o.covers !== "object" || o.covers === null || Array.isArray(o.covers)
  ) {
    return null;
  }

  const combatants: Combatant[] = [];
  for (const c of o.combatants) {
    if (!c || typeof c !== "object") return null;
    const row = c as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id) return null;
    if (typeof row.name !== "string") return null;
    if (typeof row.currentHealth !== "number" || !Number.isFinite(row.currentHealth)) {
      return null;
    }
    if (typeof row.maxHealth !== "number" || !Number.isFinite(row.maxHealth)) {
      return null;
    }
    if (typeof row.team !== "string" || !TEAMS.has(row.team as Combatant["team"])) {
      return null;
    }
    const combatant: Combatant = {
      id: row.id,
      name: row.name,
      currentHealth: row.currentHealth,
      maxHealth: row.maxHealth,
      team: row.team as Combatant["team"],
    };
    if (typeof row.label === "string") combatant.label = row.label;
    if (typeof row.characterId === "string") {
      combatant.characterId = row.characterId;
    }
    combatants.push(combatant);
  }

  const placedCharacters: Record<string, string> = {};
  for (const [k, v] of Object.entries(o.placedCharacters as Record<string, unknown>)) {
    if (typeof v !== "string") return null;
    if (!/^-?\d+:-?\d+$/.test(k)) return null;
    placedCharacters[k] = v;
  }

  const covers: Record<string, Cover> = {};
  for (const [k, v] of Object.entries(o.covers as Record<string, unknown>)) {
    if (!/^-?\d+:-?\d+$/.test(k)) return null;
    if (!v || typeof v !== "object") return null;
    const cov = v as Record<string, unknown>;
    if (typeof cov.id !== "string") return null;
    if (typeof cov.type !== "string" || !COVER_TYPES.has(cov.type as CoverType)) {
      return null;
    }
    if (typeof cov.passable !== "boolean") return null;
    covers[k] = {
      id: cov.id,
      type: cov.type as CoverType,
      passable: cov.passable,
    };
  }

  return {
    version: 1,
    combatants,
    placedCharacters,
    covers,
  };
}
