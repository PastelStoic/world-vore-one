import { Head } from "fresh/runtime";
import { define } from "../../../utils.ts";
import CharacterSheetEditor from "../../../islands/CharacterSheetEditor.tsx";
import { PERK_IDS, PERKS } from "../../../data/perks.ts";
import {
  type CharacterDraft,
  getCharacter,
  parseBaseStats,
  parseDescription,
  parsePerkIds,
  upsertCharacter,
  validateCharacterProgression,
} from "../../../lib/characters.ts";

function parseNonNegativeInt(rawValue: FormDataEntryValue | null) {
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await ctx.req.formData();
    const action = formData.get("action");
    const name = String(formData.get("name") ?? "").trim();
    const changelog = String(formData.get("changelog") ?? "").trim();
    const basedOnSnapshotId = String(formData.get("basedOnSnapshotId") ?? "")
      .trim();
    const description = parseDescription(
      String(formData.get("description") ?? "{}"),
    );
    const baseStats = parseBaseStats(String(formData.get("baseStats") ?? ""));
    const perkIds = parsePerkIds(String(formData.get("perkIds") ?? ""));
    const unallocatedStatPoints = parseNonNegativeInt(
      formData.get("unallocatedStatPoints"),
    );
    const unspentPerkPoints = parseNonNegativeInt(
      formData.get("unspentPerkPoints"),
    );

    if (!name) {
      return new Response("Name is required.", { status: 400 });
    }

    if (!changelog) {
      return new Response("Changelog is required.", { status: 400 });
    }

    if (
      !description || !baseStats || !perkIds ||
      unallocatedStatPoints === null ||
      unspentPerkPoints === null
    ) {
      return new Response("Invalid character payload.", { status: 400 });
    }

    if (action !== "update") {
      return new Response("Invalid form action.", { status: 400 });
    }

    if (perkIds.some((id) => !PERK_IDS.has(id))) {
      return new Response("Invalid perk id in payload.", { status: 400 });
    }

    const draft: CharacterDraft = {
      name,
      race: "Baseliner", // Overwritten with existing character's race below
      description,
      baseStats,
      unallocatedStatPoints,
      unspentPerkPoints,
      perkIds,
    };

    const progressionError = validateCharacterProgression(draft);
    if (progressionError) {
      return new Response(progressionError, { status: 400 });
    }

    const id = ctx.params.id;
    const existing = await getCharacter(id);
    if (!existing) {
      return new Response("Character not found.", { status: 404 });
    }

    if (existing.userId !== user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Race is immutable after creation — always use the existing value
    draft.race = existing.race;

    await upsertCharacter({ id, userId: user.id, ...draft }, changelog, {
      basedOnSnapshotId,
    });

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
    if (!user || character.userId !== user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    return (
      <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
        <Head>
          <title>Edit: {character.name}</title>
        </Head>
        <div class="max-w-3xl mx-auto space-y-4">
          <a href={`/characters/${id}`} class="underline">
            ← Back to Character
          </a>
          <CharacterSheetEditor
            action="update"
            title={`Edit: ${character.name}`}
            submitLabel="Save Changes"
            characterId={character.id}
            basedOnSnapshotId={character.latestSnapshotId}
            initialCharacter={character}
            perks={PERKS}
          />
        </div>
      </div>
    );
  },
);
