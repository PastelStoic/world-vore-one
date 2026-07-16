import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import HexGridBattler from "@/islands/HexGridBattler.tsx";
import { getBattle } from "@/lib/battles.ts";

export default define.page(async function BattlerRoomPage(ctx) {
  const user = ctx.state.user;
  const id = ctx.params.id;

  // Avoid treating "local" as a UUID if routing ever overlaps (separate path).
  const room = await getBattle(id);

  if (!room) {
    return (
      <>
        <Head>
          <title>Battle not found • World Vore One</title>
        </Head>
        <div class="min-h-screen bg-base-200 p-8">
          <a href="/battler" class="text-primary hover:underline text-sm">
            ← Battler
          </a>
          <h1 class="text-xl font-bold mt-4">Battle not found</h1>
          <p class="text-sm text-base-content/70 mt-2">
            No battle exists for this link. Check the UUID or ask the host for
            a new invite.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          {room.name || "Battle"} • Hex Battler • World Vore One
        </title>
      </Head>

      <div class="flex flex-col min-h-screen bg-base-200 text-base-content">
        <header class="flex items-center gap-3 border-b border-base-300 bg-base-100/90 px-4 py-2 text-sm backdrop-blur">
          <a href="/battler" class="text-primary hover:underline">
            ← Battler
          </a>
          <span class="font-semibold text-base truncate">
            {room.name || "Battle"}
          </span>
          <span class="text-base-content/50 text-xs font-mono hidden sm:inline">
            {room.id.slice(0, 8)}…
          </span>
          <div class="ml-auto flex items-center gap-2">
            <span class="hidden text-xs text-base-content/50 lg:inline">
              Public link • anyone can spectate
            </span>
          </div>
        </header>
        <HexGridBattler
          user={user}
          mode="online"
          battleId={room.id}
          initialRoom={room}
        />
      </div>
    </>
  );
});
