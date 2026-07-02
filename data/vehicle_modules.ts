// ---------------------------------------------------------------------------
// DATA – Vehicle Modules
// Reusable module definitions referenced by ID from VehicleDefinition.modules.
// Weapon modules include combat stats; other modules omit them.
// ---------------------------------------------------------------------------

import type { VehicleModuleDefinition } from "./equipment_types.ts";

export const VEHICLE_MODULES: VehicleModuleDefinition[] = [
  {
    id: "light-cannon",
    name: "Light cannon",
    description:
      "Rapid-firing cannon suited to light armor, emplacements, and exposed infantry.",
    hp: 20,
    position: "external",
    difficulty: { front: 2, side: 2, rear: 1 },
    destructionEffect: "Main armament destroyed.",
    damage: "5",
    rateOfFire: 3,
    ammo: 150,
    reloadTurns: 3,
  },
  {
    id: "vehicle-machine-gun",
    name: "Machine gun",
    description:
      "Vehicle-mounted automatic weapon for suppressing infantry and light targets.",
    hp: 10,
    position: "external",
    difficulty: { front: 1, side: 1, rear: 1 },
    destructionEffect: "Machine gun destroyed.",
    damage: "3",
    rateOfFire: 4,
    ammo: 200,
    reloadTurns: 2,
  },
  {
    id: "anti-armor-missile-launcher",
    name: "Anti-armor missile launcher",
    description:
      "Guided missile launcher meant for threatening armored vehicles at range.",
    hp: 12,
    position: "external",
    difficulty: { front: 2, side: 1, rear: 1 },
    destructionEffect: "Missile launcher destroyed.",
    damage: "12",
    rateOfFire: 1,
    ammo: 2,
    reloadTurns: 4,
  },
  {
    id: "engine",
    name: "Engine",
    description: "It be an engine",
    hp: 4,
    position: "internal",
    difficulty: { front: 1, side: 1, rear: 1 },
    destructionEffect: "Engine destroyed.",
  },
  {
    id: "fuel-tanks",
    name: "Fuel tanks",
    description: "They be fuel tanks",
    hp: 2,
    position: "internal",
    difficulty: { front: 1, side: 1, rear: 1 },
    destructionEffect: "Fuel tanks destroyed.",
  },
];

export const VEHICLE_MODULES_BY_ID = new Map(
  VEHICLE_MODULES.map((module) => [module.id, module]),
);