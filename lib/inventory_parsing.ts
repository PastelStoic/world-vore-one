// ---------------------------------------------------------------------------
// Inventory JSON parsing with backward compatibility
// ---------------------------------------------------------------------------

import type {
  CharacterInventory,
  InventoryAttachment,
  InventoryEquipment,
  InventoryMeleeWeapon,
  InventoryVehicle,
  InventoryWeapon,
} from "./inventory_types.ts";
import { createEmptyInventory } from "./inventory_types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string");
}

function asNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter((n): n is number =>
    typeof n === "number" && Number.isFinite(n)
  );
}

function parseAttachmentChargeData(
  value: unknown,
): InventoryWeapon["attachmentChargeData"] | undefined {
  if (!isRecord(value)) return undefined;
  const result: NonNullable<InventoryWeapon["attachmentChargeData"]> = {};
  for (const [attachmentId, raw] of Object.entries(value)) {
    if (!isRecord(raw)) continue;
    const totalCharges = asNumber(raw.totalCharges);
    const usedCharges = asNumber(raw.usedCharges);
    if (totalCharges === undefined || usedCharges === undefined) continue;
    result[attachmentId] = { totalCharges, usedCharges };
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function parseWeapon(raw: unknown): InventoryWeapon | null {
  if (!isRecord(raw)) return null;
  const weaponId = asString(raw.weaponId);
  if (!weaponId) return null;

  const weapon: InventoryWeapon = {
    weaponId,
    instanceId: asString(raw.instanceId) ?? crypto.randomUUID(),
    currentAmmo: asNumber(raw.currentAmmo) ?? 0,
    attachedIds: asStringArray(raw.attachedIds),
    magazines: asNumber(raw.magazines) ?? 0,
    partialMagazines: asNumberArray(raw.partialMagazines),
  };
  if (raw.isSignatureWeapon) weapon.isSignatureWeapon = true;
  const extraTrait = asString(raw.signatureExtraTraitId);
  if (extraTrait) weapon.signatureExtraTraitId = extraTrait;
  const weaponPerk = asString(raw.perkGranted);
  if (weaponPerk) weapon.perkGranted = weaponPerk;
  const reloadProgress = asNumber(raw.reloadProgress);
  if (reloadProgress !== undefined && reloadProgress > 0) {
    weapon.reloadProgress = reloadProgress;
  }
  const chargeData = parseAttachmentChargeData(raw.attachmentChargeData);
  if (chargeData) weapon.attachmentChargeData = chargeData;
  return weapon;
}

function parseMeleeWeapon(raw: unknown): InventoryMeleeWeapon | null {
  if (!isRecord(raw)) return null;
  const instanceId = asString(raw.instanceId);
  const meleeWeaponId = asString(raw.meleeWeaponId);
  if (!instanceId || !meleeWeaponId) return null;

  const melee: InventoryMeleeWeapon = { instanceId, meleeWeaponId };
  if (raw.isSignatureWeapon) melee.isSignatureWeapon = true;
  const extraTrait = asString(raw.signatureExtraTraitId);
  if (extraTrait) melee.signatureExtraTraitId = extraTrait;
  const perkGranted = asString(raw.perkGranted);
  if (perkGranted) melee.perkGranted = perkGranted;
  return melee;
}

const GHOST_EQUIPMENT_REMAP: Record<
  string,
  { equipmentId: string; weightOverride: number; isBulkyOverride: boolean }
> = {
  "entrenching-gear-sapper": {
    equipmentId: "entrenching-gear",
    weightOverride: 0,
    isBulkyOverride: false,
  },
  "explosives-kit-sapper": {
    equipmentId: "explosives-kit",
    weightOverride: 0,
    isBulkyOverride: false,
  },
};

function parseEquipment(raw: unknown): InventoryEquipment | null {
  if (!isRecord(raw)) return null;
  let equipmentId = asString(raw.equipmentId);
  if (!equipmentId) return null;
  const remap = GHOST_EQUIPMENT_REMAP[equipmentId];
  if (remap) equipmentId = remap.equipmentId;

  const equipment: InventoryEquipment = {
    equipmentId,
    totalCharges: asNumber(raw.totalCharges) ?? asNumber(raw.charges) ?? 1,
    usedCharges: asNumber(raw.usedCharges) ?? 0,
  };
  if (remap) {
    equipment.weightOverride = remap.weightOverride;
    equipment.isBulkyOverride = remap.isBulkyOverride;
  }
  const perkGranted = asString(raw.perkGranted);
  if (perkGranted) equipment.perkGranted = perkGranted;
  const weightOverride = asNumber(raw.weightOverride);
  if (weightOverride !== undefined) equipment.weightOverride = weightOverride;
  const isBulkyOverride = asBoolean(raw.isBulkyOverride);
  if (isBulkyOverride !== undefined) equipment.isBulkyOverride = isBulkyOverride;
  const concealed = asBoolean(raw.concealed);
  if (concealed !== undefined) equipment.concealed = concealed;
  return equipment;
}

function parseVehicle(raw: unknown): InventoryVehicle | null {
  if (!isRecord(raw)) return null;
  const vehicleId = asString(raw.vehicleId);
  if (!vehicleId) return null;
  return { vehicleId };
}

function parseAttachment(raw: unknown): InventoryAttachment | null {
  if (!isRecord(raw)) return null;
  const attachmentId = asString(raw.attachmentId);
  if (!attachmentId) return null;

  const attachment: InventoryAttachment = {
    attachmentId,
    totalCharges: asNumber(raw.totalCharges) ?? 0,
    usedCharges: asNumber(raw.usedCharges) ?? 0,
  };
  const saved = asNumberArray(raw.savedMagazineStates);
  if (saved.length > 0) attachment.savedMagazineStates = saved;
  const perkGranted = asString(raw.perkGranted);
  if (perkGranted) attachment.perkGranted = perkGranted;
  return attachment;
}

/**
 * Parse an inventory from a JSON string or already-decoded object.
 * Backwards-compatible: reads old `charges` field as `totalCharges`.
 */
export function parseInventory(raw: unknown): CharacterInventory | null {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!isRecord(parsed)) return null;

    const inv = createEmptyInventory();
    inv.weaponMasterRestrictedUnlocks = asStringArray(
      parsed.weaponMasterRestrictedUnlocks,
    );

    for (const location of ["carried", "stowed"] as const) {
      const src = parsed[location];
      if (!isRecord(src)) continue;

      if (Array.isArray(src.weapons)) {
        inv[location].weapons = src.weapons.flatMap((item) => {
          const weapon = parseWeapon(item);
          return weapon ? [weapon] : [];
        });
      }

      if (Array.isArray(src.meleeWeapons)) {
        inv[location].meleeWeapons = src.meleeWeapons.flatMap((item) => {
          const melee = parseMeleeWeapon(item);
          return melee ? [melee] : [];
        });
      }

      if (Array.isArray(src.equipment)) {
        inv[location].equipment = src.equipment.flatMap((item) => {
          const equipment = parseEquipment(item);
          return equipment ? [equipment] : [];
        });
      }

      if (Array.isArray(src.vehicles)) {
        inv[location].vehicles = src.vehicles.flatMap((item) => {
          const vehicle = parseVehicle(item);
          return vehicle ? [vehicle] : [];
        });
      }

      if (Array.isArray(src.attachments)) {
        inv[location].attachments = src.attachments.flatMap((item) => {
          const attachment = parseAttachment(item);
          return attachment ? [attachment] : [];
        });
      }

      // Fold legacy meleeWeapons[] into weapons[] (kind is implied by catalog).
      if (inv[location].meleeWeapons.length > 0) {
        for (const melee of inv[location].meleeWeapons) {
          inv[location].weapons.push({
            weaponId: melee.meleeWeaponId,
            instanceId: melee.instanceId,
            currentAmmo: 0,
            attachedIds: [],
            magazines: 0,
            partialMagazines: [],
            isSignatureWeapon: melee.isSignatureWeapon,
            signatureExtraTraitId: melee.signatureExtraTraitId,
            perkGranted: melee.perkGranted,
          });
        }
        inv[location].meleeWeapons = [];
      }
    }

    return inv;
  } catch {
    return null;
  }
}
