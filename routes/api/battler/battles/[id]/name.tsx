import { define } from "@/utils.ts";
import { BattleError, setBattleName } from "@/lib/battles.ts";

export const handler = define.handlers({
  /** Owner: set battle display name (any status). */
  async PATCH(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { name?: string | null };
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (body.name !== undefined && body.name !== null &&
      typeof body.name !== "string"
    ) {
      return Response.json({ error: "name must be a string or null" }, {
        status: 400,
      });
    }

    try {
      const room = await setBattleName(
        ctx.params.id,
        user.id,
        body.name ?? null,
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
