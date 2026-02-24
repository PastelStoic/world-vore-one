import { Head } from "fresh/runtime";
import { define } from "../../../utils.ts";
import {
  getCharacter,
  listCharacterSnapshots,
} from "../../../lib/characters.ts";

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
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>{character.name} - Previous Versions</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-4">
        <a href={`/characters/${characterId}`} class="underline">
          ← Back to Character
        </a>

        <h1 class="text-2xl font-bold">Previous Versions</h1>

        {olderSnapshots.length === 0
          ? <p class="text-gray-700">No previous snapshots yet.</p>
          : (
            <ul class="space-y-3">
              {olderSnapshots.map((snapshot) => (
                <li
                  key={snapshot.snapshotId}
                  class="border rounded p-3 bg-white/80"
                >
                  <p class="text-sm text-gray-700">{snapshot.timestamp}</p>
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
      </div>
    </div>
  );
});
