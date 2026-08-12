import { App, staticFiles } from "fresh";
import type { State } from "./utils.ts";
import { getSession, getSessionIdFromRequest } from "./lib/auth.ts";
import { isAdmin, isUserBanned } from "./lib/admin.ts";
import { isUserValidated } from "./lib/user_profiles.ts";
import { cacheStaticFiles } from "./middleware/static_files.ts";
import { PERKS_BY_ID } from "./data/perks.ts";

console.log("Initialized", PERKS_BY_ID.size, "perks");

export const app = new App<State>();

app.get("/favicon.ico", async () => {
  const file = await Deno.open("static/favicon.ico");
  const headers = new Headers({
    "Content-Type": "image/x-icon",
    vary: "If-None-Match",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Deno-Cache-Id": "favicon-v1",
  });
  return new Response(file.readable, { headers });
});

// Fixes Cache-Control headers on responses from staticFiles() — must come first
// so it can post-process the response. staticFiles() serves built assets with
// correct MIME types but misapplies no-cache to Vite's content-hashed JS files.
app.use(cacheStaticFiles());
app.use(staticFiles());

// Auth middleware – resolves user from session cookie
app.use(async (ctx) => {
  const sessionId = getSessionIdFromRequest(ctx.req);
  ctx.state.user = sessionId ? await getSession(sessionId) : null;
  ctx.state.isAdmin = ctx.state.user ? await isAdmin(ctx.state.user.id) : false;
  ctx.state.isBanned = ctx.state.user
    ? await isUserBanned(ctx.state.user.id)
    : false;
  ctx.state.isValidated = ctx.state.user
    ? await isUserValidated(ctx.state.user.id)
    : false;

  return await ctx.next();
});

// Include file-system based routes here
app.fsRoutes();
