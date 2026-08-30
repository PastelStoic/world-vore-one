import { define } from "@/utils.ts";
import {
  RulesSection,
  RulesToc,
  WikiRulesLayout,
} from "@/components/WikiRulesLayout.tsx";

export default define.page(function WikiRulesProgression() {
  return (
    <WikiRulesLayout
      title="Progression"
      description="Earning points, and creating or managing NPCs."
      currentHref="/wiki/rules/progression"
    >
      <RulesToc
        items={[
          { id: "points", label: "Earning more points" },
          { id: "npcs", label: "Creating and handling NPCs" },
        ]}
      />

      <RulesSection id="points" title="Earning more points">
        <p>
          Whenever you feel like you have earned a point, update your character
          sheet so staff can review it.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            You gain 1 point whenever you finish a scene in which you have
            fulfilled your role, as described on your character sheet.
          </li>
          <li>
            You gain 1 point whenever you successfully digest someone as
            predator, or successfully escape someone as prey. For this to apply,
            one side must be unwilling — either the predator or the prey.
            Willing vore awards no point.
          </li>
          <li>
            Exception: if you prefer endo vore, or would rather spare your prey,
            then keeping your prey inside of you for the same amount of checks
            or time as it would have taken to digest awards you a point, even if
            they leave or are expelled afterwards. In that case, your prey does
            not get a point.
          </li>
          <li>
            You gain 1 point for every three scenes in which your role is not
            fulfilled (colloquially called "misc" scenes).
          </li>
          <li>
            You gain points whenever an event ends and points are awarded.
          </li>
        </ul>
        <p>
          Points or perks added to a character in the middle of a scene do not
          impact that scene. You must use the stats you had when starting the
          scene.
        </p>
      </RulesSection>

      <RulesSection id="npcs" title="Creating and handling NPCs">
        <p>
          Any user is free to create and manage NPCs as they deem best, so long
          as it fits the scene they are in and its participants consent to it.
          Whether they can do so in events is up to GM discretion.
        </p>
        <p>
          Churning, fighting, and beating NPCs does not award points, unless
          they are given a full stat block using the same points as any other
          character.
        </p>
        <p>
          The stat block must make sense for the NPC in question and must be
          competitive for the scene they are in. If your NPC is a soldier, they
          should have high Strength, Dexterity, and/or Constitution, as well as
          a fitting perk and weapon. Don't give them high Charisma and a
          nonsensical perk. That will be invalid.
        </p>
      </RulesSection>
    </WikiRulesLayout>
  );
});
