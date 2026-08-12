interface ChargeTrackerProps {
  totalCharges: number;
  usedCharges: number;
  currentWeight: number;
  readOnly?: boolean;
  combatReadOnly?: boolean;
  onSetTotalCharges?: (total: number) => void;
  onToggleCharge: (chargeIndex: number) => void;
}

export default function ChargeTracker(props: ChargeTrackerProps) {
  const {
    totalCharges,
    usedCharges,
    currentWeight,
    readOnly,
    combatReadOnly,
    onSetTotalCharges,
    onToggleCharge,
  } = props;
  const remaining = Math.max(0, totalCharges - usedCharges);

  return (
    <div class="space-y-1 text-sm">
      <div class="flex items-center gap-2">
        <span>Charges:</span>
        {!readOnly && onSetTotalCharges && (
          <span class="text-xs text-base-content/60">
            (Total:{" "}
            <input
              type="number"
              class="w-12 border rounded px-1 text-xs"
              min="1"
              value={totalCharges}
              onInput={(e) => {
                const val = Number((e.target as HTMLInputElement).value);
                if (!Number.isNaN(val)) onSetTotalCharges(val);
              }}
            />
            )
          </span>
        )}
      </div>
      <div class="flex flex-wrap gap-1 ml-2">
        {Array.from({ length: totalCharges }, (_, ci) => {
          const isUsed = ci >= totalCharges - usedCharges;
          return (
            <button
              key={ci}
              type="button"
              class={`w-6 h-6 border rounded text-xs flex items-center justify-center ${
                isUsed
                  ? "bg-error/20 border-error/70 text-error"
                  : "bg-success/10 border-success/70 text-success"
              } ${
                combatReadOnly
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-75"
              }`}
              title={combatReadOnly
                ? (isUsed ? "Used" : "Available")
                : (isUsed
                  ? "Used (click to restore)"
                  : "Available (click to use)")}
              disabled={combatReadOnly}
              onClick={() => {
                if (combatReadOnly) return;
                onToggleCharge(ci);
              }}
            >
              {isUsed ? "✕" : "●"}
            </button>
          );
        })}
      </div>
      <div class="text-xs text-base-content/60 ml-2">
        {remaining} remaining · {usedCharges} used · W:{currentWeight}
      </div>
    </div>
  );
}
