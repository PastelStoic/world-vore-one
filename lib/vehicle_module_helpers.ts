import type { VehicleModuleTypeDefinition } from "@/data/equipment_types.ts";

export function formatVehicleModuleLabel(
  module: VehicleModuleTypeDefinition,
  count: number,
): string {
  const suffix = count === 1 ? "" : "s";
  const quantity = count === 1 ? "" : `${count}× `;
  return `${quantity}${module.name}${suffix}`;
}

export function formatVehicleModuleDetails(
  module: VehicleModuleTypeDefinition,
): string {
  const lines: string[] = [];

  if (module.weaponStats) {
    lines.push(`Damage: ${module.weaponStats.damage}`);
    lines.push(`Rate of fire: ${module.weaponStats.rateOfFire}`);
    lines.push(`Ammo capacity: ${module.weaponStats.ammoCapacity}`);
    lines.push(
      `Reload speed: ${module.weaponStats.reloadSpeed} turn${
        module.weaponStats.reloadSpeed === 1 ? "" : "s"
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