import type {
  VehicleDefinition,
  VehicleModuleDefinition,
} from "@/data/equipment_types.ts";
import { VEHICLE_MODULES_BY_ID } from "@/data/equipment.ts";

export function getVehicleHp(vehicle: VehicleDefinition): number {
  const moduleHp = vehicle.modules.reduce(
    (sum, moduleId) => sum + resolveVehicleModule(moduleId).hp,
    0,
  );
  return moduleHp + (vehicle.hpModifier ?? 0);
}

export function resolveVehicleModule(moduleId: string): VehicleModuleDefinition {
  const module = VEHICLE_MODULES_BY_ID.get(moduleId);
  if (module) {
    return module;
  }
  return {
    id: moduleId,
    name: moduleId,
    description: "Unknown module",
    hp: 1,
    position: "external",
    difficulty: { front: 1, side: 1, rear: 1 },
    destructionEffect: "Module destroyed.",
  };
}

export function formatVehicleModuleLabel(moduleId: string): string {
  return resolveVehicleModule(moduleId).name;
}

export function formatVehicleModuleDetails(moduleId: string): string {
  const resolved = resolveVehicleModule(moduleId);
  const lines: string[] = [];

  if (resolved.damage !== undefined) {
    lines.push(`Damage: ${resolved.damage}`);
    lines.push(`Rate of fire: ${resolved.rateOfFire}`);
    lines.push(`Ammo: ${resolved.ammo}`);
    if (resolved.reloadTurns && resolved.reloadTurns > 1) {
      lines.push(
        `Reload turns: ${resolved.reloadTurns}`,
      );
    }
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