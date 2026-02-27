import type { BaseStatKey, Race } from "../lib/character_types.ts";

export type PerkCategory =
  | "combat"
  | "vore"
  | "smut"
  | "gimmick"
  | "pf-type"
  | "faction"
  | "negative";

interface PerkModifiers {
  baseStatBonuses?: Partial<Record<BaseStatKey, number>>;
  healthMultiplier?: number;
  carryCapacityMultiplier?: number;
  organCapacityMultiplier?: number;
}

export interface PerkDefinition {
  id: string;
  name: string;
  category: PerkCategory;
  description: string;
  modifiers?: PerkModifiers;
  requiredRaces?: Race[];
}

export const PERKS: PerkDefinition[] = [
  {
    id: "melee-fighter",
    name: "Melee fighter",
    category: "combat",
    description: `Your character is remarkably strong, or particularly precise with their strikes! 
*When rolling to attack someone through melee means, roll +4d6 
*You now count a success on a 4 and above, instead of a 5 and above.`,
  },
  {
    id: "survivor",
    name: "Survivor",
    category: "vore",
    description: `You have survived many stomachs before, or otherwise you're naturally good at escaping them! 

*You roll an extra 4d6 to avoid being eaten and gain +4 to your escape training stat.
*Gain +3 escape attempts OR set your escape attempts to an exact 3; whichever would benefit you more when ingested.
*Ignores any perks that'd prevent you from doing escape attempts, regardless of conditions.`,
  },
  {
    id: "milky",
    name: "Milky",
    category: "smut",
    description: `You are always producing milk ( or cum ) at a very substantial rate!

*Only for PFs/PHs.
*Pick whether you are always producing milk, or overproducing cum. 
*You may pick both if you're a futa, but that will not increase your charges.
*Milk/cum works as 'charges'. You have 1 + [CONSTITUTION] charges. Each person can drink one charge of milk or more. 
*By drinking a charge, a person is fed for a full day, and after 4 hours, heals 3 HP!
*Healing effect does not apply to baseliners.
*Your milk only recharges at the scene's end or after 24 hours, whichever is faster. 
*If you've just finished churning prey, you regenerate all of your milk immediately.
*You can drink your own milk to keep yourself fed and healed.`,
  },
  {
    id: "innovator",
    name: "Innovator",
    category: "gimmick",
    description: `Your character is awfully creative! Or awfully good at stealing others' ideas~ 

*Not applicable for baseliners; PFs only. PFs aren't bright and are generally uncreative - this perk is to circunvent that.
*You get to make up ONE technology and make use of it IRP, so long as it is reasonably believable.
*The technology should be described in your sheet; NOT on the spreadsheet, that one's just for stats.`,
  },
  {
    id: "pilzherr-standard",
    name: "Pilzherr (STANDARD)",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Tierherr"],
    description: `You are a MALE PF! Not a futa, you've no pussy nor womb.

*Free perk: This perk is free, we just want this on your sheet so others are aware of what this entails.
*One of the biggest advantages of PFs is the fact that they reproduce so quickly. 
*By nature of wanting to shaft just about anything, attacking their reproductive capabilities is a valid strategy.
*This is where you come in: Whenever you impregnate a PF, that PF can only birth Pilzherrs from there on out.
*The Pilzherrs she births do not share any of her skills or memories; they're worthless to her. 
*You are capable of vore all the same as a regular PF.`,
  },
  {
    id: "king-s-royal-army-pf",
    name: "King's royal army PF",
    category: "faction",
    description: `Switzerland strong!

Advantages:
*This perk is free.
*Start with an additional 3 points compared to PFs.
*Better gear: You are the best, so you get the best. Pick any perk that reasonably comes from having good gear: Scrounger, Sapper, Inventor, etc.

Disadvantages:
*Only one per player.
*Must be Swiss-born.
*Must be part of the King's Royal Army in #factions
*You give two points to a PF that digests you, instead of one.
*You are a target: You may be abducted for very nasty experimentation purposes.`,
  },
  {
    id: "rival",
    name: "Rival",
    category: "negative",
    description: `You became someone's worst enemy, and they hate you with a burning passion.

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
    id: "gunner",
    name: "Gunner",
    category: "combat",
    description: `Your character is remarkably accurate with their shots! 
*When roling to attack someone by shooting them with a firearm, roll +4d6. 
*You now count a success on a 4 and above, instead of a 5 and above.
*Does not apply to grenades or throwable weapons.`,
  },
  {
    id: "natural-predator",
    name: "Natural predator",
    category: "vore",
    description: `You are a man-eater and devour others without much difficulty at all. 

*You roll an extra 4d6 to grapple, swallow and to keep prey down. 
*You now count successes on a 4 and above, rather than a 5 and above, to do that.`,
  },
  {
    id: "the-impregnator",
    name: "THE IMPREGNATOR",
    category: "smut",
    description: `Your sperm quality is very high, and you produce a lot of it. 

*Must have a penis. 
*When you cum inside someone and they are fertile - you definitely impregnate them. 
*You may cum a lot, enough to stretch them out! Cumflation woe.
*Even after shooting, you can still cum again and again - you are like a bottomless pit of cum.
*When impregnating someone, you can pick specifically which template she will give birth to!
*If interacting with 'baby factory', pick Even or Odd, then roll a 1d6.  You get to pick who they're impregnated with if it lands favourably.`,
  },
  {
    id: "scrounger",
    name: "Scrounger",
    category: "gimmick",
    description: `Somehow, almost as if you are favoured by the gods, you always manage to find exactly what you need, whenever you need it. 

*If you ever need to find something, you do find it - even in unlikely places!
*It takes you time to find the thing. You may take anywhere between 1 to 3 turns to find it, up to GM's discretion. 
*Something that'd be easy to find takes 1 turn, something moderately difficult takes 2, and something super difficult takes 3! 
*There are some things you won't find at all, such as a five-course steak dinner in the middle of a battlefield!`,
  },
  {
    id: "pilzherr-femboy",
    name: "Pilzherr (FEMBOY)",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Tierherr"],
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
    id: "sturmtruppen",
    name: "Sturmtruppen",
    category: "faction",
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
    id: "extremely-inefficient-digestion",
    name: "Extremely inefficient digestion",
    category: "negative",
    description: `Your metabolism is extremely slow - and it just doesn't work as well as others.

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
    id: "runner",
    name: "Runner",
    category: "combat",
    description: `Your character is remarkably fast, and most struggle to keep up! 
---->So long as you are not encumbered:
*Move up to two distances, instead of the usual one, in combat. 
*You are always at the top of initative regardless of your dexterity.
*Regular rules apply to all that share this perk.`,
  },
  {
    id: "hard-to-churn",
    name: "Hard to churn",
    category: "vore",
    description: `You're naturally resilient to digestion somehow, or you're just very willful to survive! 

*Your points in Digestion Resilience are quadrupled.`,
  },
  {
    id: "rewritter",
    name: "Rewritter",
    category: "smut",
    description: `Fucking a PF into rewriting her brain is doable, and you fuck them hard enough to do it regularly!

*Only for PFs/PHs. 
*Whenever you are having sex with a template, you can hardcore fuck her, and thus, rewrire their brain!
*You can turn them into a template of your choosing. The appearance remains the same though!
*Whenever fucking them hard, roll your strength against their own.
*You need [Victim's constitution] successes in order to rewrite them. 
*Successes are cumulative, you don't need to get them all in a single roll.`,
  },
  {
    id: "wayfinder",
    name: "Wayfinder",
    category: "gimmick",
    description: `You have a perfect sense of where exactly you are in the world.

*Always know the state of the region you are in, as well as local dangers and safe passages, if any.
*Whenever you need to find your way, you always manage to do so.
*Never get lost, even underground or behind enemy lines.`,
  },
  {
    id: "pilzherr-neandertal",
    name: "Pilzherr (NEANDERTAL)",
    category: "pf-type",
    requiredRaces: ["Pilzherr", "Tierherr"],
    description: `You are a MALE PF! You look very manly, unmistakeable as a man!

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
    id: "british-trench-raider",
    name: "British Trench raider",
    category: "faction",
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
    id: "m-r-e",
    name: "M.R.E",
    category: "negative",
    description: `Your purpose is being eaten by others, so much so that your body has been made to digest extremely easily.

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
    id: "effective-cover-use",
    name: "Effective cover use",
    category: "combat",
    description: `You're careful and very much prefer to preserve your life! 

*Every tier of cover is rated one tier higher than it actually is - except for the highest tier, which has no effect.`,
  },
  {
    id: "living-furnace",
    name: "Living furnace",
    category: "vore",
    description: `You are closer to a furnace than a real person! 

*Your points in digestion strenght are quadrupled. 
*You can digest any objects you eat. Based on the material, it'll have 4/8/12 digestion resilience.
*Digesting an object depends on its resilience - it takes as long as a person would with that same resilience.`,
  },
  {
    id: "succubus",
    name: "Succubus",
    category: "smut",
    description: `Your sex drive is incessant. 

*Very dark perk, use with care, and with partners who consent and enjoy non-con.
*In a non-con scene ( rape ), you gain +4d6 to your strength to keep them pinned. 
*You now count successes on a 4 and above when doing that.
*For every orgasm, your target loses 1 HP and 1 strength temporarily. At 0 strength, they can no longer resist you.
*You an your partner may arbitrarily decide when an orgasm is had.
*Otherwise, the target orgasms every time they attempt to resist you.
*A victim may be killed through these means. Gain 2 points if you fuck them dead.
*The perk can be used in consensual scenes, but awards no points then.`,
  },
  {
    id: "lucky",
    name: "Lucky",
    category: "gimmick",
    description: `Lady luck favours you in particular! 

*You have a pool of 6 dice, which, in a single scene, may be applied into whatever you want. 
*You may choose how many dice to use - you don't need to use all three at once! 
*The dice only regenerate once the scene is over and a new one starts. You can roll the dice before or after another roll.
*You may burn 2 dice in order to get the effects of another luck related perk ( scrounger, explosive intolerant, etc )
*The effects only apply in the same turn they were called upon.`,
  },
  {
    id: "speisfraun",
    name: "Speisfraun",
    category: "pf-type",
    description: `You are a PF birthed for the sole purpose of feeding yourself to others. Your body's fatty in all the right places! 

*You burn calories very slowly, semdomly needing to eat anything at all. One meal per week is enough.
*You are built to transform inedible things something edible (yourself.) 
*You can eat anything organic, from actual food, into things such as grass and hay, as well as rotting food!
*Such things do not taste good.
*Because of your nature, you are worth four X [CONSTITUTION] times as much nutrition towards whoever eats you. 
*our strength and dexterity are capped to 1. You're not meant for fighting and you don't put on a lot of muscle - you are nutrition!`,
  },
  {
    id: "harlem-hellfighter",
    name: "Harlem Hellfighter",
    category: "faction",
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
    id: "crippling-addiction",
    name: "Crippling addiction",
    category: "negative",
    description: `You have an addiction so absolutely crippling that you cannot go without it.

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
    id: "terrain-specialist",
    name: "Terrain specialist",
    category: "combat",
    description: `You're very well accostoumed to specific kinds of terrains! 

*Pick one type of terrain ( Forests, mountains, plains, no-man's-land, urban, etc ). 
*While in such a terrain, double any cover bonuses you would get!
*Never get lost in such terrain, always know your way around.`,
  },
  {
    id: "in-charge",
    name: "In charge",
    category: "vore",
    description: `You have an unreal amount of control over your digestive system! Mostly narrative perk.

*By default, stomachs always digest, balls, womb and breasts are always safe. This perk ignores that.
*You may decide if any organ is capable of digesting prey or holding them safely, whenever you wish. 
*This does include changing how your acid feels, from painful to painless, numbing, pleasurable, etc. 
*You may control how harsh or how nice the environment inside you is. 
*You may choose how the fat of your prey is allocated within your body. 

*You may move a person from one organ to another immediately as an action, it is a contested STR vs STR check.
*The organs must be connected, no sending prey from your stomach into your tits or womb!
*Your control gives you +1d6 to keeping prey down.
*You can choose where someone with the living-fat-advisor perk ends up in, and you can stop their shenanigans at will.`,
  },
  {
    id: "baby-factory",
    name: "Baby-factory",
    category: "smut",
    description: `Your womb is extremely fertile and spacious! 

*Only for PFs. 
*You are impregnated for certainty whenever someone with a penis cums inside you. 
*Your womb specifically is considered to have 3 stacks of the 'unreal capacity' perk. You still obey encumbrance rules.
*You can choose which templates you give birth to, and you can choose if someone with the 'ever-lasting' perk is birthed or not.
*Being impregnated by a PH does not force you to only birth males from there on out.
*Your pregnancies last 1 week. You still need the required nutrition to birth someone that fast.
*If interacting with 'THE IMPREGNATOR', pick Even or Odd, then roll a 1d6.  You get to pick who you're impregnated with if it lands favourably.
*Using the 'in-charge' perk to digest people inside your womb will digest your children.`,
  },
  {
    id: "allies",
    name: "Allies",
    category: "gimmick",
    description: `You know a guy or two, who happens to know another- with connections and stuff! 

*You have a vast connection of allies who are reliable and support you, who may be called upon when needed.
*While they will support you, they aren't brainless, and won't allow you to blatantly scam, kill or harm them!
*Your allies should be described in your sheet; NOT on the spreadsheet, that one's just for stats
*It should be a decently broad group, whom can help you directly. 
*These can be goon NPCs to help you in combat, people you can call upon for advice, so on and so forth.`,
  },
  {
    id: "twins",
    name: "Twins",
    category: "pf-type",
    description: `You have a perfect twin! 

*When a pair ( or more ) PFs are birthed and are twins, they gain a special ability: 
*Twins can communicate with one another from any range, as well as share mental images/thoughts and read one anothers'. 
*You may or not be templates - but both must be OR not be templates.
*You MUST either make the other twin, or have someone play them for you.`,
  },
  {
    id: "crippling-health-condition",
    name: "Crippling health condition",
    category: "negative",
    description: `You have some type of health condition that is completely crippling in some way or another.

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
  {
    id: "tough",
    name: "Tough",
    category: "combat",
    description: `Your skin, meat 'n bones are very tough and hard to break through! 

Your HP is doubled. Your constitution is not doubled, it applies only to your HP!`,
    modifiers: {
      healthMultiplier: 2,
    },
  },
  {
    id: "unreal-capacity",
    name: "Unreal capacity",
    category: "vore",
    description: `You are unreasonably stretchy!

*The capacity of each organ is tripled. You may get this perk multiple times and the benefits stack multiplicatively`,
    modifiers: {
      organCapacityMultiplier: 3,
    },
  },
  {
    id: "patron",
    name: "Patron",
    category: "gimmick",
    description: `You know people in high places!

*You have a very deep connection with a single person, or group of few individuals. 
*These individuals are powerful in some way ( financially, militarily, etc ), and support you as such. 
*They will assist your endeavours in their respective ways, but will not go out of their way to personally assist you.
*Your patron(s) should be described in your sheet; NOT on the spreadsheet, that one's just for stats.
*You must define who your patrons are, what they provide, and your relation with them
*This perk can partially fill in for another perk so long as such a perk is acquired through some sort of funding or material.`,
  },
  {
    id: "tiny",
    name: "Tiny",
    category: "pf-type",
    description: `Through some abysmal fuckery, you are born extremely tiny - no more than four inches tall at most.

*You are considered to have values of 1 in Strenght, Dex and Constitution when dealing with someone normal sized. 
*Any investments into those stats only apply when dealing with other equally sized beings.
*You can pass through extremely tiny openings. You cannot lift anything normal sized. 
*You cannot escape the stomachs or grips of someone normal sized no matter how much you try.
*You are extremely stretchy, You can take dick without issue, and you can eat ONE normal-sized person at all. 
*If you do manage to eat someone normal-sized, they are incapable of escaping you due to the sheer tightness.
*Regular rules apply in regards to things similarly sized to yourself. 
*You are capable of impregnating and being impregnated. You give no points when digested by someone normal sized.`,
  },
  {
    id: "explosive-intolerant",
    name: "Explosive intolerant",
    category: "combat",
    description: `Explosions in general only ever seem to avoid you somehow, it's like you repel them! 

*During events and combat related scenes, never die or get hurt from explosives-related random chance
( Random mines, artillery shells and stray explosives ^ )
*Explosives deal -2 damage to you. Damage CAN be brought to 0 through this.`,
  },
  {
    id: "inescapable",
    name: "Inescapable",
    category: "vore",
    description: `Once prey has grown weak and soft enough, they can't find a way out of you at all! 

*If prey is at 0 HP, or is brought to 0 HP, and they're inside you - they cannot attempt any escapes! 
*They may only be rescued by someone from the outside, or released!`,
  },
  {
    id: "spy",
    name: "Spy",
    category: "gimmick",
    description: `You are a spy, infiltrated in an enemy faction! Sneaky sneak.

*Specify which faction you are loyal to, and which faction you're spying on, when making your character.
*When attacked by your rael faction, you have a signal  that identifies your true alignment, and they always recognize it. 
*When doing your spy missions, you are assumed to have all the neccessary tools to carry it out: 
*Lockpicks, silenced gun, cyanide pills, anything that'd be fitting for a spy to have.
*The enemy is right to punish you if you're caught!
*When picking this perk, do not list it in your sheet - rather, list a 'fake' perk. The fake perk has no effect. 
*Tell staff in DMs that you've chosen the Spy perk. This perk relies entirely on secrecy, so don't go telling others you don't trust~`,
  },
  {
    id: "tierfraun-canine",
    name: "Tierfraun (CANINE)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
    id: "capo",
    name: "Capo",
    category: "faction",
    description: `You are an underboss of your respective mafia, owning some sort of safehouse/business within New Orleans!

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
  {
    id: "danger-sense",
    name: "Danger sense",
    category: "combat",
    description: `You have a natural feeling for 'danger', as if it were a sixth sense! 

*Any stealth action or ambush done against you immediately fails. You are never caught by surprise. 
*Always notice traps before they can pose a danger to you. You can still trip them though.
*Does not apply against the 'Jäeger perk'. Regular rules apply instead.`,
  },
  {
    id: "hauling-meat",
    name: "Hauling meat",
    category: "vore",
    description: `You've very strong legs! Carrying prey around is no biggie.

*People weight only 1 weight when eaten by you. Does not apply to their equipment: Strip 'em! 
*If the prey has the "heavy" perk, typical rules apply.`,
  },
  {
    id: "beastmaster",
    name: "Beastmaster",
    category: "gimmick",
    description: `You have a pet animal. How cute! 

*The animal may be common or exotic, whichever you please. 
*Your animal has special training - you can give it basic commands, such as attack, follow, sit, 'get that', etc.
*Your animal should have a sheet of their own, and start off with 7 points and a fitting perk. 
*Your animal gains points at the same rate you do. It cannot have the "digestion strength" stat.
*Your animal can be killed and if killed, the individual cannot be brought back. 
*You may get a new pet, but whatever stats it gained will be lost. 
*The Animal obeys typical HP rules for incapacitation, critical condition and death.`,
  },
  {
    id: "tierfraun-felines-vulpines",
    name: "Tierfraun (FELINES, VULPINES)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 dexterity, +1 intelligence, -3 stat points.
*Have the 'runner' perk from Combat perks.
*Have climbing claws: You can climb vertical surfaces provided they aren't completely smooth. Your feet must be exposed for this.
*Enemies always fall prey to your ambushes, and you always succeed in stealth, unless a perk would prevent this.`,
  },
  {
    id: "j-eger",
    name: "Jäeger",
    category: "combat",
    description: `You are a natural at trap-making and being sneaky in general!

*Any stealth action or ambush done by you always succeeds. 
*Traps are always hidden, no need to roll for their concealment.
*+3d6 when rolling for the trap's damage.
*Does not apply against the 'Danger sense' perk. Regular rules apply instead.`,
  },
  {
    id: "heavy",
    name: "Heavy",
    category: "vore",
    description: `Fatty! You keep your predator pinned with your weight, or your struggles are very destabilizing!

*This may be justified through you being very heavy, or your struggles being too strong to move around with.
*When eaten by someone, you make them immobile, and they receive the respective penalties!
*If the pred has "hauling-meat", typical rules apply instead.`,
  },
  {
    id: "free-range",
    name: "Free range",
    category: "gimmick",
    description: `The world is at war. Free travel is greatly limited. You manage to get around, though!

*You always manage to go wherever you need to go, even if the starting point and ending point are at war! 
*If permission is needed, you always have it to go wherever, regardless of your alignments.
*Cross frontlines, cross the globe. Go anywhere, be anywhere, whenever.
*You may not visit innaccessible places, such as crossing the Alps during the winter, or going to antartica!
*You cannot get into restricted places. You can travel freely, you can't enter *any* place freely.`,
  },
  {
    id: "tierfraun-bovines",
    name: "Tierfraun (BOVINES)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
    id: "signiature-weapon",
    name: "Signiature weapon",
    category: "combat",
    description: `You have a special weapon that belongs to you, and only you! 

*It must be grabbed from the weapon's list, or reflavoured from there.
*It is considered the highest tier of weapon and deals +1 damage. 
*No matter what happens, it always returns to you through one way or another. You may be temporarily separated from it.
*If it is ranged, you may grab any suitable attachments for it, free of charge, at any point, so long as they do not encumber you.
*If you wish to pick a ranged weapon with the 'restricted' gimmick, you must still pay 1 point. Every other weapon is free.
*If it's a melee weapon, you may grab one melee weapon trait that wouldn't otherwise fit the weapon, alongside all other fitting traits.`,
  },
  {
    id: "internal-fighter",
    name: "Internal fighter",
    category: "vore",
    description: `You must certainly be mad! Rather than fighting outside of your predator, you'd rather do so from the inside!

*When rolling your "escape training", you may choose to, instead of trying to escape, damage your predator! 
*This must be declared before rolling, otherwise, it will automatically default to an escape attempt. 
*For every success over your predator, you deal 1 damage. A predator can be killed through these means.
*An incapacitated predator is still actively trying to keep you down, reducing them to 0 HP does not release you.
*A dead predator can be escaped from without any rolls.
*Fighting your predator is not considered an "escape" attempt, perks that'd help in keeping prey inside do not apply.
*You still slide into other organs (i.e, along a cowgirl's four stomachs) when you fight.
*The predator does not add the difference in strengths if you're fighting rather than escaping.`,
  },
  {
    id: "bushwacka",
    name: "Bushwacka'",
    category: "gimmick",
    description: `You live in the Bush, and live off of the land! 

*You have a "survivalist's kit" from the equipment list. It has no weight and does not have the 'bulky kit' gimmick.
*It always returns to you through one means or another, but you can be separated from it temporarily.
*Should you ever find yourself in the wilderness, you always find just enough sustenance to keep yourself fed.
*Your kit has the tools to hunt said sustenance and prepare it into something that is edible/drinkable.
*You never run out the resources to hunt and prepare your sustenance as long as you have your kit.
*This does not mean you know your way around the place - just that nature won't kill you.`,
  },
  {
    id: "tierfraun-centaurs-cervines",
    name: "Tierfraun (CENTAURS, CERVINES)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristics.

*+2 strength, +1 constitution, -3 stat points.
*Your weight capacity is 3x that of a normal person.
*You have the 'Hauling-meat' perk from Vore Perks.
*In combat, you may move up to 3 distances in a single turn.
*Someone can mount you, either piggyback or upon your back if you are a centaur. They will move alongside you.`,
  },
  {
    id: "brawler",
    name: "Brawler",
    category: "combat",
    description: `You are a natural brawler, and fight with whatever you have on hands. 

*Tier 0 and tier 1 weapons ( unarmed and makeshift weapons respectively ) deal +1 damage. 
*When attacking with tier 0 and tier 1 weapons, gain +3d6 to attack with them.
*Does nothing for tier 2 ( military ) weapons.`,
  },
  {
    id: "prey-as-armour",
    name: "Prey-as-armour",
    category: "vore",
    description: `You have a person inside you! That's basically cover, right? 

*Damage reduction from other items/perks apply before this perk's calculations are done.
---->If you have someone inside you and whenever attacked from the front specifically:
*You take only 1 damage and your prey takes the remainder. 
*If the attack only dealt 1 damage, you take the damage and your prey takes none. 
*You always take 1 damage, it cannot be lowered further with this perk.
*Once the prey is dead, they no longer soak up any damage. Your prey must be alive for this perk to apply.`,
  },
  {
    id: "authoritarian",
    name: "Authoritarian",
    category: "gimmick",
    description: `Your mere presence commands authority! Most will not dare speak ill of you to your face!

*When attempting to intimidate or force someone do something based on your authority, add +4d6 to your charisma.
*You now count count successess on 4 and above when doing that. 
*This is not a generalized charisma buff! You're meant to be a bully with it!`,
  },
  {
    id: "tierfraun-sealife",
    name: "Tierfraun (SEALIFE)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
    id: "sapper",
    name: "Sapper",
    category: "combat",
    description: `A Sapper is a military engineer of sorts. You build fortifications and do general groundworks of the sort.

*You have a no-weight entrenching gear AND an explosives kit which are not considered 'bulky kits' thanks to this perk. 
*They always return to you through one means or another, but you can be separated from them temporarily.
*Your entrenching gear allows you to build cover worth 6d6 in 3 turns. 
*If you have additional resources in-scene AND preparation time, you can create cover worth 8d6
*Destroying fortifications with explosives, cutting barbed wire, breaking down walls, you do it in one turn, without fail.
*Sapper extends to vehicles as well, you can repair, modify and upgrade vehicles without fail.`,
  },
  {
    id: "assimilator",
    name: "Assimilator",
    category: "vore",
    description: `You transform other people into strength for yourself.
 
---->If you have eaten UNWILLING PREY:
*When successfully digesting someone in their entirety, you gain an additional point from digesting them.
*The whole proccess must be done by you. If they were softened up by someone else's enzymes, perk does not apply.
*If you digest someone in their entirety and they were at full HP when swallowed, you also gain one of their perks.
*The damage prey takes must be caused solely by your enzymes, perks such as Crusher forfeit the perk gain.
*If the prey is damaged by any means other than your enzymes, you forfeit the perk gain.`,
  },
  {
    id: "natural-fibster",
    name: "Natural Fibster",
    category: "gimmick",
    description: `People will eat your bullshit up like a well baked fresh blueberry pie!

*When trying to lie or manipulate someone, you roll an additional 4d6. 
*You now count successes on 4 and above when doing that.
*This is not a generalized charisma buff! You're meant to lie and manipulate people with it!`,
  },
  {
    id: "tierfraun-avian",
    name: "Tierfraun (AVIAN)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
    id: "baiter",
    name: "Baiter",
    category: "combat",
    description: `You are really fucking annoying, or a particularly juicy target.

*When fighting as a group, enemies must target you even if other allies of yours are closer/easier/better targets.
*Does not apply if your enemy is incapable of targetting you at all.
*You may set up non-lethal lures OR distract your opponents yourself, bringing them to wherever the distraction occured in.
*Use this perk not to fight, but to draw enemies away from you or into you.`,
  },
  {
    id: "crusher",
    name: "Crusher",
    category: "vore",
    description: `Your prey is MEANT to stay inside you! They better not fight back, lest they want to be punished! 

*If your prey rolls to escape your stomach and fails, they take 1 damage for every success you have over their own.
*Prey can be killed through these means! Digesting their body still takes the usual time, this does not speed it up at all.
*Incapacitated prey is still fighting back! Prey only stop fighting if they're dead or have run out of escape attempts.`,
  },
  {
    id: "emergency-treatment-expertise",
    name: "Emergency treatment expertise",
    category: "gimmick",
    description: `You regularly have to tend to people on the very verge of death!

*With this perk, you immediately succeed in stabilizing anyone.
*When you stabilize someone for the first time in a scene, their HP is healed back to 1.
*Only applies once; further stabilizations of the same target do not change their HP.
*Any checks regarding medicine or human biology immediately succeed as well.`,
  },
  {
    id: "tierfraun-lizards",
    name: "Tierfraun (LIZARDS)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
    id: "defender",
    name: "Defender",
    category: "combat",
    description: `You have an iron-will to protect those around you!

*You may get this perk even if it pushes you past your encumbrance level.
*You have a shield, or equivalent, which has 2 weight and is considered a makeshift weapon.
*You may use a one-handed melee weapon OR one-handed firearm whilst holding the shield, but you have -3d6 to attack with them
*If at distance 0 with any number of teammates, as an action you may protect them, forcing the enemy to target you instead. 
*If you're holding your shield, you take -2 damage. You must be facing the target, or there is no reduction.
*Like a 'signiature weapon', it will always return to you somehow, but you can be separated from it for some time.`,
  },
  {
    id: "ever-lasting",
    name: "Ever lasting",
    category: "vore",
    description: `You are never truly gone. You always come back!

*When churned, you continue on as living fat within your predator's body! 
*Even if your predator slims down, you still manage to live on, that's how resilient you are!
*You are able to speak with your predator and control a bodypart you inhabit, however ...
*The predator can easily shut you down and keep you from doing anything, contrary to 'living-fat-advisors'.
*When your predator gives birth OR impregnates someone, your consciousness is transfered to that body and you live on! 
*You'll be alive, but with a different appearance.`,
  },
  {
    id: "master-tactician",
    name: "Master tactician",
    category: "gimmick",
    description: `You are a mastermind of tactics; your brain can see the battlefield as though it is top-down. 

*When doing anything related to military strategy, you gain +4d6 to perform it.
*You now count successes on a 4 when doing that.
*When in combat, if you have allies and you are the leader of your party, the entire party gains a flat +1 to their initiative ratings.
*On every turn, freely, you can choose to order an individual ally or give an order for the party.
*If you command an individual ally, they gain +3d6 to do what you command them to, IF they do it of course.
*If you command the entire party, they all gain +1d6 to do what you command them to do, IF they do it of course.
*You must be able to speak in order to give orders. You cannot give orders if you are incapacitated.`,
  },
  {
    id: "tierfraun-hefties",
    name: "Tierfraun (HEFTIES)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
    id: "weapon-master",
    name: "Weapon master",
    category: "combat",
    description: `You have weapons from all across the world, neatly stashed away someplace conveniently nearby.

*With this perk, you have ONE copy of every weapon in the system. 
*You have as many melee weapons as you want, with fitting traits.
*Restricted weapons still cost 1 point. Any other weapon, even with a cost, becomes free.
*You can visit your arsenal during scenes and give them to others, but they can be stolen by them.
*Weapons lost must be re-acquired through roleplay. Restricted weapons must be bought with a point again.`,
  },
  {
    id: "living-fat-advisors",
    name: "Living fat advisors",
    category: "vore",
    description: `The dead remain within you after churning, awakening as your fat!

*Prey must pick a bodypart ( Boobs, butt, belly, dick, balls, etc ) to live on as. They'll retain their consciousness and memories.
*The pred will then be able hear their living fat within their mind, and may be advised by it, if they're willing.
*The living fat has control over the body part they inhabit: You may lactate or grow hard spontaneously, etc.
*It takes a consitution check vs your advisor's own to control them and make them stop.
*The in-charge perk allows you to choose where the prey ends up in, and you can stop their shenanigans at will.
*For as long as you have the living fat within your body, you keep their stats: Strength, dexterity, intelligence, etc
*For every living fat advisor residing within you, you must eat one prey every 3 scenes - otherwise, the fat burns away.
*Failing to eat prey makes the advisor go away. The advisors are lost in order of acquiral! 
*Eating NPCs does not count, you must feed on RPers' characters!`,
  },
  {
    id: "hidden-personality",
    name: "Hidden personality",
    category: "gimmick",
    description: `You keep yourself on the down-low, people cannot know you very well at a glance. 

*Create a fake sheet and include whatever information you wish inside it. Send it to submissions.
*Create a real sheet and send it to staff in DMs, preferably Doc3613 or PastelStoic
*No one but staff gets access to your real sheet unless you reveal it yourself.
*Inform updates in staff DMs rather than in #character-updates.
*You are expected to keep track of your real sheet somewhere, we won't be reminding you of your stuff all the time.`,
  },
  {
    id: "tierfraun-leporines",
    name: "Tierfraun (LEPORINES)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
    id: "bacta-tank",
    name: "Bacta tank",
    category: "vore",
    description: `You are oh so caring for your allies, oh my my!~

*Your womb or balls can heal! People you unbirth or cockvore, get to heal inside you! 
*They will gain HP at the same rate they'd otherwise lose HP from digestion.
*If you have the 'in-charge' perk, you can choose to heal with any orifice, on top of the other benefits the in-charge perk gives.
*Characters in critical condition are stabilized whilst inside a bacta-tank orifice; however ...
*If they're still in negative HP when spat out, they'll return to critical condition.`,
  },
  {
    id: "masterful-linguist",
    name: "Masterful linguist",
    category: "gimmick",
    description: `You are a master of communications. You speak clearly, and your ears are awfully sharp! 

*You always manage to communicate with people, even if you would otherwise be unable to.
*Language barriers, being mute, talking through radio interference - you are always clearly understood through this.
*You are never misunderstood, and your interpretations are always correct. 
*You can communicate with animals within reason; you can display you are no threat, for example, and always succeed.
*You may use rp-discussions to talk to players and ask for clarifications on anything AND use it IRP.`,
  },
  {
    id: "tierfraun-lamias",
    name: "Tierfraun (LAMIAS)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

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
  },
  {
    id: "stuffer",
    name: "Stuffer",
    category: "vore",
    description: `You actively want to shove yourself into the tummies of your predators and keep yourself in!

*You gain 4d6 to grapple, stuff yourself into a predator and keep yourself in there! 
*You now count successes on a 4 and above, rather than 5 and above, to do that.`,
  },
  {
    id: "hypnotist",
    name: "Hypnotist",
    category: "gimmick",
    description: `You are a hypnotist; you can put people into trances which they find hard to break out of! 

*You may try to hypnotize a willing volunteer who plays along with your hypnotization. 
*Roll your charisma. Each success is equivalent to an hour of hypnosis, where the target must follow your commands.
*If the commands bring direct harm to the victim, they may roll intelligence vs your charisma to break free.
*Unwilling targets must be bound and unable to fight back or to just walk away. 
*In such a case, your roll your charisma against their intelligence, as they're trying to resist you!`,
  },
  {
    id: "tierfraun-custom",
    name: "Tierfraun (CUSTOM)",
    category: "pf-type",
    description: `You have animal genes in you, making you stronger in certain areas.

*You must have at least one clear animal characteristic: Tail, animal ears, fins, something else.
*Anyone can tell you are a tierfraun based on your characteristic.
*Gain 2 perks of your choosing.
*Can come up with a gimmick for your respective animal, which will be reviewned and balanced by staff.
*If none of the options above fit what you're going for, choose this one!`,
  },
  {
    id: "forceful-feeder",
    name: "Forceful feeder",
    category: "vore",
    description: `You like to see others get stuffed to the very brim - and then push them past it!

*You gain +4d6 to grapple prey and to force-feed them to someone.
*You now count successes on 4 and above, rather than 5 and above, to do that.
*Alternatively, stuff someone with food: 
*You can carry as much food as your carry capacity allows you to.
*You can stuff 3 weight units of food to your target per turn. 
*3 units of food are equivalent to eating a person for organ-capacity calculations. 
*Stuffing someone is a strength check, as if predding/preying.
*You can stuff someone up to 5 times their organ-capacity. 
*For every point past their limit, they take 1 damage every turn. This can kill.
*Your target can try to regurgitate the contents of their stomach. 
*If they're grappled by you, you can stop regurtitation, by using your own strength, plus the modifiers in this perk up above.`,
  },
  {
    id: "last-ditch-escapee",
    name: "Last ditch escapee",
    category: "vore",
    description: `When things are tough, you always seem to get hit by a strong second wind!

---->If you're inside someone and you're at 0 HP or below ( not self-inflicted ), 
*You gain +6d6 to escape their stomach.
*You now count successess on a 4 and above, rather than a 5 and above, to do that.
*If you escape, you are hit with an adrenaline boost: 
*You have 'runner' for the ten minutes, or for 10 turns if in combat, and you cannot be incapacitated again for the duration.
*Once the adrenaline boost is over, you crash out, and are incapacitated/critical condition'd based on your HP. 
*While crashed out, if you are eaten again, you cannot do any escape rolls. 
*\`Crashed out\` lasts until your HP regenerates to full.`,
  },
  {
    id: "open-ended-tail",
    name: "Open ended tail",
    category: "vore",
    description: `Through some sort of strange mutation, your tail isn't normal - it's fleshy, stretchy, and opens near the end!

---->Perk requirement: Must be a tierfraun with a tail.
*This perk gives you a special tail may be used to carry things, but it cannot manipulate them.
*It can be used to eat prey without grappling first AND from 1 distance away; it can fit 2 prey by default and digests by default. 
*The tail leads straight into the stomach.
*After 2 escape attempts, prey may be pushed into the stomach. 
*It is constantly dripping acid from the tip, making you easy to track`,
  },
  {
    id: "open-ended-tail-mouthless",
    name: "Open ended tail (MOUTHLESS)",
    category: "vore",
    description: `You do not have a mouth! You must eat through your tail!

---->Perk requirement: Must be a tierfraun with a tail.
*Variation of the Open-ended tail perk. You have no mouth; you cannot vocalize any sounds and cannot eat normally.
*Once prey is brought to your stomach, they must escape into the tail, as escaping through your mouth is impossible.
*This perk gives you a special tail may be used to carry things, but it cannot manipulate them.
*It can be used to eat prey without grappling first AND from 1 distance away; it can fit 2 prey by default and digests by default. 
*The tail leads straight into the stomach.
*After 2 escape attempts, prey may be pushed into the stomach. 
*It is constantly dripping acid from the tip, making you easy to track`,
  },
];

export const PERKS_BY_ID = new Map(PERKS.map((perk) => [perk.id, perk]));
export const PERK_IDS = new Set(PERKS.map((perk) => perk.id));

export function validatePerkRequirements(
  race: Race,
  perkIds: string[],
): string | null {
  for (const perkId of perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    if (!perk) {
      return "Invalid perk id in payload.";
    }

    if (perk.requiredRaces && !perk.requiredRaces.includes(race)) {
      return `Perk \"${perk.name}\" requires one of: ${perk.requiredRaces.join(", ")}.`;
    }
  }

  return null;
}
