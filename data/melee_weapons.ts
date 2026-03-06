// ---------------------------------------------------------------------------
// DATA – Premade Melee Weapons
// ---------------------------------------------------------------------------

import type { MeleeWeaponTemplate } from "./equipment_types.ts";

export const MELEE_WEAPONS: MeleeWeaponTemplate[] = [
  // ── Blades ─────────────────────────────────────────────────────────────
  {
    id: "dagger",
    name: "Dagger",
    damage: 1,
    weight: 0,
    traitIds: ["one-handed", "rapid-shanking", "concealable"],
    description: "Short double-edged blade. Can easily be hidden underneath clothing. Arguably one of humanity's oldest weapons.",
  },
  {
    id: "throwing-dagger",
    name: "Throwing Dagger",
    damage: 1,
    weight: 0,
    traitIds: ["one-handed", "throwable", "concealable"],
    description: "A small throwing dagger, not as good for shanking someone with as a regularly sized dagger, but remarkably accurate on the throw.",
  },
  {
    id: "combat-knife",
    name: "Combat Knife",
    damage: 2,
    weight: 1,
    traitIds: ["one-handed", "rapid-shanking"],
    description: "Standard military fighting knife. More of a tool than a combat weapon, but it works in a pinch.",
  },
  {
    id: "throwing-knife",
    name: "Throwing Knife",
    damage: 2,
    weight: 1,
    traitIds: ["one-handed", "throwable"],
    description: "Light, balanced blade optimised for throwing.",
  },
  {
    id: "machete",
    name: "Machete",
    damage: 2,
    weight: 1,
    traitIds: ["one-handed", "path-clearer"],
    description: "A machete, sports a heavy inward-curved blade. Excellent for clearing the way on jungles.",
  },
  {
    id: "sabre",
    name: "Sabre",
    damage: 3,
    weight: 1,
    traitIds: ["one-handed"],
    description: "A modern, curved sabre. Made light and sharp for infantry usage.",
  },
  {
    id: "rapier",
    name: "Rapier",
    damage: 3,
    weight: 2,
    traitIds: [ "one-handed", "duelling"],
    description: "Long, thin thrusting sword favoured by duelists.",
  },
  {
    id: "parrying-dagger",
    name: "Parrying dagger",
    damage: 2,
    weight: 1,
    traitIds: ["one-handed", "parrying"],
    description: "A short dagger meant to assist a duellist's main weapon.",
  },
  {
    id: "broadsword",
    name: "Broadsword",
    damage: 3,
    weight: 2,
    traitIds: ["bastard-weapon"],
    description: "Heavy blade that can be wielded with either hand.",
  },
  {
    id: "greatsword",
    name: "Greatsword",
    damage: 3,
    weight: 3,
    traitIds: ["two-handed", "flourishing"],
    description: "Massive, oversized blade, meant for wide swings.",
  },

  // ── Polearms ───────────────────────────────────────────────────────────
  {
    id: "spear",
    name: "Spear",
    damage: 3,
    weight: 2,
    traitIds: ["two-handed", "extra-long", "braceable"],
    description: "Long-shafted thrusting weapon.",
  },
  {
    id: "pike",
    name: "Pike",
    damage: 3,
    weight: 3,
    traitIds: ["two-handed", "ridiculously long", "braceable"],
    description: "Infantry polearm; longer and heavier than a spear.",
  },
  {
    id: "halberd",
    name: "Halberd",
    damage: 4,
    weight: 3,
    traitIds: ["two-handed", "extra-long", "multi-headed"],
    description: "Polearm combining an axe-head, a spike, and a hook.",
  },
  {
    id: "lance",
    name: "Lance",
    damage: 5,
    weight: 3,
    traitIds: ["cavalry-weapon", "extra-long", "two-handed"],
    description: "Long cavalry charging weapon, devastating on horseback.",
  },

  // ── Bludgeons ──────────────────────────────────────────────────────────
  {
    id: "trench-club",
    name: "Trench Club",
    damage: 3,
    weight: 1,
    traitIds: ["crushing", "one-handed"],
    description: "Improvised spiked club fashioned in the trenches.",
  },
  {
    id: "mace",
    name: "Mace",
    damage: 3,
    weight: 2,
    traitIds: ["crushing", "one-handed"],
    description: "Flanged bludgeoning weapon.",
  },
  {
    id: "warhammer",
    name: "War Hammer",
    damage: 4,
    weight: 3,
    traitIds: ["crushing", "two-handed"],
    description: "Heavy hammer built to cave in armour.",
  },
  {
    id: "flail",
    name: "Flail",
    damage: 3,
    weight: 2,
    traitIds: ["crushing", "barbed-hooked", "one-handed"],
    description: "Spiked iron ball on a chain that entangles as it strikes.",
  },
  {
    id: "entrenching-tool",
    name: "Entrenching Tool",
    damage: 2,
    weight: 1,
    traitIds: ["one-handed"],
    description: "Military folding shovel pressed into service as a weapon.",
  },

  // ── Axes ───────────────────────────────────────────────────────────────
  {
    id: "hand-axe",
    name: "Hand Axe",
    damage: 3,
    weight: 1,
    traitIds: ["one-handed"],
    description: "Short-handled axe for chopping.",
  },
  {
    id: "throwing-axe",
    name: "Throwing Axe",
    damage: 2,
    weight: 1,
    traitIds: ["throwable", "one-handed"],
    description: "Balanced axe optimised for throwing.",
  },
  {
    id: "battle-axe",
    name: "Battle Axe",
    damage: 4,
    weight: 2,
    traitIds: ["bastard-weapon"],
    description: "Large axe that can be wielded one- or two-handed.",
  },

  // ── Flexible / Reach ───────────────────────────────────────────────────
  {
    id: "whip",
    name: "Whip",
    damage: 2,
    weight: 1,
    traitIds: ["barbed-hooked", "one-handed"],
    description: "Leather lash that entangles as it strikes.",
  },

  // ── Shields ────────────────────────────────────────────────────────────
  {
    id: "shield",
    name: "Shield",
    damage: 1,
    weight: 2,
    traitIds: ["one-handed"],
    description: "Defensive buckler; usable as a makeshift strike.",
  },
];

export const MELEE_WEAPONS_BY_ID = new Map(
  MELEE_WEAPONS.map((w) => [w.id, w]),
);
