import type { PerkDefinition } from "@/data/perks.ts";

export const NEGATIVE_PERKS: PerkDefinition[] = [
  {
    id: "rival",
    name: "Rival",
    category: "negative",
    isFree: true,
    variablePointsGranted: { min: 1, max: 6 },
    customInput: "Rival description",
    description:
      `You became someone's worst enemy, and they hate you with a burning passion.

*Another player must make your rival's sheet. Both characters must own the perk, and earn the same amount of points from it.
*Pick how many points you wish to gain, from 1 to 6. Whenever you start a scene, roll a 1d6, and if your roll is below the picked number, your rival appears.
*Your rival, at character creation, must have as many points as you do and be reasonably capable of competing against you in your role! 

*As a rival, you're meant to be as disruptive as possible and attempt to ruin your rival's scene to the best of your ability.
*Mess their plans up, prevent them from eating/being eaten depending on their role, get the police involved to ruin their life, etc!
*This perk is intentionally disruptive. Don't pick it if you don't want a scene or two ruined, or if you're unwilling to do it yourself.`,
  },
  {
    id: "extremely-inefficient-digestion",
    name: "Extremely inefficient digestion",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    modifiers: {
      statCaps: { digestionStrength: -4 },
    },
    description:
      `Your metabolism is extremely slow - and it just doesn't work as well as others.

*Free perk, grants 4 points, for PFs & variants only. You may not get the 'tough' and 'living furnace' perks.
*If your prey's dice pool to escape is <3/4ths (round down) of your dice pool to keep them in, they cannot attempt to escape.

*Digestion strength is automatically and permanently set to -4. Regardless of digestion strength, prey takes 4 times as long to be digested and absorbed.
*Natural and perk-based healing takes 8x longer. You may not get instant healing from perks/items.
*Digestion lasts multiple scenes; your prey takes days/weeks to digest. You must do 1 scene for every 20 digestion turns.
*If you go out in public, roll a 1d6. On a 4 or below, someone takes note and calls the proper authorities. 
*If someone has the M.R.E perk, usual digestion rules apply instead.`,
  },
  {
    id: "m-r-e",
    name: "M.R.E",
    category: "negative",
    isFree: true,
    pointsGranted: 2,
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `Your purpose is being eaten by others, so much so that your body has been made to digest extremely easily.

*Free perk, grants 2 points, for PFs & variants only. You must purchase the Speisfraun perk, with all of its disadvantages.

*Your digestion resilience becomes a moot stat, you digest nearly instantly. You may not make escape attempts.
*It takes 3 turns to digest you - you are absorbed immediately afterwards. It takes no more than 5 minutes to digest and absorb you.
*If your predator has Extremely slow metabolism, ignore this perk entirely, regular rules apply instead.`,
  },
  {
    id: "crippling-addiction",
    name: "Crippling addiction",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    refundable: true,
    customInput: "Subject of your addiction",
    description:
      `You have an addiction so absolutely crippling that you cannot go without it.

*Free perk, grants 4 points. May be refunded at any time by paying back the 4 granted points.

*Until you take your hit in a scene, your highest stat of: STR, DEX, CONS, INT, CHAR, is lowered to 1. Priority is in that order. Your other stats are halved, rounded down, until you take your hit.
*Your high lasts 10 turns/1 hour. You must retake your drug or suffer the penalties once more.
*The subject of your addiction must be illegal and deeply frowned down upon. Anyone who knows about your addiction can use it against you.
*Authorities seeing you utilize your drug will immediately report it and arrest you for using it.
*Each dose of your drug has 1 weight, and only needs 1 hand to be used. Declare how many doses you have at scene start.`,
  },
  {
    id: "crippling-obsession",
    name: "Crippling obsession",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    customInput: "Subject of your obsession",
    description:
      `YOU DAMNED WHITE WHALE!!!! I'LL HUNT YOU TO THE ENDS OF THE EARTH!!!!

*Free perk, grants 4 points.

*In every scene you start, you must strive to acquire/destroy/hunt the object of your obsession. You *cannot* go a scene without contributing towards that goal.
*You must bring up your obsession often and constantly talk about it, and optionally, try to convince others to assist you with your obsession in some form or another.
*Your obsession must be crippling and inconvenient. Making a pred character whose obsession is "eating people" is not crippling, that's just free points.
*You scare people with your obsession, and many aren't keen on following you, especially when you begin to ramble! Charisma checks require +1 success.`,
  },
  {
    id: "crippling-health-condition",
    name: "Crippling health condition",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    customInput: "Description of your condition",
    upgradable: true,
    maxRanks: 5,
    requiresStatChoice: [
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "charisma",
    ],
    description:
      `You have some type of health condition that is completely crippling in some way or another.

*Free perk, grants 4 points. May be acquired up to five times.
*You may not grab perks whose stat would be locked by the perk. I.e, no 'melee-fighter' if Strength is locked.
*You may not grab perks that'd negate your drawback. I.e, no 'cunning linguist' if Charisma is locked.

*One of: STR, DEX, CONS, INT, CHAR, is permanently locked at 1, and you always fail such checks. Multiple stacks of the perk cannot lock the same stat.
*The locked stat should be related to your disability. You may justify your disability through any means, so long as they're as bad, or worse, than the options offered below:

*Strength: You have zero muscle mass. Lifting your own body is a struggle - you may be wheelchair bound, or require someone else to carry you around.
*Dexterity: You have no fine motor functions - you cannot write or do anything that requires any degree of precision or accuracy.
*Constitution: You are weak and frail, any common sickness knocks you right out. You are unable to excert yourself, you take thrice as long to heal.
*Intelligence: You have some sort of mental condition that does not let you see the world normally, your mind is broken beyond repair. You are effectivelly blind and in a constant delusion.
*Charisma: You are completely incapable of speech, either due to physical reasons ( no vocal cords ) or mental. In any circunstance, you cannot write nor use sign language to circunvent it.`,
  },
  {
    id: "ridiculous-phobia",
    name: "Ridiculous phobia",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    customInput: "Subject of your phobia",
    description:
      `You are absolutely, completely and entirely terrified of one thing, and one thing only! But it's a very normal and commonplace thing - that's a ridiculous fear!

*Free perk, grants 4 points.

*Pick something incredibly common within the server - guns, pilzfrauns, vore - something that will be brought up in scenes fairly often.
*Everytime you encounter this thing, you are consumed entirely by fear! You must run away, and can only run away, or do things that'd help in running away.
*While in panic, you automatically fail any checks others impose upon you, so long as they do not prevent you from running away - if they do prevent you, you may roll normally.
*It is impossible to hide your phobia once you see what you fear - everyone around is immediately made aware of it.`,
  },
  {
    id: "berserker",
    name: "Berserker",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    description: `RAAAAAHHHHHHH

*Free perk, grants 4 points.

*You are always on edge, just one little spark away from exploding towards anyone and anything around you!
*Whenever you are attacked, take damage or have a hostile action done upon you, you go 'berserk'! You can go berserk towards multiple things at once!

->Berserk:
*You must focus solely on attacking the trigger, and nothing else. The attacks must cause immediate damage, so long term digestion is off!
*Your intelligence and charisma are both locked to 1, and you automatically fail such checks. Whatever triggered you must be killed or destroyed.
*Gain +3d6 to attack your trigger, whether melee or ranged. Gain -3d6 to do anything except attacking whilst in your berserk rage, including defensive/cover rolls.
*You cannot go berserk if you are entirely incapable of attacking your target, such as them being inside you. Self-damage also does not trigger berserk.`,
  },
  {
    id: "titanic",
    name: "Titanic",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    description:
      `You are ridiculously massive, to the point that it is an extreme inconvenience! How's the weather way up there?

*Free perk, grants 4 points. You must be 8 feet tall or taller.

*You are always at the bottom of initiative, regardless of your dexterity. Compare dexterities to determine initiative vs others with similar conditions.
*You must spend 1 extra point on non-firearm/vehicle equipment, as they must be sized for you. You can utilize 2-handed weapons as if 1 handed. Your 3 starting equipment remains free.
*You need an additional 2 successes in order to perform stealth actions and you can always be spotted in a crowd, unless everyone is equally huge!
*Every tier of cover is rated 1 tier lower, you cannot fit inside vehicles that aren't open-top, like bikes or motorcycles.`,
  },
  {
    id: "on-a-timer",
    name: "On a timer.",
    category: "negative",
    isFree: true,
    customInput: "Your condition & IRL death date.",
    pointsGranted: 4,
    description:
      `You have a condition that will kill you sooner rather than later - you are on a timer for death!

*This perk is free.
*Gain 4 points by picking this perk.

*During character creation, roll a 1d365. You only get one roll, and it must be clearly declared, without any jokes or messing around.
*For absolute safety, write out, in full caps, "MY 'ON-A-TIMER' PERK ROLL", so that there will be absolutely no confusion.
*The result is how many days the character has left before dying for good, even if they're a template or get a new body somehow.
*Only the Artificer may reverse your fate, but her services do not come cheap. You must pay 6 points and convince her to treat you.`,
  },
];
