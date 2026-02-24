import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import CharacterSheetEditor from "../../islands/CharacterSheetEditor.tsx";
import { PERK_IDS, PERKS } from "../../data/perks.ts";
import {
  type CharacterDraft,
  getCharacter,
  parseBaseStats,
  parsePerkIds,
  parseRace,
  upsertCharacter,
  validateCharacterProgression,
} from "../../lib/characters.ts";

function parseNonNegativeInt(rawValue: FormDataEntryValue | null) {
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const action = formData.get("action");
    const name = String(formData.get("name") ?? "").trim();
    const changelog = String(formData.get("changelog") ?? "").trim();
    const basedOnSnapshotId = String(formData.get("basedOnSnapshotId") ?? "")
      .trim();
    const race = parseRace(String(formData.get("race") ?? ""));
    const description = String(formData.get("description") ?? "").trim();
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
      !baseStats || !perkIds || unallocatedStatPoints === null ||
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
      race,
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

    await upsertCharacter({ id, ...draft }, changelog, {
      basedOnSnapshotId,
    });

    return Response.redirect(
      new URL(`/characters/${id}?saved=1`, ctx.url),
      303,
    );
  },
});

export default define.page<typeof handler>(async function CharacterPage(ctx) {
  const id = ctx.params.id;
  const character = await getCharacter(id);

  if (!character) {
    return new Response("Character not found.", { status: 404 });
  }

  const justSaved = ctx.url.searchParams.get("saved") === "1";

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>{character.name}</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-4">
        <a href="/" class="underline">← Back to Character List</a>
        <a href={`/characters/${id}/versions`} class="underline block">
          Previous Versions
        </a>
        {justSaved && <p class="text-green-700">Character saved.</p>}
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
});
