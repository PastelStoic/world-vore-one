import { define } from "@/utils.ts";
import { getCharacter } from "@/lib/characters.ts";
import {
  filenameForCharacterExport,
  serializeCharacterDraft,
} from "@/lib/character_import_export.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = ctx.params.id;
    const character = await getCharacter(id);
    if (!character) {
      return new Response("Character not found.", { status: 404 });
    }

    const isOwner = character.userId === user.id;
    if (!isOwner && !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = serializeCharacterDraft(character);
    const filename = filenameForCharacterExport(character.name);

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    });
  },
});
