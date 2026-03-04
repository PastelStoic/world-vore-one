import { define } from "@/utils.ts";
import { buildDiscordAuthUrl } from "@/lib/auth.ts";

export const handler = define.handlers({
  GET(_ctx) {
    const state = crypto.randomUUID();
    const url = buildDiscordAuthUrl(state);
    return new Response(null, {
      status: 302,
      headers: { location: url },
    });
  },
});
