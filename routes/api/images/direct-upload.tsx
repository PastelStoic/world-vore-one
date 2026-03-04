import { define } from "@/utils.ts";

const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID") ?? "";
const CF_IMAGES_TOKEN = Deno.env.get("CLOUDFLARE_IMAGES_API_TOKEN") ?? "";

/**
 * POST – request a Cloudflare Direct Creator Upload URL.
 * Does NOT require a character ID — usable during character creation.
 * Returns { uploadURL, imageId }.
 */
export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cfBody = new FormData();
    cfBody.append(
      "metadata",
      JSON.stringify({ userId: user.id }),
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
});
