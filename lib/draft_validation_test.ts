/**
 * Unit tests for perk availability (hidden / blocked / restricts).
 * Run: deno test -A lib/draft_validation_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { PERKS_BY_ID } from "@/data/perks.ts";
import {
  getPerkAvailability,
  isPerkEligible,
  type PerkEligibilityContext,
} from "./draft_validation.ts";
import { validatePerkRequirements } from "@/data/perks.ts";

function ctx(
  overrides: Partial<PerkEligibilityContext> = {},
): PerkEligibilityContext {
  return {
    race: "Baseliner",
    sex: "Female",
    faction: "N/A - Civilians and unafilliated",
    isTemplate: false,
    ownedPerkIds: [],
    derivedPerkIds: new Set(),
    ...overrides,
  };
}

Deno.test("hidden perks do not appear as unlock options", () => {
  const perk = {
    ...PERKS_BY_ID.get("runner")!,
    hidden: true,
  };
  const availability = getPerkAvailability(perk, ctx());
  assertEquals(availability.status, "hidden");
  assertEquals(isPerkEligible(perk, ctx()), false);
});

Deno.test("statically blocked perks are listed with a reason", () => {
  const perk = {
    ...PERKS_BY_ID.get("runner")!,
    blocked: true,
    blockedReason: "Not available in this scenario.",
  };
  const availability = getPerkAvailability(perk, ctx());
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reason, "Not available in this scenario.");
});

Deno.test("deprecated and selection-only perks are hidden", () => {
  const deprecated = { ...PERKS_BY_ID.get("runner")!, deprecated: true };
  const selectionOnly = { ...PERKS_BY_ID.get("runner")!, selectionOnly: true };
  assertEquals(getPerkAvailability(deprecated, ctx()).status, "hidden");
  assertEquals(getPerkAvailability(selectionOnly, ctx()).status, "hidden");
});

Deno.test("race mismatch hides a perk from the unlock list", () => {
  const centaurs = PERKS_BY_ID.get("tierfraun-centaurs-cervines")!;
  assertEquals(getPerkAvailability(centaurs, ctx()).status, "hidden");
  assertEquals(
    getPerkAvailability(centaurs, ctx({ race: "Tierfraun" })).status,
    "available",
  );
});

Deno.test("owned perk restricts purchase of listed perks", () => {
  const runner = PERKS_BY_ID.get("runner")!;
  const availability = getPerkAvailability(
    runner,
    ctx({
      race: "Tierfraun",
      ownedPerkIds: ["tierfraun-centaurs-cervines"],
    }),
  );
  assertEquals(availability.status, "blocked");
  assertEquals(
    availability.reason,
    'Restricted by "Tierfraun (CENTAURS, CERVINES)".',
  );
});

Deno.test("a restricting perk is blocked if the restricted perk is already owned", () => {
  const centaurs = PERKS_BY_ID.get("tierfraun-centaurs-cervines")!;
  const availability = getPerkAvailability(
    centaurs,
    ctx({
      race: "Tierfraun",
      ownedPerkIds: ["runner"],
    }),
  );
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reason, 'Cannot be taken while you have "Runner".');
});

Deno.test("lock category and excludesPerks surface as blocked", () => {
  const lizards = PERKS_BY_ID.get("tierfraun-lizards")!;
  const lock = getPerkAvailability(
    lizards,
    ctx({
      race: "Tierfraun",
      ownedPerkIds: ["tierfraun-centaurs-cervines"],
    }),
  );
  assertEquals(lock.status, "blocked");
  assertEquals(
    lock.reason,
    'Cannot be combined with "Tierfraun (CENTAURS, CERVINES)".',
  );

  const runner = PERKS_BY_ID.get("runner")!;
  const excluded = getPerkAvailability(
    runner,
    ctx({
      race: "Tierfraun",
      ownedPerkIds: ["tierfraun-lizards"],
    }),
  );
  assertEquals(excluded.status, "blocked");
  assertEquals(
    excluded.reason,
    'Cannot be combined with "Tierfraun (LIZARDS)".',
  );
});

Deno.test("validatePerkRequirements rejects restricted perk combinations", () => {
  const error = validatePerkRequirements(
    "Tierfraun",
    "Female",
    ["tierfraun-centaurs-cervines", "runner"],
  );
  assertEquals(
    error,
    'Perk "Tierfraun (CENTAURS, CERVINES)" restricts "Runner".',
  );
});
