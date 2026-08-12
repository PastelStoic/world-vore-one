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
  type PerkOrigin,
  type Race,
  type Sex,
} from "./character_types.ts";
import { collectGrantedPerkIds } from "./perk_state_helpers.ts";

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

function requiredFactions(perk: PerkDefinition): string[] | undefined {
  if (!perk.requiredFaction) return undefined;
  return Array.isArray(perk.requiredFaction)
    ? perk.requiredFaction
    : [perk.requiredFaction];
}

/** Identity mismatch for an already-owned perk (server error wording). */
function perkIdentityError(
  perk: PerkDefinition,
  ctx: Pick<PerkEligibilityContext, "race" | "sex" | "faction" | "isTemplate">,
): string | null {
  if (perk.requiredRaces && !perk.requiredRaces.includes(ctx.race)) {
    return `Perk "${perk.name}" requires one of: ${
      perk.requiredRaces.join(", ")
    }.`;
  }

  if (perk.requiredSex && !perk.requiredSex.includes(ctx.sex)) {
    return `Perk "${perk.name}" requires sex: ${
      perk.requiredSex.join(" or ")
    }.`;
  }

  if (perk.requiresTemplate && !ctx.isTemplate) {
    return `Perk "${perk.name}" requires the character to be a template.`;
  }

  const factions = requiredFactions(perk);
  if (factions && !factions.includes(ctx.faction)) {
    return `Perk "${perk.name}" requires faction: ${factions.join(" or ")}.`;
  }

  return null;
}

function missingRequiredPerkId(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): string | undefined {
  return perk.requiredPerkIds?.find((id) => !ownedPerkIds.includes(id));
}

function lockCategoryConflictName(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): string | undefined {
  if (!perk.lockCategory) return undefined;
  for (const id of ownedPerkIds) {
    const owned = PERKS_BY_ID.get(id);
    if (owned && owned.id !== perk.id && owned.lockCategory === perk.lockCategory) {
      return owned.name;
    }
  }
  return undefined;
}

function excludedOwnedPerkId(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): string | undefined {
  return perk.excludesPerks?.find((id) => ownedPerkIds.includes(id));
}

function ownedPerkThatExcludes(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): PerkDefinition | undefined {
  for (const id of ownedPerkIds) {
    const owned = PERKS_BY_ID.get(id);
    if (owned?.excludesPerks?.includes(perk.id)) return owned;
  }
  return undefined;
}

function restrictedOwnedPerkId(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): string | undefined {
  return perk.restrictsPerks?.find((id) => ownedPerkIds.includes(id));
}

function ownedPerkThatRestricts(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): PerkDefinition | undefined {
  for (const id of ownedPerkIds) {
    const owned = PERKS_BY_ID.get(id);
    if (owned?.restrictsPerks?.includes(perk.id)) return owned;
  }
  return undefined;
}

/**
 * Combination error for an already-owned perk (server error wording).
 * `ownedPerkIds` should include every owned perk, including `perk` itself.
 */
function perkCombinationError(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): string | null {
  const missingRequired = missingRequiredPerkId(perk, ownedPerkIds);
  if (missingRequired) {
    return `Perk "${perk.name}" requires "${perkName(missingRequired)}".`;
  }

  const lockName = lockCategoryConflictName(perk, ownedPerkIds);
  if (lockName) {
    return `Perk "${perk.name}" cannot be combined with "${lockName}".`;
  }

  const excludedId = excludedOwnedPerkId(perk, ownedPerkIds);
  if (excludedId) {
    return `Perk "${perk.name}" cannot be combined with "${
      perkName(excludedId)
    }".`;
  }

  const restrictedId = restrictedOwnedPerkId(perk, ownedPerkIds);
  if (restrictedId) {
    return `Perk "${perk.name}" restricts "${perkName(restrictedId)}".`;
  }

  return null;
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

  if (perkIdentityError(perk, ctx)) return hidden();

  if (perk.blocked) {
    return blocked(
      perk.blockedReason ?? `Perk "${perk.name}" cannot be unlocked.`,
    );
  }

  const missingRequired = missingRequiredPerkId(perk, ctx.ownedPerkIds);
  if (missingRequired) {
    return blocked(`Requires "${perkName(missingRequired)}".`);
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

  const lockName = lockCategoryConflictName(perk, ctx.ownedPerkIds);
  if (lockName) {
    return blocked(`Cannot be combined with "${lockName}".`);
  }

  const excludedId = excludedOwnedPerkId(perk, ctx.ownedPerkIds);
  if (excludedId) {
    return blocked(`Cannot be combined with "${perkName(excludedId)}".`);
  }

  const ownedExcluder = ownedPerkThatExcludes(perk, ctx.ownedPerkIds);
  if (ownedExcluder) {
    return blocked(`Cannot be combined with "${ownedExcluder.name}".`);
  }

  const ownedRestrictor = ownedPerkThatRestricts(perk, ctx.ownedPerkIds);
  if (ownedRestrictor) {
    return blocked(`Restricted by "${ownedRestrictor.name}".`);
  }

  const restrictedId = restrictedOwnedPerkId(perk, ctx.ownedPerkIds);
  if (restrictedId) {
    return blocked(
      `Cannot be taken while you have "${perkName(restrictedId)}".`,
    );
  }

  return available();
}

/**
 * Server-side check that every owned perk is legal for this identity and
 * does not conflict with the rest of the loadout. Uses the same identity
 * and combination rules as {@link getPerkAvailability}.
 */
export function validatePerkRequirements(
  race: Race,
  sex: Sex,
  perkIds: string[],
  faction?: string,
  options?: {
    isTemplate?: boolean;
    perkSelections?: Record<string, string[]>;
    perkOrigins?: Record<string, PerkOrigin>;
    isAdmin?: boolean;
  },
): string | null {
  const derived = collectGrantedPerkIds(
    perkIds,
    options?.perkSelections,
    faction,
    options?.perkOrigins,
  );
  const identityCtx = {
    race,
    sex,
    faction: faction ?? "",
    isTemplate: options?.isTemplate ?? false,
  };

  for (const perkId of perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    if (!perk) {
      return "Invalid perk id in payload.";
    }

    const identityError = perkIdentityError(perk, identityCtx);
    if (identityError) return identityError;

    if (perk.selectionOnly && !derived.has(perkId)) {
      return `Perk "${perk.name}" cannot be selected directly.`;
    }

    const combinationError = perkCombinationError(perk, perkIds);
    if (combinationError) return combinationError;
  }

  return null;
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
