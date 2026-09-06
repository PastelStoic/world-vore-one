/**
 * Unit tests for signature-weapon free attachments.
 * Run: deno test -A components/inventory/helpers_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { LONG_GUN_ATTACHMENTS, WEAPONS_BY_ID } from "@/data/weapons.ts";
import { createEmptyInventory } from "@/lib/inventory_types.ts";
import {
  getSignatureFreeAttachmentIds,
  isEquipmentConcealed,
  isSignatureFreeAttachment,
  isWeaponConcealable,
  isWeaponConcealed,
  withoutConcealedItems,
} from "./helpers.ts";

Deno.test("signature weapon grants every compatible attachment", () => {
  const leeEnfield = [...WEAPONS_BY_ID.values()].find((weapon) =>
    weapon.compatibleAttachmentIds.some((id) =>
      LONG_GUN_ATTACHMENTS.includes(id)
    ) &&
    weapon.compatibleAttachmentIds.some((id) =>
      !LONG_GUN_ATTACHMENTS.includes(id)
    )
  );
  if (!leeEnfield) {
    throw new Error(
      "Expected a weapon with both shared and unique attachments",
    );
  }

  const inventory = createEmptyInventory();
  inventory.carried.weapons.push({
    weaponId: leeEnfield.id,
    currentAmmo: leeEnfield.ammo,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
    isSignatureWeapon: true,
  });

  const freeIds = getSignatureFreeAttachmentIds(inventory, [
    "signature-weapon",
  ]);
  assertEquals(
    [...freeIds].sort(),
    [...leeEnfield.compatibleAttachmentIds].sort(),
  );

  for (const attachmentId of leeEnfield.compatibleAttachmentIds) {
    assertEquals(isSignatureFreeAttachment(leeEnfield, attachmentId), true);
  }
  assertEquals(isSignatureFreeAttachment(leeEnfield, "not-real"), false);
});

Deno.test("catalog concealable equipment is concealed by default", () => {
  assertEquals(
    isEquipmentConcealed({
      equipmentId: "cyanide-pill",
      totalCharges: 0,
      usedCharges: 0,
    }),
    true,
  );
  assertEquals(
    isEquipmentConcealed({
      equipmentId: "disguise-kit",
      totalCharges: 0,
      usedCharges: 0,
    }),
    true,
  );
  assertEquals(
    isEquipmentConcealed({
      equipmentId: "grenades",
      totalCharges: 1,
      usedCharges: 0,
    }),
    false,
  );
});

Deno.test("instance concealed flag overrides catalog default", () => {
  assertEquals(
    isEquipmentConcealed({
      equipmentId: "cyanide-pill",
      totalCharges: 0,
      usedCharges: 0,
      concealed: false,
    }),
    false,
  );
  assertEquals(
    isEquipmentConcealed({
      equipmentId: "grenades",
      totalCharges: 1,
      usedCharges: 0,
      concealed: true,
    }),
    true,
  );
});

Deno.test("catalog concealable weapons are concealed by default", () => {
  assertEquals(isWeaponConcealable("dagger"), true);
  assertEquals(isWeaponConcealable("throwing-dagger"), true);
  assertEquals(isWeaponConcealable("derringer"), true);
  assertEquals(isWeaponConcealable("kolibri"), true);
  assertEquals(isWeaponConcealable("lee-enfield"), false);
  assertEquals(isWeaponConcealable("combat-knife"), false);

  assertEquals(
    isWeaponConcealed({
      weaponId: "dagger",
      currentAmmo: 0,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
    }),
    true,
  );
  assertEquals(
    isWeaponConcealed({
      weaponId: "derringer",
      currentAmmo: 2,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
    }),
    true,
  );
  assertEquals(
    isWeaponConcealed({
      weaponId: "lee-enfield",
      currentAmmo: 10,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
    }),
    false,
  );
});

Deno.test("weapon instance concealed flag overrides catalog default", () => {
  assertEquals(
    isWeaponConcealed({
      weaponId: "dagger",
      currentAmmo: 0,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
      concealed: false,
    }),
    false,
  );
  assertEquals(
    isWeaponConcealed({
      weaponId: "lee-enfield",
      currentAmmo: 10,
      attachedIds: [],
      magazines: 0,
      partialMagazines: [],
      concealed: true,
    }),
    true,
  );
});

Deno.test("withoutConcealedItems hides concealed weapons and concealed equipment", () => {
  const inventory = createEmptyInventory();
  inventory.carried.weapons.push({
    weaponId: "dagger",
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  inventory.carried.weapons.push({
    weaponId: "dagger",
    currentAmmo: 0,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
    concealed: false,
  });
  inventory.carried.weapons.push({
    weaponId: "derringer",
    currentAmmo: 2,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  inventory.carried.weapons.push({
    weaponId: "lee-enfield",
    currentAmmo: 10,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  });
  inventory.carried.equipment.push({
    equipmentId: "cyanide-pill",
    totalCharges: 0,
    usedCharges: 0,
  });
  inventory.carried.equipment.push({
    equipmentId: "grenades",
    totalCharges: 2,
    usedCharges: 0,
  });
  inventory.stowed.equipment.push({
    equipmentId: "radio-kit",
    totalCharges: 0,
    usedCharges: 0,
    concealed: true,
  });
  inventory.carried.meleeWeapons.push({
    instanceId: "mw-dagger-hidden",
    meleeWeaponId: "dagger",
  });
  inventory.carried.meleeWeapons.push({
    instanceId: "mw-sabre",
    meleeWeaponId: "sabre",
  });
  inventory.carried.meleeWeapons.push({
    instanceId: "mw-dagger-revealed",
    meleeWeaponId: "dagger",
    concealed: false,
  });

  const displayed = withoutConcealedItems(inventory);
  assertEquals(displayed.carried.weapons.map((w) => w.weaponId), [
    "dagger",
    "lee-enfield",
  ]);
  assertEquals(displayed.carried.weapons[0].concealed, false);
  assertEquals(displayed.carried.equipment.map((eq) => eq.equipmentId), [
    "grenades",
  ]);
  assertEquals(displayed.stowed.equipment.length, 0);
  assertEquals(displayed.carried.meleeWeapons.map((mw) => mw.instanceId), [
    "mw-sabre",
    "mw-dagger-revealed",
  ]);
  assertEquals(inventory.carried.equipment.length, 2);
  assertEquals(inventory.carried.weapons.length, 4);
  assertEquals(inventory.carried.meleeWeapons.length, 3);
});
