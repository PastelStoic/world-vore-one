import { define } from "@/utils.ts";
import CharacterSheetEditor from "@/islands/CharacterSheetEditor.tsx";
import { PERKS } from "@/data/perks.ts";
import {
  createDefaultCharacterDraft,
  setCharacterImageId,
  upsertCharacterDirect,
} from "@/lib/characters.ts";
import {
  buildAndValidateDraft,
  parseCharacterFormData,
} from "@/lib/form_helpers.ts";
import CharacterPageLayout from "@/components/CharacterPageLayout.tsx";
import { isUserBanned } from "@/lib/admin.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (await isUserBanned(user.id)) {
      return new Response(
        "You have been banned and cannot create characters.",
        {
          status: 403,
        },
      );
    }

    const formData = await ctx.req.formData();
    const parsed = parseCharacterFormData(formData);
    if (parsed instanceof Response) return parsed;

    if (parsed.action !== "create") {
      return new Response("Invalid form action.", { status: 400 });
    }

    if (!parsed.changelog) {
      parsed.changelog = "Initial creation";
    }

    const draft = buildAndValidateDraft(parsed);
    if (draft instanceof Response) return draft;

    const id = crypto.randomUUID();
    await upsertCharacterDirect({
      id,
      userId: user.id,
      status: "pending",
      ...draft,
    });

    // If an image was uploaded during creation, associate it with the character
    if (parsed.pendingImageId) {
      await setCharacterImageId(id, parsed.pendingImageId);
    }

    return Response.redirect(
      new URL(`/characters/${id}?saved=1`, ctx.url),
      303,
    );
  },
});

export default define.page<typeof handler>(async (ctx) => {
  if (!ctx.state.user) {
    return new Response(null, {
      status: 302,
      headers: { location: "/auth/discord" },
    });
  }
  if (await isUserBanned(ctx.state.user.id)) {
    return new Response("You have been banned and cannot create characters.", {
      status: 403,
    });
  }
  return (
    <CharacterPageLayout
      title="Create Character"
      backHref="/"
      backLabel="Back to Character List"
    >
      <CharacterSheetEditor
        action="create"
        title="Create Character"
        submitLabel="Create Character"
        initialCharacter={createDefaultCharacterDraft()}
        perks={PERKS}
      />
    </CharacterPageLayout>
  );
});
