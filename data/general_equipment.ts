// ---------------------------------------------------------------------------
// DATA – General Equipment
// ---------------------------------------------------------------------------

import type { EquipmentDefinition } from "./equipment_types.ts";

export const EQUIPMENT: EquipmentDefinition[] = [
  {
    id: "grenades",
    name: "Grenades",
    weight: 1,
    isCharge: true,
    description: `Throwable explosive.
*Throw up to 5 + STR distances away, exploding on the start of your next turn.
*Roll dexterity, on a success, it lands where you wanted it to. On a fail, roll a 1d[DISTANCE THROWN]-1. The result is where the grenade lands.
*Anyone on the distance it landed on takes 3 damage. Anyone on an adjacent distance takes 1 damage. Ignores cover entirely, weak cover is destroyed.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra grenade. Each charge has 1 weight.`,
  },
  {
    id: "smoke-grenades",
    name: "Smoke grenades",
    weight: 1,
    isCharge: true,
    description: `Throwable smoke.
*Throw up to 5 + STR distances away, exploding on the start of your next turn.
*Roll dexterity, on a success, it lands where you wanted it to. On a fail, roll a 1d[DISTANCE THROWN]-1. The result is where the grenade lands.
*Anyone shooting into or past the smoke is firing entirely blind; their accuracy is a fixed 1d6, with successes only on 6's. You cannot see past it.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra smoke grenade. Each charge has 1 weight.`,
  },
  {
    id: "entrenching-gear",
    name: "Entrenching gear",
    weight: 1,
    isBulky: true,
    description: `Shovel, hatchet, hammer, nails – the minimum required to dig a trench or fortify any position.
*It takes hours to build any field fortifications worth a damned thing.
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "explosives-kit",
    name: "Explosives kit",
    weight: 1,
    isBulky: true,
    description: `Detonator and a whole lot of dynamite. Will destroy anything short of the thickest walls there are.
*The explosives are potent enough that any cover is immediately pulverized, vehicles are destroyed immediately.
*Cannot be thrown, explosives must be carefully planted and blown with a proper detonator.
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "radio-kit",
    name: "Radio kit",
    weight: 2,
    isBulky: true,
    description: `A heavy and cumbersome radio kit, shrunken down as much as possible to fit nicely upon your back.
*Has 2 weight instead of 1.
*Allows for communication with other radios through the usage of morse-code.
*Not at all encrypted, anyone can listen in to your communications if they happen to be listening in at the same frequency.
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "survivalists-kit",
    name: "Survivalist's kit",
    weight: 1,
    isBulky: true,
    description: `A set of survival tools. Hunting knife, water purification and filtration kits, premade fuel, salted meats and hardtack.
*Anything one would need to live in the wild for a considerable amount of time.
*Without this kit, a normal person is entirely hopeless; this at least gives them a fighting chance!
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "cuirass",
    name: "Cuirass",
    weight: 3,
    isBulky: true,
    description: `Body armour, mostly cerimonial, but some still used it during WW1 – mostly the French.
*Has 3 weight instead of 1.
*Melee attackers need an additional 2 successes to attack you. Does nothing against bullets.
*You may only bring one full reload of ammo and reloading a weapon takes +1 turn.
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "signal-flares",
    name: "Signal flares & flare gun",
    weight: 1,
    isCharge: true,
    description: `A flare gun and several flares. If it's night, shoot it into the sky!
*When fired into the sky at night, or in a dark place, the whole area is lit up.
*Flares last 10 turns before burning out.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra flare. Each charge has 1 weight.`,
  },
  {
    id: "camouflaged-suit",
    name: "Camouflaged suit",
    weight: 1,
    description: `A suit covered in local debris and greenery, making it very hard to spot you!
*When doing stealth checks and ambushes, you gain an additional 3d6, provided it fits the location you're in.`,
  },
  {
  id: "cyanide-pill",
  name: "Cyanide pill",
  weight: 1,
  description: `A tiny cyanide pill, which guarantees death if ingested.
*You have a tiny cyanide pill on your person, hidden away in some tiny compartment.
*It takes one action to pull the pill out, and another to swallow it.
*Once swallowed, you die within 3 turns. This cannot be stopped in any way.
*Alternatively, feed it to someone else somehow. That's what a sane person would do.`,
  },
];

export const EQUIPMENT_BY_ID = new Map(
  EQUIPMENT.map((e) => [e.id, e]),
);
