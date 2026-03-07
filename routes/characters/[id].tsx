import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import CharacterSheetViewer from "@/islands/CharacterSheetViewer.tsx";
import { PERKS } from "@/data/perks.ts";
import {
  getCharacter,
  setCharacterHidden,
  setCharacterStatus,
} from "@/lib/characters.ts";
import { cfImageUrl } from "@/routes/api/characters/[id]/image.tsx";
import CharacterPageLayout from "@/components/CharacterPageLayout.tsx";
import { ButtonLink } from "@/components/Button.tsx";

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

    if (action === "disapprove" && ctx.state.isAdmin) {
      await setCharacterStatus(id, "pending");
    }

    const returnTo = formData.get("returnTo");
    const redirectTarget = (typeof returnTo === "string" && returnTo.startsWith("/"))
      ? returnTo
      : `/characters/${id}`;
    return Response.redirect(new URL(redirectTarget, ctx.url), 303);
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
  const canSeeDisguisedPerks = isOwner || !!ctx.state.isAdmin;

  // For non-owners/non-admins, swap disguised perks with their fake versions.
  // The fake perk IDs go into displayOnlyPerkIds (shown but not used for stats).
  let viewCharacter = character;
  let displayOnlyPerkIds: string[] = [];

  if (!canSeeDisguisedPerks && character.perkDisguises) {
    const disguises = character.perkDisguises;
    const filteredPerkIds = character.perkIds.filter(
      (id) => !(id in disguises),
    );
    displayOnlyPerkIds = Object.values(disguises);
    viewCharacter = {
      ...character,
      perkIds: filteredPerkIds,
      perkDisguises: undefined,
    };
  }

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
        <meta
          property="og:title"
          content={`Character Sheet: ${character.name}`}
        />
        <meta property="og:type" content="website" />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta
          name="twitter:card"
          content={imageUrl ? "summary_large_image" : "summary"}
        />
        <meta
          name="twitter:title"
          content={`Character Sheet: ${character.name}`}
        />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </Head>
      {character.status === "pending" && (
        <div class="flex items-center gap-3 px-3 py-2 bg-warning/10 border border-warning/50 rounded text-warning text-sm">
          <span class="font-medium">Pending Approval</span>
          <span>This character is awaiting admin approval.</span>
          {ctx.state.isAdmin && (
            <form method="POST" class="ml-auto">
              <input type="hidden" name="action" value="approve" />
              <button
                type="submit"
                class="px-3 py-1 bg-success text-primary-content rounded hover:bg-success/90 transition-colors text-xs"
              >
                Approve
              </button>
            </form>
          )}
        </div>
      )}
      {character.status !== "pending" && ctx.state.isAdmin && (
        <div class="flex items-center gap-3 px-3 py-2 bg-primary/10 border border-primary/50 rounded text-primary text-sm">
          <span class="font-medium">Approved</span>
          <span>Disapprove to allow name/description edits again.</span>
          <form method="POST" class="ml-auto">
            <input type="hidden" name="action" value="disapprove" />
            <button
              type="submit"
              class="px-3 py-1 bg-primary text-primary-content rounded hover:bg-primary/90 transition-colors text-xs"
            >
              Disapprove
            </button>
          </form>
        </div>
      )}
      {canEdit && (
        <div class="flex gap-4">
          <ButtonLink href={`/characters/${id}/edit`}>Edit Character</ButtonLink>
          <a href={`/characters/${id}/versions`} class="underline self-center">
            Previous Versions
          </a>
          <form method="POST" class="self-center">
            <input type="hidden" name="action" value="toggle-hidden" />
            <button
              type="submit"
              class="underline text-base-content/70 hover:text-base-content cursor-pointer"
            >
              {character.hidden ? "Unhide Character" : "Hide Character"}
            </button>
          </form>
        </div>
      )}
      {justSaved && <p class="text-success">Character saved.</p>}
      <CharacterSheetViewer
        character={viewCharacter}
        perks={PERKS}
        imageUrl={imageUrl}
        characterId={id}
        canSeeDisguisedPerks={canSeeDisguisedPerks}
        displayOnlyPerkIds={displayOnlyPerkIds}
        canEditCombatState={canEdit}
      />
    </CharacterPageLayout>
  );
});
