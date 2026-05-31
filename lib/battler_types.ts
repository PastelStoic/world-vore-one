/** Battler domain types (client-only for v1). */

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
  /** Short single-letter label (A, B, C...) mainly for dummy NPCs so identical names are distinguishable on the grid. */
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

export interface BattlerState {
  version: 1;
  combatants: Combatant[];
  /** coordKey ("q:r") -> combatantId */
  placedCharacters: Record<string, string>;
  /** coordKey ("q:r") -> Cover */
  covers: Record<string, Cover>;
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
