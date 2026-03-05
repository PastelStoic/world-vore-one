interface BackLinkProps {
  href: string;
  children: string;
}

/** A small "← Back" breadcrumb link. */
export function BackLink({ href, children }: BackLinkProps) {
  return (
    <a href={href} class="text-sm text-primary hover:underline">
      {children}
    </a>
  );
}
