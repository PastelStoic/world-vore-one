import type { ComponentChildren } from "preact";

interface PageShellProps {
  children: ComponentChildren;
  /** Tailwind max-width token for the inner container, e.g. "3xl" or "4xl". Defaults to "3xl". */
  maxWidth?: string;
  /** Extra classes for the inner container (e.g. `space-y-8`). Defaults to `space-y-6`. */
  innerClass?: string;
}

/**
 * Full-page wrapper used by top-level routes.
 * Provides the `fresh-gradient` background and a centred, max-width container.
 */
export function PageShell({
  children,
  maxWidth = "3xl",
  innerClass = "space-y-6",
}: PageShellProps) {
  return (
    <main class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div class={`max-w-${maxWidth} mx-auto ${innerClass}`}>
        {children}
      </div>
    </main>
  );
}
