import { define } from "@/utils.ts";
import { BattleError, endTurn } from "@/lib/battles.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { state?: unknown; expectedRevision?: number };
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (typeof body.expectedRevision !== "number") {
      return Response.json({ error: "expectedRevision required" }, {
        status: 400,
      });
    }

    try {
      const room = await endTurn(
        ctx.params.id,
        user.id,
        body.state,
        body.expectedRevision,
      );
      return Response.json(room);
    } catch (e) {
      if (e instanceof BattleError) {
        return Response.json({ error: e.message }, { status: e.status });
      }
      throw e;
    }
  },
});
