import type { PerkDefinition } from "@/data/perks.ts";

export const FACTION_PERKS: PerkDefinition[] = [
  {
    id: "pilzfraun-artificer",
    name: "Pilzfraun Artificer",
    category: "faction",
    requiredFaction: "SWITZERLAND - King's Royal Artificers",
    selectionOnly: true,
    description:
      `You have uncovered secrets that few are able to ever peer into. It will take a long time to learn them properly, though.

  *For any transformation, you may pay the entirety of the cost, the target may do it, or both may contribute towards it.
  *You can turn Baseliners into Pilzfrauns for 3 points.
  *You can turn Pilzfrauns into Templates for 1 point.
  *You can turn Pilzfrauns into Tierfrauns for 3 points.
  *A baseliner must be turned into a Pilzfraun before being turned into a Tierfraun or Template, requiring two/three separate operations.
  *To perform any of these transformations, you must roll your intelligence - you need 2 successes.
  *On 0 successes, the target is killed outright.
  *On 1 success, the target survives and gains the 'crippling health condition' perk, applied to constitution, and they gain no points from the perk.
  *If you attempt to turn that surviving target into a PF or its variants once more, their PF will have the crippling health condition and still not get any points from it.
  *Whether you get 0 or 1 successes will kill the target if they've survived your procedure once.`,
  },
  {
    id: "king-s-royal-army-pf",
    name: "King's royal army",
    category: "faction",
    requiredFaction: "SWITZERLAND - King's Royal Army",
    maxCharactersPerAccount: 1,
    isFree: true,
    pointsGranted: 3,
    selectablePerkIds: [
      "sapper",
      "scrounger",
      "signature-weapon",
      "defender",
      "weapon-master",
      "melee-fighter",
      "gunner",
      "runner",
      "effective-cover-use",
      "veteran",
    ],
    description: `You are a commended, loyal soldier of your beloved king.

Advantages:
*Free perk, start with an additional 3 points, and gain 1 free perk from a selection of perks.
*Cheaper restricted SWISS weapons.

Disadvantages:
*One per player, must be Swiss-born, must be part of the 'King's royal army' faction.
*If you are a PF, give two points to a PF that digests you, instead of one.
*You are a target: You may be abducted for very nasty experimentation purposes.`,
  },
  {
    id: "sturmtruppen",
    name: "Sturmtruppen",
    category: "faction",
    maxCharactersPerAccount: 3,
    requiredFaction: [
      "GERMANY - German Imperial Army",
      "GERMANY - The 7th Western Army",
      "GERMANY - German East African Army",
      "GERMANY - German West African Army",
    ],
    pointsGranted: 2,
    selectablePerkIds: [
      "sapper",
      "scrounger",
      "signature-weapon",
      "defender",
      "weapon-master",
      "melee-fighter",
      "gunner",
      "runner",
      "effective-cover-use",
      "veteran",
    ],
    description: `You are an elite Stormtrooper of the German Empire!

Advantages:
*Start with an additional 2 points, and gain 1 free perk from a selection of perks.
*Cheaper restricted GERMAN weapons.

Disadvantages:
*Three per player, must be German-born.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.`,
  },
  {
    id: "british-trench-raider",
    name: "British Trench Raider",
    category: "faction",
    maxCharactersPerAccount: 3,
    requiredFaction: [
      "BRITAIN - British Expeditionary Force (BEF)",
      "BRITAIN - Canadian Expeditionary Force (CEF)",
      "BRITAIN - Royal Berkshire Regiment",
    ],
    pointsGranted: 2,
    selectablePerkIds: [
      "sapper",
      "scrounger",
      "signature-weapon",
      "defender",
      "weapon-master",
      "melee-fighter",
      "gunner",
      "runner",
      "effective-cover-use",
      "veteran",
    ],
    description: `ENGERLAAAANNDDD

Advantages:
*Start with an additional 2 points, and gain 1 free perk from a selection of perks.
*Cheaper restricted *AMERICAN* weapons.

Disadvantages:
*Three per player. Must be from the British empire.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.`,
  },
  {
    id: "french-foreign-legion",
    name: "French Foreign Legionnaire",
    category: "faction",
    requiredFaction: ["FRANCE - French Foreign Legion"],
    maxCharactersPerAccount: 3,
    pointsGranted: 2,
    selectablePerkIds: [
      "sapper",
      "scrounger",
      "signature-weapon",
      "defender",
      "weapon-master",
      "melee-fighter",
      "gunner",
      "runner",
      "effective-cover-use",
      "veteran",
    ],
    description: `You are a member of the French Foreign Legion!

Advantages:
*Start with an additional 2 points, and gain 1 free perk from a selection of perks.
*Cheaper restricted FRENCH weapons.

Disadvantages:
*Three per player.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.`,
  },
  {
    id: "chasseurs-alpins",
    name: "Chasseur Alpin",
    category: "faction",
    requiredFaction: "FRANCE - Chasseurs Alpins",
    maxCharactersPerAccount: 1,
    isFree: true,
    pointsGranted: 3,
    selectablePerkIds: [
      "sapper",
      "scrounger",
      "signature-weapon",
      "defender",
      "weapon-master",
      "melee-fighter",
      "gunner",
      "runner",
      "effective-cover-use",
      "veteran",
    ],
    description: `You are a tough French mountaineer

Advantages:
*Free perk, start with an additional 3 points, and gain 1 free perk from a selection of perks.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.

Disadvantages:
*One per player, must be French-born, must be part of the Chasseurs Alpins faction.`,
  },
  {
    id: "harlem-hellfighter",
    name: "Harlem Hellfighter",
    category: "faction",
    requiredFaction: ["AMERICA - Harlem Hellfighters"],
    maxCharactersPerAccount: 3,
    pointsGranted: 2,
    selectablePerkIds: [
      "sapper",
      "scrounger",
      "signature-weapon",
      "defender",
      "weapon-master",
      "melee-fighter",
      "gunner",
      "runner",
      "effective-cover-use",
      "veteran",
    ],
    description: `You are a soldier from a legendary American regiment
 
Advantages:
*Start with an additional 2 points, and gain 1 free perk from a selection of perks.
*Cheaper restricted AMERICAN weapons.

Disadvantages:
*Three per player. Must be American-born.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.`,
  },
  {
    id: "italian-veteran",
    name: "Italian Veteran",
    category: "faction",
    requiredFaction: [
      "ITALY - Italian Army In Exile",
      "ITALY - Royal italian army remnants - The Arditi",
      "ITALY - Standing Italian Army",
    ],
    maxCharactersPerAccount: 3,
    pointsGranted: 2,
    selectablePerkIds: [
      "sapper",
      "scrounger",
      "signature-weapon",
      "defender",
      "weapon-master",
      "melee-fighter",
      "gunner",
      "runner",
      "effective-cover-use",
      "veteran",
    ],
    description: `You are a veteran of the Italian forces, regardless of side.
 
Advantages:
*Start with an additional 2 points, and gain 1 free perk from a selection of perks.
*Cheaper restricted ITALIAN weapons.

Disadvantages:
*Three per player. Must be Italian.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.`,
  },
  {
    id: "arditi",
    name: "Arditi",
    category: "faction",
    requiredFaction: "ITALY - Royal italian army remnants - The Arditi",
    maxCharactersPerAccount: 1,
    isFree: true,
    pointsGranted: 2,
    grantsEquipment: [
      { equipmentId: "arditi-armor" },
    ],
    description:
      `You are an Arditi! Endlessly fanatical for Italy, you will fight until you can't anymore.

Advantages:
*Free perk, start with an additional 2 points. Gain a special 'arditi armor' gear, only available for this faction.

Disadvantages:
*One per player. Must be Italian-born, must be part of the 'Royal italian army remnants - The Arditi' faction.`,
  },
  {
    id: "capo",
    name: "Capo",
    category: "faction",
    maxCharactersPerAccount: 1,
    requiredFaction: [
      "AMERICA - 'Las Manos Apertas' Mafia",
      "AMERICA - 'Chernoye Zoloto' Mafia",
      "AMERICA - 'O’Malley Syndicate' Mafia",
    ],
    isFree: true,
    pointsGranted: 3,
    freePerks: 2,
    includesPerks: ["allies", "patron"],
    excludesPerks: ["free-range"],
    description:
      `You are an underboss of your respective mafia, owning some sort of safehouse/business within New Orleans!

Advantages:
*Free perk, start with an additional 3 points, and an extra 2 perks.
*Gain the 'allies' perk ( your goons ) and the 'patron' perk ( your boss ).
*You have a safehouse that also happens to be a business - a source of (illegal) income.
*You can make a new Capo if this one dies.

Disadvantages:

*One per player. Must be a baseliner. You cannot betray your mafia ever. Must be in America and be part of any Mafia faction.
*You are a target. Killing you off will greatly weaken your Mafia. Crimes can be linked back to you - be careful!
*You may not acquire the 'free-range' perk.`,
  },
  {
    id: "champion-retainer",
    name: "Champion's retainer",
    category: "faction",
    customInput: "Office held by your character.",
    requiredFaction: [
      "JAPAN - Miscellaneous Japanese Clans",
    ],
    maxCharactersPerAccount: 2,
    isFree: true,
    pointsGranted: 4,
    description:
      `You are a retainer of a Champion. This means you serve their every wish to the best of your ability. Goddess needs her retainers!

Advantages:
*Free perk, start with an additional 4 points. Hold some office within your clan, a stable and respectable position of power.
*You may be snacked on by your champion.

Disadvantages:
*Two per player. You must be a retainer to a champion, and the champion's player must accept you as their retainer. You cannot make a retainer for your own champion.
*You must obey your champion. You are supposidely loyal to them, and may not betray them unless you have a justificative. 
*Unlike your champion, you do not hold nearly as much authority. You are not above the law, unless doing your champion's bidding.
*You may be snacked on by your champion`,
  },
  {
    id: "japanese-kami-champion",
    name: "Japanese Kami-Champion",
    category: "faction",
    requiredRaces: ["Tierfraun","Tierherr"],
    overridesRaceName: [
      { oldName: "Tierfraun", newName: "Kronprinz Tierfraun" },
      { oldName: "Tierherr", newName: "Kronprinz Tierherr" },
    ],
    requiresTemplate: true,
    customInput: "Number of daughters at character creation",
    requiredFaction: [
      "JAPAN - Miscellaneous Japanese Clans",
    ],
    maxCharactersPerAccount: 1,
    isFree: true,
    pointsGranted: 15,
    excludesPerks: ["free-range"],
    selectablePerkIds: [
      "japanese-kami-champion-war-strength",
      "japanese-kami-champion-war-dexterity",
      "japanese-kami-champion-war-constitution",
      "japanese-kami-champion-arts-dexterity",
      "japanese-kami-champion-arts-intelligence",
      "japanese-kami-champion-carousing",
    ],
    selectablePerksCount: 1,
    description:
      `You are the incarnation of Japanese deities, the 'Yokai'. A god or goddess, a 'Kami', and a champion of your clan.

*Incredibly complex perk for newcomers, requires a lot of setting knowledge. Don't pick this if you don't know what you're doing.

Advantages:
*Free perk, start with 20 points instead of the default. Youo may be up to 15 feet tall.
*The general Japanese populous worships you; Most will do your bidding even if it costs them their lives.
*When you digest a pilzfraun, add all of her points and perks to your sheet, so long as the perk is a type of skill. ( Wouldn't apply to allies, sig weapon, and similar perks. )
*When you die from non-digestion causes, your memories and consciousness overwrite your oldest daughter and you live on.
*Gain one special 'Kami' aspect of your choosing.

Disadvantages:
*One per player. You may create another if yours dies. Must have the 'Tierfraun' perk; cannot have the 'Free-range' perk.
*2 points are automatically assigned to each main stat (STR, DEX, CON, INT, CHA).
*Keep a separate sheet for your daughters. They use normal PF rules, and must share your Tierfraun type. Choose your initial number at creation, additional daughters require RP and follow pregnancy rules.
*A hunter may ambush your daughters. Your champion and the hunter make a contested INT vs INT check. The hunter gets +1 success per 2 daughters. Roll-offs may only be called one per week.
*If you are digested, your consciousness remains in your predator until they die by means other than digestion.
*If a daughter is digested, roll 1d[total daughters] to determine her inheritance position, then record daughter #X as digested.
*If you die and the next daughter in inheritance line has been digested, you inhabit the fat of the predator who ate her.`,
  },
  {
    id: "japanese-kami-champion-war-strength",
    name: "Kami of War (Strength)",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { strength: 3 },
    },
    grantsEquipment: [
      { equipmentId: "dreadnoughts-armor" },
    ],
    description: `You are a warlike Kami-Champion who leads by personal might.

*+3 Strength. You have an entire army at your disposal, numbering 3 full divisions, ready to fight, kill and die in your name.
*You have a set of 'Dreadnought' armour, which has 'light' armor, as if it were a vehicle.
*It is tailored for you specifically. Nobody else can wear it.`,
  },
  {
    id: "japanese-kami-champion-war-dexterity",
    name: "Kami of War (Dexterity)",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { dexterity: 3 },
    },
    grantsEquipment: [
      { equipmentId: "dreadnoughts-armor" },
    ],
    description:
      `You are a warlike Kami-Champion who leads through martial precision.

*+3 Dexterity. You have an entire army at your disposal, numbering 3 full divisions, ready to fight, kill and die in your name.
*You have a set of 'Dreadnought' armour, which has 'light' armor, as if it were a vehicle.
*It is tailored for you specifically. Nobody else can wear it.`,
  },
  {
    id: "japanese-kami-champion-war-constitution",
    name: "Kami of War (Constitution)",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { constitution: 3 },
    },
    grantsEquipment: [
      { equipmentId: "dreadnoughts-armor" },
    ],
    description:
      `You are a warlike Kami-Champion whose body shrugs off punishment.

*+3 Constitution. You have an entire army at your disposal, numbering 3 full divisions, ready to fight, kill and die in your name.
*You have a set of 'Dreadnought' armour, which has 'light' armor, as if it were a vehicle.
*It is tailored for you specifically. Nobody else can wear it.`,
  },
  {
    id: "japanese-kami-champion-arts-dexterity",
    name: "Kami of the Arts (Dexterity)",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { dexterity: 3 },
    },
    description:
      `You are a patron Kami whose mastery expresses itself through practiced grace.

*+3 Dexterity. Your knowledge of the arts is without precedent. You are uncontestable in matters of history, arts, culture and religion, and automatically succeed in such checks.
*You may ask the current GM for advice and answers in order to help you IRP, receiving advice you otherwise wouldn't get. Basically 'ask god for assistance'.
*You own an important artistic or religious tool.`,
  },
  {
    id: "japanese-kami-champion-arts-intelligence",
    name: "Kami of the Arts (Intelligence)",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { intelligence: 3 },
    },
    description:
      `You are a patron Kami whose mastery is rooted in scholarship and taste.

*+3 Intelligence. Your knowledge of the arts is without precedent. You are uncontestable in matters of history, arts, culture and religion, and automatically succeed in such checks.
*You may ask the current GM for advice and answers in order to help you IRP, receiving advice you otherwise wouldn't get. Basically 'ask god for assistance'.
*You own an important artistic or religious tool.`,
  },
  {
    id: "japanese-kami-champion-carousing",
    name: "Kami of Carousing",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { charisma: 3 },
    },
    description: `You are a convivial, politically dangerous Kami-Champion.

*+3 Charisma. Your very presence demands respect. You rank higher even amongst other goddesses, mostly due to your connections.
*You may order the execution of any whom disrespect you, and all Japanese present must oblidge, except for player characters.
*It is much easier to form alliances and to convince others to do your bidding, automatically succeeding in such checks.`,
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
