import {
  PERK_CATEGORY_LABELS,
  type PerkCategory,
  type PerkDefinition,
  PERKS_BY_ID,
} from "@/data/perks.ts";
import {
  type BaseStatKey,
  type BaseStats,
  type CharacterDraft,
  getStartingFreePerks,
  PERK_COST_STAT_POINTS,
  type PerkOrigin,
} from "@/lib/character_types.ts";
import { OwnedPerkCard } from "./OwnedPerkCard.tsx";
import { InvalidPerksList } from "./InvalidPerksList.tsx";
import { PerkPicker } from "./PerkPicker.tsx";
import type { ListedPerk } from "./types.ts";

interface PerksSectionProps {
  perkIds: string[];
  perkNotes: Record<string, string>;
  perkUpgradeNotes: Record<string, string[]>;
  perkStatChoices: Record<string, BaseStatKey[]>;
  perkRanks: Record<string, number>;
  perkDisguises: Record<string, string>;
  perkSelections: Record<string, string[]>;
  perkPointChoices: Record<string, number>;
  perkOrigins: Record<string, PerkOrigin>;
  ownedPerks: PerkDefinition[];
  ownedPerkGroups: { category: PerkCategory; items: PerkDefinition[] }[];
  uncategorizedOwnedPerks: { id: string; perk?: PerkDefinition }[];
  derivedPerkIds: Set<string>;
  listedPerks: ListedPerk[];
  allPerks: PerkDefinition[];
  initialPerkIds: string[];
  initialPerkRanks: Record<string, number>;
  canRemoveOldPerks: boolean;
  unallocatedStatPoints: number;
  inventoryPointCost: number;
  baseStats: BaseStats;
  faction: string;
  race: CharacterDraft["race"];
  onBuyPerk: (perkId: string) => void;
  onUnbuyPerk: (perkId: string) => void;
  onUpgradePerk: (perkId: string) => void;
  onDowngradePerk: (perkId: string) => void;
  onPerkPointChoiceChange: (perkId: string, value: number) => void;
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
  onPerkDisguiseChange: (perkId: string, value: string) => void;
  onPerkSelectionChange: (
    perkId: string,
    slotIndex: number,
    newId: string,
  ) => void;
}

export function PerksSection(props: PerksSectionProps) {
  const paidPerkInstances = props.perkIds
    .filter((id) => !PERKS_BY_ID.get(id)?.isFree)
    .reduce((sum, id) => sum + (props.perkRanks[id] ?? 1), 0);
  const freePerkSlots = getStartingFreePerks(props.race);

  const cardProps = {
    ownedPerks: props.ownedPerks,
    allPerks: props.allPerks,
    perkIds: props.perkIds,
    perkRanks: props.perkRanks,
    perkOrigins: props.perkOrigins,
    perkSelections: props.perkSelections,
    perkStatChoices: props.perkStatChoices,
    perkNotes: props.perkNotes,
    perkUpgradeNotes: props.perkUpgradeNotes,
    perkDisguises: props.perkDisguises,
    perkPointChoices: props.perkPointChoices,
    derivedPerkIds: props.derivedPerkIds,
    initialPerkIds: props.initialPerkIds,
    initialPerkRanks: props.initialPerkRanks,
    canRemoveOldPerks: props.canRemoveOldPerks,
    unallocatedStatPoints: props.unallocatedStatPoints,
    inventoryPointCost: props.inventoryPointCost,
    baseStats: props.baseStats,
    faction: props.faction,
    race: props.race,
    onUpgrade: props.onUpgradePerk,
    onDowngrade: props.onDowngradePerk,
    onRemove: props.onUnbuyPerk,
    onPerkStatChoiceChange: props.onPerkStatChoiceChange,
    onPerkUpgradeNoteChange: props.onPerkUpgradeNoteChange,
    onPerkNoteChange: props.onPerkNoteChange,
    onPerkPointChoiceChange: props.onPerkPointChoiceChange,
    onPerkDisguiseChange: props.onPerkDisguiseChange,
    onPerkSelectionChange: props.onPerkSelectionChange,
  };

  return (
    <div class="rounded border p-3 space-y-3">
      <h3 class="font-semibold">Perks</h3>
      <p class="text-sm text-base-content">
        Perks cost {PERK_COST_STAT_POINTS} stat points each.{" "}
        {paidPerkInstances < freePerkSlots
          ? (
            <strong>
              {freePerkSlots === 1
                ? "First perk is free!"
                : "First two perks are free!"}
            </strong>
          )
          : null}
      </p>

      <div>
        <h4 class="font-medium">Owned Perks</h4>
        {props.perkIds.length === 0
          ? <p class="text-sm text-base-content">No perks unlocked.</p>
          : (
            <div class="space-y-3 text-sm">
              {props.ownedPerkGroups.map((group) => (
                <div key={group.category} class="space-y-1">
                  <h5 class="font-medium">
                    {PERK_CATEGORY_LABELS[group.category]}
                  </h5>
                  <ul class="space-y-2">
                    {group.items.map((perk) => (
                      <OwnedPerkCard key={perk.id} perk={perk} {...cardProps} />
                    ))}
                  </ul>
                </div>
              ))}
              <InvalidPerksList
                perkIds={props.uncategorizedOwnedPerks.map(({ id }) => id)}
                onRemove={props.onUnbuyPerk}
              />
            </div>
          )}
      </div>

      <PerkPicker
        listedPerks={props.listedPerks}
        perkIds={props.perkIds}
        perkRanks={props.perkRanks}
        perkSelections={props.perkSelections}
        perkPointChoices={props.perkPointChoices}
        perkOrigins={props.perkOrigins}
        faction={props.faction}
        race={props.race}
        unallocatedStatPoints={props.unallocatedStatPoints}
        inventoryPointCost={props.inventoryPointCost}
        onBuyPerk={props.onBuyPerk}
      />
    </div>
  );
}
