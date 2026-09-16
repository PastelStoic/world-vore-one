// ---------------------------------------------------------------------------
// DATA – Vehicle Modules
// Reusable module definitions referenced by ID from VehicleDefinition.modules.
// Weapon modules include combat stats; other modules omit them.
// ---------------------------------------------------------------------------

import type { VehicleModuleDefinition } from "./equipment_types.ts";

export const VEHICLE_MODULES: VehicleModuleDefinition[] = [
  // WEAPONS

  {
    id: "light-cannon",
    name: "Light cannon",
    hp: 6,
    position: "internal",
    difficulty: 5,
    destructionEffect: "Cannon destroyed.",
    addsTraitIds: ["light-he","light-aphe"],
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 3,
  },
  {
    id: "medium-cannon",
    name: "Medium cannon",
    hp: 6,
    position: "internal",
    difficulty: 5,
    destructionEffect: "Cannon destroyed.",
    addsTraitIds: ["medium-he","medium-aphe"],
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 3,
  },
  {
    id: "light-high-velocity-cannon",
    name: "Light high velocity cannon",
    hp: 6,
    position: "internal",
    difficulty: 5,
    destructionEffect: "Cannon destroyed.",
    addsTraitIds: ["light-aphe","light-ap"],
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 3,
  },
  {
    id: "medium-high-velocity-cannon",
    name: "Medium high velocity cannon",
    hp: 8,
    position: "internal",
    difficulty: 5,
    destructionEffect: "Cannon destroyed.",
    addsTraitIds: ["medium-aphe","medium-ap"],
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 4,
  },
  {
    id: "light-turret",
    name: "Light turret",
    hp: 6,
    position: "internal",
    difficulty: 3,
    destructionEffect: "Turret destroyed, and can no longer turn.",
    addsTraitIds: ["turreted"],
  },
  {
    id: "light-mantlet",
    name: "Light mantlet",
    hp: 6,
    position: "external",
    difficulty: 1,
    destructionEffect: "Mantlet destroyed, no longer offers any protection.",
    addsTraitIds: ["mantlet"],
  },
  {
    id: "medium-mantlet",
    name: "Medium mantlet",
    hp: 8,
    position: "external",
    difficulty: 1,
    destructionEffect: "Mantlet destroyed, no longer offers any protection.",
    addsTraitIds: ["mantlet"],
  },
  {
    id: "flamethrower",
    name: "Flamethrower",
    hp: 4,
    position: "internal",
    difficulty: 5,
    destructionEffect: "Flamethrower destroyed.",
    addsTraitIDs: ["Flamer"],
    damage: "Variable",
    rateOfFire: 5,
    ammo: 100,
    reloadTurns: 3,
  },
  {
    id: "machine-gun",
    name: "Machinegun",
    hp: 4,
    position: "internal",
    difficulty: 5,
    destructionEffect: "Machine gun destroyed.",
    damage: "3",
    rateOfFire: 11,
    ammo: 100,
    reloadTurns: 3,
  },

  // internal modules and components

  {
    id: "engine",
    name: "Engine",
    hp: 4,
    position: "internal",
    difficulty: 5,
    destructionEffect: "The vehicle can no longer move.",
  },

  {
    id: "fuel-tanks",
    name: "Fuel tanks",
    hp: 2,
    position: "internal",
    difficulty: 5,
    destructionEffect:
      `The fuel tanks catch fire, which begins to spread throughout the vehicle. Only catches fire if directly destroyed by an attack, or if destroyed by fire - aoe damage from grenades/HE/APHE does not make it explode.
    
    *The crew must hold their breaths in order not to inhale toxic smoke for as long as it burns. A crewmember takes 3 damage for every turn they inhale toxic smoke.
    *The fire deals a continuous 3 damage to the vehicle until it is put out and it will spread to another non-burning module, at random, on the next turn.
    *Crew is unharmed from the fire; you manage to keep your distance from it. To put it out, one must roll a 6 on a 1d6. Any crewmember can attempt to put the fire(s) out.
    *The vehicle will run out of fuel only at combat end or after 20 turns pass, whichever is faster, leaving it immobile.
    *A fire may only be started once per combat - it cannot be set alight again.`,
  },
  {
    id: "light-ammo-stowage",
    name: "Light ammo stowage",
    hp: 2,
    position: "internal",
    difficulty: 8,
    destructionEffect:
      "The vehicle immediately explodes, destroying it and killing off everyone within it. Only explodes if it is directly destroyed by an attack, or if destroyed by fire - aoe damage from grenades/HE/APHE does not make it explode.",
  },
  {
    id: "tracks",
    name: "Tracks",
    hp: 8,
    position: "external",
    difficulty: 3,
    destructionEffect:
      "The vehicle can no longer move. Can be repaired at combat's end without the need for a check.",
    addsTraitIds: ["tracked"],
  },
  {
    id: "medium-tracks",
    name: "Medium racks",
    hp: 12,
    position: "external",
    difficulty: 3,
    destructionEffect:
      "The vehicle can no longer move. Can be repaired at combat's end without the need for a check.",
    addsTraitIds: ["tracked"],
  },
  {
    id: "wheels-2",
    name: "Wheels ( 2 wheels )",
    hp: 4,
    position: "external",
    difficulty: 3,
    destructionEffect:
      "The vehicle can no longer move. Can be repaired at combat's end without the need for a check.",
    addsTraitIds: ["wheeled"],
  },
  {
    id: "wheels-4",
    name: "Wheels ( 4 wheels )",
    hp: 6,
    position: "external",
    difficulty: 3,
    destructionEffect:
      "The vehicle can no longer move. Can be repaired at combat's end without the need for a check.",
    addsTraitIds: ["wheeled"],
  },
  {
    id: "artillery-train",
    name: "Artillery train",
    hp: 8,
    position: "external",
    difficulty: 0,
    destructionEffect: "The horses are dead.",
    addsTraitIds: ["horse-team"],
  },
  {
    id: "horse-artillery-train",
    name: "Horse-artillery train",
    hp: 24,
    position: "external",
    difficulty: 0,
    destructionEffect: "The horses are dead.",
    addsTraitIds: ["horse-team"],
  },

  // CIVILIAN SHIZ

  {
    id: "civilian-engine",
    name: "Civilian engine",
    hp: 2,
    position: "internal",
    difficulty: 2,
    destructionEffect: "The vehicle can no longer move.",
  },
  {
    id: "civilian-fuel-tank",
    name: "Civilian fuel tanks",
    hp: 1,
    position: "internal",
    difficulty: 2,
    destructionEffect: `The fuel tanks catch fire!

    *The fire deals a continuous 3 damage to the vehicle until it is put out.
    *Crew is unharmed from the fire; you manage to keep your distance from it. 
    *To put it out, one must roll a 6 on a 1d6. Any crewmember can attempt to put the fire(s) out.
    *The vehicle will run out of fuel only at combat end or after 10 turns pass, whichever is faster, leaving it immobile.
    *A fire may only be started once per combat - it cannot be set alight again.`,
  },
  {
    id: "civilian-wheels-2",
    name: "Civilian wheels ( 2 wheels )",
    hp: 2,
    position: "external",
    difficulty: 2,
    destructionEffect: "The vehicle can no longer move.",
    addsTraitIds: ["wheeled"],
  },
  {
    id: "civilian-wheels-4",
    name: "Civilian wheels ( 4 wheels )",
    hp: 4,
    position: "external",
    difficulty: 2,
    destructionEffect: "The vehicle can no longer move.",
    addsTraitIds: ["wheeled"],
  },
];

export const VEHICLE_MODULES_BY_ID = new Map(
  VEHICLE_MODULES.map((module) => [module.id, module]),
);
