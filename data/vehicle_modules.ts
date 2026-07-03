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
      `Small, light cannon. Quick to fire and reload, but with equally low damage.
      Deals area damage, dealing its full damage on the distance it is fired at, decreasing by 3 for every subsequent distance.`,
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
    name: "Frontal machinegun",
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
    name: "Lateral machinegun",
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
    name: "Rear machinegun",
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
    description: "The vehicle's engine, required for the vehicle to move and operate its weaponry.",
    hp: 4,
    position: "internal",
    difficulty: { front: 5, side: 5, rear: 5 },
    destructionEffect: "The vehicle can no longer move.",
  },
  {
    id: "fuel-tanks",
    name: "Fuel tanks",
    description: "Fuel tanks, required for a vehicle to operate - no fuel tanks means no fuel, dummy!",
    hp: 2,
    position: "internal",
    difficulty: { front: 5, side: 5, rear: 5 },
    destructionEffect: `The fuel tanks catch fire, which begins to spread throughout the vehicle.
    The crew must hold their breaths in order not to inhale toxic smoke for as long as it burns. A crewmember takes 3 damage for every turn they inhale toxic smoke.
    The fire deals a continuous 3 damage to the vehicle until it is put out.
    The fire will spread to another module on the next turn - that fire, too, will keep spreading!
    Crew is unharmed from the fire; you manage to keep your distance from it.
    The vehicle will run out of fuel only at combat end or after 20 turns pass, whichever is faster, leaving it immobile.`,
  },
];

export const VEHICLE_MODULES_BY_ID = new Map(
  VEHICLE_MODULES.map((module) => [module.id, module]),
);
