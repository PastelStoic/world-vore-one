import type { VehicleModuleDefinition } from "@/data/equipment_types.ts";
import { VEHICLE_WEAPONS_BY_ID } from "@/data/equipment.ts";

function resolveVehicleModule(module: VehicleModuleDefinition) {
  if (!module.vehicleWeaponId) return module;

  const weapon = VEHICLE_WEAPONS_BY_ID.get(module.vehicleWeaponId);
  if (!weapon) return module;

  return {
    ...module,
    damage: module.damage ?? weapon.damage,
    rateOfFire: module.rateOfFire ?? weapon.rateOfFire,
    ammoCapacity: module.ammoCapacity ?? weapon.ammoCapacity,
    reloadSpeed: module.reloadSpeed ?? weapon.reloadSpeed,
    description: module.description ?? weapon.description,
  };
}

export function formatVehicleModuleLabel(
  module: VehicleModuleDefinition,
): string {
  const suffix = module.count === 1 ? "" : "s";
  const quantity = module.count === 1 ? "" : `${module.count}× `;
  return `${quantity}${module.name}${suffix}`;
}

export function formatVehicleModuleDetails(
  module: VehicleModuleDefinition,
): string {
  const resolved = resolveVehicleModule(module);
  const lines: string[] = [];

  if (resolved.damage !== undefined) {
    lines.push(`Damage: ${resolved.damage}`);
    lines.push(`Rate of fire: ${resolved.rateOfFire}`);
    lines.push(`Ammo capacity: ${resolved.ammoCapacity}`);
    lines.push(
      `Reload speed: ${resolved.reloadSpeed} turn${
        resolved.reloadSpeed === 1 ? "" : "s"
      }`,
    );
  }

  lines.push(`HP: ${resolved.hp}`);
  lines.push(
    `Difficulty: ${resolved.difficulty.front} / ${resolved.difficulty.side} / ${resolved.difficulty.rear}`,
  );
  lines.push(
    `Position: ${resolved.position === "internal" ? "Internal" : "External"}`,
  );
  lines.push(`On destruction: ${resolved.destructionEffect}`);

  if (resolved.description) {
    lines.push("");
    lines.push(resolved.description);
  }

  return lines.join("\n");
}
