// ---------------------------------------------------------------------------
// Perk state cleanup helpers
// ---------------------------------------------------------------------------

import { FACTION_DEFINITIONS_BY_ID } from "@/data/factions.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
import type {
  BaseStatKey,
  CharacterDraft,
  PerkOrigin,
} from "./character_types.ts";

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
  perkPointChoices: Record<string, number>;
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

export function normalizePerkIds(
  perkIds: string[],
  perkSelections?: Record<string, string[]>,
  faction?: string,
  perkOrigins?: Record<string, PerkOrigin>,
): string[] {
  const normalized = new Set(perkIds);
  const queue = [...perkIds];

  if (perkSelections) {
    for (const selectedIds of Object.values(perkSelections)) {
      for (const id of selectedIds) {
        if (normalized.has(id)) continue;
        normalized.add(id);
        queue.push(id);
      }
    }
  }

  if (faction) {
    for (
      const id of FACTION_DEFINITIONS_BY_ID.get(faction)?.grantsPerkIds ?? []
    ) {
      if (perkOrigins?.[id] !== "faction" || normalized.has(id)) continue;
      normalized.add(id);
      queue.push(id);
    }
  }

  while (queue.length > 0) {
    const perkId = queue.shift();
    if (!perkId) continue;

    for (const includedId of PERKS_BY_ID.get(perkId)?.includesPerks ?? []) {
      if (normalized.has(includedId)) continue;
      normalized.add(includedId);
      queue.push(includedId);
    }
  }

  return [...normalized];
}

export function normalizeCharacterPerkIds<T extends CharacterDraft>(
  character: T,
): T {
  const perkIds = normalizePerkIds(
    character.perkIds,
    character.perkSelections,
    character.description.faction,
    character.perkOrigins,
  );

  if (
    perkIds.length === character.perkIds.length &&
    perkIds.every((id, index) => id === character.perkIds[index])
  ) {
    return character;
  }

  return {
    ...character,
    perkIds,
  };
}
