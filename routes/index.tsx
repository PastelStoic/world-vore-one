import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { listCharacters } from "../lib/characters.ts";
export default define.page(async function Home(ctx) {
  const user = ctx.state.user;
  const allCharacters = user ? await listCharacters(user.id) : [];
  const characters = allCharacters.filter((c) => !c.hidden);
  const hiddenCharacters = allCharacters.filter((c) => c.hidden);

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

        <section>
          <a
            href="/wiki"
            class="inline-block px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            📖 Wiki
          </a>
        </section>

        {!user
          ? (
            <section>
              <p class="text-gray-700">
                Please{" "}
                <a href="/auth/discord" class="underline font-medium">
                  log in with Discord
                </a>{" "}
                to manage your characters.
              </p>
            </section>
          )
          : (
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
                        <li key={character.id} class="flex items-baseline gap-2">
                          <a
                            href={`/characters/${character.id}`}
                            class="underline"
                          >
                            {character.name}
                          </a>
                          {character.status === "pending" && (
                            <span class="text-sm text-yellow-700">
                              Pending
                            </span>
                          )}
                          {character.updatedAt && (
                            <span class="text-xs text-gray-500 ml-auto">
                              {new Date(character.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                          <form method="POST" action={`/characters/${character.id}`} class="contents">
                            <input type="hidden" name="action" value="toggle-hidden" />
                            <input type="hidden" name="returnTo" value="/" />
                            <button
                              type="submit"
                              class="text-xs text-gray-400 hover:text-gray-700 ml-1 transition-colors"
                            >
                              Hide
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}
                {hiddenCharacters.length > 0 && (
                  <details class="mt-4">
                    <summary class="cursor-pointer text-gray-600 hover:text-gray-900">
                      Show hidden characters ({hiddenCharacters.length})
                    </summary>
                    <ul class="space-y-2 mt-2">
                      {hiddenCharacters.map((character) => (
                        <li key={character.id} class="flex items-baseline gap-2">
                          <a
                            href={`/characters/${character.id}`}
                            class="underline"
                          >
                            {character.name}
                          </a>
                          <span class="text-sm text-red-600">Hidden</span>
                          {character.updatedAt && (
                            <span class="text-xs text-gray-500 ml-auto">
                              {new Date(character.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                          <form method="POST" action={`/characters/${character.id}`} class="contents">
                            <input type="hidden" name="action" value="toggle-hidden" />
                            <input type="hidden" name="returnTo" value="/" />
                            <button
                              type="submit"
                              class="text-xs text-gray-500 hover:text-gray-900 ml-1 underline transition-colors"
                            >
                              Unhide
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </section>
          )}
      </div>
    </div>
  );
});
