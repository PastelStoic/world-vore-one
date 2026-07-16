import { define } from "@/utils.ts";
import { BattleError, updateLobby } from "@/lib/battles.ts";
import type { BattlePlayer, BattlerState } from "@/lib/battler_types.ts";

export const handler = define.handlers({
  async PATCH(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: {
      name?: string | null;
      state?: BattlerState;
      players?: BattlePlayer[];
    };
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {
      const room = await updateLobby(ctx.params.id, user.id, {
        name: body.name,
        state: body.state,
        players: body.players,
      });
      return Response.json(room);
    } catch (e) {
      if (e instanceof BattleError) {
        return Response.json({ error: e.message }, { status: e.status });
      }
      throw e;
    }
  },
});
