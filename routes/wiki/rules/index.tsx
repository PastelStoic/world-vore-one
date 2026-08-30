import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { BackLink } from "@/components/BackLink.tsx";
import { PageShell } from "@/components/PageShell.tsx";
import { WikiCard } from "@/components/WikiCard.tsx";
import { RULES_PAGES } from "@/data/rules_pages.ts";

export default define.page(function WikiRulesIndex() {
  return (
    <PageShell>
      <Head>
        <title>Rules – Wiki – World Vore One</title>
      </Head>
      <header>
        <BackLink href="/wiki">← Wiki</BackLink>
        <h1 class="text-3xl font-bold mt-2">Rules</h1>
        <p class="text-base-content">
          How the game is played: dice, health, progression, vore, combat, and
          vehicles.
        </p>
      </header>

      <div class="grid gap-4 sm:grid-cols-2">
        {RULES_PAGES.map((page) => (
          <WikiCard
            key={page.href}
            href={page.href}
            title={page.title}
            description={page.description}
          />
        ))}
      </div>
    </PageShell>
  );
});
