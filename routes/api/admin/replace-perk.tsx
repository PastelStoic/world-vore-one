import { PERKS_BY_ID } from "@/data/perks.ts";
import { replacePerkAcrossCharacters } from "@/lib/characters.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  /** Admin-only: replace one perk id with another across all characters. */
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await ctx.req.json().catch(() => null);
    const fromPerkId = typeof body?.fromPerkId === "string"
      ? body.fromPerkId.trim()
      : "";
    const toPerkId = typeof body?.toPerkId === "string"
      ? body.toPerkId.trim()
      : "";
    const dryRun = body?.dryRun !== false;

    if (!fromPerkId || !toPerkId) {
      return new Response(
        JSON.stringify({ error: "fromPerkId and toPerkId are required." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    if (fromPerkId === toPerkId) {
      return new Response(
        JSON.stringify({ error: "fromPerkId and toPerkId must differ." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    if (!PERKS_BY_ID.has(toPerkId)) {
      return new Response(
        JSON.stringify({ error: `Unknown replacement perk: ${toPerkId}.` }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const result = await replacePerkAcrossCharacters(fromPerkId, toPerkId, {
      dryRun,
    });

    return new Response(JSON.stringify(result), {
      headers: { "content-type": "application/json" },
    });
  },
});
