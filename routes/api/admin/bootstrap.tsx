import { define } from "@/utils.ts";
import { anyAdminsExist, setAdmin } from "@/lib/admin.ts";
import { jsonError, jsonOk, requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;

    const hasAdmins = await anyAdminsExist();
    if (hasAdmins) {
      return jsonError(
        403,
        "Admins already exist. Ask an existing admin to promote you.",
      );
    }

    await setAdmin(user.id, user.username);
    return jsonOk();
  },
});
