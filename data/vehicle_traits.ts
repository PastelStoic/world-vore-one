// ---------------------------------------------------------------------------
// DATA – Vehicle traits
// Shared characteristics that can be applied to a vehicle directly or granted
// by modules that are part of the vehicle.
// ---------------------------------------------------------------------------

import type { VehicleTraitDefinition } from "./equipment_types.ts";

export const VEHICLE_TRAITS: VehicleTraitDefinition[] = [
  {
    id: "tracked",
    name: "Tracked",
    description:
      "Tracks do not take area damage, they must be targeted directly. Destroyed tracks immobilize the vehicle. Can be repaired at combat end without any checks. Takes 1 hour.",
  },
  {
    id: "wheeled",
    name: "Wheeled",
    description:
      "Wheels have no armor. Destroyed wheels immobilize the vehicle. Can be repaired at combat end without any checks. Takes 15 minutes.",
  },
  {
    id: "turreted",
    name: "Turreted",
    description:
      "A turret can turn one facing per turn.. The turret turns with the vehicle: if it is aiming forward and the tank turns right, the turret aims right too.",
  },
  {
    id: "mantlet",
    name: "Mantlet",
    description:
      "Crew and other sensitive modules behind the mantlet cannot be damaged by small arms fire. Does not protect against explosions.",
  },
  {
    id: "horse-team",
    name: "Horse team",
    description:
      "Each horse has 4 HP. 1 horse dies for every 4 HP lost. Light artillery requires 1 horse for each distance moved; medium artillery requires 2; heavy artillery requires 3. These horses are especially dumb, and do not accept being mounted.",
  },
  {
    id: "focused-driver",
    name: "Focused driver",
    description:
      "The driver cannot shoot out of the vehicle; they need to focus on driving.",
  },
  {
    id: "directional-mounts",
    name: "Directional mounts",
    description:
      "Each mounted weapon can only fire in its listed facing. Difficulty is doubled if trying to attack a weapon on the opposite end of the vehicle.",
  },
  {
    id: "exposed-crew",
    name: "Exposed crew",
    description:
      "Targeting the crew on this vehicle does not deal damage to the vehicle.",
  },
  {
    id: "exposed-rear-crew",
    name: "Exposed rear crew",
    description:
      "Targeting the rear crew on this vehicle does not deal damage to the vehicle.",
  },
  {
    id: "towed-gun",
    name: "Towed gun",
    description:
      `The commander picks the targets; the gunner rolls to shoot them. If the commander is dead or gone, the gunner picks targets instead. Manning or unmanning the gun takes a turn to get into proper position.
Can be linked to other vehicles, such as cars, trucks and artillery trains, then pulled around. Can be pushed so long as the sum of the pusher's strength = the vehicle's size.
Up to [SEATS] individuals - counting the crew - can take cover behind the mantlet. It is 6d6 cover if one isn't manning it.`,
  },

  // THE AMMO TYPES
  
  {
    id: "light-he",
    name: "Light HE",
    description:
      "Light armor piercing, deals AOE 5 / -3 damage, up to 7 targets.",
  },
  {
    id: "medium-he",
    name: "Medium HE",
    description:
      "Light armor piercing, deals AOE 7 / -4 damage, up to 7 targets.",
  },
  {
    id: "heavy-he",
    name: "Heavy HE",
    description:
      "Light armor piercing, deals AOE 9 / -5 damage, up to 7 targets.",
  },
  {
    id: "light-aphe",
    name: "Light APHE",
    description:
      "Medium armor piercing, deals 5 damage to target, plus deals AOE 3 / -2 damage, up to 7 targets. -3d6 to fire at non-vehicles.",
  },
  {
    id: "medium-aphe",
    name: "Medium APHE",
    description:
      "Heavy armor piercing, deals 7 damage to target, plus deals AOE 4 / -3 damage, up to 7 targets. -3d6 to fire at non-vehicles.",
  },
  {
    id: "heavy-aphe",
    name: "Heavy APHE",
    description:
      "Heavy armor piercing, deals 9 damage to target, plus deals AOE 5 / -4 damage, up to 7 targets. -3d6 to fire at non-vehicles.",
  },
  {
    id: "light-ap",
    name: "Light AP",
    description:
      "Heavy armor piercing, deals 16 damage to target. -3d6 to fire at non-vehicles.",
  },
  {
    id: "medium-ap",
    name: "Medium AP",
    description:
      "Heavy armor piercing. Deals 24 damage to target. -6d6 to fire at non-vehicles.",
  },
  {
    id: "heavy-ap",
    name: "Heavy AP",
    description:
      "Heavy armor piercing. Deals 36 damage to target. -9d6 to fire at non-vehicles.",
  },
  {
    id: "flamer",
    name: "Flamer",
    description:
      "Fire deals 3 damage, then 3 damage every turn, until the fire is put out. Fire is put out by getting a 6 on a 1d6. Burning targets may not do anything besides putting the fire out, or running from a source of fire.",
  },
  
];

export const VEHICLE_TRAITS_BY_ID = new Map(
  VEHICLE_TRAITS.map((trait) => [trait.id, trait]),
);
