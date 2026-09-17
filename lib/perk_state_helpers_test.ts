/**
 * Unit tests for the shared perk grant walk.
 * Run: deno test -A lib/perk_state_helpers_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { PERKS, PERKS_BY_ID } from "@/data/perks.ts";
import {
  canRemoveOwnedPerk,
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

Deno.test("approved sheets cannot drop ordinary owned perks", () => {
  assertEquals(
    canRemoveOwnedPerk("runner", {
      canRemoveOldPerks: false,
      initialPerkIds: ["runner"],
    }),
    false,
  );
});

Deno.test("pending sheets can drop ordinary owned perks", () => {
  assertEquals(
    canRemoveOwnedPerk("runner", {
      canRemoveOldPerks: true,
      initialPerkIds: ["runner"],
    }),
    true,
  );
});

Deno.test("newly bought perks can be dropped before save", () => {
  assertEquals(
    canRemoveOwnedPerk("runner", {
      canRemoveOldPerks: false,
      initialPerkIds: [],
    }),
    true,
  );
});

Deno.test("unknown perks can be dropped on approved sheets", () => {
  assertEquals(
    canRemoveOwnedPerk("not-a-real-perk", {
      canRemoveOldPerks: false,
      initialPerkIds: ["not-a-real-perk"],
    }),
    true,
  );
});

Deno.test("crippling addiction can be dropped on approved sheets", () => {
  assertEquals(
    canRemoveOwnedPerk("crippling-addiction", {
      canRemoveOldPerks: false,
      initialPerkIds: ["crippling-addiction"],
    }),
    true,
  );
});

Deno.test("other negative perks stay locked on approved sheets", () => {
  assertEquals(
    canRemoveOwnedPerk("crippling-obsession", {
      canRemoveOldPerks: false,
      initialPerkIds: ["crippling-obsession"],
    }),
    false,
  );
});

Deno.test("derived perks cannot be dropped independently", () => {
  assertEquals(
    canRemoveOwnedPerk("crippling-addiction", {
      canRemoveOldPerks: true,
      initialPerkIds: ["crippling-addiction"],
      isDerived: true,
    }),
    false,
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
