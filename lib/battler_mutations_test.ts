/**
 * Pure unit tests for board mutators.
 * Run: deno test -A lib/battler_mutations_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { createEmptyBattlerState } from "./battler_types.ts";
import {
  addCombatant,
  placeCombatantOnHex,
  placeCoverOnHex,
  removeCover,
} from "./battler_mutations.ts";

Deno.test("placeCombatantOnHex refuses occupied hex", () => {
  let s = createEmptyBattlerState();
  s = addCombatant(s, {
    id: "a",
    name: "A",
    currentHealth: 5,
    maxHealth: 5,
    team: "allies",
  });
  s = addCombatant(s, {
    id: "b",
    name: "B",
    currentHealth: 5,
    maxHealth: 5,
    team: "enemies",
  });
  s = placeCombatantOnHex(s, "a", { q: 0, r: 0 });
  const rejected = placeCombatantOnHex(s, "b", { q: 0, r: 0 });
  assertEquals(rejected, s);
  assertEquals(rejected.placedCharacters["0:0"], "a");
});

Deno.test("placeCover and removeCover", () => {
  let s = createEmptyBattlerState();
  s = placeCoverOnHex(s, "strong", { q: 1, r: 1 }, "c1");
  assertEquals(s.covers["1:1"]?.type, "strong");
  assertEquals(s.covers["1:1"]?.passable, false);
  s = removeCover(s, "1:1");
  assertEquals(s.covers["1:1"], undefined);
});
