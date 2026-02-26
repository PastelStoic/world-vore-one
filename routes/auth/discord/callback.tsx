import { define } from "../../../utils.ts";
import {
  createSession,
  exchangeCodeForToken,
  fetchDiscordUser,
  setSessionCookie,
} from "../../../lib/auth.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const code = ctx.url.searchParams.get("code");
    if (!code) {
      return new Response("Missing code parameter.", { status: 400 });
    }

    const accessToken = await exchangeCodeForToken(code);
    if (!accessToken) {
      return new Response("Failed to exchange code for token.", {
        status: 400,
      });
    }

    const discordUser = await fetchDiscordUser(accessToken);
    if (!discordUser) {
      return new Response("Failed to fetch Discord user.", { status: 400 });
    }

    const sessionId = await createSession(discordUser);
    const headers = new Headers({ location: "/" });
    setSessionCookie(headers, sessionId);
    return new Response(null, { status: 302, headers });
  },
});
