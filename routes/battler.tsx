import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import HexGridBattler from "@/islands/HexGridBattler.tsx";

export default define.page(function BattlerPage(ctx) {
  const user = ctx.state.user;

  return (
    <>
      <Head>
        <title>Hex Battler • World Vore One</title>
      </Head>

      {/* Full-viewport tool shell — bypasses PageShell for maximum grid real estate */}
      <div class="flex flex-col min-h-screen bg-base-200 text-base-content">
        {/* Thin local header bar (sits under the global nav from _app) */}
        <header class="flex items-center gap-3 border-b border-base-300 bg-base-100/90 px-4 py-2 text-sm backdrop-blur">
          <a href="/" class="text-primary hover:underline">← Home</a>
          <span class="font-semibold text-base">Hex Battler</span>
          <span class="text-base-content/60">— WWI TTRPG tactical grid</span>

          <div class="ml-auto flex items-center gap-2">
            {/* These will be wired to the island via props or internal buttons */}
            <span class="hidden text-xs text-base-content/50 lg:inline">
              Desktop recommended • Drag tokens • Pan with mouse • Scroll to
              zoom
            </span>
          </div>
        </header>

        {/* The interactive island owns the entire remaining viewport */}
        <HexGridBattler user={user} />
      </div>
    </>
  );
});
