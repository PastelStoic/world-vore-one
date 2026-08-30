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
*Has Light armor piercing.
*You need both hands free to use this, one to prime it, the other to throw it immediately after. Grenades cannot be cooked.
*Throw up to 5 + STR distances away, exploding on the start of your next turn.
*Roll dexterity, on a success, it lands where you wanted it to. On a fail, roll a 1d[DISTANCE THROWN]-1. The result is where the grenade lands.
*Anyone on the distance it landed on takes 3 damage. Anyone on an adjacent distance takes 1 damage. Ignores cover entirely, weak cover is destroyed.
*May be pushed inside of vehicles at distance 0 with a dex check, dealing damage to all of its components and crew, ignoring the condition below. Failure drops the grenade by your feet, exploding on the next turn.
*Only up to 5 targets may be damaged by this grenade's explosion, in order of initiative, even if they're further away from the grenade compared to others.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra grenade. Each charge has 1 weight.`,
  },
  {
    id: "smoke-grenades",
    name: "Smoke grenades",
    weight: 1,
    isCharge: true,
    description: `Throwable smoke.
*You need both hands free to use this, one to prime it, the other to throw it immediately after. Grenades cannot be cooked.
*Throw up to 5 + STR distances away, exploding on the start of your next turn. The smoke lasts for 10 turns.
*Roll dexterity, on a success, it lands where you wanted it to. On a fail, roll a 1d[DISTANCE THROWN]-1. The result is where the grenade lands.
*Anyone shooting into or past the smoke is firing entirely blind; their accuracy is a fixed 1d6, with successes only on 6's. You cannot see past it.
*May be pushed inside of vehicles at distance 0 with a dex check, blinding every target inside the vehicle.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra smoke grenade. Each charge has 1 weight.`,
  },
  {
    id: "at-grenades",
    name: "Anti-tank grenades",
    weight: 3,
    isCharge: true,
    description: `Throwable explosive meant to take out tanks & other armored vehicles!
*Has heavy armor piercing.
*You need both hands free to use this, one to prime it, the other to throw it immediately after. Grenades cannot be cooked.
*Throw up to 2 + STR distances away, explodes on impact.
*Roll dexterity, on a success, it lands where you wanted it to. On a fail, roll a 1d[DISTANCE THROWN]-1. The result is where the grenade lands.
*If you are not targetting a vehicle, you need 2 additional successess in order to make it land in its intended target. You may target a module/crew with this.
*Deals 9 damage, decreasing by 5 for every next distance until it reaches 0. Ignores cover entirely, medium cover is destroyed.
*May be pushed inside of vehicles at distance 0 with a dex check, dealing damage to all of its components and crew, ignoring the condition below. Failure drops the grenade by your feet, exploding on the next turn.
*Only up to 10 targets may be damaged by this grenade's explosion, in order of initiative, even if they're further away from the grenade compared to others.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra grenade. Each charge has 3 weight.`,
  },
  {
    id: "sticky-at-grenades",
    name: "Sticky anti-tank grenades",
    weight: 1,
    isCharge: true,
    description: `Throwable explosive. Sticks to vehicles before exploding!
*Has medium armor piercing. Sticks to whatever it was thrown at, accompanying it until it explodes!
*You need both hands free to use this, one to prime it, the other to throw it immediately after. Grenades cannot be cooked.
*Throw up to 5 + STR distances away, exploding on the start of your next turn.
*Roll dexterity, on a success, it lands where you wanted it to. On a fail, roll a 1d[DISTANCE THROWN]-1. The result is where the grenade lands.
*If you are not targetting a vehicle, you need 2 additional successess in order to make it land in its intended target. You may target a module/crew with this.
*Deals 5 damage, decreasing by 3 for every next distance until it reaches 0. Ignores cover entirely, weak cover is destroyed.
*May be pushed inside of vehicles at distance 0 with a dex check, dealing damage to all of its components and crew, ignoring the condition below. Failure drops the grenade by your feet, exploding on the next turn.
*Only up to 5 targets may be damaged by this grenade's explosion, in order of initiative, even if they're further away from the grenade compared to others.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra grenade. Each charge has 1 weight.`,
  },
  {
    id: "entrenching-gear",
    name: "Entrenching gear",
    weight: 1,
    isBulky: true,
    ghostVersionId: "entrenching-gear-sapper",
    description:
      `Shovel, hatchet, pickaxe, hammer, nails – the minimum required to dig a trench, fortify a position or to break things down!
