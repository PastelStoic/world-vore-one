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
  getEffectiveWeaponStats,
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

Deno.test("getEffectiveWeaponStats returns catalog ammo when nothing is attached", () => {
  const stats = getEffectiveWeaponStats({
    weaponId: "lee-enfield",
    attachedIds: [],
  });
  assertEquals(stats?.ammo, 10);
  assertEquals(stats?.attachmentMagazineSystem, false);
});

Deno.test("parseInventory migrates meleeWeapons into weapons", async () => {
  const { parseInventory } = await import("./inventory_parsing.ts");
  const parsed = parseInventory({
    carried: {
      meleeWeapons: [{
        instanceId: "mw-1",
        meleeWeaponId: "dagger",
        isSignatureWeapon: true,
        perkGranted: "brawler",
      }],
    },
  });
  assertEquals(parsed?.carried.meleeWeapons.length, 0);
  assertEquals(parsed?.carried.weapons[0].weaponId, "dagger");
  assertEquals(parsed?.carried.weapons[0].instanceId, "mw-1");
  assertEquals(parsed?.carried.weapons[0].perkGranted, "brawler");
});

Deno.test("parseInventory remaps sapper ghost equipment", async () => {
  const { parseInventory } = await import("./inventory_parsing.ts");
  const parsed = parseInventory({
    carried: {
      equipment: [{
        equipmentId: "entrenching-gear-sapper",
        totalCharges: 0,
        usedCharges: 0,
        perkGranted: "sapper",
      }],
    },
  });
  assertEquals(parsed?.carried.equipment[0].equipmentId, "entrenching-gear");
  assertEquals(parsed?.carried.equipment[0].weightOverride, 0);
  assertEquals(parsed?.carried.equipment[0].isBulkyOverride, false);
});

Deno.test("parseInventory preserves equipment concealed flag", async () => {
  const { parseInventory } = await import("./inventory_parsing.ts");
  const parsed = parseInventory({
    carried: {
      equipment: [{
        equipmentId: "grenades",
        totalCharges: 2,
        usedCharges: 0,
        concealed: true,
      }],
    },
    stowed: {
      equipment: [{
        equipmentId: "cyanide-pill",
        totalCharges: 0,
        usedCharges: 0,
        concealed: false,
      }],
    },
  });
  assertEquals(parsed?.carried.equipment[0].concealed, true);
  assertEquals(parsed?.stowed.equipment[0].concealed, false);
});

Deno.test("parseInventory keeps attachmentChargeData and attachment perkGranted", async () => {
  const { parseInventory } = await import("./inventory_parsing.ts");
  const parsed = parseInventory({
    carried: {
      weapons: [{
        weaponId: "lee-enfield",
        currentAmmo: 5,
        attachedIds: ["scope"],
        magazines: 1,
        partialMagazines: [],
        attachmentChargeData: {
          "some-drum": { totalCharges: 3, usedCharges: 1 },
        },
      }],
      attachments: [{
        attachmentId: "bayonet",
        totalCharges: 0,
        usedCharges: 0,
        perkGranted: "signature-weapon",
      }],
    },
  });
  assertEquals(
    parsed?.carried.weapons[0].attachmentChargeData?.["some-drum"],
    { totalCharges: 3, usedCharges: 1 },
  );
  assertEquals(parsed?.carried.attachments[0].perkGranted, "signature-weapon");
});
