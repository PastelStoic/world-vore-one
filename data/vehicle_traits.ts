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
      "Tracks do not take area damage — they must be targeted directly. Destroyed tracks immobilize the vehicle and can be repaired at combat's end without a check.",
  },
  {
    id: "wheeled",
    name: "Wheeled",
    description:
      "Wheels have no armor and take area damage. Destroyed wheels immobilize the vehicle.",
  },
  {
    id: "turreted",
    name: "Turreted",
    description:
      "A turret can turn one facing per turn, assuming its user hasn't spent their action on something else. The turret turns with the vehicle: if it is aiming forward and the tank turns right, the turret aims right too.",
  },
  {
    id: "mantlet",
    name: "Mantlet",
    description:
      "Crew and other sensitive modules behind the mantlet cannot be damaged by small arms fire. Explosions on the same distance as the gun, or ahead of it, damage the mantlet instead of the crew. Explosions behind the mantlet are not blocked. Requiring 3 additional successes, a player may throw a grenade on the same distance as the gun but behind the mantlet, avoiding its protection.",
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
      `The commander picks the targets; the gunner rolls to shoot them. If the commander is dead or gone, the gunner picks targets instead.
Can be linked to other vehicles, such as cars, trucks and artillery trains, then pulled around.
Manning or unmanning the gun is a free action. One cannot fire a weapon, then re-man it in the same turn.
Up to 5 individuals, crew included, can take cover behind the mantlet. It is 6d6 cover if one isn't manning it.
To push the gun, add together the Strength of all crew members pushing it. Only crewmembers may apply their strength. It may not move faster than 1 distance from pushing. Pushing the gun requires an action.`,
  },
];

export const VEHICLE_TRAITS_BY_ID = new Map(
  VEHICLE_TRAITS.map((trait) => [trait.id, trait]),
);