*It takes hours to build any field fortifications worth a damned thing. Same for breaking things down, based on how big they are!
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "explosives-kit",
    name: "Explosives kit",
    weight: 1,
    isBulky: true,
    ghostVersionId: "explosives-kit-sapper",
    description:
      `Detonator and a whole lot of dynamite. Will destroy anything short of the thickest walls there are.
*Instantly pulverizes cover, vehicles and players on the distance it was planted in and immediate adjacent distances, killing/destroying them immediately.
*Afterwards, deals 8 damage, decreasing by 4 for every next distance until it reaches 0.
*Cannot be thrown, explosives must be carefully planted and manually blown with a proper detonator.
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "radio-kit",
    name: "Radio kit",
    weight: 2,
    isBulky: true,
    description:
      `A heavy and cumbersome radio kit, shrunken down as much as possible to fit nicely upon your back.
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
    description:
      `A set of survival tools. Hunting knife, water purification and filtration kits, premade fuel, salted meats and hardtack.
*Anything one would need to live in the wild for a considerable amount of time.
*Without this kit, a normal person is entirely hopeless; this at least gives them a fighting chance!
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "cuirass",
    name: "Cuirass",
    weight: 3,
    description:
      `Body armour, mostly cerimonial, but some still used it during WW1 – mostly the French.
*Personal armor, melee attacks deal halved damage to you, rounded down. Unarmed attacks and makeshift melee weapons deal no damage.
*You may only bring one full reload of ammo and reloading a weapon takes +1 turn.
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "full-suit-of-armor",
    name: "Full suit of armor",
    weight: 6,
    description:
      `An entirely outdated suit of armoured plates, ultimate protection against melee.
*Personal armor, melee attacks deal 1 damage to you. Unarmed attacks and makeshift melee weapons deal no damage.
*Beware of the 'Crushing' trait!
*You cannot bring any additional ammo, you have no pockets whatsoever!
*Bulky kit: If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
  },
  {
    id: "ballistic-armor",
    name: "Ballistic armor",
    weight: 6,
    description:
      `A thick set of metal plates meant to deflect bullets! Especially tailored to you.
  *Personal armor, every 10 distances, gunshots deal -1 damage to you. Damage cannot be brought below 1 through this.
  *Does nothing against melee: The bulky and inconvenient nature of this armor leaves your legs, arms and head exposed.
  *It takes 3 turns to put on/remove the armor. Allies can help with it.
  *If you are pinned by an enemy, they and their allies can deal damage to you by exploiting gaps in your armor. They must be at distance 0 to do this.
  *If you are set on fire, you cannot put the fire out until you remove the armor in its entirety.
  *It is tailored for you specifically. Nobody else can wear it.`,
  },
  {
    id: "signal-flares",
    name: "Signal flares & flare gun",
    weight: 1,
    isCharge: true,
    description:
      `A flare gun and several flares. If it's night, shoot it into the sky!
