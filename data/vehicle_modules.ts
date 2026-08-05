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
    description:
      `Small, light cannon. Quick to fire and reload, but with equally low damage.

      When reloading, choose which round to load:
      *High-explosive: Light armor piercing, deals area damage, dealing 6 damage on the distance it is fired at, and 3 on the adjacent distances.
      *Armor-piercing-high-explosive: Medium armor piercing, deals area damage, dealing 3 damage on the distance it is fired at, and 1 on the adjacent distances.
      *Armor-piercing: Heavy armor piercing, deals 12 damage at what it is fired at. It's a solid shot - no area damage!`,
    hp: 6,
    position: "internal",
    difficulty: { front: 3, side: 3, rear: 5 },
    destructionEffect: "Cannon destroyed.",
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 3,
  },
  {
    id: "rear-light-cannon",
    name: "Rear light cannon",
    description:
      `Small, light cannon. Quick to fire and reload, but with equally low damage.

      When reloading, choose which round to load:
      *High-explosive: Light armor piercing, deals area damage, dealing 6 damage on the distance it is fired at, and 3 on the adjacent distances. Damages at most 5 targets in order of initiative
      *Armor-piercing-high-explosive: Medium armor piercing, deals area damage, dealing 3 damage on the distance it is fired at, and 1 on the adjacent distances. Damages at most 3 targets in order of initiative. Deals 2 damage to targetted module.
      *Armor-piercing: Heavy armor piercing, deals 12 damage at what it is fired at. It's a solid shot - no area damage!`,
    hp: 6,
    position: "internal",
    difficulty: { front: 5, side: 3, rear: 3 },
    destructionEffect: "Cannon destroyed.",
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 3,
  },
  {
    id: "light-high-velocity-cannon",
    name: "Light high velocity cannon",
    description:
      `Light gun with exceptionally fast rounds, meant to take out armor. Not very effective against non-vehicles.

      When reloading, choose which round to load:
      *Armor-piercing-high-explosive: Heavy armor piercing, deals area damage, dealing 3 damage on the distance it is fired at. Damages at most 2 targets in order of initiative. Deals 5 damage to targetted module.
      *Armor-piercing: Heavy armor piercing, deals 16 damage at what it is fired at. It's a solid shot - no area damage!`,
    hp: 6,
    position: "internal",
    difficulty: { front: 3, side: 3, rear: 5 },
    destructionEffect: "Cannon destroyed.",
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 3,
  },
  {
    id: "medium-high-velocity-cannon",
    name: "Medium high velocity cannon",
    description:
      `Middle brother of the anti-tank emplacements. Devastates most light vehicles.

      When reloading, choose which round to load:
      *Armor-piercing-high-explosive: Heavy armor piercing, deals area damage, dealing 5 damage on the distance it is fired at. Damages at most 5 targets in order of initiative. Deals 8 damage to targetted module.
      *Armor-piercing: Heavy armor piercing, deals 24 damage at what it is fired at. It's a solid shot - no area damage!`,
    hp: 8,
    position: "internal",
    difficulty: { front: 3, side: 3, rear: 5 },
    destructionEffect: "Cannon destroyed.",
    damage: "Variable",
    rateOfFire: 1,
    ammo: 1,
    reloadTurns: 4,
  },
  {
    id: "light-turret",
    name: "Light turret",
    description:
      `A light turret mounting, for small cannons!

      *It can turn one direction per turn, assuming its user hasn' spent its action with something else.
      *The turret turns alongside the tank: If the turret is aiming forward, and the tank turns to the right, naturally, the turret will aim right too!`,
    hp: 6,
    position: "internal",
    difficulty: { front: 3, side: 3, rear: 3 },
    destructionEffect: "Turret destroyed, and can no longer turn.",
  },
  {
    id: "light-mantlet",
    name: "Light mantlet",
    description:
      `A light artillery mantlet, protecting against incoming fire.

      *Crew and other sensitive modules behind it cannot be damaged by small arms fire.
      *Explosions happening on the same distance as the gun, or ahead of it, do not damage the crew - the mantlet protects them and takes damage instead.
      *The manlet does not protect from explosions happening behind it.
      *Requiring 3 additional successes, a player may throw a grenade on the same distance as the gun, but behind the mantlet, avoiding its protection.`,
    hp: 6,
    position: "external",
    difficulty: { front: 0, side: 0, rear: 1 },
    destructionEffect: "Mantlet destroyed, no longer offers any protection.",
  },
  {
    id: "medium-mantlet",
    name: "Medium mantlet",
    description:
      `A thicker, stronger mantlet! Much sturdier!

      *Crew and other sensitive modules behind it cannot be damaged by small arms fire.
      *Explosions happening on the same distance as the gun, or ahead of it, do not damage the crew - the mantlet protects them and takes damage instead.
      *The manlet does not protect from explosions happening behind it.
      *Requiring 3 additional successes, a player may throw a grenade on the same distance as the gun, but behind the mantlet, avoiding its protection.`,
    hp: 8,
    position: "external",
    difficulty: { front: 0, side: 0, rear: 1 },
    destructionEffect: "Mantlet destroyed, no longer offers any protection.",
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

  // internal modules and components

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
    
    *The crew must hold their breaths in order not to inhale toxic smoke for as long as it burns. A crewmember takes 3 damage for every turn they inhale toxic smoke.
    *The fire deals a continuous 3 damage to the vehicle until it is put out and it will spread to another non-burning module, at random, on the next turn.
    *Crew is unharmed from the fire; you manage to keep your distance from it. To put it out, one must roll a 6 on a 1d6. Any crewmember can attempt to put the fire(s) out.
    *The vehicle will run out of fuel only at combat end or after 20 turns pass, whichever is faster, leaving it immobile.
    *A fire may only be started once per combat - it cannot be set alight again.`,
  },
  {
    id: "light-ammo-stowage",
    name: "Light ammo stowage",
    description: `The vehicle's ammo stowage, where all of its ammunition is held. Careful that it does not blow up!`,
    hp: 2,
    position: "internal",
    difficulty: { front: 8, side: 8, rear: 8 },
    destructionEffect: "The vehicle immediately explodes, destroying it and killing off everyone within it. Only explodes if it is directly destroyed by an attack, or if destroyed by fire - aoe damage from grenades/HE/APHE does not make it explode.",
  },
  {
    id: "tracks",
    name: "Tracks",
    description: `The vehicle's tracks, which allow it to move smoothly along the terrain ahead!
    
    *Considered to have light armor when targetted. Does not take area damage - it must be targetted directly.`,
    hp: 8,
    position: "external",
    difficulty: { front: 3, side: 3, rear: 3 },
    destructionEffect: "The vehicle can no longer move. Can be repaired at combat's end without the need for a check.",
  },
  {
    id: "wheels-2",
    name: "Wheels ( 2 wheels )",
    description: "A pair of thick rubber wheels, can take a surprising amount of punishment!",
    hp: 4,
    position: "external",
    difficulty: { front: 3, side: 3, rear: 3 },
    destructionEffect: "The vehicle can no longer move. Can be repaired at combat's end without the need for a check.",
  },
  {
    id: "Wheel-4",
    name: "Wheels ( 4 wheels )",
    description: "A set of four thick rubber wheels, can take a surprising amount of punishment!",
    hp: 6,
    position: "external",
    difficulty: { front: 3, side: 3, rear: 3 },
    destructionEffect: "The vehicle can no longer move. Can be repaired at combat's end without the need for a check.",
  },
  {
    id: "artillery-train",
    name: "Artillery train",
    description: `An artillery train, pulled by a pair of horses.
    
    *Each horse has 4 HP. 1 horse dies for every 4 HP lost.
    *Light artillery requires 1 horse for each distance moved.
    *Medium artillery requires 2 horses for each distance moved.
    *Heavy artillery requires 3 horses for each distance moved.
    *These horses are especially dumb, and do not accept being mounted.`,
    hp: 8,
    position: "external",
    difficulty: { front: 0, side: 0, rear: 0 },
    destructionEffect: "The horses are dead.",
  },
  {
    id: "horse-artillery-train",
    name: "Horse-artillery train",
    description: `A horse artillery train, meant to be speedy, pulled by six horses.
    
    *Each horse has 4 HP. 1 horse dies for every 4 HP lost.
    *Light artillery requires 1 horse for each distance moved.
    *Medium artillery requires 2 horses for each distance moved.
    *Heavy artillery requires 3 horses for each distance moved.
    *These horses are especially dumb, and do not accept being mounted.`,
    hp: 24,
    position: "external",
    difficulty: { front: 0, side: 0, rear: 0 },
    destructionEffect: "The horses are dead.",
  },

