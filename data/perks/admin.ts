import type { PerkDefinition } from "@/data/perks.ts";

export const ADMIN_PERKS: PerkDefinition[] = [
  {
    id: "progenitors-protection",
    name: "Under the protection of the Progenitor of Vampires",
    category: "gimmick",
    adminOnly: true,
    isFree: true,
    description: `You find yourself under the protection of someone special ...

*"When you need me most, I will be there."
*Only applies on scenes after the one it was given in.`,
  },
  {
    id: "munsterfraun-drake",
    name: "Munsterfraun (DRAKES)",
    category: "pf-type",
    adminOnly: true,
    includesPerks: [
      "brawler",
      "runner",
      "heavy",
      "unreal-capacity",
      "hauling-meat",
    ],
    maxCharactersPerAccount: 1,
    overridesRaceName: [
      { oldName: "Pilzfraun", newName: "Munsterfraun" },
      { oldName: "Pilzherr", newName: "Munsterherr" },
      { oldName: "Tierfraun", newName: "Munsterfraun" },
      { oldName: "Tierherr", newName: "Munsterherr" },
    ],
    description:
      `You are a monster, not meant to be roaming this earth yet. Filthy creature!
      
*You must be at least 7 feet tall, up to 15, and have several clear Drake characteristics: Scaly body, claws, tail, etc.
*Anyone can tell you are a monster based on your characteristics, and are terrified! You always draw attention wherever you go.
*You cannot be a template. Only one drake per player. You're a freak that escaped containment - you're rare!

*+2 strength, +1 constitution.
*Have the Brawler perk from combat perks.
*Have the Runner perk from combat perks.
*Have the Heavy perk from vore perks.
*Have the Unreal Capacity perk from vore perks.
*Have the Hauling Meat perk from vore perks.

*You have claws and a powerful jaw/bite, which count as makeshift weapons and deal +1 damage than standard makeshift weapons.
*Cover is always one tier lower, allies cannot protect you with their perks, such as Defender. You're just too big!
*You cannot get damage transference perks, such as Veteran or Prey-as-armour. You're too big for them to be of any help!
*You cannot use firearms. Equipment has to be custom-tailored for you and costs 3 times as much.
*All damage sources deal -2 damage to you due to your thick scales! Unarmed combat deals no damage if reduced to 0.`,
    modifiers: {
      baseStatBonuses: { strength: 2, constitution: 1 },
    },
  },
];
