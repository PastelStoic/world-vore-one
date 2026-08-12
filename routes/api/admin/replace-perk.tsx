import { PERKS_BY_ID } from "@/data/perks.ts";
import { replacePerkAcrossCharacters } from "@/lib/characters.ts";
import { jsonError, requireAdmin } from "@/lib/http.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;

    const body = await ctx.req.json().catch(() => null);
    const fromPerkId = typeof body?.fromPerkId === "string"
      ? body.fromPerkId.trim()
      : "";
    const toPerkId = typeof body?.toPerkId === "string"
      ? body.toPerkId.trim()
      : "";
    const dryRun = body?.dryRun !== false;

    if (!fromPerkId || !toPerkId) {
      return jsonError(400, "fromPerkId and toPerkId are required.");
    }
    if (fromPerkId === toPerkId) {
      return jsonError(400, "fromPerkId and toPerkId must differ.");
    }
    if (!PERKS_BY_ID.has(toPerkId)) {
      return jsonError(400, `Unknown replacement perk: ${toPerkId}.`);
    }

    const result = await replacePerkAcrossCharacters(fromPerkId, toPerkId, {
      dryRun,
    });
    return Response.json(result);
  },
});
