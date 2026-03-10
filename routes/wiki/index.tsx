import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { PageShell } from "@/components/PageShell.tsx";
import { BackLink } from "@/components/BackLink.tsx";
import { WikiCard } from "@/components/WikiCard.tsx";

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
          Reference pages for game rules, perks, and equipment.
        </p>
      </header>

      <div class="grid gap-4 sm:grid-cols-2">
        <WikiCard
          href="/wiki/perks"
          title="Perks"
          description="All available perks organised by category: combat, vore, smut, gimmick, PF type, faction, and negative perks."
        />
        <WikiCard
          href="/wiki/weapons"
          title="Weapons"
          description="Statistics and gimmicks for every ranged weapon in the game, grouped by weapon type."
        />
        <WikiCard
          href="/wiki/equipment"
          title="Equipment & Attachments"
          description="General gear, weapon attachments, melee weapons, and melee weapon traits."
        />
      </div>
    </PageShell>
  );
});
