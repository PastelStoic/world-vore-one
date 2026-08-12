// ---------------------------------------------------------------------------
// Cloudflare Images helpers
// ---------------------------------------------------------------------------

const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID") ?? "";
const CF_IMAGES_TOKEN = Deno.env.get("CLOUDFLARE_IMAGES_API_TOKEN") ?? "";
const CF_IMAGES_ACCOUNT_HASH = Deno.env.get("CLOUDFLARE_IMAGES_ACCOUNT_HASH") ??
  "";

export function cfImageUrl(imageId: string, variant = "public"): string {
  return `https://imagedelivery.net/${CF_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;
}

export async function createDirectUpload(metadata: Record<string, string>): Promise<
  { imageId: string; uploadURL: string } | { error: string }
> {
  const cfBody = new FormData();
  cfBody.append("metadata", JSON.stringify(metadata));
  cfBody.append("requireSignedURLs", "false");

  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${CF_IMAGES_TOKEN}` },
      body: cfBody,
    },
  );

  if (!cfRes.ok) {
    const text = await cfRes.text();
    console.error("Cloudflare Direct Upload error:", text);
    return { error: "Failed to create upload URL" };
  }

  const cfData = await cfRes.json();
  const { id: imageId, uploadURL } = cfData.result;
  return { imageId, uploadURL };
}

export async function deleteCloudflareImage(imageId: string): Promise<void> {
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
