// ---------------------------------------------------------------------------
// Equipment catalog – weapons, gear, attachments, melee weapon traits
// ---------------------------------------------------------------------------

// ── Nation constants ────────────────────────────────────────────────────────

export const NATIONS = [
  "Any",
  "Civilian",
  "Britain",
  "France",
  "Germany",
  "United States",
  "Japan",
  "Russia",
  "Austria-Hungary",
  "Italy",
  "Switzerland",
] as const;

export type Nation = (typeof NATIONS)[number];

// ── Weapon types ────────────────────────────────────────────────────────────

export type WeaponKind =
  | "bolt-action-rifle"
  | "semiautomatic-rifle"
  | "assault-rifle"
  | "smg"
  | "light-machinegun"
  | "heavy-machinegun"
  | "shotgun"
  | "semiautomatic-shotgun"
  | "pump-action-shotgun"
  | "double-action-revolver"
  | "single-action-revolver"
  | "semiautomatic-pistol"
  | "black-powder-revolver"
  | "flamethrower"
  | "flintlock-musket"
  | "bow"
  | "crossbow"
  | "melee";

export interface WeaponDefinition {
  id: string;
  name: string;
  type: string;
  kind: WeaponKind;
  nation: Nation;
  damage: string;
  ammo: number;
  rateOfFire: number;
  weight: number;
  /** Extra point cost beyond the free 3-item budget (0 = free slot, 1 = costs 1 extra point, 3 = restricted) */
  pointCost: number;
  gimmicks: string;
  /** IDs of attachments compatible with this weapon */
  compatibleAttachmentIds: string[];
  /** IDs of free items that come with this weapon (e.g. Lewis magazines) */
  freeAccessoryIds?: string[];
  /** Faction perk IDs that grant a discount (restricted → 1pt instead of 3pt) */
  discountFactionPerkIds?: string[];
  /** Whether this weapon REQUIRES magazines to reload (cannot reload without one) */
  requiresMagazines?: boolean;
  /** Whether this weapon reloads one round at a time (tubular magazines, cylinders, etc.) */
  reloadsIndividually?: boolean;
  /** How many turns it takes to reload (default: 1). If > 1, reload button must be pressed that many times. */
  reloadTurns?: number;
}

// ── Attachment types ────────────────────────────────────────────────────────

export interface AttachmentDefinition {
  id: string;
  name: string;
  /** Which weapon(s) or weapon class this attaches to (e.g. "Long guns", "Lee-Enfield") */
  appliesTo: string;
  /** Nation this attachment belongs to (for filtering) */
  nation: Nation;
  weight: number;
  description: string;
  /** Whether buying this attachment uses the charge system */
  isCharge?: boolean;
  /** If set, overrides the weapon's base ammo capacity when this attachment is active */
  ammoOverride?: number;
  /** If set, overrides the weapon's base weight when this attachment is active */
  weightOverride?: number;
  /** If true, the weapon REQUIRES magazines to reload while this attachment is active */
  requiresMagazines?: boolean;
  /** If set, overrides the weapon's reloadTurns when this attachment is active */
  reloadTurnsOverride?: number;
  /** If set, overrides the weapon's base damage when this attachment is active */
  damageOverride?: number;
  /** If set, adds this value to the weapon's rate of fire when this attachment is active */
  rateOfFireBonus?: number;
}

// ── General equipment ───────────────────────────────────────────────────────

export interface EquipmentDefinition {
  id: string;
  name: string;
  weight: number;
  description: string;
  /** Equipment that uses charges (grenades, flares, etc.) */
  isCharge?: boolean;
  /** Equipment that is bulky (cannot stack with other bulky kits) */
  isBulky?: boolean;
}

// ── Melee weapon traits ─────────────────────────────────────────────────────

export interface MeleeTraitDefinition {
  id: string;
  name: string;
  description: string;
}

// ── Melee weapon template ───────────────────────────────────────────────────

export interface MeleeWeaponTemplate {
  id: string;
  name: string;
  damage: number;
  weight: number;
  /** Trait IDs applied to this melee weapon */
  traitIds: string[];
  description: string;
}

// ---------------------------------------------------------------------------
// DATA – Melee Weapon Traits
// ---------------------------------------------------------------------------

