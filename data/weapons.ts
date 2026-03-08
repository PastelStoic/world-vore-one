import type { WeaponDefinition } from "./equipment_types.ts";

// ---------------------------------------------------------------------------
// DATA – Weapons
// ---------------------------------------------------------------------------

// Helper to build compatible attachment lists
const LONG_GUN_ATTACHMENTS = ["bayonet", "scope", "bipod", "strong-sling"];
const REVOLVER_ATTACHMENTS = ["quickloader"];

export const WEAPONS: WeaponDefinition[] = [
  // ── Civilian / Generic ──
  {
    id: "colt-walker",
    name: "Colt Walker",
    type: "Black Powder Revolver",
    kind: "black-powder-revolver",
    nation: "Civilian",
    damage: "3",
    ammo: 6,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Black Powder:
*Makes a huge cloud of smelly gunpowder smoke after firing, giving away your position immediately.
Extremely slow reload:
*Takes 4 turns to load a single bullet. Each bullet must be reloaded individually. Cannot use a speedloader.
*Weapon can fire after reloading is started provided there are still bullets inside it.
Overloaded chamber:
*Optionally overload the chamber(s) with additional gunpowder. Declare how many are at scene start.
*Deals 4 damage, but if there are more 1's than 6's when shooting, it explodes in your hands.
*If it explodes, deals 4 damage to you and the gun is ruined.`,
    compatibleAttachmentIds: [],
    reloadsIndividually: true,
    reloadTurns: 4,
  },
  {
    id: "colt-single-action-army",
    name: "Colt Single Action Army (Colt SAA)",
    type: "Single-action revolver",
    kind: "single-action-revolver",
    nation: "civilian",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Loading Gate:
*Reloads each bullet individually, taking 1 turn per bullet. Cannot have a quickloader.`,
    compatibleAttachmentIds: [],
    reloadsIndividually: true,
  },
  {
    id: "flamethrower",
    name: "Flamethrower",
    type: "Flamethrower",
    kind: "flamethrower",
    nation: "Any",
    damage: "3",
    ammo: 10,
    rateOfFire: 1,
    weight: 3,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
Canister:
*Choose how many additional canisters of fuel to bring. Each canister has 1 weight. Declare at scene start.
Flamethrower:
*Maximum range of 3 distances; cannot target anyone beyond. Ignores cover.
--->If a target is hit:
*Target is set on fire, takes 3 damage immediately and 3 damage every turn thereafter. A target on fire can only do one of two things: Create distance between themselves and you. OR Try to put the fire out. To put it out, they must roll a 1d6, with a success on a 5 or a 6. Allies may try to put the fire out as well.
Volatile:
--->If you are shot from the back OR a grenade explodes:
*Roll a 1d6. On a 2, your canister is set ablaze, you are set on fire. On a 1, your canister explodes, setting you and everyone 1 distance away on fire. You cannot put the fire out until the canister is removed from your back in either circumstance.
Bulky kit:
*If you have a bulky kit, you cannot carry another piece of equipment with this gimmick.`,
    compatibleAttachmentIds: [],
  },
  {
    id: "double-barrel-shotgun",
    name: "Double barrel shotgun",
    type: "Shotgun",
    kind: "shotgun",
    nation: "Civilian",
    damage: "4 / 2",
    ammo: 2,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Double barrel Shotgun:
*Deals 4 damage to enemies 3 distances or closer. Deals 2 damage to enemies 4 distances or beyond.
*Loads each shell individually, 1 shell per turn.
Trench-sweeper:
*Cover is one tier lower if the target is at 3 distances or closer.
Double-fire:
*Double-firing does not require a stance swap.
*+1 rate of fire, -3d6 to accuracy, gain no accuracy bonuses from the fastened fire.`,
    compatibleAttachmentIds: ["dbs-single-barrel", "dbs-sawn-off"],
    reloadsIndividually: true,
  },
  {
    id: "flintlock-musket",
    name: "Flintlock Musket",
    type: "Flintlock Smoothbore Musket",
    kind: "flintlock-musket",
    nation: "Civilian",
    damage: "4",
    ammo: 1,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Extra long:
*If attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet.
Musket:
*Takes 20 turns to reload. Accuracy penalty from ranged shooting is doubled.`,
    compatibleAttachmentIds: ["musket-rifled", ...LONG_GUN_ATTACHMENTS],
    reloadsIndividually: true,
    reloadTurns: 20,
  },
  {
    id: "bow",
    name: "Bow",
    type: "Bow & Arrow",
    kind: "bow",
    nation: "Civilian",
    damage: "2",
    ammo: 1,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Recoverable ammo:
*At combat end, all arrows can be recovered.
Draw and let loose:
*To fire this weapon, it must be prepared: A turn has to be spent pulling the string, and it may only be fired in the next.
*You can keep the string drawn for [CONSTITUTION] turns before you lose your strength and let go.
*You can move while the string is drawn.
Utterly silent:
*Only those 1 distance away from you can hear your bow's string. It is completely silent otherwise.`,
    compatibleAttachmentIds: [],
    reloadsIndividually: true,
  },
  {
    id: "crossbow",
    name: "Crossbow",
    type: "Crossbow",
    kind: "crossbow",
    nation: "Civilian",
    damage: "2",
    ammo: 1,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Recoverable ammo:
*At combat end, all bolts can be recovered.
Utterly silent:
*Only those 1 distance away from you can hear your crossbow's string. It is completely silent otherwise.`,
    compatibleAttachmentIds: [],
    reloadsIndividually: true,
  },

  // ── British ──
  {
    id: "lee-enfield",
    name: "Lee-Enfield No.1 Mk III",
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "Britain",
    damage: "3",
    ammo: 10,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Mad-minute technique:
*Takes one turn to swap into this technique.
*+1 rate of fire, -3d6 to accuracy, gain no accuracy bonuses from the fastened fire.`,
    compatibleAttachmentIds: [
      ...LONG_GUN_ATTACHMENTS,
      "lee-enfield-grenade-launcher",
    ],
  },
  {
    id: "webley-revolver",
    name: "Webley Revolver",
    type: "Double-action revolver",
    kind: "double-action-revolver",
    nation: "Britain",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Cylinder:
*Reloads each bullet individually, taking 1 turn per bullet.`,
    compatibleAttachmentIds: [...REVOLVER_ATTACHMENTS],
    reloadsIndividually: true,
  },
  {
    id: "lewis-gun",
    name: "Lewis Automatic Machine Gun",
    type: "Heavy Machinegun",
    kind: "heavy-machinegun",
    nation: "Britain",
    damage: "3",
    ammo: 97,
    rateOfFire: 10,
    weight: 4,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
*Soldiers with the 'British-trench-raiders' or 'Harlem Hellfighters' factional perks only pay 1.
Heavy-machinegun:
*Comes with a bipod, but gains no benefit from it.
*Automatic fire whilst not set up awards a -3d6 for every shot fired.
*Takes 3 turns to set up the bipod. Allies can help in setting the gun up.
Multi-target:
*Can hit multiple targets at once. Can choose how many bullets to spend per target.
*One bullet is wasted with every additional target you fire at. Your dexterity is added to each target individually.
Heavy magazines:
*Choose how many additional magazines to bring. Each magazine has 1 weight. Declare at scene start.
*Reloading takes 3 turns. If reload is started, cannot fire until reloading is finished. Allies can help in reloading.`,
    compatibleAttachmentIds: ["lewis-gun-shield"],
    freeAccessoryIds: ["lewis-drum-magazine"],
    discountFactionPerkIds: ["british-trench-raider", "harlem-hellfighter"],
    requiresMagazines: true,
    reloadTurns: 3,
  },

  // ── French ──
  {
    id: "lebel-m1886",
    name: "Lebel M1886",
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "France",
    damage: "3",
    ammo: 8,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Tubular magazine:
*Reloads each bullet individually, taking 1 turn per bullet.
Extra long:
--->When fitted with a bayonet:
*If attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
    reloadsIndividually: true,
  },
  {
    id: "modele-1892-revolver",
    name: "Modèle 1892 revolver",
    type: "Double-action revolver",
    kind: "double-action-revolver",
    nation: "France",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Cylinder:
*Reloads each bullet individually, taking 1 turn per bullet.`,
    compatibleAttachmentIds: [...REVOLVER_ATTACHMENTS],
    reloadsIndividually: true,
  },
  {
    id: "berthier-m1916",
    name: "Berthier M1916",
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "France",
    damage: "3",
    ammo: 5,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Half-Agile:
*Can be fired even at distance 0 with -3d6 to accuracy. Can be unholstered and holstered at no action cost.
Short rifle:
--->When fitted with a bayonet:
*Double debuff from having a bayonet on and loses half-agile.`,
    compatibleAttachmentIds: [
      ...LONG_GUN_ATTACHMENTS,
      "berthier-chauchat-magazines",
    ],
  },
  {
    id: "ruby-pistol",
    name: "'Ruby' pistol",
    type: "Semiautomatic pistol",
    kind: "semiautomatic-pistol",
    nation: "France",
    damage: "2",
    ammo: 9,
    rateOfFire: 2,
    weight: 1,
    pointCost: 1,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.`,
    compatibleAttachmentIds: [],
  },
  {
    id: "rsc-m1917",
    name: "RSC M1917",
    type: "Semiautomatic rifle",
    kind: "semiautomatic-rifle",
    nation: "France",
    damage: "3",
    ammo: 5,
    rateOfFire: 2,
    weight: 2,
    pointCost: 1,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Walking fire:
*Takes one turn to swap into this technique.
*-3d6 to shooting. May move and fire as part of the same action.
Jams frequently:
*Reloading takes 2 turns. If reload is started, cannot fire until reloading is finished.`,
    compatibleAttachmentIds: [
      ...LONG_GUN_ATTACHMENTS,
      "rsc-chauchat-magazines",
    ],
    reloadTurns: 2,
  },
  {
    id: "chauchat",
    name: "Chauchat",
    type: "Light-machinegun",
    kind: "light-machinegun",
    nation: "France",
    damage: "3",
    ammo: 20,
    rateOfFire: 4,
    weight: 3,
    pointCost: 1,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Light-machinegun:
*Comes with a bipod but gains no benefit from it.
*Automatic fire whilst not set up awards a -1d6 for every shot fired.`,
    compatibleAttachmentIds: [],
  },

  // ── German ──
  {
    id: "gewehr-98",
    name: "Gewehr 98",
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "Germany",
    damage: "3",
    ammo: 5,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Reliable:
*No debuff from having a bayonet attached. Does not break easily, maintenance isn't difficult, mud is no problem.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS, "gewehr98-smk"],
  },
  {
    id: "c96-mauser",
    name: 'C96 "Mauser"',
    type: "Semiautomatic pistol",
    kind: "semiautomatic-pistol",
    nation: "Germany",
    damage: "2",
    ammo: 10,
    rateOfFire: 2,
    weight: 1,
    pointCost: 1,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Wasteful reload:
*Takes 2 turns to reload if there's still any bullets inside, and said bullets are lost.
*If reload is started, weapon cannot fire until reloading is finished.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.`,
    compatibleAttachmentIds: ["c96-extended-stock"],
  },
  {
    id: "luger-p08",
    name: "Luger P08",
    type: "Semiautomatic pistol",
    kind: "semiautomatic-pistol",
    nation: "Germany",
    damage: "2",
    ammo: 8,
    rateOfFire: 2,
    weight: 1,
    pointCost: 1,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.`,
    compatibleAttachmentIds: [],
  },
  {
    id: "m1879-reichsrevolver",
    name: "M1879 Reichsrevolver",
    type: "Single action revolver",
    kind: "single-action-revolver",
    nation: "Germany",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Loading Gate:
*Reloads each bullet individually, taking 1 turn per bullet. Cannot have a quickloader.`,
    compatibleAttachmentIds: [],
    reloadsIndividually: true,
  },
  {
    id: "mp-18",
    name: "Maschinenpistole 18 (MP-18)",
    type: "SMG",
    kind: "smg",
    nation: "Germany",
    damage: "3",
    ammo: 30,
    rateOfFire: 4,
    weight: 2,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
*Soldiers with the 'stormtrooper' factional perk only need to pay 1.`,
    compatibleAttachmentIds: [],
    discountFactionPerkIds: ["sturmtruppen"],
  },

  // ── American ──
  {
    id: "m1903-springfield",
    name: "M1903 Springfield",
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "United States",
    damage: "3",
    ammo: 5,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Reliable:
*No debuff from having a bayonet attached. Does not break easily, maintenance isn't difficult, mud is no problem.`,
    compatibleAttachmentIds: [
      ...LONG_GUN_ATTACHMENTS,
      "springfield-pedersen",
      "springfield-suppressor",
    ],
  },
  {
    id: "thompson",
    name: "Thompson",
    type: "SMG",
    kind: "smg",
    nation: "United States",
    damage: "3",
    ammo: 30,
    rateOfFire: 4,
    weight: 2,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
*Soldiers with the 'British-trench-raiders' or 'Harlem Hellfighters' factional perks only need to pay 1.`,
    compatibleAttachmentIds: ["thompson-drum-magazines"],
    discountFactionPerkIds: ["british-trench-raider", "harlem-hellfighter"],
  },
  {
    id: "winchester-1897",
    name: 'Winchester Model 1897 "Trench Gun"',
    type: "Pump action shotgun",
    kind: "pump-action-shotgun",
    nation: "United States",
    damage: "4 / 2",
    ammo: 6,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Shotgun:
*Deals 4 damage to enemies 3 distances or closer. Deals 2 damage to enemies 4 distances or beyond.
Tubular magazine:
*Reloads each shell individually, taking 1 turn per shell.
Trench-sweeper:
*Cover is one tier lower if the target is at 3 distances or closer.
Slam fire:
*Takes one turn to swap into this technique.
*+1 rate of fire, -3d6 to accuracy, gain no accuracy bonuses from the fastened fire.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
    reloadsIndividually: true,
  },
  {
    id: "m1911",
    name: "M1911",
    type: "Semiautomatic pistol",
    kind: "semiautomatic-pistol",
    nation: "United States",
    damage: "2",
    ammo: 7,
    rateOfFire: 2,
    weight: 1,
    pointCost: 1,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.`,
    compatibleAttachmentIds: [],
  },
  {
    id: "bar",
    name: "Browning Automatic Rifle (B.A.R)",
    type: "Light machinegun",
    kind: "light-machinegun",
    nation: "United States",
    damage: "3",
    ammo: 20,
    rateOfFire: 4,
    weight: 3,
    pointCost: 1,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Light-machinegun:
*Comes with a bipod but gains no benefit from it.
*Automatic fire whilst not set up awards a -1d6 for every shot fired.
Select fire:
*Takes one action to choose between full auto or slower full auto.
*The former has the weapon work normally.
*The latter disregards the downside of light-machinegun, but gains a -2 to its rate of fire.`,
    compatibleAttachmentIds: [],
  },
  {
    id: "browning-auto-5",
    name: "Browning auto-5",
    type: "Semiautomatic shotgun",
    kind: "semiautomatic-shotgun",
    nation: "United States",
    damage: "4 / 2",
    ammo: 7,
    rateOfFire: 2,
    weight: 2,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
*Soldiers with the 'British-trench-raiders' or 'Harlem Hellfighters' factional perks only need to pay 1.
Shotgun:
*Deals 4 damage to enemies 3 distances or closer. Deals 2 damage to enemies 4 distances or beyond.
Tubular magazine:
*Reloads each shell individually, taking 1 turn per shell.
Trench-sweeper:
*Cover is one tier lower if the target is at 3 distances or closer.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
    discountFactionPerkIds: ["british-trench-raider", "harlem-hellfighter"],
    reloadsIndividually: true,
  },

  // ── Japanese ──
  {
    id: "type-98-arisaka",
    name: "Type 98 Arisaka",
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "Japan",
    damage: "3",
    ammo: 5,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
6mm Arisaka:
*The accuracy debuff (-3d6) applies at every 15 distances, instead of 10 distances.
*Deal 2 damage at distance 16 or beyond.
Extra long:
--->When fitted with a bayonet:
*If attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
  },
  {
    id: "type-26-revolver",
    name: "Type 26 Revolver",
    type: "Double-action revolver",
    kind: "double-action-revolver",
    nation: "Japan",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Cylinder:
*Reloads each bullet individually, taking 1 turn per bullet.`,
    compatibleAttachmentIds: [...REVOLVER_ATTACHMENTS],
    reloadsIndividually: true,
  },

  // ── Russian ──
  {
    id: "mosin-nagant",
    name: "Mosin-Nagant M1891 Rifle",
    type: "Bolt-Action Rifle",
    kind: "bolt-action-rifle",
    nation: "Russia",
    damage: "3",
    ammo: 5,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Extra long:
--->When fitted with a bayonet:
*If attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
  },
  {
    id: "nagant-m1895-revolver",
    name: "Nagant M1895 Revolver",
    type: "Double-Action Revolver",
    kind: "double-action-revolver",
    nation: "Russia",
    damage: "2",
    ammo: 7,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Loading Gate:
*Reloads each bullet individually, taking 1 turn per bullet. Cannot have a quickloader.`,
    compatibleAttachmentIds: ["nagant-suppressor"],
    reloadsIndividually: true,
  },
  {
    id: "fedorov-avtomat",
    name: "Fedorov Avtomat",
    type: "Assault Rifle",
    kind: "assault-rifle",
    nation: "Russia",
    damage: "3",
    ammo: 25,
    rateOfFire: 4,
    weight: 2,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
6mm Arisaka:
*The accuracy debuff (-3d6) applies at every 15 distances, instead of 10 distances.
*Deal 2 damage at distance 16 or beyond.`,
    compatibleAttachmentIds: [],
  },

  // ── Austro-Hungarian ──
  {
    id: "mannlicher-m1895",
    name: "Mannlicher M1895",
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "Austria-Hungary",
    damage: "3",
    ammo: 5,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Half-Agile:
*Can be fired even at distance 0 with -3d6 to accuracy. Can be unholstered and holstered at no action cost.
Short rifle:
--->When fitted with a bayonet:
*Double debuff from having a bayonet on and loses half-agile.
En-block clip:
--->When the rifle is empty:
*Reloading can be done at no action cost. Shooting on the same turn awards -3d6 to accuracy.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
  },
  {
    id: "steyr-m1912",
    name: "Steyr M1912",
    type: "Semiautomatic pistol",
    kind: "semiautomatic-pistol",
    nation: "Austria-Hungary",
    damage: "2",
    ammo: 8,
    rateOfFire: 2,
    weight: 1,
    pointCost: 1,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.`,
    compatibleAttachmentIds: [
      "steyr-automatic-fire",
      "steyr-extended-magazine",
      "steyr-extended-stock",
    ],
  },

  // ── Italian ──
  {
    id: "carcano-m91",
    name: 'Fucile M91 "Carcano"',
    type: "Bolt-action rifle",
    kind: "bolt-action-rifle",
    nation: "Italy",
    damage: "3",
    ammo: 6,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
En-block clip:
--->When the rifle is empty:
*Reloading can be done at no action cost. Shooting on the same turn awards -3d6 to accuracy.
6.5mm Carcano:
*The accuracy debuff (-3d6) applies at every 15 distances, instead of 10 distances.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
  },
  {
    id: "Beretta-Modelo-1918",
    name: 'Beretta Modelo 1918',
    type: "Semiautomatic rifle",
    kind: "semiautomatic-rifle",
    nation: "Italy",
    damage: "3",
    ammo: 25,
    rateOfFire: 2,
    weight: 2,
    pointCost: 1,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Overhead magazine:
*The first shot against a target has a -2d6 to its accuracy. This penalty is ignored on consecutive turns if you continue attacking the same target. 
*If you spend a turn not attacking that target, the penalty resets and applies again the next time you attack it. Accuracy cannot be brought below 1d6 due to this.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
  },
  {
    id: "Carabinetta-Automatica-O.V.P",
    name: 'Carabinetta Automatica "O.V.P"',
    type: "SMG",
    kind: "smg",
    nation: "Italy",
    damage: "3",
    ammo: 25,
    rateOfFire: 4,
    weight: 2,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
Overhead magazine:
*The first shot against a target has a -2d6 to its accuracy. This penalty is ignored on consecutive turns if you continue attacking the same target. 
*If you spend a turn not attacking that target, the penalty resets and applies again the next time you attack it. Accuracy cannot be brought below 1d6 due to this.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
  },
  {
    id: "bodeo-1889",
    name: "Bodeo Model 1889 revolver",
    type: "Double-action revolver",
    kind: "double-action-revolver",
    nation: "Italy",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Loading Gate:
*Reloads each bullet individually, taking 1 turn per bullet. Cannot have a quickloader.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.`,
    compatibleAttachmentIds: [],
    reloadsIndividually: true,
  },

  // ── Swiss ──
  {
    id: "schmidt-rubin-1911",
    name: "Schmidt–Rubin Model 1911",
    type: "Bolt action rifle",
    kind: "bolt-action-rifle",
    nation: "Switzerland",
    damage: "3",
    ammo: 6,
    rateOfFire: 1,
    weight: 2,
    pointCost: 0,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Magazine-fed:
*Each magazine has 1 weight; choose how many magazines to bring at the start of a scene.
*Reloading is a free action if you use a magazine.
*Reloads normally if you have no magazines left.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
    freeAccessoryIds: ["schmidt-rubin-magazine"],
  },
  {
    id: "ordonnanzrevolver-1882",
    name: "Ordonnanzrevolver 1882",
    type: "Double-action revolver",
    kind: "double-action-revolver",
    nation: "Switzerland",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `One-handed:
*Weapon can be held in one hand, with another tool in your free hand.
Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Cylinder:
*Reloads each bullet individually, taking 1 turn per bullet.`,
    compatibleAttachmentIds: [...REVOLVER_ATTACHMENTS],
    reloadsIndividually: true,
  },
  {
    id: "mg11",
    name: "MG11",
    type: "Heavy Machinegun",
    kind: "heavy-machinegun",
    nation: "Switzerland",
    damage: "3",
    ammo: 250,
    rateOfFire: 10,
    weight: 4,
    pointCost: 3,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Restricted:
*Prized and rare weapon. Must pay 3 points to have it.
Heavy-machinegun:
*Comes with a bipod, but gains no benefit from it.
*Automatic fire whilst not set up awards a -3d6 for every shot fired.
*Takes 3 turns to set up the bipod. Allies can help in setting the gun up.
Multi-target:
*Can hit multiple targets at once. Can choose how many bullets to spend per target.
*One bullet is wasted with every additional target you fire at. Your dexterity is added to each target individually.
Extra heavy magazines:
*Choose how many additional magazines to bring. Each magazine has 3 weight. Declare at scene start.
*Reloading takes 3 turns. If reload is started, cannot fire until reloading is finished. Allies can help in reloading.`,
    compatibleAttachmentIds: [],
    freeAccessoryIds: ["mg11-magazine"],
    requiresMagazines: true,
    reloadTurns: 3,
  },
  {
    id: "stamm-sauer-1916",
    name: "Stamm Sauer 1916",
    type: "Light-machinegun",
    kind: "light-machinegun",
    nation: "Switzerland",
    damage: "3",
    ammo: 20,
    rateOfFire: 4,
    weight: 3,
    pointCost: 1,
    gimmicks: `Two-handed:
*Weapon requires both hands in order to be used properly.
Light-machinegun:
*Comes with a bipod but gains no benefit from it.
*Automatic fire whilst not set up awards a -1d6 for every shot fired.`,
    compatibleAttachmentIds: [],
  },
];

export const WEAPONS_BY_ID = new Map(
  WEAPONS.map((w) => [w.id, w]),
);
