// ---------------------------------------------------------------------------
// Shared draft validation helpers
//
// Pure functions used by both the server-side form validation and the
// client-side CharacterSheetEditor to ensure a single source of truth for
// character sheet rules.
// ---------------------------------------------------------------------------

import {
  PERK_CATEGORY_LABELS,
  type PerkCategory,
  type PerkDefinition,
  PERKS_BY_ID,
} from "@/data/perks.ts";
import { getStatCap } from "./stat_calculations.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDraft,
  isRaceValidForSex,
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

// ── Race / sex identity ─────────────────────────────────────────────────────

/**
 * Gendered races must match sex (Pilzfraun/Tierfraun for Female and Futa,
 * Pilzherr/Tierherr for Male). Baseliner is valid for every sex.
 */
export function validateRaceMatchesSex(
  race: Race,
  sex: Sex,
): string | null {
  if (isRaceValidForSex(race, sex)) return null;
  return `Race "${race}" is not valid for sex "${sex}".`;
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
  /** Maps disguisable perk IDs to the fake perk they currently appear as. */
  perkDisguises?: Record<string, string>;
}

export type PerkAvailabilityStatus = "available" | "hidden" | "blocked";

export interface PerkAvailability {
  status: PerkAvailabilityStatus;
  /** Present when status is "blocked"; why the perk cannot be selected. */
  reasons?: string[];
}

function perkName(id: string): string {
  return PERKS_BY_ID.get(id)?.name ?? id;
}

function formatDisguiseCategoryList(categories: PerkCategory[]): string {
  const labels = categories.map((c) => PERK_CATEGORY_LABELS[c]);
  if (labels.length <= 1) return labels[0] ?? "";
  if (labels.length === 2) return `${labels[0]} or ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, or ${labels[labels.length - 1]}`;
}

/**
 * Why `target` is not a legal disguise for `source`, or null if it is allowed.
 * Owned perks, other disguisable perks, free/deprecated perks, category limits,
 * and targets already used by another disguise are rejected so a public sheet
 * cannot show the same perk twice.
 */
export function getDisguiseTargetError(
  source: PerkDefinition,
  target: PerkDefinition,
  ownedPerkIds: readonly string[],
  perkDisguises?: Record<string, string>,
): string | null {
  if (target.id === source.id) {
    return `Perk "${source.name}" cannot be disguised as itself.`;
  }
  if (target.canDisguise) {
    return `Perk "${source.name}" cannot be disguised as another disguisable perk.`;
  }
  if (target.isFree) {
    return `Perk "${source.name}" cannot be disguised as a free perk.`;
  }
  if (target.deprecated) {
    return `Perk "${source.name}" cannot be disguised as a removed perk.`;
  }
  if (
    source.disguiseCategories &&
    !source.disguiseCategories.includes(target.category)
  ) {
    return `Perk "${source.name}" can only be disguised as a ${
      formatDisguiseCategoryList(source.disguiseCategories)
    } perk.`;
  }
  if (ownedPerkIds.includes(target.id)) {
    return `Perk "${source.name}" cannot be disguised as "${target.name}", which this character already has. Choose a different disguise first.`;
  }
  if (perkDisguises) {
    for (const [otherSourceId, otherTargetId] of Object.entries(perkDisguises)) {
      if (otherSourceId !== source.id && otherTargetId === target.id) {
        return `Perk "${perkName(otherSourceId)}" is already disguised as "${target.name}".`;
      }
    }
  }
  return null;
}

/** True when {@link getDisguiseTargetError} returns null. */
export function isAllowedDisguiseTarget(
  source: PerkDefinition,
  target: PerkDefinition,
  ownedPerkIds: readonly string[],
  perkDisguises?: Record<string, string>,
): boolean {
  return getDisguiseTargetError(
    source,
    target,
    ownedPerkIds,
    perkDisguises,
  ) === null;
}

function disguiseSourcesForTarget(
  targetId: string,
  perkDisguises?: Record<string, string>,
): string[] {
  if (!perkDisguises) return [];
  return Object.entries(perkDisguises)
    .filter(([, disguiseId]) => disguiseId === targetId)
    .map(([sourceId]) => perkName(sourceId));
}

function disguiseUnlockBlockReason(
  targetId: string,
  perkDisguises?: Record<string, string>,
): string | undefined {
  const sources = disguiseSourcesForTarget(targetId, perkDisguises);
  if (sources.length === 0) return undefined;
  const who = sources.length === 1 ? sources[0] : sources.join(" and ");
  return `${who} is currently disguised as this perk. Choose a different disguise first.`;
}

function requiredFactions(perk: PerkDefinition): string[] | undefined {
  if (!perk.requiredFaction) return undefined;
  return Array.isArray(perk.requiredFaction)
    ? perk.requiredFaction
    : [perk.requiredFaction];
}

/** Player-facing identity mismatches (race, sex, faction, template). */
function identityBlockReasons(
  perk: PerkDefinition,
  ctx: Pick<PerkEligibilityContext, "race" | "sex" | "faction" | "isTemplate">,
): string[] {
  const reasons: string[] = [];

  if (perk.requiredRaces && !perk.requiredRaces.includes(ctx.race)) {
    reasons.push(`Requires race: ${perk.requiredRaces.join(" or ")}.`);
  }

  if (perk.requiredSex && !perk.requiredSex.includes(ctx.sex)) {
    reasons.push(`Requires sex: ${perk.requiredSex.join(" or ")}.`);
  }

  if (perk.requiresTemplate && !ctx.isTemplate) {
    reasons.push("Requires the character to be a template.");
  }

  const factions = requiredFactions(perk);
  if (factions && !factions.includes(ctx.faction)) {
    reasons.push(`Requires faction: ${factions.join(" or ")}.`);
  }

  return reasons;
}

