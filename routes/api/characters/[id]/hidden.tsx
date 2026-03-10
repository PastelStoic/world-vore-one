import { define } from "@/utils.ts";
import { getCharacter, setCharacterHidden } from "@/lib/characters.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const characterId = ctx.params.id;
    const character = await getCharacter(characterId);
    if (!character) {
      return Response.json({ error: "Character not found" }, { status: 404 });
    }
    if (character.userId !== user.id && !ctx.state.isAdmin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await ctx.req.json();
    const hidden = !!body.hidden;

    await setCharacterHidden(characterId, hidden);

    return Response.json({ ok: true, hidden });
  },
});
