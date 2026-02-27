import { define } from "../../../utils.ts";
import {
  setAdmin,
  removeAdmin,
  listAdmins,
} from "../../../lib/admin.ts";

export const handler = define.handlers({
  /** List all admins. */
  async GET(ctx) {
    const user = ctx.state.user;
    if (!user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const admins = await listAdmins();
    return new Response(JSON.stringify(admins), {
      headers: { "content-type": "application/json" },
    });
  },

  /** Add or remove an admin. Body: { userId, username, action: "add" | "remove" } */
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await ctx.req.json();
    const { userId, username, action } = body as {
      userId: string;
      username: string;
      action: "add" | "remove";
    };

    if (!userId || !action) {
      return new Response("Missing userId or action", { status: 400 });
    }

    // Prevent removing yourself as admin if you're the last admin
    if (action === "remove" && userId === user.id) {
      const admins = await listAdmins();
      if (admins.length <= 1) {
        return new Response(
          JSON.stringify({ error: "Cannot remove the last admin." }),
          { status: 400, headers: { "content-type": "application/json" } },
        );
      }
    }

    if (action === "add") {
      await setAdmin(userId, username || userId);
    } else if (action === "remove") {
      await removeAdmin(userId);
    } else {
      return new Response("Invalid action", { status: 400 });
    }

    const admins = await listAdmins();
    return new Response(JSON.stringify(admins), {
      headers: { "content-type": "application/json" },
    });
  },
});
