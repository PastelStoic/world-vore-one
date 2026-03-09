# World Vore One Character Sheet

This project has been initialized using the Fresh framework, which runs on Deno
and uses Preact for UI. Use Deno KV for storage.

This website that allows users to create and edit a simple tabletop character
sheet. This sheet has the following:

## Race

A character's race is usually cosmetic, but sometimes includes modifiers such as
built-in perks. This is a dropdown with the following options:

1. Pilzfraun
2. Tierfraun
3. Baseliner

If chosen race is Tierfraun, a second dropdown appears, requiring the user to
select an animal type.

## Description

**Is a template:** [ Y/N. Only for Pilzfraun. ] **Country of origin:** [ Where
you were born, regardless of type ]. **Faction:** [ Which faction your character
belongs to, if any. ]. **Role:** [ What you do! Cook, politician,
soldier, sapper, conscript, etc. Humans _must_ be commanders, they are too
valuable to lose as regular foot soldiers. ]

**Name:** [ Name ] **Age:** [ If Baseliner, must be 18+. If Pilzfraun,
biological age is 21 by default. Include CHRONOLOGICAL AGE, noting that we are
in 1922 ]. **Date of birth:** [ M/D/Y. Year is MANDATORY, day and month are
OPTIONAL. We are in 1922. IRP month/day corresponds to IRL month/day ] **Sex:**
[ If Baseliner, may be male or female. If Pilzfraun, must be female/futa, males
need a perk in #pf-type-perks ]. **Height:** **Weight:**

[ The six appearance related options below may be left unfulfilled if using an
image to represent your character. ]

**Skin color:** **Hair color:** **Eye color:** **Ethnicity:** **Body type:**
**General appearance:**

**General Health:** [ Include only permanent factors, be them physical, mental,
or something else. I.E: Scars, missing limbs, mental conditions, etc. Note that
baseliners may be as unhealthy as you want - but an unhealthy Pilzfraun is a
rarity, and often gets replaced! ]

**Personality:** [ How your character behaves! ]

**Biography:** [ Essentially your backstory and other things of note. PF girls
should have a simpler one for the most part, as they are birthed for a single
purpose, and are expected to do it for the rest of their lives. ]

## Base Stats

Each of these are numbers, defaulting to 1.

1. Strength
2. Dexterity
3. Constitution
4. Intelligence
5. Charisma
6. Escape Training
7. Digestion Strength
8. Digestion Resilience

A character starts with 5 unallocated stat points. They can spend 1 point to
increase one of the above stats by 1. Their current stat point total should be
shown, decreasing when a stat is increased.

## Other stats

You also have other stats, which cannot be directly increased. These

1. Health (Equal to your Constitution)
2. Carry capacity (equal to your strength plus 2)
3. Organ capacity (base of 2)

A character may also have perks, which further increase the effective total of
these stats. For the base stats, the base value (without perks) and effective
value (including perks) should be shown seperately, with the effective value
calculated rather than saved. Use a unique function for calculating each, so
that adding new modifiers in the future is easy. For the other stats, only the
effective value should be shown.

## Perks

Like stats points, characters may spend stat points to unlock perks. Each
character may unlock one perk for free, and may spend 3 stat points to buy
additional perks.

Some perks directly modify stats, while others only apply during gameplay. These
are some examples of perks:

1. Tough: doubles health.
2. unreal capacity: triples organ capacity.

If a character has unspent perk points, they may click an "add perk" button to
see a list of perks, then click on one of them to buy it.

## Weight and Encumbrance

Carrying equipment, cargo, or people (including inside of you) increases your
carried weight.

If your carried weight exceeds your Carry capacity, you become Encumbered.

If it exceeds double your carry capacity, you are Heavily Encumbered.

If it exceeds triple your carry capacity, you are Immobile.

Every encumbrance level reduces your dex and strength by 1, though these cannot
be reduced below 0. While Immobile, you are unable to move. The 'runner' perk is
affected by encumbrance.

For example, if your carry capacity is 3, you are Unencumbered up to 3 carried
weight, Encumbered up to 6, Heaily Encumbered up to 9, and Immobile beyond that.

## Skill Checks

When performing a skill check, you roll a d6 (random integer from 1 to 6,
inclusive) for each point in the applicable skill.

A strength of 3 means you can roll 3 d6s on a strength check. A dex of 5 means
you can roll 5 d6s on a dexterity check.

You obtain successes when rolling a 5 or a 6. The number of successes you get
determine whether you pass the check. Check difficulty is decided by the GM.

## Contested checks

In a contested check, the difference in a skill between two players modifies
their total dice to roll.

When grappling, if you have 5 strength and your opponent has 3, you gain an
extra two dice to your check. This means you'd roll 7 d6, wheras they roll
only 3.

## Incapacitation

When a non-incapacitated player is damaged, and their HP is brought to zero or
below, their HP will be set to zero, and they become incapacitated.

While incapacitated, they cannot do anything, and automatically fail any checks.
They are alive, however, and will recover over time.

If they're damaged while incapacitated, their HP goes into the negatives and
they're put into critical condition, and will eventually die if not treated. If
a player's health is brought below the negative of their base health - for
example, a player with 5 hp going below negative 5 - they are killed.
