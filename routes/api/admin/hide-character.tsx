import { define } from "@/utils.ts";
import { getCharacter, setCharacterHidden } from "@/lib/characters.ts";
import { jsonError, jsonOk, requireAdmin } from "@/lib/http.ts";

export const handler = define.handlers({
  /** Admin-only: toggle hidden status on a character. */
  async POST(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;

    const body = await ctx.req.json().catch(() => null);
    const characterId = body?.characterId;
    const hidden = body?.hidden;
    if (typeof characterId !== "string" || !characterId) {
      return jsonError(400, "characterId is required.");
    }

    const character = await getCharacter(characterId);
    if (!character) return jsonError(404, "Character not found.");

    await setCharacterHidden(characterId, Boolean(hidden));
    return jsonOk();
  },
});
