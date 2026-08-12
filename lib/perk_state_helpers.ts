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
import { parseInventory } from "./inventory_parsing.ts";

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

/**
 * Perk IDs granted by other owned perks, player selections, or the
 * current faction — not the purchased IDs themselves.
 *
 * Walks `includesPerks` recursively so nested grants stay derived.
 */
export function collectGrantedPerkIds(
  perkIds: string[],
  perkSelections?: Record<string, string[]>,
  faction?: string,
  perkOrigins?: Record<string, PerkOrigin>,
): Set<string> {
  const derived = new Set<string>();
  const queue = [...perkIds];

  if (perkSelections) {
    for (const selectedIds of Object.values(perkSelections)) {
      for (const id of selectedIds) {
        if (derived.has(id)) continue;
        derived.add(id);
        queue.push(id);
      }
    }
  }

  if (faction) {
    for (
      const id of FACTION_DEFINITIONS_BY_ID.get(faction)?.grantsPerkIds ?? []
    ) {
      if (perkOrigins?.[id] !== "faction" || derived.has(id)) continue;
      derived.add(id);
      queue.push(id);
    }
  }

  while (queue.length > 0) {
    const perkId = queue.shift();
    if (!perkId) continue;

    for (const includedId of PERKS_BY_ID.get(perkId)?.includesPerks ?? []) {
      if (derived.has(includedId)) continue;
      derived.add(includedId);
      queue.push(includedId);
    }
  }

  return derived;
}

export function normalizePerkIds(
  perkIds: string[],
  perkSelections?: Record<string, string[]>,
  faction?: string,
  perkOrigins?: Record<string, PerkOrigin>,
): string[] {
  const granted = collectGrantedPerkIds(
    perkIds,
    perkSelections,
    faction,
    perkOrigins,
  );
  const normalized = new Set(perkIds);
  for (const id of granted) normalized.add(id);
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

/** Normalize perk IDs and re-parse inventory so stored blobs cannot drop fields. */
export function normalizeLoadedDraft<T extends CharacterDraft>(
  character: T,
): T {
  const withPerks = normalizeCharacterPerkIds(character);
  if (!withPerks.inventory) return withPerks;

  const inventory = parseInventory(withPerks.inventory);
  if (!inventory) return withPerks;

  if (inventory === withPerks.inventory) return withPerks;
  return { ...withPerks, inventory };
}
