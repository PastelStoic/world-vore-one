import {
  type EncumbranceLevel,
  getEncumbranceLabel,
} from "@/lib/stat_calculations.ts";

interface EncumbranceSectionProps {
  carriedWeight: number;
  onCarriedWeightChange: (weight: number) => void;
  encumbranceLevel: EncumbranceLevel;
  encumbrancePenaltyText: string;
  /** Minimum weight from inventory (cannot go below this) */
  inventoryWeight?: number;
}

export default function EncumbranceSection(props: EncumbranceSectionProps) {
  const {
    carriedWeight,
    onCarriedWeightChange,
    encumbranceLevel,
    encumbrancePenaltyText,
    inventoryWeight = 0,
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
            min={inventoryWeight}
            step="1"
            value={String(carriedWeight)}
            onInput={(event) => {
              const parsed = Number(
                (event.currentTarget as HTMLInputElement).value,
              );
              if (Number.isNaN(parsed) || parsed < inventoryWeight) {
                onCarriedWeightChange(inventoryWeight);
                return;
              }
              onCarriedWeightChange(parsed);
            }}
          />
          <span class="text-sm text-base-content whitespace-nowrap">
            Encumbrance:{" "}
            <strong>{getEncumbranceLabel(encumbranceLevel)}</strong>
          </span>
          <span class="text-sm text-base-content whitespace-nowrap">
            <strong>{encumbrancePenaltyText}</strong>
          </span>
        </div>
        {inventoryWeight > 0 && (
          <span class="text-xs text-base-content/60 mt-1 block">
            Inventory weight: {inventoryWeight} (minimum)
          </span>
        )}
      </label>
    </div>
  );
}
