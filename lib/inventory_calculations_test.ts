/**
 * Unit tests for inventory slot/cost math.
 * Run: deno test -A lib/inventory_calculations_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { createEmptyInventory } from "./inventory_types.ts";
import {
  calculateInventoryPointCostWithPerks,
  countAllItemSlots,
  countCarriedItemSlots,
  countLocationSlots,
  getWeaponPointCost,
  slotLookups,
} from "./inventory_calculations.ts";

Deno.test("countCarriedItemSlots matches a single location count", () => {
  const inv = createEmptyInventory();
  inv.carried.weapons.push({
    weaponId: "lee-enfield",
    currentAmmo: 10,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  assertEquals(
    countCarriedItemSlots(inv, slotLookups),
    countLocationSlots(inv.carried, slotLookups),
  );
});

Deno.test("countAllItemSlots is carried plus stowed", () => {
  const inv = createEmptyInventory();
  inv.carried.weapons.push({
    weaponId: "lee-enfield",
    currentAmmo: 10,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  inv.stowed.weapons.push({
    weaponId: "lee-enfield",
    currentAmmo: 10,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  assertEquals(
    countAllItemSlots(inv, slotLookups),
    countLocationSlots(inv.carried, slotLookups) +
      countLocationSlots(inv.stowed, slotLookups),
  );
});

Deno.test("restricted weapons add their catalog point cost", () => {
  const inv = createEmptyInventory();
  const restrictedId = "lewis-gun";
  const weaponCost = getWeaponPointCost(restrictedId);
  assertEquals(weaponCost > 0, true);
  inv.carried.weapons.push({
    weaponId: restrictedId,
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  // 1 weapon uses a free slot; extra cost is only the weapon's own pointCost
  assertEquals(
    calculateInventoryPointCostWithPerks(inv),
    weaponCost,
  );
});