// CIVILIAN SHIZ

  {
    id: "civilian-engine",
    name: "Civilian engine",
    description: "A lighter, simpler Civilian engine, for most vehicles of the everyday life.",
    hp: 2,
    position: "internal",
    difficulty: { front: 2, side: 2, rear: 2 },
    destructionEffect: "The vehicle can no longer move.",
  },
  {
    id: "civilian-fuel-tank",
    name: "Civilian fuel tanks",
    description: "A fuel tank for a civilian vehicle. Small, doesn't hold a whole lot. Doesn't burn as badly as a military vehicle's tanks.",
    hp: 1,
    position: "internal",
    difficulty: { front: 2, side: 2, rear: 2 },
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
    description: "Light civilian wheels, can't take much punishment at all.",
    hp: 2,
    position: "external",
    difficulty: { front: 2, side: 2, rear: 2 },
    destructionEffect: "The vehicle can no longer move.",
  },
  {
    id: "civilian-wheels-4",
    name: "Civilian wheels ( 4 wheels )",
    description: "Light civilian wheels, can't take much punishment at all.",
    hp: 4,
    position: "external",
    difficulty: { front: 2, side: 2, rear: 2 },
    destructionEffect: "The vehicle can no longer move.",
  },
];

export const VEHICLE_MODULES_BY_ID = new Map(
  VEHICLE_MODULES.map((module) => [module.id, module]),
);
