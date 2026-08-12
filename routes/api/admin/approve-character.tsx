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
    try {
      const result = await applyCharacterAdminAction(characterId, "approve");
      if (!result.character) return jsonError(404, "Character not found.");
      return jsonOk();
    } catch (error) {
      return jsonError(
        (error as { status?: number }).status ?? 400,
        error instanceof Error ? error.message : "Approve failed.",
      );
    }
  },
});
