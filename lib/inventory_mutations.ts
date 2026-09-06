/** Pure inventory mutators — caller passes a cloned inventory. */

import { ATTACHMENTS_BY_ID, WEAPONS_BY_ID } from "@/data/equipment.ts";
import type {
  CharacterInventory,
  InventoryAttachment,
  InventoryWeapon,
} from "./inventory_types.ts";

export type InventoryLocation = "carried" | "stowed";

export function clearSignatureFlags(inv: CharacterInventory): void {
  for (const loc of ["carried", "stowed"] as const) {
    for (const w of inv[loc].weapons) w.isSignatureWeapon = false;
    for (const mw of inv[loc].meleeWeapons) mw.isSignatureWeapon = false;
  }
}

export function removeSignatureAttachments(inv: CharacterInventory): void {
  for (const loc of ["carried", "stowed"] as const) {
    inv[loc].attachments = inv[loc].attachments.filter(
      (a) => a.perkGranted !== "signature-weapon",
    );
  }
}

export function toggleSignatureWeapon(
  inv: CharacterInventory,
  location: InventoryLocation,
  index: number,
): CharacterInventory {
  const isAlready = inv[location].weapons[index].isSignatureWeapon;
  clearSignatureFlags(inv);
  removeSignatureAttachments(inv);
  if (!isAlready) {
    const weapon = inv[location].weapons[index];
    weapon.isSignatureWeapon = true;
    const def = WEAPONS_BY_ID.get(weapon.weaponId);
    if (def?.kind === "melee") return inv;
    for (const aId of def?.compatibleAttachmentIds ?? []) {
      const aDef = ATTACHMENTS_BY_ID.get(aId);
      inv[location].attachments.push({
        attachmentId: aId,
        totalCharges: aDef?.isCharge ? 1 : 0,
        usedCharges: 0,
        perkGranted: "signature-weapon",
      });
    }
  }
  return inv;
}

export function addWeapon(
  inv: CharacterInventory,
  weaponId: string,
  location: InventoryLocation,
  options?: { unlockRestricted?: boolean },
): CharacterInventory {
  const def = WEAPONS_BY_ID.get(weaponId);
  if (!def || def.deprecated) return inv;
  const item: InventoryWeapon = {
    weaponId,
    instanceId: crypto.randomUUID(),
    currentAmmo: def.kind === "melee" ? 0 : def.ammo,
    attachedIds: [],
    magazines: 0,
    partialMagazines: [],
  };
  if (def.traitIds.includes("concealable")) item.concealed = true;
  if (options?.unlockRestricted && def.pointCost >= 3) {
    inv.weaponMasterRestrictedUnlocks ??= [];
    if (!inv.weaponMasterRestrictedUnlocks.includes(weaponId)) {
      inv.weaponMasterRestrictedUnlocks.push(weaponId);
    }
  }
  inv[location].weapons.push(item);
  return inv;
}

export function moveItem<K extends "weapons" | "equipment" | "attachments">(
  inv: CharacterInventory,
  key: K,
  from: InventoryLocation,
  index: number,
  to: InventoryLocation,
): CharacterInventory {
  const [item] = inv[from][key].splice(index, 1);
  if (!item) return inv;
  (inv[to][key] as typeof item[]).push(item);
  return inv;
}

export function createLooseAttachment(
  attachmentId: string,
): InventoryAttachment | null {
  const def = ATTACHMENTS_BY_ID.get(attachmentId);
  if (!def || def.deprecated) return null;
  return {
    attachmentId,
    totalCharges: def.isCharge ? 1 : 0,
    usedCharges: 0,
  };
}
