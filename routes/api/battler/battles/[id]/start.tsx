import { define } from "@/utils.ts";
import { startBattle } from "@/lib/battles.ts";
import { handleBattleError, requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;
    try {
      const room = await startBattle(ctx.params.id, user.id);
      return Response.json(room);
    } catch (e) {
      return handleBattleError(e);
    }
  },
});
