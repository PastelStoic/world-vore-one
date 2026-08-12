import { define } from "@/utils.ts";
import { updateLobby } from "@/lib/battles.ts";
import type { BattlePlayer, BattlerState } from "@/lib/battler_types.ts";
import { handleBattleError, jsonError, requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async PATCH(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;

    let body: {
      name?: string | null;
      state?: BattlerState;
      players?: BattlePlayer[];
    };
    try {
      body = await ctx.req.json();
    } catch {
      return jsonError(400, "Invalid JSON");
    }

    try {
      const room = await updateLobby(ctx.params.id, user.id, {
        name: body.name,
        state: body.state,
        players: body.players,
      });
      return Response.json(room);
    } catch (e) {
      return handleBattleError(e);
    }
  },
});
