import { define } from "@/utils.ts";
import {
  banUser,
  isUserBanned,
  listBannedUsers,
  unbanUser,
} from "@/lib/admin.ts";
import { deleteAllCharactersForUser } from "@/lib/character_db.ts";
import { jsonError, requireAdmin } from "@/lib/http.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;
    return Response.json(await listBannedUsers());
  },

  async POST(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;

    const body = await ctx.req.json().catch(() => null);
    const userId = body?.userId;
    const username = body?.username;
    const action = body?.action;
    if (!userId || !action) {
      return jsonError(400, "Missing userId or action.");
    }

    if (action === "ban" && userId === admin.id) {
      return jsonError(400, "You cannot ban yourself.");
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
      return jsonError(400, "Invalid action.");
    }

    return Response.json(await listBannedUsers());
  },
});
