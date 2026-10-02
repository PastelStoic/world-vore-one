/**
 * Unit tests for inventory slot/cost math.
 * Run: deno test -A lib/inventory_calculations_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { createEmptyInventory } from "./inventory_types.ts";
import {
  applyCharismaItemDiscount,
  calculateInventoryPointCostWithPerks,
  countAllItemSlots,
  countCarriedItemSlots,
  countLocationSlots,
  getCharismaItemDiscount,
  getEffectiveWeaponStats,
  getFreeItemSlots,
  getInventoryPointCostBreakdown,
  getItemAddPointCost,
  getSignatureFreeAttachmentIds,
  getSignatureWeaponLimit,
  getVehiclePointCost,
  getWeaponPointCost,
  slotLookups,
} from "./inventory_calculations.ts";
import type { CharacterInventory } from "./inventory_types.ts";

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

Deno.test("patron-marked items do not consume inventory slots", () => {
  const inv = createEmptyInventory();
  inv.carried.weapons.push({
    weaponId: "lee-enfield",
    currentAmmo: 10,
    attachedIds: ["scope"],
    magazines: 0,
    partialMagazines: [],
    isPatron: true,
  });
  inv.carried.equipment.push({
    equipmentId: "grenades",
    totalCharges: 2,
    usedCharges: 0,
    isPatron: true,
  });
  inv.carried.vehicles.push({ vehicleId: "motorcycle", isPatron: true });
  inv.carried.attachments.push({
    attachmentId: "bayonet",
    totalCharges: 0,
    usedCharges: 0,
    isPatron: true,
  });
  assertEquals(countLocationSlots(inv.carried, slotLookups), 0);
});

Deno.test("patron-marked restricted weapons and vehicles add no point cost", () => {
  const inv = createEmptyInventory();
  inv.carried.weapons.push({
    weaponId: "lewis-gun",
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
    isPatron: true,
  });
  inv.stowed.vehicles.push({ vehicleId: "mark-v", isPatron: true });
  assertEquals(calculateInventoryPointCostWithPerks(inv, ["patron"]), 0);
});

Deno.test("weapon master non-restricted weapons do not consume paid item slots", () => {
  const inv = createEmptyInventory();
  for (let i = 0; i < 4; i++) {
    inv.carried.weapons.push({
      weaponId: "lee-enfield",
      currentAmmo: 10,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
    });
  }
  assertEquals(calculateInventoryPointCostWithPerks(inv), 1);
  assertEquals(
    calculateInventoryPointCostWithPerks(inv, ["weapon-master"]),
    0,
  );
});

Deno.test("weapon master restricted weapons cost 1 with no extra slot tax", () => {
  const inv = createEmptyInventory();
  for (let i = 0; i < 3; i++) {
    inv.carried.weapons.push({
      weaponId: "lee-enfield",
      currentAmmo: 10,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
    });
  }
  inv.carried.weapons.push({
    weaponId: "flamethrower",
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  assertEquals(getWeaponPointCost("flamethrower", ["weapon-master"]), 1);
  assertEquals(
    calculateInventoryPointCostWithPerks(inv, ["weapon-master"]),
    1,
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

Deno.test("base charisma keeps 3 free item slots", () => {
  assertEquals(getFreeItemSlots(1), 3);
  assertEquals(getFreeItemSlots(), 3);
});

Deno.test("every 2 charisma points invested add one free item slot", () => {
  assertEquals(getFreeItemSlots(2), 3);
  assertEquals(getFreeItemSlots(3), 4);
  assertEquals(getFreeItemSlots(4), 4);
  assertEquals(getFreeItemSlots(5), 5);
  assertEquals(getFreeItemSlots(7), 6);
});

Deno.test("charisma 3 makes a fourth zero-cost item free", () => {
  const inv = createEmptyInventory();
  for (let i = 0; i < 4; i++) {
    inv.carried.weapons.push({
      weaponId: "lee-enfield",
      currentAmmo: 10,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
    });
  }
  assertEquals(calculateInventoryPointCostWithPerks(inv, undefined, 1), 1);
  assertEquals(calculateInventoryPointCostWithPerks(inv, undefined, 3), 0);
});

Deno.test("applyCharismaItemDiscount leaves free items free", () => {
  assertEquals(applyCharismaItemDiscount(0, 5), 0);
});

Deno.test("applyCharismaItemDiscount does nothing at Charisma 1", () => {
  assertEquals(applyCharismaItemDiscount(3, 1), 3);
  assertEquals(applyCharismaItemDiscount(1, 1), 1);
});

Deno.test("Charisma takes 1 point off per 2 Charisma past the first", () => {
  assertEquals(getCharismaItemDiscount(1), 0);
  assertEquals(getCharismaItemDiscount(2), 0);
  assertEquals(getCharismaItemDiscount(3), 1);
  assertEquals(getCharismaItemDiscount(4), 1);
  assertEquals(getCharismaItemDiscount(5), 2);
  assertEquals(getCharismaItemDiscount(20), 9);
});

Deno.test("applyCharismaItemDiscount subtracts 1 per 2 Charisma past the first", () => {
  assertEquals(applyCharismaItemDiscount(6, 2), 6);
  assertEquals(applyCharismaItemDiscount(6, 3), 5);
  assertEquals(applyCharismaItemDiscount(6, 4), 5);
  assertEquals(applyCharismaItemDiscount(6, 5), 4);
  assertEquals(applyCharismaItemDiscount(6, 7), 3);
});

Deno.test("applyCharismaItemDiscount never drops a paid item below 1", () => {
  assertEquals(applyCharismaItemDiscount(3, 8), 1);
  assertEquals(applyCharismaItemDiscount(1, 5), 1);
});

Deno.test("getWeaponPointCost applies Charisma discount after perk discounts", () => {
  const expensiveId = "flamethrower";
  assertEquals(getWeaponPointCost(expensiveId), 3);
  assertEquals(getWeaponPointCost(expensiveId, undefined, undefined, 2), 3);
  assertEquals(getWeaponPointCost(expensiveId, undefined, undefined, 3), 2);
  assertEquals(getWeaponPointCost(expensiveId, undefined, undefined, 5), 1);
  assertEquals(getWeaponPointCost(expensiveId, undefined, undefined, 8), 1);
});

Deno.test("getVehiclePointCost applies Charisma discount with a minimum of 1", () => {
  assertEquals(getVehiclePointCost("mark-v"), 6);
  assertEquals(getVehiclePointCost("mark-v", 1), 6);
  assertEquals(getVehiclePointCost("mark-v", 3), 5);
  assertEquals(getVehiclePointCost("mark-v", 5), 4);
  assertEquals(getVehiclePointCost("mark-v", 11), 1);
  assertEquals(getVehiclePointCost("mark-v", 20), 1);
  assertEquals(getVehiclePointCost("motorcycle", 5), 1);
});

Deno.test("inventory point cost discounts paid weapons and vehicles by Charisma", () => {
  const inv = createEmptyInventory();
  inv.carried.weapons.push({
    weaponId: "flamethrower",
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  inv.stowed.vehicles.push({ vehicleId: "mark-v" });
  assertEquals(calculateInventoryPointCostWithPerks(inv, undefined, 1), 9);
  // Charisma 3 (discount 1): flamethrower 2 + Mark V 5.
  assertEquals(calculateInventoryPointCostWithPerks(inv, undefined, 3), 7);
  // Charisma 5 (discount 2): flamethrower 1 + Mark V 4.
  assertEquals(calculateInventoryPointCostWithPerks(inv, undefined, 5), 5);
});

Deno.test("signature weapon limit is the perk rank capped at 2", () => {
  assertEquals(getSignatureWeaponLimit(["runner"]), 0);
  assertEquals(getSignatureWeaponLimit(["signature-weapon"]), 1);
  assertEquals(
    getSignatureWeaponLimit(["signature-weapon"], { "signature-weapon": 2 }),
    2,
  );
  assertEquals(
    getSignatureWeaponLimit(["signature-weapon"], { "signature-weapon": 9 }),
    2,
  );
});

Deno.test("two signature weapons grant the union of their attachments", () => {
  const inv = createEmptyInventory();
  inv.carried.weapons.push({
    weaponId: "dagger",
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
    isSignatureWeapon: true,
  });
  inv.carried.weapons.push({
    weaponId: "lee-enfield",
    currentAmmo: 10,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
    isSignatureWeapon: true,
  });
  const freeIds = getSignatureFreeAttachmentIds(inv, ["signature-weapon"], {
    "signature-weapon": 2,
  });
  assertEquals(freeIds.has("bayonet"), true);
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

Deno.test("parseInventory preserves isPatron flags", async () => {
  const { parseInventory } = await import("./inventory_parsing.ts");
  const parsed = parseInventory({
    carried: {
      weapons: [{
        weaponId: "lee-enfield",
        currentAmmo: 10,
        attachedIds: [],
        magazines: 0,
        partialMagazines: [],
        isPatron: true,
      }],
      equipment: [{
        equipmentId: "grenades",
        totalCharges: 1,
        usedCharges: 0,
        isPatron: true,
      }],
      vehicles: [{ vehicleId: "motorcycle", isPatron: true }],
      attachments: [{
        attachmentId: "bayonet",
        totalCharges: 0,
        usedCharges: 0,
        isPatron: true,
      }],
    },
  });
  assertEquals(parsed?.carried.weapons[0].isPatron, true);
  assertEquals(parsed?.carried.equipment[0].isPatron, true);
  assertEquals(parsed?.carried.vehicles[0].isPatron, true);
  assertEquals(parsed?.carried.attachments[0].isPatron, true);
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

Deno.test("parseInventory preserves weapon concealed flag", async () => {
  const { parseInventory } = await import("./inventory_parsing.ts");
  const parsed = parseInventory({
    carried: {
      weapons: [{
        weaponId: "dagger",
        currentAmmo: 0,
        attachedIds: [],
        magazines: 0,
        partialMagazines: [],
        concealed: false,
      }, {
        weaponId: "derringer",
        currentAmmo: 2,
        attachedIds: [],
        magazines: 0,
        partialMagazines: [],
        concealed: true,
      }, {
        weaponId: "lee-enfield",
        currentAmmo: 10,
        attachedIds: [],
        magazines: 0,
        partialMagazines: [],
      }],
    },
  });
  assertEquals(parsed?.carried.weapons[0].concealed, false);
  assertEquals(parsed?.carried.weapons[1].concealed, true);
  assertEquals(parsed?.carried.weapons[2].concealed, undefined);
});

Deno.test("parseInventory preserves meleeWeapons concealed when folding into weapons", async () => {
  const { parseInventory } = await import("./inventory_parsing.ts");
  const parsed = parseInventory({
    carried: {
      meleeWeapons: [{
        instanceId: "mw-1",
        meleeWeaponId: "dagger",
        concealed: false,
      }, {
        instanceId: "mw-2",
        meleeWeaponId: "throwing-dagger",
        concealed: true,
      }],
    },
  });
  assertEquals(parsed?.carried.meleeWeapons.length, 0);
  assertEquals(parsed?.carried.weapons.map((w) => w.weaponId), [
    "dagger",
    "throwing-dagger",
  ]);
  assertEquals(parsed?.carried.weapons[0].concealed, false);
  assertEquals(parsed?.carried.weapons[1].concealed, true);
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

// ---------------------------------------------------------------------------
// Charisma minimum applies to an item's whole cost (own cost + slot surcharge)
// ---------------------------------------------------------------------------

function pushWeapon(inv: CharacterInventory, weaponId: string) {
  inv.carried.weapons.push({
    weaponId,
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
}

/** Inventory with `count` zero-cost rifles filling item slots. */
function inventoryWithFreeRifles(count: number): CharacterInventory {
  const inv = createEmptyInventory();
  for (let i = 0; i < count; i++) pushWeapon(inv, "lee-enfield");
  return inv;
}

