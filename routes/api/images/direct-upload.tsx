import { define } from "@/utils.ts";
import { createDirectUpload } from "@/lib/images.ts";
import { jsonError, requireNotBanned, requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;
    const banned = requireNotBanned(ctx);
    if (banned) return banned;

    const result = await createDirectUpload({ userId: user.id });
    if ("error" in result) return jsonError(502, result.error);
    return Response.json(result);
  },
});
