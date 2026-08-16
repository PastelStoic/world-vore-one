import type { PerkDefinition } from "@/data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type BaseStats,
  type CharacterDraft,
  type PerkOrigin,
} from "@/lib/character_types.ts";
import { calculatePerksCost } from "@/lib/character_parsing.ts";
import { FACTION_DEFINITIONS_BY_ID } from "@/data/factions.ts";
import PerkDescription from "@/components/PerkDescription.tsx";
import DeprecatedBadge from "@/components/DeprecatedBadge.tsx";

const STAT_LABEL_MAP = BASE_STAT_FIELDS.reduce(
  (m, f) => {
    m[f.key] = f.label;
    return m;
  },
  {} as Record<string, string>,
);

export interface OwnedPerkCardProps {
  perk: PerkDefinition;
  ownedPerks: PerkDefinition[];
  allPerks: PerkDefinition[];
  perkIds: string[];
  perkRanks: Record<string, number>;
  perkOrigins: Record<string, PerkOrigin>;
  perkSelections: Record<string, string[]>;
  perkStatChoices: Record<string, BaseStatKey[]>;
  perkNotes: Record<string, string>;
  perkUpgradeNotes: Record<string, string[]>;
  perkDisguises: Record<string, string>;
  perkPointChoices: Record<string, number>;
  derivedPerkIds: Set<string>;
  initialPerkIds: string[];
  initialPerkRanks: Record<string, number>;
  canRemoveOldPerks: boolean;
  unallocatedStatPoints: number;
  inventoryPointCost: number;
  baseStats: BaseStats;
  faction: string;
  race: CharacterDraft["race"];
  onUpgrade: (perkId: string) => void;
  onDowngrade: (perkId: string) => void;
  onRemove: (perkId: string) => void;
  onPerkStatChoiceChange: (
    perkId: string,
    rankIndex: number,
    stat: BaseStatKey,
  ) => void;
  onPerkUpgradeNoteChange: (
    perkId: string,
    rankIndex: number,
    value: string,
  ) => void;
  onPerkNoteChange: (perkId: string, value: string) => void;
  onPerkPointChoiceChange: (perkId: string, value: number) => void;
  onPerkDisguiseChange: (perkId: string, value: string) => void;
  onPerkSelectionChange: (
    perkId: string,
    slotIndex: number,
    newId: string,
  ) => void;
}