Deno.test("Charisma 20 drops an SMG past the free slots to the 1-point minimum", () => {
  const charisma = 20;
  const freeSlots = getFreeItemSlots(charisma);
  const inv = inventoryWithFreeRifles(freeSlots);
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], charisma), 0);

  // What the "Add" button shows for the SMG.
  const breakdown = getInventoryPointCostBreakdown(inv, [], charisma);
  assertEquals(
    getItemAddPointCost(
      breakdown,
      getWeaponPointCost("thompson"),
      true,
      charisma,
    ),
    1,
  );

  // What the inventory total charges once it's added.
  pushWeapon(inv, "thompson");
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], charisma), 1);
});

Deno.test("Charisma 20 makes every SMG cost 1, inside or past the free slots", () => {
  const charisma = 20;
  for (const smgId of ["mp-18", "thompson", "furrer-mp19"]) {
    const inv = createEmptyInventory();
    pushWeapon(inv, smgId);
    assertEquals(calculateInventoryPointCostWithPerks(inv, [], charisma), 1);
  }
  const inv = inventoryWithFreeRifles(getFreeItemSlots(charisma));
  pushWeapon(inv, "mp-18");
  pushWeapon(inv, "furrer-mp19");
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], charisma), 2);
});

Deno.test("a paid item past the free slots: whole cost discounted, minimum 1", () => {
  // Charisma 1: own cost 3 + 1 surcharge, no discount.
  let inv = inventoryWithFreeRifles(getFreeItemSlots(1));
  pushWeapon(inv, "thompson");
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], 1), 4);

  // Charisma 5 (discount 2): 3 + 1 - 2 = 2.
  inv = inventoryWithFreeRifles(getFreeItemSlots(5));
  pushWeapon(inv, "thompson");
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], 5), 2);

  // Charisma 7 (discount 3): 3 + 1 - 3 = 1.
  inv = inventoryWithFreeRifles(getFreeItemSlots(7));
  pushWeapon(inv, "thompson");
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], 7), 1);

  // Vehicles too: Mark V (6) past the free slots at Charisma 20 costs 1.
  inv = inventoryWithFreeRifles(getFreeItemSlots(20));
  inv.stowed.vehicles.push({ vehicleId: "mark-v" });
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], 20), 1);
});

