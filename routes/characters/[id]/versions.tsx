import { define } from "@/utils.ts";
import {
  getCharacter,
  listCharacterSnapshots,
} from "@/lib/characters.ts";
import CharacterPageLayout from "@/components/CharacterPageLayout.tsx";

export default define.page(async function CharacterVersionsPage(ctx) {
  const characterId = ctx.params.id;
  const [character, snapshots] = await Promise.all([
    getCharacter(characterId),
    listCharacterSnapshots(characterId),
  ]);

  if (!character) {
    return new Response("Character not found.", { status: 404 });
  }

  const olderSnapshots = snapshots.filter((snapshot) =>
    snapshot.snapshotId !== character.latestSnapshotId
  );

  return (
    <CharacterPageLayout
      title={`${character.name} - Previous Versions`}
      backHref={`/characters/${characterId}`}
      backLabel="Back to Character"
    >
      <h1 class="text-2xl font-bold">Previous Versions</h1>

      {olderSnapshots.length === 0
        ? <p class="text-base-content">No previous snapshots yet.</p>
        : (
          <ul class="space-y-3">
            {olderSnapshots.map((snapshot) => (
              <li
                key={snapshot.snapshotId}
                class="border rounded p-3 bg-base-100/80"
              >
                <p class="text-sm text-base-content">{snapshot.timestamp}</p>
                <p class="font-medium">{snapshot.changelog}</p>
                <a
                  href={`/characters/${characterId}/versions/${snapshot.snapshotId}`}
                  class="underline text-sm"
                >
                  View snapshot
                </a>
              </li>
            ))}
          </ul>
        )}
    </CharacterPageLayout>
  );
});
