// ---------------------------------------------------------------------------
// Shared draft validation helpers
//
// Pure functions used by both the server-side form validation and the
// client-side CharacterSheetEditor to ensure a single source of truth for
// character sheet rules.
// ---------------------------------------------------------------------------

import type { PerkDefinition } from "@/data/perks.ts";
import { getStatCap } from "./stat_calculations.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDraft,
  type Race,
  type Sex,
} from "./character_types.ts";

// ── Stat floor ──────────────────────────────────────────────────────────────

/**
 * Return the absolute minimum value a base stat is allowed to have given the
 * character's current perks.  This is the validation floor used by both the
 * server-side parser and the client-side editor.
 *
 * The editor may impose a *higher* floor for approved-character edits (e.g.
 * preventing stats from going below their initial values), but the value
 * returned here is the hard minimum.
 */
export function getStatFloor(
  statKey: BaseStatKey,
  perkIds: string[],
): number {
  if (
    statKey === "digestionStrength" &&
    perkIds.includes("extremely-inefficient-digestion")
  ) {
    return -4;
  }
  return 1;
}

// ── Stat cap validation ─────────────────────────────────────────────────────

/**
 * Validate that every base stat respects the caps imposed by the character's
 * perks (e.g. Speisfraun caps STR/DEX to 1).  Returns an error message or
 * null.
 */
export function validateStatCaps(draft: CharacterDraft): string | null {
  for (const field of BASE_STAT_FIELDS) {
    const cap = getStatCap(draft, field.key);
    if (cap !== undefined && draft.baseStats[field.key] > cap) {
      return `Stat "${field.label}" exceeds its cap of ${cap}.`;
    }
  }
  return null;
}

// ── Perk eligibility ────────────────────────────────────────────────────────

export interface PerkEligibilityContext {
  race: Race;
  sex: Sex;
  faction: string;
  ownedPerkIds: string[];
  derivedPerkIds: ReadonlySet<string>;
  perksById: ReadonlyMap<string, PerkDefinition>;
  accountPerkCounts?: ReadonlyMap<string, number>;
}

/**
 * Check whether a single perk is eligible to be added to a character given
 * their current state.  This is the single source of truth for the rules
 * that govern which perks appear in the editor's "Add Perk" picker and that
 * the server enforces via {@link validatePerkRequirements} in data/perks.ts.
 *
 * Rules checked:
 * - Not already owned or derived
 * - Race / sex / faction requirements
 * - Lock category (at most one per category)
 * - Mutual exclusion (excludesPerks, checked in both directions)
 */
export function isPerkEligible(
  perk: PerkDefinition,
  ctx: PerkEligibilityContext,
): boolean {
  // Already owned or derived
  if (ctx.ownedPerkIds.includes(perk.id)) return false;
  if (ctx.derivedPerkIds.has(perk.id)) return false;

  // Race restriction
  if (perk.requiredRaces && !perk.requiredRaces.includes(ctx.race)) {
    return false;
  }

  // Sex restriction
  if (perk.requiredSex && !perk.requiredSex.includes(ctx.sex)) {
    return false;
  }

  // Faction restriction
  if (perk.requiredFaction) {
    const factions = Array.isArray(perk.requiredFaction)
      ? perk.requiredFaction
      : [perk.requiredFaction];
    if (!factions.includes(ctx.faction as typeof factions[number])) {
      return false;
    }
  }

  if (
    perk.maxCharactersPerAccount !== undefined &&
    (ctx.accountPerkCounts?.get(perk.id) ?? 0) >= perk.maxCharactersPerAccount
  ) {
    return false;
  }

  // Lock category — only one perk per lock category
  if (perk.lockCategory) {
    for (const id of ctx.ownedPerkIds) {
      const owned = ctx.perksById.get(id);
      if (owned?.lockCategory === perk.lockCategory) return false;
    }
  }

  // Excluded by this perk's excludesPerks
  if (perk.excludesPerks?.some((id) => ctx.ownedPerkIds.includes(id))) {
    return false;
  }

  // Excluded BY a currently-owned perk
  for (const id of ctx.ownedPerkIds) {
    const owned = ctx.perksById.get(id);
    if (owned?.excludesPerks?.includes(perk.id)) return false;
  }

  return true;
}
