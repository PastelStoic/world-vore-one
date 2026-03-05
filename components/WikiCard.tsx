interface WikiCardProps {
  href: string;
  title: string;
  description: string;
}

/** Linked card used on the wiki index page. */
export function WikiCard({ href, title, description }: WikiCardProps) {
  return (
    <a
      href={href}
      class="block border rounded-lg p-5 bg-base-100/80 hover:bg-base-100 transition-colors shadow-sm"
    >
      <h2 class="text-xl font-semibold mb-1">{title}</h2>
      <p class="text-base-content/70 text-sm">{description}</p>
    </a>
  );
}
