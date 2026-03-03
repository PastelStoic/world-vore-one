import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

export default define.page(function WikiIndex() {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Wiki – World Vore One</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-6">
        <header>
          <a href="/" class="text-sm text-primary hover:underline">← Home</a>
          <h1 class="text-3xl font-bold mt-2">Wiki</h1>
          <p class="text-base-content">
            Reference pages for game rules, perks, and equipment.
          </p>
        </header>

        <div class="grid gap-4 sm:grid-cols-2">
          <a
            href="/wiki/perks"
            class="block border rounded-lg p-5 bg-base-100/80 hover:bg-base-100 transition-colors shadow-sm"
          >
            <h2 class="text-xl font-semibold mb-1">Perks</h2>
            <p class="text-base-content/70 text-sm">
              All available perks organised by category: combat, vore, smut,
              gimmick, PF type, faction, and negative perks.
            </p>
          </a>

          <a
            href="/wiki/weapons"
            class="block border rounded-lg p-5 bg-base-100/80 hover:bg-base-100 transition-colors shadow-sm"
          >
            <h2 class="text-xl font-semibold mb-1">Weapons</h2>
            <p class="text-base-content/70 text-sm">
              Statistics and gimmicks for every ranged weapon in the game,
              grouped by weapon type.
            </p>
          </a>

          <a
            href="/wiki/equipment"
            class="block border rounded-lg p-5 bg-base-100/80 hover:bg-base-100 transition-colors shadow-sm"
          >
            <h2 class="text-xl font-semibold mb-1">Equipment & Attachments</h2>
            <p class="text-base-content/70 text-sm">
              General gear, weapon attachments, melee weapons, and melee weapon
              traits.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
});
