import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import CharacterSheetViewer from "../../islands/CharacterSheetViewer.tsx";
import { PERKS } from "../../data/perks.ts";
import {
  getCharacter,
  setCharacterHidden,
  setCharacterStatus,
} from "../../lib/characters.ts";
import { cfImageUrl } from "../api/characters/[id]/image.tsx";
import CharacterPageLayout from "../../components/CharacterPageLayout.tsx";

export const handler = define.handlers({
  async POST(ctx) {
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

    const formData = await ctx.req.formData();
    const action = formData.get("action");

    if (action === "toggle-hidden") {
      await setCharacterHidden(id, !character.hidden);
    }

    if (action === "approve" && ctx.state.isAdmin) {
      await setCharacterStatus(id, "approved");
    }

    return Response.redirect(new URL(`/characters/${id}`, ctx.url), 303);
  },
});

export default define.page<typeof handler>(async function CharacterPage(ctx) {
  const id = ctx.params.id;
  const character = await getCharacter(id);

  if (!character) {
    return new Response("Character not found.", { status: 404 });
  }

  const user = ctx.state.user;
  const isOwner = user !== null && character.userId === user.id;
  const canEdit = isOwner || ctx.state.isAdmin;

  const justSaved = ctx.url.searchParams.get("saved") === "1";
  const imageUrl = character.imageId
    ? cfImageUrl(character.imageId)
    : undefined;

  return (
    <CharacterPageLayout
      title={character.name}
      backHref={isOwner ? "/" : undefined}
      backLabel={isOwner ? "Back to Character List" : undefined}
    >
      <Head>
        <title>{`Character Sheet: ${character.name}`}</title>
        <meta property="og:title" content={`Character Sheet: ${character.name}`} />
        <meta property="og:type" content="website" />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={`Character Sheet: ${character.name}`} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </Head>
      {character.status === "pending" && (
        <div class="flex items-center gap-3 px-3 py-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-800 text-sm">
          <span class="font-medium">Pending Approval</span>
          <span>This character is awaiting admin approval.</span>
          {ctx.state.isAdmin && (
            <form method="POST" class="ml-auto">
              <input type="hidden" name="action" value="approve" />
              <button
                type="submit"
                class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
              >
                Approve
              </button>
            </form>
          )}
        </div>
      )}
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
          <form method="POST" class="self-center">
            <input type="hidden" name="action" value="toggle-hidden" />
            <button
              type="submit"
              class="underline text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              {character.hidden ? "Unhide Character" : "Hide Character"}
            </button>
          </form>
        </div>
      )}
      {justSaved && <p class="text-green-700">Character saved.</p>}
      <CharacterSheetViewer
        character={character}
        perks={PERKS}
        imageUrl={imageUrl}
      />
    </CharacterPageLayout>
  );
});
