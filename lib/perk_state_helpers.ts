// ---------------------------------------------------------------------------
// Perk state cleanup helpers
// ---------------------------------------------------------------------------

import type { BaseStatKey } from "./character_types.ts";

/**
 * The six perk customization state maps that live on CharacterDraft.
 */
export interface PerkCustomizationState {
  perkNotes: Record<string, string>;
  perkUpgradeNotes: Record<string, string[]>;
  perkStatChoices: Record<string, BaseStatKey[]>;
  perkRanks: Record<string, number>;
  perkDisguises: Record<string, string>;
  perkSelections: Record<string, string[]>;
}

/**
 * Remove all perk-related metadata for the given IDs from each of the
 * six customization maps. Returns a new object (does not mutate inputs).
 */
export function cleanupPerkData<K extends keyof PerkCustomizationState>(
  state: Pick<PerkCustomizationState, K>,
  removedIds: string[],
): Pick<PerkCustomizationState, K> {
  const result = {} as Pick<PerkCustomizationState, K>;
  for (const key of Object.keys(state) as K[]) {
    const obj = { ...state[key] };
    for (const id of removedIds) {
      delete (obj as Record<string, unknown>)[id];
    }
    result[key] = obj;
  }
  return result;
}
