// ---------------------------------------------------------------------------
// DATA – Reusable Vehicle-Mounted Weapons (which are modules)
// Vehicle weapons are a type of vehicle module. These reusable definitions
// include both weapon combat stats and module durability/mounting stats.
// Vehicles reference them by ID string in their modules list.
// ---------------------------------------------------------------------------

import type { VehicleWeaponDefinition } from "./equipment_types.ts";

export const VEHICLE_WEAPONS: VehicleWeaponDefinition[] = [
  {
    id: "light-cannon",
    name: "Light cannon",
    description:
      "Rapid-firing cannon suited to light armor, emplacements, and exposed infantry.",
    hp: 20,
    position: "external",
    difficulty: { front: "medium", side: "medium", rear: "light" },
    destructionEffect: "Main armament destroyed.",
    count: 1,
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
    hp: 10,
    position: "external",
    difficulty: { front: "easy", side: "easy", rear: "easy" },
    destructionEffect: "Machine gun destroyed.",
    count: 1,
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
    hp: 12,
    position: "external",
    difficulty: { front: "medium", side: "light", rear: "light" },
    destructionEffect: "Missile launcher destroyed.",
    count: 1,
    damage: "12",
    rateOfFire: 1,
    ammoCapacity: 2,
    reloadSpeed: 4,
  },
];

export const VEHICLE_WEAPONS_BY_ID = new Map(
  VEHICLE_WEAPONS.map((w) => [w.id, w]),
);
