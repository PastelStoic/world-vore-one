import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import CharacterSheetEditor from "../../islands/CharacterSheetEditor.tsx";
import { PERK_IDS, PERKS } from "../../data/perks.ts";
import {
  type CharacterDraft,
  createDefaultCharacterDraft,
  parseBaseStats,
  parseDescription,
  parsePerkIds,
  parseRace,
  setCharacterImageId,
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
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await ctx.req.formData();
    const action = formData.get("action");
    const name = String(formData.get("name") ?? "").trim();
    const changelog = String(formData.get("changelog") ?? "").trim() || "Initial creation";
    const race = parseRace(String(formData.get("race") ?? ""));
    const description = parseDescription(String(formData.get("description") ?? "{}"));
    const baseStats = parseBaseStats(String(formData.get("baseStats") ?? ""));
    const perkIds = parsePerkIds(String(formData.get("perkIds") ?? ""));
    const unallocatedStatPoints = parseNonNegativeInt(
      formData.get("unallocatedStatPoints"),
    );

    if (!name) {
      return new Response("Name is required.", { status: 400 });
    }

    if (
      !description || !baseStats || !perkIds || unallocatedStatPoints === null
    ) {
      return new Response("Invalid character payload.", { status: 400 });
    }

    if (action !== "create") {
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
      perkIds,
    };

    const progressionError = validateCharacterProgression(draft);
    if (progressionError) {
      return new Response(progressionError, { status: 400 });
    }

    const id = crypto.randomUUID();
    await upsertCharacter({ id, userId: user.id, ...draft }, changelog);

    // If an image was uploaded during creation, associate it with the character
    const pendingImageId = String(formData.get("pendingImageId") ?? "").trim();
    if (pendingImageId) {
      await setCharacterImageId(id, pendingImageId);
    }

    return Response.redirect(
      new URL(`/characters/${id}?saved=1`, ctx.url),
      303,
    );
  },
});

export default define.page<typeof handler>((ctx) => {
  if (!ctx.state.user) {
    return new Response(null, {
      status: 302,
      headers: { location: "/auth/discord" },
    });
  }
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Create Character</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-4">
        <a href="/" class="underline">← Back to Character List</a>
        <CharacterSheetEditor
          action="create"
          title="Create Character"
          submitLabel="Create Character"
          initialCharacter={createDefaultCharacterDraft()}
          perks={PERKS}
        />
      </div>
    </div>
  );
});
