import { define } from "@/utils.ts";
import {
  upsertCharacterDirect,
  validateAccountLimitedPerksForUser,
} from "@/lib/characters.ts";
import { parseAndValidateCharacterJson } from "@/lib/character_import_export.ts";
import { isModeratorOnlyFaction } from "@/data/factions.ts";
import CharacterPageLayout from "@/components/CharacterPageLayout.tsx";
import { ButtonLink } from "@/components/Button.tsx";

const MAX_UPLOAD_BYTES = 1_000_000; // 1 MB

function redirectHomeWithError(ctxUrl: URL, message: string): Response {
  const url = new URL("/", ctxUrl);
  url.searchParams.set("importError", message);
  return Response.redirect(url, 303);
}

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (ctx.state.isBanned) {
      return new Response(
        "You have been banned and cannot create characters.",
        { status: 403 },
      );
    }

    const contentType = ctx.req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return redirectHomeWithError(
        ctx.url,
        "Upload a JSON file using the import form.",
      );
    }

    const formData = await ctx.req.formData();
    const fileEntry = formData.get("file");
    if (!(fileEntry instanceof File)) {
      return redirectHomeWithError(ctx.url, "Choose a JSON file to upload.");
    }
    if (fileEntry.size <= 0) {
      return redirectHomeWithError(ctx.url, "The uploaded file is empty.");
    }
    if (fileEntry.size > MAX_UPLOAD_BYTES) {
      return redirectHomeWithError(
        ctx.url,
        "JSON file is too large (max 1 MB).",
      );
    }

    const rawText = await fileEntry.text();
    const draft = parseAndValidateCharacterJson(rawText, {
      isAdmin: ctx.state.isAdmin,
    });
    if (draft instanceof Response) {
      const message = await draft.text();
      return redirectHomeWithError(
        ctx.url,
        message || "Invalid character sheet JSON.",
      );
    }

    if (
      !ctx.state.isAdmin && isModeratorOnlyFaction(draft.description.faction)
    ) {
      return redirectHomeWithError(
        ctx.url,
        "That faction can only be assigned by a moderator.",
      );
    }

    const perkAccountLimitError = await validateAccountLimitedPerksForUser(
      user.id,
      draft,
    );
    if (perkAccountLimitError) {
      return redirectHomeWithError(ctx.url, perkAccountLimitError);
    }

    const id = crypto.randomUUID();
    await upsertCharacterDirect({
      id,
      userId: user.id,
      status: "pending",
      ...draft,
    });

    return Response.redirect(
      new URL(`/characters/${id}?saved=1`, ctx.url),
      303,
    );
  },
});

export default define.page(function ImportCharacterPage() {
  return (
    <CharacterPageLayout
      title="Import Character"
      backHref="/"
      backLabel="Back to Character List"
    >
      <p class="text-base-content">
        Use the upload form on the character list to import a JSON sheet.
      </p>
      <ButtonLink href="/">Back to Character List</ButtonLink>
    </CharacterPageLayout>
  );
});
