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
      "Small, light cannon. Quick to fire and reload, but with equally low damage.\nDeals its full damage on the distance it is fired at, decreasing by 3 for every subsequent distance.",
    hp: 6,
    position: "internal",
    difficulty: { front: 3, side: 3, rear: 5 },
    destructionEffect: "Cannon destroyed.",
    damage: "6",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 3,
  },
  {
    id: "frontal-machine-gun",
    name: "Machine gun",
    description:
      "Vehicle-mounted machinegun to fend off infantry, aiming forward.",
    hp: 4,
    position: "internal",
    difficulty: { front: 3, side: 5, rear: 5 },
    destructionEffect: "Machine gun destroyed.",
    damage: "3",
    rateOfFire: 11,
    ammo: 100,
    reloadTurns: 3,
  },
  {
    id: "side-machine-gun",
    name: "Machine gun",
    description:
      "Vehicle-mounted machinegun to fend off infantry, aiming to the side(s).",
    hp: 4,
    position: "internal",
    difficulty: { front: 5, side: 3, rear: 5 },
    destructionEffect: "Machine gun destroyed.",
    damage: "3",
    rateOfFire: 11,
    ammo: 100,
    reloadTurns: 3,
  },
  {
    id: "rear-machine-gun",
    name: "Machine gun",
    description:
      "Vehicle-mounted machinegun to fend off infantry, aiming backwards.",
    hp: 4,
    position: "internal",
    difficulty: { front: 5, side: 5, rear: 3 },
    destructionEffect: "Machine gun destroyed.",
    damage: "3",
    rateOfFire: 11,
    ammo: 100,
    reloadTurns: 3,
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