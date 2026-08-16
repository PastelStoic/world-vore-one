/**
 * Unit tests for perk availability (hidden / blocked reasons / restricts).
 * Run: deno test -A lib/draft_validation_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { PERKS_BY_ID } from "@/data/perks.ts";
import {
  getPerkAvailability,
  isPerkEligible,
  type PerkEligibilityContext,
  validatePerkRequirements,
} from "./draft_validation.ts";

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

Deno.test("deprecated and selection-only perks are hidden", () => {
  const deprecated = { ...PERKS_BY_ID.get("runner")!, deprecated: true };
  const selectionOnly = { ...PERKS_BY_ID.get("runner")!, selectionOnly: true };
  assertEquals(getPerkAvailability(deprecated, ctx()).status, "hidden");
  assertEquals(getPerkAvailability(selectionOnly, ctx()).status, "hidden");
});

Deno.test("race mismatch lists a perk as blocked with a reason", () => {
  const centaurs = PERKS_BY_ID.get("tierfraun-centaurs-cervines")!;
  const availability = getPerkAvailability(centaurs, ctx());
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reasons, [
    "Requires race: Tierfraun or Tierherr.",
  ]);
  assertEquals(
    getPerkAvailability(centaurs, ctx({ race: "Tierfraun" })).status,
    "available",
  );
});

Deno.test("faction mismatch lists a perk as blocked with a reason", () => {
  const army = PERKS_BY_ID.get("king-s-royal-army-pf")!;
  const availability = getPerkAvailability(army, ctx());
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reasons, [
    "Requires faction: SWITZERLAND - King's Royal Army.",
  ]);
  assertEquals(
    getPerkAvailability(
      army,
      ctx({ faction: "SWITZERLAND - King's Royal Army" }),
    ).status,
    "available",
  );
});

Deno.test("multiple identity mismatches are all listed", () => {
  const kami = PERKS_BY_ID.get("japanese-kami-champion")!;
  const availability = getPerkAvailability(kami, ctx());
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reasons, [
    "Requires race: Tierfraun or Tierherr.",
    "Requires the character to be a template.",
    "Requires faction: JAPAN - Miscellaneous Japanese Clans.",
  ]);
});

Deno.test("sex mismatch lists a perk as blocked with a reason", () => {
  const perk = PERKS_BY_ID.get("the-impregnator")!;
  const availability = getPerkAvailability(perk, ctx());
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reasons, ["Requires sex: Male or Futa."]);
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
  assertEquals(availability.reasons, [
    'Restricted by "Tierfraun (CENTAURS, CERVINES)".',
  ]);
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
  assertEquals(availability.reasons, [
    'Cannot be taken while you have "Runner".',
  ]);
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
  assertEquals(lock.reasons, [
    'Cannot be combined with "Tierfraun (CENTAURS, CERVINES)".',
  ]);

  const runner = PERKS_BY_ID.get("runner")!;
  const excluded = getPerkAvailability(
    runner,
    ctx({
      race: "Tierfraun",
      ownedPerkIds: ["tierfraun-lizards"],
    }),
  );
  assertEquals(excluded.status, "blocked");
  assertEquals(excluded.reasons, [
    'Cannot be combined with "Tierfraun (LIZARDS)".',
  ]);
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

Deno.test("validatePerkRequirements rejects selection-only perks that are not derived", () => {
  const error = validatePerkRequirements(
    "Baseliner",
    "Female",
    ["pilzfraun-artificer"],
    "SWITZERLAND - King's Royal Artificers",
  );
  assertEquals(
    error,
    'Perk "Pilzfraun Artificer" cannot be selected directly.',
  );
});
