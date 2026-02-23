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

## Description

A simple description of the character.

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

Like stat points, characters may spend perk points to unlock perks. Each
character starts with 1 perk point. They may spend 3 stat points to buy 1 perk
point.

Some perks directly modify stats, while others only apply during gameplay. These
are some examples of perks:

1. Tough: doubles health.
2. unreal capacity: triples organ capacity.

If a character has unspent perk points, they may click an "add perk" button to
see a list of perks, then click on one of them to buy it.
