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
      "Small, light cannon. Quick to fire and reload, but with equally low damage.\nDeals its full damage on the distance it is fired at, decreasing by 3 for every subsequent distance.",
    hp: 6,
    position: "internal",
    difficulty: { front: 3, side: 3, rear: 5 },
    destructionEffect: "Cannon destroyed.",
    count: 1,
    damage: "6",
    rateOfFire: 1,
    ammoCapacity: 1,
    reloadSpeed: 3,
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
    count: 1,
    damage: "3",
    rateOfFire: 11,
    ammoCapacity: 100,
    reloadSpeed: 3,
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
    count: 1,
    damage: "3",
    rateOfFire: 11,
    ammoCapacity: 100,
    reloadSpeed: 3,
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
    count: 1,
    damage: "3",
    rateOfFire: 11,
    ammoCapacity: 100,
    reloadSpeed: 3,
  },
];

export const VEHICLE_WEAPONS_BY_ID = new Map(
  VEHICLE_WEAPONS.map((w) => [w.id, w]),
);
