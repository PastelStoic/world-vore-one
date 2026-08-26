import type { PerkDefinition } from "@/data/perks.ts";

export const SMUT_PERKS: PerkDefinition[] = [
  {
    id: "milky",
    name: "Milky",
    category: "smut",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    customInput: "Milk, cum, or both?",
    description:
      `You are always producing milk ( or cum ) at a very substantial rate!

*Pick whether you are always overproducing milk, or overproducing cum. 
*You may pick both if you're a futa, but that will not increase your charges.
*Milk/cum works as 'charges'. You have 1 + [CONSTITUTION] charges. Each person can drink one charge of milk or more. 
*By drinking a charge, a person is fed for a full day, and after 4 hours of digestion, heals 3 HP!
*3 charges of milky are equivalent to 1 person's nutrients and weight, until it is digested.
*Healing effect does not apply to baseliners.
*Your milk only recharges at the scene's end or after 24 hours, whichever is faster.
*If you've just finished churning prey, you regenerate all of your milk immediately. Drinking your own milk does not affect this.
*You can drink your own milk to keep yourself fed and healed.`,
  },
  {
    id: "the-impregnator",
    name: "THE IMPREGNATOR",
    category: "smut",
    requiredSex: ["Male", "Futa"],
    description: `Your sperm quality is very high, and you produce a lot of it. 

*Must have a penis. 
*When you cum inside someone and they are fertile - you definitely impregnate them. 
*You may cum a lot, enough to stretch them out! Cumflation woe.
*Even after shooting, you can still cum again and again - you are like a bottomless pit of cum.
*When impregnating someone, you can pick specifically which template she will give birth to! You also pick how many they're impregnated with, provided they have the womb capacity for it.
*If interacting with 'baby factory', pick Even or Odd, then roll a 1d6.  You get to pick who they're impregnated with AND how many if it lands favourably.`,
  },
  {
    id: "rewritter",
    name: "Rewritter",
    category: "smut",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `Fucking a PF into rewriting her brain is doable, and you fuck them hard enough to do it regularly!

*Whenever you are having sex with a template, you can hardcore fuck her, and thus, rewrire their brain!
*You can turn them into a template of your choosing. The appearance remains the same though!
*Alternatively, rewire their brain into thinking of you and your teammates as allies - your target will bind to you instead of something else!
*If your target is unwilling, you must be grappling them, or pinning them, before you can start fucking them.
*Whenever fucking them hard, roll your strength against their own.
*You need [Victim's constitution] successes in order to rewrite them. 
*Successes are cumulative, you don't need to get them all in a single roll.`,
  },
  {
    id: "succubus",
    name: "Succubus",
    category: "smut",
    description: `Your sex drive is incessant. 

*Very dark perk, use with care, and with partners who consent and enjoy non-con.
*In a non-con scene ( rape ), you gain +3d6 to your strength to keep them pinned. 
*You now count successes on a 4 and above when doing that.
*For every orgasm, your target loses 1 HP and 1 strength temporarily. At 0 strength, they can no longer resist you.
*You an your partner may arbitrarily decide when an orgasm is had. Otherwise, the target orgasms every time they attempt to resist you.
*A victim may be killed through these means. Gain 2 points if you fuck them dead.
*The perk can be used in consensual scenes, but awards no points then.`,
  },
  {
    id: "baby-factory",
    name: "Baby Factory",
    category: "smut",
    requiredRaces: ["Pilzfraun", "Tierfraun"],
    requiredSex: ["Female", "Futa"],
    modifiers: {
      organCapacityMultipliers: { womb: 27 },
    },
    description: `Your womb is extremely fertile and spacious! 

*You are impregnated for certainty whenever someone with a penis cums inside you. 
*Your womb has 27x the capacity of your stomach and scales accordingly. You still obey encumbrance rules.
*You can choose which templates you give birth to, and you can choose if someone with the 'ever-lasting' perk is birthed or not. You also pick how many you're impregnated with, provided you have the womb capacity for it.
*Being impregnated by a PH does not force you to only birth males from there on out, even if impregnated before getting this perk.
*Your pregnancies last 1 week. You still need the required nutrition to birth someone that fast.
*If interacting with 'THE IMPREGNATOR', pick Even or Odd, then roll a 1d6.  You get to pick who you're impregnated with AND how many if it lands favourably.
*Using the 'in-charge' perk to digest people inside your womb will digest your children.`,
  },
  {
    id: "flasher",
    name: "Flasher",
    category: "smut",
    description: `You love showing your intimates to people, much to their dismay!

*When a combat starts, you may choose to flash your enemy. You must be clothed and visible in order to do so. Flashing is a contested check, your CHARISMA vs their INTELLIGENCE.
*For every success you obtain over your opponent, they remain stunned for that many turns, completely flabbergasted by your deed! The stun ends early if they are damaged in any way.
*A flashed enemy receives -3d6 to perform any actions after the stun is over, for your [CHARISMA] amount of turns. They're distracted!
*Whore.`,
  },
];
