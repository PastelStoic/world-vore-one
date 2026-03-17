// ---------------------------------------------------------------------------
// DATA – Melee Weapon Traits
// ---------------------------------------------------------------------------

import type { MeleeTraitDefinition } from "./equipment_types.ts";

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
    description: "Weapon must be two-handed in order to be used properly.",
  },
  {
    id: "bastard-weapon",
    name: "Bastard weapon",
    description:
      "Can be used with either one hand or two hands. +1 damage if used with two hands.",
  },
  {
    id: "crushing",
    name: "Crushing",
    description:
      "Weapon is meant to bludgeon enemies dead. Ignores damage penalties such as armor, or a lizardgirl's scales. Deals +1 damage against enemies that'd otherwise give you a damage penalty.",
  },
  {
    id: "extra-long",
    name: "Extra long",
    description:
      "This melee weapon is much longer than its contemporaries. If attacked in melee, can use your action to attack them first, taking your action if it hasn't been used yet.",
  },
  {
    id: "ridiculously-long",
    name: "Ridiculously long",
    description:
      "Weapon is extremely long. Can attack enemies 1 distance away, but not on the same distance as you. Cannot be used in cramped spaces (indoors, inside ships, tanks, etc.).",
  },
  {
    id: "braceable",
    name: "Braceable",
    description:
      `This melee weapon can be braced against incoming cavalry. If you brace, a mounted enemy or horse moving into attacking distance will take an unavoidable instance of damage and negates the "cavalry-weapon" trait of a weapon.`,
  },
  {
    id: "flourishing",
    name: "Flourishing",
    description:
      "This weapon can be used to make incredibly wide swings, which make it difficult for enemies to approach. If you flourish, an enemy moving into distance 0 will take an unavoidable instance of damage. You cannot flourish in cramped spaces (indoors, inside ships, tanks, etc.).",
  },
  {
    id: "rapid-shanking",
    name: "Rapid shanking",
    description:
      "This weapon can be used to quickly shank enemies. If you choose to take a -2d6 when attacking, having an additional success over your opponent deals an additional instance of damage. If you are grappling your target, you have no penalty when rapid shanking.",
  },
  {
    id: "duelling",
    name: "Duelling",
    description:
      "This weapon is meant for duels and one-on-one's. Only applies if you are holding nothing else but this weapon. If a single enemy is in melee range, gain +3d6 to attack them. If there is more than one, gain -1d6 to attack anyone for each enemy, up to -3d6.",
  },
  {
    id: "parrying",
    name: "Parrying",
    description:
      "This weapon is meant to assist your duelling weapon. You may hold this weapon and the 'duelling' trait will still work. If this is held alongside a duelling weapon, the duelling weapon no longer has a penalty for additional enemies being in range.",
  },
  {
    id: "multi-headed",
    name: "Multi-headed",
    description:
      "Weapon has multiple heads for different purposes. Has multiple traits depending on the head. It takes 1 turn to swap between each head.",
  },
  {
    id: "cavalry-weapon",
    name: "Cavalry-weapon",
    description:
      "Weapon is meant to be used whilst atop a horse or mount. If not atop a horse, gain -3d6 to hit enemies. If atop a horse, you can choose to charge with it! If charging, when moving to distance 0 of an enemy, deal an instance of unavoidable damage. Must be started from at least 2 distances away.",
  },
  {
    id: "concealable",
    name: "Concealable",
    description:
      "The weapon is remarkably tiny, one can hide it away with ease. So long as it is holstered, enemies are not aware of it.",
  },
  {
    id: "throwable",
    name: "Throwable",
    description:
      "The weapon is meant, first and foremost, to be thrown. You can throw it 5 + STR distances away, hitting the target is a DEX vs Cover contested check. Deals -1 damage when used as a melee weapon, damage cannot be brought to 0 through this.",
  },
  {
    id: "barbed-hooked",
    name: "Barbed/hooked",
    description:
      "The weapon is barbed OR has a nasty hook, making it stick to things. When the target is hit, they're unable to move in their next turn. If used on a throwable weapon, when the target is hit, they gain the weapon's weight until it is removed. Mutually exclusive with razor-bladed.",
  },
  {
    id: "breaching",
    name: "Breaching",
    description:
      "The weapon is primarily a tool, meant to break through things. Can destroy certain types of cover and obstacles entirely as an action.",
  },
  {
    id: "razor-bladed",
    name: "Razor bladed",
    description:
      "The weapon is extremely sharp, like a razor. If you have 3 successes over your opponent, roll a 1d6 to disable (NOT cut off!) a limb. 1-2, left or right arm respectively. 3-4, left or right leg respectively. 5, the torso, and 6, the head. Losing an arm makes the opponent drop their item; losing both means they can hold nothing. Losing a leg kicks the player down to the bottom of initiative; losing both makes them immobile and knocks them to the floor. Hitting the torso makes the target take +1 damage from all sources. Losing the head is instant death. Mutually exclusive with barbed.",
  },
  {
    id: "path-clearer",
    name: "Path clearer",
    description:
      "The weapon is primarily a tool, meant to cut through things. Can destroy certain types of cover and obstacles entirely as an action.",
  },
  {
    id: "buckler-shield",
    name: "Buckler shield",
    description:
      "You may hold this weapon and the 'duelling' trait will still work. You roll +2d6 to defend yourself in melee.",
  },
  {
    id: "shield",
    name: "Shield",
    description:
      "You roll +4d6 to defend yourself in melee. If slung over your back, roll +2d6 instead when attacked from behind.",
  },
  {
    id: "board-shield",
    name: "Board shield",
    description:
      "You roll +4d6 to defend yourself in melee. If slung over your back, roll +2d6 instead when attacked from behind. Can be planted onto the ground, serving as 2d6 cover.",
  },
];

export const MELEE_TRAITS_BY_ID = new Map(
  MELEE_TRAITS.map((t) => [t.id, t]),
);
