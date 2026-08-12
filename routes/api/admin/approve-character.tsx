import { define } from "@/utils.ts";
import { getCharacter, setCharacterStatus } from "@/lib/characters.ts";
import { jsonError, jsonOk, requireAdmin } from "@/lib/http.ts";

export const handler = define.handlers({
  /** Admin-only: approve a pending character. */
  async POST(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;

    const body = await ctx.req.json().catch(() => null);
    const characterId = body?.characterId;
    if (typeof characterId !== "string" || !characterId) {
      return jsonError(400, "characterId is required.");
    }

    const character = await getCharacter(characterId);
    if (!character) return jsonError(404, "Character not found.");
    if (character.status !== "pending") {
      return jsonError(400, "Character is not pending.");
    }

    await setCharacterStatus(characterId, "approved");
    return jsonOk();
  },
});
