import { define } from "@/utils.ts";
import {
  type CharacterAdminAction,
  applyCharacterAdminAction,
} from "@/lib/character_actions.ts";
import { jsonError, jsonOk, requireAdmin } from "@/lib/http.ts";

const ACTIONS = new Set<CharacterAdminAction>([
  "approve",
  "disapprove",
  "hide",
  "unhide",
  "delete",
]);

export const handler = define.handlers({
  async POST(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;

    const body = await ctx.req.json().catch(() => null);
    const characterId = body?.characterId;
    const action = body?.action as CharacterAdminAction | undefined;
    if (typeof characterId !== "string" || !characterId) {
      return jsonError(400, "characterId is required.");
    }
    if (!action || !ACTIONS.has(action)) {
      return jsonError(400, "Invalid action.");
    }

    try {
      const result = await applyCharacterAdminAction(characterId, action);
      if (!result.character) return jsonError(404, "Character not found.");
      return jsonOk({
        ok: true,
        deleted: result.deleted,
        hidden: result.character.hidden ?? false,
        status: result.character.status ?? "approved",
      });
    } catch (error) {
      const status = (error as { status?: number }).status ?? 500;
      return jsonError(
        status,
        error instanceof Error ? error.message : "Action failed.",
      );
    }
  },
});
