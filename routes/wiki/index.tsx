import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { PageShell } from "@/components/PageShell.tsx";
import { BackLink } from "@/components/BackLink.tsx";
import { WikiCard } from "@/components/WikiCard.tsx";
import { RULES_PAGES } from "@/data/rules_pages.ts";

export default define.page(function WikiIndex() {
  return (
    <PageShell>
      <Head>
        <title>Wiki – World Vore One</title>
      </Head>
      <header>
        <BackLink href="/">← Home</BackLink>
        <h1 class="text-3xl font-bold mt-2">Wiki</h1>
        <p class="text-base-content">
          Game rules, plus reference pages for factions, perks, equipment, and
          vehicles.
        </p>
      </header>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold border-b pb-1">Rules</h2>
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
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold border-b pb-1">Reference</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <WikiCard
            href="/wiki/factions"
            title="Factions"
            description="Reference information for every faction, including automatic bonuses and moderator-only restrictions."
          />
          <WikiCard
            href="/wiki/perks"
            title="Perks"
            description="All available perks organised by category: combat, vore, smut, gimmick, PF type, faction, and negative perks."
          />
          <WikiCard
            href="/wiki/weapons"
            title="Weapons"
            description="Statistics and gimmicks for every ranged and melee weapon, grouped by type."
          />
          <WikiCard
            href="/wiki/equipment"
            title="Equipment & Attachments"
            description="General gear, weapon attachments, free accessories, and melee weapon traits."
          />
          <WikiCard
            href="/wiki/vehicles"
            title="Vehicles"
            description="Statistics, crew, armor, and modules for every vehicle, grouped by nation."
          />
        </div>
      </section>
    </PageShell>
  );
});