/** Identity mismatch for an already-owned perk (server error wording). */
function perkIdentityError(
  perk: PerkDefinition,
  ctx: Pick<PerkEligibilityContext, "race" | "sex" | "faction" | "isTemplate">,
): string | null {
  const reasons = identityBlockReasons(perk, ctx);
  if (reasons.length === 0) return null;
  const first = reasons[0];
  return `Perk "${perk.name}" ${first.charAt(0).toLowerCase()}${
    first.slice(1)
  }`;
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
    if (
      owned && owned.id !== perk.id && owned.lockCategory === perk.lockCategory
    ) {
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

function restrictedOwnedPerkId(
  perk: PerkDefinition,
  ownedPerkIds: string[],
): string | undefined {
  return perk.restrictsPerks?.find((id) => ownedPerkIds.includes(id));
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

function blocked(reasons: string[]): PerkAvailability {
  return { status: "blocked", reasons };
}

function available(): PerkAvailability {
  return { status: "available" };
}

/** All reasons this perk cannot be purchased in the current context. */
function collectBlockReasons(
  perk: PerkDefinition,
  ctx: PerkEligibilityContext,
): string[] {
  const reasons: string[] = [...identityBlockReasons(perk, ctx)];

  for (const id of perk.requiredPerkIds ?? []) {
    if (!ctx.ownedPerkIds.includes(id)) {
      reasons.push(`Requires "${perkName(id)}".`);
    }
  }

  if (
    perk.maxCharactersPerAccount !== undefined &&
    (ctx.accountPerkCounts?.get(perk.id) ?? 0) >= perk.maxCharactersPerAccount
  ) {
    const limit = perk.maxCharactersPerAccount;
    reasons.push(
      `Limited to ${limit} ${
        limit === 1 ? "character" : "characters"
      } per account.`,
    );
  }

  const lockName = lockCategoryConflictName(perk, ctx.ownedPerkIds);
  if (lockName) {
    reasons.push(`Cannot be combined with "${lockName}".`);
  }

  for (const id of perk.excludesPerks ?? []) {
    if (ctx.ownedPerkIds.includes(id)) {
      reasons.push(`Cannot be combined with "${perkName(id)}".`);
    }
  }

  for (const id of ctx.ownedPerkIds) {
    const owned = PERKS_BY_ID.get(id);
    if (owned?.excludesPerks?.includes(perk.id)) {
      reasons.push(`Cannot be combined with "${owned.name}".`);
    }
  }

  for (const id of ctx.ownedPerkIds) {
    const owned = PERKS_BY_ID.get(id);
    if (owned?.restrictsPerks?.includes(perk.id)) {
      reasons.push(`Restricted by "${owned.name}".`);
    }
  }

  for (const id of perk.restrictsPerks ?? []) {
    if (ctx.ownedPerkIds.includes(id)) {
      reasons.push(`Cannot be taken while you have "${perkName(id)}".`);
    }
  }

  const selfDisguiseReason = disguiseUnlockBlockReason(
    perk.id,
    ctx.perkDisguises,
  );
  if (selfDisguiseReason) {
    reasons.push(selfDisguiseReason);
  }

  for (const id of perk.includesPerks ?? []) {
    const sources = disguiseSourcesForTarget(id, ctx.perkDisguises);
    if (sources.length === 0) continue;
    const who = sources.length === 1 ? sources[0] : sources.join(" and ");
    reasons.push(
      `Includes "${perkName(id)}", which ${who} is currently disguised as. Choose a different disguise first.`,
    );
  }

  return [...new Set(reasons)];
}

/**
 * Resolve whether a perk can be purchased, and if not whether it is hidden
 * from the add-perk list or shown as blocked with reasons.
 *
 * Hidden (omitted from the unlock list):
 * - `hidden`, deprecated, selectionOnly, adminOnly (non-moderators)
 * - already owned or derived
 *
 * Blocked (listed, cannot be purchased; reasons shown if the player tries):
 * - identity mismatches (race, sex, faction, template)
 * - missing required perks
 * - account character limit
 * - lock category conflict
 * - mutual exclusion (`excludesPerks`)
 * - one-way restriction (`restrictsPerks`)
 * - currently used as a disguise target (change the disguise first)
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

  const reasons = collectBlockReasons(perk, ctx);
  if (reasons.length > 0) return blocked(reasons);

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
 * Server-side check that every stored disguise is legal: the source perk is
 * owned and disguisable, and the target is an allowed fake perk that this
 * sheet does not already have.
 */
export function validatePerkDisguises(
  perkIds: string[],
  perkDisguises?: Record<string, string>,
): string | null {
  if (!perkDisguises) return null;

  for (const [sourceId, targetId] of Object.entries(perkDisguises)) {
    if (!perkIds.includes(sourceId)) {
      return `Cannot disguise perk "${perkName(sourceId)}" because it is not on this sheet.`;
    }

    const source = PERKS_BY_ID.get(sourceId);
    if (!source?.canDisguise) {
      return `Perk "${perkName(sourceId)}" cannot be disguised.`;
    }

    const target = PERKS_BY_ID.get(targetId);
    if (!target) {
      return `Perk "${source.name}" is disguised as unknown perk "${targetId}".`;
    }

    const error = getDisguiseTargetError(
      source,
      target,
      perkIds,
      perkDisguises,
    );
    if (error) return error;
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
