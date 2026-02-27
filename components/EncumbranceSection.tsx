import {
  type EncumbranceLevel,
  getEncumbranceLabel,
} from "../lib/stat_calculations.ts";

interface EncumbranceSectionProps {
  carriedWeight: number;
  onCarriedWeightChange: (weight: number) => void;
  encumbranceLevel: EncumbranceLevel;
  encumbrancePenaltyText: string;
}

export default function EncumbranceSection(props: EncumbranceSectionProps) {
  const {
    carriedWeight,
    onCarriedWeightChange,
    encumbranceLevel,
    encumbrancePenaltyText,
  } = props;

  return (
    <div class="rounded border p-3 space-y-2">
      <h3 class="font-semibold">Effects</h3>
      <label class="block">
        <span class="block font-medium mb-1">Carried Weight</span>
        <div class="flex items-center gap-3">
          <input
            class="w-1/2 border rounded px-3 py-2"
            type="number"
            min="0"
            step="1"
            value={String(carriedWeight)}
            onInput={(event) => {
              const parsed = Number(
                (event.currentTarget as HTMLInputElement).value,
              );
              if (Number.isNaN(parsed) || parsed < 0) {
                onCarriedWeightChange(0);
                return;
              }
              onCarriedWeightChange(parsed);
            }}
          />
          <span class="text-sm text-gray-700 whitespace-nowrap">
            Encumbrance:{" "}
            <strong>{getEncumbranceLabel(encumbranceLevel)}</strong>
          </span>
          <span class="text-sm text-gray-700 whitespace-nowrap">
            <strong>{encumbrancePenaltyText}</strong>
          </span>
        </div>
      </label>
    </div>
  );
}