export const MELEE_TRAITS: MeleeTraitDefinition[] = [
  {
    id: "one-handed",
    name: "One-handed",
    description:
      "Can be held in one hand, with another tool or weapon in your free hand.",
  },
  {
    id: "two-handed",
    name: "Two-handed",
    description:
      "Weapon must be two-handed in order to be used properly.",
  },
  {
    id: "bastard-weapon",
    name: "Bastard weapon",
    description:
      "Can be used with either one hand or two hands.",
  },
  {
    id: "crushing",
    name: "Crushing",
    description:
      "Weapon is meant to bludgeon enemies dead. Ignores damage penalties such as armor, or a lizardgirl's scales.",
  },
  {
    id: "extra-long",
    name: "Extra long",
    description:
      "This melee weapon is much longer than its contemporaries. If attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet. Typical of spears, lances and pikes. -2d6 if used in cramped spaces (indoors, inside ships, tanks, etc.).",
  },
  {
    id: "braceable",
    name: "Braceable",
    description:
      `This melee weapon can be braced against incoming cavalry. If you brace, a mounted enemy or horse moving into distance 0 will take a fixed 3 damage and negates the "cavalry-weapon" trait of a weapon.`,
  },
  {
    id: "flourishing",
    name: "Flourishing",
    description:
      "This weapon can be used to make incredibly wide swings, which make it difficult for enemies to approach. If you flourish, an enemy moving into distance 0 will take an instance of damage. Typical of greatswords, zweihänders and other long bladed weapons. You cannot flourish in cramped spaces (indoors, inside ships, tanks, etc.).",
  },
  {
    id: "rapid-shanking",
    name: "Rapid shanking",
    description:
      "This weapon can be used to quickly shank enemies. If you choose to take a -2d6 when attacking, having an additional success doubles your damage. Weapons like these deal -1 damage than their tier would otherwise allow. Typical of small knifes and daggers.",
  },
  {
    id: "duelling",
    name: "Duelling",
    description:
      "Weapon is meant for duels and one-on-one's. If a single enemy is in melee range, have a +1d6 when fighting them. If there is more than one, have a -1d6 for each enemy. Typical of duelling swords, such as rapiers.",
  },
  {
    id: "multi-headed",
    name: "Multi-headed",
    description:
      "Weapon has multiple heads for different purposes. Has multiple traits depending on the head. It takes 1 turn to swap between each head. Typical of halberds.",
  },
  {
    id: "cavalry-weapon",
    name: "Cavalry-weapon",
    description:
      "Weapon is meant to be used whilst atop a horse. If not atop a horse, gain -3d6 to hit enemies. If atop a horse, you can choose to charge with it! If charging, when moving to distance 0 of an enemy, your melee attack cannot be blocked.",
  },
  {
    id: "concealable",
    name: "Concealable",
    description:
      "The weapon is remarkably tiny, one can hide it away with ease. So long as it is holstered, enemies are not aware of it. Small size hampers damage; deals -1 damage than their tier would otherwise allow. Typical of kunais, butterfly knives and other extra short blades.",
  },
  {
    id: "throwable",
    name: "Throwable",
    description:
      "The weapon is meant, first and foremost, to be thrown. You can throw it 5 + STR distances away, and hitting the target is a Strength check, instead of Dexterity. Deals -1 damage when used as a melee weapon. Each additional throwable has weight.",
  },
  {
    id: "barbed-hooked",
    name: "Barbed/hooked",
    description:
      "The weapon is barbed OR has a nasty hook, making it stick to things. When the target is hit, they're unable to move in their next turn. If used on a throwable weapon, when the target is hit, they gain the weapon's weight until it is removed. Mutually exclusive with razor-bladed.",
  },
  {
    id: "razor-bladed",
    name: "Razor bladed",
    description:
      `Weapon must be tier 2 or higher to get this. The weapon is extremely sharp, like a razor. If you have 3 successes over your opponent, roll a 1d5 to disable (NOT cut off!) a limb. 1-2, left or right arm respectively. 3-4, left or right leg respectively. 5, the head. Losing an arm makes the opponent drop their item; losing both means they can hold nothing. Losing a leg kicks the player down to the bottom of initiative; losing both makes them immobile. Losing a head is instant death. Mutually exclusive with barbed.`,
  },
];

export const MELEE_TRAITS_BY_ID = new Map(
  MELEE_TRAITS.map((t) => [t.id, t]),
);

// ---------------------------------------------------------------------------
// DATA – General Equipment
// ---------------------------------------------------------------------------

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
*Melee attackers have -3d6 to attack you. Does nothing against bullets.
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
];

export const EQUIPMENT_BY_ID = new Map(
  EQUIPMENT.map((e) => [e.id, e]),
);

// ---------------------------------------------------------------------------
// DATA – Weapon Attachments
// ---------------------------------------------------------------------------

