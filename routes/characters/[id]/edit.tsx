import { define } from "@/utils.ts";
import CharacterSheetEditor from "@/islands/CharacterSheetEditor.tsx";
import { PERKS } from "@/data/perks.ts";
import {
  getCharacter,
  upsertCharacter,
  upsertCharacterDirect,
} from "@/lib/characters.ts";
import {
  buildAndValidateDraft,
  parseCharacterFormData,
} from "@/lib/form_helpers.ts";
import { cfImageUrl } from "@/routes/api/characters/[id]/image.tsx";
import CharacterPageLayout from "@/components/CharacterPageLayout.tsx";

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await ctx.req.formData();
    const parsed = parseCharacterFormData(formData);
    if (parsed instanceof Response) return parsed;

    if (parsed.action !== "update") {
      return new Response("Invalid form action.", { status: 400 });
    }

    const id = ctx.params.id;
    const existing = await getCharacter(id);
    if (!existing) {
      return new Response("Character not found.", { status: 404 });
    }

    const isPending = existing.status === "pending";

    if (!isPending && !parsed.changelog) {
      return new Response("Changelog is required.", { status: 400 });
    }

    const isOwner = existing.userId === user.id;
    if (!isOwner && !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    // Race is immutable after approval, but can be changed while the character is pending
    if (!isPending) {
      parsed.race = existing.race;
    }

    // After approval, identity fields are immutable until disapproved
    if (!isPending) {
      parsed.name = existing.name;
      parsed.description = existing.description;
    }

    const draft = buildAndValidateDraft(parsed);
    if (draft instanceof Response) return draft;

    // If an admin is editing someone else's character, note it in the changelog
    const changelog = !isOwner
      ? `[Admin edit by ${user.username}] ${parsed.changelog}`
      : parsed.changelog;

    if (isPending) {
      // Pending characters save directly without snapshots or changelog
      await upsertCharacterDirect({
        id,
        userId: existing.userId,
        status: "pending",
        ...draft,
      });
    } else {
      await upsertCharacter(
        { id, userId: existing.userId, ...draft },
        changelog,
        {
          basedOnSnapshotId: parsed.basedOnSnapshotId,
        },
      );
    }

    return Response.redirect(
      new URL(`/characters/${id}?saved=1`, ctx.url),
      303,
    );
  },
});

export default define.page<typeof handler>(
  async function CharacterEditPage(ctx) {
    const id = ctx.params.id;
    const character = await getCharacter(id);

    if (!character) {
      return new Response("Character not found.", { status: 404 });
    }

    const user = ctx.state.user;
    const isOwner = user !== null && character.userId === user.id;
    if (!user || (!isOwner && !ctx.state.isAdmin)) {
      return new Response("Forbidden", { status: 403 });
    }

    return (
      <CharacterPageLayout
        title={`Edit: ${character.name}`}
        backHref={`/characters/${id}`}
        backLabel="Back to Character"
      >
        <CharacterSheetEditor
          action="update"
          title={`Edit: ${character.name}`}
          submitLabel="Save Changes"
          characterId={character.id}
          basedOnSnapshotId={character.latestSnapshotId}
          initialCharacter={character}
          perks={PERKS}
          isPending={character.status === "pending"}
          imageUrl={character.imageId
            ? cfImageUrl(character.imageId)
            : undefined}
        />
      </CharacterPageLayout>
    );
  },
);
