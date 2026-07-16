import { define } from "@/utils.ts";
import { BattleError, joinBattle } from "@/lib/battles.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const room = await joinBattle(ctx.params.id, user);
      return Response.json(room);
    } catch (e) {
      if (e instanceof BattleError) {
        return Response.json({ error: e.message }, { status: e.status });
      }
      throw e;
    }
  },
});
