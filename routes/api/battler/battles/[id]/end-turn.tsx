import { define } from "@/utils.ts";
import { endTurn } from "@/lib/battles.ts";
import { handleBattleError, jsonError, requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;

    let body: { state?: unknown; expectedRevision?: number };
    try {
      body = await ctx.req.json();
    } catch {
      return jsonError(400, "Invalid JSON");
    }

    if (typeof body.expectedRevision !== "number") {
      return jsonError(400, "expectedRevision required");
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
      return handleBattleError(e);
    }
  },
});
