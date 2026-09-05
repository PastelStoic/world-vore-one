import type {
  VehicleDefinition,
  VehicleModuleDefinition,
} from "@/data/equipment_types.ts";
import { VEHICLE_MODULES_BY_ID } from "@/data/vehicle_modules.ts";

export interface GroupedVehicleModule {
  moduleId: string;
  moduleIds: string[];
  count: number;
}

/** Collapse modules that share a display name into first-seen order with a copy count. */
export function groupVehicleModules(
  moduleIds: string[],
): GroupedVehicleModule[] {
  const grouped: GroupedVehicleModule[] = [];
  const indexByName = new Map<string, number>();
  for (const moduleId of moduleIds) {
    const name = resolveVehicleModule(moduleId).name;
    const existingIndex = indexByName.get(name);
    if (existingIndex !== undefined) {
      const group = grouped[existingIndex];
      group.count += 1;
      if (!group.moduleIds.includes(moduleId)) {
        group.moduleIds.push(moduleId);
      }
      continue;
    }
    indexByName.set(name, grouped.length);
    grouped.push({ moduleId, moduleIds: [moduleId], count: 1 });
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

export function formatVehicleModuleDetails(
  moduleId: string,
): string;
export function formatVehicleModuleDetails(
  moduleIds: readonly string[],
): string;
export function formatVehicleModuleDetails(
  moduleIdOrIds: string | readonly string[],
): string {
  const moduleIds = uniquePreserveOrder(
    typeof moduleIdOrIds === "string" ? [moduleIdOrIds] : moduleIdOrIds,
  );
  if (moduleIds.length === 0) {
    return "";
  }

  const formatted = moduleIds.map((moduleId) =>
    formatSingleVehicleModuleDetails(moduleId)
  );
  const uniqueFormatted = uniquePreserveOrder(formatted);
  if (uniqueFormatted.length === 1) {
    return uniqueFormatted[0];
  }

  const statsBlocks = moduleIds.map((moduleId) =>
    formatVehicleModuleStats(moduleId)
  );
  const uniqueStats = uniquePreserveOrder(statsBlocks);
  const uniqueDescriptions = uniquePreserveOrder(
    moduleIds
      .map((moduleId) => resolveVehicleModule(moduleId).description)
      .filter((description): description is string => Boolean(description)),
  );

  if (uniqueStats.length === 1) {
    const lines = [uniqueStats[0]];
    if (uniqueDescriptions.length > 0) {
      lines.push("");
      lines.push(uniqueDescriptions.join("\n\n"));
    }
    return lines.join("\n");
  }

  return uniqueFormatted.join("\n\n");
}

function formatSingleVehicleModuleDetails(moduleId: string): string {
  const resolved = resolveVehicleModule(moduleId);
  const lines = [formatVehicleModuleStats(moduleId)];
  if (resolved.description) {
    lines.push("");
    lines.push(resolved.description);
  }
  return lines.join("\n");
}

function formatVehicleModuleStats(moduleId: string): string {
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
  return lines.join("\n");
}

function uniquePreserveOrder<T>(items: readonly T[]): T[] {
  const seen = new Set<T>();
  const unique: T[] = [];
  for (const item of items) {
    if (seen.has(item)) {
      continue;
    }
    seen.add(item);
    unique.push(item);
  }
  return unique;
}
