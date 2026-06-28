// ---------------------------------------------------------------------------
// DATA – Reusable Vehicle-Mounted Weapons
// These can be referenced by id from VehicleDefinition.modules via vehicleWeaponId
// so the same weapon can be mounted on multiple vehicles without duplicating stats.
// ---------------------------------------------------------------------------

import type { VehicleWeaponDefinition } from "./equipment_types.ts";

export const VEHICLE_WEAPONS: VehicleWeaponDefinition[] = [
  {
    id: "light-cannon",
    name: "Light cannon",
    description:
      "Rapid-firing cannon suited to light armor, emplacements, and exposed infantry.",
    damage: "5",
    rateOfFire: 3,
    ammoCapacity: 150,
    reloadSpeed: 3,
  },
  {
    id: "vehicle-machine-gun",
    name: "Machine gun",
    description:
      "Vehicle-mounted automatic weapon for suppressing infantry and light targets.",
    damage: "3",
    rateOfFire: 4,
    ammoCapacity: 200,
    reloadSpeed: 2,
  },
  {
    id: "anti-armor-missile-launcher",
    name: "Anti-armor missile launcher",
    description:
      "Guided missile launcher meant for threatening armored vehicles at range.",
    damage: "12",
    rateOfFire: 1,
    ammoCapacity: 2,
    reloadSpeed: 4,
  },
];

export const VEHICLE_WEAPONS_BY_ID = new Map(
  VEHICLE_WEAPONS.map((w) => [w.id, w]),
);
