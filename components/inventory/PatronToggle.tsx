interface PatronToggleProps {
  active: boolean;
  onClick: () => void;
}

export default function PatronToggle(props: PatronToggleProps) {
  return (
    <button
      type="button"
      class={`px-2 py-0.5 text-xs border rounded ${
        props.active
          ? "bg-secondary/20 border-secondary/60 text-secondary"
          : "hover:bg-secondary/10 text-secondary"
      }`}
      onClick={props.onClick}
      title={props.active
        ? "Unmark as provided by your patron"
        : "Mark as provided by your patron (free)"}
    >
      {props.active ? "★ Patron" : "☆ Patron"}
    </button>
  );
}

export function PatronBadge() {
  return (
    <span
      class="text-xs text-secondary ml-1 font-medium"
      title="Provided by your patron"
    >
      [Patron]
    </span>
  );
}
