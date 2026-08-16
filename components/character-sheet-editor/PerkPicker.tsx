import { useState } from "preact/hooks";
import type { PerkCategory } from "@/data/perks.ts";
import { type CharacterDraft, type PerkOrigin } from "@/lib/character_types.ts";
import { calculatePerksCost } from "@/lib/character_parsing.ts";
import PerkDescription from "@/components/PerkDescription.tsx";
import type { ListedPerk } from "./types.ts";

interface PerkPickerProps {
  listedPerks: ListedPerk[];
  perkIds: string[];
  perkRanks: Record<string, number>;
  perkSelections: Record<string, string[]>;
  perkPointChoices: Record<string, number>;
  perkOrigins: Record<string, PerkOrigin>;
  faction: string;
  race: CharacterDraft["race"];
  unallocatedStatPoints: number;
  inventoryPointCost: number;
  onBuyPerk: (perkId: string) => void;
}

export function PerkPicker(props: PerkPickerProps) {
  const [showPerkPicker, setShowPerkPicker] = useState(false);
  const [perkCategoryFilter, setPerkCategoryFilter] = useState<
    PerkCategory | ""
  >("");
  const [perkSearchFilter, setPerkSearchFilter] = useState("");
  const [revealedBlockedPerkId, setRevealedBlockedPerkId] = useState<
    string | null
  >(null);

  if (props.listedPerks.length === 0) return null;

  const availablePerks = props.listedPerks.filter(({ perk }) => {
    if (perkCategoryFilter && perk.category !== perkCategoryFilter) {
      return false;
    }
    if (perkSearchFilter) {
      const q = perkSearchFilter.toLowerCase();
      if (!perk.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div class="space-y-2">
      <button
        type="button"
        class="px-2 py-1 border rounded"
        onClick={() => {
          setShowPerkPicker((current) => !current);
          setRevealedBlockedPerkId(null);
        }}
      >
        {showPerkPicker ? "Cancel" : "Add Perk"}
      </button>
      {showPerkPicker && (
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <select
              class="select border rounded px-2 py-1 text-sm"
              value={perkCategoryFilter}
              onChange={(e) =>
                setPerkCategoryFilter(
                  (e.target as HTMLSelectElement).value as PerkCategory | "",
                )}
            >
              <option value="">All categories</option>
              <option value="combat">Combat</option>
              <option value="vore">Vore</option>
              <option value="smut">Smut</option>
              <option value="gimmick">Gimmick</option>
              <option value="pf-type">PF Type</option>
              <option value="faction">Faction</option>
              <option value="negative">Negative</option>
            </select>
            <input
              type="text"
              class="border rounded px-2 py-1 text-sm flex-1 min-w-[140px]"
              placeholder="Search perks by name…"
              value={perkSearchFilter}
              onInput={(e) =>
                setPerkSearchFilter((e.target as HTMLInputElement).value)}
            />
          </div>
          {availablePerks.length === 0
            ? (
              <p class="text-sm text-base-content/60 italic">
                No matching perks found.
              </p>
            )
            : (
              <ul class="space-y-2">
                {availablePerks.map(({ perk, availability }) => {
                  const isBlocked = availability.status === "blocked";
                  const blockReasons = availability.reasons ?? [];
                  const showBlockReasons = isBlocked &&
                    revealedBlockedPerkId === perk.id;
                  const cost = calculatePerksCost(
                    [...props.perkIds, perk.id],
                    props.perkRanks,
                    props.perkSelections,
                    props.faction,
                    props.perkPointChoices,
                    props.perkOrigins,
                    props.race,
                  ) -
                    calculatePerksCost(
                      props.perkIds,
                      props.perkRanks,
                      props.perkSelections,
                      props.faction,
                      props.perkPointChoices,
                      props.perkOrigins,
                      props.race,
                    );
                  const canAfford =
                    (props.unallocatedStatPoints - props.inventoryPointCost) >=
                      cost;
                  const costLabel = cost < 0
                    ? `Unlock (+${-cost} SP)`
                    : cost === 0
                    ? "Unlock (Free)"
                    : `Buy (${cost} SP)`;
                  return (
                    <li
                      class={`flex items-start justify-between gap-2 ${
                        isBlocked ? "opacity-80" : ""
                      }`}
                      key={perk.id}
                    >
                      <span class="text-sm min-w-0">
                        <PerkDescription
                          name={perk.name}
                          description={perk.description}
                        />
                        {showBlockReasons && (
                          <ul class="mt-1 space-y-0.5">
                            {blockReasons.map((reason) => (
                              <li key={reason} class="text-xs text-error">
                                {reason}
                              </li>
                            ))}
                          </ul>
                        )}
                      </span>
                      <div class="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          class="px-2 py-1 border rounded disabled:opacity-40"
                          disabled={!isBlocked && !canAfford}
                          aria-disabled={isBlocked || undefined}
                          title={isBlocked ? blockReasons.join(" ") : undefined}
                          onClick={() => {
                            if (isBlocked) {
                              setRevealedBlockedPerkId(perk.id);
                              return;
                            }
                            setRevealedBlockedPerkId(null);
                            props.onBuyPerk(perk.id);
                          }}
                        >
                          {costLabel}
                        </button>
                        {perk.adminOnly && (
                          <span class="text-[11px] uppercase tracking-[0.15em] text-warning">
                            Admin only
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
        </div>
      )}
    </div>
  );
}
