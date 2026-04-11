import { Head } from "fresh/runtime";
import { BackLink } from "@/components/BackLink.tsx";
import { PageShell } from "@/components/PageShell.tsx";
import { FACTION_DEFINITIONS_BY_ID } from "@/data/factions.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
import { FACTIONS } from "@/lib/character_types.ts";
import { define } from "@/utils.ts";

function getFactionGroupLabel(faction: string): string {
  const separatorIndex = faction.indexOf(" - ");
  if (separatorIndex === -1) return "Other";

  const label = faction.slice(0, separatorIndex).trim();
  return label || "Other";
}

const groupedFactions = Array.from(
  FACTIONS.reduce((groups, faction) => {
    const group = getFactionGroupLabel(faction);
    const existing = groups.get(group) ?? [];
    existing.push(faction);
    groups.set(group, existing);
    return groups;
  }, new Map<string, string[]>()),
);

export default define.page(function WikiFactions() {
  return (
    <PageShell maxWidth="4xl" innerClass="space-y-8">
      <Head>
        <title>Factions – Wiki – World Vore One</title>
      </Head>
      <header>
        <BackLink href="/wiki">← Wiki</BackLink>
        <h1 class="text-3xl font-bold mt-2">Factions</h1>
        <p class="text-base-content">
          Reference information for every faction, including automatic bonuses
          and moderator-only restrictions.
        </p>
      </header>

      {groupedFactions.map(([group, factions]) => (
        <section key={group} class="space-y-2">
          <h2 class="text-xl font-semibold border-b pb-1">{group}</h2>
          <div class="space-y-2">
            {factions.map((faction) => {
              const definition = FACTION_DEFINITIONS_BY_ID.get(faction);
              const grantedPerks = (definition?.grantsPerkIds ?? []).map((id) =>
                PERKS_BY_ID.get(id)?.name ?? id
              );
              return (
                <details
                  key={faction}
                  class="border rounded-lg bg-base-100/80 px-4 py-2"
                >
                  <summary class="cursor-pointer font-medium select-none list-none flex items-center gap-3 flex-wrap">
                    <span class="font-semibold">{faction}</span>
                    {definition?.moderatorOnly && (
                      <span class="text-xs text-warning font-normal">
                        moderator only
                      </span>
                    )}
                    {(definition?.grantsStatPoints ?? 0) > 0 && (
                      <span class="text-xs text-success font-normal">
                        +{definition?.grantsStatPoints} stat points
                      </span>
                    )}
                    {grantedPerks.length > 0 && (
                      <span class="text-xs text-primary font-normal">
                        auto perks: {grantedPerks.join(", ")}
                      </span>
                    )}
                    <span class="ml-auto text-xs text-base-content/50 font-normal shrink-0">
                      ▶ details
                    </span>
                  </summary>
                  <div class="mt-2 text-sm text-base-content space-y-2 border-t pt-2">
                    <p class="whitespace-pre-line text-base-content/80">
                      {definition?.description ??
                        "No faction description has been added yet."}
                    </p>
                    <div class="flex flex-wrap gap-3 text-xs text-base-content/70">
                      <span>
                        <span class="font-medium">Moderator-only:</span>{" "}
                        {definition?.moderatorOnly ? "Yes" : "No"}
                      </span>
                      <span>
                        <span class="font-medium">Extra stat points:</span>{" "}
                        {definition?.grantsStatPoints ?? 0}
                      </span>
                    </div>
                    {grantedPerks.length > 0 && (
                      <p class="text-xs text-base-content/70">
                        <span class="font-medium">
                          Automatically granted perks:
                        </span>{" "}
                        {grantedPerks.join(", ")}
                      </p>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      ))}
    </PageShell>
  );
});
