import type { PerkDefinition } from "@/data/perks.ts";

export const GIMMICK_PERKS: PerkDefinition[] = [
  {
    id: "innovator",
    name: "Innovator",
    category: "gimmick",
    customInput: "Describe your invented technology",
    description:
      `Your character is awfully creative! Or awfully good at stealing others' ideas~ 

*Not applicable for baseliners; PFs only. PFs aren't bright and are generally uncreative - this perk is to circunvent that.
*You get to make up ONE technology and make use of it IRP, so long as it is reasonably believable.
*The technology should be described in your sheet.`,
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
    id: "lucky",
    name: "Lucky",
    category: "gimmick",
    description: `Lady luck favours you in particular! 

*You have a pool of 6 dice, which, in a single scene, may be applied into whatever you want. 
*You may choose how many dice to use - you don't need to use all six at once!
*You may only add lucky dice to a check once. Leftover lucky dice are saved and may be used in other rolls.
*The dice only regenerate once the scene is over and a new one starts. You can roll the dice before or after another roll.
*You may burn 2 dice in order to get the effects of another luck related perk ( scrounger, explosive intolerant, etc )
*The effects only apply in the same turn they were called upon.`,
  },
  {
    id: "allies",
    name: "Allies",
    category: "gimmick",
    customInput: "Describe your allies",
    description:
      `You know a guy or two, who happens to know another- with connections and stuff! 

*You have a vast connection of allies who are reliable and support you, who may be called upon when needed.
*While they will support you, they aren't brainless, and won't allow you to blatantly scam, kill or harm them!
*Your allies should be described in your sheet: Who they are, what they do, where they are, etc.
*It should be a decently broad group, whom can help you directly.
*These can be goon NPCs to help you in combat, people you can call upon for advice, so on and so forth.
*You may be accompanied by up to 3 goons, with TWO stats set at 3, and ONE stat set at 4, for each goon.`,
  },
  {
    id: "patron",
    name: "Patron",
    category: "gimmick",
    customInput:
      "Who are your patrons, what do they provide, and your relation?",
    description: `You know people in high places!

*You have a very deep connection with a single person, or group of few individuals. 
*These individuals are powerful in some way ( financially, militarily, etc ), and support you as such. 
*They will assist your endeavours in their respective ways, but will not go out of their way to personally assist you.
*Your patron(s) should be described in your sheet: Who they are, what they do, where they are, etc.
*This perk can partially fill in for another perk so long as such a perk is acquired through some sort of funding or material.
*You may be accompanied by 1 specialist provided by your patron, so long as they fit what you are trying to do.
*The specialist may have TWO stats set at 6, and ONE stat set at 7.`,
  },
  {
    id: "spy",
    name: "Spy",
    category: "gimmick",
    canDisguise: true,
    disguiseCategories: ["combat", "vore", "gimmick"],
    customInput: "Loyal faction and faction you're spying on",
    description: `You are a spy, infiltrated in an enemy faction! Sneaky sneak.

*Specify which faction you are loyal to, and which faction you're spying on, when making your character.
*When attacked by your real faction, you have a signal that identifies your true alignment, and they always recognize it. 
*When doing your spy missions, you are assumed to have all the neccessary tools to carry it out: 
*Lockpicks, silenced gun, cyanide pills, anything that'd be fitting for a spy to have, you can simply conjure out of thin air.
*You cannot be entirely disarmed, you always have items hidden in your body somehow.
*The enemy is right to punish you if you're caught!`,
  },
  {
    id: "beastmaster",
    name: "Beastmaster",
    category: "gimmick",
    customInput: "Your animal companion (species and name)",
    description: `You have a pet animal. How cute! 

*The animal may be common or exotic, whichever you please. 
*Your animal has special training - you can give it basic commands, such as attack, follow, sit, 'get that', etc.
*It must have a sheet of their own, and start off with 9 points and two perks, and gains points at the same rate you do, including freebies.
*Your pet may also use whatever animalistic abilities they have: Flight, smell, sight, etc.
*Your animal can be killed and if killed, the individual cannot be brought back. You may get a new pet - this perk cannot be refunded due to the animal's death! 
*You can command stray animals at will, within reason: A starving wolf will not refrain from eating you. You always understand an animal's body language and intention.
*Have +3d6 when using Charisma against Tierfraun.`,
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
*You cannot get into restricted places. You can travel freely, you can't enter *any* place freely.
*Basically the "Fuck you Doc, I do what I want" perk. You don't ever need to justify why/how you're getting anywhere. You just do.`,
  },
  {
    id: "authoritarian",
    name: "Authoritarian",
    category: "gimmick",
    description:
      `Your mere presence commands authority! Your rank is recognized by all! Most will not dare speak ill of you to your face!

*You are a high rank within an organization, one that is well-known wherever you go, enough that you may pull rank.
*Your rank allows you to go to places you shouldn't be, and talk to people you shouldn't be able to.
*You may requisition fitting items from your organization in order to help you in your endeavours.
*You may intimidate your own allies into breaking out of mental effects, such as being flashed or intimidated by another.
*When attempting to force someone do something based on your authority, add +3d6 to your charisma.
*You now count count successess on 4 and above when doing that. 
*If you succeed in pulling rank, your target(s) must obey your commands, so long as they are not suicidal!
*This is not a generalized charisma buff! You're meant to be pulling rank with it!`,
  },
  {
    id: "natural-fibster",
    name: "Natural Fibster",
    category: "gimmick",
    description:
      `People will eat your bullshit up like a well baked fresh blueberry pie!

*Gain the special 'disguise-kit', which always returns to you somehow!
*When trying to lie or manipulate someone, you roll an additional 3d6, and count successes on 4 and above.
*This is not a generalized charisma buff! You're meant to lie and manipulate people with it!
*You may disguise yourself as other characters, creating fake personas in order to act as them.
*You may ask the owner of that character to post your posts on your behalf, so as to keep up the illusion better.
*Consider sending your posts when you are certain your partner is not looking into the channel.
*Like the 'spy' perk, this perk can be hidden and disguised as another.`,
    grantsEquipment: [
      { equipmentId: "disguise-kit" },
    ],
    canDisguise: true,
    disguiseCategories: ["combat", "vore", "gimmick"],
  },
  {
    id: "frightful-presence",
    name: "Frightful prersence",
    category: "gimmick",
    description:
      `You are particularly terrifying to see, and you scare people easily!

*When trying to intimidate or scare someone, you roll an additional +3d6 charisma, counting successes on 4 and above.
*When intimidating a target, your number of successes over then forces them into a panic! They must spend [SUCCESSES] number of turns running away from you.
*If they are unable to create distance, they must keep you away through other means, including fighting. A cornered rat is very dangerous!
*This is not a generalized charisma buff! You're meant to scare or intimidate people with it!`,
  },
  {
    id: "emergency-treatment-expertise",
    name: "Emergency treatment expertise",
    category: "gimmick",
    description:
      `You regularly have to tend to people on the very verge of death!

*With this perk, you immediately succeed in stabilizing anyone.
*You may stabilize someone if they're at 0HP or below.
*When you stabilize someone for the first time in a scene, their HP is healed back to 1.
*Only applies once; further stabilizations of the same target do not change their HP.
*You always have the resources to treat poisons or other conditions/ailments someone has.
*Any checks regarding medicine or human biology immediately succeed as well.`,
  },
  {
    id: "master-tactician",
    name: "Master tactician",
    category: "gimmick",
    description:
      `You are a mastermind of tactics; your brain can see the battlefield as though it is top-down. 

*When doing anything related to military strategy, you gain +3d6 to perform it.
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
    name: "Cunning linguist",
    category: "gimmick",
    description:
      `You are a master of communications. You speak clearly, and your ears are awfully sharp! 

*You always manage to communicate with people, even if you would otherwise be unable to.
*Language barriers, being mute, talking through radio interference - you are always clearly understood through this.
*You are never misunderstood, and your interpretations are always correct. 
*You can communicate with animals within reason; you can display you are no threat, for example, and always succeed.
*You may use rp-discussions to talk to players and ask for clarifications on anything AND use it IRP.
*Please note that you may still need to clarify things to *players*, as nobody can read your mind in actuality.`,
  },
  {
    id: "hypnotist",
    name: "Hypnotist",
    category: "gimmick",
    description:
      `You are a hypnotist; you can put people into trances which they find hard to break out of! 

*You may try to hypnotize a willing volunteer who plays along with your hypnotization.
*Hypnotization takes some time. Consider it to take 3 turns in time-sensitive scenes.
*Other individuals cannot tell that the victim is hypnotized unless they are familiar with it.
*The Victim forgets about the hynptization once its effects wear off.
*Roll your charisma. Each success is equivalent to an hour of hypnosis, where the target must follow your commands.
*If the commands bring direct harm to the victim, they may roll intelligence vs your charisma to break free.
*Unwilling targets must be bound and unable to fight back or to just walk away. 
*In such a case, your roll your charisma against their intelligence, as they're trying to resist you!`,
  },
];
