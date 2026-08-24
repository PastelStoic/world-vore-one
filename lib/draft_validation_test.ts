/**
 * Unit tests for perk availability (hidden / blocked reasons / restricts).
 * Run: deno test -A lib/draft_validation_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { PERKS_BY_ID } from "@/data/perks.ts";
import {
  getDisguiseTargetError,
  getPerkAvailability,
  isAllowedDisguiseTarget,
  isPerkEligible,
  type PerkEligibilityContext,
  validatePerkDisguises,
  validatePerkRequirements,
  validateRaceMatchesSex,
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

Deno.test("spy can only disguise as combat, vore, or gimmick perks", () => {
  const spy = PERKS_BY_ID.get("spy")!;
  const runner = PERKS_BY_ID.get("runner")!;
  const survivor = PERKS_BY_ID.get("survivor")!;
  const scrounger = PERKS_BY_ID.get("scrounger")!;
  const milky = PERKS_BY_ID.get("milky")!;
  const sturmtruppen = PERKS_BY_ID.get("sturmtruppen")!;
  const speisfraun = PERKS_BY_ID.get("speisfraun")!;

  assertEquals(isAllowedDisguiseTarget(spy, runner, ["spy"]), true);
  assertEquals(isAllowedDisguiseTarget(spy, survivor, ["spy"]), true);
  assertEquals(isAllowedDisguiseTarget(spy, scrounger, ["spy"]), true);
  assertEquals(
    getDisguiseTargetError(spy, milky, ["spy"]),
    'Perk "Spy" can only be disguised as a Combat, Vore, or Gimmick perk.',
  );
  assertEquals(
    getDisguiseTargetError(spy, sturmtruppen, ["spy"]),
    'Perk "Spy" can only be disguised as a Combat, Vore, or Gimmick perk.',
  );
  assertEquals(
    getDisguiseTargetError(spy, speisfraun, ["spy"]),
    'Perk "Spy" can only be disguised as a Combat, Vore, or Gimmick perk.',
  );
});

Deno.test("spy cannot be disguised as a perk the sheet already has", () => {
  const spy = PERKS_BY_ID.get("spy")!;
  const runner = PERKS_BY_ID.get("runner")!;
  assertEquals(
    getDisguiseTargetError(spy, runner, ["spy", "runner"]),
    'Perk "Spy" cannot be disguised as "Runner", which this character already has. Choose a different disguise first.',
  );
  assertEquals(
    validatePerkDisguises(["spy", "runner"], { spy: "runner" }),
    'Perk "Spy" cannot be disguised as "Runner", which this character already has. Choose a different disguise first.',
  );
});

Deno.test("validatePerkDisguises accepts a legal spy disguise", () => {
  assertEquals(
    validatePerkDisguises(["spy"], { spy: "runner" }),
    null,
  );
});

Deno.test("two disguisable perks cannot share the same fake perk", () => {
  const spy = PERKS_BY_ID.get("spy")!;
  const runner = PERKS_BY_ID.get("runner")!;
  const disguises = { spy: "runner", "pilzherr-femboy": "runner" };
  assertEquals(
    getDisguiseTargetError(
      spy,
      runner,
      ["spy", "pilzherr-femboy"],
      disguises,
    ),
    'Perk "Pilzherr (FEMBOY)" is already disguised as "Runner".',
  );
});

Deno.test("a perk used as a spy disguise cannot be unlocked until the disguise changes", () => {
  const runner = PERKS_BY_ID.get("runner")!;
  const availability = getPerkAvailability(
    runner,
    ctx({
      ownedPerkIds: ["spy"],
      perkDisguises: { spy: "runner" },
    }),
  );
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reasons, [
    "Spy is currently disguised as this perk. Choose a different disguise first.",
  ]);
});

Deno.test("buying a perk that includes a disguised-as perk is blocked", () => {
  const canine = PERKS_BY_ID.get("tierfraun-canine")!;
  const availability = getPerkAvailability(
    canine,
    ctx({
      race: "Tierfraun",
      ownedPerkIds: ["spy"],
      perkDisguises: { spy: "runner" },
    }),
  );
  assertEquals(availability.status, "blocked");
  assertEquals(availability.reasons, [
    'Includes "Runner", which Spy is currently disguised as. Choose a different disguise first.',
  ]);
});

Deno.test("femboy disguises are not limited to combat, vore, or gimmick", () => {
  const femboy = PERKS_BY_ID.get("pilzherr-femboy")!;
  const sturmtruppen = PERKS_BY_ID.get("sturmtruppen")!;
  assertEquals(
    isAllowedDisguiseTarget(femboy, sturmtruppen, ["pilzherr-femboy"]),
    true,
  );
});

Deno.test("validateRaceMatchesSex rejects gendered race/sex mismatches", () => {
  assertEquals(
    validateRaceMatchesSex("Pilzfraun", "Male"),
    'Race "Pilzfraun" is not valid for sex "Male".',
  );
  assertEquals(validateRaceMatchesSex("Pilzherr", "Male"), null);
  assertEquals(validateRaceMatchesSex("Pilzfraun", "Female"), null);
  assertEquals(
    validateRaceMatchesSex("Pilzherr", "Female"),
    'Race "Pilzherr" is not valid for sex "Female".',
  );
  assertEquals(validateRaceMatchesSex("Baseliner", "Male"), null);
  assertEquals(validateRaceMatchesSex("Baseliner", "Female"), null);
});
