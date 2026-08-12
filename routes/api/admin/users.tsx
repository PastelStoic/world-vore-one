import { define } from "@/utils.ts";
import { listAdmins, removeAdmin, setAdmin } from "@/lib/admin.ts";
import { jsonError, requireAdmin } from "@/lib/http.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;
    return Response.json(await listAdmins());
  },

  async POST(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;

    const body = await ctx.req.json().catch(() => null);
    const userId = body?.userId;
    const username = body?.username;
    const action = body?.action;
    if (!userId || !action) {
      return jsonError(400, "Missing userId or action");
    }

    if (action === "remove" && userId === admin.id) {
      const admins = await listAdmins();
      if (admins.length <= 1) {
        return jsonError(400, "Cannot remove the last admin.");
      }
    }

    if (action === "add") {
      await setAdmin(userId, username || userId);
    } else if (action === "remove") {
      await removeAdmin(userId);
    } else {
      return jsonError(400, "Invalid action");
    }

    return Response.json(await listAdmins());
  },
});
