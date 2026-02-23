import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { listCharacters } from "../lib/characters.ts";
export default define.page(async function Home() {
  const characters = await listCharacters();

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>World Vore One Character Sheet</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 class="text-3xl font-bold">World Vore One Character Sheet</h1>
          <p class="text-gray-700">
            Create and edit tabletop characters using stat and perk points.
          </p>
        </header>

        <section class="space-y-4">
          <a
            href="/characters/new"
            class="inline-block px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Create Character
          </a>

          <div class="border rounded-lg p-4 bg-white/80">
            <h2 class="text-xl font-semibold mb-2">Characters</h2>
            {characters.length === 0
              ? <p class="text-gray-700">No characters yet.</p>
              : (
                <ul class="space-y-2">
                  {characters.map((character) => (
                    <li key={character.id}>
                      <a href={`/characters/${character.id}`} class="underline">
                        {character.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </section>
      </div>
    </div>
  );
});
