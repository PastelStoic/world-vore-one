import type { PerkDefinition } from "../perks.ts";

export const SMUT_PERKS: PerkDefinition[] = [
  {
    id: "milky",
    name: "Milky",
    category: "smut",
    description:
      `You are always producing milk ( or cum ) at a very substantial rate!

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
    id: "rewritter",
    name: "Rewritter",
    category: "smut",
    description:
      `Fucking a PF into rewriting her brain is doable, and you fuck them hard enough to do it regularly!

*Only for PFs/PHs. 
*Whenever you are having sex with a template, you can hardcore fuck her, and thus, rewrire their brain!
*You can turn them into a template of your choosing. The appearance remains the same though!
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
*In a non-con scene ( rape ), you gain +4d6 to your strength to keep them pinned. 
*You now count successes on a 4 and above when doing that.
*For every orgasm, your target loses 1 HP and 1 strength temporarily. At 0 strength, they can no longer resist you.
*You an your partner may arbitrarily decide when an orgasm is had.
*Otherwise, the target orgasms every time they attempt to resist you.
*A victim may be killed through these means. Gain 2 points if you fuck them dead.
*The perk can be used in consensual scenes, but awards no points then.`,
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
];
