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
*Pick how many points you wish to gain, from 1 to 6. 
*Whenever you start a scene, roll a 1d6, and if your roll is below that number, your rival appears.

*The Rival sheet does not need to be elaborate. It must, at minimum, just have stats.
*Your rival, at character creation, must have as many points as you do.
*Your rival must be reasonably capable of competing against you in your role! 
Example 1: I you're a soldier, they must be reasonably capable of defeating you. 
Example 2 If you're a merchant, they must be reasonably capable of outbidding you!

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

*On every scene you start, until you take your 'hit', your highest stat of: STR, DEX, CONS, INT, CHAR, is lowered to 1.
*Your stat is only restored after you take your hit.
*If stats are tied, roll a die to choose which one is lowered.
*The subject of your addiction must be illegal and deeply frowned down upon.
*Anyone who knows about your addiction can use it against you.
*You immediately fail charisma checks against those who know of your addiction, you repulse them.
*You cannot take a 'hit' within the first 20 posts (yours) of a scene, only after.`,
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

*Charisma checks require 1 additional success. You are ill and repulse people.
*One of: STR, DEX, CONS, INT, CHAR, is permanently locked at 1, and you always fail such checks.
*The locked stat should be related to your disaability.
*Your condition may be limb loss or physical disability:
->No leg means you are always last in initiative, even if you have a peg leg. You take 2 turns to move 1 distance.
->No arm means you cannot hold two-handed weapons. If your dominant arm is missing, -1d6 to actions involving your arm.
->Being paralyzed keeps you immobile and unable to do anything.

*You may have some other condition so long as it is crippling and cannot be easily circunvented.`,
  },
];
