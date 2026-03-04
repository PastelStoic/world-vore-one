import { define } from "@/utils.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
import { BASE_STAT_FIELDS, ORGAN_LABELS } from "@/lib/character_types.ts";
import {
  getCharacter,
  getCharacterSnapshot,
  upsertCharacter,
} from "@/lib/characters.ts";
import {
  calculateEffectiveCarryCapacity,
  calculateEffectiveCharisma,
  calculateEffectiveConstitution,
  calculateEffectiveDexterity,
  calculateEffectiveDigestionResilience,
  calculateEffectiveDigestionStrength,
  calculateEffectiveEscapeTraining,
  calculateEffectiveHealth,
  calculateEffectiveIntelligence,
  calculateEffectiveStrength,
  calculateOrganCapacities,
} from "@/lib/stat_calculations.ts";
import CharacterPageLayout from "@/components/CharacterPageLayout.tsx";

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const characterId = ctx.params.id;
    const snapshotId = ctx.params.snapshotId;
    const formData = await ctx.req.formData();
    const action = String(formData.get("action") ?? "").trim();
    const changelog = String(formData.get("changelog") ?? "").trim();

    if (action !== "set_current") {
      return new Response("Invalid form action.", { status: 400 });
    }

    if (!changelog) {
      return new Response("Changelog is required.", { status: 400 });
    }

    const [character, snapshot] = await Promise.all([
      getCharacter(characterId),
      getCharacterSnapshot(characterId, snapshotId),
    ]);

    if (!character) {
      return new Response("Character not found.", { status: 404 });
    }

    const isOwner = character.userId === user.id;
    if (!isOwner && !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    if (!snapshot) {
      return new Response("Snapshot not found.", { status: 404 });
    }

    // If an admin is restoring someone else's snapshot, note it in the changelog
    const finalChangelog = !isOwner
      ? `[Admin edit by ${user.username}] ${changelog}`
      : changelog;

    await upsertCharacter(
      { id: characterId, userId: character.userId, ...snapshot.data },
      finalChangelog,
      { basedOnSnapshotId: snapshotId },
    );

    return Response.redirect(
      new URL(`/characters/${characterId}?saved=1`, ctx.url),
      303,
    );
  },
});

