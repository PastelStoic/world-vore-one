// ---------------------------------------------------------------------------
// Inventory JSON parsing with backward compatibility
// ---------------------------------------------------------------------------

import type {
  CharacterInventory,
  InventoryAttachment,
  InventoryEquipment,
  InventoryMeleeWeapon,
  InventoryWeapon,
} from "./inventory_types.ts";
import { createEmptyInventory } from "./inventory_types.ts";

/**
 * Parse an inventory from a JSON string (from form data).
 * Backwards-compatible: reads old `charges` field as `totalCharges`.
 */
export function parseInventory(raw: string): CharacterInventory | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const inv = createEmptyInventory();

    for (const location of ["carried", "stowed"] as const) {
      const src = parsed[location];
      if (!src || typeof src !== "object") continue;

      if (Array.isArray(src.weapons)) {
        inv[location].weapons = src.weapons.filter(
          (w: unknown) =>
            w &&
            typeof w === "object" &&
            typeof (w as Record<string, unknown>).weaponId === "string",
        ).map((w: Record<string, unknown>): InventoryWeapon => ({
          weaponId: String(w.weaponId),
          currentAmmo: typeof w.currentAmmo === "number" ? w.currentAmmo : 0,
          attachedIds: Array.isArray(w.attachedIds)
            ? (w.attachedIds as unknown[]).filter((id): id is string =>
              typeof id === "string"
            )
            : [],
          magazines: typeof w.magazines === "number" ? w.magazines : 0,
          partialMagazines: Array.isArray(w.partialMagazines)
            ? (w.partialMagazines as unknown[]).filter((n): n is number =>
              typeof n === "number"
            )
            : [],
          ...(w.isSignatureWeapon ? { isSignatureWeapon: true } : {}),
          ...(typeof w.reloadProgress === "number" && w.reloadProgress > 0
            ? { reloadProgress: w.reloadProgress }
            : {}),
        }));
      }

      if (Array.isArray(src.meleeWeapons)) {
        inv[location].meleeWeapons = src.meleeWeapons.filter(
          (w: unknown) =>
            w &&
            typeof w === "object" &&
            typeof (w as Record<string, unknown>).instanceId === "string",
        ).map((w: Record<string, unknown>): InventoryMeleeWeapon => ({
          instanceId: String(w.instanceId),
          name: String(w.name ?? ""),
          damage: typeof w.damage === "number" ? w.damage : 0,
          weight: typeof w.weight === "number" ? w.weight : 1,
          traitIds: Array.isArray(w.traitIds)
            ? (w.traitIds as unknown[]).filter((id): id is string =>
              typeof id === "string"
            )
            : [],
          description: String(w.description ?? ""),
          ...(w.isSignatureWeapon ? { isSignatureWeapon: true } : {}),
        }));
      }

      if (Array.isArray(src.equipment)) {
        inv[location].equipment = src.equipment.filter(
          (e: unknown) =>
            e &&
            typeof e === "object" &&
            typeof (e as Record<string, unknown>).equipmentId === "string",
        ).map((e: Record<string, unknown>): InventoryEquipment => ({
          equipmentId: String(e.equipmentId),
          totalCharges: typeof e.totalCharges === "number"
            ? e.totalCharges
            : typeof e.charges === "number"
            ? e.charges
            : 1,
          usedCharges: typeof e.usedCharges === "number" ? e.usedCharges : 0,
        }));
      }

      if (Array.isArray(src.attachments)) {
        inv[location].attachments = src.attachments.filter(
          (a: unknown) =>
            a &&
            typeof a === "object" &&
            typeof (a as Record<string, unknown>).attachmentId === "string",
        ).map((a: Record<string, unknown>): InventoryAttachment => ({
          attachmentId: String(a.attachmentId),
          totalCharges: typeof a.totalCharges === "number" ? a.totalCharges : 0,
          usedCharges: typeof a.usedCharges === "number" ? a.usedCharges : 0,
          ...(Array.isArray(a.savedMagazineStates)
            ? {
              savedMagazineStates: (a.savedMagazineStates as unknown[]).filter((
                n,
              ): n is number => typeof n === "number"),
            }
            : {}),
        }));
      }
    }

    return inv;
  } catch {
    return null;
  }
}
