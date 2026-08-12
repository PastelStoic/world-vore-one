import { define } from "@/utils.ts";
import { createBattle, listMyBattles } from "@/lib/battles.ts";
import { parseBattlerState } from "@/lib/battler_types.ts";
import {
  handleBattleError,
  jsonError,
  requireNotBanned,
  requireUser,
} from "@/lib/http.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;
    const rooms = await listMyBattles(user.id);
    return Response.json({ battles: rooms });
  },

  async POST(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;
    const banned = requireNotBanned(ctx);
    if (banned) return banned;

    let name: string | null = null;
    let initialState = undefined;
    try {
      const body = await ctx.req.json().catch(() => ({}));
      if (body && typeof body === "object") {
        if (typeof body.name === "string") name = body.name;
        if (body.state !== undefined) {
          const parsed = parseBattlerState(body.state);
          if (!parsed) {
            return jsonError(400, "Invalid battle state");
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
      return handleBattleError(e);
    }
  },
});
