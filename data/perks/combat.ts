import type { PerkDefinition } from "@/data/perks.ts";

export const COMBAT_PERKS: PerkDefinition[] = [
  {
    id: "melee-fighter",
    name: "Melee fighter",
    category: "combat",
    description:
      `Your character is remarkably strong, or particularly precise with their strikes! 
      
*When rolling to attack or defend against someone through melee means, roll +3d6 
*You now count a success on a 4 and above, instead of a 5 and above.`,
  },
  {
    id: "gunner",
    name: "Gunner",
    category: "combat",
    description: `Your character is remarkably accurate with their shots! 
    
*When rolling to make an attack with a ranged weapon (firearms, bows, crossbows, flamethrowers), roll +3d6. 
*You now count a success on a 4 and above, instead of a 5 and above.
*Does not apply to grenades or throwable weapons.`,
  },
  {
    id: "runner",
    name: "Runner",
    category: "combat",
    description:
      `Your character is remarkably fast, and most struggle to keep up! 
      
->If you are not encumbered:
*Move up to two distances, instead of the usual one, in combat. 
*You are always at the top of initative regardless of your dexterity.
*Regular rules apply to all that share this perk.`,
  },
  {
    id: "effective-cover-use",
    name: "Effective cover use",
    category: "combat",
    description: `You're careful and very much prefer to preserve your life! 
    
*If you are not in cover at all - such as being wide in the open - you will always have at least 2d6 cover.
*You have +2d6 to your cover rolls. When rolling your cover, you obtain successes on 4 and above, rather than 5 and above.`,
  },
  {
    id: "tough",
    name: "Tough",
    category: "combat",
    description:
      `Your skin, meat 'n bones are very tough and hard to break through! 

*Your HP is multiplied by 1.5. Your constitution is not multiplied, it applies only to your HP!
*You need half the amount of time to heal up from wounds, and you only need half as much rest to handle your exhaustion.`,
    modifiers: {
      healthMultiplier: 1.5,
    },
  },
  {
    id: "explosive-intolerant",
    name: "Explosive intolerant",
    category: "combat",
    description:
      `Explosions in general only ever seem to avoid you somehow, it's like you repel them! 

*During events and combat related scenes, never die or get hurt from explosives-related random chance
( Random mines, artillery shells and stray explosives )
*Explosives deal -2 damage to you. Damage CAN be brought to 0 through this.`,
  },
  {
    id: "wayfinder",
    name: "Wayfinder",
    category: "combat",
    description:
      `You have a perfect sense of where exactly you are in the world, and how to live off the land around you.

*You never get lost, you always find paths to where you need to go, and always know the state of the region you are in.
*You have a special "survivalist's kit", it has no weight and no "bulky kit" gimmick.
*It always returns to you through one means or another, but you can be separated from it temporarily.
*Your survivalist kit always allows you to find enough sustenance to keep yourself fed in the wild, and always has the supplies for such matters.
*Pick one type of terrain ( Forests, mountains, plains, no-man's-land, urban, etc ) to specialize in. While in such a terrain, double any cover bonuses you would get.`,
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

*Gain +3d6 to spot any stealth action or ambush done against you or your party, as well as to detect any traps.
*You now count a success on a 4 and above, instead of a 5 and above.
*You can still trip traps if you're not careful, as you do not neccessarily know what triggers them, you just know where they are.
*You feel a sense of danger whenever something dangerous can happen to you during events.`,
  },
  {
    id: "j-eger",
    name: "Jäeger",
    category: "combat",
    description: `You are a natural at trap-making and being sneaky in general!

*Gain +3d6 to perform any stealth action, ambush, to set up traps and determine their damage.
*You now count a success on a 4 and above, instead of a 5 and above.
*Your traps deal a flat +3 damage.`,
  },
  {
    id: "signature-weapon",
    name: "Signature weapon",
    category: "combat",
    description: `You have a special weapon that belongs to you, and only you! 
    
*It deals +1 damage and always somehow returns to you, regardless of circumstances. However you may be temporarily separated from it.
*If you pick a 'restricted' ranged weapon, you must pay 1 point. Every other weapon is free.
*If it is a ranged weapon, all attachments are free. If it is a melee weapon, you may add 1 melee trait to it.`,
  },
  {
    id: "brawler",
    name: "Brawler",
    category: "combat",
    description:
      `You are a natural brawler, and fight with whatever you have on hands. 

*Tier 0 and tier 1 weapons ( unarmed and makeshift weapons respectively ) deal +2 damage.
*Ignore damage penalties whilst using those weapons such as personal armor or a lizardgirl's scales.
*When attacking or defending with tier 0 and tier 1 weapons, gain +3d6 to attack with them and count successes on a 4 or above, instead of a 5 and above.
*Does nothing for tier 2 ( military ) weapons.
*Does not apply to thrown makeshift weapons.`,
  },
  {
    id: "sapper",
    name: "Sapper",
    category: "combat",
    description:
      `A Sapper is a military engineer of sorts. You build fortifications and do general groundworks of the sort.

*You have a no-weight entrenching gear AND an explosives kit which are not considered 'bulky kits' thanks to this perk.
*They always return to you through one means or another, but you can be separated from them temporarily.
*Your entrenching gear allows you to build cover worth 6d6 in 3 turns.
*If you have additional resources in-scene AND preparation time, you can create cover worth 8d6
*Destroying fortifications with explosives, cutting barbed wire, breaking down walls, you do it in one turn, without fail.
*Sapper extends to vehicles as well, you can repair, modify and upgrade vehicles without fail.`,
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

*When fighting as a group, enemies must target you even if other allies of yours are closer/easier/better targets.
*Does not apply if your enemy is incapable of targetting you at all.
*You always have the materials to set up distractions and lures, which always bring enemies to the place where that distraction was set up.
*Use this perk not to fight, but to draw enemies away from you or into you.`,
  },
  {
    id: "defender",
    name: "Defender",
    category: "combat",
    description: `You have an iron-will to protect those around you!

*You have a shield, or equivalent, which has 2 weight and is considered a makeshift weapon.
*You may use a one-handed melee weapon OR one-handed firearm whilst holding the shield, but you have -3d6 to attack with them.
*You cannot reload your weapon whilst holding the shield, you must put it away as an action.
*If at distance 0 with any number of teammates, as an action you may protect any number of them, forcing the enemy to target you instead. 
*If you're holding your shield, damage from all sources is lowered to 1. Unarmed and makeshift weapons deal no damage. You must be facing the target, or there is no reduction.
*It will always return to you somehow, but you can be separated from it for some time.`,
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

*With this perk, you have ONE copy of every weapon in the system. 
*You have as many melee weapons as you want, with fitting traits.
*Restricted weapons still cost 1 point. Any other weapon, even with a cost, becomes free.
*You can visit your arsenal during scenes and give them to others, but they can be stolen by them.
*Weapons lost must be re-acquired through roleplay. Restricted weapons must be bought with a point again.`,
  },
  {
    id: "veteran",
    name: "Veteran",
    category: "combat",
    description:
      `You have a knack for keeping yourself alive, at the cost of your teammates. You don't live long by being a dummy.

*When being attacked, you may pull a non-incapacitated ally/enemy in the same distance as you into the way. Does not apply if you were ambushed.
*You may protect yourself from up to three attacks per turn, and they are all free actions.
*Your target may be pulled before or after you perform your cover/defense roll.
*If your target is willing, they take all of the damage in your stead.
*If your target is unwilling, you may do a STR vs STR contested check against them. On a success, they take all of the damage in your stead.
*Officers and higher-ups can punish you for this behavior; it is great cowardice and poor conduct!`,
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    category: "combat",
    description:
      `You manage to push well past your limits, even at the detriment of your own life.

*Even if your HP goes into the negatives, you are never put into critical condition, you're only ever considered incapacitated.
*When reduced to 0HP, you are not incapacitated, and can continue fighting as normal, as you are hit with an 'adrenaline rush'.

->Adrenaline rush:
*Your rush lasts 20 turns, or 20 minutes, whichever is faster.
*For the duration, you cannot be incapacitated, and you must roll your constitution every turn.
*You may voluntarily give out and become incapacitated - however, you cannot undo this!
*Once your rush is over, you 'crash' out.

->Crash out:
*You are incapacitated until your HP heals back to full. You cannot do any escape rolls if you are eaten.
*Being healed by allies does not speed this up; you've overexerted yourself, you need rest.`,
  },
  {
    id: "ambidextrous",
    name: "Ambidextrous",
    category: "combat",
    description:
      `You have no dominant hand - you can use either one perfectly! You're awfully agile with them, too.

*Every weapon and tool can be holsted, unholstered, grabbed or dropped as a free action.
*You can dual wield any one handed weapon and attack with both of them in one turn. Each attack is rolled independently.
*Your fists count as weapons for this purpose. You can punch someone twice, or hit them with a sword and punch them, etc.
*When dual wielding, you cannot utilize alternative firing techniques.
*Hefties, when using two-handed weapons as if one handed, gain a base -3d6 to attack with their secondary weapon, and a cumulative -3d6 for every additional shot/swing done with it. No accuracy bonus from the extra shots.
*In one turn, you can perform two reloading actions as if they were one, reloading both held weapons, or a single one.
*Alternate firing techniques ( 'Mad minute technique', 'Walking fire', etc ... ) no longer have negative effects.
*Semiautomatic weapons ( 3 rof or lower ) no longer need to waste a shot when multi-targetting.
*Throwing weapons no longer deal decreased damage when you use them for melee.`,
  },
  {
    id: "gunslinger",
    name: "Gunslinger",
    category: "combat",
    description:
      `You are a natural gunslinger, your trigger finger itches for the next shootout.

*Gain a special 'revolver bandolier', with infinite revolvers that you can whip out whenever you want.
*Choose a single action revolver, this now becomes your special revolver - you have infinite copies of them, and only count the weight of one.
*You may fanfire the revolver, increasing its rof. Each additional rof point deducts -1d6 from your shooting accuracy. Your other hand must be free in order to fanfire it.
*Your revolvers are special to you. You cannot willingly hand them over, and must always recover them, even at the risk of your own life.
*You do not reload your revolvers. Instead, throw them at the enemy as a free action, dealing 2 damage on hit, and then whip out another.
*The revolvers break apart when thrown at an enemy, making them unusable.
*Your bandolier and revolvers always return to you somehow, but you can be separated from them temporarily.
*If you pick your revolver as a 'signature weapon', only a single revolver receives the benefits - all others utilize the normal stats.
*GUNSLINGER'S HONOUR: When meeting another gunslinger, must initiate a duel. Both roll their dexterities; winner instantly kills the loser.`,
      customInput: "Choosen revolver",
      grantsEquipment: [
      { equipmentId: "revolver-bandolier" },
      ],
  },
];
