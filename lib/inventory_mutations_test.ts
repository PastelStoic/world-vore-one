import { assertEquals } from "jsr:@std/assert@1";
import { createEmptyInventory } from "./inventory_types.ts";
import {
  addWeapon,
  enforceSignatureWeaponLimit,
  togglePatronItem,
  toggleSignatureWeapon,
} from "./inventory_mutations.ts";

Deno.test("addWeapon puts melee into weapons[]", () => {
  const inv = addWeapon(createEmptyInventory(), "dagger", "carried");
  assertEquals(inv.carried.weapons.length, 1);
  assertEquals(inv.carried.weapons[0].weaponId, "dagger");
  assertEquals(inv.carried.meleeWeapons.length, 0);
});

Deno.test("addWeapon defaults concealable weapons to concealed", () => {
  const inv = addWeapon(createEmptyInventory(), "dagger", "carried");
  assertEquals(inv.carried.weapons[0].concealed, true);

  const ranged = addWeapon(createEmptyInventory(), "derringer", "stowed");
  assertEquals(ranged.stowed.weapons[0].concealed, true);

  const rifle = addWeapon(createEmptyInventory(), "lee-enfield", "carried");
  assertEquals(rifle.carried.weapons[0].concealed, undefined);

  const knife = addWeapon(createEmptyInventory(), "combat-knife", "carried");
  assertEquals(knife.carried.weapons[0].concealed, undefined);
});

Deno.test("togglePatronItem can mark several items at once", () => {
  let inv = createEmptyInventory();
  inv = addWeapon(inv, "lee-enfield", "carried");
  inv = addWeapon(inv, "dagger", "carried");
  inv.carried.vehicles.push({ vehicleId: "motorcycle" });
  inv = togglePatronItem(inv, "carried", "weapons", 0);
  inv = togglePatronItem(inv, "carried", "weapons", 1);
  inv = togglePatronItem(inv, "carried", "vehicles", 0);
  assertEquals(inv.carried.weapons[0].isPatron, true);
  assertEquals(inv.carried.weapons[1].isPatron, true);
  assertEquals(inv.carried.vehicles[0].isPatron, true);
  inv = togglePatronItem(inv, "carried", "weapons", 0);
  assertEquals(inv.carried.weapons[0].isPatron, false);
  assertEquals(inv.carried.weapons[1].isPatron, true);
});

Deno.test("toggleSignatureWeapon marks exactly one weapon", () => {
  let inv = createEmptyInventory();
  inv = addWeapon(inv, "lee-enfield", "carried");
  inv = addWeapon(inv, "dagger", "carried");
  inv = toggleSignatureWeapon(inv, "carried", 1);
  assertEquals(!!inv.carried.weapons[0].isSignatureWeapon, false);
  assertEquals(inv.carried.weapons[1].isSignatureWeapon, true);
});

Deno.test("rank-1 signature toggle replaces the previous weapon", () => {
  let inv = createEmptyInventory();
  inv = addWeapon(inv, "lee-enfield", "carried");
  inv = addWeapon(inv, "dagger", "carried");
  inv = toggleSignatureWeapon(inv, "carried", 0, 1);
  inv = toggleSignatureWeapon(inv, "carried", 1, 1);
  assertEquals(inv.carried.weapons[0].isSignatureWeapon, false);
  assertEquals(inv.carried.weapons[1].isSignatureWeapon, true);
});

Deno.test("rank-2 signature toggle can mark two weapons", () => {
  let inv = createEmptyInventory();
  inv = addWeapon(inv, "lee-enfield", "carried");
  inv = addWeapon(inv, "dagger", "carried");
  inv = addWeapon(inv, "derringer", "carried");
  inv = toggleSignatureWeapon(inv, "carried", 0, 2);
  inv = toggleSignatureWeapon(inv, "carried", 1, 2);
  assertEquals(inv.carried.weapons[0].isSignatureWeapon, true);
  assertEquals(inv.carried.weapons[1].isSignatureWeapon, true);
  assertEquals(inv.carried.weapons[2].isSignatureWeapon, undefined);
  inv = toggleSignatureWeapon(inv, "carried", 2, 2);
  assertEquals(inv.carried.weapons[0].isSignatureWeapon, true);
  assertEquals(inv.carried.weapons[1].isSignatureWeapon, true);
  assertEquals(!!inv.carried.weapons[2].isSignatureWeapon, false);
});

Deno.test("enforceSignatureWeaponLimit unmarks extras beyond the cap", () => {
  let inv = createEmptyInventory();
  inv = addWeapon(inv, "lee-enfield", "carried");
  inv = addWeapon(inv, "dagger", "carried");
  inv = toggleSignatureWeapon(inv, "carried", 0, 2);
  inv = toggleSignatureWeapon(inv, "carried", 1, 2);
  inv = enforceSignatureWeaponLimit(inv, 1);
  assertEquals(inv.carried.weapons[0].isSignatureWeapon, true);
  assertEquals(!!inv.carried.weapons[1].isSignatureWeapon, false);
});

Deno.test("unmarking one of two signature weapons keeps the other", () => {
  let inv = createEmptyInventory();
  inv = addWeapon(inv, "lee-enfield", "carried");
  inv = addWeapon(inv, "dagger", "carried");
  inv = toggleSignatureWeapon(inv, "carried", 0, 2);
  inv = toggleSignatureWeapon(inv, "carried", 1, 2);
  inv = toggleSignatureWeapon(inv, "carried", 0, 2);
  assertEquals(!!inv.carried.weapons[0].isSignatureWeapon, false);
  assertEquals(inv.carried.weapons[1].isSignatureWeapon, true);
});
