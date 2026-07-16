/** Pure BattlerState mutators — no DOM / network. */

import {
  type AxialCoord,
  type BattlerState,
  type Combatant,
  type CoverType,
  coordKey,
  TEAM_ORDER,
} from "./battler_types.ts";

export function getNextAvailableLabel(combatants: Combatant[]): string {
  const used = new Set(
    combatants
      .map((c) => c.label)
      .filter((l): l is string => Boolean(l)),
  );

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    if (!used.has(letter)) return letter;
  }
  return "Z";
}

export function addCombatant(
  state: BattlerState,
  combatant: Combatant,
): BattlerState {
  return {
    ...state,
    combatants: [...state.combatants, combatant],
  };
}

export function cycleTeam(state: BattlerState, id: string): BattlerState {
  return {
    ...state,
    combatants: state.combatants.map((c) =>
      c.id === id
        ? {
          ...c,
          team: TEAM_ORDER[(TEAM_ORDER.indexOf(c.team) + 1) % TEAM_ORDER.length],
        }
        : c
    ),
  };
}

export function adjustHealth(
  state: BattlerState,
  id: string,
  delta: number,
): BattlerState {
  return {
    ...state,
    combatants: state.combatants.map((c) => {
      if (c.id !== id) return c;
      const next = Math.max(
        0,
        Math.min(c.maxHealth, c.currentHealth + delta),
      );
      return { ...c, currentHealth: next };
    }),
  };
}

export function setCombatantName(
  state: BattlerState,
  id: string,
  name: string,
): BattlerState {
  return {
    ...state,
    combatants: state.combatants.map((c) =>
      c.id === id ? { ...c, name } : c
    ),
  };
}

export function setCombatantMaxHealth(
  state: BattlerState,
  id: string,
  maxHealth: number,
): BattlerState {
  const max = Math.max(1, Math.floor(maxHealth));
  return {
    ...state,
    combatants: state.combatants.map((c) => {
      if (c.id !== id) return c;
      return {
        ...c,
        maxHealth: max,
        currentHealth: Math.min(c.currentHealth, max),
      };
    }),
  };
}

export function removeCombatant(
  state: BattlerState,
  id: string,
): BattlerState {
  const placedCharacters: Record<string, string> = {};
  for (const [k, v] of Object.entries(state.placedCharacters)) {
    if (v !== id) placedCharacters[k] = v;
  }
  return {
    ...state,
    combatants: state.combatants.filter((c) => c.id !== id),
    placedCharacters,
  };
}

/**
 * Place or move a combatant onto a hex.
 * Refuses if another combatant already occupies the hex.
 * Returns same state reference if rejected.
 */
export function placeCombatantOnHex(
  state: BattlerState,
  combatantId: string,
  hex: AxialCoord,
): BattlerState {
  const key = coordKey(hex);
  const occupant = state.placedCharacters[key];
  if (occupant && occupant !== combatantId) {
    return state;
  }

  const placedCharacters: Record<string, string> = {};
  for (const [k, v] of Object.entries(state.placedCharacters)) {
    if (v !== combatantId) placedCharacters[k] = v;
  }
  placedCharacters[key] = combatantId;
  return { ...state, placedCharacters };
}

export function removeFromGrid(
  state: BattlerState,
  combatantId: string,
): BattlerState {
  const placedCharacters: Record<string, string> = {};
  for (const [k, v] of Object.entries(state.placedCharacters)) {
    if (v !== combatantId) placedCharacters[k] = v;
  }
  return { ...state, placedCharacters };
}

export function placeCoverOnHex(
  state: BattlerState,
  type: CoverType,
  hex: AxialCoord,
  coverId: string = crypto.randomUUID(),
): BattlerState {
  const key = coordKey(hex);
  const defaultPassable = type === "weak" || type === "middling";
  return {
    ...state,
    covers: {
      ...state.covers,
      [key]: {
        id: coverId,
        type,
        passable: defaultPassable,
      },
    },
  };
}

export function removeCover(
  state: BattlerState,
  hexKey: string,
): BattlerState {
  if (!(hexKey in state.covers)) return state;
  const covers = { ...state.covers };
  delete covers[hexKey];
  return { ...state, covers };
}

export function setCoverPassable(
  state: BattlerState,
  hexKey: string,
  passable: boolean,
): BattlerState {
  const cover = state.covers[hexKey];
  if (!cover) return state;
  return {
    ...state,
    covers: {
      ...state.covers,
      [hexKey]: { ...cover, passable },
    },
  };
}

export function statesEqual(a: BattlerState, b: BattlerState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
