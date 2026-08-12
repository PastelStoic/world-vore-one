import { define } from "@/utils.ts";
import { joinBattle } from "@/lib/battles.ts";
import { handleBattleError, requireNotBanned, requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;
    const banned = requireNotBanned(ctx);
    if (banned) return banned;
    try {
      const room = await joinBattle(ctx.params.id, user);
      return Response.json(room);
    } catch (e) {
      return handleBattleError(e);
    }
  },
});
