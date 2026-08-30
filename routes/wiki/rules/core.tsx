import { define } from "@/utils.ts";
import {
  RulesCallout,
  RulesSection,
  RulesToc,
  WikiRulesLayout,
} from "@/components/WikiRulesLayout.tsx";

export default define.page(function WikiRulesCore() {
  return (
    <WikiRulesLayout
      title="Core Rules"
      description="How the system fundamentally works: dice, checks, turns, stats, and actions."
      currentHref="/wiki/rules/core"
    >
      <RulesToc
        items={[
          { id: "dice", label: "Dice and checks" },
          { id: "turns", label: "Turns and actions" },
          { id: "points", label: "Points and perks" },
          { id: "stats", label: "The five stats" },
          { id: "helping", label: "Helping someone" },
          { id: "lying", label: "Figuring out if someone is lying" },
          { id: "misc-actions", label: "What is an action" },
        ]}
      />

      <RulesSection id="dice" title="Dice and checks">
        <p>
          You roll 1d6 for each point in the relevant stat. You obtain a success
          whenever you roll a 5 or a 6, unless a perk says otherwise.
        </p>
        <RulesCallout>
          <p>
            <strong>Example:</strong>{" "}
            a 5d6 in strength means you roll five six-sided dice. If you roll
            {" "}
            {"{6, 5, 4, 4, 2}"}, you have two successes: the six and the five.
          </p>
        </RulesCallout>
        <p>
          A <strong>check</strong>{" "}
          is called when you must use a stat to clear an obstacle. You roll your
          [stat]d6s.
        </p>
        <p>
          For most checks, a single success is enough to pass. The GM sets the
          difficulty, and may require two or more successes.
        </p>
        <p>
          Some checks are{" "}
          <strong>contested</strong>: you and your opponent both roll, and
          whoever has the most successes wins. On a tie, the defender (the one
          not initiating the contest) always wins, unless stated otherwise.
        </p>
      </RulesSection>

      <RulesSection id="turns" title="Turns and actions">
        <p>
          The game works by turns. You take your turn, then your opponent takes
          theirs. During your turn you can take only <strong>one</strong>{" "}
          action. Shoot, reload, move, stab — only a single action.
        </p>
        <p>
          Some actions are{" "}
          <strong>free actions</strong>. You can take as many free actions as
          you have, alongside your actual action.
        </p>
      </RulesSection>

      <RulesSection id="points" title="Points and perks">
        <p>
          Like most TTRPGs, your character's capabilities are turned into
          numbered parameters. In this system those are points and perks.
        </p>
        <p>
          Points are invested into your stats. Each point added to a stat
          increases its dice pool. Every stat starts at 1 by default.
        </p>
        <RulesCallout>
          <p>
            <strong>Example:</strong>{" "}
            you have 1 strength by default. You can spend 3 points to bring it
            to 4. You then roll 4d6 whenever a strength check is called.
          </p>
        </RulesCallout>
        <p>
          A perk is a gimmick you can add to your character. They are listed in
          the{" "}
          <a href="/wiki/perks" class="text-primary hover:underline">
            perks wiki
          </a>
          , with related gear in{" "}
          <a href="/wiki/equipment" class="text-primary hover:underline">
            equipment
          </a>{" "}
          and{" "}
          <a href="/wiki/weapons" class="text-primary hover:underline">
            weapons
          </a>
          . Stats are broad categories (strength covers many things); perks are
          much more selective in what they affect.
        </p>
        <p>
          A character also has{" "}
          <a href="/wiki/rules/vore" class="text-primary hover:underline">
            vore stats
          </a>
          , covered on their own page.
        </p>
      </RulesSection>

      <RulesSection id="stats" title="The five stats">
        <p>
          Every character sheet has five main stats. After some confusion over
          what each one actually does, use them as follows.
        </p>

        <h3 class="text-lg font-semibold pt-2">Strength</h3>
        <p>
          Your body's overall strength: how hard you can punch, how much you can
          lift, and so on. Raw force, including how hard and how fast you can
          hit.
        </p>
        <p>Use it for:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            Melee combat: contested Strength vs Strength checks. See{" "}
            <a href="/wiki/rules/combat" class="text-primary hover:underline">
              combat
            </a>
            .
          </li>
          <li>
            Maximum weight capacity: each point of Strength adds +1 capacity
            (base carry capacity is 2 + Strength). See{" "}
            <a
              href="/wiki/rules/health#encumbrance"
              class="text-primary hover:underline"
            >
              encumbrance
            </a>
            .
          </li>
          <li>Breaching doors and walls, breaking things down.</li>
          <li>Lifting heavy things, yourself included.</li>
        </ul>

        <h3 class="text-lg font-semibold pt-2">Dexterity</h3>
        <p>
          Your body's overall agility: how well you can squeeze into tight
          places, handle things, run, and so on. Fine motor function and short
          bursts of sprint. Primarily used for ranged combat. This does{" "}
          <strong>not</strong> help with dodging attacks.
        </p>
        <p>Use it for:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Ranged combat: contested Dexterity vs cover checks.</li>
          <li>Throwing things: contested Dexterity vs cover or accuracy.</li>
          <li>Lockpicking, sleight of hand, fine dancing.</li>
          <li>Short bursts of sprint, parkour.</li>
        </ul>

        <h3 class="text-lg font-semibold pt-2">Constitution</h3>
        <p>
          Your body's capability to sustain conditions and ailments. General
          health, immune strength, and capacity for healing. Used for HP,
          surviving diseases and infections, and exertive activities such as
          mountain-climbing or marathoning.
        </p>
        <p>Use it for:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            Health points: each point in Constitution is 2 HP. See{" "}
            <a href="/wiki/rules/health" class="text-primary hover:underline">
              health
            </a>
            .
          </li>
          <li>
            Dealing with exhaustion: when you overspend your energy,
            Constitution checks are called.
          </li>
          <li>
            Holding your breath: you can hold it for [Constitution] turns.
          </li>
          <li>
            Becoming immune to or healing from disease and ailments. Surviving
            poison.
          </li>
        </ul>

        <h3 class="text-lg font-semibold pt-2">Intelligence</h3>
        <p>
          Your overall smarts: remembering things, reaching logical conclusions,
          reaction speed, perception, and trapping.
        </p>
        <p>Use it for:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Stealth: contested Intelligence vs Intelligence checks.</li>
          <li>Perception: contested Intelligence vs Intelligence checks.</li>
          <li>Trapping: setting up traps and their lethality.</li>
          <li>Stabilizing: treating someone is an Intelligence check.</li>
          <li>
            Solving puzzles, getting hints from the GM, mixing chemicals.
          </li>
        </ul>

        <h3 class="text-lg font-semibold pt-2">Charisma</h3>
        <p>
          Your sociability: how well you are perceived, how well you communicate
          ideas, convert others to your cause, or deceive them. This is how well
          you can make NPCs bend to your will as needed.
        </p>
        <p>Use it for:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Manipulation: contested Charisma vs Intelligence checks.</li>
          <li>Leading vehicles: commanding crew and coordinating it.</li>
          <li>
            Lying, convincing people of something, getting them to do what you
            want.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="helping" title="Helping someone">
        <p>
          When trying to help someone fulfill a task that can be helped with,
          both of you roll the proper stat, then add the successes together.
        </p>
        <p>
          Some tasks cannot be helped with, such as firing a rifle or picking a
          lock. The GM decides whether help applies.
        </p>
      </RulesSection>

      <RulesSection id="lying" title="Figuring out if someone is lying">
        <p>
          To figure out if someone is lying, it is a contested check: your
          Intelligence vs their Charisma.
        </p>
        <p>
          The target cannot voluntarily fail or avoid this check. You both must
          roll, even if the target has no intention of lying. It would be
          obvious someone is lying if they could voluntarily fail, so every such
          read must be rolled.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            If you fail, you don't know whether you are being lied to or told
            the truth.
          </li>
          <li>
            If you succeed, you figure out whether or not the opponent is lying.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="misc-actions" title="What is an action">
        <p>
          An action, during a turn, is any one thing a character can do within a
          second. Firing their gun, reloading it, stabbing someone, moving,
          picking a lock, grabbing something, dropping it.
        </p>
        <p>
          The most basic way to describe it is "doing a thing". Per turn, you
          can do one thing and one thing only.
        </p>
        <p>
          Plenty of actions do not warrant their own rules section, but they
          still count as actions:
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Dropping an item is an action.</li>
          <li>Putting an item in your inventory is an action.</li>
          <li>Grabbing an item is an action.</li>
          <li>
            Giving someone else an item is an action from your part; accepting
            it is free.
          </li>
          <li>
            Talking is an action, within reason. A few quick words are free, but
            something long and meaningful is an action.
          </li>
        </ul>
      </RulesSection>
    </WikiRulesLayout>
  );
});
