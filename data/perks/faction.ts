import type { PerkDefinition } from "@/data/perks.ts";

export const FACTION_PERKS: PerkDefinition[] = [
  {
    id: "king-s-royal-army-pf",
    name: "King's royal army",
    category: "faction",
    requiredFaction: "SWITZERLAND - King's Royal Army",
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
    requiredFaction: ["GERMANY - German Imperial Army", "GERMANY - The 7th Western Army", "GERMANY - German East African Army", "GERMANY - German West African Army",],
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
    requiredFaction: ["BRITAIN - British Expeditionary Force (BEF)", "BRITAIN - Canadian Expeditionary Force (CEF)", "BRITAIN - Royal Berkshire Regiment"],
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
    requiredFaction: ["AMERICA - Harlem Hellfighters"],
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
    requiredFaction: ["AMERICA - 'Las Manos Apertas' Mafia", "AMERICA - 'Chernoye Zoloto' Mafia","AMERICA - 'O’Malley Syndicate' Mafia"],
    isFree: true,
    pointsGranted: 3,
    description:
      `You are an underboss of your respective mafia, owning some sort of safehouse/business within New Orleans!

Advantages:
*This perk is free.
*You have an extra 3 points.
*You have an extra 2 perks.
*You have the ‘allies’ perk for free. You have goon underlings who do your bidding.
*You have the ‘patron’ perk for free. Your boss supports you.
*You have a safehouse that also happens to be a business - a source of (illegal) income.

Disadvantages:

*Only one per player.
*No ‘free range’ perk.
*You are a target. Killing you off will greatly weaken your Mafia.
*You must be a baseliner. You can make a new Capo if this one dies.
*You do not betray your family no matter what.
*Crimes can be linked back to you if you’re not careful! Your goons should do the work, not you!
*Must be in America and be part of one of three mafias.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TEMPLATE: How to add a new faction perk
  // ─────────────────────────────────────────────────────────────────────────
  // Copy the block below, remove the leading //   and fill in the fields.
  //
  // {
  //   id: "my-faction-perk",          // Unique kebab-case ID (no spaces)
  //   name: "My Faction Name",        // Display name
  //   category: "faction",
  //
  //   // ── Who can take this perk ──────────────────────────────────────────
  //   // Single faction:
  //   requiredFaction: "The 7th Western Army",
  //   // OR multiple factions (any one of them qualifies):
  //   requiredFaction: ["German Imperial Army", "German East African Army"],
  //
  //   // ── Cost ────────────────────────────────────────────────────────────
  //   isFree: true,                   // true = perk costs 0 points to take
  //
  //   // ── Bonuses ─────────────────────────────────────────────────────────
  //   // Give the player extra stat points (positive = more points):
  //   pointsGranted: 2,
  //
  //   // Automatically include specific perks (no extra cost to the player).
  //   // Use the perk IDs from data/perks/ (e.g. "runner", "tough", "gunner"):
  //   includesPerks: ["runner", "gunner"],
  //
  //   // Give the player a free equipment item:
  //   grantsEquipment: [
  //     { equipmentId: "entrenching-gear", weightOverride: 0, isBulkyOverride: false },
  //   ],
  //
  //   // Give the player a free melee weapon:
  //   grantsMeleeWeapons: [
  //     { meleeWeaponId: "bayonet" },
  //   ],
  //
  //   // Give the player a free choice among perks — use customInput for text description
  //   // of what they should pick (shown in the editor as a text field).
  //   // OR use selectablePerkIds (once that feature is added) for a dropdown:
  //   customInput: "Chosen gear perk (e.g. Scrounger, Sapper, Inventor…)",
  //
  //   // ── Stat modifiers ──────────────────────────────────────────────────
  //   modifiers: {
  //     baseStatBonuses: { strength: 1, dexterity: 1 }, // Add to base stats
  //     healthMultiplier: 2,                            // Double HP
  //     organCapacityMultiplier: 3,                     // Triple organ capacity
  //   },
  //
  //   description: `Write your perk description here.
  //
  // Advantages:
  // *Advantage one.
  // *Advantage two.
  //
  // Disadvantages:
  // *Disadvantage one.`,
  // },
];