Deno.test("zero-cost items past the free slots still cost 1 at high Charisma", () => {
  const charisma = 20;
  const inv = inventoryWithFreeRifles(getFreeItemSlots(charisma) + 1);
  assertEquals(calculateInventoryPointCostWithPerks(inv, [], charisma), 1);
});

Deno.test("add-item cost matches the change in the inventory total", () => {
  const cases: Array<[number, number, string[]]> = [
    [1, 3, ["thompson"]],
    [1, 2, ["lee-enfield"]],
    [5, 5, ["thompson", "lee-enfield"]],
    [7, 6, ["flamethrower", "thompson"]],
    [20, 11, ["thompson", "lee-enfield", "mp-18"]],
    [20, 12, ["lee-enfield", "thompson"]],
  ];
  for (const [charisma, rifles, toAdd] of cases) {
    const inv = inventoryWithFreeRifles(rifles);
    for (const weaponId of toAdd) {
      const before = getInventoryPointCostBreakdown(inv, [], charisma);
      const quoted = getItemAddPointCost(
        before,
        getWeaponPointCost(weaponId),
        true,
        charisma,
      );
      pushWeapon(inv, weaponId);
      const after = calculateInventoryPointCostWithPerks(inv, [], charisma);
      assertEquals(
        after - before.total,
        quoted,
        `CHA ${charisma}, ${rifles} rifles, adding ${weaponId}`,
      );
    }
  }
});
