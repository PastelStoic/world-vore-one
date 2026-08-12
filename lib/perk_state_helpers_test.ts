/**
 * Unit tests for the shared perk grant walk.
 * Run: deno test -A lib/perk_state_helpers_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { PERKS, PERKS_BY_ID } from "@/data/perks.ts";
import {
  collectGrantedPerkIds,
  normalizePerkIds,
} from "./perk_state_helpers.ts";
import { getDerivedPerkIds } from "./character_parsing.ts";

Deno.test("capo includes allies and patron as granted", () => {
  const granted = collectGrantedPerkIds(["capo"]);
  assertEquals(granted.has("allies"), true);
  assertEquals(granted.has("patron"), true);
  assertEquals(granted.has("capo"), false);
});

Deno.test("normalizePerkIds appends granted perks without dropping owned ones", () => {
  const normalized = normalizePerkIds(["capo"]);
  assertEquals(normalized.includes("capo"), true);
  assertEquals(normalized.includes("allies"), true);
  assertEquals(normalized.includes("patron"), true);
});

Deno.test("getDerivedPerkIds uses the same grant set as collectGrantedPerkIds", () => {
  const perkIds = ["capo", "runner"];
  const selections = { capo: ["tough"] };
  assertEquals(
    [...getDerivedPerkIds(perkIds, selections)].sort(),
    [...collectGrantedPerkIds(perkIds, selections)].sort(),
  );
});

Deno.test("grant walk includes nested includesPerks when present", () => {
  for (const perk of PERKS) {
    for (const includedId of perk.includesPerks ?? []) {
      const nested = PERKS_BY_ID.get(includedId)?.includesPerks ?? [];
      if (nested.length === 0) continue;
      const granted = collectGrantedPerkIds([perk.id]);
      for (const nestedId of nested) {
        assertEquals(
          granted.has(nestedId),
          true,
          `${perk.id} should grant nested ${nestedId} via ${includedId}`,
        );
      }
    }
  }
});
