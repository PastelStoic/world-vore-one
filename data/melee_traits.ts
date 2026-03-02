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
