import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import {
  PERKS,
  PERK_CATEGORY_LABELS,
  PERK_CATEGORY_ORDER,
} from "@/data/perks.ts";
import { PageShell } from "@/components/PageShell.tsx";
import { BackLink } from "@/components/BackLink.tsx";

export default define.page(function WikiPerks() {
  return (
    <PageShell innerClass="space-y-8">
      <Head>
        <title>Perks – Wiki – World Vore One</title>
      </Head>
        <header>
          <BackLink href="/wiki">← Wiki</BackLink>
          <h1 class="text-3xl font-bold mt-2">Perks</h1>
          <p class="text-base-content">
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
                      class="border rounded-lg bg-base-100/80 px-4 py-2"
                    >
                      <summary class="cursor-pointer font-medium select-none list-none flex items-center justify-between gap-2">
                        <span>
                          {perk.name}
                          {perk.pointsGranted
                            ? (
                              <span
                                class={`ml-2 text-xs font-normal ${perk.pointsGranted > 0 ? "text-success" : "text-error"}`}
                              >
                                {perk.pointsGranted > 0
                                  ? `+${perk.pointsGranted}`
                                  : `${perk.pointsGranted}`} pts
                              </span>
                            )
                            : null}
                          {perk.isFree
                            ? (
                              <span class="ml-2 text-xs text-primary font-normal">
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
                        <span class="text-xs text-base-content/50 font-normal shrink-0">
                          ▶ details
                        </span>
                      </summary>
                      <div class="mt-2 text-sm text-base-content space-y-1">
                        <p class="whitespace-pre-line">{brief}</p>
                        {rest && (
                          <p class="whitespace-pre-line text-base-content/70">{rest}</p>
                        )}
                        {perk.customInput && (
                          <p class="italic text-base-content/60">
                            Custom input: {perk.customInput}
                          </p>
                        )}
                        {perk.excludesPerks?.length
                          ? (
                            <p class="text-error text-xs">
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
    </PageShell>
  );
});
