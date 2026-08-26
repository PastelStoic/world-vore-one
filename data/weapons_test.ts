/**
 * Catalog invariants for ranged weapons.
 * Run: deno test -A data/weapons_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { WEAPONS } from "./weapons.ts";

Deno.test("every weapon has a compatibleAttachmentIds array", () => {
  const missing = WEAPONS
    .filter((weapon) => !Array.isArray(weapon.compatibleAttachmentIds))
    .map((weapon) => weapon.id);
  assertEquals(missing, []);
});
