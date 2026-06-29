import type { VehicleModuleDefinition } from "@/data/equipment_types.ts";
import { VEHICLE_WEAPONS_BY_ID } from "@/data/equipment.ts";

function resolveVehicleModule(
  module: string | VehicleModuleDefinition,
): VehicleModuleDefinition {
  if (typeof module === "string") {
    const weapon = VEHICLE_WEAPONS_BY_ID.get(module);
    if (weapon) {
      return weapon;
    }
    return { name: module } as VehicleModuleDefinition;
  }

  const m = module;
  if (!m.vehicleWeaponId) return m;

  const weapon = VEHICLE_WEAPONS_BY_ID.get(m.vehicleWeaponId);
  if (!weapon) return m;

  return {
    ...m,
    name: m.name ?? weapon.name,
    damage: m.damage ?? weapon.damage,
    rateOfFire: m.rateOfFire ?? weapon.rateOfFire,
    ammoCapacity: m.ammoCapacity ?? weapon.ammoCapacity,
    reloadSpeed: m.reloadSpeed ?? weapon.reloadSpeed,
    description: m.description ?? weapon.description,
  };
}

export function formatVehicleModuleLabel(
  module: string | VehicleModuleDefinition,
): string {
  const resolved = resolveVehicleModule(module);
  const count = resolved.count ?? 1;
  const suffix = count === 1 ? "" : "s";
  const quantity = count === 1 ? "" : `${count}× `;
  return `${quantity}${resolved.name ?? "Module"}${suffix}`;
}

export function formatVehicleModuleDetails(
  module: string | VehicleModuleDefinition,
): string {
  const resolved = resolveVehicleModule(module);
  const lines: string[] = [];

  if (resolved.damage !== undefined) {
    lines.push(`Damage: ${resolved.damage}`);
    lines.push(`Rate of fire: ${resolved.rateOfFire}`);
    lines.push(`Ammo capacity: ${resolved.ammoCapacity}`);
    const rs = resolved.reloadSpeed ?? 1;
    lines.push(
      `Reload speed: ${resolved.reloadSpeed ?? "?"} turn${rs === 1 ? "" : "s"}`,
    );
  }

  if (resolved.hp !== undefined) {
    lines.push(`HP: ${resolved.hp}`);
  }
  if (resolved.difficulty) {
    lines.push(
      `Difficulty: ${resolved.difficulty.front} / ${resolved.difficulty.side} / ${resolved.difficulty.rear}`,
    );
  }
  if (resolved.position) {
    lines.push(
      `Position: ${resolved.position === "internal" ? "Internal" : "External"}`,
    );
  }
  if (resolved.destructionEffect) {
    lines.push(`On destruction: ${resolved.destructionEffect}`);
  }

  if (resolved.description) {
    lines.push("");
    lines.push(resolved.description);
  }

  return lines.join("\n");
}
