import type { InventoryLocation } from "./helpers.ts";

interface UnknownInventoryItemProps {
  kind: string;
  id: string;
  readOnly?: boolean;
  onRemove: () => void;
}

export default function UnknownInventoryItem(
  props: UnknownInventoryItemProps,
) {
  const { kind, id, readOnly, onRemove } = props;
  return (
    <div class="border rounded p-2 bg-base-100 text-sm text-error flex items-center justify-between flex-wrap gap-1">
      <span>
        Unknown {kind}: {id}
        <span class="block text-xs text-base-content/60 font-normal">
          Removed from game data — remove to free inventory slots/points.
        </span>
      </span>
      {!readOnly && (
        <button
          type="button"
          class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
          onClick={onRemove}
          title="Remove invalid item and refund its inventory cost"
        >
          Remove & refund
        </button>
      )}
    </div>
  );
}

export function otherInventoryLocation(
  location: InventoryLocation,
): InventoryLocation {
  return location === "carried" ? "stowed" : "carried";
}
