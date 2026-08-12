import { assertEquals } from "jsr:@std/assert@1";
import { createEmptyInventory } from "./inventory_types.ts";
import { addWeapon, toggleSignatureWeapon } from "./inventory_mutations.ts";

Deno.test("addWeapon puts melee into weapons[]", () => {
  const inv = addWeapon(createEmptyInventory(), "dagger", "carried");
  assertEquals(inv.carried.weapons.length, 1);
  assertEquals(inv.carried.weapons[0].weaponId, "dagger");
  assertEquals(inv.carried.meleeWeapons.length, 0);
});

Deno.test("toggleSignatureWeapon marks exactly one weapon", () => {
  let inv = createEmptyInventory();
  inv = addWeapon(inv, "lee-enfield", "carried");
  inv = addWeapon(inv, "dagger", "carried");
  inv = toggleSignatureWeapon(inv, "carried", 1);
  assertEquals(inv.carried.weapons[0].isSignatureWeapon, false);
  assertEquals(inv.carried.weapons[1].isSignatureWeapon, true);
});
