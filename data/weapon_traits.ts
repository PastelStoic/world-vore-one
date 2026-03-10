// ---------------------------------------------------------------------------
// DATA – Gun / Ranged Weapon Traits
// ---------------------------------------------------------------------------

import type { WeaponTraitDefinition } from "./equipment_types.ts";

export const WEAPON_TRAITS: WeaponTraitDefinition[] = [
  {
    id: "one-handed",
    name: "One-handed",
    description:
      "Weapon can be held in one hand, with another tool in your free hand.",
  },
  {
    id: "two-handed",
    name: "Two-handed",
    description: "Weapon requires both hands in order to be used properly.",
  },
  {
    id: "agile",
    name: "Agile",
    description:
      "Can be fired even at distance 0. Can be unholstered and holstered at no action cost.",
  },
  {
    id: "half-agile",
    name: "Half-Agile",
    description:
      "Can be fired even at distance 0 with -3d6 to accuracy. Can be unholstered and holstered at no action cost.",
  },
  {
    id: "reliable",
    name: "Reliable",
    description:
      "No debuff from having a bayonet attached. Does not break easily, maintenance isn't difficult, mud is no problem.",
  },
  {
    id: "restricted",
    name: "Restricted",
    description: "Prized and rare weapon. Must pay 3 points to have it.",
  },
  {
    id: "cylinder",
    name: "Cylinder",
    description: "Reloads each bullet individually, taking 1 turn per bullet.",
  },
  {
    id: "loading-gate",
    name: "Loading Gate",
    description:
      "Reloads each bullet individually, taking 1 turn per bullet. Cannot have a quickloader.",
  },
  {
    id: "shotgun",
    name: "Shotgun",
    description:
      "Deals 4 damage to enemies 3 distances or closer. Deals 2 damage to enemies 4 distances or beyond.",
  },
  {
    id: "double-barrel-shotgun",
    name: "Double barrel Shotgun",
    description:
      "Deals 4 damage to enemies 3 distances or closer. Deals 2 damage to enemies 4 distances or beyond.\nLoads each shell individually, 1 shell per turn.",
  },
  {
    id: "trench-sweeper",
    name: "Trench-sweeper",
    description:
      "Cover is one tier lower if the target is at 3 distances or closer.",
  },
  {
    id: "double-fire",
    name: "Double-fire",
    description:
      "Double-firing does not require a stance swap.\n+1 rate of fire, -3d6 to accuracy, gain no accuracy bonuses from the fastened fire.",
  },
  {
    id: "slam-fire",
    name: "Slam fire",
    description:
      "Takes one turn to swap into this technique.\n+1 rate of fire, -3d6 to accuracy, gain no accuracy bonuses from the fastened fire.",
  },
  {
    id: "mad-minute",
    name: "Mad-minute technique",
    description:
      "Takes one turn to swap into this technique.\n+1 rate of fire, -3d6 to accuracy, gain no accuracy bonuses from the fastened fire.",
  },
  {
    id: "tubular-magazine-bullets",
    name: "Tubular magazine",
    description: "Reloads each bullet individually, taking 1 turn per bullet.",
  },
  {
    id: "tubular-magazine-shells",
    name: "Tubular magazine",
    description: "Reloads each shell individually, taking 1 turn per shell.",
  },
  {
    id: "en-block-clip",
    name: "En-block clip",
    description:
      "When the rifle is empty:\nReloading can be done at no action cost. Shooting on the same turn awards -3d6 to accuracy.",
  },
  {
    id: "extra-long",
    name: "Extra long",
    description:
      "If attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet.",
  },
  {
    id: "extra-long-bayonet",
    name: "Extra long",
    description:
      "When fitted with a bayonet:\nIf attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet.",
  },
  {
    id: "short-rifle",
    name: "Short rifle",
    description:
      "When fitted with a bayonet:\nDouble debuff from having a bayonet on and loses half-agile.",
  },
  {
    id: "6mm-arisaka",
    name: "6mm Arisaka",
    description:
      "The accuracy debuff (-3d6) applies at every 15 distances, instead of 10 distances.\nDeal 2 damage at distance 16 or beyond.",
  },
  {
    id: "6-5mm-carcano",
    name: "6.5mm Carcano",
    description:
      "The accuracy debuff (-3d6) applies at every 15 distances, instead of 10 distances.",
  },
  {
    id: "light-machinegun",
    name: "Light-machinegun",
    description:
      "Comes with a bipod but gains no benefit from it.\nAutomatic fire whilst not set up awards a -1d6 for every shot fired.",
  },
  {
    id: "heavy-machinegun",
    name: "Heavy-machinegun",
    description:
      "Comes with a bipod, but gains no benefit from it.\nAutomatic fire whilst not set up awards a -3d6 for every shot fired.\nTakes 3 turns to set up the bipod. Allies can help in setting the gun up.",
  },
  {
    id: "multi-target",
    name: "Multi-target",
    description:
      "Can hit multiple targets at once. Can choose how many bullets to spend per target.\nOne bullet is wasted with every additional target you fire at. Your dexterity is added to each target individually.",
  },
  {
    id: "heavy-magazines",
    name: "Heavy magazines",
    description:
      "Choose how many additional magazines to bring. Each magazine has 1 weight. Declare at scene start.\nReloading takes 3 turns. If reload is started, cannot fire until reloading is finished. Allies can help in reloading.",
  },
  {
    id: "extra-heavy-magazines",
    name: "Extra heavy magazines",
    description:
      "Choose how many additional magazines to bring. Each magazine has 3 weight. Declare at scene start.\nReloading takes 3 turns. If reload is started, cannot fire until reloading is finished. Allies can help in reloading.",
  },
  {
    id: "select-fire",
    name: "Select fire",
    description:
      "Takes one action to choose between full auto or slower full auto.\nThe former has the weapon work normally.\nThe latter disregards the downside of light-machinegun, but gains a -2 to its rate of fire.",
  },
  {
    id: "walking-fire",
    name: "Walking fire",
    description:
      "Takes one turn to swap into this technique.\n-3d6 to shooting. May move and fire as part of the same action.",
  },
  {
    id: "jams-frequently",
    name: "Jams frequently",
    description:
      "Reloading takes 2 turns. If reload is started, cannot fire until reloading is finished.",
  },
  {
    id: "overhead-magazine",
    name: "Overhead magazine",
    description:
      "The first shot against a target has a -2d6 to its accuracy. This penalty is ignored on consecutive turns if you continue attacking the same target.\nIf you spend a turn not attacking that target, the penalty resets and applies again the next time you attack it. Accuracy cannot be brought below 1d6 due to this.",
  },
  {
    id: "wasteful-reload",
    name: "Wasteful reload",
    description:
      "Takes 2 turns to reload if there's still any bullets inside, and said bullets are lost.\nIf reload is started, weapon cannot fire until reloading is finished.",
  },
  {
    id: "magazine-fed",
    name: "Magazine-fed",
    description:
      "Each magazine has 1 weight; choose how many magazines to bring at the start of a scene.\nReloading is a free action if you use a magazine.\nReloads normally if you have no magazines left.",
  },
  {
    id: "black-powder",
    name: "Black Powder",
    description:
      "Makes a huge cloud of smelly gunpowder smoke after firing, giving away your position immediately.",
  },
  {
    id: "extremely-slow-reload",
    name: "Extremely slow reload",
    description:
      "Takes 4 turns to load a single bullet. Each bullet must be reloaded individually. Cannot use a speedloader.\nWeapon can fire after reloading is started provided there are still bullets inside it.",
  },
  {
    id: "overloaded-chamber",
    name: "Overloaded chamber",
    description:
      "Optionally overload the chamber(s) with additional gunpowder. Declare how many are at scene start.\nDeals 4 damage, but if there are more 1's than 6's when shooting, it explodes in your hands.\nIf it explodes, deals 4 damage to you and the gun is ruined.",
  },
  {
    id: "musket",
    name: "Musket",
    description:
      "Takes 20 turns to reload. Accuracy penalty from ranged shooting is doubled.",
  },
  {
    id: "recoverable-ammo-arrows",
    name: "Recoverable ammo",
    description: "At combat end, all arrows can be recovered.",
  },
  {
    id: "recoverable-ammo-bolts",
    name: "Recoverable ammo",
    description: "At combat end, all bolts can be recovered.",
  },
  {
    id: "draw-and-let-loose",
    name: "Draw and let loose",
    description:
      "To fire this weapon, it must be prepared: A turn has to be spent pulling the string, and it may only be fired in the next.\nYou can keep the string drawn for [CONSTITUTION] turns before you lose your strength and let go.\nYou can move while the string is drawn.",
  },
  {
    id: "utterly-silent-bow",
    name: "Utterly silent",
    description:
      "Only those 1 distance away from you can hear your bow's string. It is completely silent otherwise.",
  },
  {
    id: "utterly-silent-crossbow",
    name: "Utterly silent",
    description:
      "Only those 1 distance away from you can hear your crossbow's string. It is completely silent otherwise.",
  },
  {
    id: "flamethrower",
    name: "Flamethrower",
    description:
      "Maximum range of 3 distances; cannot target anyone beyond. Ignores cover.\nIf a target is hit:\nTarget is set on fire, takes 3 damage immediately and 3 damage every turn thereafter. A target on fire can only do one of two things: Create distance between themselves and you. OR Try to put the fire out. To put it out, they must roll a 1d6, with a success on a 5 or a 6. Allies may try to put the fire out as well.",
  },
  {
    id: "volatile",
    name: "Volatile",
    description:
      "If you are shot from the back OR a grenade explodes:\nRoll a 1d6. On a 2, your canister is set ablaze, you are set on fire. On a 1, your canister explodes, setting you and everyone 1 distance away on fire. You cannot put the fire out until the canister is removed from your back in either circumstance.",
  },
  {
    id: "canister",
    name: "Canister",
    description:
      "Choose how many additional canisters of fuel to bring. Each canister has 1 weight. Declare at scene start.",
  },
  {
    id: "bulky-kit",
    name: "Bulky kit",
    description:
      "If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.",
  },

  // ── Traits added by attachments ──
  {
    id: "quickloader",
    name: "Quickloader",
    description:
      "Revolvers no longer need to be reloaded bullets one-by-one, they're reloaded in one go.",
  },
  {
    id: "sawn-off",
    name: "Sawn-off",
    description:
      "Can be fired even at distance 0. Can be unholstered and holstered at no action cost.\nDeals 4 damage to enemies 2 distances or closer. Deals 2 damage to enemies 3 distances or beyond.\nDeals no damage to enemies 10 distances or beyond.",
  },
  {
    id: "rifled-musket",
    name: "Rifled musket",
    description: "Reloading takes 30 turns.",
  },
];

export const WEAPON_TRAITS_BY_ID = new Map(
  WEAPON_TRAITS.map((t) => [t.id, t]),
);
