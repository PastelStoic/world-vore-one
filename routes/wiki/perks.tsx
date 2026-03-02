import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import {
  PERKS,
  PERK_CATEGORY_LABELS,
  PERK_CATEGORY_ORDER,
} from "../../data/perks.ts";

export default define.page(function WikiPerks() {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Perks – Wiki – World Vore One</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-8">
        <header>
          <a href="/wiki" class="text-sm text-blue-700 hover:underline">← Wiki</a>
          <h1 class="text-3xl font-bold mt-2">Perks</h1>
          <p class="text-gray-700">
            All perks available when building a character, organised by
            category.
          </p>
        </header>

        {PERK_CATEGORY_ORDER.map((category) => {
          const perks = PERKS.filter((p) => p.category === category);
          if (perks.length === 0) return null;
          return (
            <section key={category} class="space-y-2">
              <h2 class="text-xl font-semibold border-b pb-1">
                {PERK_CATEGORY_LABELS[category]}
              </h2>
              <div class="space-y-2">
                {perks.map((perk) => {
                  const lines = perk.description.split("\n");
                  const brief = lines[0];
                  const rest = lines.slice(1).join("\n").trim();
                  return (
                    <details
                      key={perk.id}
                      class="border rounded-lg bg-white/80 px-4 py-2"
                    >
                      <summary class="cursor-pointer font-medium select-none list-none flex items-center justify-between gap-2">
                        <span>
                          {perk.name}
                          {perk.pointsGranted
                            ? (
                              <span class="ml-2 text-xs text-green-700 font-normal">
                                +{perk.pointsGranted} pts
                              </span>
                            )
                            : null}
                          {perk.isFree
                            ? (
                              <span class="ml-2 text-xs text-blue-700 font-normal">
                                free
                              </span>
                            )
                            : null}
                          {perk.requiredRaces?.length
                            ? (
                              <span class="ml-2 text-xs text-purple-700 font-normal">
                                {perk.requiredRaces.join(", ")} only
                              </span>
                            )
                            : null}
                          {perk.requiredSex?.length
                            ? (
                              <span class="ml-2 text-xs text-pink-700 font-normal">
                                {perk.requiredSex.join("/")} only
                              </span>
                            )
                            : null}
                        </span>
                        <span class="text-xs text-gray-400 font-normal shrink-0">
                          ▶ details
                        </span>
                      </summary>
                      <div class="mt-2 text-sm text-gray-700 space-y-1">
                        <p class="whitespace-pre-line">{brief}</p>
                        {rest && (
                          <p class="whitespace-pre-line text-gray-600">{rest}</p>
                        )}
                        {perk.customInput && (
                          <p class="italic text-gray-500">
                            Custom input: {perk.customInput}
                          </p>
                        )}
                        {perk.excludesPerks?.length
                          ? (
                            <p class="text-red-600 text-xs">
                              Excludes: {perk.excludesPerks.join(", ")}
                            </p>
                          )
                          : null}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
});