export default define.page<typeof handler>(
  async function CharacterSnapshotPage(ctx) {
    const characterId = ctx.params.id;
    const snapshotId = ctx.params.snapshotId;
    const [character, snapshot] = await Promise.all([
      getCharacter(characterId),
      getCharacterSnapshot(characterId, snapshotId),
    ]);

    if (!character) {
      return new Response("Character not found.", { status: 404 });
    }

    if (!snapshot) {
      return new Response("Snapshot not found.", { status: 404 });
    }

    const draft = snapshot.data;
    const effectiveByStat = {
      strength: calculateEffectiveStrength(draft),
      dexterity: calculateEffectiveDexterity(draft),
      constitution: calculateEffectiveConstitution(draft),
      intelligence: calculateEffectiveIntelligence(draft),
      charisma: calculateEffectiveCharisma(draft),
      escapeTraining: calculateEffectiveEscapeTraining(draft),
      digestionStrength: calculateEffectiveDigestionStrength(draft),
      digestionResilience: calculateEffectiveDigestionResilience(draft),
    };

    return (
      <CharacterPageLayout
        title={`${character.name} - Snapshot`}
        backHref={`/characters/${characterId}/versions`}
        backLabel="Back to Previous Versions"
      >
        <div class="border rounded p-4 bg-base-100/80 space-y-3">
          <h1 class="text-2xl font-bold">{draft.name}</h1>
          <p>
            <strong>Timestamp:</strong> {snapshot.timestamp}
          </p>
          <p>
            <strong>Changelog:</strong> {snapshot.changelog}
          </p>
          <p>
            <strong>Race:</strong> {draft.race}
          </p>

          <div class="space-y-1">
            <h3 class="font-semibold">Description</h3>
            {draft.description.isTemplate && (
              <p>
                <strong>Template:</strong> Yes
              </p>
            )}
            {draft.description.countryOfOrigin && (
              <p>
                <strong>Country of Origin:</strong>{" "}
                {draft.description.countryOfOrigin}
              </p>
            )}
            {draft.description.faction && (
              <p>
                <strong>Faction:</strong> {draft.description.faction}
              </p>
            )}
            {draft.description.subfaction && (
              <p>
                <strong>Subfaction:</strong> {draft.description.subfaction}
              </p>
            )}
            {draft.description.role && (
              <p>
                <strong>Role:</strong> {draft.description.role}
              </p>
            )}
            {draft.description.age && (
              <p>
                <strong>Age:</strong> {draft.description.age}
              </p>
            )}
            {draft.description.dateOfBirth && (
              <p>
                <strong>Date of Birth:</strong> {draft.description.dateOfBirth}
              </p>
            )}
            <p>
              <strong>Sex:</strong> {draft.description.sex}
            </p>
            {draft.description.height && (
              <p>
                <strong>Height:</strong> {draft.description.height}
              </p>
            )}
            {draft.description.weight && (
              <p>
                <strong>Weight:</strong> {draft.description.weight}
              </p>
            )}
            {draft.description.skinColor && (
              <p>
                <strong>Skin Color:</strong> {draft.description.skinColor}
              </p>
            )}
            {draft.description.hairColor && (
              <p>
                <strong>Hair Color:</strong> {draft.description.hairColor}
              </p>
            )}
            {draft.description.eyeColor && (
              <p>
                <strong>Eye Color:</strong> {draft.description.eyeColor}
              </p>
            )}
            {draft.description.ethnicity && (
              <p>
                <strong>Ethnicity:</strong> {draft.description.ethnicity}
              </p>
            )}
            {draft.description.bodyType && (
              <p>
                <strong>Body Type:</strong> {draft.description.bodyType}
              </p>
            )}
            {draft.description.generalAppearance && (
              <p>
                <strong>General Appearance:</strong>{" "}
                {draft.description.generalAppearance}
              </p>
            )}
            {draft.description.generalHealth && (
              <p>
                <strong>General Health:</strong>{" "}
                {draft.description.generalHealth}
              </p>
            )}
            {draft.description.personality && (
              <p>
                <strong>Personality:</strong> {draft.description.personality}
              </p>
            )}
            {draft.description.biography && (
              <p>
                <strong>Biography:</strong> {draft.description.biography}
              </p>
            )}
          </div>

          <form method="POST" class="space-y-2 border rounded p-3">
            <input type="hidden" name="action" value="set_current" />
            <label class="block">
              <span class="block font-medium mb-1">
                Changelog for restoring this snapshot
              </span>
              <input
                class="w-full border rounded px-3 py-2"
                type="text"
                name="changelog"
                placeholder="Describe why this snapshot is now current"
                required
              />
            </label>
            <button
              type="submit"
              class="px-3 py-2 border rounded bg-base-200 hover:bg-base-300 transition-colors"
            >
              Set as Current Version
            </button>
          </form>

          <div>
            <h2 class="text-lg font-semibold">Base Stats</h2>
            <ul class="space-y-1 text-sm">
              {BASE_STAT_FIELDS.filter((field) => draft.race !== "Baseliner" || field.key !== "digestionStrength").map((field) => (
                <li key={field.key}>
                  {field.label}: Base{" "}
                  <strong>{draft.baseStats[field.key]}</strong> | Effective{" "}
                  <strong>{effectiveByStat[field.key]}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold">Other Stats (Effective)</h2>
            <ul class="space-y-1 text-sm">
              <li>
                Health: <strong>{calculateEffectiveHealth(draft)}</strong>
              </li>
              <li>
                Carry Capacity:{" "}
                <strong>{calculateEffectiveCarryCapacity(draft)}</strong>
              </li>
              {(() => {
                const organCapacities = calculateOrganCapacities(draft);
                if (organCapacities.length === 0) return null;
                return (
                  <li>
                    Organ Capacity:
                    <ul class="ml-4 space-y-0.5">
                      {organCapacities.map(({ organ, capacity }) => (
                        <li key={organ}>
                          {ORGAN_LABELS[organ]}: <strong>{capacity}</strong>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })()}
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold">Perks</h2>
            {draft.perkIds.length === 0
              ? <p class="text-sm">No perks.</p>
              : (
                <ul class="list-disc list-inside text-sm">
                  {draft.perkIds.map((perkId) => {
                    const perk = PERKS_BY_ID.get(perkId);
                    return (
                      <li key={perkId}>
                        {perk ? `${perk.name}: ${perk.description}` : perkId}
                      </li>
                    );
                  })}
                </ul>
              )}
          </div>
        </div>
      </CharacterPageLayout>
    );
  },
);
