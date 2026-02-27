import { define } from "../../../../utils.ts";
import {
  getCharacter,
  setCharacterImageId,
} from "../../../../lib/characters.ts";

const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID") ?? "";
const CF_IMAGES_TOKEN = Deno.env.get("CLOUDFLARE_IMAGES_API_TOKEN") ?? "";
const CF_IMAGES_ACCOUNT_HASH = Deno.env.get("CLOUDFLARE_IMAGES_ACCOUNT_HASH") ?? "";

/**
 * Build a Cloudflare Images delivery URL.
 */
export function cfImageUrl(imageId: string, variant = "public") {
  return `https://imagedelivery.net/${CF_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;
}

export const handler = define.handlers({
  /**
   * POST – request a Cloudflare Direct Creator Upload URL.
   * Returns { uploadURL, imageId } so the client can upload directly.
   */
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
    if (character.userId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Request a one-time upload URL from Cloudflare Direct Creator Upload API
    const cfBody = new FormData();
    cfBody.append(
      "metadata",
      JSON.stringify({ characterId, userId: user.id }),
    );
    cfBody.append("requireSignedURLs", "false");

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_IMAGES_TOKEN}`,
        },
        body: cfBody,
      },
    );

    if (!cfRes.ok) {
      const text = await cfRes.text();
      console.error("Cloudflare Direct Upload error:", text);
      return Response.json(
        { error: "Failed to create upload URL" },
        { status: 502 },
      );
    }

    const cfData = await cfRes.json();
    const { id: imageId, uploadURL } = cfData.result;

    return Response.json({ uploadURL, imageId });
  },

  /**
   * PUT – save the image ID on the character after a successful direct upload.
   * Body: { imageId: string }
   */
  async PUT(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const characterId = ctx.params.id;
    const character = await getCharacter(characterId);
    if (!character) {
      return Response.json({ error: "Character not found" }, { status: 404 });
    }
    if (character.userId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: { imageId?: string };
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body.imageId || typeof body.imageId !== "string") {
      return Response.json({ error: "imageId is required" }, { status: 400 });
    }

    // Delete old image from Cloudflare if one existed
    if (character.imageId) {
      await deleteCloudflareImage(character.imageId);
    }

    await setCharacterImageId(characterId, body.imageId);

    return Response.json({
      ok: true,
      imageUrl: cfImageUrl(body.imageId),
    });
  },

  /**
   * DELETE – remove the character's image.
   */
  async DELETE(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const characterId = ctx.params.id;
    const character = await getCharacter(characterId);
    if (!character) {
      return Response.json({ error: "Character not found" }, { status: 404 });
    }
    if (character.userId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (character.imageId) {
      await deleteCloudflareImage(character.imageId);
      await setCharacterImageId(characterId, null);
    }

    return Response.json({ ok: true });
  },
});

async function deleteCloudflareImage(imageId: string) {
  try {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${CF_IMAGES_TOKEN}` },
      },
    );
  } catch (err) {
    console.error("Failed to delete Cloudflare image:", err);
  }
}
