import type { AttachmentDefinition } from "./equipment_types.ts";

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
    description:
      `3 damage when attached to the end of a long gun; 2 damage otherwise.
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
    description:
      `A strong sling around your person that keeps your weapon held in place should you let go of it.
*Dropping a weapon becomes a free action and it stays with you.
*-1d6 to STR or DEX while the weapon is dangling off of you.`,
  },
  {
    id: "quickloader",
    name: "Quickloader",
    appliesTo: "Revolvers",
    nation: "Any",
    weight: 1,
    removesTraitIds: ["cylinder"],
    addsTraitIds: ["quickloader"],
    description:
      `Revolvers no longer need to be reloaded bullets one-by-one, they're reloaded in one go.
*Replaces the 'cylinder' gimmick from revolvers with itself.`,
  },

  // ── Civilian ──
  {
    id: "dbs-single-barrel",
    name: "Double-barrel shotgun: Single barrel",
    appliesTo: "Double-barrel shotgun",
    nation: "Civilian",
    weight: 0,
    isFree: true,
    ammoOverride: 1,
    weightOverride: 1,
    removesTraitIds: ["double-fire"],
    description: `*Modification is free.
*Ammo is reduced to 1. Weight is reduced by 1.
*Can be used alongside this weapon's other attachments.`,
  },
  {
    id: "dbs-sawn-off",
    name: "Double-barrel shotgun: Sawn-off",
    appliesTo: "Double-barrel shotgun",
    nation: "Civilian",
    weight: 0,
    isFree: true,
    removesTraitIds: ["buckshot"],
    addsTraitIds: ["sawn-off"],
    description: `*Modification is free.
*Can be fired even at distance 0. Can be unholstered and holstered at no action cost.
*Worse ranging:
*Deals 4 damage to enemies 2 distances or closer. Deals 2 damage to enemies 3 distances or beyond.
*Deals no damage to enemies 10 distances or beyond.
*Can be used alongside this weapon's other attachments.`,
  },
  {
    id: "dbs-alofs-device",
    name: "Double-barrel shotgun: Alofs Device",
    appliesTo: "Double-barrel shotgun",
    nation: "Civilian",
    weight: 1,
    weightOverride: 2,
    ammoOverride: 5,
    removesTraitIds: ["double-barrel-shotgun"],
    addsTraitIds: ["alofs-device"],
    requiresAttachmentIds: ["dbs-single-barrel"],
    description:
      `*Extends the ammo capacity of the Double-barrel shotgun, from 1/2 to 5.`,
  },
  {
    id: "musket-rifled",
    name: "Musket: Rifled",
    appliesTo: "Flintlock Musket",
    nation: "Civilian",
    weight: 0,
    reloadTurnsOverride: 30,
    removesTraitIds: ["musket"],
    addsTraitIds: ["rifled-musket"],
    description: `*Replaces the 'Musket' gimmick with this gimmick instead.
*Reloading takes 30 turns.
*Accuracy penalty returns to normal.`,
  },
  {
    id: "colt-walker-bullets",
    name: "Colt walker: Bullets",
    appliesTo: "Colt Walker",
    nation: "Civilian",
    weight: 1,
    reloadTurnsOverride: 1,
    removesTraitIds: ["extremely-slow-reload", "overloaded-chamber"],
    addsTraitIds: ["loading-gate"],
    description:
      `*Removes the 'extremely-slow-reload' and 'overloaded-chamber' gimmicks, replacing it with 'loading gate'`,
  },

  // ── British ──
  {
    id: "lee-enfield-grenade-launcher",
    name: "Lee-Enfield: Grenade launcher",
    appliesTo: "Lee-Enfield No.1 Mk III",
    nation: "Britain",
    weight: 1,
    isCharge: true,
    description:
      `*Takes 1 turn to put the grenade launcher on/off. Cannot fire normally without removing it first, even if no grenade is slotted.
*Roll DEX to hit your target, you only need 1 success regardless of cover. If you fail, roll 1d[DISTANCE TO TARGET]-1 - that is where the grenade lands.
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
    removesTraitIds: ["half-agile"],
    addsTraitIds: ["impossible-to-remove"],
    description:
      `*Has 20 rounds. Reloading with standard stripper clips becomes impossible. Must be reloaded with another magazine.
*Loses the Half-agile gimmick.
*Difficult to remove mid battle due to extensive modifications done to the firearm in order to accomodate these magazines.
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
    removesTraitIds: ["walking-fire"],
    addsTraitIds: ["impossible-to-remove"],
    description:
      `*Has 20 rounds. Reloading with standard stripper clips becomes impossible. Must be reloaded with another magazine.
*Loses the Walking fire gimmick.
*Difficult to remove mid battle due to extensive modifications done to the firearm in order to accomodate these magazines.
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
    description:
      `*Armor piercing ammunition. Ignores damage reduction from perks and gear.
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
    weight: 1,
    removesTraitIds: ["agile", "one-handed"],
    addsTraitIds: ["two-handed", "inconvenient"],
    description: `*It takes 1 turn to put the stock on/off.
*While the stock is on, loses agile gimmick. Becomes two-handed.
*Gains the 'inconvenient' gimmick.
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
    excludesAttachmentIds?: ["springfield-flyboy",],
    description: `*It takes 3 turns to put the pedersen on/off.
*The Springfield deals 2 damage instead of 3.
*The Springfield gains +1 rate of fire.
*The Springfield has 40 rounds whilst the device is on.
*When buying this piece of gear, you're paying for charges of it. Each charge is an additional 40 round magazine. Each charge has 1 weight.`,
  },
  {
    id: "springfield-flyboy",
    name: "Springfield: Flyboy device",
    appliesTo: "M1903 Springfield",
    nation: "United States",
    weight: 2,
    ammoOverride: 25,
    excludesAttachmentIds?: ["springfield-pedersen",],
    addsTraitIds: ["impossible-to-remove"],
    description: `*Your rifle gets a 25 round magazine.
    *The magazine cannot be removed easily mid-combat.
    *The spring tension prevents usage of stripper clips; you're loading shots one by one.
    *The spring tension would cause the Pedersen Device to malfunction.
    *2 weight instead of the typical 1.`,
  },
  {
    id: "springfield-suppressor",
    name: "Springfield: Suppressor",
    appliesTo: "M1903 Springfield",
    nation: "United States",
    weight: 1,
    description: `*It takes 1 turn to put the suppressor on/off.
*Shots are inaudible at distance 5 or beyond. Closer than that and they can be heard.
*May be used alongside this weapon's other attachments..`,
  },

  // ── Russian ──
  {
    id: "nagant-suppressor",
    name: "Nagant-revolver: Suppressor",
    appliesTo: "Nagant M1895 Revolver",
    nation: "Russia",
    weight: 1,
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
    addsTraitIds: ["uncontrollable"],
    description: `*Attachment has no weight.
*Weapon gains +2 rate of fire.
*Gain the 'uncontrollable' gimmick.
*May be used alongside the other attachments of this weapon.`,
  },
  {
    id: "steyr-extended-magazine",
    name: "Steyr M1912: Extended magazine",
    appliesTo: "Steyr M1912",
    nation: "Austria-Hungary",
    weight: 1,
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
    weight: 1,
    removesTraitIds: ["agile", "one-handed", "uncontrollable"],
    addsTraitIds: ["two-handed", "inconvenient"],
    description: `*It takes 1 turn to put the stock on/off.
*The 'automatic fire' attachment's accuracy from extra shots now return to normal.
*Gains the 'inconvenient' gimmick.
*May be used alongside the other attachments of this weapon.`,
  },
];

export const ATTACHMENTS_BY_ID = new Map(
  ATTACHMENTS.map((a) => [a.id, a]),
);
