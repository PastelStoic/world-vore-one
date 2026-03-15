import { define } from "@/utils.ts";
import {
  banUser,
  isUserBanned,
  listBannedUsers,
  unbanUser,
} from "@/lib/admin.ts";
import { deleteAllCharactersForUser } from "@/lib/character_db.ts";

export const handler = define.handlers({
  /** List all banned users. */
  async GET(ctx) {
    if (!ctx.state.user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const banned = await listBannedUsers();
    return new Response(JSON.stringify(banned), {
      headers: { "content-type": "application/json" },
    });
  },

  /**
   * Ban or unban a user.
   * Body: { userId, username, action: "ban" | "unban" }
   * Banning also deletes all of the user's characters.
   */
  async POST(ctx) {
    if (!ctx.state.user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await ctx.req.json();
    const { userId, username, action } = body as {
      userId: string;
      username?: string;
      action: "ban" | "unban";
    };

    if (!userId || !action) {
      return new Response(
        JSON.stringify({ error: "Missing userId or action." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    // Prevent admins from banning themselves
    if (action === "ban" && userId === ctx.state.user.id) {
      return new Response(
        JSON.stringify({ error: "You cannot ban yourself." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    if (action === "ban") {
      const alreadyBanned = await isUserBanned(userId);
      if (!alreadyBanned) {
        await banUser(userId, username || userId);
        await deleteAllCharactersForUser(userId);
      }
    } else if (action === "unban") {
      await unbanUser(userId);
    } else {
      return new Response(JSON.stringify({ error: "Invalid action." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const banned = await listBannedUsers();
    return new Response(JSON.stringify(banned), {
      headers: { "content-type": "application/json" },
    });
  },
});
