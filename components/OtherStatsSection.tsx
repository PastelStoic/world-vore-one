import type { CharacterDraft } from "../lib/character_types.ts";
import {
  calculateEffectiveHealth,
  calculateEffectiveOrganCapacity,
} from "../lib/stat_calculations.ts";

interface OtherStatsSectionProps {
  draft: CharacterDraft;
  carryCapacity: number;
}

export default function OtherStatsSection(props: OtherStatsSectionProps) {
  const { draft, carryCapacity } = props;

  return (
    <div class="rounded border p-3 space-y-2">
      <h3 class="font-semibold">Other Stats</h3>
      <ul class="space-y-1 text-sm">
        <li>
          Health: <strong>{calculateEffectiveHealth(draft)}</strong>
        </li>
        <li>
          Carry Capacity: <strong>{carryCapacity}</strong>
        </li>
        {draft.race !== "Baseliner" && (
          <li>
            Organ Capacity:{" "}
            <strong>{calculateEffectiveOrganCapacity(draft)}</strong>
          </li>
        )}
      </ul>
    </div>
  );
}
