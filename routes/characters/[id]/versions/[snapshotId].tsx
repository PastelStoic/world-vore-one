import { Head } from "fresh/runtime";
import { define } from "../../../../utils.ts";
import { PERKS_BY_ID } from "../../../../data/perks.ts";
import { BASE_STAT_FIELDS } from "../../../../lib/character_types.ts";
import {
  getCharacter,
  getCharacterSnapshot,
} from "../../../../lib/characters.ts";
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
  calculateEffectiveOrganCapacity,
  calculateEffectiveStrength,
} from "../../../../lib/stat_calculations.ts";

export default define.page(async function CharacterSnapshotPage(ctx) {
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
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>{character.name} - Snapshot</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-4">
        <a href={`/characters/${characterId}/versions`} class="underline">
          ← Back to Previous Versions
        </a>

        <div class="border rounded p-4 bg-white/80 space-y-3">
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
          <p>
            <strong>Description:</strong> {draft.description || "(none)"}
          </p>

          <div>
            <h2 class="text-lg font-semibold">Base Stats</h2>
            <ul class="space-y-1 text-sm">
              {BASE_STAT_FIELDS.map((field) => (
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
              <li>
                Organ Capacity:{" "}
                <strong>{calculateEffectiveOrganCapacity(draft)}</strong>
              </li>
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
      </div>
    </div>
  );
});
