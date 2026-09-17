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

export function rebuildSignatureAttachments(inv: CharacterInventory): void {
  removeSignatureAttachments(inv);
  for (const loc of ["carried", "stowed"] as const) {
    for (const weapon of inv[loc].weapons) {
      if (!weapon.isSignatureWeapon) continue;
      const def = WEAPONS_BY_ID.get(weapon.weaponId);
      if (!def || def.kind === "melee") continue;
      for (const aId of def.compatibleAttachmentIds ?? []) {
        const aDef = ATTACHMENTS_BY_ID.get(aId);
        inv[loc].attachments.push({
          attachmentId: aId,
          totalCharges: aDef?.isCharge ? 1 : 0,
          usedCharges: 0,
          perkGranted: "signature-weapon",
        });
      }
    }
  }
}

export function countSignatureWeapons(inv: CharacterInventory): number {
  let count = 0;
  for (const loc of ["carried", "stowed"] as const) {
    for (const w of inv[loc].weapons) {
      if (w.isSignatureWeapon) count += 1;
    }
    for (const mw of inv[loc].meleeWeapons) {
      if (mw.isSignatureWeapon) count += 1;
    }
  }
  return count;
}

export function enforceSignatureWeaponLimit(
  inv: CharacterInventory,
  maxSignatures: number,
): CharacterInventory {
  if (maxSignatures <= 0) {
    clearSignatureFlags(inv);
    removeSignatureAttachments(inv);
    return inv;
  }
  let kept = 0;
  for (const loc of ["carried", "stowed"] as const) {
    for (const w of inv[loc].weapons) {
      if (!w.isSignatureWeapon) continue;
      kept += 1;
      if (kept > maxSignatures) w.isSignatureWeapon = false;
    }
    for (const mw of inv[loc].meleeWeapons) {
      if (!mw.isSignatureWeapon) continue;
      kept += 1;
      if (kept > maxSignatures) mw.isSignatureWeapon = false;
    }
  }
  rebuildSignatureAttachments(inv);
  return inv;
}

export type PatronItemKind =
  | "weapons"
  | "meleeWeapons"
  | "equipment"
  | "vehicles"
  | "attachments";

export function clearPatronFlags(inv: CharacterInventory): void {
  for (const loc of ["carried", "stowed"] as const) {
    for (const w of inv[loc].weapons) w.isPatron = false;
    for (const mw of inv[loc].meleeWeapons) mw.isPatron = false;
    for (const e of inv[loc].equipment) e.isPatron = false;
    for (const v of inv[loc].vehicles) v.isPatron = false;
    for (const a of inv[loc].attachments) a.isPatron = false;
  }
}

export function togglePatronItem(
  inv: CharacterInventory,
  location: InventoryLocation,
  kind: PatronItemKind,
  index: number,
): CharacterInventory {
  const item = inv[location][kind][index] as { isPatron?: boolean } | undefined;
  if (!item) return inv;
  item.isPatron = !item.isPatron;
  return inv;
}

export function toggleSignatureWeapon(
  inv: CharacterInventory,
  location: InventoryLocation,
  index: number,
  maxSignatures = 1,
): CharacterInventory {
  const weapon = inv[location].weapons[index];
  if (!weapon) return inv;
  if (weapon.isSignatureWeapon) {
    weapon.isSignatureWeapon = false;
    rebuildSignatureAttachments(inv);
    return inv;
  }
  if (countSignatureWeapons(inv) >= maxSignatures) {
    if (maxSignatures <= 1) {
      clearSignatureFlags(inv);
    } else {
      return inv;
    }
  }
  weapon.isSignatureWeapon = true;
  rebuildSignatureAttachments(inv);
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
