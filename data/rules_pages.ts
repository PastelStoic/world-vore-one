export interface RulesPageMeta {
  href: string;
  title: string;
  description: string;
}

/** Wiki rule pages, in reading order. */
export const RULES_PAGES: readonly RulesPageMeta[] = [
  {
    href: "/wiki/rules/core",
    title: "Core Rules",
    description:
      "Dice, checks, turns, stats, points, perks, helping, and what counts as an action.",
  },
  {
    href: "/wiki/rules/health",
    title: "Health & Encumbrance",
    description:
      "HP, incapacitation, critical condition, rest, exhaustion, and carrying weight.",
  },
  {
    href: "/wiki/rules/progression",
    title: "Progression",
    description:
      "How characters earn points, and how NPCs are created and scored.",
  },
  {
    href: "/wiki/rules/vore",
    title: "Vore & Pregnancy",
    description:
      "Vore stats, swallowing, digestion, escape, capacity, and pregnancy.",
  },
  {
    href: "/wiki/rules/combat",
    title: "Combat",
    description:
      "Attacks, cover, movement, stealth, traps, grappling, armor, and related combat rules.",
  },
  {
    href: "/wiki/rules/vehicles",
    title: "Vehicles",
    description:
      "Ground vehicles, crew roles, fighting in and against vehicles, airplanes, and ships.",
  },
];
