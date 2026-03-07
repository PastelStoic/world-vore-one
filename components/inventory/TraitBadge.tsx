import { useState, useEffect, useRef } from "preact/hooks";

interface TraitBadgeProps {
  name: string;
  description: string;
}

export default function TraitBadge({ name, description }: TraitBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  return (
    <div class="relative inline-block" ref={ref}>
      <button
        type="button"
        class="px-2 py-0.5 text-xs border rounded bg-base-200 hover:bg-base-300 cursor-pointer font-medium"
        onClick={() => {
          setOpen((v) => !v);
        }}
      >
        {name}
      </button>
      {open && (
        <div class="absolute z-50 left-0 top-full mt-1 w-72 p-2 bg-base-100 border rounded shadow-lg text-xs whitespace-pre-line text-base-content">
          {description}
        </div>
      )}
    </div>
  );
}
