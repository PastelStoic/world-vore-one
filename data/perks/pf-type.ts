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
*This is where you come in: Whenever you impregnate a PF, that PF can only birth Pilzherrs from there on out.
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

*Variant of the 'Pilzherr' perk. This one is not free.
*One of the biggest advantages of PFs is the fact that they reproduce so quickly. 
*By nature of wanting to shaft just about anything, attacking their reproductive capabilities is a valid strategy.
*This is where you come in: Whenever you impregnate a PF, that PF can only birth Pilzherrs from there on out.
*The Pilzherrs she births do not share any of her skills or memories; they're worthless to her. 
*You are capable of vore all the same as a regular PF.

*By taking 'Femboy', list a fake perk instead. Tell staff in DMs when taking this perk, so we'll keep track of it. 
*The point of this perk is secrecy, be careful not to reveal it. 
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
*This is where you come in: Whenever you impregnate a PF, that PF can only birth Pilzherrs from there on out.
*The Pilzherrs she births do not share any of her skills or memories; they're worthless to her. 
*You are capable of vore all the same as a regular PF.

*You're not very attractive.
*Gain +2 strenght and +2 constitution, but your intelligence and carisma are capped to 1. 
*You're dumb and you speak with your muscles, not your words. Ooga booga.`,
  },
  {
    id: "speisfraun",
    name: "Speisfraun",
    category: "pf-type",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description:
      `You are a PF birthed for the sole purpose of feeding yourself to others. Your body's fatty in all the right places! 

*You burn calories very slowly, semdomly needing to eat anything at all. One meal per week is enough.
*You are built to transform inedible things something edible (yourself.) 
*You can eat anything organic, from actual food, into things such as grass and hay, as well as rotting food!
*Such things do not taste good.
*Because of your nature, you are worth four X [CONSTITUTION] times as much nutrition towards whoever eats you. 
*our strength and dexterity are capped to 1. You're not meant for fighting and you don't put on a lot of muscle - you are nutrition!`,
    modifiers: {
      statCaps: { strength: 1, dexterity: 1 },
    },
  },
  {
    id: "twins",
    name: "Twins",
    category: "pf-type",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You have a perfect twin! 

*When a pair ( or more ) PFs are birthed and are twins, they gain a special ability: 
*Twins can communicate with one another from any range, as well as share mental images/thoughts and read one anothers'. 
*You may or not be templates - but both must be OR not be templates.
*You MUST either make the other twin, or have someone play them for you.`,
  },
  {
    id: "tiny",
    name: "Tiny",
    category: "pf-type",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description:
      `Through some abysmal fuckery, you are born extremely tiny - no more than four inches tall at most.

*You are considered to have values of 1 in Strenght, Dex and Constitution when dealing with someone normal sized. 
*Any investments into those stats only apply when dealing with other equally sized beings.
*You can pass through extremely tiny openings. You cannot lift anything normal sized. 
*You cannot escape the stomachs or grips of someone normal sized no matter how much you try.
*You are extremely stretchy, You can take testicles without issue, and you can eat ONE normal-sized person at all. 
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
  },
  {
    id: "tierfraun-felines-vulpines",
    name: "Tierfraun (FELINES, VULPINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 dexterity, +1 intelligence, -3 stat points.
*Have the 'runner' perk from Combat perks.
*Have climbing claws: You can climb vertical surfaces provided they aren't completely smooth. Your feet must be exposed for this.
*Enemies always fall prey to your ambushes, and you always succeed in stealth, unless a perk would prevent this.`,
  },
  {
    id: "tierfraun-bovines",
    name: "Tierfraun (BOVINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 constitution, +1 strength, -3 stat point.
*Have the Milky perk from Smut perks.
*Have the Heavy perk from Vore perks.
*Have the Unreal Capacity perk from Vore perks.
*Have the 'Spesifraun' perk from PF perks, with one exception: Your stats are not at all limited by this perk.
*You have four stomachs. Every two escape attempt fails, your prey slides into the deeper one.
*Your organ capacity is not increased by the four stomachs, your skin can only stretch so far!
*A escape success makes them climb back up a stomach and resets the fail counter. 
*Prey must climb back into the first stomach to escape.`,
  },
  {
    id: "tierfraun-centaurs-cervines",
    name: "Tierfraun (CENTAURS, CERVINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 strength, +1 constitution, -3 stat points.
*Your weight capacity is 3x that of a normal person.
*You have the 'Hauling-meat' perk from Vore Perks.
*In combat, you may move up to 3 distances in a single turn.
*Someone can mount you, either piggyback or upon your back if you are a centaur. They will move alongside you.`,
  },
  {
    id: "tierfraun-sealife",
    name: "Tierfraun (SEALIFE)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
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
  },
  {
    id: "tierfraun-avian",
    name: "Tierfraun (AVIAN)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 dexterity, +1 charisma, -3 stat points.
*You have wings and can fly. It takes one action to go from the ground and into the sky, and vice-versa.
*While flying and engaging with something that is grounded: Have +4d6 strength. 
*While flying and engaging something in the air: +4d6 strength and dexterity.
*You have 4d6 cover when in the air, due to being hard to hit.
*While flying, you may move up to two distances per turn.
*You have a beak and/or talons, which serve as a tier 1 ( makeshift ) weapon.`,
  },
  {
    id: "tierfraun-lizards",
    name: "Tierfraun (LIZARDS)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    excludesPerks: ["defender", "baiter", "runner"],
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+3 constitution, -3 stat point.
*You have thick scales that protect you! Every attack deals -1 damage, unarmed attacks deal no damage.
*You have the Tough perk from Combat perks.
*You have the Heavy perk from Vore Perks.
*You are always last in initiative, regardless of any modifiers.
*You may not get the following perks: Defender, Baiter and Runner.`,
  },
  {
    id: "tierfraun-hefties",
    name: "Tierfraun (HEFTIES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
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
*You can handle weapons that require bipods without issues. Ignore the penalty from not being set up.`,
  },
  {
    id: "tierfraun-leporines",
    name: "Tierfraun (LEPORINES)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
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
  },
  {
    id: "tierfraun-lamias",
    name: "Tierfraun (LAMIAS)",
    category: "pf-type",
    requiredRaces: ["Tierfraun", "Tierherr"],
    lockCategory: "tierfraun-type",
    excludesPerks: ["open-ended-tail", "open-ended-tail-mouthless"],
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
    description:
      `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristic.
*Gain 2 perks of your choosing.
*Can come up with a gimmick for your respective animal, which will be reviewned and balanced by staff.
*If none of the options above fit what you're going for, choose this one!`,
  },
];
