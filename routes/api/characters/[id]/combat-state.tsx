import { define } from "@/utils.ts";
import { getCharacter, updateCharacterInventory } from "@/lib/characters.ts";
import { parseInventory } from "@/lib/inventory_types.ts";
import {
  jsonError,
  jsonOk,
  requireNotBanned,
  requireOwnerOrAdmin,
} from "@/lib/http.ts";

export const handler = define.handlers({
  async PATCH(ctx) {
    const banned = requireNotBanned(ctx);
    if (banned) return banned;

    const id = ctx.params.id;
    const character = await getCharacter(id);
    if (!character) return jsonError(404, "Character not found");

    const user = requireOwnerOrAdmin(ctx, character.userId);
    if (user instanceof Response) return user;

    const body = await ctx.req.json().catch(() => null);
    const inventory = parseInventory(body?.inventory);
    if (!inventory) return jsonError(400, "Invalid inventory data");

    await updateCharacterInventory(id, inventory);
    return jsonOk();
  },
});