export const ATTACHMENTS: AttachmentDefinition[] = [
  // ── Generic (Long guns / Revolvers) ──
  {
    id: "bayonet",
    name: "Bayonet",
    appliesTo: "Long guns",
    nation: "Any",
    weight: 1,
    description: `3 damage when attached to the end of a long gun; 2 damage otherwise.
*-2d6 to shooting if attached. Usable by any rifle and most other long guns.
*It takes 1 turn to put the bayonet on the gun, or to remove it.`,
  },
  {
    id: "scope",
    name: "Scope",
    appliesTo: "Long guns",
    nation: "Any",
    weight: 1,
    description: `*-3d6 to hit targets 9 distances away or closer.
*-1d6 to shoot targets every 10 distances away, instead of -3d6.
*If a weapon modifies the ranging penalty with its gimmicks, use the weapon's ranging rather than the scope's.
*Automatic/semiautomatic fire is impossible – you're firing single shots.
*It takes 1 turn to put the scope on the gun, or to remove it.`,
  },
  {
    id: "bipod",
    name: "Bipod",
    appliesTo: "Long guns",
    nation: "Any",
    weight: 1,
    description: `*-1d6 to accuracy when not set up, +2d6 when set up.
*It takes 1 turn to put the bipod on the gun, or to remove it.`,
  },
  {
    id: "strong-sling",
    name: "Strong sling",
    appliesTo: "Long guns",
    nation: "Any",
    weight: 1,
    description: `A strong sling around your person that keeps your weapon held in place should you let go of it.
*Dropping a weapon becomes a free action and it stays with you.
*-1d6 to STR or DEX while the weapon is dangling off of you.`,
  },
  {
    id: "quickloader",
    name: "Quickloader",
    appliesTo: "Revolvers",
    nation: "Any",
    weight: 1,
    description: `Revolvers no longer need to be reloaded bullets one-by-one, they're reloaded in one go.
*Replaces the 'cylinder' gimmick from revolvers with itself.`,
  },

  // ── Civilian ──
  {
    id: "dbs-single-barrel",
    name: "Double-barrel shotgun: Single barrel",
    appliesTo: "Double-barrel shotgun",
    nation: "Civilian",
    weight: 0,
    ammoOverride: 1,
    weightOverride: 1,
    description: `*Modification is free.
*Ammo is reduced to 1. Weight is reduced to 1.
*Can be used alongside this weapon's other attachments.`,
  },
  {
    id: "dbs-sawn-off",
    name: "Double-barrel shotgun: Sawn-off",
    appliesTo: "Double-barrel shotgun",
    nation: "Civilian",
    weight: 0,
    description: `*Modification is free.
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
*Replaces the 'Double Barrel Shotgun' gimmick with this gimmick instead.
*Deals 4 damage to enemies 2 distances or closer. Deals 2 damage to enemies 3 distances or beyond.
*Deals no damage to enemies 10 distances or beyond.
*Can be used alongside this weapon's other attachments.`,
  },
  {
    id: "musket-rifled",
    name: "Musket: Rifled",
    appliesTo: "Flintlock Musket",
    nation: "Civilian",
    weight: 0,
    reloadTurnsOverride: 30,
    description: `*Replaces the 'Musket' gimmick with this gimmick instead.
*Reloading takes 30 turns.`,
  },

  // ── British ──
  {
    id: "lee-enfield-grenade-launcher",
    name: "Lee-Enfield: Grenade launcher",
    appliesTo: "Lee-Enfield No.1 Mk III",
    nation: "Britain",
    weight: 1,
    isCharge: true,
    description: `*Takes 3 turns to put the grenade launcher on/off. Cannot fire normally without removing it first, even if no grenade is slotted.
*Reloading a grenade after firing takes 1 turn.
*Fires a grenade, which explodes on impact, so long as the enemy is 3 distances away or more.
*Does not detonate if the enemy is within 2 distances. Deals 2 damage to the target.
*When buying this piece of gear, you're paying for charges of it. Each charge is an additional grenade. Each charge has 1 weight.`,
  },
  {
    id: "lewis-gun-shield",
    name: "Lewis gun: Shield",
    appliesTo: "Lewis Automatic Machine Gun",
    nation: "Britain",
    weight: 2,
    description: `*Has 2 weight. When in cover, +2d6 to cover rolls.`,
  },

  // ── French ──
  {
    id: "berthier-chauchat-magazines",
    name: "Berthier M1916: Chauchat Magazines",
    appliesTo: "Berthier M1916",
    nation: "France",
    weight: 1,
    isCharge: true,
    ammoOverride: 20,
    requiresMagazines: true,
    description: `*Has 20 rounds. Reloading with standard stripper clips becomes impossible. Must be reloaded with another magazine.
*Loses the Half-agile gimmick.
*When buying this piece of gear, you're paying for charges of it. Each charge is an additional 20 round magazine. Each charge has 1 weight.`,
  },
  {
    id: "rsc-chauchat-magazines",
    name: "RSC M1917: Chauchat Magazines",
    appliesTo: "RSC M1917",
    nation: "France",
    weight: 1,
    isCharge: true,
    ammoOverride: 20,
    requiresMagazines: true,
    description: `*Has 20 rounds. Reloading with standard stripper clips becomes impossible. Must be reloaded with another magazine.
*Loses the Walking fire gimmick.
*When buying this piece of gear, you're paying for charges of it. Each charge is an additional 20 round magazine. Each charge has 1 weight.`,
  },

  // ── German ──
  {
    id: "gewehr98-smk",
    name: "Gewehr 98: Spitzgeschoss mit Kern rounds",
    appliesTo: "Gewehr 98",
    nation: "Germany",
    weight: 0,
    isCharge: true,
    description: `*Armor piercing ammunition. Ignores damage reduction from perks and gear.
(Lizard tierfraun, prey-as-armour, etc.)
*May pierce lightly armoured vehicles once we actually add those.
*When buying this piece of gear, you're paying for charges of it. Each charge is 5 rounds.
*Weightless.`,
  },
  {
    id: "c96-extended-stock",
    name: "C96 Mauser: Extended stock",
    appliesTo: "C96 Mauser",
    nation: "Germany",
    weight: 0,
    description: `*It takes 1 turn to put the stock on/off.
*While the stock is on, loses agile gimmick.
*Holstering and unholstering this weapon takes an additional turn.
*+1 rate of fire.`,
  },

  // ── American ──
  {
    id: "thompson-drum-magazines",
    name: "Thompson: Drum magazines",
    appliesTo: "Thompson",
    nation: "United States",
    weight: 1,
    isCharge: true,
    ammoOverride: 50,
    description: `*Holds 50 rounds instead of the default.
*When buying this piece of gear, you're paying for charges of it. Each charge is a drum magazine. Each charge has 1 weight.
*Once out of charges, you must swap back into standard magazines.`,
  },
  {
    id: "springfield-pedersen",
    name: "Springfield: Pedersen device",
    appliesTo: "M1903 Springfield",
    nation: "United States",
    weight: 1,
    isCharge: true,
    ammoOverride: 40,
    requiresMagazines: true,
    damageOverride: 2,
    rateOfFireBonus: 1,
    description: `*It takes 3 turns to put the pedersen on/off.
*The Springfield will deal 2 damage instead of 3.
*The Springfield gains +1 rate of fire.
*The Springfield has 40 rounds whilst the device is on.
*When buying this piece of gear, you're paying for charges of it. Each charge is an additional 40 round magazine. Each charge has 1 weight.`,
  },
  {
    id: "springfield-suppressor",
    name: "Springfield: Suppressor",
    appliesTo: "M1903 Springfield",
    nation: "United States",
    weight: 0,
    description: `*It takes 1 turn to put the suppressor on/off.
*Shots are inaudible at distance 5 or beyond. Closer than that and they can be heard.
*May be used alongside the Pedersen device.`,
  },

  // ── Russian ──
  {
    id: "nagant-suppressor",
    name: "Nagant-revolver: Suppressor",
    appliesTo: "Nagant M1895 Revolver",
    nation: "Russia",
    weight: 0,
    description: `*It takes 1 turn to put the suppressor on/off.
*Shots are inaudible at distance 5 or beyond. Closer than that and they can be heard.`,
  },

  // ── Austro-Hungarian ──
  {
    id: "steyr-automatic-fire",
    name: "Steyr M1912: Automatic fire",
    appliesTo: "Steyr M1912",
    nation: "Austria-Hungary",
    weight: 0,
    rateOfFireBonus: 2,
    description: `*Weapon gains +2 rate of fire.
*Have -3d6 for each additional shot, instead of an accuracy buff.
*May be used alongside the other attachments of this weapon.`,
  },
  {
    id: "steyr-extended-magazine",
    name: "Steyr M1912: Extended magazine",
    appliesTo: "Steyr M1912",
    nation: "Austria-Hungary",
    weight: 0,
    ammoOverride: 16,
    description: `*Holds 16 rounds instead of the default.
*Stripper clips can only load 8 shots at a time. The magazine is not detachable.
*May be used alongside the other attachments of this weapon.`,
  },
  {
    id: "steyr-extended-stock",
    name: "Steyr M1912: Extended stock",
    appliesTo: "Steyr M1912",
    nation: "Austria-Hungary",
    weight: 0,
    description: `*It takes 1 turn to put the stock on/off.
*The 'automatic fire' attachment no longer reduces accuracy with each additional shot.
*Holstering and unholstering this weapon takes an additional turn.`,
  },
];