*When fired into the sky at night, or in a dark place, the whole area is lit up.
*Flares last 10 turns before burning out.
*When buying this piece of gear, you're paying for charges of it. Each charge is an extra flare. Each charge has 1 weight.`,
  },
  {
    id: "camouflaged-suit",
    name: "Camouflaged suit",
    weight: 1,
    description:
      `A suit covered in local debris and greenery, making it very hard to spot you!
*When doing stealth checks and ambushes, you gain an additional 3d6, provided it fits the location you're in.`,
  },
  {
    id: "cyanide-pill",
    name: "Cyanide pill",
    weight: 1,
    isConcealable: true,
    description: `A tiny cyanide pill, which guarantees death if ingested.
*You have a tiny cyanide pill on your person, hidden away in some tiny compartment.
*It takes one action to pull the pill out, and another to swallow it.
*Once swallowed, you die within 3 turns. This cannot be stopped in any way.
*Alternatively, feed it to someone else somehow. That's what a sane person would do.
*Don't forget! You are disarmed when swallowed by a predator. No dropping this into their stomach after you're eaten!`,
  },
  {
    id: "warhorse",
    name: "Warhorse",
    weight: 0,
    description: `A warhorse! Meant to be mounted and charged into battle!
  *The warhorse can be mounted. The person mounting it has full control over the animal's movement. Movement becomes free for the rider.
  *The Warhorse can hold 8 weight unencumbered, has 7 HP, and can move up to 3 distances per turn.
  *You you can load 'stowed away' equipment upon your animal and access it, provided the animal is present within the scene.
  *The animal follows typical rules for weight and HP. Each encumbrance levels decreases how many distances it can move by 1.
  *If the animal dies, a new one must be paid for, unless you have a perk for it.
  *Does not attack of its own volition - also remarkably dumb, anyone can mount it and run off, even if they're not its owner!
  *Cannot pull a wagon.`,
  },
  {
    id: "draft-horse",
    name: "Draft horse",
    weight: 0,
    description: `A draft horse, meant to pull a heavy wagon behind itself.
  *The Draft horse can hold 5 weight unencumbered, has 4 HP, and can move up to 2 distances per turn.
  *You you can load 'stowed away' equipment upon your animal and access it, provided the animal is present within the scene.
  *The animal follows typical rules for weight and HP. Each encumbrance levels decreases how many distances it can move by 1.
  *If the animal dies, a new one must be paid for, unless you have a perk for it.
  *Does not attack of its own volition - also remarkably dumb, anyone can pull it away, even if they're not its owner!
  *Cannot be mounted.`,
  },
  {
    id: "donker",
    name: "Donkey",
    weight: 0,
    description: `A donkey, meant to carry a lot of things upon itself!
  *The donkey can hold 12 weight unencumbered, has 4 HP, and can move up to 2 distances per turn.
  *You you can load 'stowed away' equipment upon your animal and access it, provided the animal is present within the scene.
  *The animal follows typical rules for weight and HP. Each encumbrance levels decreases how many distances it can move by 1.
  *If the animal dies, a new one must be paid for, unless you have a perk for it.
  *Does not attack of its own volition - also remarkably dumb, anyone can pull it away, even if they're not its owner!
  *Cannot be mounted.
  *Cannot pull a wagon.`,
  },
  {
    id: "wagon",
    name: "Wagon",
    weight: 0,
    description: `A huge wagon, meant to carry whatever you need it to carry!
  *The wagon can carry 50 weight maximum.
  *So long as your wagon is around, you can access your stowed-away equipment.
  *The animal pulling this wagon can only move 1 distance per turn, regardless of weight.`,
  },
  // ── Ghost items (perk-granted only, hidden from picker and wiki) ────────────
  {
    id: "entrenching-gear-sapper",
    name: "Entrenching gear",
    weight: 0,
    isGhost: true,
    description:
      `Shovel, hatchet, pickaxe, hammer, nails – the minimum required to dig a trench, fortify a position or to break things down!
*It takes hours to build any field fortifications worth a damned thing. Same for breaking things down, based on how big they are!
*Granted by the Sapper perk: no weight, not a bulky kit.`,
  },
  {
    id: "explosives-kit-sapper",
    name: "Explosives kit",
    weight: 0,
    isGhost: true,
    description:
      `Detonator and a whole lot of dynamite. Will destroy anything short of the thickest walls there are.
*The explosives are potent enough that any cover is immediately pulverized, vehicles are destroyed immediately.
*Cannot be thrown, explosives must be carefully planted and blown with a proper detonator.
*Granted by the Sapper perk: no weight, not a bulky kit.`,
  },
  {
    id: "revolver-bandolier",
    name: "Revolver bandolier",
    weight: 0,
    isGhost: true,
    description:
      `A tight, leather bandolier, with many revolvers accessible to you, whenever.
*Infinite revolvers, go wild. But they're your babies - don't give them out, ever!
*"The fastest draw in the west"
*"I am the guy with no name . . ."
*"Kershoot"
*"Pew, wizz, bang"
*"THERE'S A SNAKE IN MY BOOT"
*Granted by the Gunslinger perk.`,
  },
  {
    id: "defenders-shield",
    name: "Defender's shield",
    weight: 2,
    isGhost: true,
    description:
      `The Defender's shield! Will protect you and others from external harm!
  *You may use a one-handed melee weapon OR one-handed firearm whilst holding the shield, but you have -3d6 to attack with them.
  *If you're holding this shield, damage from all sources is lowered to 1. Unarmed and makeshift weapons deal no damage. You must be facing the target, or there is no reduction.
  *Like a 'signiature weapon', it will always return to you somehow, but you can be separated from it for some time.`,
  },
  {
    id: "disguise-kit",
    name: "Disguise kit",
    weight: 1,
    isGhost: true,
    isConcealable: true,
    description: `A disguise kit, perfectly tailored for you!
  *This kit allows you to disguise as other characters, faking being them entirely!
  *No one can tell who you really are without getting a really close look ...
  *Stilts, fake masks, and tons of makeup. Adjust your height, facial composition and even hair!`,
  },
  {
    id: "dreadnoughts-armor",
    name: "Dreadnought's armor",
    weight: 6,
    isGhost: true,
    description: `The Dreadnaught's Armor! Especially tailored to you.
  *This suit is considered to be Light armor, as if you were a vehicle yourself!
  *It takes 3 turns to put on/remove the armor. Allies can help with it.
  *If you are pinned by an enemy, they and their allies can deal damage to you by exploiting gaps in your armor. They must be at distance 0 to do this.
  *If you are set on fire, you cannot put the fire out until you remove the armor in its entirety.
  *It is tailored for you specifically. Nobody else can wear it.`,
  },
  {
    id: "arditi-armor",
    name: "Arditi armor",
    weight: 8,
    isGhost: true,
    description:
      `Especially thick suit of armor. Extremely heavy and inconvenient to use, Italian-made! Avanti savoia! It is especially tailored to you.
  *Personal armor, gunshots deal -1 damage to you. Damage cannot be brought below 1 through this.
  *Every 5 distances, gunshots deal another -1 damage to you. Damage cannot be brought below 1 through this.
  *Does nothing against melee: The bulky and inconvenient nature of this armor leaves your legs, arms and head exposed.
  *It takes 3 turns to put on/remove the armor. Allies can help with it.
  *If you are pinned by an enemy, they and their allies can deal damage to you by exploiting gaps in your armor. They must be at distance 0 to do this.
  *If you are set on fire, you cannot put the fire out until you remove the armor in its entirety.
  *It is tailored for you specifically. Nobody else can wear it.`,
  },
];

export const EQUIPMENT_BY_ID = new Map(
  EQUIPMENT.map((e) => [e.id, e]),
);
