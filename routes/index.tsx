import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { listCharacters } from "@/lib/characters.ts";
import { PageShell } from "@/components/PageShell.tsx";
import { ButtonLink } from "@/components/Button.tsx";
import { formatDate } from "@/lib/format.ts";
export default define.page(async function Home(ctx) {
  const user = ctx.state.user;
  const allCharacters = user ? await listCharacters(user.id) : [];
  const characters = allCharacters.filter((c) => !c.hidden);
  const hiddenCharacters = allCharacters.filter((c) => c.hidden);

  return (
    <PageShell>
      <Head>
        <title>World Vore One Character Sheet</title>
      </Head>
      <header>
        <h1 class="text-3xl font-bold">World Vore One Character Sheet</h1>
        <p class="text-base-content">
          Create and edit tabletop characters using stat and perk points.
        </p>
      </header>

      <section>
        <ButtonLink href="/wiki">📖 Wiki</ButtonLink>
      </section>

      {!user
        ? (
          <section>
            <p class="text-base-content">
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
            <ButtonLink href="/characters/new">Create Character</ButtonLink>

            <div class="border rounded-lg p-4 bg-base-100/80">
              <h2 class="text-xl font-semibold mb-2">Characters</h2>
              {characters.length === 0
                ? <p class="text-base-content">No characters yet.</p>
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
                          <span class="text-sm text-warning">
                            Pending
                          </span>
                        )}
                        {character.updatedAt && (
                          <span class="text-xs text-base-content/60 ml-auto">
                            {formatDate(character.updatedAt)}
                          </span>
                        )}
                        <form
                          method="POST"
                          action={`/characters/${character.id}`}
                          class="contents"
                        >
                          <input
                            type="hidden"
                            name="action"
                            value="toggle-hidden"
                          />
                          <input type="hidden" name="returnTo" value="/" />
                          <button
                            type="submit"
                            class="text-xs text-base-content/50 hover:text-base-content/80 ml-1 transition-colors"
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
                  <summary class="cursor-pointer text-base-content/70 hover:text-base-content">
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
                        <span class="text-sm text-error">Hidden</span>
                        {character.updatedAt && (
                          <span class="text-xs text-base-content/60 ml-auto">
                            {formatDate(character.updatedAt)}
                          </span>
                        )}
                        <form
                          method="POST"
                          action={`/characters/${character.id}`}
                          class="contents"
                        >
                          <input
                            type="hidden"
                            name="action"
                            value="toggle-hidden"
                          />
                          <input type="hidden" name="returnTo" value="/" />
                          <button
                            type="submit"
                            class="text-xs text-base-content/60 hover:text-base-content ml-1 underline transition-colors"
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
    </PageShell>
  );
});