export const ATTACHMENTS_BY_ID = new Map(
  ATTACHMENTS.map((a) => [a.id, a]),
);

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
    gimmicks: `Black Powder:
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
    gimmicks: `Restricted:
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
    gimmicks: `Double barrel Shotgun:
*Deals 4 damage to enemies 3 distances or closer. Deals 2 damage to enemies 4 distances or beyond.
*Loads each shell individually, 1 shell per turn.
Trench-sweeper:
*Cover is one tier lower if the target is at 3 distances or closer.`,
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
    gimmicks: `Extra long:
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
    gimmicks: `Recoverable ammo:
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
    gimmicks: `Recoverable ammo:
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
    gimmicks: `Mad-minute technique:
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
    gimmicks: `Agile:
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
    gimmicks: `Restricted:
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
*Reloading takes 3 turns. If reload is started, cannot fire until reloading is finished. Allies can help in reloading.
*If the weapon has no magazine loaded, -1 weight.`,
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
    gimmicks: `Tubular magazine:
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
    gimmicks: `Agile:
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
    gimmicks: `Half-Agile:
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
    gimmicks: `Cost:
*1 point.`,
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
    gimmicks: `Cost:
*1 point.
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
    gimmicks: `Cost:
*1 point.
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
    gimmicks: `Reliable:
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
    gimmicks: `Cost:
*1 point.
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
    gimmicks: `Cost:
*1 point.`,
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
    gimmicks: `Agile:
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
    gimmicks: `Restricted:
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
    gimmicks: `Reliable:
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
    gimmicks: `Restricted:
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
    gimmicks: `Shotgun:
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
    gimmicks: `Cost:
*1 point.`,
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
    gimmicks: `Cost:
*1 point.
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
    gimmicks: `Restricted:
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
    gimmicks: `6mm Arisaka:
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
    gimmicks: `Agile:
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
    gimmicks: `Extra long:
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
    gimmicks: `Agile:
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
    gimmicks: `Restricted:
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
    gimmicks: `Half-Agile:
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
    gimmicks: `Cost:
*1 point.`,
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
    gimmicks: `En-block clip:
--->When the rifle is empty:
*Reloading can be done at no action cost. Shooting on the same turn awards -3d6 to accuracy.
6.5mm Carcano:
*The accuracy debuff (-3d6) applies at every 15 distances, instead of 10 distances.`,
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
    gimmicks: `Loading Gate:
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
    gimmicks: `Magazine-fed:
*Each magazine has 1 weight; choose how many magazines to bring at the start of a scene.
*Reloading is instantaneous if you use a magazine. Magazines are lost when unloaded.
*Reloads normally if you have no magazines left.`,
    compatibleAttachmentIds: [...LONG_GUN_ATTACHMENTS],
    freeAccessoryIds: ["schmidt-rubin-magazine"],
  },
  {
    id: "swiss-1882",
    name: "Swiss 1882",
    type: "Double-action revolver",
    kind: "double-action-revolver",
    nation: "Switzerland",
    damage: "2",
    ammo: 6,
    rateOfFire: 1,
    weight: 1,
    pointCost: 0,
    gimmicks: `Agile:
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
Cylinder:
*Reloads each bullet individually, taking 1 turn per bullet.`,
    compatibleAttachmentIds: [...REVOLVER_ATTACHMENTS],
    reloadsIndividually: true,
  },
];

export const WEAPONS_BY_ID = new Map(
  WEAPONS.map((w) => [w.id, w]),
);

// ---------------------------------------------------------------------------
// Free accessories (magazines that come with a weapon, declared at scene start)
// ---------------------------------------------------------------------------

export interface FreeAccessoryDefinition {
  id: string;
  name: string;
  weight: number;
  ammo: number;
  description: string;
}

export const FREE_ACCESSORIES: FreeAccessoryDefinition[] = [
  {
    id: "lewis-drum-magazine",
    name: "Lewis gun drum magazine",
    weight: 1,
    ammo: 97,
    description:
      "A drum magazine for the Lewis gun. Choose how many to bring at scene start.",
  },
  {
    id: "schmidt-rubin-magazine",
    name: "Schmidt–Rubin magazine",
    weight: 1,
    ammo: 6,
    description:
      "A detachable magazine for the Schmidt–Rubin Model 1911. Choose how many to bring at scene start.",
  },
];

export const FREE_ACCESSORIES_BY_ID = new Map(
  FREE_ACCESSORIES.map((a) => [a.id, a]),
);
