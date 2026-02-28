import { ORGAN_LABELS } from "../lib/character_types.ts";
import type { CharacterDraft } from "../lib/character_types.ts";
import {
  calculateEffectiveHealth,
  calculateOrganCapacities,
} from "../lib/stat_calculations.ts";

interface OtherStatsSectionProps {
  draft: CharacterDraft;
  carryCapacity: number;
}

export default function OtherStatsSection(props: OtherStatsSectionProps) {
  const { draft, carryCapacity } = props;
  const organCapacities = calculateOrganCapacities(draft);

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
        {organCapacities.length > 0 && (
          <li>
            Organ Capacity:
            <ul class="ml-4 space-y-0.5">
              {organCapacities.map(({ organ, capacity }) => (
                <li key={organ}>
                  {ORGAN_LABELS[organ]}: <strong>{capacity}</strong>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}
