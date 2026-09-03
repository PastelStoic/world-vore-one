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

*You need another player in order to use this perk. They will control your rival if they are ever brought up.
*Both characters must own the perk, and both must gain the same amount of points from it.
*Pick how many points you wish to gain, from 1 to 6. 
*Whenever you start a scene, roll a 1d6, and if your roll is below that number, your rival appears.

*The Rival sheet does not need to be elaborate. It must, at minimum, just have stats.
*Your rival, at character creation, must have as many points as you do.
*Your rival must be reasonably capable of competing against you in your role! 
Example 1: If you're a soldier, they must be reasonably capable of defeating you. 
Example 2 If you're a merchant, they must be reasonably capable of outbidding you!

*As a rival, you're meant to be as disruptive as possible and attempt to ruin your rival's scene to the best of your ability.
*Mess their plans up, prevent them from eating/being eaten depending on their role, get the police involved to ruin their life, etc!
*This perk is intentionally disruptive. Don't pick it if you don't want a scene or two ruined!`,
  },
  {
    id: "extremely-inefficient-digestion",
    name: "Extremely inefficient digestion",
    category: "negative",
    description:
      `Your metabolism is extremely slow - and it just doesn't work as well as others.

*PFs only
*Digestion strength can go into the negatives. You may bring it up to -4.
*Gain one spending point for every point you go down in digestion strength.
*If your prey's dice pool to escape is <3/4ths (round down) of your dice pool to keep them in, they cannot attempt to escape.

*Your HP does not heal at the end of a scene; only at the end of the next scene over, no matter how much time passed.
*In time sensitive scenes, you take 8x as long to heal. This includes healing from other perks, such as Milky.
*You cannot get the following perks: 'Tough' and 'Living Furnace'
*Regardless of your digestion strength, prey takes 4 times as long to be digested and absorbed, unless ...
*If someone has the M.R.E perk, usual rules apply instead. 
*You must always have prey digesting inside you - if you go three consecutive scenes without prey inside you, you starve to death!

*Digestion should last multiple scenes, as your prey presumably takes days, or even weeks, to digest. 
*If you are in public, roll a 1d20. On a 4 or below, someone takes note and calls the proper authorities. 
*1 scene for every 20 digestion turns.`,
  },
  {
    id: "m-r-e",
    name: "M.R.E",
    category: "negative",
    isFree: true,
    pointsGranted: 2,
    description:
      `Your purpose is being eaten by others, so much so that your body has been made to digest extremely easily.

*You must have the Speisfraun perk, with all of its disadvantages.
*This perk is free.
*Gain 2 points by picking this perk.

*Your digestion resilience becomes a moot stat: You digest very quickly. Don't erase it though!
*You cannot make escape attempts, you digest too fast.
*For time sensitive scenes or events, you are digested and absorbed in 5 minutes. 
*Turn wise, it takes 3 turns to digest you. You are absorbed immediately afterwards.
*If your predator has Extremely slow metabolism, ignore this perk entirely, regular rules apply instead.`,
  },
  {
    id: "crippling-addiction",
    name: "Crippling addiction",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    customInput: "Subject of your addiction",
    description:
      `You have an addiction so absolutely crippling that you cannot go without it.

*This perk is free.
*Gain 4 points by picking this perk.

