import { define } from "@/utils.ts";
import { getBattle } from "@/lib/battles.ts";

/**
 * Public battle snapshot by UUID.
 * Auth not required — knowledge of the id is the capability.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const id = ctx.params.id;
    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }
    const room = await getBattle(id);
    if (!room) {
      return Response.json({ error: "Battle not found" }, { status: 404 });
    }
    return Response.json(room);
  },
});
