import { define } from "../../utils.ts";
import {
  clearSessionCookie,
  deleteSession,
  getSessionIdFromRequest,
} from "../../lib/auth.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const sessionId = getSessionIdFromRequest(ctx.req);
    if (sessionId) {
      await deleteSession(sessionId);
    }
    const headers = new Headers({ location: "/" });
    clearSessionCookie(headers);
    return new Response(null, { status: 302, headers });
  },
});
