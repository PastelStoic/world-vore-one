import type { PerkDefinition } from "@/data/perks.ts";

export const VORE_PERKS: PerkDefinition[] = [
  {
    id: "survivor",
    name: "Survivor",
    category: "vore",
    description:
      `You have survived many stomachs before, or otherwise you're naturally good at escaping them!

*When rolling to avoid being grappled or swallowed, gain +3d6. Gain a flat +3 to the 'escape training' stat.
*Gain +3 escape attempts OR set your escape attempts to an exact 3; whichever would benefit you more when ingested.
*Ignores any perks that'd prevent you from doing escape attempts, regardless of conditions. You still digest at the exact same speed.`,
    modifiers: {
      baseStatBonuses: { escapeTraining: 3 },
    },
  },
  {
    id: "natural-predator",
    name: "Natural predator",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `You are a man-eater and devour others without much difficulty at all. 

*When rolling to grapple, swallow and to keep prey down, gain +3d6, counting successes on a 4 and above.`,
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
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description: `You are closer to a furnace than a real person! 

*Your points in digestion strength are quadrupled. 
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
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `You have an unreal amount of control over your digestive system! Mostly narrative perk.

*By default rules, stomachs always digest, whereas other organs are always safe. This perk circumvents the rule.
*Pick, whenever, if any organ will digest or hold its prey safely. Have full control over how your acids feel and how your stomach treats its prey.
*You can move a person from an organ to another, immediately, as a contested STR vs Escape Training check. The organs must be directly connected.
*You may freely allocate where the fat from digested prey goes, including 'living-fat-advisors' or 'ever-lasting' prey. You may stop their shenanigans at will.`,
  },
  {
    id: "unreal-capacity",
    name: "Unreal capacity",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
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
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `Once prey has grown weak and soft enough, they can't find a way out of you at all! 

*If prey is at, or reaches 0HP or lower, once swallowed, they cannot attempt any escapes.
*They may only be rescued by someone from the outside, or released!`,
  },
  {
    id: "hauling-meat",
    name: "Hauling meat",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description: `You've very strong legs! Carrying prey around is no biggie.

*People weight only 1 weight when eaten by you. Vehicles have 1/10th of their weight, rounded down.
*If the prey has the "heavy" perk, typical rules apply.`,
  },
  {
    id: "heavy",
    name: "Heavy",
    category: "vore",
    description:
      `Fatty! You keep your predator pinned with your weight, or your struggles are very destabilizing!

*This may be justified through you being very heavy, or your struggles being too strong to move around with.
*You now have a fixed weight of 15, and when eaten, you always make your predator immobile, with penalties applied, even if they have sufficient strength.
*You take up 6 organ capacity when eaten - you cannot be eaten if your predator lacks the organ capacity!
*If the pred has "hauling-meat", typical rules apply instead.`,
  },
  {
    id: "internal-fighter",
    name: "Internal fighter",
    category: "vore",
    description:
      `You must certainly be mad! Rather than fighting outside of your predator, you'd rather do so from the inside!

*When eaten and rolling to escape, instead, you may try to damage your predator. This must be declared before rolling, or it defaults to an escape attempt.
*For every success over your predator, you deal 2 damage to your predator. A predator that is incapacitated or in critical condition can still keep you down. A dead predator can be escaped freely as an action.
*Fighting your predator is not considered an "escape" attempt, perks that'd help in keeping prey inside do not apply, such as 'natural predator'.
*You still move between organs while fighting, as if doing escape attempts. The predator does not add the difference in strengths if you're fighting rather than escaping.`,
  },
  {
    id: "prey-as-armour",
    name: "Prey-as-armour",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description: `You have a person inside you! That's basically cover, right? 

*Damage reduction from other items/perks apply before this perk's own. The protection & effects only apply in the same direction your organ is facing.
( Stomach, breasts, and womb protect from the front, but not sides and rear! But a tail would protect from the rear - however, not the front! )
--->If you have prey inside you, dead or alive:
*Have +2d6 to cover rolls, and cover is two tiers higher. 
*When attacked, live prey takes all damage in your stead. If your prey is dead, only take 1 damage instead. Does not apply against explosions.
*Prey that have gone through 2/3rds or more of their entire processing time no longer provide damage reduction/transference.`,
  },
  {
    id: "assimilator",
    name: "Assimilator",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description: `You transform other people into strength for yourself.

*When digesting prey, you gain an additional point, whether it was willing or unwilling vore.
*The whole proccess must be done by you. If they were softened up by someone else's enzymes, perk does not apply.`,
  },
  {
    id: "crusher",
    name: "Crusher",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `Your prey is MEANT to stay inside you! They better not fight back, lest they want to be punished! 

*If your prey rolls to escape your stomach and fails, they take 2 damage for every success you have over their own.
*Prey can be killed through these means! Digesting their body still takes the usual time, this does not speed it up at all.
*Incapacitated prey is still fighting back! Prey only stop fighting if they're dead or have run out of escape attempts.`,
  },
  {
    id: "ever-lasting",
    name: "Ever lasting",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description: `You are never truly gone. You always come back! Even when digested, you live on as fat within your predator's body!

*You may inhabit a bodypart of your predator of your choosing - you cannot change this choice! You have minimal control over this bodypart, but the predator can, freely, shut you down and keep you from doing anything.
*When your predator gives birth OR impregnates someone, your consciousness is transfered to that body and you live on! if you are a template, they are guaranteed to birth a copy of your template.
*Otherwise, you'll be alive, but with a different body and appearance. Make a new sheet to reflect this, keeping the point totals and number of perks. 
*The Intelligence and Charisma stats remain the same, but points in strength, dexterity and constitution may be rearranged.
*Perks related to your physicality can be changed ( hard to churn, unreal capacity, living furnace, etc ).
*perks related to skills ( gunner, melee fighter, materful linguist, etc ), belongings ( Sig. Weapon, beastmaster, allies, etc ) may not be changed.`,
  },
  {
    id: "living-fat-advisors",
    name: "Living fat advisors",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description:
      `The dead remain within you after churning, awakening as your fat!

*Only Pilzfrauns and their variants may become advisors - baseliners digest away normally.
*The advisor picks a body part to live on as. They'll retain their consciousness and memories. The predator can hear them within their mind.
*The living fat has control over the body part they inhabit: You may lactate or grow hard spontaneously, etc. The predator requires a constitution vs constitution contested check to make them stop.
*The in-charge perk allows you to choose where the prey ends up in, and you can stop their shenanigans at will.
*For as long as you have the living fat within your body, you add their stats to your own. For every living fat advisor residing within you, you must eat one prey every 3 scenes - otherwise, the fat burns away.
*Failing to eat prey makes the advisor go away. The advisors are lost in order of acquiral!  Eating NPCs does not count, you must feed on RPers' characters!`,
  },
  {
    id: "bacta-tank",
    name: "Bacta tank",
    category: "vore",
    requiredRaces: ["Pilzherr", "Pilzfraun", "Tierherr", "Tierfraun"],
    description: `You are oh so caring for your allies, oh my my!~

*Your womb or balls can heal! People you unbirth or cockvore, get to heal inside you! They will gain HP at the same rate they'd otherwise lose HP from digestion.
*If you have the 'in-charge' perk, you can choose to heal with any orifice. Characters in critical condition are stabilized whilst inside a bacta-tank orifice; however ...
*If they're still in negative HP when spat out, they'll return to critical condition.`,
  },
  {
    id: "stuffer",
    name: "Stuffer",
    category: "vore",
    description:
      `You actively want to shove yourself or others into the tummies of your predators, or to just stuff them 'till they can't eat anything else!

*When rolling to grapple, force-feed yourself or others to someone, and to keep the target from regurtitating, gain +3d6, and count successes on 4 and above.
*You must be grappling the victim in order to force-feed them to someone else. You do not need to grapple a predator in order to self-feed, you may attempt it right away.
*Alternatively, stuff a predator with food! Each unit of food has 1 weight, and counts as a person for organ-capacity calculation. No need to grapple, you may attempt it right away.
*You can force yourself inside a predator even if they've regurgitated you already, as you force through their post-regugitation disgust.
*You can stuff someone up to 5 times their organ-capacity. For every point past their limit, they take 1 damage every turn.
*Your target can try to regurgitate the contents of their stomach. So long as you are both in the same distance, you can prevent this as a free action. It is a contested STR vs STR check.
*If you have the 'milky' perk, you can force-feed your target with your milk/cum/whatever you produce as well!`,
  },
  {
    id: "last-ditch-escapee",
    name: "Last ditch escapee",
    category: "vore",
    description:
      `When things are tough, you always seem to get hit by a strong second wind!

*If you are inside someone and at 0HP or below ( not self-inflicted ), gain +6d6 to escape their stomach, counting successes on a 4 and above.

->If you escape, you are hit with an "escapist's rush": 
*The rush lasts 10 turns, or 10 minutes, whichever is faster. For the duration, you have the 'runner' perk.
*You cannot be incapacitated for the duration of your rush. Whenever hit, roll constitution, you need 1 + [how negative your HP is] successes in order to keep the rush.
*Once your rush is over, you 'crash' out.

->Crash out:
*You are incapacitated until your HP heals back to full. You cannot do any escape rolls if you are eaten.`,
  },
  {
    id: "open-ended-tail",
    name: "Open ended tail",
    category: "vore",
    requiredRaces: ["Tierfraun", "Tierherr"],
    customInput: "Normal or mouthless?",
    modifiers: {
      grantsOrgans: ["tail"],
    },
    description:
      `Through some sort of strange mutation, your tail isn't normal - it's fleshy, stretchy, and opens near the end!

*This perk gives you a special tail that may be used to hold onto things and people alike, but it cannot manipulate them.
*It can be used to eat prey without grappling first AND from 1 distance away; it can fit 2 prey by default and digests by default.
*The tail leads straight into the stomach. After 2 escape attempts, prey may be pushed into the stomach.
*It is constantly dripping acid from the tip, making you easy to track.

->Mouthless variant:
*You may optionally choose to have no mouth at all. If so, you cannot vocalize any sounds and cannot eat normally, having to do so through your tail.
*Once prey is brought to your stomach, they must escape into the tail, as escaping through your mouth is impossible.`,
  },
  {
    id: "survival-experience",
    name: "Survival experience",
    category: "vore",
    description:
      `Whenever you come close to death, your experience is always remembered and you take good mental notes for the future!

*As unwilling prey, if you escape a predator and live to tell the tale, you gain +2 points.
*As unwilling prey, if you digest AND are a template, you gain +1 point, as natural selection killed off a weak link of your template!
*You may only get the first or second conditionals, both do not trigger together in a single scene.
*The first conditional stacks - escaping multiple predators in a single scene and living grants cumulative points.`,
  },
  {
    id: "grabby",
    name: "Grabby",
    category: "vore",
    description:
      `You are a grabby one! Your touchy hands rarely let go of people.

*This perk only applies if both of your hands are free and usable. This perk is made invalid if you are lacking a hand.
*Gain +3d6, counting successes on 4 or above, in order to grapple targets. Your targets must roll twice in order to escape your grapple, taking the worst result.
*You may grapple up to [STRENGTH] targets in one action, and you may grapple them from 1 distance away, immediately bringing them to your distance if you succeed.
*When attacked in melee, you may attempt to grapple your target as a free action. If a target manages to escape your stomach, they come out still grappled by you.`,
  },
];
