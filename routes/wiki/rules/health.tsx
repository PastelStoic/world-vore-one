import { define } from "@/utils.ts";
import {
  RulesCallout,
  RulesSection,
  RulesToc,
  WikiRulesLayout,
} from "@/components/WikiRulesLayout.tsx";

export default define.page(function WikiRulesHealth() {
  return (
    <WikiRulesLayout
      title="Health & Encumbrance"
      description="HP, damage, rest, exhaustion, and how much you can carry."
      currentHref="/wiki/rules/health"
    >
      <RulesToc
        items={[
          { id: "hp", label: "HP and damage" },
          { id: "incapacitated", label: "Incapacitated and critical" },
          { id: "stabilize", label: "Stabilizing" },
          { id: "rest", label: "HP regeneration and exhaustion" },
          { id: "encumbrance", label: "Encumbrance" },
        ]}
      />

      <RulesSection id="hp" title="HP and damage">
        <p>
          Your HP is equal to 2 × Constitution. A 5 in Constitution means you
          have 10 HP.
        </p>
        <p>
          If an attack would bring your HP to 0 or below, your HP is set to 0
          and you are considered <strong>incapacitated</strong>.
        </p>
        <p>
          When being digested, your HP decreases over time. That is covered in
          the{" "}
          <a href="/wiki/rules/vore" class="text-primary hover:underline">
            vore rules
          </a>
          .
        </p>
      </RulesSection>

      <RulesSection id="incapacitated" title="Incapacitated and critical">
        <p>
          When incapacitated, you cannot fend off your assailants whatsoever.
          They may do as they please to you, and you may not contest their
          actions.
        </p>
        <p>
          The only exception is vore: if you are eaten, you are able to put up a
          fight, but even if you escape, you are still incapacitated.
        </p>
        <p>
          When incapacitated, you will definitely recover if you are given time
          to rest. If you are attacked while incapacitated, your HP goes into
          the negatives and you are put in{" "}
          <strong>critical condition</strong>. You will certainly die without
          being stabilized.
        </p>
        <p>
          If you are brought to the negative of your max HP, you outright die.
          If you have 5 max HP and are brought to −5 HP, you die.
        </p>
        <p>
          It is up to the GM how quickly someone dies from being in critical
          condition. Perks that regenerate HP can stabilize, provided they bring
          their target to 0 HP or higher.
        </p>
        <p>
          If you have been stabilized, being attacked again can put you in
          critical condition once more.
        </p>
      </RulesSection>

      <RulesSection id="stabilize" title="Stabilizing">
        <p>
          Stabilizing someone takes an Intelligence check. It needs 1 + (how
          negative your HP is) / 2 successes, rounded down.
        </p>
      </RulesSection>

      <RulesSection id="rest" title="HP regeneration and exhaustion">
        <p>
          Pilzfrauns and baseliners require different amounts of rest.
          Pilzfrauns are made to work down to the bone, so they need less
          overall rest than baseliners.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            For every 20 hours awake, a Pilzfraun then needs 4 hours of sleep.
            For every point of damage, a Pilzfraun needs 4 hours of rest.
          </li>
          <li>
            For every 16 hours awake, a baseliner then needs 8 hours of sleep.
            For every point of damage, a baseliner needs 24 hours of rest.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="encumbrance" title="Encumbrance">
        <p>
          Encumbrance comes in three levels. Each level deducts 1 from your
          Strength and Dexterity. Those stats cannot be deducted below 1 through
          this. Any encumbrance level immediately makes you the slowest when
          deciding initiative. If you are as encumbered as someone else, usual
          initiative rules apply between you and them.
        </p>
        <p>
          The levels are <strong>encumbered</strong>,{" "}
          <strong>heavily encumbered</strong>, and{" "}
          <strong>immobile</strong>. If you are immobile, you cannot move at
          all.
        </p>
        <p>
          You can carry up to 2 + Strength weight worth of gear without penalty.
          Between that and up to double that value leaves you encumbered. Up to
          triple that value leaves you heavily encumbered. Up to quadruple that
          value is your absolute limit, leaving you immobile.
        </p>
        <RulesCallout>
          <p>People are worth 3 weight.</p>
        </RulesCallout>
      </RulesSection>
    </WikiRulesLayout>
  );
});
