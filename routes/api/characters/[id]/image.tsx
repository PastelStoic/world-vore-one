import { define } from "@/utils.ts";
import { getCharacter, setCharacterImageId } from "@/lib/characters.ts";
import {
  cfImageUrl,
  createDirectUpload,
  deleteCloudflareImage,
} from "@/lib/images.ts";
import {
  jsonError,
  jsonOk,
  requireNotBanned,
  requireOwnerOrAdmin,
} from "@/lib/http.ts";

export { cfImageUrl };

export const handler = define.handlers({
  async POST(ctx) {
    const banned = requireNotBanned(ctx);
    if (banned) return banned;

    const character = await getCharacter(ctx.params.id);
    if (!character) return jsonError(404, "Character not found");
    const user = requireOwnerOrAdmin(ctx, character.userId);
    if (user instanceof Response) return user;

    const result = await createDirectUpload({
      characterId: character.id,
      userId: user.id,
    });
    if ("error" in result) return jsonError(502, result.error);
    return Response.json(result);
  },

  async PUT(ctx) {
    const banned = requireNotBanned(ctx);
    if (banned) return banned;

    const character = await getCharacter(ctx.params.id);
    if (!character) return jsonError(404, "Character not found");
    const user = requireOwnerOrAdmin(ctx, character.userId);
    if (user instanceof Response) return user;

    let body: { imageId?: string };
    try {
      body = await ctx.req.json();
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    if (!body.imageId || typeof body.imageId !== "string") {
      return jsonError(400, "imageId is required");
    }

    if (character.imageId) {
      await deleteCloudflareImage(character.imageId);
    }

    await setCharacterImageId(character.id, body.imageId);
    return Response.json({ ok: true, imageUrl: cfImageUrl(body.imageId) });
  },

  async DELETE(ctx) {
    const banned = requireNotBanned(ctx);
    if (banned) return banned;

    const character = await getCharacter(ctx.params.id);
    if (!character) return jsonError(404, "Character not found");
    const user = requireOwnerOrAdmin(ctx, character.userId);
    if (user instanceof Response) return user;

    if (character.imageId) {
      await deleteCloudflareImage(character.imageId);
      await setCharacterImageId(character.id, null);
    }

    return jsonOk();
  },
});
