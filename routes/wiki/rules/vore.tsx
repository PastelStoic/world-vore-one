import { define } from "@/utils.ts";
import {
  RulesCallout,
  RulesSection,
  RulesToc,
  WikiRulesLayout,
} from "@/components/WikiRulesLayout.tsx";

export default define.page(function WikiRulesVore() {
  return (
    <WikiRulesLayout
      title="Vore & Pregnancy"
      description="Vore stats, swallowing, digestion, escape, capacity, and pregnancy."
      currentHref="/wiki/rules/vore"
    >
      <RulesToc
        items={[
          { id: "stats", label: "The vore stats" },
          { id: "abstraction", label: "Digestion abstraction" },
          { id: "swallowing", label: "Predding, preying, and digesting" },
          { id: "digestion", label: "Digestion" },
          { id: "escape", label: "Escape attempts" },
          { id: "capacity", label: "Capacity" },
          { id: "unwilling-pred", label: "Unwilling pred, willing prey" },
          { id: "hp-loss", label: "HP loss during digestion" },
          { id: "pregnancy", label: "Pregnancy" },
        ]}
      />

      <RulesSection id="stats" title="The vore stats">
        <p>
          There are three vore stats, but only Pilzfrauns have digestion
          strength — baseliners do not.
        </p>
        <p>By default, you get 4 escape attempts.</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            <strong>Digestion strength</strong>{" "}
            (Pilzfrauns only): how quickly you digest someone. By default it
            takes 3 full days. Each point decreases this by 12 hours, and
            reduces your prey's escape attempts by 1.
          </li>
          <li>
            <strong>Digestion resilience</strong>{" "}
            (everyone): how long you can endure digestion. Everyone digests
            eventually. By default it takes 3 full days. Each point increases
            this by 12 hours, and increases your escape attempts by 1.
          </li>
          <li>
            <strong>Escape training</strong>{" "}
            (everyone): your capability to escape tummies. This is not affected
            by Strength. It is an entirely separate stat on purpose, so it is
            harder for prey to escape once eaten.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="abstraction" title="Digestion abstraction">
        <p>
          In a personal scene with someone else, you can abstract digestion
          however you please. Churn them as quickly or as slowly as you want
          regardless of stats — a few minutes, or several days. Provided prey
          gets all of their escape attempts, you are still allowed to earn
          points off of it.
        </p>
        <p>
          In events, or if both players cannot reach a consensus, always use the
          following:
        </p>
        <p>
          Prey takes, by default, 3 days to be processed. This is separated into
          "alive time" (digesting) and "dead time" (being absorbed). Prey is
          alive for 1/3 of total processing time, and dead for 2/3. In other
          words, it takes 1 day to die from digestion, and another two for your
          body to be absorbed and become entirely gone.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            Each point in digestion strength decreases the total timer by 12
            hours. Alive time decreases by 4 hours, and dead time decreases by 8
            hours.
          </li>
          <li>
            Each point in digestion resilience increases the total timer by 12
            hours. Alive time increases by 4 hours, and dead time increases by 8
            hours.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="swallowing" title="Predding, preying, and digesting">
        <p>When you want to gulp someone:</p>
        <ol class="list-decimal pl-6 space-y-1">
          <li>
            Check the{" "}
            <a
              href="/wiki/rules/combat#grappling"
              class="text-primary hover:underline"
            >
              grappling rules
            </a>{" "}
            for more clarity.
          </li>
          <li>
            You must roll to grapple them on your turn, which is a contested
            check (Strength vs Strength).
          </li>
          <li>
            It is then their turn. They may choose to try to escape the grapple,
            which is a contested check (Strength vs Strength).
          </li>
          <li>
            It is then your turn. If you still have them grappled, you may
            swallow them, which is the final contested check (Strength vs
            Strength).
          </li>
          <li>
            Once prey is swallowed, they can roll their Escape Training
            contested by the predator's Strength.
          </li>
        </ol>
        <p>
          The predator adds the difference between stats when doing any of this.
        </p>
        <RulesCallout>
          <p>
            <strong>Example:</strong>{" "}
            if pred Strength is 5 and prey Strength is 3, the predator rolls 7
            dice: 5 + (5 − 3) = 7, whereas their prey rolls only 3.
          </p>
        </RulesCallout>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            When prey is gulped, they are entirely disarmed. They keep no items
            on their person whatsoever — not even ones that could otherwise be
            hidden.
          </li>
          <li>
            When prey is gulped, to escape your stomach they roll Escape
            Training, not Strength. The predator still adds the difference in
            Strength vs Escape Training to their rolls.
          </li>
        </ul>
        <p>
          This is all intentional, so that predators have an easier time gulping
          prey and keeping them down.
        </p>
      </RulesSection>

      <RulesSection id="digestion" title="Digestion">
        <p>
          In events, digestion is dragged on for as long as described under
          digestion abstraction. Prey may only do their escape checks every 4
          hours of in-event time.
        </p>
        <p>
          During combat, however, prey may do their escape checks every time it
          would be their turn, as the predator is too distracted to focus on
          keeping them down.
        </p>
        <p>
          Stomachs digest by default. Breasts, testicles, and womb do not — they
          are safe. You do not have a choice on this, unless you have a perk
          that would change it.
        </p>
        <p>
          If prey is digested and absorbed, the predator immediately heals to
          full HP.
        </p>
      </RulesSection>

      <RulesSection id="escape" title="Escape attempts">
        <p>
          By default, prey gets 4 attempts to escape their predator. They gain
          an additional attempt for each digestion resilience, and lose one
          attempt for each digestion strength of their predator. If the prey's
          resilience is overwhelmed and they would have no escape attempts, they
          digest in 3 turns — meaning they have three turns to be saved. Their
          HP is set to 0 as well.
        </p>
        <p>
          If a prey escapes their predator, they cannot be eaten again by that
          same predator due to feeling too ill. Strangely, they can eat other
          prey though. Prey can escape with 0 HP, but they remain incapacitated.
          So you can still stab them dead.
        </p>
        <h3 class="text-lg font-semibold pt-2">
          What if I digest for a bit, escape, then get eaten by another
          predator?
        </h3>
        <p>
          You do not regenerate your escape attempts until you rest. Tally up
          how many escape attempts you have done so far, then see if you would
          have any left when eaten by your new predator.
        </p>
        <RulesCallout>
          <p>
            <strong>Example:</strong>{" "}
            you spent 2 of 4 escape attempts in your first predator. Your second
            predator has 2 digestion strength, compared to your 1 digestion
            resilience. That means you would have 3 escape attempts within your
            second predator — but you have already used 2 with the previous one,
            so you only have 1 escape attempt left.
          </p>
        </RulesCallout>
        <p>
          Only the predator who digests you dead gets the point. The other one
          gets nothing.
        </p>
      </RulesSection>

      <RulesSection id="capacity" title="Capacity">
        <p>
          By default, you fit 2 people in each organ. Only perks modify this.
        </p>
        <p>
          In the case of breasts and testicles, you fit one per breast/testicle.
        </p>
      </RulesSection>

      <RulesSection id="unwilling-pred" title="Unwilling pred, willing prey">
        <p>
          When you have an unwilling predator and a willing prey — in other
          words, prey is forcing themselves into the pred — every value is
          reversed.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Pred's Strength is to expel the prey.</li>
          <li>Prey's Escape Training is to remain inside.</li>
          <li>
            Prey gains the difference bonuses to grapple and shove themselves
            inside, rather than the pred.
          </li>
          <li>
            Prey gains 1 point (if they are a template) should they digest. Pred
            gains 1 point if they expel their prey.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="hp-loss" title="HP loss during digestion">
        <p>While digesting, you stop regenerating HP entirely.</p>
        <p>
          HP loss per turn follows this formula: [max HP] / [escape attempts].
        </p>
        <RulesCallout>
          <p>
            <strong>Example:</strong>{" "}
            if you have a max of 2 HP and 4 escape attempts, you lose 0.5 HP for
            each attempt. If you digest for 2 turns and then manage to escape,
            you would have 1 HP leftover.
          </p>
        </RulesCallout>
        <p>
          This is based on your total HP, not current HP. If your max HP is 2
          and your current HP is 1, you still lose 0.5 per turn. HP can be
          brought below 0 through digestion, and you can die earlier than your
          resilience would otherwise allow.
        </p>
        <p>Always round HP up should you escape.</p>
        <p>
          Being at or below 0 HP inside a stomach does not matter: you can still
          try to escape, but you will be incapacitated or critical if you do.
        </p>
      </RulesSection>

      <RulesSection id="pregnancy" title="Pregnancy">
        <p>
          Players decide whether they do or do not get pregnant. Relevant perks
          apply, of course.
        </p>
        <p>
          If you want a formula for it, roll [average Constitution of both
          partners, rounded down] d6s. Rolling a single 5 or 6 means you are
          impregnated.
        </p>
        <p>Baseliners have standard pregnancy cycles, no hyperpreg.</p>
        <p>
          Pilzfrauns birth whole humans. They can gestate as many as described
          in the capacity section above.
        </p>
        <p>
          Pilzfrauns take 2 years to gestate their birthlings. This is halved
          for each nutrition unit they eat. Digesting prey counts as 1 nutrition
          unit, unless modified by a perk such as Speisfraun.
        </p>
        <p>
          The fastest pregnancy for a Pilzfraun is 1 month. It cannot be faster
          than that, unless relevant perks apply.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            Pilzfrauns birth, exclusively, other Pilzfrauns. Their offspring may
            be futas or not. As for whether they are Tierfraun, that depends on
            their genealogical tree — if there is a Tierfraun in there, there is
            always a chance.
          </li>
          <li>
            Once a Pilzherr cums inside a Pilzfraun, even without pregnancy, she
            can only birth Pilzherrs from there on out.
          </li>
          <li>Baseliners only birth baseliners.</li>
        </ul>
        <p>
          When a character is impregnated, they roll a flat 1d6. On a 1–4, it is
          a normal pregnancy. On a 5, they are twins. On a 6, they are triplets.
        </p>
      </RulesSection>
    </WikiRulesLayout>
  );
});
