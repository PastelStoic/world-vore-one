import { define } from "../../utils.ts";
import CharacterSheetViewer from "../../islands/CharacterSheetViewer.tsx";
import { PERKS } from "../../data/perks.ts";
import { getCharacter } from "../../lib/characters.ts";
import { cfImageUrl } from "../api/characters/[id]/image.tsx";
import CharacterPageLayout from "../../components/CharacterPageLayout.tsx";

export default define.page(async function CharacterPage(ctx) {
  const id = ctx.params.id;
  const character = await getCharacter(id);

  if (!character) {
    return new Response("Character not found.", { status: 404 });
  }

  const user = ctx.state.user;
  const isOwner = user !== null && character.userId === user.id;
  const canEdit = isOwner || ctx.state.isAdmin;

  const justSaved = ctx.url.searchParams.get("saved") === "1";

  return (
    <CharacterPageLayout
      title={character.name}
      backHref="/"
      backLabel="Back to Character List"
    >
      {canEdit && (
        <div class="flex gap-4">
          <a
            href={`/characters/${id}/edit`}
            class="inline-block px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Edit Character
          </a>
          <a href={`/characters/${id}/versions`} class="underline self-center">
            Previous Versions
          </a>
        </div>
      )}
      {justSaved && <p class="text-green-700">Character saved.</p>}
      <CharacterSheetViewer
        character={character}
        perks={PERKS}
        imageUrl={character.imageId ? cfImageUrl(character.imageId) : undefined}
      />
    </CharacterPageLayout>
  );
});
