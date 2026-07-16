import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import BattlerHub from "@/islands/BattlerHub.tsx";

export default define.page(function BattlerPage(ctx) {
  const user = ctx.state.user;

  return (
    <>
      <Head>
        <title>Hex Battler • World Vore One</title>
      </Head>

      <div class="min-h-screen bg-base-200 text-base-content">
        <header class="flex items-center gap-3 border-b border-base-300 bg-base-100/90 px-4 py-2 text-sm backdrop-blur">
          <a href="/" class="text-primary hover:underline">← Home</a>
          <span class="font-semibold text-base">Hex Battler</span>
        </header>
        <BattlerHub user={user} />
      </div>
    </>
  );
});
