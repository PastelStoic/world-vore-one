/**
 * Unit tests for race starting budget and perk cost.
 * Run: deno test -A lib/character_parsing_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import {
  BASELINER_FREE_PERKS,
  BASELINER_STAT_POINTS,
  createDefaultCharacterDraft,
  DEFAULT_FREE_PERKS,
  DEFAULT_STAT_POINTS,
  getStartingFreePerks,
  getStartingStatPoints,
  isRaceValidForSex,
  PERK_COST_STAT_POINTS,
  type Race,
} from "./character_types.ts";
import {
  calculatePerksCost,
  validateCharacterProgression,
} from "./character_parsing.ts";
import { getStatFloor, validateStatCaps } from "./draft_validation.ts";
import { getStatCap } from "./stat_calculations.ts";

const PAID_PERKS = ["runner", "effective-cover-use", "tough"];
const OTHER_RACES: Race[] = [
  "Pilzfraun",
  "Pilzherr",
  "Tierfraun",
  "Tierherr",
];

function perkCost(perkIds: string[], race: Race): number {
  return calculatePerksCost(
    perkIds,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    race,
  );
}

Deno.test("Baseliners start with 9 stat points and 2 free perks", () => {
  assertEquals(getStartingStatPoints("Baseliner"), 9);
  assertEquals(getStartingStatPoints("Baseliner"), BASELINER_STAT_POINTS);
  assertEquals(getStartingFreePerks("Baseliner"), 2);
  assertEquals(getStartingFreePerks("Baseliner"), BASELINER_FREE_PERKS);
});

Deno.test("other races start with 5 stat points and 1 free perk", () => {
  for (const race of OTHER_RACES) {
    assertEquals(getStartingStatPoints(race), 5);
    assertEquals(getStartingStatPoints(race), DEFAULT_STAT_POINTS);
    assertEquals(getStartingFreePerks(race), 1);
    assertEquals(getStartingFreePerks(race), DEFAULT_FREE_PERKS);
  }
});

Deno.test("the first two paid perks are free for Baseliners", () => {
  assertEquals(perkCost(PAID_PERKS.slice(0, 1), "Baseliner"), 0);
  assertEquals(perkCost(PAID_PERKS.slice(0, 2), "Baseliner"), 0);
  assertEquals(perkCost(PAID_PERKS, "Baseliner"), PERK_COST_STAT_POINTS);
});

Deno.test("only the first paid perk is free for other races", () => {
  assertEquals(perkCost(PAID_PERKS.slice(0, 1), "Pilzfraun"), 0);
  assertEquals(
    perkCost(PAID_PERKS.slice(0, 2), "Pilzfraun"),
    PERK_COST_STAT_POINTS,
  );
  assertEquals(
    perkCost(PAID_PERKS, "Pilzfraun"),
    PERK_COST_STAT_POINTS * 2,
  );
});

Deno.test("progression allows negative unallocated points when allocation still balances", () => {
  const draft = createDefaultCharacterDraft();
  draft.baseStats = { ...draft.baseStats, strength: 12 };
  draft.unallocatedStatPoints = -2;
  assertEquals(validateCharacterProgression(draft), null);
});

Deno.test("progression still rejects under-spent point totals", () => {
  const draft = createDefaultCharacterDraft();
  draft.unallocatedStatPoints = -2;
  assertEquals(
    validateCharacterProgression(draft),
    "Invalid stat/perk point allocation.",
  );
});

Deno.test("gendered races are only valid for matching sex", () => {
  assertEquals(isRaceValidForSex("Pilzfraun", "Male"), false);
  assertEquals(isRaceValidForSex("Pilzherr", "Male"), true);
  assertEquals(isRaceValidForSex("Tierfraun", "Male"), false);
  assertEquals(isRaceValidForSex("Tierherr", "Male"), true);
  assertEquals(isRaceValidForSex("Pilzfraun", "Female"), true);
  assertEquals(isRaceValidForSex("Pilzherr", "Female"), false);
  assertEquals(isRaceValidForSex("Pilzfraun", "Futa"), true);
  assertEquals(isRaceValidForSex("Pilzherr", "Futa"), false);
  assertEquals(isRaceValidForSex("Baseliner", "Male"), true);
  assertEquals(isRaceValidForSex("Baseliner", "Female"), true);
  assertEquals(isRaceValidForSex("Baseliner", "Futa"), true);
});

Deno.test("extremely inefficient digestion grants a flat 4 points", () => {
  assertEquals(
    perkCost(["extremely-inefficient-digestion"], "Pilzfraun"),
    -4,
  );
});

Deno.test("extremely inefficient digestion progression locks dig at -4 without scaling points", () => {
  const draft = createDefaultCharacterDraft();
  draft.race = "Pilzfraun";
  draft.description = { ...draft.description, sex: "Female" };
  draft.perkIds = ["extremely-inefficient-digestion"];
  draft.baseStats = { ...draft.baseStats, digestionStrength: -4 };
  // Starting budget 5 + flat 4 from the perk = 9 unallocated when dig costs 0
  draft.unallocatedStatPoints = 9;
  assertEquals(validateCharacterProgression(draft), null);

  // Dig at -4 must not count as 5 free points (would allow unallocated of only 4)
  draft.unallocatedStatPoints = 4;
  assertEquals(
    validateCharacterProgression(draft),
    "Invalid stat/perk point allocation.",
  );
});

Deno.test("extremely inefficient digestion floors and caps dig strength at -4", () => {
  assertEquals(
    getStatFloor("digestionStrength", ["extremely-inefficient-digestion"]),
    -4,
  );
  const draft = createDefaultCharacterDraft();
  draft.perkIds = ["extremely-inefficient-digestion"];
  draft.baseStats = { ...draft.baseStats, digestionStrength: -4 };
  assertEquals(getStatCap(draft, "digestionStrength"), -4);
  assertEquals(validateStatCaps(draft), null);

  draft.baseStats = { ...draft.baseStats, digestionStrength: -3 };
  assertEquals(
    validateStatCaps(draft),
    'Stat "Digestion Strength" exceeds its cap of -4.',
  );
});
