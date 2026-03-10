import type { Nation } from "@/data/equipment.ts";
import { NATIONS } from "@/data/equipment.ts";
import type { ComponentChildren } from "preact";

interface NationFilterConfig {
  value: Nation | "";
  onChange: (value: Nation | "") => void;
  /** If true, show "Generic" button for "Any" nation instead of hiding it */
  showGenericButton?: boolean;
}

interface ItemPickerProps<T> {
  items: T[];
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterPlaceholder: string;
  emptyMessage: string;
  renderItem: (item: T) => ComponentChildren;
  nationFilter?: NationFilterConfig;
  maxHeight?: string;
}

export default function ItemPicker<T>(props: ItemPickerProps<T>) {
  const {
    items,
    filterValue,
    onFilterChange,
    filterPlaceholder,
    emptyMessage,
    renderItem,
    nationFilter,
    maxHeight = "max-h-64",
  } = props;

  return (
    <div class="space-y-1 border rounded p-2 bg-base-200">
      {nationFilter && (
        <div class="flex flex-wrap gap-1 mb-1">
          <button
            type="button"
            class={`text-xs px-2 py-0.5 rounded border ${
              nationFilter.value === ""
                ? "bg-primary/20 border-primary/70 font-medium"
                : "hover:bg-base-200"
            }`}
            onClick={() => nationFilter.onChange("")}
          >
            All
          </button>
          {nationFilter.showGenericButton && (
            <button
              type="button"
              class={`text-xs px-2 py-0.5 rounded border ${
                nationFilter.value === "Any"
                  ? "bg-primary/20 border-primary/70 font-medium"
                  : "hover:bg-base-200"
              }`}
              onClick={() =>
                nationFilter.onChange(
                  nationFilter.value === "Any" ? "" : "Any",
                )}
            >
              Generic
            </button>
          )}
          {NATIONS.filter((n) => n !== "Any").map((n) => (
            <button
              key={n}
              type="button"
              class={`text-xs px-2 py-0.5 rounded border ${
                nationFilter.value === n
                  ? "bg-primary/20 border-primary/70 font-medium"
                  : "hover:bg-base-200"
              }`}
              onClick={() =>
                nationFilter.onChange(n === nationFilter.value ? "" : n)}
            >
              {n}
            </button>
          ))}
        </div>
      )}
      <input
        type="text"
        class="w-full border rounded px-2 py-1 text-sm"
        placeholder={filterPlaceholder}
        value={filterValue}
        onInput={(e) => onFilterChange((e.target as HTMLInputElement).value)}
      />
      {items.length === 0
        ? (
          <p class="text-sm text-base-content/50 italic">
            {emptyMessage}
          </p>
        )
        : (
          <ul class={`${maxHeight} overflow-y-auto space-y-1`}>
            {items.map((item) => renderItem(item))}
          </ul>
        )}
    </div>
  );
}
