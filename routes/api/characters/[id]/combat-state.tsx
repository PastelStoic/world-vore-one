import { define } from "../../../../utils.ts";
import { getCharacter, updateCharacterInventory } from "../../../../lib/characters.ts";
import { parseInventory } from "../../../../lib/inventory_types.ts";

export const handler = define.handlers({
  async PATCH(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = ctx.params.id;
    const character = await getCharacter(id);
    if (!character) {
      return new Response("Character not found", { status: 404 });
    }

    const isOwner = character.userId === user.id;
    if (!isOwner && !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await ctx.req.json();
    const inventory = parseInventory(JSON.stringify(body.inventory));
    if (!inventory) {
      return new Response("Invalid inventory data", { status: 400 });
    }

    await updateCharacterInventory(id, inventory);
    return Response.json({ ok: true });
  },
});
