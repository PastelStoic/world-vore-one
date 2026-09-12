import type { PerkDefinition } from "@/data/perks.ts";

export const COMBAT_PERKS: PerkDefinition[] = [
  {
    id: "melee-fighter",
    name: "Melee fighter",
    category: "combat",
    description:
      `You are remarkably strong and precise with their strikes! 
      
*In melee, when rolling to attack or defend against a target, gain +3d6, counting successes on a 4 and above.`,
  },
  {
    id: "gunner",
    name: "Gunner",
    category: "combat",
    description: `You are unreasonably accurate from a distance!

*When rolling to make an attack with any ranged weapon, gain +3d6, counting successes on a 4 and above.
*Does not apply to grenades or throwable weapons.`,
  },
  {
    id: "runner",
    name: "Runner",
    category: "combat",
    description:
      `You are incredibly fast, and most struggle to keep up! 

*Move up to two distances in combat. You are always at the top of initiative, regardless of your dexterity.
*Compare dexterities if competing with someone with the same effect.`,
  },
  {
    id: "thrower",
    name: "Thrower",
    category: "combat",
    description:
      `You are an olympic thrower for sure! Your throwing arm is close to perfect!

*When throwing weapons at a target, gain +3d6, counting successes on a 4 and above.
*Your throwing weapons have a convenient rope tied to them - they returns to you in the end of your next turn.
*No longer have a damage drawback when using a throwable weapon in melee.`,
  },
  {
    id: "effective-cover-use",
    name: "Effective cover use",
    category: "combat",
    description: `You are careful and prefer to preserve your life! 

*You always have at least 2d6 cover, even if you are not in cover.
*When in cover, gain an additional +2d6 when rolling your cover, counting successes on a 4 and above.`,
  },
  {
    id: "tough",
    name: "Tough",
    category: "combat",
    description:
      `Your skin, meat 'n bones are very tough and hard to break through! 

*Your HP is multiplied by 1.5 - your constitution remains the same.
*You regenerate HP at twice the rate, and only need half as much rest to handle exhaustion.`,
    modifiers: {
      healthMultiplier: 1.5,
    },
  },
  {
    id: "explosive-intolerant",
    name: "Explosive intolerant",
    category: "combat",
    description:
      `Explosions seem to avoid you somehow, it's like you repel them! 

*During events and combat related scenes, never die or get hurt from explosives-related random chance
( Random mines, artillery shells and stray explosives )
*Explosives deal -2 damage to you, and the remainder damage is halved, rounded up. Damage CAN be brought to 0 through this.`,
  },
  {
    id: "wayfinder",
    name: "Wayfinder",
    category: "combat",
    description:
      `You have a perfect sense of where exactly you are in the world, and how to live off the land around you.

*Never get lost, and always know how to get where you need to go, as well as the state of the region you're in.
*Pick one type of terrain to specialize in. In such terrain, double your cover and any cover bonuses you'd get, then add them all together.
*You gain a special Survivalist's Kit. It has no weight and no 'bulky-kit' gimmick. Survival related checks always succeed so long as you have your kit.
*Your kit always returns to you, it cannot be permanently lost, but you can be separated from it temporarily.`,
    customInput: "Choosen terrain",
    grantsEquipment: [
      {
        equipmentId: "survivalists-kit",
        weightOverride: 0,
        isBulkyOverride: false,
      },
    ],
  },
  {
    id: "danger-sense",
    name: "Danger sense",
    category: "combat",
    description:
      `You have a natural feeling for 'danger', as if it were a sixth sense! 

*During events and combat related scenes, you will get hints of danger and dangerous situations.
*Gain +3d6 to spot hidden targets, ambushes and traps, counting successes on 4 and above.
*You can still trip traps; you do not know what triggers them neccessarily, you only know where they are.`,
  },
  {
    id: "j-eger",
    name: "Jäeger",
    category: "combat",
    description: `You are a natural at trap-making and being sneaky in general!

*Gain +3d6 to hide yourself, to set up ambushes, traps, and to determine their damage, counting successes on 4 and above.
*Your traps now deal a flat +3 damage.`,
  },
  {
    id: "signature-weapon",
    name: "Signature weapon",
    category: "combat",
    description: `You have a special weapon that belongs to you, and only you! 

*Select any ranged or melee weapon in the system. It deals +1 damage, and becomes free - unless it is restricted, instead, its cost is reduced to 1.
*If it is a ranged weapon, gain a free copy lf all of its attachments. If it is a melee weapon, you may add 1 melee trait to it.
*Your weapon always returns to you, it cannot be permanently lost, but you can be separated from it temporarily.`,
  },
  {
    id: "brawler",
    name: "Brawler",
    category: "combat",
    description:
      `You are a natural brawler, and fight with whatever you have on hands. 

*Your unarmed attacks and makeshift weapons deal +2 damage, have light armor piercing, and ignore damage reduction effects.
*When unarmed or with a makeshift weapon, when rolling to attack or defend against a target, gain +3d6, counting successes on a 4 and above.
*Does not apply to thrown makeshift weapons.`,
  },
  {
    id: "sapper",
    name: "Sapper",
    category: "combat",
    description:
      `You are a military engineer! You build fortifications and do general groundworks of the sort.

*You have a special, no-weight entrenching kit and explosives kit, both without the 'bulky-kit' gimmick.
*Your kits always return to you, they cannot be permanently lost, but you can be separated from them temporarily.
*In three turns, you can build cover worth 6d6 with your entrenching kit. With one more turn, you can transform it into 8d6 cover instead.
*You can destroy cover and any fortifications in one turn with your entrenching kit.`,
    grantsEquipment: [
      {
        equipmentId: "entrenching-gear",
        weightOverride: 0,
        isBulkyOverride: false,
      },
      {
        equipmentId: "explosives-kit",
        weightOverride: 0,
        isBulkyOverride: false,
      },
    ],
  },
  {
    id: "baiter",
    name: "Baiter",
    category: "combat",
    description:
      `You are really fucking annoying, or a particularly juicy target.

*When fighting as a group, enemies must target you even if other allies of yours are closer/easier/better targets, unless you cannot be targetted at all.
*You always have the materials to set up distractions and lures, which always bring enemies to the place where that distraction was set up.
*Use this perk not to fight, but to draw enemies away from you or into you.`,
  },
  {
    id: "defender",
    name: "Defender",
    category: "combat",
    description: `You have an iron-will to protect those around you!

*You have a shield, or equivalent, which has 2 weight and is considered a makeshift weapon
*Your shield always returns to you, it cannot be permanently lost, but you can be separated from it temporarily.
You may use a one-handed weapon alongside the shield, but have -3d6 to attack with it. You cannot reload while holding the shield.
*You can protect any number of teammates in the same distance as you, forcing enemies to target you instead.
*Damage from ranged and melee weapons is lowered to 1; you must be facing the source of the damage, or there is no reduction. Does not apply to explosions.`,
    grantsEquipment: [
      { equipmentId: "defenders-shield" },
    ],
  },
  {
    id: "weapon-master",
    name: "Weapon master",
    category: "combat",
    description:
      `You have weapons from all across the world, neatly stashed away someplace conveniently nearby.

*You have an arsenal, which is always conveniently nearby, whenever you need it.
*You have one copy of every weapon, melee or ranged, except restricted weapons - their cost is reduced to 1.
*Weapons may be given to others, but they can be stolen. Weapons lost must be re-bought with points.`,
  },
  {
    id: "veteran",
    name: "Veteran",
    category: "combat",
    description:
      `You have a knack for keeping yourself alive, at the cost of your teammates. You don't live long by being a dummy.

*When attacked, as a free action, pull any non-incapacitated ally or enemy, in the same distance as you, in the way of the attack.
*You may do that up to 3 times until your next turn.
*If your target is willing, they take all of the damage in your stead.
*If your target is unwilling, perform a STR vs STR contested check. On a success, they take all of the damage in your stead.
*You may pull a target in the way before or after a cover/defense roll.
*Officers and higher-ups can punish you for this behavior; it is great cowardice and poor conduct!`,
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    category: "combat",
    description:
      `You manage to push well past your limits, even at the detriment of your own life.

*You can never be put into critical condition - you are only ever incapacitated.
*Effects that change your behavior do not work on you, such as being set on fire, or the 'flasher' perk, among all the others.
*When reduced to 0HP, you are not incapacitated, and can continue fighting as normal, as you are hit with an 'adrenaline rush'.

->Adrenaline rush:
*Lasts 20 turns, or 20 minutes, whichever is faster. For the duration, you cannot be incapacitated, and you must roll your constitution every turn.
*You may voluntarily give out and become incapacitated - however, you cannot undo this! Once your rush is over, you 'crash' out.

->Crash out:
*You are incapacitated until your HP heals back to full. You cannot do any escape rolls if you are eaten.`,
  },
  {
    id: "ambidextrous",
    name: "Ambidextrous",
    category: "combat",
    description:
      `You have no dominant hand - you can use either one perfectly!

*You can dual wield any pair of one handed weapons and attack with both of them in one turn. Each attack is rolled independently.
*Your fists count as weapons for this purpose. You can punch someone twice, or hit them with a sword and punch them, etc.
*When dual wielding, you cannot utilize alternative firing techniques.`,
  },
  {
    id: "nimble_hands",
    name: "Nimble hands",
    category: "combat",
    description:
      `Your hands are remarkably nimble, able to use weapons with unmatched proficiency.

*Every weapon and tool can be holsted, unholstered, grabbed or dropped as a free action. You can perform three reloading actions as if they were one.
*Alternate firing techniques ( 'Mad minute technique', 'Walking fire', etc ... ) no longer have negative effects.
*Semiautomatic weapons ( 3 rof or lower ) no longer need to waste a shot when multi-targetting.`,
  },
  {
    id: "gunslinger",
    name: "Gunslinger",
    category: "combat",
    description:
      `You are a natural gunslinger, your trigger finger itches for the next shootout.

*Gain a special 'revolver bandolier', with infinite revolvers.
*The bandoiler always returns to you, it cannot be permanently lost, but you can be separated from it temporarily.
*Choose any single action revolver; you now have infinite copies of it, and only count the weight of one.
*You may fanfire the revolver, increasing its ROF as much as you want. Each additional ROF reducts -1d6 from shooting checks. Your other hand must be free to fanfire.
*You do not reload your revolvers; instead, you throw them at the enemy, dealing 2 damage on hit, before pulling out another. They break apart on hit, becoming unusable.
*You may not willingly give out a revolver, and you must try to recover them, unless they are broken.
*If you pick your revolver as a 'signature weapon', only a single revolver receives the benefits - all others utilize the normal stats.

*GUNSLINGER'S HONOUR: When meeting another gunslinger, must initiate a duel. Both roll their dexterities; winner instantly kills the loser.`,
      customInput: "Choosen revolver",
      grantsEquipment: [
      { equipmentId: "revolver-bandolier" },
      ],
  },
];
