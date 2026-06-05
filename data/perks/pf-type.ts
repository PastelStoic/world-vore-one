import type { PerkDefinition } from "@/data/perks.ts";

export const PF_TYPE_PERKS: PerkDefinition[] = [
  {
    id: "pilzherr-standard",
    name: "Pilzherr (STANDARD)",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Tierherr"],
    lockCategory: "pilzherr-type",
    isFree: true,
    description: `You are a MALE PF! Not a futa, you've no pussy nor womb.

*Free perk: This perk is free, we just want this on your sheet so others are aware of what this entails.
*One of the biggest advantages of PFs is the fact that they reproduce so quickly. 
*By nature of wanting to shaft just about anything, attacking their reproductive capabilities is a valid strategy.
*This is where you come in: Whenever you orgasm inside a PF - pregnancy is not required - that PF can only birth Pilzherrs from there on out.
*The Pilzherrs she births do not share any of her skills or memories; they're worthless to her. 
*You are capable of vore all the same as a regular PF.`,
  },
  {
    id: "pilzherr-femboy",
    name: "Pilzherr (FEMBOY)",
    category: "pf-type",
    canDisguise: true,
    requiredRaces: ["Pilzherr", "Tierherr"],
    lockCategory: "pilzherr-type",
    description: `You are a MALE PF! You look just like a girl though.

*Variant of the 'Pilzherr' perk. This one is not free. YOU DO NOT NEED THIS PERK TO BE A FEMBOY. It exists only for secrecy stuffs. Read below.
*One of the biggest advantages of PFs is the fact that they reproduce so quickly. 
*By nature of wanting to shaft just about anything, attacking their reproductive capabilities is a valid strategy.
*This is where you come in: Whenever you orgasm inside a PF - pregnancy is not required - that PF can only birth Pilzherrs from there on out.
*The Pilzherrs she births do not share any of her skills or memories; they're worthless to her. 
*You are capable of vore all the same as a regular PF.

*By taking 'Femboy', list a fake perk instead. You do not need this perk to be a femboy, this perk merely lets you pass as a girl instead.
*The point of this perk is secrecy, be careful not to reveal it. This should help you impregnate PFs without being spotted!
*If you cum inside a PF, inform their owner in DMs that you were a femboy and tell them not to tell anyone else that you are a femboy.`,
  },
  {
    id: "pilzherr-neandertal",
    name: "Pilzherr (NEANDERTAL)",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Tierherr"],
    lockCategory: "pilzherr-type",
    description:
      `You are a MALE PF! You look very manly, unmistakeable as a man!

*Variant of the 'Pilzherr' perk. This one is not free.
*One of the biggest advantages of PFs is the fact that they reproduce so quickly. 
*By nature of wanting to shaft just about anything, attacking their reproductive capabilities is a valid strategy.
*This is where you come in: Whenever you orgasm inside a PF - pregnancy is not required - that PF can only birth Pilzherrs from there on out.
*The Pilzherrs she births do not share any of her skills or memories; they're worthless to her. 
*You are capable of vore all the same as a regular PF.

*You're not very attractive.
*Gain +2 strenght and +2 constitution, but your intelligence and carisma are capped to 1. 
*You're dumb and you speak with your muscles, not your words. Ooga booga.`,
    modifiers: {
      baseStatBonuses: { constitution: 2, strength: 2 },
    },
  },
  {
    id: "speisfraun",
    name: "Speisfraun",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `You are a PF birthed for the sole purpose of feeding yourself to others. Your body's fatty in all the right places! 

*You burn calories very slowly, semdomly needing to eat anything at all. One meal per week is enough.
*You are built to transform inedible things something edible (yourself.) 
*You can eat anything organic, from actual food, into things such as grass and hay, as well as rotting food!
*Such things do not taste good.
*Because of your nature, you are worth four X [CONSTITUTION] times as much nutrition towards whoever eats you.`,
  },
  {
    id: "twins",
    name: "Twins",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description: `You have a perfect twin! 

*When a pair ( or more ) PFs are birthed and are twins, they gain a special ability: 
*Twins can communicate with one another from any range, as well as share mental images/thoughts and read one anothers'. 
*You may or not be templates - but both must be OR not be templates.
*You MUST either make the other twin, or have someone play them for you.
*Both characters must own the perk.`,
  },
  {
    id: "tiny",
    name: "Tiny",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `Through some abysmal fuckery, you are born extremely tiny - no more than four inches tall at most.

*You are considered to have values of 1 in Strenght, Dex and Constitution when dealing with someone normal sized.
*Any investments into those stats only apply when dealing with other equally sized beings.
*You only have 1 weight yourself, instead of the typical 3.
*You may only carry a single 1 weight item on your person. You cannot operate firearms.
*You can pass through extremely tiny openings. You cannot lift anything normal sized other than that single 1 weight item of choice.
*You have a permanent 6d6 cover, and gain +6d6 strength to avoid being melee'd, as you are too tiny to hit! Does NOT apply to grapple checks!
*You gain +4d6 to hide and sneak around, thanks to your tiny size!
*You cannot escape the stomachs or grips of someone normal sized no matter how much you try.
*You are extremely stretchy, You can take dick without issue, and you can eat ONE normal-sized person at all. You are immobile if you eat someone normal sized.
*If you do manage to eat someone normal-sized, they are incapable of escaping you due to the sheer tightness.
*Regular rules apply in regards to things similarly sized to yourself. 
*You are capable of impregnating and being impregnated. You give no points when digested by someone normal sized.`,
  },
  {
    id: "tierfraun-canine",
    name: "Tierfraun (CANINE)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    customInput: "Good boy or bad boy?",
    includesPerks: ["runner"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 charisma, +1 intelligence, -3 stat points.
*Can track your targets through smell and hearing - they cannot hide from you unless they can mask their scent.
*You have the runner perk from Combat perks.
*Pick one:
->You are a 'good boy' ( +3 charisma to entertain/enthrall someone ).
->You are a 'bad boy' ( +3 charisma to intimidate/scare someone ).`,
    modifiers: {
      baseStatBonuses: { charisma: 2, intelligence: 1 },
    },
  },
  {
    id: "tierfraun-felines-vulpines",
    name: "Tierfraun (FELINES, VULPINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    includesPerks: ["runner"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 dexterity, +1 intelligence, -3 stat points.
*Have the 'runner' perk from Combat perks.
*Have climbing claws: You can climb vertical surfaces provided they aren't completely smooth. Your feet must be exposed for this.
*Enemies always fall prey to your ambushes, and you always succeed in stealth, unless a perk would prevent this.`,
    modifiers: {
      baseStatBonuses: { dexterity: 2, intelligence: 1 },
    },
  },
  {
    id: "tierfraun-bovines",
    name: "Tierfraun (BOVINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    includesPerks: ["milky", "heavy", "unreal-capacity", "speisfraun"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 constitution, +1 strength, -3 stat point.
*Have the Milky perk from Smut perks.
*Have the Heavy perk from Vore perks.
*Have the Unreal Capacity perk from Vore perks.
*Have the Speisfraun perk from PF perks.
*You have four stomachs. Every two escape attempt fails, your prey slides into the deeper one.
*Your organ capacity is not increased by the four stomachs, your skin can only stretch so far!
*A escape success makes them climb back up a stomach and resets the fail counter. 
*Prey must climb back into the first stomach to escape.`,
    modifiers: {
      baseStatBonuses: { constitution: 2, strength: 1 },
    },
  },
  {
    id: "tierfraun-caprinae",
    name: "Tierfraun (CAPRINAE)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    includesPerks: ["inescapable", "heavy", "brawler"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 Strength, +1 Constitution, -3 stat points
*You have the Heavy perk from Vore perks
*You have the Inescapable perk from Vore perks
*You have the Brawler perk from Combat perks
*Your horns and hooves count as makeshift weapons, and when attacking someone who has drawn your attention like with the baiter or defender perk, you deal an additional +1 damage on a hit
*You have four stomachs. Every two escape attempt fails, your prey slides into the deeper one.
*Your organ capacity is not increased by the four stomachs, your skin can only stretch so far!
*A escape success makes them climb back up a stomach and resets the fail counter.
*Prey must climb back into the first stomach to escape.
*Your prey have +3d6 to their escape rolls`,
    modifiers: {
      baseStatBonuses: { constitution: 1, strength: 2 },
    },
  },
  {
    id: "tierfraun-centaurs-cervines",
    name: "Tierfraun (CENTAURS, CERVINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    includesPerks: ["hauling-meat"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 strength, +1 constitution, -3 stat points.
*Your weight capacity is 3x that of a normal person.
*You have the 'Hauling-meat' perk from Vore Perks.
*You have an upgraded version of the Runner perk, allowing you to move 3 distances per turn. You cannot get the regular runner perk.
*Someone can mount you, either piggyback or upon your back if you are a centaur. They will move alongside you.`,
    modifiers: {
      baseStatBonuses: { strength: 2, constitution: 1 },
      carryCapacityMultiplier: 3,
    },
  },
  {
    id: "tierfraun-sealife",
    name: "Tierfraun (SEALIFE)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+1 strength, +1 dexterity, +1 constitution, -3 stat points.
*While submerged entirely in water: +4d6 strength and dexterity.  You have 4d6 cover when in the water, due to being hard to hit.
*While submerged entirely in water, you may move up to two distances per turn.
*You can hold your breath indefinitely and you can open your eyes in salt water. 
*You can withstand the temperatures and pressure of the seas up to a kilometer deep
*You can cover long distances in the water. You can cross the english channel, the mediterranean, and other such bodies.
*You cannot cross whole oceans.`,
    modifiers: {
      baseStatBonuses: { strength: 1, dexterity: 1, constitution: 1 },
    },
  },
  {
    id: "tierfraun-avian",
    name: "Tierfraun (AVIAN)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 dexterity, +1 charisma, -3 stat points.
*You have wings and can fly. It takes one action to go from the ground and into the sky, and vice-versa. You cannot fly if encumbered.
*While flying and engaging with something that is grounded: Have +4d6 strength. 
*While flying and engaging something in the air: +4d6 strength and dexterity.
*You may optionally drop from the sky onto someone, foregoing the need for a grapple in order to vore them.
*Failing to vore them, or falling from the sky due to any other reason, deals a flat 4 damage to you.
*You have 4d6 cover when in the air, due to being hard to hit.
*While flying, you may move up to two distances per turn. Does not stack with Runner.
*You have a beak and/or talons, which serve as a tier 1 ( makeshift ) weapon.`,
    modifiers: {
      baseStatBonuses: { dexterity: 2, charisma: 1 },
    },
  },
  {
    id: "tierfraun-lizards",
    name: "Tierfraun (LIZARDS)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    excludesPerks: ["defender", "baiter", "runner"],
    includesPerks: ["tough", "heavy"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+3 constitution, -3 stat point.
*You have thick scales that protect you! Every attack deals -1 damage, unarmed combat deals no damage if reduced to 0.
*You have the Tough perk from Combat perks.
*You have the Heavy perk from Vore Perks.
*You are always last in initiative, regardless of any modifiers.
*You may not get the following perks: Defender, Baiter and Runner.`,
    modifiers: {
      baseStatBonuses: { constitution: 3 },
    },
  },
  {
    id: "tierfraun-hefties",
    name: "Tierfraun (HEFTIES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    includesPerks: ["tough", "authoritarian"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics

*+2 Constitution, +1 strength, -3 stat points.
*You have the Tough perk from Combat Perks.
*You have the 'Authoritarian' perk from Gimmick perks.
*You have -1 charisma in situations where you aren't being intimidating.
*You always immobilize your predator, even if they have the 'hauling-meat' perk. Does not apply if they're a hefty too.
*Double your pred's penalties from being immobilized.
*You should taller and bulkier than average - you're huge!
*You can handle weapons that require bipods without issues. Ignore the penalty from not being set up.
*You can use two-handed weapons, melee or ranged, with one hand.`,
    modifiers: {
      baseStatBonuses: { constitution: 2, strength: 1 },
    },
  },
  {
    id: "tierfraun-leporines",
    name: "Tierfraun (LEPORINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    includesPerks: ["danger-sense", "runner", "survivor"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristic.

*+2 dexterity, +3 escape training, -3 stat points | This is intentional, yes.
*Have the Danger Sense perk from Combat perks.
*Have the Runner perk from Combat perks.
*Have the Survivor perk from Vore perks.
*Can dig a foxhole or a Burrow for yourself, provided the ground is soft. Takes 1 action, and hide inside it immediately when dug.
->Foxhole: It is considered medium cover (4d6).
->Burrow: You cannot shoot or be shot at. Enemies must enter the burrow in order to melee you.
*Takes 1 turn to go inside or outside of your groundworks.`,
    modifiers: {
      baseStatBonuses: { dexterity: 2, escapeTraining: 3 },
    },
  },
  {
    id: "tierfraun-lamias",
    name: "Tierfraun (LAMIAS)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    excludesPerks: ["open-ended-tail"],
    includesPerks: ["natural-predator"],
    pointsGranted: -3,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristic.

*+3 strength, -3 stat points.
*Have the 'Natural Predator' perk.
*Have two stomachs, one being your human half's, the other being your snake tail.
*Your tail has 3x the capacity of your stomach, and scales accordingly.
->For your first stomach: Once prey fails two escape attempts, they slide into your next stomach.
->Prey inside the tail stomach must roll twice when trying to escape, always taking the set with the fewer successes. 
->Should they succeed, they crawl back into the first stomach, but can be sent back into the tail if they fail another escape attempt.
*Jungle and swampy terrain does not affect you - you can climb trees and move around freely.`,
    modifiers: {
      baseStatBonuses: { strength: 3 },
      grantsOrgans: ["tail"],
      organCapacityMultipliers: { tail: 3 },
    },
  },
  {
    id: "tierfraun-custom",
    name: "Tierfraun (CUSTOM)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    customInput: "Your animal type, chosen perks, and custom gimmick",
    pointsGranted: -3,
    freePerks: 2,
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristic.
*Gain 2 perks of your choosing.
*Can come up with a gimmick for your respective animal, which will be reviewned and balanced by staff.
*If none of the options above fit what you're going for, choose this one!`,
  },
  {
    id: "munsterfraun-pixie",
    name: "Munsterfraun (PIXIE)",
    category: "pf-type",
    maxCharactersPerAccount: 1,
    pointsGranted: -3,
    includesPerks: ["tiny","baiter","secretes-gold"],
    overridesRaceName: [
      { oldName: "Pilzfraun", newName: "Munsterfraun" },
      { oldName: "Pilzherr", newName: "Munsterherr" },
      { oldName: "Tierfraun", newName: "Munsterfraun" },
      { oldName: "Tierherr", newName: "Munsterherr" },
    ],
    description:
      `You are a pixie, a kind of tiny fairy that's very mischevious - you're very valuable!

*+1 dexterity, +2 constitution, -3 stat points.
*Have the 'Tiny' and the 'Baiter' perks.
*Have the unique "Secretes gold" perk.
*Must have been born after May 1st, 1923.
*You cannot be a template. Only one per player.
*You must be between 1-4 inches in height.
*You have wings and can fly. It takes one action to go from the ground and into the sky, and vice-versa. You cannot fly if encumbered.
*Falling from the sky due to any reason deals a flat 4 damage to you.
*While flying, you may move up to two distances per turn.

*You are a mischevious creature, and your body works off of adrenaline and dopamine. Not getting your hit will result in your body slowly shutting down, until you die.
*You must do something ballsy every scene, such as pranking someone, getting into fights, or just overall being a nuisance. Baiter helps with this greatly!
*You are an overall asshole, go make someone's life miserable for a day.
*You can go [CONSTITUTION] scenes without getting your dose of adrenaline and dopamine.
*You die if you do not manage to fulfill that condition.`,
    modifiers: {
      baseStatBonuses: { dexterity: 1, constitution: 2 },
      },
    },
  {
    id: "secretes-gold",
    name: "Secretes gold",
    category: "pf-type",
    requiredPerkIds: ["munsterfraun-pixie"],
    selectionOnly: true,
    description: `You produce gold naturally! But this also makes you have a golden glow to you ... You are very valuable.

*When trying to hide or sneak around, you must roll twice, taking the worst roll.
*If you're trying to hide in the dark, or while it is dark, instead roll thrice and take the worst roll. You're shiny!
*Your body naturally secretes tiny particles of gold dust. At the end of every scene, you gain +2 points from trading this gold away.
*Alternatively, give part of, or the entirety of your gold away to someone else, awarding them the +1/+2 points.
*Careful! If they capture you, every scene *they* finish will award them a point, as they're farming your gold!
*You cannot be captured by another character you own - no giving yourself extra points for no reason!`,
  },
  {
    id: "munsterfraun-vampyr",
    name: "Munsterfraun (VAMPYR)",
    category: "pf-type",
    maxCharactersPerAccount: 1,
    pointsGranted: -3,
    includesPerks: ["j-eger","partial-invisibility","vampyric-transformation"],
    overridesRaceName: [
      { oldName: "Pilzfraun", newName: "Munsterfraun" },
      { oldName: "Pilzherr", newName: "Munsterherr" },
      { oldName: "Tierfraun", newName: "Munsterfraun" },
      { oldName: "Tierherr", newName: "Munsterherr" },
    ],
    description:
      `You are a vampyr, the creature from legends! You hate the sun, and it hates you.

-3 stat points.
*Have the 'Jäeger' perk.
*Have the unique "Partial invisibility" and "vampyric transformation" perks.
*Cannot get the 'beastmaster' perk.
*Must have been born after May 1st, 1923.
*You cannot be a template. Only one per player.
*You must have red eyes and be deathly pale.
*You are infertile, and cannot reproduce the normal way.

*The sun hurts your sensitive skin. All of your stats are halved, rounded down, the moment you are exposed to sunlight. 
*You take 1 damage for every hour spent in the sun. This damage cannot be mitigated and it will kill you.
*Your perks do not work whilst exposed to the sun - this includes vore perks. Your metabolism is not at all adapted to sunlight!
*You have a strict hierarchy tree, with implicit authority. You must obey any Vampyr older than yourself, so long as the request isn't suicidal.
*Due to *how* Vampyrs came to be, you have a set of codes you must follow. You cannot break them under any circunstances:
->"Pacts made in blood cannot be broken."
->"You cannot harm innocents."
->"You may not forcefully turn others into Vampyrs."
->"You must obey your elder Vampyrs."
->"You may not harm a fellow Vampyr."

*You may cut your body and that of another's, sharing blood. This is a 'blood pact'. You can feel the emotions of those you have shared blood with, and know their location and when they are in danger. You may cut this connection at will.
*You have fangs, which work as makeshift weapons, and can drain enemies of their blood.`,
    },
  {
    id: "partial-invisibility",
    name: "Partial invisibility",
    category: "pf-type",
    requiredPerkIds: ["munsterfraun-vampyr"],
    selectionOnly: true,
    description: `Your body makes a special pheromone that tricks the human brain into thinking you're not even there.

*The pheromone is produced at will. You can secrete it whenever, but it takes a 1 minute, or three turns, whichever is faster, to take effect.
*In darkness, you are invisible to non-vampyrs. They can only track you through smell or hearing. Anyone trying to find you through smell always succeeds.
*In light, you stil create a shadow. Targets must roll their intelligence twice, taking the worst roll, when trying to spot you.
*Your pheromones can get caught on thick pieces of cloth, allowing them to be 'invisible' for a maximum of 10 minutes, or 20 turns, whichever is faster.
*Those hiding under your cloth must be entirely covered by it, otherwise, there'd be bits of them sticking out in mid air.
*Your cloth is *not* see through, and neither are you. The brain is simply tricked into thinking there is nothing there. Targets will see complete darkness if they can see nothing else but you and/or your cloth.
*Animals are afraid of you due to this pheromone, and immediately go into fight or flight! You cannot get the beastmaster perk because of this.`,
  },
  {
    id: "vampyric-transformation",
    name: "Vampyric transformation",
    category: "pf-type",
    requiredPerkIds: ["munsterfraun-vampyr"],
    selectionOnly: true,
    customInput: "Number of ghouls currently",
    description: `You can turn non-vampyrs into creatures for your personal use.

*Rather than leading it to your stomach, your fangs may suck blood, modify it, then pump it back upon your target, slowly transforming them into:

-> A 'ghoul', an unthinking, emotionless and tough creature, which obeys all of your commands. They attack with their claws, which are makeshift weapons. Must keep your fangs attached to them for 1 day. 
*They lose all of their perks, which are converted into points, as well as their charisma and intelligence, which are locked to 1 and always fail. The points are then reinvested solely into strength and constitution.
*You may add one free Ghoul to your sheet per in real life month since character creation. They have 3 strength and 4 constitution.

-> Turn them into a fellow Vampyr. Must keep your fangs attached to them for 1 week. You are exhausted and weak after this; all of your stats are locked to 1 for a full real life week. You can only make another vampyr after a month.
*They gain the Vampyr perk and become your offspring.`,
  },
];
