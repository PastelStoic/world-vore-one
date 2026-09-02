import type {
  VehicleDefinition,
  VehicleModuleDefinition,
} from "@/data/equipment_types.ts";
import { VEHICLE_MODULES_BY_ID } from "@/data/vehicle_modules.ts";

export interface GroupedVehicleModule {
  moduleId: string;
  count: number;
}

/** Collapse identical module IDs into first-seen order with a copy count. */
export function groupVehicleModules(
  moduleIds: string[],
): GroupedVehicleModule[] {
  const grouped: GroupedVehicleModule[] = [];
  const indexById = new Map<string, number>();
  for (const moduleId of moduleIds) {
    const existingIndex = indexById.get(moduleId);
    if (existingIndex !== undefined) {
      grouped[existingIndex].count += 1;
      continue;
    }
    indexById.set(moduleId, grouped.length);
    grouped.push({ moduleId, count: 1 });
  }
  return grouped;
}

export function getVehicleHp(vehicle: VehicleDefinition): number {
  const moduleHp = vehicle.modules.reduce(
    (sum, moduleId) => sum + resolveVehicleModule(moduleId).hp,
    0,
  );
  return moduleHp + (vehicle.hpModifier ?? 0);
}

export function resolveVehicleModule(
  moduleId: string,
): VehicleModuleDefinition {
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

export function formatVehicleModuleLabel(
  moduleId: string,
  count = 1,
): string {
  return `${count}x ${resolveVehicleModule(moduleId).name}`;
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
