import type { PerkDefinition } from "../perks.ts";

export const FACTION_PERKS: PerkDefinition[] = [
  {
    id: "king-s-royal-army-pf",
    name: "King's royal army",
    category: "faction",
    requiredFaction: "King's Royal Army",
    isFree: true,
    pointsGranted: 3,
    customInput: "Chosen gear perk (e.g. Scrounger, Sapper, Inventor…)",
    description: `Switzerland strong!

Advantages:
*This perk is free.
*Start with an additional 3 points.
*Better gear: You are the best, so you get the best. Pick any perk that reasonably comes from having good gear: Scrounger, Sapper, Inventor, etc.

Disadvantages:
*Only one per player.
*Must be Swiss-born.
*Must be part of the King's Royal Army in #factions
*If you are a PF, give two points to a PF that digests you, instead of one.
*You are a target: You may be abducted for very nasty experimentation purposes.`,
  },
  {
    id: "sturmtruppen",
    name: "Sturmtruppen",
    category: "faction",
    requiredFaction: "German Imperial Army", "The 7th Western Army", "German East African Army", "German West African Army",
    pointsGranted: 2,
    customInput: "Chosen gear perk (e.g. Scrounger, Sapper, Inventor…)",
    description: `Germany strong!

Advantages:
*Start with an additional 2 points compared to normal PFs.
*Pick any perk that reasonably comes from having good gear: Scrounger, Sapper, Inventor, etc.
*Cheaper restricted GERMAN weapons.

Disadvantages:
*Only three per player.
*Must be German-born.
*Must be part of any German subfaction(s).
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.
*Extra edgy.`,
  },
  {
    id: "british-trench-raider",
    name: "British Trench raider",
    category: "faction",
    requiredFaction: "British Expeditionary Force (BEF)", "Canadian Expeditionary Force (CEF)", "Royal Berkshire Regiment",
    pointsGranted: 2,
    customInput: "Chosen gear perk (e.g. Scrounger, Sapper, Inventor…)",
    description: `ENGERLAAAANNDDD

Advantages:
*Start with an additional 2 points compared to normal PFs.
*Pick any perk that reasonably comes from having good gear: Scrounger, Sapper, Inventor, etc.
*Cheaper restricted AMERICAN weapons.

Disadvantages:
*Only three per player.
*Must be British.
*Must be part of any British subfaction(s)
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.
*British.`,
  },
  {
    id: "harlem-hellfighter",
    name: "Harlem Hellfighter",
    category: "faction",
    requiredFaction:   "Harlem Hellfighters",
    pointsGranted: 2,
    customInput: "Chosen gear perk (e.g. Scrounger, Sapper, Inventor…)",
    description: `America strong!
 
Advantages:
*Start with an additional 2 points compared to normal PFs.
*Pick any perk that reasonably comes from having good gear: Scrounger, Sapper, Inventor, etc.
*Cheaper restricted AMERICAN weapons.

Disadvantages:
*Only three per player.
*Must be American.
*Must be part of the 'Harlem Hellfighters' subfaction.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.`,
  },
  {
    id: "capo",
    name: "Capo",
    category: "faction",
    requiredFaction: "Italian mafia - Las Manos Apertas", "Russian mafia - Chernoye Zoloto","Irish mafia - O’Malley Syndicate",
    isFree: true,
    pointsGranted: 3,
    description:
      `You are an underboss of your respective mafia, owning some sort of safehouse/business within New Orleans!

Advantages:
*This perk is free.
*You have an extra 3 points.
*You have an extra 2 perks.
*You have the 'allies' perk for free. You have goon underlings who do your bidding.
*You have the 'patron' perk for free. Your boss supports you.
*You have a safehouse that also happens to be a business - a source of (illegal) income.

Disadvantages:

*Only one per player.
*No 'free range' perk.
*You are a target. Killing you off will greatly weaken your Mafia.
*You must be a baseliner. You can make a new Capo if this one dies.
*You do not betray your family no matter what.
*Crimes can be linked back to you if you're not careful! Your goons should do the work, not you!
*Must be in America and be part of one of three mafias.`,
  },
];
