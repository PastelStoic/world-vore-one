import type { ComponentChildren } from "preact";
import DeprecatedBadge from "@/components/DeprecatedBadge.tsx";

interface WikiDetailsRowProps {
  title: string;
  deprecated?: boolean;
  badges?: ComponentChildren;
  summary?: ComponentChildren;
  children?: ComponentChildren;
}

export function WikiDetailsRow(props: WikiDetailsRowProps) {
  const { title, deprecated, badges, summary, children } = props;
  return (
    <details class="border rounded-lg bg-base-100/80 px-4 py-2">
      <summary class="cursor-pointer font-medium select-none list-none flex items-center gap-3 flex-wrap">
        <span class="font-semibold">
          {title}
          {deprecated ? <DeprecatedBadge /> : null}
        </span>
        {badges}
        {summary && (
          <span class="ml-auto flex items-center gap-3 text-xs text-base-content/70 shrink-0">
            {summary}
            <span class="text-base-content/50">▶ details</span>
          </span>
        )}
        {!summary && (
          <span class="ml-auto text-xs text-base-content/50 font-normal shrink-0">
            ▶ details
          </span>
        )}
      </summary>
      {children && (
        <div class="mt-2 text-sm text-base-content border-t pt-2 space-y-1">
          {children}
        </div>
      )}
    </details>
  );
}
