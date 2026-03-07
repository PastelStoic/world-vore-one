import type { FreeAccessoryDefinition } from "./equipment_types.ts";

// ---------------------------------------------------------------------------
// Free accessories (magazines that come with a weapon, declared at scene start)
// ---------------------------------------------------------------------------

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
    id: "mg11-magazine",
    name: "MG11 drum magazine",
    weight: 3,
    ammo: 250,
    description:
      "A box magazine for the MG11. Choose how many to bring at scene start.",
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
