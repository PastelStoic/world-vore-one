import type { PerkDefinition } from "../perks.ts";

export const GIMMICK_PERKS: PerkDefinition[] = [
  {
    id: "innovator",
    name: "Innovator",
    category: "gimmick",
    description:
      `Your character is awfully creative! Or awfully good at stealing others' ideas~ 

*Not applicable for baseliners; PFs only. PFs aren't bright and are generally uncreative - this perk is to circunvent that.
*You get to make up ONE technology and make use of it IRP, so long as it is reasonably believable.
*The technology should be described in your sheet; NOT on the spreadsheet, that one's just for stats.`,
  },
  {
    id: "scrounger",
    name: "Scrounger",
    category: "gimmick",
    description:
      `Somehow, almost as if you are favoured by the gods, you always manage to find exactly what you need, whenever you need it. 

*If you ever need to find something, you do find it - even in unlikely places!
*It takes you time to find the thing. You may take anywhere between 1 to 3 turns to find it, up to GM's discretion. 
*Something that'd be easy to find takes 1 turn, something moderately difficult takes 2, and something super difficult takes 3! 
*There are some things you won't find at all, such as a five-course steak dinner in the middle of a battlefield!`,
  },
  {
    id: "wayfinder",
    name: "Wayfinder",
    category: "gimmick",
    description:
      `You have a perfect sense of where exactly you are in the world.

*Always know the state of the region you are in, as well as local dangers and safe passages, if any.
*Whenever you need to find your way, you always manage to do so.
*Never get lost, even underground or behind enemy lines.`,
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
    id: "allies",
    name: "Allies",
    category: "gimmick",
    description:
      `You know a guy or two, who happens to know another- with connections and stuff! 

*You have a vast connection of allies who are reliable and support you, who may be called upon when needed.
*While they will support you, they aren't brainless, and won't allow you to blatantly scam, kill or harm them!
*Your allies should be described in your sheet; NOT on the spreadsheet, that one's just for stats
*It should be a decently broad group, whom can help you directly. 
*These can be goon NPCs to help you in combat, people you can call upon for advice, so on and so forth.`,
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
    id: "free-range",
    name: "Free range",
    category: "gimmick",
    description:
      `The world is at war. Free travel is greatly limited. You manage to get around, though!

*You always manage to go wherever you need to go, even if the starting point and ending point are at war! 
*If permission is needed, you always have it to go wherever, regardless of your alignments.
*Cross frontlines, cross the globe. Go anywhere, be anywhere, whenever.
*You may not visit innaccessible places, such as crossing the Alps during the winter, or going to antartica!
*You cannot get into restricted places. You can travel freely, you can't enter *any* place freely.`,
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
    id: "authoritarian",
    name: "Authoritarian",
    category: "gimmick",
    description:
      `Your mere presence commands authority! Most will not dare speak ill of you to your face!

*When attempting to intimidate or force someone do something based on your authority, add +4d6 to your charisma.
*You now count count successess on 4 and above when doing that. 
*This is not a generalized charisma buff! You're meant to be a bully with it!`,
  },
  {
    id: "natural-fibster",
    name: "Natural Fibster",
    category: "gimmick",
    description:
      `People will eat your bullshit up like a well baked fresh blueberry pie!

*When trying to lie or manipulate someone, you roll an additional 4d6. 
*You now count successes on 4 and above when doing that.
*This is not a generalized charisma buff! You're meant to lie and manipulate people with it!`,
  },
  {
    id: "emergency-treatment-expertise",
    name: "Emergency treatment expertise",
    category: "gimmick",
    description:
      `You regularly have to tend to people on the very verge of death!

*With this perk, you immediately succeed in stabilizing anyone.
*When you stabilize someone for the first time in a scene, their HP is healed back to 1.
*Only applies once; further stabilizations of the same target do not change their HP.
*Any checks regarding medicine or human biology immediately succeed as well.`,
  },
  {
    id: "master-tactician",
    name: "Master tactician",
    category: "gimmick",
    description:
      `You are a mastermind of tactics; your brain can see the battlefield as though it is top-down. 

*When doing anything related to military strategy, you gain +4d6 to perform it.
*You now count successes on a 4 when doing that.
*When in combat, if you have allies and you are the leader of your party, the entire party gains a flat +1 to their initiative ratings.
*On every turn, freely, you can choose to order an individual ally or give an order for the party.
*If you command an individual ally, they gain +3d6 to do what you command them to, IF they do it of course.
*If you command the entire party, they all gain +1d6 to do what you command them to do, IF they do it of course.
*You must be able to speak in order to give orders. You cannot give orders if you are incapacitated.`,
  },
  {
    id: "hidden-personality",
    name: "Hidden personality",
    category: "gimmick",
    description:
      `You keep yourself on the down-low, people cannot know you very well at a glance. 

*Create a fake sheet and include whatever information you wish inside it. Send it to submissions.
*Create a real sheet and send it to staff in DMs, preferably Doc3613 or PastelStoic
*No one but staff gets access to your real sheet unless you reveal it yourself.
*Inform updates in staff DMs rather than in #character-updates.
*You are expected to keep track of your real sheet somewhere, we won't be reminding you of your stuff all the time.`,
  },
  {
    id: "masterful-linguist",
    name: "Masterful linguist",
    category: "gimmick",
    description:
      `You are a master of communications. You speak clearly, and your ears are awfully sharp! 

*You always manage to communicate with people, even if you would otherwise be unable to.
*Language barriers, being mute, talking through radio interference - you are always clearly understood through this.
*You are never misunderstood, and your interpretations are always correct. 
*You can communicate with animals within reason; you can display you are no threat, for example, and always succeed.
*You may use rp-discussions to talk to players and ask for clarifications on anything AND use it IRP.`,
  },
  {
    id: "hypnotist",
    name: "Hypnotist",
    category: "gimmick",
    description:
      `You are a hypnotist; you can put people into trances which they find hard to break out of! 

*You may try to hypnotize a willing volunteer who plays along with your hypnotization. 
*Roll your charisma. Each success is equivalent to an hour of hypnosis, where the target must follow your commands.
*If the commands bring direct harm to the victim, they may roll intelligence vs your charisma to break free.
*Unwilling targets must be bound and unable to fight back or to just walk away. 
*In such a case, your roll your charisma against their intelligence, as they're trying to resist you!`,
  },
];
