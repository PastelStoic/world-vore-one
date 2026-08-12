// ---------------------------------------------------------------------------
// Shared draft validation helpers
//
// Pure functions used by both the server-side form validation and the
// client-side CharacterSheetEditor to ensure a single source of truth for
// character sheet rules.
// ---------------------------------------------------------------------------

import { type PerkDefinition, PERKS_BY_ID } from "@/data/perks.ts";
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
    perkIds.includes("japanese-kami-champion") &&
    (
      statKey === "strength" ||
      statKey === "dexterity" ||
      statKey === "constitution" ||
      statKey === "intelligence" ||
      statKey === "charisma"
    )
  ) {
    return 3;
  }

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
  isTemplate: boolean;
  ownedPerkIds: string[];
  derivedPerkIds: ReadonlySet<string>;
  accountPerkCounts?: ReadonlyMap<string, number>;
  isModerator?: boolean;
}

export type PerkAvailabilityStatus = "available" | "hidden" | "blocked";

export interface PerkAvailability {
  status: PerkAvailabilityStatus;
  /** Present when status is "blocked"; shown in the add-perk list. */
  reason?: string;
}

function perkName(id: string): string {
  return PERKS_BY_ID.get(id)?.name ?? id;
}

function hidden(): PerkAvailability {
  return { status: "hidden" };
}

function blocked(reason: string): PerkAvailability {
  return { status: "blocked", reason };
}

function available(): PerkAvailability {
  return { status: "available" };
}

/**
 * Resolve whether a perk can be purchased, and if not whether it is hidden
 * from the add-perk list or shown as blocked with a reason.
 *
 * Hidden (omitted from the unlock list):
 * - `hidden`, deprecated, selectionOnly, adminOnly (non-moderators)
 * - already owned or derived
 * - identity mismatches (race, sex, faction, template)
 *
 * Blocked (listed, cannot be purchased, reason is shown):
 * - `blocked` / `blockedReason`
 * - missing required perks
 * - account character limit
 * - lock category conflict
 * - mutual exclusion (`excludesPerks`)
 * - one-way restriction (`restrictsPerks`)
 */
export function getPerkAvailability(
  perk: PerkDefinition,
  ctx: PerkEligibilityContext,
): PerkAvailability {
  if (perk.hidden) return hidden();
  if (perk.deprecated) return hidden();
  if (perk.selectionOnly) return hidden();
  if (perk.adminOnly && !ctx.isModerator) return hidden();

  if (ctx.ownedPerkIds.includes(perk.id)) return hidden();
  if (ctx.derivedPerkIds.has(perk.id)) return hidden();

  if (perk.requiredRaces && !perk.requiredRaces.includes(ctx.race)) {
    return hidden();
  }

  if (perk.requiredSex && !perk.requiredSex.includes(ctx.sex)) {
    return hidden();
  }

  if (perk.requiresTemplate && !ctx.isTemplate) {
    return hidden();
  }

  if (perk.requiredFaction) {
    const factions = Array.isArray(perk.requiredFaction)
      ? perk.requiredFaction
      : [perk.requiredFaction];
    if (!factions.includes(ctx.faction as typeof factions[number])) {
      return hidden();
    }
  }

  if (perk.blocked) {
    return blocked(
      perk.blockedReason ?? `Perk "${perk.name}" cannot be unlocked.`,
    );
  }

  if (perk.requiredPerkIds) {
    for (const requiredId of perk.requiredPerkIds) {
      if (!ctx.ownedPerkIds.includes(requiredId)) {
        return blocked(`Requires "${perkName(requiredId)}".`);
      }
    }
  }

  if (
    perk.maxCharactersPerAccount !== undefined &&
    (ctx.accountPerkCounts?.get(perk.id) ?? 0) >= perk.maxCharactersPerAccount
  ) {
    const limit = perk.maxCharactersPerAccount;
    return blocked(
      `Limited to ${limit} ${
        limit === 1 ? "character" : "characters"
      } per account.`,
    );
  }

  if (perk.lockCategory) {
    for (const id of ctx.ownedPerkIds) {
      const owned = PERKS_BY_ID.get(id);
      if (owned?.lockCategory === perk.lockCategory) {
        return blocked(`Cannot be combined with "${owned.name}".`);
      }
    }
  }

  if (perk.excludesPerks) {
    for (const excludedId of perk.excludesPerks) {
      if (ctx.ownedPerkIds.includes(excludedId)) {
        return blocked(`Cannot be combined with "${perkName(excludedId)}".`);
      }
    }
  }

  for (const id of ctx.ownedPerkIds) {
    const owned = PERKS_BY_ID.get(id);
    if (owned?.excludesPerks?.includes(perk.id)) {
      return blocked(`Cannot be combined with "${owned.name}".`);
    }
  }

  for (const id of ctx.ownedPerkIds) {
    const owned = PERKS_BY_ID.get(id);
    if (owned?.restrictsPerks?.includes(perk.id)) {
      return blocked(`Restricted by "${owned.name}".`);
    }
  }

  if (perk.restrictsPerks) {
    for (const restrictedId of perk.restrictsPerks) {
      if (ctx.ownedPerkIds.includes(restrictedId)) {
        return blocked(
          `Cannot be taken while you have "${perkName(restrictedId)}".`,
        );
      }
    }
  }

  return available();
}

/**
 * True when {@link getPerkAvailability} resolves to `"available"`.
 */
export function isPerkEligible(
  perk: PerkDefinition,
  ctx: PerkEligibilityContext,
): boolean {
  return getPerkAvailability(perk, ctx).status === "available";
}
