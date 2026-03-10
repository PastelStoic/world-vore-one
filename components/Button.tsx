import type { ComponentChildren } from "preact";

export interface ButtonProps {
  id?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: ComponentChildren;
  disabled?: boolean;
  class?: string;
}

const BASE =
  "px-3 py-2 border rounded bg-base-200 hover:bg-base-300 transition-colors disabled:opacity-40";

/** A standard action button. */
export function Button({ class: extraClass, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      class={extraClass ? `${BASE} ${extraClass}` : BASE}
    />
  );
}

export interface ButtonLinkProps {
  href: string;
  class?: string;
  children?: ComponentChildren;
}

/** The same visual style as Button, but rendered as an anchor tag. */
export function ButtonLink(
  { href, class: extraClass, children }: ButtonLinkProps,
) {
  return (
    <a
      href={href}
      class={extraClass
        ? `inline-block ${BASE} ${extraClass}`
        : `inline-block ${BASE}`}
    >
      {children}
    </a>
  );
}
