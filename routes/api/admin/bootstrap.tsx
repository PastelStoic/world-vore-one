import { define } from "@/utils.ts";
import { anyAdminsExist, setAdmin } from "@/lib/admin.ts";

export const handler = define.handlers({
  /** Bootstrap: let a logged-in user become admin when no admins exist. */
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Not logged in", { status: 401 });
    }

    const hasAdmins = await anyAdminsExist();
    if (hasAdmins) {
      return new Response(
        JSON.stringify({
          error: "Admins already exist. Ask an existing admin to promote you.",
        }),
        { status: 403, headers: { "content-type": "application/json" } },
      );
    }

    await setAdmin(user.id, user.username);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  },
});
