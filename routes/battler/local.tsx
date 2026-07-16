import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import HexGridBattler from "@/islands/HexGridBattler.tsx";

export default define.page(function BattlerLocalPage(ctx) {
  const user = ctx.state.user;

  return (
    <>
      <Head>
        <title>Local Sandbox • Hex Battler • World Vore One</title>
      </Head>

      <div class="flex flex-col min-h-screen bg-base-200 text-base-content">
        <header class="flex items-center gap-3 border-b border-base-300 bg-base-100/90 px-4 py-2 text-sm backdrop-blur">
          <a href="/battler" class="text-primary hover:underline">
            ← Battler
          </a>
          <span class="font-semibold text-base">Local Sandbox</span>
          <span class="text-base-content/60">— offline only</span>
          <div class="ml-auto flex items-center gap-2">
            <span class="hidden text-xs text-base-content/50 lg:inline">
              Desktop recommended • Drag tokens • Pan with mouse • Scroll to
              zoom
            </span>
          </div>
        </header>
        <HexGridBattler user={user} mode="local" />
      </div>
    </>
  );
});
