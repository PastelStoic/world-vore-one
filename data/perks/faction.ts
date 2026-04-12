import type { PerkDefinition } from "@/data/perks.ts";

export const FACTION_PERKS: PerkDefinition[] = [
  {
    id: "pilzfraun-artificer",
    name: "Pilzfraun Artificer",
    category: "faction",
    requiredFaction: "SWITZERLAND - King's Royal Artificers",
    selectionOnly: true,
    description: `You have uncovered secrets that few are able to ever peer into. It will take a long time to learn them properly, though.
    
  *You can turn Baseliners into Pilzfrauns. It costs 3 points to do so. You may pay for it yourself, or the target may do so. You both may contribute towards it too, if preferred.
  *You can turn Pilzfrauns into Templates. It costs 1 point to do so, same deal as above.
  *You can turn Pilzfrauns into Tierfrauns. It costs 3 points to do so, same deal as above.
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
*This perk is free.
*Start with an additional 3 points.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.

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
*Start with an additional 2 points compared to normal PFs.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.
*Cheaper restricted GERMAN weapons.

Disadvantages:
*Only three per player.
*Must be German-born.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.
*Extra edgy.`,
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
*Start with an additional 2 points compared to normal PFs.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.
*Cheaper restricted AMERICAN weapons.

Disadvantages:
*Only three per player.
*Must be British.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.
*British.`,
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
*Start with an additional 2 points compared to normal PFs.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.
*Cheaper restricted FRENCH weapons.

Disadvantages:
*Only three per player.
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
*This perk is free.
*Start with an additional 3 points.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.

Disadvantages:
*Only one per player.
*Must be French-born.
*Must be part of the Chasseurs Alpins in #factions`,
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
*Start with an additional 2 points compared to normal PFs.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.
*Cheaper restricted AMERICAN weapons.

Disadvantages:
*Only three per player.
*Must be American.
*Less vore: Efficiency is expected. When fighting, kill your enemy, don't waste time.`,
  },
  {
    id: "italian-veteran",
    name: "Italian Veteran",
    category: "faction",
    requiredFaction: ["ITALY - Italian Army In Exile","ITALY - Royal italian army remnants - The Arditi","ITALY - Standing Italian Army"],
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
    description: `You are a veteran of the Italian forces.
 
Advantages:
*Start with an additional 2 points compared to normal PFs.
*Better gear & training: You are the best and you get the best. Pick from a selection of provided perks.
*Cheaper restricted ITALIAN weapons.

Disadvantages:
*Only three per player.
*Must be Italian
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
      { equipmentId: "arditi-armor" },],
    description: `You are an Arditi! Endlessly fanatical for Italy, you will fight until you can't anymore.

Advantages:
*This perk is free.
*Start with an additional 2 points.
*Gain a special 'arditi armor' gear, only available for this faction.

Disadvantages:
*Only one per player.
*Must be Italian-born
*Must be part of the 'Royal italian army remnants - The Arditi' faction in #factions`,
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
*You have four additional points.
*You hold some sort of office within your clan. Perhaps you manage the treasury, perhaps commerce, perhaps housing. Your employiment is stable and respectable.
If a Human, you are not endlessly loyal. You may betray your Champion if you have a good justificative.
Like your champion, you have a very high standard of living.
You may be snacked on by your champion.

Disadvantages:
*Two per player at maximum.
*A champion must accept you as their retainer - ask other roleplayers if you can become their retainers. You cannot make a retainer for your own champion.
*You must obey your champion. You are supposidely loyal to them, and may not betray them unless you have a justificative. 
*If you are a PF, you are endlessly loyal no matter what.
*Unlike your champion, you do not hold nearly as much authority. You are not above the law, unless doing your champion's bidding.
*You must serve a purpose for your champion. If you are useless, you'd be removed from office.
*You may be snacked on by your champion`,
  },
  {
    id: "japanese-kami-champion",
    name: "Japanese Kami-Champion",
    category: "faction",
    requiredRaces: ["Tierfraun"],
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
*Must be KPF. In current sheet terms this is enforced as a Japanese faction-aligned Tierfraun template.
*This perk is free.
*Your sheet starts with 20 points instead of the typical 5.
*The general Japanese populous worships you to no end. Most will do your bidding even if it costs them their lives.
*You may be up to 15 feet tall. You don't have to be; you can be normal-sized if preferred.
*When digesting a Pilzfraun, you acquire all of her points and perks so long as the perk is a type of skill. Allies, Patron, Signature Weapon and similar perks are not absorbed.
*When you die from non-digestion causes, your memories and consciousness overwrite your oldest daughter and you live on.
*Choose one Lady aspect below.

Disadvantages:
*Only one per player. You may make another if yours dies.
*You must purchase the tierfraun perk.
*No 'free range' perk.
*You must make a second sheet for your daughters. They follow normal PF sheet rules, but must share your tierfraun type. They must purchase the tierfraun perk.
*At character creation, choose how many daughters you have. You can only make more daughters if you roleplay it out.
*When starting a scene, roll 1d100. If the roll is less than or equal to your number of daughters, your partner may choose to ambush one of your daughters in this scene or any future scene.
*If you are digested, your consciousness remains in the body of your predator until your predator dies from non-digestion.
*If one of your daughters is digested, roll 1d[number of daughters]. This determines which daughter she is in line of inheritance; note down that daughter number X has been digested.
*If you die and the next daughter in line of inheritance has been digested, you will inhabit the fat in the body of the predator who ate her.
*You must have at least 3 points in Strength, Dexterity, Constitution, Intelligence and Charisma.`,
  },
  {
    id: "japanese-kami-champion-war-strength",
    name: "Lady of War (Strength)",
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

*+3 Strength.
*You have a set of 'Dreadnought' armour, making you immune to small arms fire and melee weapons. Explosions, anti-tank weapons and similar threats still present a very real danger.
*It is tailored for you specifically. Nobody else can wear it.
*You are a tank, in person.
*Pick this for a stronger individual character.`,
  },
  {
    id: "japanese-kami-champion-war-dexterity",
    name: "Lady of War (Dexterity)",
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

*+3 Dexterity.
*You have a set of 'Dreadnought' armour, making you immune to small arms fire and melee weapons. Explosions, anti-tank weapons and similar threats still present a very real danger.
*It is tailored for you specifically. Nobody else can wear it.
*You are a tank, in person.
*Pick this for a stronger individual character.`,
  },
  {
    id: "japanese-kami-champion-war-constitution",
    name: "Lady of War (Constitution)",
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

*+3 Constitution.
*You have a set of 'Dreadnought' armour, making you immune to small arms fire and melee weapons. Explosions, anti-tank weapons and similar threats still present a very real danger.
*It is tailored for you specifically. Nobody else can wear it.
*You are a tank, in person.
*Pick this for a stronger individual character.`,
  },
  {
    id: "japanese-kami-champion-arts-dexterity",
    name: "Lady of the Arts (Dexterity)",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { dexterity: 3 },
    },
    description:
      `You are a patron Kami whose mastery expresses itself through practiced grace.

*+3 Dexterity.
*Your knowledge of the arts is without precedent. You are uncontestable in matters of history, arts, culture and religion.
*You may ask the current GM for advice and answers in order to help you IRP, receiving advice you otherwise wouldn't get. Basically 'ask god for assistance'.
*Many seek your wisdom, and your opinions are held in high regard.
*You own an important artistic or religious tool.`,
  },
  {
    id: "japanese-kami-champion-arts-intelligence",
    name: "Lady of the Arts (Intelligence)",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { intelligence: 3 },
    },
    description:
      `You are a patron Kami whose mastery is rooted in scholarship and taste.

*+3 Intelligence.
*Your knowledge of the arts is without precedent. You are uncontestable in matters of history, arts, culture and religion.
*You may ask the current GM for advice and answers in order to help you IRP, receiving advice you otherwise wouldn't get. Basically 'ask god for assistance'.
*Many seek your wisdom, and your opinions are held in high regard.
*You own an important artistic or religious tool.`,
  },
  {
    id: "japanese-kami-champion-carousing",
    name: "Lady of Carousing",
    category: "faction",
    requiredPerkIds: ["japanese-kami-champion"],
    lockCategory: "japanese-kami-champion-aspect",
    selectionOnly: true,
    modifiers: {
      baseStatBonuses: { charisma: 3 },
    },
    description: `You are a convivial, politically dangerous Kami-Champion.

*+3 Charisma.
*Your very presence demands respect.
*You rank higher even amongst other goddesses, mostly due to your connections.
*It is much easier to form alliances and convince others to do your bidding.
*You may enlist help from foreign nations much more easily than others.
*Pick this to be the ultimate politician.`,
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
