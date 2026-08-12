import type { InventoryLocation } from "./helpers.ts";

interface InventoryItemActionsProps {
  location: InventoryLocation;
  deprecated?: boolean;
  canMove?: boolean;
  moveDisabled?: boolean;
  moveTitle?: string;
  onMove?: (to: InventoryLocation) => void;
  onRemove?: () => void;
}

export default function InventoryItemActions(
  props: InventoryItemActionsProps,
) {
  const {
    location,
    deprecated,
    canMove = true,
    moveDisabled,
    moveTitle,
    onMove,
    onRemove,
  } = props;
  const other: InventoryLocation = location === "carried" ? "stowed" : "carried";

  if (!onMove && !onRemove) return null;

  return (
    <div class="flex gap-1">
      {canMove && onMove && (
        <button
          type="button"
          class="px-2 py-0.5 text-xs border rounded hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => onMove(other)}
          disabled={moveDisabled}
          title={moveTitle}
        >
          → {other === "carried" ? "Carry" : "Stow"}
        </button>
      )}
      {onRemove && (
        <button
          type="button"
          class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
          onClick={onRemove}
          title={deprecated
            ? "Remove deprecated item and free inventory slots/points"
            : undefined}
        >
          {deprecated ? "Remove & refund" : "Remove"}
        </button>
      )}
    </div>
  );
}
