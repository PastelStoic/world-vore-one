import { define } from "@/utils.ts";
import { buildDiscordAuthUrl } from "@/lib/auth.ts";

export const handler = define.handlers({
  GET(ctx) {
    const state = crypto.randomUUID();
    const url = buildDiscordAuthUrl(state, ctx.url);
    return new Response(null, {
      status: 302,
      headers: { location: url },
    });
  },
});
