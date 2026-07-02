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
    return {
      name: module,
      description: "Unknown module",
      hp: 1,
      position: "external",
      difficulty: { front: 1, side: 1, rear: 1 },
      destructionEffect: "Module destroyed.",
    };
  }

  return module;
}

export function formatVehicleModuleLabel(
  module: string | VehicleModuleDefinition,
): string {
  const resolved = resolveVehicleModule(module);
  return resolved.name;
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
