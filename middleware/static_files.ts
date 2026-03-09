import type { Context } from "fresh";
import { State } from "../utils.ts";

/**
 * Middleware that wraps Fresh's built-in staticFiles() to fix Cache-Control
 * headers for Vite-generated assets and static root files.
 *
 * Problem: Fresh v2's staticFiles() applies immutable caching only when
 * requests include a ?__frsh_c=BUILD_ID param (CSS via asset()) or use the
 * legacy /_fresh/js/BUILD_ID/ path format. Vite-generated JS assets served
 * from /assets/ with content hashes in the filename match neither condition,
 * so they're served with no-cache headers despite being safely cacheable.
 *
 * Place this middleware BEFORE staticFiles() in the chain:
 *   app.use(cacheStaticFiles());
 *   app.use(staticFiles());
 */

/** Vite places all client build output under /assets/ with content hashes. */
const VITE_ASSET_RE = /^\/assets\//;

/** Common static file extensions for root-level assets (favicon, logo, etc.) */
const STATIC_FILE_RE = /\.(ico|svg|png|jpg|jpeg|gif|webp|avif|woff2?|ttf|eot)$/;

export function cacheStaticFiles() {
  return async function (ctx: Context<State>) {
    const response = await ctx.next();

    if (!response.ok) return response;

    const pathname = decodeURIComponent(ctx.url.pathname);

    if (VITE_ASSET_RE.test(pathname)) {
      // Vite assets have content hashes in filenames — safe to cache forever
      response.headers.set(
        "Cache-Control",
        "public, max-age=31536000, immutable",
      );
    } else if (STATIC_FILE_RE.test(pathname)) {
      // Root static files without content hashes — cache with ETag revalidation
      response.headers.set("Cache-Control", "public, max-age=86400");
    }

    return response;
  };
}
