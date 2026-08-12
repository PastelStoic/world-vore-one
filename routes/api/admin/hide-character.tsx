import { define } from "@/utils.ts";
import { applyCharacterAdminAction } from "@/lib/character_actions.ts";
import { jsonError, jsonOk, requireAdmin } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;
    const body = await ctx.req.json().catch(() => null);
    const characterId = body?.characterId;
    if (typeof characterId !== "string" || !characterId) {
      return jsonError(400, "characterId is required.");
    }
    const result = await applyCharacterAdminAction(
      characterId,
      body?.hidden ? "hide" : "unhide",
    );
    if (!result.character) return jsonError(404, "Character not found.");
    return jsonOk();
  },
});
