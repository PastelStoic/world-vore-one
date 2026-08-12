import { PERKS_BY_ID } from "@/data/perks.ts";
import type { CharacterInventory } from "./inventory_types.ts";

/** Add and remove perk-granted equipment / melee / attachments. */
export function applyPerkGrantedInventory(
  inventory: CharacterInventory,
  addedPerkIds: string[],
  removedPerkIds: string[],
): CharacterInventory {
  const next = structuredClone(inventory);

  for (const location of ["carried", "stowed"] as const) {
    if (removedPerkIds.length > 0) {
      next[location].equipment = next[location].equipment.filter(
        (item) => !removedPerkIds.includes(item.perkGranted ?? ""),
      );
      next[location].meleeWeapons = next[location].meleeWeapons.filter(
        (weapon) => !removedPerkIds.includes(weapon.perkGranted ?? ""),
      );
      next[location].attachments = next[location].attachments.filter(
        (attachment) => !removedPerkIds.includes(attachment.perkGranted ?? ""),
      );
    }
  }

  for (const perkId of addedPerkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    for (const grant of perk?.grantsEquipment ?? []) {
      next.carried.equipment.push({
        equipmentId: grant.equipmentId,
        totalCharges: 0,
        usedCharges: 0,
        perkGranted: perkId,
        weightOverride: grant.weightOverride,
        isBulkyOverride: grant.isBulkyOverride,
      });
    }
    for (const grant of perk?.grantsMeleeWeapons ?? []) {
      next.carried.meleeWeapons.push({
        instanceId: crypto.randomUUID(),
        meleeWeaponId: grant.meleeWeaponId,
        isSignatureWeapon: true,
        perkGranted: perkId,
      });
    }
  }

  return next;
}
