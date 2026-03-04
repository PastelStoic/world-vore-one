import type { PerkDefinition } from "../perks.ts";

export const VORE_PERKS: PerkDefinition[] = [
  {
    id: "survivor",
    name: "Survivor",
    category: "vore",
    description:
      `You have survived many stomachs before, or otherwise you're naturally good at escaping them! 

*You roll an extra 4d6 to avoid being eaten and gain +4 to your escape training stat.
*Gain +3 escape attempts OR set your escape attempts to an exact 3; whichever would benefit you more when ingested.
*Ignores any perks that'd prevent you from doing escape attempts, regardless of conditions.`,
  },
  {
    id: "natural-predator",
    name: "Natural predator",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description:
      `You are a man-eater and devour others without much difficulty at all. 

*You roll an extra 4d6 to grapple, swallow and to keep prey down. 
*You now count successes on a 4 and above, rather than a 5 and above, to do that.`,
  },
  {
    id: "hard-to-churn",
    name: "Hard to churn",
    category: "vore",
    description:
      `You're naturally resilient to digestion somehow, or you're just very willful to survive! 

*Your points in Digestion Resilience are quadrupled.`,
    modifiers: {
      digestionResilienceMultiplier: 4,
    },
  },
  {
    id: "living-furnace",
    name: "Living furnace",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You are closer to a furnace than a real person! 

*Your points in digestion strenght are quadrupled. 
*You can digest any objects you eat. Based on the material, it'll have 4/8/12 digestion resilience.
*Digesting an object depends on its resilience - it takes as long as a person would with that same resilience.`,
    modifiers: {
      digestionStrengthMultiplier: 4,
    },
  },
  {
    id: "in-charge",
    name: "In charge",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description:
      `You have an unreal amount of control over your digestive system! Mostly narrative perk.

*By default, stomachs always digest, balls, womb and breasts are always safe. This perk ignores that.
*You may decide if any organ is capable of digesting prey or holding them safely, whenever you wish. 
*This does include changing how your acid feels, from painful to painless, numbing, pleasurable, etc. 
*You may control how harsh or how nice the environment inside you is. 
*You may choose how the fat of your prey is allocated within your body. 

*You may move a person from one organ to another immediately as an action, it is a contested STR vs Escape Training check.
*The organs must be connected, no sending prey from your stomach into your tits or womb!
*Your control gives you +1d6 to keeping prey down.
*You can choose where someone with the living-fat-advisor perk ends up in, and you can stop their shenanigans at will.`,
  },
  {
    id: "unreal-capacity",
    name: "Unreal capacity",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You are unreasonably stretchy!

*The capacity of each organ is tripled. You may get this perk multiple times and the benefits stack multiplicatively`,
    modifiers: {
      organCapacityMultiplier: 3,
    },
    upgradable: true,
  },
  {
    id: "inescapable",
    name: "Inescapable",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description:
      `Once prey has grown weak and soft enough, they can't find a way out of you at all! 

*If prey is at 0 HP, or is brought to 0 HP, and they're inside you - they cannot attempt any escapes! 
*They may only be rescued by someone from the outside, or released!`,
  },
  {
    id: "hauling-meat",
    name: "Hauling meat",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You've very strong legs! Carrying prey around is no biggie.

*People weight only 1 weight when eaten by you. Does not apply to their equipment: Strip 'em! 
*If the prey has the "heavy" perk, typical rules apply.`,
  },
  {
    id: "heavy",
    name: "Heavy",
    category: "vore",
    description:
      `Fatty! You keep your predator pinned with your weight, or your struggles are very destabilizing!

*This may be justified through you being very heavy, or your struggles being too strong to move around with.
*When eaten by someone, you make them immobile, and they receive the respective penalties!
*If the pred has "hauling-meat", typical rules apply instead.`,
  },
  {
    id: "internal-fighter",
    name: "Internal fighter",
    category: "vore",
    description:
      `You must certainly be mad! Rather than fighting outside of your predator, you'd rather do so from the inside!

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
    id: "prey-as-armour",
    name: "Prey-as-armour",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You have a person inside you! That's basically cover, right? 

*Damage reduction from other items/perks apply before this perk's calculations are done.
---->If you have someone inside you and whenever attacked from the front specifically:
*You take only 1 damage and your prey takes the remainder. 
*If the attack only dealt 1 damage, you take the damage and your prey takes none. 
*You always take 1 damage, it cannot be lowered further with this perk.
*Once the prey is dead, they no longer soak up any damage. Your prey must be alive for this perk to apply.`,
  },
  {
    id: "assimilator",
    name: "Assimilator",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You transform other people into strength for yourself.

*When digesting prey, you gain an additional point, whether it was willing or unwilling vore.
*The whole proccess must be done by you. If they were softened up by someone else's enzymes, perk does not apply.`,
  },
  {
    id: "crusher",
    name: "Crusher",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description:
      `Your prey is MEANT to stay inside you! They better not fight back, lest they want to be punished! 

*If your prey rolls to escape your stomach and fails, they take 1 damage for every success you have over their own.
*Prey can be killed through these means! Digesting their body still takes the usual time, this does not speed it up at all.
*Incapacitated prey is still fighting back! Prey only stop fighting if they're dead or have run out of escape attempts.`,
  },
  {
    id: "ever-lasting",
    name: "Ever lasting",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You are never truly gone. You always come back!

*When churned, you continue on as living fat within your predator's body! 
*Even if your predator slims down, you still manage to live on, that's how resilient you are!
*You are able to speak with your predator and control a bodypart you inhabit, however ...
*The predator can easily shut you down and keep you from doing anything, contrary to 'living-fat-advisors'.
*When your predator gives birth OR impregnates someone, your consciousness is transfered to that body and you live on! 
*You'll be alive, but with a different appearance.`,
  },
  {
    id: "living-fat-advisors",
    name: "Living fat advisors",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description:
      `The dead remain within you after churning, awakening as your fat!

*Prey must pick a bodypart ( Boobs, butt, belly, testicles, balls, etc ) to live on as. They'll retain their consciousness and memories.
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
    id: "bacta-tank",
    name: "Bacta tank",
    category: "vore",
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    description: `You are oh so caring for your allies, oh my my!~

*Your womb or balls can heal! People you unbirth or cockvore, get to heal inside you! 
*They will gain HP at the same rate they'd otherwise lose HP from digestion.
*If you have the 'in-charge' perk, you can choose to heal with any orifice, on top of the other benefits the in-charge perk gives.
*Characters in critical condition are stabilized whilst inside a bacta-tank orifice; however ...
*If they're still in negative HP when spat out, they'll return to critical condition.`,
  },
  {
    id: "stuffer",
    name: "Stuffer",
    category: "vore",
    description:
      `You actively want to shove yourself into the tummies of your predators and keep yourself in!

*You gain 4d6 to grapple, stuff yourself into a predator and keep yourself in there! 
*You now count successes on a 4 and above, rather than 5 and above, to do that.`,
  },
  {
    id: "forceful-feeder",
    name: "Forceful feeder",
    category: "vore",
    description:
      `You like to see others get stuffed to the very brim - and then push them past it!

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
    description:
      `When things are tough, you always seem to get hit by a strong second wind!

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
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    modifiers: {
      grantsOrgans: ["tail"],
    },
    description:
      `Through some sort of strange mutation, your tail isn't normal - it's fleshy, stretchy, and opens near the end!

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
    requiredRaces: ["Pilzherr","Pilzfraun","Tierherr","Tierfraun"],
    modifiers: {
      grantsOrgans: ["tail"],
    },
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
