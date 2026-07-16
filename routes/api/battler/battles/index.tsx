import { define } from "@/utils.ts";
import { BattleError, createBattle, listMyBattles } from "@/lib/battles.ts";
import { parseBattlerState } from "@/lib/battler_types.ts";

export const handler = define.handlers({
  /** List battles the user owns or has joined. */
  async GET(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rooms = await listMyBattles(user.id);
    return Response.json({ battles: rooms });
  },

  /** Create a new battle lobby. Owner is seated as first player. */
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let name: string | null = null;
    let initialState = undefined;
    try {
      const body = await ctx.req.json().catch(() => ({}));
      if (body && typeof body === "object") {
        if (typeof body.name === "string") name = body.name;
        if (body.state !== undefined) {
          const parsed = parseBattlerState(body.state);
          if (!parsed) {
            return Response.json({ error: "Invalid battle state" }, {
              status: 400,
            });
          }
          initialState = parsed;
        }
      }
    } catch {
      // empty body ok
    }

    try {
      const room = await createBattle(user, initialState, name);
      return Response.json(room, { status: 201 });
    } catch (e) {
      if (e instanceof BattleError) {
        return Response.json({ error: e.message }, { status: e.status });
      }
      throw e;
    }
  },
});
