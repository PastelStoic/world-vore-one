interface InvalidPerksListProps {
  perkIds: string[];
  onRemove: (perkId: string) => void;
}

export function InvalidPerksList(props: InvalidPerksListProps) {
  if (props.perkIds.length === 0) return null;

  return (
    <div class="space-y-1">
      <h5 class="font-medium text-error">Invalid / removed perks</h5>
      <p class="text-xs text-base-content/60">
        These perks are no longer in the game data. Remove them to refund their
        stat points.
      </p>
      <ul class="space-y-1">
        {props.perkIds.map((id) => (
          <li
            class="flex items-center gap-2 border rounded p-2 bg-base-100"
            key={id}
          >
            <span class="text-error text-sm flex-1">{id}</span>
            <button
              type="button"
              class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
              onClick={() => props.onRemove(id)}
              title="Remove invalid perk and refund spent stat points"
            >
              Remove & refund
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
