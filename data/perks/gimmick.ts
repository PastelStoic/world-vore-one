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
*You get to make up ONE technology and make use of it IRP, so long as it is reasonably believable. The technology should be described in your sheet.`,
  },
  {
    id: "scrounger",
    name: "Scrounger",
    category: "gimmick",
    description:
      `Somehow, almost as if you are favoured by the gods, you always manage to find exactly what you need, whenever you need it. 

*If you need to find something, you do find it, even in unlikely places.
*Searching for the desired object takes time, anywhere between 1 to 3 turns, based on how unlikely you are to find it.
*Something that is easy to find would take 1 turn, whereas something really difficult would take 3 turns.`,
  },
  {
    id: "lucky",
    name: "Lucky",
    category: "gimmick",
    description: `Lady luck favours you in particular! 

*You have a pool of 6 dice, which may be applied into any rolls you perform, before or after rolling. Dice may only be applied to an individual roll once.
*You may choose how many dice to spend - you do not need to use all into a single roll. Your dice only regenerate at scene end.
*You may also burn 2 dice to get the effects of a luck related perk, such as scrounger, explosive intolerant, etc.
*The effects only apply in the same turn they were used.`,
  },
  {
    id: "allies",
    name: "Allies",
    category: "gimmick",
    customInput: "Describe your allies",
    description:
      `You know a guy or two, who happens to know another- with connections and stuff! 

*You have a vast connection of allies who are reliable and support you, who may be called upon when needed. They are not brainless, and will not accept being abused/scammed/harmed by you.
*Your allies should be described in your sheet, and should be a decently broad group, whom can help you directly. They can help you in combat, offer advice, etc.
*You may be accompanied by up to 3 goons, each with two stats set at 3, one stat set at 4, and 3 pieces of free gear. No perks.`,
  },
  {
    id: "patron",
    name: "Patron",
    category: "gimmick",
    customInput:
      "Who are your patrons, what do they provide, and your relation?",
    description: `You know people in high places!

*You have a very deep connection with a single person, or group of few individuals. They are powerful in some way, and offer you their full support.
*Your patron(s) should be described in your sheet. They will not go out of their way to personally assist you, they are too important for that.
*So long as it is used to further your patron's interests, for a scene:
->You may be accompanied by 1 especialist provided by your patron, with two stats set at 6, one stat set at 7, 3 pieces of any equipment, one perk, and one fitting vehicle.
->You may get the effects of another perk, so long as it could be acquired through funding or material, as well as equipment/vehicles.
->You lose all of this once the scene is over.
*On your sheet, mark weapons, equipment, vehicles, attachments, and perks as Patron to take them for free.`,
  },
  {
    id: "spy",
    name: "Spy",
    category: "gimmick",
    canDisguise: true,
    disguiseCategories: ["combat", "vore", "gimmick"],
    customInput: "Loyal faction and faction you're spying on",
    description: `You are a spy, infiltrated in an enemy faction! Sneaky sneak.

*You must explicit out who you are loyal to, and who you are spying on.
*When interacting with your allies, you have a signal that immediately, without fail, identifies your true alignment.
*You always have spy gear, such as lockpicks, silenced gun, etc. You can conjure such items out of thin air as if you had them all along!
*You cannot be entirely disarmed, you always have items hidden in your body somehow.`,
  },
  {
    id: "beastmaster",
    name: "Beastmaster",
    category: "gimmick",
    customInput: "Your animal companion (species and name)",
    description: `You have a pet animal. How cute! 

*You have an animal with special training, they understand basic commands, such as follow, attack, etc.
*Your animal must have a sheet of their own, they have 12 points, two perks, and gain point as the same rate as you do, including freebies.
*Your animal can also make use of its natural abilities, such as flight, smell or etc.
*You can command stray animals at will, and always understand them. Note that an already hostile animal will not obey you.
*Have +3d6 when using charisma against a Tierfraun.`,
  },
  {
    id: "free-range",
    name: "Free range",
    category: "gimmick",
    description:
      `The world is at war. Free travel is greatly limited. You manage to get around, though!

*Cross frontlines, cross the globe. Go anywhere, be anywhere, whenever. You cannot go to completely innaccessible places, like antartica!
*You always manage to go wherever you need, even if moving through warring states. You cannot enter restricted places that'd require permission.
*Basically the "Fuck you Doc, I do what I want" perk. You don't ever need to justify why/how you're getting anywhere. You just do.`,
  },
  {
    id: "authoritarian",
    name: "Authoritarian",
    category: "gimmick",
    description:
      `Your mere presence commands authority! You are a high rank within a renowed organization!

