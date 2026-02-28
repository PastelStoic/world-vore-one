import { define } from "../../../utils.ts";
import { getCharacter, setCharacterHidden } from "../../../lib/characters.ts";

export const handler = define.handlers({
  /** Admin-only: toggle hidden status on a character. */
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await ctx.req.json().catch(() => null);
    const characterId = body?.characterId;
    const hidden = body?.hidden;
    if (typeof characterId !== "string" || !characterId) {
      return new Response(
        JSON.stringify({ error: "characterId is required." }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const character = await getCharacter(characterId);
    if (!character) {
      return new Response(
        JSON.stringify({ error: "Character not found." }),
        { status: 404, headers: { "content-type": "application/json" } },
      );
    }

    await setCharacterHidden(characterId, Boolean(hidden));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  },
});
