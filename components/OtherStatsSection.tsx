import { PERKS_BY_ID } from "@/data/perks.ts";
import { ORGAN_LABELS } from "@/lib/character_types.ts";
import type { CharacterDraft } from "@/lib/character_types.ts";
import {
  calculateEffectiveConstitution,
  calculateEffectiveHealth,
  calculateOrganCapacities,
} from "@/lib/stat_calculations.ts";

interface OtherStatsSectionProps {
  draft: CharacterDraft;
  carryCapacity: number;
}

export default function OtherStatsSection(props: OtherStatsSectionProps) {
  const { draft, carryCapacity } = props;
  const organCapacities = calculateOrganCapacities(draft);
  const hasMilky = draft.perkIds.some((perkId) => {
    if (perkId === "milky") return true;
    return PERKS_BY_ID.get(perkId)?.includesPerks?.includes("milky") ?? false;
  });
  const milkyCharges = hasMilky
    ? 1 + calculateEffectiveConstitution(draft)
    : null;

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
        {milkyCharges !== null && (
          <li>
            Milky Charges: <strong>{milkyCharges}</strong>
          </li>
        )}
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
