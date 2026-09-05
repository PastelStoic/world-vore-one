import type {
  AttachmentDefinition,
  FreeAccessoryDefinition,
} from "./equipment_types.ts";

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
    id: "mg08-magazine",
    name: "MG08 box magazine",
    weight: 3,
    ammo: 250,
    description:
      "A box magazine for the MG08. Choose how many to bring at scene start.",
  },
  {
    id: "mg08/15-magazine",
    name: "MG08/15 drum magazine",
    weight: 1,
    ammo: 100,
    description:
      "A drum magazine for the MG08/15. Choose how many to bring at scene start.",
  },
  {
    id: "browning-m1917-magazine",
    name: "Browning M1917 box magazine",
    weight: 3,
    ammo: 250,
    description:
      "A box magazine for the Browning M1917. Choose how many to bring at scene start.",
  },
  {
    id: "maxim-m1910-magazine",
    name: "Maxim M1910 magazine",
    weight: 3,
    ammo: 250,
    description:
      "A box magazine for the Maxim M1910. Choose how many to bring at scene start.",
  },
  {
    id: "vickers-magazine",
    name: "Vickers magazine",
    weight: 3,
    ammo: 250,
    description:
      "A box magazine for the Vickers machinegun. Choose how many to bring at scene start.",
  },
  {
    id: "schwarzlose-m07/12-magazine",
    name: "Schwarzlose M.07/12 magazine",
    weight: 3,
    ammo: 250,
    description:
      "A box magazine for the Schwarzlose. Choose how many to bring at scene start.",
  },
  {
    id: "fiat-revelli-modello-1914",
    name: "Fiat revelli modello 1914",
    weight: 3,
    ammo: 250,
    description:
      "A box magazine for the Fiat Revelli. Choose how many to bring at scene start.",
  },
  {
    id: "mg11-magazine",
    name: "MG11 box magazine",
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
  {
    id: "fuel-canister",
    name: "Fuel Canister",
    weight: 1,
    ammo: 10,
    description:
      "A canister full of fuel for a flamethrower. Very dangerous! Handle with care!.",
  },
];

export const FREE_ACCESSORIES_BY_ID = new Map(
  FREE_ACCESSORIES.map((a) => [a.id, a]),
);

/** Same magazines as attachments so reload/charge UI shares one catalog. */
export const MAGAZINE_ATTACHMENTS: AttachmentDefinition[] = FREE_ACCESSORIES
  .map((accessory) => ({
    id: accessory.id,
    name: accessory.name,
    appliesTo: "Weapon magazines",
    nation: "Any" as const,
    weight: accessory.weight,
    description: accessory.description,
    isCharge: true,
    isFree: true,
    ammoOverride: accessory.ammo,
  }));
