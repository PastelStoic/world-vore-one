import { define } from "@/utils.ts";
import { setBattleName } from "@/lib/battles.ts";
import { handleBattleError, jsonError, requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async PATCH(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;

    let body: { name?: string | null };
    try {
      body = await ctx.req.json();
    } catch {
      return jsonError(400, "Invalid JSON");
    }

    if (
      body.name !== undefined && body.name !== null &&
      typeof body.name !== "string"
    ) {
      return jsonError(400, "name must be a string or null");
    }

    try {
      const room = await setBattleName(
        ctx.params.id,
        user.id,
        body.name ?? null,
      );
      return Response.json(room);
    } catch (e) {
      return handleBattleError(e);
    }
  },
});
