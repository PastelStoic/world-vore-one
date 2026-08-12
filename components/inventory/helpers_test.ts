/**
 * Unit tests for signature-weapon free attachments.
 * Run: deno test -A components/inventory/helpers_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { LONG_GUN_ATTACHMENTS, WEAPONS_BY_ID } from "@/data/weapons.ts";
import { createEmptyInventory } from "@/lib/inventory_types.ts";
import {
  getSignatureFreeAttachmentIds,
  isSignatureFreeAttachment,
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
    throw new Error("Expected a weapon with both shared and unique attachments");
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