export function OwnedPerkCard(props: OwnedPerkCardProps) {
  const { perk } = props;
  const isDerived = props.derivedPerkIds.has(perk.id);
  const sourcePerk = isDerived
    ? props.ownedPerks.find((op) =>
      op.includesPerks?.includes(perk.id) ||
      (props.perkSelections[op.id] ?? []).includes(perk.id)
    )
    : undefined;
  const perkOrigin = props.perkOrigins[perk.id];
  const factionGrantStatus = perkOrigin === "faction"
    ? (FACTION_DEFINITIONS_BY_ID.get(props.faction)?.grantsPerkIds ?? [])
        .includes(perk.id)
      ? "Added by current faction"
      : "Added by former faction"
    : perkOrigin === "race"
    ? "Added by race"
    : undefined;
  const canRemove = !isDerived && (
    props.canRemoveOldPerks ||
    !props.initialPerkIds.includes(perk.id) ||
    !!perk.deprecated
  );
  const currentRank = props.perkRanks[perk.id] ?? 1;
  const isUpgradable = perk?.upgradable ?? false;
  const initialRank = props.initialPerkRanks[perk.id] ??
    (props.initialPerkIds.includes(perk.id) ? 1 : 0);
  const canDowngrade = isUpgradable &&
    !perk.deprecated &&
    (props.canRemoveOldPerks || currentRank > initialRank) &&
    // Derived perks cannot be downgraded below rank 1
    (!isDerived || currentRank > 1);
  const chosenStats = (props.perkStatChoices[perk.id] ?? []) as BaseStatKey[];
  const hasUnsatisfiedStatChoices = perk?.requiresStatChoice
    ? chosenStats.length < currentRank || chosenStats.some((s) => !s)
    : false;
  const hasRemainingStats = !perk?.requiresStatChoice ||
    (perk.requiresStatChoice ?? []).some(
      (s) => !chosenStats.includes(s as BaseStatKey),
    );
  const canUpgrade = isUpgradable &&
    !perk.deprecated &&
    (perk?.maxRanks === undefined || currentRank < perk.maxRanks) &&
    !hasUnsatisfiedStatChoices &&
    hasRemainingStats;
  const upgradeRanks = {
    ...props.perkRanks,
    [perk.id]: currentRank + 1,
  };
  const upgradeCost = canUpgrade
    ? calculatePerksCost(
      props.perkIds,
      upgradeRanks,
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
      )
    : 0;
  const canAffordUpgrade =
    (props.unallocatedStatPoints - props.inventoryPointCost) >= upgradeCost;

  return (
    <li>
      <div class="flex items-center gap-2 flex-wrap">
        <span>
          <PerkDescription
            name={perk.name}
            description={perk.description}
          />
          {perk.deprecated && <DeprecatedBadge />}
          {isDerived && sourcePerk && (
            <span class="ml-1 text-xs bg-base-300 text-base-content/60 px-1 rounded">
              included by {sourcePerk.name}
            </span>
          )}
          {!sourcePerk && factionGrantStatus && (
            <span class="ml-1 text-xs bg-base-300 text-base-content/60 px-1 rounded">
              {factionGrantStatus}
            </span>
          )}
          {isUpgradable && currentRank > 1 && (
            <span class="ml-1 text-xs bg-primary/20 text-primary px-1 rounded">
              Rank {currentRank}
            </span>
          )}
        </span>
        {isUpgradable && canUpgrade && canAffordUpgrade && (
          <button
            type="button"
            class="px-2 py-0.5 text-xs border rounded text-primary hover:bg-primary/10"
            onClick={() => props.onUpgrade(perk.id)}
          >
            Upgrade{upgradeCost < 0
              ? ` (+${-upgradeCost} SP)`
              : upgradeCost === 0
              ? " (Free)"
              : ` (${upgradeCost} SP)`}
          </button>
        )}
        {canDowngrade && (
          <button
            type="button"
            class="px-2 py-0.5 text-xs border rounded text-warning hover:bg-warning/10"
            onClick={() => props.onDowngrade(perk.id)}
          >
            {currentRank > 1 ? "Downgrade" : "Remove"}
          </button>
        )}
        {canRemove && (
          <button
            type="button"
            class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
            onClick={() => props.onRemove(perk.id)}
            title={perk.deprecated
              ? "Remove deprecated perk and refund spent stat points"
              : undefined}
          >
            {perk.deprecated ? "Remove & refund" : "Remove"}
          </button>
        )}
      </div>
      {/* Upgradable perk: per-rank inputs */}
      {isUpgradable &&
        (perk?.requiresStatChoice || perk?.customInput) && (
        <div class="mt-1 space-y-1">
          {Array.from({ length: currentRank }, (_, ri) => {
            const chosenForRank = chosenStats[ri];
            const usedByOthers = chosenStats.filter((_, i) => i !== ri);
            return (
              <div
                key={ri}
                class="border rounded px-2 py-1 text-xs space-y-1"
              >
                <span class="font-semibold text-xs">
                  Rank {ri + 1}
                </span>
                {perk?.requiresStatChoice && (
                  <div>
                    <label class="text-xs text-base-content/70 mr-1">
                      Locked stat:
                    </label>
                    <select
                      class="select border rounded px-1 py-0.5 text-xs"
                      value={chosenForRank ?? ""}
                      onChange={(e) => {
                        const val = (e.target as HTMLSelectElement)
                          .value as BaseStatKey;
                        props.onPerkStatChoiceChange(perk.id, ri, val);
                      }}
                    >
                      <option value="">— Select stat —</option>
                      {(perk.requiresStatChoice ?? [])
                        .filter(
                          (s) =>
                            !usedByOthers.includes(s as BaseStatKey) ||
                            s === chosenForRank,
                        )
                        .map((s) => (
                          <option key={s} value={s}>
                            {STAT_LABEL_MAP[s] ?? s}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                {perk?.customInput && (
                  <input
                    type="text"
                    class="w-full border rounded px-2 py-1 text-xs"
                    placeholder={perk.customInput}
                    value={(props.perkUpgradeNotes[perk.id] ?? [])[ri] ?? ""}
                    onInput={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      props.onPerkUpgradeNoteChange(perk.id, ri, value);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Non-upgradable perk: single note input */}
      {!isUpgradable && perk?.variablePointsGranted && (
        <div class="mt-1 flex items-center gap-2">
          <label class="text-xs text-base-content/70 whitespace-nowrap">
            Points gained:
          </label>
          <select
            class="select border rounded px-2 py-1 text-sm"
            value={props.perkPointChoices[perk.id] ?? ""}
            onChange={(e) => {
              const val = Number((e.target as HTMLSelectElement).value);
              if (!Number.isNaN(val) && val > 0) {
                props.onPerkPointChoiceChange(perk.id, val);
              }
            }}
          >
            <option value="">— Choose —</option>
            {Array.from(
              {
                length: perk.variablePointsGranted.max -
                  perk.variablePointsGranted.min + 1,
              },
              (_, i) => perk.variablePointsGranted!.min + i,
            ).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      )}
      {!isUpgradable && perk?.customInput && (
        <input
          type="text"
          class="mt-1 w-full border rounded px-2 py-1 text-sm"
          placeholder={perk.customInput}
          value={props.perkNotes[perk.id] ?? ""}
          onInput={(e) => {
            const value = (e.target as HTMLInputElement).value;
            props.onPerkNoteChange(perk.id, value);
          }}
        />
      )}
      {perk?.canDisguise && (
        <div class="mt-1">
          <label class="text-xs text-base-content/70">Disguise as:</label>
          <select
            class="select ml-2 border rounded px-2 py-1 text-sm"
            value={props.perkDisguises[perk.id] ?? ""}
            onChange={(e) => {
              const value = (e.target as HTMLSelectElement).value;
              props.onPerkDisguiseChange(perk.id, value);
            }}
          >
            <option value="">(no disguise)</option>
            {props.allPerks
              .filter((p) =>
                p.id !== perk.id &&
                !p.canDisguise &&
                !p.isFree &&
                !p.deprecated
              )
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
      )}
      {!isDerived && perk?.selectablePerkIds !== undefined && (() => {
        const count = perk.selectablePerksCount ?? 1;
        return (
          <div class="mt-1 space-y-1">
            {Array.from({ length: count }, (_, si) => {
              const currentSelectionId = props.perkSelections[perk.id]?.[si] ??
                "";
              const otherSelectedIds = (props.perkSelections[perk.id] ?? [])
                .filter((sel, i) => i !== si && Boolean(sel));
              const candidatePerks = props.allPerks.filter((p) => {
                if (p.deprecated) return false;
                if (
                  perk.selectablePerkIds!.length > 0 &&
                  !perk.selectablePerkIds!.includes(p.id)
                ) return false;
                if (otherSelectedIds.includes(p.id)) {
                  return false;
                }
                return true;
              });
              return (
                <div
                  key={si}
                  class="flex items-center gap-2 flex-wrap"
                >
                  <label class="text-xs text-base-content/70">
                    {count > 1 ? `Choice ${si + 1}:` : "Choose perk:"}
                  </label>
                  <select
                    class="select border rounded px-1 py-0.5 text-xs"
                    value={currentSelectionId}
                    onChange={(e) => {
                      const newId = (e.target as HTMLSelectElement).value;
                      props.onPerkSelectionChange(perk.id, si, newId);
                    }}
                  >
                    <option value="">— Select perk —</option>
                    {candidatePerks.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        );
      })()}
    </li>
  );
}
