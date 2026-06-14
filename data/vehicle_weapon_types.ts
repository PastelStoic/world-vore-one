import type { VehicleWeaponTypeDefinition } from "./equipment_types.ts";

// ---------------------------------------------------------------------------
// DATA - Vehicle weapon types
// ---------------------------------------------------------------------------

export const VEHICLE_WEAPON_TYPES: VehicleWeaponTypeDefinition[] = [
  {
    id: "machine-gun",
    name: "Machine gun",
    description:
      "Vehicle-mounted automatic weapon for suppressing infantry and light targets.",
  },
  {
    id: "light-cannon",
    name: "Light cannon",
    description:
      "Rapid-firing cannon suited to light armor, emplacements, and exposed infantry.",
  },
  {
    id: "anti-armor-missile-launcher",
    name: "Anti-armor missile launcher",
    description:
      "Guided missile launcher meant for threatening armored vehicles at range.",
  },
];

export const VEHICLE_WEAPON_TYPES_BY_ID = new Map(
  VEHICLE_WEAPON_TYPES.map((type) => [type.id, type]),
);
