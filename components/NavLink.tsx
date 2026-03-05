import type { ComponentChildren } from "preact";

interface NavLinkProps {
  href: string;
  class?: string;
  children: ComponentChildren;
}

/** Nav-bar link: small pill style matching the app toolbar. */
export function NavLink({ href, class: extraClass, children }: NavLinkProps) {
  const base = "text-sm px-3 py-1 border rounded hover:bg-base-200 transition-colors";
  return (
    <a href={href} class={extraClass ? `${base} ${extraClass}` : base}>
      {children}
    </a>
  );
}
