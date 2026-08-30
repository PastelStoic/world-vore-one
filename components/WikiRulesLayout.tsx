import type { ComponentChildren } from "preact";
import { Head } from "fresh/runtime";
import { BackLink } from "@/components/BackLink.tsx";
import { PageShell } from "@/components/PageShell.tsx";
import { RULES_PAGES } from "@/data/rules_pages.ts";

interface WikiRulesLayoutProps {
  title: string;
  description: string;
  currentHref?: string;
  children: ComponentChildren;
}

/** Shared chrome for individual rules wiki pages. */
export function WikiRulesLayout(props: WikiRulesLayoutProps) {
  const { title, description, currentHref, children } = props;
  const index = currentHref
    ? RULES_PAGES.findIndex((page) => page.href === currentHref)
    : -1;
  const prev = index > 0 ? RULES_PAGES[index - 1] : undefined;
  const next = index >= 0 && index < RULES_PAGES.length - 1
    ? RULES_PAGES[index + 1]
    : undefined;

  return (
    <PageShell maxWidth="4xl" innerClass="space-y-8">
      <Head>
        <title>{title} – Wiki – World Vore One</title>
      </Head>
      <header>
        <BackLink href="/wiki/rules">← Rules</BackLink>
        <h1 class="text-3xl font-bold mt-2">{title}</h1>
        <p class="text-base-content">{description}</p>
      </header>
      <article class="space-y-8">{children}</article>
      {(prev || next) && (
        <nav class="flex justify-between gap-4 border-t pt-4 text-sm">
          {prev
            ? (
              <a href={prev.href} class="text-primary hover:underline">
                ← {prev.title}
              </a>
            )
            : <span />}
          {next
            ? (
              <a
                href={next.href}
                class="text-primary hover:underline text-right ml-auto"
              >
                {next.title} →
              </a>
            )
            : <span />}
        </nav>
      )}
    </PageShell>
  );
}

interface RulesSectionProps {
  id: string;
  title: string;
  children: ComponentChildren;
}

/** Headed block used to split a rules page into named sections. */
export function RulesSection(props: RulesSectionProps) {
  const { id, title, children } = props;
  return (
    <section id={id} class="space-y-3 scroll-mt-6">
      <h2 class="text-xl font-semibold border-b pb-1">{title}</h2>
      <div class="space-y-3 text-base-content leading-relaxed">{children}</div>
    </section>
  );
}

interface RulesTocProps {
  items: { id: string; label: string }[];
}

/** In-page table of contents for long rules articles. */
export function RulesToc(props: RulesTocProps) {
  return (
    <nav class="border rounded-lg bg-base-100/80 px-4 py-3">
      <p class="font-semibold mb-2">On this page</p>
      <ul class="space-y-1 text-sm columns-1 sm:columns-2 gap-x-8">
        {props.items.map((item) => (
          <li key={item.id} class="break-inside-avoid">
            <a href={`#${item.id}`} class="text-primary hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface RulesCalloutProps {
  children: ComponentChildren;
}

/** Bordered example or note box. */
export function RulesCallout(props: RulesCalloutProps) {
  return (
    <div class="border rounded-lg bg-base-100/80 px-4 py-3 text-sm space-y-2">
      {props.children}
    </div>
  );
}
