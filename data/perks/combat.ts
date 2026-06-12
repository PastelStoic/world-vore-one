import type { PerkDefinition } from "@/data/perks.ts";

export const COMBAT_PERKS: PerkDefinition[] = [
  {
    id: "melee-fighter",
    name: "Melee fighter",
    category: "combat",
    description:
      `Your character is remarkably strong, or particularly precise with their strikes! 
*When rolling to attack or defend against someone through melee means, roll +4d6 
*You now count a success on a 4 and above, instead of a 5 and above.`,
  },
  {
    id: "gunner",
    name: "Gunner",
    category: "combat",
    description: `Your character is remarkably accurate with their shots! 
*When roling to attack someone by shooting them with a firearm, roll +4d6. 
*You now count a success on a 4 and above, instead of a 5 and above.
*Does not apply to grenades or throwable weapons.`,
  },
  {
    id: "runner",
    name: "Runner",
    category: "combat",
    description:
      `Your character is remarkably fast, and most struggle to keep up! 
---->So long as you are not encumbered:
*Move up to two distances, instead of the usual one, in combat. 
*You are always at the top of initative regardless of your dexterity.
*Regular rules apply to all that share this perk.`,
  },
  {
    id: "effective-cover-use",
    name: "Effective cover use",
    category: "combat",
    description: `You're careful and very much prefer to preserve your life! 

*Every tier of cover is rated one tier higher than it actually is - except for the highest tier (8d6), which has no effect.
*If you are not in cover at all - such as being wide in the open - you will always have at least 2d6 cover.
*When rolling your cover, you obtain successes on 4 and above, rather than 5 and above.`,
  },
  {
    id: "terrain-specialist",
    name: "Terrain specialist",
    category: "combat",
    description: `You're very well accostoumed to specific kinds of terrains! 

*Pick one type of terrain ( Forests, mountains, plains, no-man's-land, urban, etc ). 
*While in such a terrain, double any cover bonuses you would get!
*Never get lost in such terrain, always know your way around.`,
    customInput: "Chosen terrain (e.g. forests, mountains, urban…)",
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
( Random mines, artillery shells and stray explosives ^ )
*Explosives deal -2 damage to you. Damage CAN be brought to 0 through this.`,
  },
  {
    id: "danger-sense",
    name: "Danger sense",
    category: "combat",
    description:
      `You have a natural feeling for 'danger', as if it were a sixth sense! 

*Any stealth action or ambush done against you immediately fails. You are never caught by surprise. 
*Always notice traps before they can pose a danger to you. You can still trip them though.
*Does not apply against the 'Jäeger perk'. Regular rules apply instead.`,
  },
  {
    id: "j-eger",
    name: "Jäeger",
    category: "combat",
    description: `You are a natural at trap-making and being sneaky in general!

*Any stealth action or ambush done by you always succeeds. 
*Traps are always hidden, no need to roll for their concealment.
*+3d6 when rolling for the trap's damage.
*Does not apply against the 'Danger sense' perk. Regular rules apply instead.`,
  },
  {
    id: "signature-weapon",
    name: "Signature weapon",
    category: "combat",
    description: `You have a special weapon that belongs to you, and only you! 

*It must be grabbed from the weapon's list, or reflavoured from there.
*It is considered the highest tier of weapon and deals +1 damage. 
*No matter what happens, it always returns to you through one way or another. You may be temporarily separated from it.
*Any attachments unique to this weapon (not compatible with other guns) are free.
*If you wish to pick a ranged weapon with the 'restricted' gimmick, you must still pay 1 point. Every other weapon is free.
*If it's a melee weapon, you may grab one melee weapon trait that wouldn't otherwise fit the weapon, alongside all other fitting traits.`,
  },
  {
    id: "brawler",
    name: "Brawler",
    category: "combat",
    description:
      `You are a natural brawler, and fight with whatever you have on hands. 

*Tier 0 and tier 1 weapons ( unarmed and makeshift weapons respectively ) deal +2 damage.
*Ignore damage penalties whilst using those weapons such as armor or a lizardgirl's scales.
*When attacking or defending with tier 0 and tier 1 weapons, gain +4d6 to attack with them and count successes on a 4 or above, instead of a 5 and above.
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
      { equipmentId: "entrenching-gear-sapper" },
      { equipmentId: "explosives-kit-sapper" },
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

*You may get this perk even if it pushes you past your encumbrance level.
*You have a shield, or equivalent, which has 2 weight and is considered a makeshift weapon.
*You may use a one-handed melee weapon OR one-handed firearm whilst holding the shield, but you have -3d6 to attack with them.
*If at distance 0 with any number of teammates, as an action you may protect any number of them, forcing the enemy to target you instead. 
*If you're holding your shield, damage from all sources is lowered to 1. Unarmed and makeshift weapons deal no damage. You must be facing the target, or there is no reduction.
*Like a 'signiature weapon', it will always return to you somehow, but you can be separated from it for some time.`,
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

*When being attacked, you may pull an ally/enemy in the same distance as you into the way. Does not apply if you were ambushed.
*The target you pull must not be incapacitated/critical, only targets you can quickly reach out for and pull into your way are valid.
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
*You must roll your constitution when you are reduced to 0HP, and every turn thereafter.
*You need 1 + [how negative your HP is] / 2, rounding down, successes in order to keep standing.
*You are forcefully incapacitated - NOT put into critical condition - if you fail your constitution check or if 20 turns pass, whichever comes earlier.
*Once this ability is over, you 'crash' out. While crashed out, you are incapacitated and you cannot do any escape rolls if you are eaten.
*\`Crashed out\` lasts until your HP regenerates to full.`,
  },
  {
    id: "ambidextrous",
    name: "Ambidextrous",
    category: "combat",
    description:
      `You have no dominant hand - you can use either one perfectly! You're awfully agile with them, too.

*Every weapon and tool can be holsted, unholstered, grabbed or dropped as a free action.
*You can dual wield pistols OR one-handed melees. You can attack with both weapons in one turn.
*Your fists count as weapons for this purpose. You can punch someone twice, or hit them with a sword and punch them, etc.
*When dual wielding, you cannot utilize alternative firing techniques, unless both weapons are one-handed and both share the alternative firing technique gimmick.
*Hefties, when using two-handed weapons as if they were one handed, gain a base -3d6 to attack with their secondary weapon, and a cumulative -3d6 for every additional shot/swing done with it. No accuracy bonus from the extra shots.
*In one turn, you can perform two reloading actions as if they were one, reloading both held weapons, or a single one.
*Alternative firing stances ( 'Mad minute technique', 'Walking fire', etc ... ) no longer have negative effects.
*Semiautomatic weapons ( 3 rof or lower ) no longer need to waste a shot when multi-targetting.
*Throwing weapons no longer deal decreased damage when you use them for melee.`,
  },
];