*On every scene you start, until you take your hit, your highest stat of: STR, DEX, CONS, INT, CHAR, is lowered to 1. Priority is in that order.
*Your other stats are halved, rounded down, until you take your hit.
*Each dose of your drug has 1 weight. Declare at scene start how many doses you have.
*Your high lasts 10 posts, turns, minutes OR until combat end, whichever is faster, of which case, you need to retake your substance or suffer the penalties again.
*The subject of your addiction must be illegal and deeply frowned down upon. Anyone who knows about your addiction can use it against you.
*Authorities seeing you utilize your drug will immediately report it and arrest you for using it.`,
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

*This perk is free.
*Gain 4 points by picking this perk.

*You are a raving lunatic, whom is entirely obsessed with one thing, and one thing only.
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

*This perk is free.
*Gain 4 points by picking this perk.
*You may take this perk up to five times.
*Multiple stacks of this perk cannot lock the same main stat, they must each lock a different one.
*You may not grab perks whose stat would be locked by the perk. I.e, no 'melee-fighter' if Strength is locked.
*You may not grab perks that'd negate your drawback. I.e, no 'cunning linguist' if Charisma is locked.

*Charisma checks require 1 additional success. You are clearly ill and repulse people.
*One of: STR, DEX, CONS, INT, CHAR, is permanently locked at 1, and you always fail such checks.
*The locked stat should be related to your disability. You may justify your disability through any means, so long as they're as bad, or worse, than the options offered below:

*Strength: You have zero muscle mass. Lifting your own body is a struggle - you may be wheelchair bound, or require someone else to carry you around.
*Dexterity: You have no fine motor functions - you cannot write or do anything that requires any degree of precision or accuracy.
*Constitution: You are weak and frail, any common sickness knocks you right out. You are unable to excert yourself, you take thrice as long to heal.
*Intelligence: You have some sort of mental condition that does not let you see the world normally, your mind is broken beyond repair. You are effectivelly blind and in a constant delusion.
*Charisma: You are completely incapable of speech, either due to physical reasons ( no vocal cords ) or mental. In any circunstance, you cannot write nor use sign language to circunvent it.

*You may have some other condition so long as it is crippling and cannot be easily circunvented.`,
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

*This perk is free.
*Gain 4 points by picking this perk.

*Pick something incredibly common - guns, pilzfrauns, vore - something that will be brought up in scenes fairly often.
*Everytime you encounter this thing, you are consumed entirely by fear! You must run away immediately and avoid it at all costs.
*You may perform no checks besides running away, or checks that contribute towards running away.
*You automatically fail any checks others impose upon you, so long as they do not prevent you from running away - if they do prevent you, you may roll normally.
*It is impossible to hide your phobia once you see what you fear - everyone around is immediately made aware of it.`,
  },
  {
    id: "berserker",
    name: "Berserker",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    description:
      `RAAAAAHHHHHHH

*This perk is free.
*Gain 4 points by picking this perk.

*You are always on edge, just one little spark away from exploding towards anyone and anything around you!
*Whenever you are attacked, take damage or have a hostile action done upon you, you go berserk! You can go berserk towards multiple things at once!
*Your intelligence and charisma are both locked to 1, and you automatically fail such checks, whilst berserk.
*While berserking, you must attack whatever triggered your berserk rage until it is dead or destroyed. You must focus solely on the trigger, and nothing else.
*Gain +3d6 to attack your trigger, whether melee or ranged. Gain -3d6 to do anything except attacking whilst in your berserk rage.
*You cannot go berserk if you are entirely incapable of attacking your target, such as them being inside you. Self-damage also does not trigger berserk.
*The attacks must cause immediate damage, so long term digestion is off!`,
  },
  {
    id: "titanic",
    name: "Titanic",
    category: "negative",
    isFree: true,
    pointsGranted: 4,
    description:
      `You are ridiculously massive, to the point that it is an extreme inconvenience! How's the weather way up there?

*This perk is free.
*Gain 4 points by picking this perk.
*You must be at least 8 feet tall or taller.

*You are always at the bottom of initiative, regardless of your dexterity. Compare dexterities to determine initiative vs others with similar conditions.
*You must spend 1 extra point on body armor, shields and melee weapons, as they must be sized for you. You can utilize 2-handed weapons as if 1 handed.
*Does not apply to your initial 3 free equipment - those remain equally free.
*You need an additional 2 successes in order to perform stealth actions and you can always be spotted in a crowd, unless everyone is equally huge!
*Every tier of cover is rated 1 tier lower, and you must spend an action to take cover - it is not taken automatically.
*You cannot fit inside vehicles that aren't open-top, like bikes or motorcycles.`,
  },
];
