import { define } from "@/utils.ts";
import {
  RulesSection,
  RulesToc,
  WikiRulesLayout,
} from "@/components/WikiRulesLayout.tsx";

export default define.page(function WikiRulesGamemastering() {
  return (
    <WikiRulesLayout
      title="Gamemastering"
      description="Creating and managing NPCs for scenes and events."
      currentHref="/wiki/rules/gamemastering"
    >
      <RulesToc
        items={[
          { id: "npcs", label: "Creating and handling NPCs" },
        ]}
      />

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
