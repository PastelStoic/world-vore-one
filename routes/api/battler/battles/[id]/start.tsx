import { define } from "@/utils.ts";
import { BattleError, startBattle } from "@/lib/battles.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const room = await startBattle(ctx.params.id, user.id);
      return Response.json(room);
    } catch (e) {
      if (e instanceof BattleError) {
        return Response.json({ error: e.message }, { status: e.status });
      }
      throw e;
    }
  },
});