*When attempting to force someone do something based on your authority, gain +3d6, rolling successes on a 4 and above.
*You may use your rank to command others, and they must obey your commands, so long as they are not suicidal!
*You may intimidate your own allies into breaking out of mental effects, such as being flashed or intimidated by another.
*Your disappearance is a big deal - an investigation can be launched upon a character that kills you. Anyone, once per week, may launch one.
*When trying to investigate, both the investigator and the target roll a contested INT vs INT check.
*If the investigator wins, the character's deeds are found out! They may be prosecuted or hunted in vengeance!`,
  },
  {
    id: "natural-fibster",
    name: "Natural Fibster",
    category: "gimmick",
    description:
      `People will eat your bullshit up like a well baked fresh blueberry pie!

*When lying or manipulating someone, gain +3d6, and count successes on 4 and above.
*Gain the special 'disguise-kit', which always returns to you somehow! You may disguise yourself as other characters, creating fake personas in order to act as them. 
*You may ask the owner of that character to post your posts on your behalf, so as to keep up the illusion better, or create a fake tupper.
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
    name: "Frightful presence",
    category: "gimmick",
    description:
      `You are particularly terrifying to see, and you scare people easily!

*When trying to intimidate or scare someone, gain +3d6, and count successes on a 4 and above.
*When intimidating a target, your number of successes over then forces them into a panic! They must spend [SUCCESSES OVER THEM] number of turns running away from you.
*If they are unable to create distance, they must keep you away through other means, including fighting. A cornered rat is very dangerous!`,
  },
  {
    id: "emergency-treatment-expertise",
    name: "Emergency treatment expertise",
    category: "gimmick",
    description:
      `You regularly have to tend to people on the very verge of death!

*Immediately succeed in stabilizing someone, always. When you stabilize someone, their HP is healed back to 1, only once per target.
*You always have the resources to treat poisons or other conditions/ailments someone has, immediately curing physical effects they may have.
*You may heal targets with an intelligence check - each success heals 1 HP. A single target can only receive up to your [INTELLIGENCE] healing within a scene.
*Ignore tatuses that'd prevent a person from being stabilized, such as 'crash out'. Any checks regarding medicine or human biology immediately succeed.`,
  },
  {
    id: "master-tactician",
    name: "Master tactician",
    category: "gimmick",
    description:
      `You are a mastermind of tactics; your brain can see the battlefield as though it is top-down. 

*When doing anything related to military strategy, gain +3d6, and count successes on 4 and above.
*When in combat, if you have allies and you are the leader of your party, the entire party gains a flat +1 to their initiative ratings.
*On every turn, freely, you can choose to order an individual ally or give an order for the party.
*If you command an individual ally, they gain +3d6 to do what you command them to, IF they do it.
*If you command the entire party, they all gain +1d6 to do what you command them to do, IF they do it.
*You must be able to speak in order to give orders. You cannot give orders if you are incapacitated.`,
  },
  {
    id: "hidden-personality",
    name: "Hidden personality",
    category: "gimmick",
    description:
      `You keep yourself on the down-low, people cannot know you very well at a glance. 

*Write a fake sheet and include whatever information you wish inside it. Send it to submissions. Write a real sheet and send it to staff in DMs, preferably Doc3613.
*No one but staff gets access to your real sheet unless you reveal it yourself. Inform updates in staff DMs rather than in #character-updates.
*You are expected to keep track of your real sheet somewhere, we won't be reminding you of your stuff all the time.`,
  },
  {
    id: "masterful-linguist",
    name: "Cunning linguist",
    category: "gimmick",
    description:
      `You are a master of communications. You speak clearly, and your ears are awfully sharp! 

*You always manage to communicate with people, even if you would otherwise be unable to. Language barriers, being mute, talking through radio interference - you are always clearly understood.
*You are never misunderstood, and your interpretations are always correct: You may use rp-discussions to talk to players and ask for clarifications on anything AND use it IRP.
*Please note that you may still need to clarify things to *players*, as nobody can read your mind in actuality.`,
  },
  {
    id: "hypnotist",
    name: "Hypnotist",
    category: "gimmick",
    description:
      `You are a hypnotist; you can put people into trances which they find hard to break out of! 

*You may try to hypnotize a willing volunteer who plays along with your hypnotization. This takes 3 turns. Roll a charisma check, your victim is hypnotized for [SUCCESSES] hours.
*Unwilling targets must be bound, unable to fight back or to just walk away. Roll your charisma against their intelligence, as they're trying to resist you!
*Other individuals cannot tell that the victim is hypnotized, and the victim forgets about the hypnotization once its effects wear off - it is like there's a blank in their memory.
*If the commands bring direct harm to the victim, they may roll intelligence vs your charisma to break free.`,
  },
];
