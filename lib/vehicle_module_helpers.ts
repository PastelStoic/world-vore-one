import type { VehicleModuleDefinition } from "@/data/equipment_types.ts";

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
  const lines: string[] = [];

  if (module.damage !== undefined) {
    lines.push(`Damage: ${module.damage}`);
    lines.push(`Rate of fire: ${module.rateOfFire}`);
    lines.push(`Ammo capacity: ${module.ammoCapacity}`);
    lines.push(
      `Reload speed: ${module.reloadSpeed} turn${
        module.reloadSpeed === 1 ? "" : "s"
      }`,
    );
  }

  lines.push(`HP: ${module.hp}`);
  lines.push(
    `Position: ${module.position === "internal" ? "Internal" : "External"}`,
  );
  lines.push(`On destruction: ${module.destructionEffect}`);

  if (module.description) {
    lines.push("");
    lines.push(module.description);
  }

  return lines.join("\n");
}