// ---------------------------------------------------------------------------
// DATA – Premade Melee Weapons
// ---------------------------------------------------------------------------

import type { MeleeWeaponTemplate } from "./equipment_types.ts";

export const MELEE_WEAPONS: MeleeWeaponTemplate[] = [
  // ── Blades ─────────────────────────────────────────────────────────────
  {
    id: "dagger",
    name: "Dagger",
    damage: 3,
    weight: 1,
    traitIds: ["one-handed", "concealable"],
    description:
      "Short double-edged blade. Can easily be hidden underneath clothing. Arguably one of humanity's oldest weapons.",
  },
  {
    id: "throwing-dagger",
    name: "Throwing Dagger",
    damage: 3,
    weight: 1,
    traitIds: ["one-handed", "throwable", "concealable"],
    description:
      "A small throwing dagger, not as good for shanking someone with as a regularly sized dagger, but remarkably accurate on the throw.",
  },
  {
    id: "combat-knife",
    name: "Combat Knife",
    damage: 4,
    weight: 1,
    traitIds: ["one-handed", "rapid-shanking"],
    description:
      "Standard military fighting knife. More of a tool than a combat weapon, but it works in a pinch.",
  },
  {
    id: "throwing-knife",
    name: "Throwing Knife",
    damage: 4,
    weight: 1,
    traitIds: ["one-handed", "rapid-shanking", "throwable"],
    description: "Light, balanced blade optimised for throwing.",
  },
  {
    id: "machete",
    name: "Machete",
    damage: 4,
    weight: 1,
    traitIds: ["one-handed", "path-clearer"],
    description:
      "A machete, sports a heavy inward-curved blade. Excellent for clearing the way on jungles.",
  },
  {
    id: "sabre",
    name: "Sabre",
    damage: 6,
    weight: 1,
    traitIds: ["one-handed"],
    description:
      "A modern, curved sabre. Made light and sharp for infantry usage.",
  },
  {
    id: "cavalry-sabre",
    name: "Cavalry sabre",
    damage: 6,
    weight: 2,
    traitIds: ["one-handed", "cavalry-weapon"],
    description:
      "A cavalry sabre, made much thicker and heavier than a typical sabre, so as to take full advantage of its mount's weight and speed.",
  },
  {
    id: "rapier",
    name: "Rapier",
    damage: 6,
    weight: 2,
    traitIds: ["one-handed", "duelling"],
    description: "Long, thin thrusting sword favoured by duelists.",
  },
  {
    id: "parrying-dagger",
    name: "Parrying dagger",
    damage: 3,
    weight: 1,
    traitIds: ["one-handed", "parrying"],
    description: "A short dagger meant to assist a duellist's main weapon.",
  },
  {
    id: "broadsword",
    name: "Broadsword",
    damage: 6,
    weight: 2,
    traitIds: ["bastard-weapon"],
    description: "Heavy blade that can be wielded with either hand.",
  },
  {
    id: "longsword",
    name: "Longsword",
    damage: 8,
    weight: 3,
    traitIds: ["two-handed", "flourishing"],
    description: "A remarkably long sword, the kinds you'd see knights use.",
  },
  {
    id: "greatsword",
    name: "Greatsword",
    damage: 10,
    weight: 4,
    traitIds: ["two-handed", "flourishing", "razor-bladed"],
    description: "Massive, oversized blade, meant for wide swings.",
  },

  // ── Polearms ───────────────────────────────────────────────────────────
  {
    id: "spear",
    name: "Spear",
    damage: 6,
    weight: 2,
    traitIds: ["two-handed", "extra-long", "braceable"],
    description: "Long-shafted thrusting weapon.",
  },
  {
    id: "greatclub",
    name: "Great club",
    damage: 8,
    weight: 3,
    traitIds: ["two-handed", "crushing"],
    description: "A massive, two-handed club, meant for beating people up!",
  },
  {
    id: "pike",
    name: "Pike",
    damage: 6,
    weight: 3,
    traitIds: ["two-handed", "ridiculously-long", "braceable"],
    description: "Infantry polearm; longer and heavier than a spear.",
  },
  {
    id: "halberd",
    name: "Halberd",
    damage: 8,
    weight: 3,
    traitIds: [
      "two-handed",
      "extra-long",
      "multi-headed",
      "flourishing",
      "extra-long",
      "barbed-hooked",
    ],
    description:
      "Polearm combining an axe-head, a spike, and a hook. The axe-head can floursh, the spike is extra-long, and the hook is hooking!",
  },
  {
    id: "warhammer",
    name: "Warhammer",
    damage: 6,
    weight: 3,
    traitIds: [
      "two-handed",
      "extra-long",
      "multi-headed",
      "crushing",
      "extra-long",
      "barbed-hooked",
    ],
    description:
      "Polearm combining a hammer-head, a spike and a hook. The Hammer-head can crush, the spike is extra long, and the book is hooking!",
  },
  {
    id: "lance",
    name: "Lance",
    damage: 6,
    weight: 3,
    traitIds: ["two-handed", "cavalry-weapon", "extra-long"],
    description: "Long cavalry charging weapon, devastating on horseback.",
  },
  {
    id: "harpoon",
    name: "Harpoon",
    damage: 6,
    weight: 2,
    traitIds: ["one-handed", "throwable", "barbed-hooked"],
    description: "Throwing harpoon, mostly meant to fight sea creatures.",
  },

  // ── Bludgeons ──────────────────────────────────────────────────────────
  {
    id: "trench-club",
    name: "Trench Club",
    damage: 4,
    weight: 1,
    traitIds: ["one-handed", "crushing"],
    description: "Improvised spiked club fashioned in the trenches.",
  },
  {
    id: "mace",
    name: "Mace",
    damage: 6,
    weight: 2,
    traitIds: ["one-handed", "crushing"],
    description: "Flanged bludgeoning weapon.",
  },
  {
    id: "military-pickaxe",
    name: "Military Pickaxe",
    damage: 6,
    weight: 3,
    traitIds: ["one-handed", "crushing", "breaching"],
    description:
      "A military pickaxe is precisely as its name suggests, it focuses all the damage on a single point! It is a bit heavier to accomodate that.",
  },

  // ── Axes ───────────────────────────────────────────────────────────────
  {
    id: "hand-axe",
    name: "Hand Axe",
    damage: 4,
    weight: 1,
    traitIds: ["one-handed", "path-clearer"],
    description: "Short-handled axe for chopping.",
  },
  {
    id: "throwing-axe",
    name: "Throwing Axe",
    damage: 4,
    weight: 1,
    traitIds: ["one-handed", "throwable", "path-clearer"],
    description: "Balanced axe optimised for throwing.",
  },
  {
    id: "long axe",
    name: "long axe",
    damage: 6,
    weight: 2,
    traitIds: ["bastard-weapon", "path-clearer"],
    description: "Large axe that can be wielded one- or two-handed.",
  },

  // ── Flexible / Reach ───────────────────────────────────────────────────
  {
    id: "whip",
    name: "Whip",
    damage: 4,
    weight: 1,
    traitIds: ["one-handed", "barbed-hooked"],
    description: "Leather lash that entangles as it strikes.",
  },
  {
    id: "flail",
    name: "Flail",
    damage: 6,
    weight: 4,
    traitIds: ["one-handed", "crushing", "barbed-hooked"],
    description: "Spiked iron ball on a chain that entangles as it strikes.",
  },

  // ── Shields ────────────────────────────────────────────────────────────
  {
    id: "buckler-shield",
    name: "Buckler shield",
    damage: 1,
    weight: 1,
    traitIds: ["one-handed", "buckler-shield"],
    description: "Tiny shield that helps defending you in melee.",
  },
  {
    id: "shield",
    name: "Shield",
    damage: 1,
    weight: 2,
    traitIds: ["one-handed", "shield"],
    description:
      "A moderately sized shield, among the most common types used during medieval times. Kite, round, square, there's many kinds.",
  },
  {
    id: "board-shield",
    name: "Board shield",
    damage: 1,
    weight: 3,
    traitIds: ["two-handed", "board-shield"],
    description:
      "A massive board shield, when placed on the ground, it reaches all the way to your chin.",
  },
];

export const MELEE_WEAPONS_BY_ID = new Map(
  MELEE_WEAPONS.map((w) => [w.id, w]),
);
