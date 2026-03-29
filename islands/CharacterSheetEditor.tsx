import { useMemo, useState } from "preact/hooks";
import {
  PERK_CATEGORY_LABELS,
  PERK_CATEGORY_ORDER,
  type PerkCategory,
  type PerkDefinition,
  PERKS_BY_ID,
} from "@/data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDescription,
  type CharacterDraft,
  type CharacterSheet,
  FACTIONS,
  getRacesForSex,
  getStartingStatPoints,
  isPilzRace,
  isTierRace,
  mapRaceForSex,
  PERK_COST_STAT_POINTS,
  type PerkOrigin,
  type Sex,
  SEX_OPTIONS,
} from "@/lib/character_types.ts";
import { FACTION_DEFINITIONS_BY_ID } from "@/data/factions.ts";
import { calculatePerksCost, getDerivedPerkIds } from "@/lib/characters.ts";
import {
  getStatFloor as getSharedStatFloor,
  isPerkEligible,
} from "@/lib/draft_validation.ts";
import { useCharacterStats } from "@/lib/useCharacterStats.ts";
import { getStatCap } from "@/lib/stat_calculations.ts";
import {
  cleanupPerkData,
  normalizeCharacterPerkIds,
} from "@/lib/perk_state_helpers.ts";
import { useImageUpload } from "@/lib/useImageUpload.ts";
import OtherStatsSection from "@/components/OtherStatsSection.tsx";
import EncumbranceSection from "@/components/EncumbranceSection.tsx";
import PerkDescription from "@/components/PerkDescription.tsx";
import InventorySection from "@/components/InventorySection.tsx";
import type { CharacterInventory } from "@/lib/inventory_types.ts";
import { Button } from "@/components/Button.tsx";
import { createEmptyInventory } from "@/lib/inventory_types.ts";
import { calculateInventoryPointCostWithPerks } from "@/components/inventory/helpers.ts";

interface CharacterSheetEditorProps {
  action: "create" | "update";
  title: string;
  submitLabel: string;
  characterId?: string;
  basedOnSnapshotId?: string;
  initialCharacter: CharacterDraft | CharacterSheet;
  perks: PerkDefinition[];
  accountPerkCounts?: Record<string, number>;
  /** Cloudflare Images delivery URL for existing character image */
  imageUrl?: string;
  /** Whether the character is still pending admin approval */
  isPending?: boolean;
}

function inferInitialPerkState(
  initialCharacter: CharacterDraft | CharacterSheet,
): {
  perkOrigins: Record<string, PerkOrigin>;
  factionCompensatedPerkIds: string[];
} {
  const perkOrigins = { ...(initialCharacter.perkOrigins ?? {}) };
  const faction = initialCharacter.description.faction;
  const factionGrantedOwnedIds = (
    FACTION_DEFINITIONS_BY_ID.get(faction)?.grantsPerkIds ?? []
  ).filter((id) => initialCharacter.perkIds.includes(id));
  const explicitCompensatedIds = (
    initialCharacter.factionCompensatedPerkIds ?? []
  ).filter((id) => factionGrantedOwnedIds.includes(id));
  const unresolvedFactionIds = factionGrantedOwnedIds.filter((id) =>
    !perkOrigins[id]
  );

  const spentOnStats = BASE_STAT_FIELDS.reduce(
    (total, stat) => total + initialCharacter.baseStats[stat.key],
    0,
  ) - BASE_STAT_FIELDS.length;
  const baseAvailablePoints = getStartingStatPoints(initialCharacter.race) +
    (FACTION_DEFINITIONS_BY_ID.get(faction)?.grantsStatPoints ?? 0);

  let bestOrigins: Record<string, PerkOrigin> | undefined;
  let bestCompensatedIds: string[] | undefined;
  let bestFactionCount = Number.POSITIVE_INFINITY;
  let bestCompensationCount = Number.NEGATIVE_INFINITY;

  for (
    let originMask = 0;
    originMask < 2 ** unresolvedFactionIds.length;
    originMask++
  ) {
    const candidateOrigins = { ...perkOrigins };
    const purchasedFactionIds: string[] = [];

    for (const perkId of initialCharacter.perkIds) {
      if (!candidateOrigins[perkId]) {
        candidateOrigins[perkId] = "purchased";
      }
    }

    for (const [index, perkId] of unresolvedFactionIds.entries()) {
      if ((originMask & (1 << index)) !== 0) {
        candidateOrigins[perkId] = "faction";
      } else {
        candidateOrigins[perkId] = "purchased";
        purchasedFactionIds.push(perkId);
      }
    }

    for (
      let compensationMask = 0;
      compensationMask < 2 ** purchasedFactionIds.length;
      compensationMask++
    ) {
      const candidateCompensatedIds = [...explicitCompensatedIds];

      for (const [index, perkId] of purchasedFactionIds.entries()) {
        if ((compensationMask & (1 << index)) !== 0) {
          candidateCompensatedIds.push(perkId);
        }
      }

      const spentOnPerks = calculatePerksCost(
        initialCharacter.perkIds,
        initialCharacter.perkRanks,
        initialCharacter.perkSelections,
        faction,
        initialCharacter.perkPointChoices,
        candidateOrigins,
      );
      const totalUsed = spentOnStats + spentOnPerks +
        initialCharacter.unallocatedStatPoints;
      const totalAvailable = baseAvailablePoints +
        (candidateCompensatedIds.length * 2);

      if (totalUsed !== totalAvailable) {
        continue;
      }

      const inferredFactionCount = unresolvedFactionIds.filter((id) =>
        candidateOrigins[id] === "faction"
      ).length;
      if (
        inferredFactionCount < bestFactionCount ||
        (
          inferredFactionCount === bestFactionCount &&
          candidateCompensatedIds.length > bestCompensationCount
        )
      ) {
        bestOrigins = candidateOrigins;
        bestCompensatedIds = candidateCompensatedIds;
        bestFactionCount = inferredFactionCount;
        bestCompensationCount = candidateCompensatedIds.length;
      }
    }
  }

  const finalOrigins = bestOrigins ?? { ...perkOrigins };
  for (const perkId of initialCharacter.perkIds) {
    if (!finalOrigins[perkId]) {
      finalOrigins[perkId] = "purchased";
    }
  }

  return {
    perkOrigins: finalOrigins,
    factionCompensatedPerkIds: bestCompensatedIds ?? explicitCompensatedIds,
  };
}

export default function CharacterSheetEditor(props: CharacterSheetEditorProps) {
  const [initialCharacter] = useState(() =>
    normalizeCharacterPerkIds(props.initialCharacter)
  );
  const [initialPerkState] = useState(() =>
    inferInitialPerkState(initialCharacter)
  );
  const [name, setName] = useState(initialCharacter.name);
  const [race, setRace] = useState(initialCharacter.race);
  const [description, setDescription] = useState<CharacterDescription>(
    initialCharacter.description,
  );
  const [initialBaseStats] = useState(initialCharacter.baseStats);
  const [baseStats, setBaseStats] = useState(initialCharacter.baseStats);
  const [initialPerkIds] = useState(initialCharacter.perkIds);
  const [initialPerkRanks] = useState(initialCharacter.perkRanks ?? {});
  const [unallocatedStatPoints, setUnallocatedStatPoints] = useState(
    initialCharacter.unallocatedStatPoints,
  );
  const [perkIds, setPerkIds] = useState(initialCharacter.perkIds);
  const [perkNotes, setPerkNotes] = useState<Record<string, string>>(
    initialCharacter.perkNotes ?? {},
  );
  const [perkUpgradeNotes, setPerkUpgradeNotes] = useState<
    Record<string, string[]>
  >(() => {
    const result = { ...(initialCharacter.perkUpgradeNotes ?? {}) };
    // Migrate existing perkNotes entries for upgradable perks
    for (const perkId of initialCharacter.perkIds) {
      const perk = PERKS_BY_ID.get(perkId);
      if (perk?.upgradable && perk.customInput && !result[perkId]) {
        const oldNote = initialCharacter.perkNotes?.[perkId];
        if (oldNote) result[perkId] = [oldNote];
      }
    }
    return result;
  });
  const [perkStatChoices, setPerkStatChoices] = useState<
    Record<string, BaseStatKey[]>
  >(initialCharacter.perkStatChoices ?? {});
  const [perkRanks, setPerkRanks] = useState<Record<string, number>>(
    initialCharacter.perkRanks ?? {},
  );
  const [perkDisguises, setPerkDisguises] = useState<Record<string, string>>(
    initialCharacter.perkDisguises ?? {},
  );
  const [perkSelections, setPerkSelections] = useState<
    Record<string, string[]>
  >(
    initialCharacter.perkSelections ?? {},
  );
  const [perkPointChoices, setPerkPointChoices] = useState<
    Record<string, number>
  >(
    initialCharacter.perkPointChoices ?? {},
  );
  const [perkOrigins, setPerkOrigins] = useState<Record<string, PerkOrigin>>(
    initialPerkState.perkOrigins,
  );
  const [factionCompensatedPerkIds, setFactionCompensatedPerkIds] = useState<
    string[]
  >(initialPerkState.factionCompensatedPerkIds);
  const [inventory, setInventory] = useState<CharacterInventory>(
    initialCharacter.inventory ?? createEmptyInventory(),
  );
  const [changelog, setChangelog] = useState("");
  const [showDescription, setShowDescription] = useState(true);
  const [showPerkPicker, setShowPerkPicker] = useState(false);
  const [perkCategoryFilter, setPerkCategoryFilter] = useState<
    PerkCategory | ""
  >("");
  const [perkSearchFilter, setPerkSearchFilter] = useState("");

  // Image upload state
  const {
    currentImageUrl,
    pendingImageId,
    imageUploading,
    imageError,
    fileInputRef,
    handleImageUpload,
    handleImageDelete,
  } = useImageUpload({
    initialImageUrl: props.imageUrl ?? "",
    characterId: props.characterId,
    action: props.action,
  });

  const draft: CharacterDraft = {
    name,
    race,
    description,
    baseStats,
    unallocatedStatPoints,
    perkIds,
    perkNotes,
    perkRanks: Object.keys(perkRanks).length > 0 ? perkRanks : undefined,
    perkStatChoices: Object.keys(perkStatChoices).length > 0
      ? perkStatChoices
      : undefined,
    perkDisguises,
    perkSelections: Object.keys(perkSelections).length > 0
      ? perkSelections
      : undefined,
    perkPointChoices: Object.keys(perkPointChoices).length > 0
      ? perkPointChoices
      : undefined,
    perkOrigins: Object.keys(perkOrigins).length > 0 ? perkOrigins : undefined,
    factionCompensatedPerkIds,
    inventory,
  };

  const {
    carriedWeight,
    setCarriedWeight,
    inventoryWeight,
    carryCapacity,
    encumbranceLevel,
    encumbrancePenaltyText,
    effectiveByStat,
  } = useCharacterStats(draft);

  const inventoryPointCost = calculateInventoryPointCostWithPerks(
    inventory,
    perkIds,
  );

  const perksById = new Map(props.perks.map((perk) => [perk.id, perk]));
  const accountPerkCounts = useMemo(
    () => new Map(Object.entries(props.accountPerkCounts ?? {})),
    [props.accountPerkCounts],
  );
  const derivedPerkIds = getDerivedPerkIds(
    perkIds,
    perkSelections,
    description.faction,
    perkOrigins,
  );
  const ownedPerks = perkIds.map((id) => ({ id, perk: perksById.get(id) }));
  const ownedPerkGroups = PERK_CATEGORY_ORDER
    .map((category) => ({
      category,
      items: ownedPerks.filter((item) => item.perk?.category === category),
    }))
    .filter((group) => group.items.length > 0);
  const uncategorizedOwnedPerks = ownedPerks.filter((item) => !item.perk);

  const eligiblePerks = props.perks.filter((perk) =>
    isPerkEligible(perk, {
      race,
      sex: description.sex,
      faction: description.faction,
      isTemplate: description.isTemplate,
      ownedPerkIds: perkIds,
      derivedPerkIds,
      perksById,
      accountPerkCounts,
    })
  );

  const availablePerks = eligiblePerks.filter((perk) => {
    if (perkCategoryFilter && perk.category !== perkCategoryFilter) {
      return false;
    }
    if (perkSearchFilter) {
      const q = perkSearchFilter.toLowerCase();
      if (!perk.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function updateDescription<K extends keyof CharacterDescription>(
    key: K,
    value: CharacterDescription[K],
  ) {
    setDescription((current) => ({ ...current, [key]: value }));
  }

  function withoutRemovedCompensations(removedIds: string[]) {
    return factionCompensatedPerkIds.filter((id) => !removedIds.includes(id));
  }

  function withoutRemovedOrigins(removedIds: string[]) {
    return Object.fromEntries(
      Object.entries(perkOrigins).filter(([id]) => !removedIds.includes(id)),
    );
  }

  // When pending approval, allow full re-allocation (no floor on decreases)
  const statFloor = props.isPending ? 0 : undefined;
  const canRemoveOldPerks = !!props.isPending;
  const lockIdentityFields = props.action === "update" && !props.isPending;

  // Compute stat caps from perks (e.g. Speisfraun caps STR/DEX to 1)
  const statCaps = useMemo(() => {
    const caps: Partial<Record<BaseStatKey, number>> = {};
    for (const field of BASE_STAT_FIELDS) {
      const cap = getStatCap(draft, field.key);
      if (cap !== undefined) caps[field.key] = cap;
    }
    return caps;
  }, [draft.perkIds, draft.perkStatChoices]);

  function getStatFloor(statKey: BaseStatKey): number {
    const sharedFloor = getSharedStatFloor(statKey, perkIds);
    // Perk-based floors below the normal minimum (e.g. -4 for digestion) always apply
    if (sharedFloor < 1) return sharedFloor;
    const editFloor = statFloor ?? initialBaseStats[statKey];
    return Math.max(sharedFloor, editFloor);
  }

  function applyRequiredStatFloors(
    nextPerkIds: string[],
    currentBaseStats: typeof baseStats,
  ) {
    const nextBaseStats = { ...currentBaseStats };
    let requiredPoints = 0;

    for (const field of BASE_STAT_FIELDS) {
      const floor = getSharedStatFloor(field.key, nextPerkIds);
      if (nextBaseStats[field.key] >= floor) continue;

      requiredPoints += floor - nextBaseStats[field.key];
      nextBaseStats[field.key] = floor;
    }

    return { nextBaseStats, requiredPoints };
  }

  function applyPerkGrantedInventoryChanges(
    addedPerkIds: string[],
    removedPerkIds: string[],
  ) {
    if (addedPerkIds.length === 0 && removedPerkIds.length === 0) {
      return;
    }

    setInventory((inv) => {
      const nextInventory = structuredClone(inv);

      for (const location of ["carried", "stowed"] as const) {
        if (removedPerkIds.length > 0) {
          nextInventory[location].equipment = nextInventory[location].equipment
            .filter((item) => !removedPerkIds.includes(item.perkGranted ?? ""));
          nextInventory[location].meleeWeapons = nextInventory[location]
            .meleeWeapons.filter((weapon) =>
              !removedPerkIds.includes(weapon.perkGranted ?? "")
            );
          nextInventory[location].attachments = nextInventory[location]
            .attachments.filter((attachment) =>
              !removedPerkIds.includes(attachment.perkGranted ?? "")
            );
        }
      }

      for (const perkId of addedPerkIds) {
        const perk = perksById.get(perkId);

        for (const grant of perk?.grantsEquipment ?? []) {
          nextInventory.carried.equipment.push({
            equipmentId: grant.equipmentId,
            totalCharges: 0,
            usedCharges: 0,
            perkGranted: perkId,
            weightOverride: grant.weightOverride,
            isBulkyOverride: grant.isBulkyOverride,
          });
        }

        for (const grant of perk?.grantsMeleeWeapons ?? []) {
          nextInventory.carried.meleeWeapons.push({
            instanceId: crypto.randomUUID(),
            meleeWeaponId: grant.meleeWeaponId,
            isSignatureWeapon: true,
            perkGranted: perkId,
          });
        }
      }

      return nextInventory;
    });
  }

  function increaseStat(statKey: BaseStatKey) {
    if (unallocatedStatPoints - inventoryPointCost < 1) {
      return;
    }
    // Respect stat caps on base stats
    const cap = statCaps[statKey];
    if (cap !== undefined && baseStats[statKey] >= cap) {
      return;
    }

    setBaseStats((current) => ({
      ...current,
      [statKey]: current[statKey] + 1,
    }));
    setUnallocatedStatPoints((current) => current - 1);
  }

  function decreaseStat(statKey: BaseStatKey) {
    const floor = getStatFloor(statKey);
    if (baseStats[statKey] <= floor) {
      return;
    }

    setBaseStats((current) => ({
      ...current,
      [statKey]: current[statKey] - 1,
    }));
    setUnallocatedStatPoints((current) => current + 1);
  }

  function buyPerk(perkId: string) {
    if (perkIds.includes(perkId)) return;

    const perk = perksById.get(perkId);
    const includedIds = (perk?.includesPerks ?? []).filter((id) =>
      !perkIds.includes(id)
    );
    const newPerkIds = [...perkIds, perkId, ...includedIds];
    const cost = calculatePerksCost(
      newPerkIds,
      perkRanks,
      perkSelections,
      description.faction,
      perkPointChoices,
      perkOrigins,
    ) -
      calculatePerksCost(
        perkIds,
        perkRanks,
        perkSelections,
        description.faction,
        perkPointChoices,
        perkOrigins,
      );

    const { nextBaseStats, requiredPoints } = applyRequiredStatFloors(
      newPerkIds,
      baseStats,
    );

    if (unallocatedStatPoints - inventoryPointCost < cost + requiredPoints) {
      return;
    }

    setPerkIds(newPerkIds);
    setPerkOrigins((current) => ({ ...current, [perkId]: "purchased" }));
    if (requiredPoints > 0) {
      setBaseStats(nextBaseStats);
    }
    setUnallocatedStatPoints((current) => current - cost - requiredPoints);

    // Enforce stat caps from the new perk (e.g. Speisfraun caps STR/DEX to 1)
    if (perk?.modifiers?.statCaps) {
      let refundedPoints = 0;
      const newBaseStats = { ...baseStats };
      for (const [statKey, cap] of Object.entries(perk.modifiers.statCaps)) {
        const key = statKey as BaseStatKey;
        if (newBaseStats[key] > cap) {
          refundedPoints += newBaseStats[key] - cap;
          newBaseStats[key] = cap;
        }
      }
      if (refundedPoints > 0) {
        setBaseStats(newBaseStats);
        setUnallocatedStatPoints((current) => current + refundedPoints);
      }
    }

    // Initialize per-rank data for upgradable perks
    if (perk?.upgradable) {
      if (perk.customInput) {
        setPerkUpgradeNotes((current) => ({ ...current, [perkId]: [""] }));
      }
      if (perk.requiresStatChoice) {
        setPerkStatChoices((current) => ({
          ...current,
          [perkId]: ["" as BaseStatKey],
        }));
      }
    }

    // Auto-add perk-granted equipment and melee weapons
    const allNewPerks = [perkId, ...includedIds];
    const hasGrantedItems = allNewPerks.some((id) => {
      const p = perksById.get(id);
      return (p?.grantsEquipment?.length ?? 0) > 0 ||
        (p?.grantsMeleeWeapons?.length ?? 0) > 0;
    });
    if (hasGrantedItems) {
      setInventory((inv) => {
        const newInv = structuredClone(inv);
        for (const id of allNewPerks) {
          const p = perksById.get(id);
          for (const grant of p?.grantsEquipment ?? []) {
            newInv.carried.equipment.push({
              equipmentId: grant.equipmentId,
              totalCharges: 0,
              usedCharges: 0,
              perkGranted: id,
              weightOverride: grant.weightOverride,
              isBulkyOverride: grant.isBulkyOverride,
            });
          }
          for (const grant of p?.grantsMeleeWeapons ?? []) {
            newInv.carried.meleeWeapons.push({
              instanceId: crypto.randomUUID(),
              meleeWeaponId: grant.meleeWeaponId,
              isSignatureWeapon: true,
              perkGranted: id,
            });
          }
        }
        return newInv;
      });
    }
  }

  function unbuyPerk(perkId: string) {
    if (!canRemoveOldPerks && initialPerkIds.includes(perkId)) {
      return;
    }
    if (!perkIds.includes(perkId)) {
      return;
    }
    // Prevent removing a perk that is still derived from another active perk
    if (derivedPerkIds.has(perkId)) {
      return;
    }

    // Determine which included perks should also be removed (those that are no
    // longer derived from any remaining source perk)
    const perk = perksById.get(perkId);
    const perkIdsWithoutSource = perkIds.filter((id) => id !== perkId);
    // Selections from OTHER perks remain active; only selections FROM this perk are cleared
    const selectionsWithoutSource = { ...perkSelections };
    delete selectionsWithoutSource[perkId];
    const stillDerived = getDerivedPerkIds(
      perkIdsWithoutSource,
      selectionsWithoutSource,
      description.faction,
      perkOrigins,
    );
    const orphanedIncluded = (perk?.includesPerks ?? []).filter(
      (id) => !stillDerived.has(id),
    );
    // Also remove selection-granted perks when the parent is removed
    const orphanedSelected = (perkSelections[perkId] ?? []).filter(
      (id) => !stillDerived.has(id),
    );
    const orphanedIds = [...orphanedIncluded, ...orphanedSelected];
    const newPerkIds = perkIdsWithoutSource.filter(
      (id) => !orphanedIds.includes(id),
    );
    const refund = calculatePerksCost(
      perkIds,
      perkRanks,
      perkSelections,
      description.faction,
      perkPointChoices,
      perkOrigins,
    ) -
      calculatePerksCost(
        newPerkIds,
        perkRanks,
        selectionsWithoutSource,
        description.faction,
        perkPointChoices,
        perkOrigins,
      );
    setPerkIds(newPerkIds);
    const allRemovedIds = [perkId, ...orphanedIds];
    const cleaned = cleanupPerkData(
      {
        perkNotes,
        perkUpgradeNotes,
        perkStatChoices,
        perkRanks,
        perkDisguises,
        perkSelections,
        perkPointChoices,
      },
      allRemovedIds,
    );
    setPerkNotes(cleaned.perkNotes);
    setPerkUpgradeNotes(cleaned.perkUpgradeNotes);
    setPerkStatChoices(cleaned.perkStatChoices);
    setPerkRanks(cleaned.perkRanks);
    setPerkDisguises(cleaned.perkDisguises);
    setPerkSelections(cleaned.perkSelections);
    setPerkPointChoices(cleaned.perkPointChoices);
    setPerkOrigins(withoutRemovedOrigins(allRemovedIds));
    setFactionCompensatedPerkIds(withoutRemovedCompensations(allRemovedIds));
    setUnallocatedStatPoints((current) => current + refund);

    // Remove perk-granted items from inventory
    setInventory((inv) => {
      const newInv = structuredClone(inv);
      const removingSignatureWeapon = allRemovedIds.includes(
        "signature-weapon",
      );
      for (const location of ["carried", "stowed"] as const) {
        newInv[location].equipment = newInv[location].equipment.filter(
          (e) => !allRemovedIds.includes(e.perkGranted ?? ""),
        );
        newInv[location].meleeWeapons = newInv[location].meleeWeapons.filter(
          (mw) => !allRemovedIds.includes(mw.perkGranted ?? ""),
        );
        newInv[location].attachments = newInv[location].attachments.filter(
          (a) => !allRemovedIds.includes(a.perkGranted ?? ""),
        );
        if (removingSignatureWeapon) {
          for (const w of newInv[location].weapons) w.isSignatureWeapon = false;
          for (const mw of newInv[location].meleeWeapons) {
            mw.isSignatureWeapon = false;
          }
        }
      }
      return newInv;
    });
  }

  function handlePerkPointChoiceChange(perkId: string, value: number) {
    const oldValue = perkPointChoices[perkId] ?? 0;
    const delta = value - oldValue;
    setPerkPointChoices((current) => ({ ...current, [perkId]: value }));
    setUnallocatedStatPoints((current) => current + delta);
  }

  function upgradePerk(perkId: string) {
    const perk = perksById.get(perkId);
    if (!perk?.upgradable) return;
    const currentRank = perkRanks[perkId] ?? 1;
    if (perk.maxRanks !== undefined && currentRank >= perk.maxRanks) return;

    const newRanks = { ...perkRanks, [perkId]: currentRank + 1 };
    const upgradeCost = calculatePerksCost(
      perkIds,
      newRanks,
      perkSelections,
      description.faction,
      perkPointChoices,
      perkOrigins,
    ) -
      calculatePerksCost(
        perkIds,
        perkRanks,
        perkSelections,
        description.faction,
        perkPointChoices,
        perkOrigins,
      );

    if (unallocatedStatPoints - inventoryPointCost < upgradeCost) return;

    setPerkRanks(newRanks);
    setUnallocatedStatPoints((current) => current - upgradeCost);

    if (perk.customInput) {
      setPerkUpgradeNotes((current) => ({
        ...current,
        [perkId]: [...(current[perkId] ?? [""]), ""],
      }));
    }
    if (perk.requiresStatChoice) {
      setPerkStatChoices((current) => ({
        ...current,
        [perkId]: [
          ...(current[perkId] ?? ["" as BaseStatKey]),
          "" as BaseStatKey,
        ],
      }));
    }
  }

  function downgradePerk(perkId: string) {
    const perk = perksById.get(perkId);
    if (!perk?.upgradable) return;
    const currentRank = perkRanks[perkId] ?? 1;

    if (currentRank <= 1) {
      // Don't allow removing a perk that is derived from another active perk
      if (derivedPerkIds.has(perkId)) return;
      unbuyPerk(perkId);
      return;
    }

    const newRanks = { ...perkRanks, [perkId]: currentRank - 1 };
    const refund = calculatePerksCost(
      perkIds,
      perkRanks,
      perkSelections,
      description.faction,
      perkPointChoices,
      perkOrigins,
    ) -
      calculatePerksCost(
        perkIds,
        newRanks,
        perkSelections,
        description.faction,
        perkPointChoices,
        perkOrigins,
      );

    setPerkRanks(newRanks);
    setUnallocatedStatPoints((current) => current + refund);

    if (perk.customInput) {
      setPerkUpgradeNotes((current) => {
        const notes = [...(current[perkId] ?? [])];
        notes.pop();
        return { ...current, [perkId]: notes };
      });
    }
    if (perk.requiresStatChoice) {
      setPerkStatChoices((current) => {
        const choices = [...(current[perkId] ?? [])];
        choices.pop();
        return { ...current, [perkId]: choices };
      });
    }
  }

  return (
    <form method="POST" class="space-y-4 border rounded-lg p-4 bg-base-100/80">
      <h2 class="text-xl font-semibold">{props.title}</h2>
      <input type="hidden" name="action" value={props.action} />
      {props.action === "update" && props.characterId && (
        <input type="hidden" name="id" value={props.characterId} />
      )}
      {props.basedOnSnapshotId && (
        <input
          type="hidden"
          name="basedOnSnapshotId"
          value={props.basedOnSnapshotId}
        />
      )}
      <input type="hidden" name="baseStats" value={JSON.stringify(baseStats)} />
      <input
        type="hidden"
        name="description"
        value={JSON.stringify(description)}
      />
      <input type="hidden" name="perkIds" value={JSON.stringify(perkIds)} />
      <input
        type="hidden"
        name="perkNotes"
        value={JSON.stringify(perkNotes)}
      />
      <input
        type="hidden"
        name="perkUpgradeNotes"
        value={JSON.stringify(perkUpgradeNotes)}
      />
      <input
        type="hidden"
        name="perkStatChoices"
        value={JSON.stringify(perkStatChoices)}
      />
      <input
        type="hidden"
        name="perkRanks"
        value={JSON.stringify(perkRanks)}
      />
      <input
        type="hidden"
        name="perkDisguises"
        value={JSON.stringify(perkDisguises)}
      />
      <input
        type="hidden"
        name="perkSelections"
        value={JSON.stringify(perkSelections)}
      />
      <input
        type="hidden"
        name="perkPointChoices"
        value={JSON.stringify(perkPointChoices)}
      />
      <input
        type="hidden"
        name="perkOrigins"
        value={JSON.stringify(perkOrigins)}
      />
      <input
        type="hidden"
        name="factionCompensatedPerkIds"
        value={JSON.stringify(factionCompensatedPerkIds)}
      />
      <input type="hidden" name="pendingImageId" value={pendingImageId} />
      <input
        type="hidden"
        name="inventory"
        value={JSON.stringify(inventory)}
      />
      <input
        type="hidden"
        name="unallocatedStatPoints"
        value={String(unallocatedStatPoints)}
      />
      {
        /* When identity fields are locked the fieldset is disabled and its
          inputs are excluded from form submission, so emit a hidden input. */
      }
      {lockIdentityFields && <input type="hidden" name="name" value={name} />}

      {lockIdentityFields && (
        <p class="text-sm text-base-content/70">
          Name and description are locked after approval. An admin must
          disapprove the character to change them.
        </p>
      )}

      <fieldset
        disabled={lockIdentityFields}
        class="space-y-4 disabled:opacity-70"
      >
        <label class="block">
          <span class="block font-medium mb-1">Name</span>
          <input
            class="w-full border rounded px-3 py-2"
            name="name"
            type="text"
            value={name}
            onInput={(event) =>
              setName(event.currentTarget.value)}
            required
          />
        </label>

        <div class="rounded border p-3 space-y-3">
          <button
            type="button"
            class="font-semibold text-primary hover:underline cursor-pointer"
            onClick={() =>
              setShowDescription((v) => !v)}
          >
            Description {showDescription ? "▲" : "▼"}
          </button>
          {showDescription && (
            <>
              <label class="block">
                <span class="block font-medium mb-1">Race</span>
                <select
                  class="select w-full border rounded px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  name="race"
                  value={race}
                  disabled={lockIdentityFields}
                  onInput={(event) => {
                    const newRace = event.currentTarget
                      .value as CharacterDraft["race"];
                    const pointsDiff = getStartingStatPoints(newRace) -
                      getStartingStatPoints(race);
                    // Remove perks that require the old race but not the new one
                    const keptPerkIds = perkIds.filter((id) => {
                      const perk = PERKS_BY_ID.get(id);
                      if (
                        perk?.requiredRaces &&
                        !perk.requiredRaces.includes(newRace)
                      ) return false;
                      return true;
                    });
                    const keptRanks = Object.fromEntries(
                      Object.entries(perkRanks).filter(([id]) =>
                        keptPerkIds.includes(id)
                      ),
                    );
                    const perkRefund = calculatePerksCost(
                      perkIds,
                      perkRanks,
                      perkSelections,
                      description.faction,
                      perkPointChoices,
                      perkOrigins,
                    ) -
                      calculatePerksCost(
                        keptPerkIds,
                        keptRanks,
                        perkSelections,
                        description.faction,
                        perkPointChoices,
                        withoutRemovedOrigins(
                          perkIds.filter((id) =>
                            !keptPerkIds.includes(id)
                          ),
                        ),
                      );
                    if (keptPerkIds.length !== perkIds.length) {
                      const removedIds = perkIds.filter((id) =>
                        !keptPerkIds.includes(id)
                      );
                      const cleaned = cleanupPerkData(
                        {
                          perkNotes,
                          perkUpgradeNotes,
                          perkStatChoices,
                          perkRanks,
                          perkDisguises,
                          perkSelections,
                          perkPointChoices,
                        },
                        removedIds,
                      );
                      setPerkNotes(cleaned.perkNotes);
                      setPerkUpgradeNotes(cleaned.perkUpgradeNotes);
                      setPerkStatChoices(cleaned.perkStatChoices);
                      setPerkRanks(keptRanks);
                      setPerkDisguises(cleaned.perkDisguises);
                      setPerkSelections(cleaned.perkSelections);
                      setPerkPointChoices(cleaned.perkPointChoices);
                      setPerkOrigins(withoutRemovedOrigins(removedIds));
                      setFactionCompensatedPerkIds(
                        withoutRemovedCompensations(removedIds),
                      );
                      setPerkIds(keptPerkIds);
                    }
                    setRace(newRace);
                    setUnallocatedStatPoints((current) =>
                      current + pointsDiff + perkRefund
                    );
                  }}
                >
                  {getRacesForSex(description.sex).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Sex</span>
                <select
                  class="select w-full border rounded px-3 py-2"
                  value={description.sex}
                  onInput={(event) => {
                    const newSex = event.currentTarget.value as Sex;
                    updateDescription("sex", newSex);
                    // Swap gendered race name to match new sex
                    setRace((prev) => mapRaceForSex(prev, newSex));
                  }}
                >
                  {SEX_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              {(isPilzRace(race) || isTierRace(race)) && (
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={description.isTemplate}
                    disabled={lockIdentityFields}
                    onChange={(event) =>
                      updateDescription(
                        "isTemplate",
                        event.currentTarget.checked,
                      )}
                    class={lockIdentityFields
                      ? "opacity-60 cursor-not-allowed"
                      : ""}
                  />
                  <span class="font-medium">Is a template</span>
                </label>
              )}

              <label class="block">
                <span class="block font-medium mb-1">Country of Origin</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.countryOfOrigin}
                  onInput={(event) =>
                    updateDescription(
                      "countryOfOrigin",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Faction</span>
                <select
                  class="select w-full border rounded px-3 py-2"
                  value={description.faction}
                  onChange={(event) => {
                    const newFaction =
                      (event.target as HTMLSelectElement).value;
                    const oldFaction = description.faction;
                    updateDescription("faction", newFaction);

                    const oldDef = FACTION_DEFINITIONS_BY_ID.get(oldFaction);
                    const newDef = FACTION_DEFINITIONS_BY_ID.get(newFaction);
                    const oldGranted = oldDef?.grantsPerkIds ?? [];
                    const newGranted = newDef?.grantsPerkIds ?? [];
                    const derivedAfterChange = getDerivedPerkIds(
                      perkIds,
                      perkSelections,
                      newFaction,
                      perkOrigins,
                    );
                    const removedCompensated = factionCompensatedPerkIds.filter(
                      (id) =>
                        oldGranted.includes(id) && !newGranted.includes(id),
                    );
                    const keptCompensated = factionCompensatedPerkIds.filter((
                      id,
                    ) => newGranted.includes(id));
                    const newlyCompensated = newGranted.filter((id) =>
                      !oldGranted.includes(id) &&
                      perkIds.includes(id) &&
                      !derivedPerkIds.has(id)
                    );

                    const toRemove = oldGranted.filter((id) =>
                      !newGranted.includes(id) &&
                      !factionCompensatedPerkIds.includes(id) &&
                      !derivedAfterChange.has(id)
                    );
                    const toAdd = newGranted.filter((id) =>
                      !perkIds.includes(id)
                    );

                    let updatedPerkIds = perkIds.filter((id) =>
                      !toRemove.includes(id)
                    );
                    updatedPerkIds = [...updatedPerkIds, ...toAdd];
                    const nextPerkOrigins = {
                      ...withoutRemovedOrigins(toRemove),
                    };
                    for (const perkId of toAdd) {
                      nextPerkOrigins[perkId] = "faction";
                    }
                    const nextCompensated = [
                      ...keptCompensated,
                      ...newlyCompensated,
                    ].filter((id, index, arr) =>
                      updatedPerkIds.includes(id) && arr.indexOf(id) === index
                    );

                    const oldPoints = oldDef?.grantsStatPoints ?? 0;
                    const newPoints = newDef?.grantsStatPoints ?? 0;
                    const pointsDelta = newPoints - oldPoints +
                      ((newlyCompensated.length - removedCompensated.length) *
                        2);

                    if (
                      updatedPerkIds.length !== perkIds.length ||
                      toAdd.length > 0
                    ) {
                      setPerkIds(updatedPerkIds);
                    }
                    if (toRemove.length > 0) {
                      const cleaned = cleanupPerkData(
                        {
                          perkNotes,
                          perkUpgradeNotes,
                          perkStatChoices,
                          perkRanks,
                          perkDisguises,
                          perkSelections,
                          perkPointChoices,
                        },
                        toRemove,
                      );
                      setPerkNotes(cleaned.perkNotes);
                      setPerkUpgradeNotes(cleaned.perkUpgradeNotes);
                      setPerkStatChoices(cleaned.perkStatChoices);
                      setPerkRanks(cleaned.perkRanks);
                      setPerkDisguises(cleaned.perkDisguises);
                      setPerkSelections(cleaned.perkSelections);
                      setPerkPointChoices(cleaned.perkPointChoices);
                      setInventory((inv) => {
                        const newInv = structuredClone(inv);
                        for (const location of ["carried", "stowed"] as const) {
                          newInv[location].equipment = newInv[location]
                            .equipment
                            .filter((item) =>
                              !toRemove.includes(item.perkGranted ?? "")
                            );
                          newInv[location].meleeWeapons = newInv[location]
                            .meleeWeapons.filter((weapon) =>
                              !toRemove.includes(weapon.perkGranted ?? "")
                            );
                        }
                        return newInv;
                      });
                    }
                    if (
                      Object.keys(nextPerkOrigins).length !==
                        Object.keys(perkOrigins).length ||
                      Object.entries(nextPerkOrigins).some(([id, origin]) =>
                        perkOrigins[id] !== origin
                      )
                    ) {
                      setPerkOrigins(nextPerkOrigins);
                    }
                    if (
                      nextCompensated.length !==
                        factionCompensatedPerkIds.length ||
                      nextCompensated.some((id, index) =>
                        factionCompensatedPerkIds[index] !== id
                      )
                    ) {
                      setFactionCompensatedPerkIds(nextCompensated);
                    }
                    if (pointsDelta !== 0) {
                      setUnallocatedStatPoints((current) =>
                        current + pointsDelta
                      );
                    }
                  }}
                >
                  <option value="">— None —</option>
                  {FACTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Role</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  placeholder="Cook, politician, soldier, sapper, conscript, etc."
                  value={description.role}
                  onInput={(event) =>
                    updateDescription("role", event.currentTarget.value)}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Age</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  placeholder={isPilzRace(race) || isTierRace(race)
                    ? "Biological age is 21 by default. Include chronological age. Year is 1923."
                    : "Must be 18+. Include chronological age (year 1923)."}
                  value={description.age}
                  onInput={(event) =>
                    updateDescription("age", event.currentTarget.value)}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Date of Birth</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  placeholder="M/D/Y — Year is mandatory, month and day are optional"
                  value={description.dateOfBirth}
                  onInput={(event) =>
                    updateDescription("dateOfBirth", event.currentTarget.value)}
                />
              </label>

              <div class="grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="block font-medium mb-1">Height</span>
                  <input
                    class="input w-full border rounded px-3 py-2"
                    type="text"
                    value={description.height}
                    onInput={(event) =>
                      updateDescription("height", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Weight</span>
                  <input
                    class="input w-full border rounded px-3 py-2"
                    type="text"
                    value={description.weight}
                    onInput={(event) =>
                      updateDescription("weight", event.currentTarget.value)}
                  />
                </label>
              </div>

              <p class="text-sm text-base-content/60 italic">
                The appearance fields below may be left blank if using an image
                to represent your character.
              </p>

              <div class="rounded border p-3 space-y-2 bg-base-200">
                <h4 class="font-medium">Character Image</h4>
                {currentImageUrl && (
                  <div class="space-y-2">
                    <img
                      src={currentImageUrl}
                      alt={`${name} character image`}
                      class="max-w-xs rounded border"
                    />
                    <button
                      type="button"
                      class="px-2 py-1 text-sm border rounded text-error hover:bg-error/10"
                      disabled={imageUploading}
                      onClick={handleImageDelete}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <label class="block">
                  <span class="block text-sm mb-1">
                    {currentImageUrl ? "Replace image:" : "Upload an image:"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    class="block text-sm"
                    disabled={imageUploading}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
                {imageUploading && (
                  <p class="text-sm text-primary">Uploading…</p>
                )}
                {imageError && <p class="text-sm text-error">{imageError}</p>}
              </div>

              <div class="grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="block font-medium mb-1">Skin Color</span>
                  <input
                    class="input w-full border rounded px-3 py-2"
                    type="text"
                    value={description.skinColor}
                    onInput={(event) =>
                      updateDescription("skinColor", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Hair Color</span>
                  <input
                    class="input w-full border rounded px-3 py-2"
                    type="text"
                    value={description.hairColor}
                    onInput={(event) =>
                      updateDescription("hairColor", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Eye Color</span>
                  <input
                    class="input w-full border rounded px-3 py-2"
                    type="text"
                    value={description.eyeColor}
                    onInput={(event) =>
                      updateDescription("eyeColor", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Ethnicity</span>
                  <input
                    class="input w-full border rounded px-3 py-2"
                    type="text"
                    value={description.ethnicity}
                    onInput={(event) =>
                      updateDescription("ethnicity", event.currentTarget.value)}
                  />
                </label>
              </div>

              <label class="block">
                <span class="block font-medium mb-1">Body Type</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.bodyType}
                  onInput={(event) =>
                    updateDescription("bodyType", event.currentTarget.value)}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">General Appearance</span>
                <textarea
                  class="textarea w-full border rounded px-3 py-2"
                  rows={3}
                  value={description.generalAppearance}
                  onInput={(event) =>
                    updateDescription(
                      "generalAppearance",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">General Health</span>
                <textarea
                  class="textarea w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Permanent factors: scars, missing limbs, mental conditions, etc."
                  value={description.generalHealth}
                  onInput={(event) =>
                    updateDescription(
                      "generalHealth",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Personality</span>
                <textarea
                  class="textarea w-full border rounded px-3 py-2"
                  rows={3}
                  value={description.personality}
                  onInput={(event) =>
                    updateDescription("personality", event.currentTarget.value)}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Biography</span>
                <textarea
                  class="textarea w-full border rounded px-3 py-2"
                  rows={5}
                  value={description.biography}
                  onInput={(event) =>
                    updateDescription("biography", event.currentTarget.value)}
                />
              </label>
            </>
          )}
        </div>
      </fieldset>

      {props.action === "update" && !props.isPending && (
        <label class="block">
          <span class="block font-medium mb-1">Changelog</span>
          <input
            class="input w-full border rounded px-3 py-2"
            name="changelog"
            type="text"
            value={changelog}
            onInput={(event) => setChangelog(event.currentTarget.value)}
            placeholder="Describe what changed in this save"
            required
          />
        </label>
      )}

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Base Stats</h3>
        {(() => {
          // Compute addiction-affected stats (highest of the 5 main stats)
          const addictionAffectedStats = new Set<BaseStatKey>();
          if (perkIds.includes("crippling-addiction")) {
            const mainStats: BaseStatKey[] = [
              "strength",
              "dexterity",
              "constitution",
              "intelligence",
              "charisma",
            ];
            const maxValue = Math.max(...mainStats.map((k) => baseStats[k]));
            for (const k of mainStats) {
              if (baseStats[k] === maxValue) addictionAffectedStats.add(k);
            }
          }
          return (
            <>
              <p class="text-sm text-base-content flex items-center gap-2">
                Unallocated stat points:{" "}
                <strong>{unallocatedStatPoints - inventoryPointCost}</strong>
                <button
                  type="button"
                  class="px-2 py-1 border rounded disabled:opacity-40"
                  disabled={unallocatedStatPoints - inventoryPointCost < 1}
                  onClick={() => setUnallocatedStatPoints((c) => c - 1)}
                >
                  -1
                </button>
                <button
                  type="button"
                  class="px-2 py-1 border rounded"
                  onClick={() => setUnallocatedStatPoints((c) => c + 1)}
                >
                  +1
                </button>
              </p>
              <ul class="space-y-2">
                {BASE_STAT_FIELDS.filter((field) =>
                  race !== "Baseliner" || field.key !== "digestionStrength"
                ).map((field) => (
                  <li
                    class="flex items-center justify-between gap-2"
                    key={field.key}
                  >
                    <span class="text-sm">
                      {field.label}
                      {addictionAffectedStats.has(field.key) && (
                        <span class="ml-1 text-xs font-semibold text-error">
                          [Addiction]
                        </span>
                      )}
                      {statCaps[field.key] !== undefined && (
                        <span class="ml-1 text-xs font-semibold text-warning">
                          [Capped to {statCaps[field.key]}]
                        </span>
                      )}
                    </span>
                    <span class="text-sm">
                      Base: <strong>{baseStats[field.key]}</strong> | Effective:
                      {" "}
                      <strong>{effectiveByStat[field.key]}</strong>
                    </span>
                    <div class="flex gap-1">
                      <button
                        type="button"
                        class="px-2 py-1 border rounded disabled:opacity-40"
                        disabled={baseStats[field.key] <=
                          getStatFloor(field.key)}
                        onClick={() => decreaseStat(field.key)}
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        class="px-2 py-1 border rounded disabled:opacity-40"
                        disabled={unallocatedStatPoints - inventoryPointCost <
                            1 ||
                          (statCaps[field.key] !== undefined &&
                            baseStats[field.key] >= statCaps[field.key]!)}
                        onClick={() => increaseStat(field.key)}
                      >
                        +1
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          );
        })()}
      </div>

      <OtherStatsSection draft={draft} carryCapacity={carryCapacity} />

      <EncumbranceSection
        carriedWeight={carriedWeight}
        onCarriedWeightChange={setCarriedWeight}
        encumbranceLevel={encumbranceLevel}
        encumbrancePenaltyText={encumbrancePenaltyText}
        inventoryWeight={inventoryWeight}
      />

      <div class="rounded border p-3 space-y-3">
        <h3 class="font-semibold">Perks</h3>
        <p class="text-sm text-base-content">
          Perks cost {PERK_COST_STAT_POINTS} stat points each. {(() => {
            const paidPerkInstances = perkIds
              .filter((id) => !PERKS_BY_ID.get(id)?.isFree)
              .reduce((sum, id) => sum + (perkRanks[id] ?? 1), 0);
            return paidPerkInstances === 0
              ? <strong>First perk is free!</strong>
              : null;
          })()}
        </p>

        <div>
          <h4 class="font-medium">Owned Perks</h4>
          {perkIds.length === 0
            ? <p class="text-sm text-base-content">No perks unlocked.</p>
            : (
              <div class="space-y-3 text-sm">
                {ownedPerkGroups.map((group) => (
                  <div key={group.category} class="space-y-1">
                    <h5 class="font-medium">
                      {PERK_CATEGORY_LABELS[group.category]}
                    </h5>
                    <ul class="space-y-2">
                      {group.items.map(({ id, perk }) => {
                        const isDerived = derivedPerkIds.has(id);
                        const sourcePerk = isDerived
                          ? ownedPerks.find((op) =>
                            op.perk?.includesPerks?.includes(id) ||
                            (perkSelections[op.id] ?? []).includes(id)
                          )?.perk
                          : undefined;
                        const perkOrigin = perkOrigins[id];
                        const factionGrantStatus = perkOrigin === "faction"
                          ? (FACTION_DEFINITIONS_BY_ID.get(description.faction)
                              ?.grantsPerkIds ?? []).includes(id)
                            ? "Added by current faction"
                            : "Added by former faction"
                          : perkOrigin === "race"
                          ? "Added by race"
                          : undefined;
                        const canRemove = !isDerived && (canRemoveOldPerks ||
                          !initialPerkIds.includes(id));
                        const currentRank = perkRanks[id] ?? 1;
                        const isUpgradable = perk?.upgradable ?? false;
                        const initialRank = initialPerkRanks[id] ??
                          (initialPerkIds.includes(id) ? 1 : 0);
                        const canDowngrade = isUpgradable &&
                          (canRemoveOldPerks || currentRank > initialRank) &&
                          // Derived perks cannot be downgraded below rank 1
                          (!isDerived || currentRank > 1);
                        const chosenStats =
                          (perkStatChoices[id] ?? []) as BaseStatKey[];
                        const hasUnsatisfiedStatChoices =
                          perk?.requiresStatChoice
                            ? chosenStats.length < currentRank ||
                              chosenStats.some((s) =>
                                !s
                              )
                            : false;
                        const hasRemainingStats = !perk?.requiresStatChoice ||
                          (perk.requiresStatChoice ?? []).some(
                            (s) => !chosenStats.includes(s as BaseStatKey),
                          );
                        const canUpgrade = isUpgradable &&
                          (perk?.maxRanks === undefined ||
                            currentRank < perk.maxRanks) &&
                          !hasUnsatisfiedStatChoices &&
                          hasRemainingStats;
                        const upgradeRanks = {
                          ...perkRanks,
                          [id]: currentRank + 1,
                        };
                        const upgradeCost = canUpgrade
                          ? calculatePerksCost(
                            perkIds,
                            upgradeRanks,
                            perkSelections,
                            description.faction,
                            perkPointChoices,
                            perkOrigins,
                          ) -
                            calculatePerksCost(
                              perkIds,
                              perkRanks,
                              perkSelections,
                              description.faction,
                              perkPointChoices,
                              perkOrigins,
                            )
                          : 0;
                        const canAffordUpgrade =
                          (unallocatedStatPoints - inventoryPointCost) >=
                            upgradeCost;
                        const statLabelMap = BASE_STAT_FIELDS.reduce(
                          (m, f) => {
                            m[f.key] = f.label;
                            return m;
                          },
                          {} as Record<string, string>,
                        );
                        return (
                          <li key={id}>
                            <div class="flex items-center gap-2 flex-wrap">
                              <span>
                                {perk
                                  ? (
                                    <PerkDescription
                                      name={perk.name}
                                      description={perk.description}
                                    />
                                  )
                                  : id}
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
                              {isUpgradable && canUpgrade && canAffordUpgrade &&
                                (
                                  <button
                                    type="button"
                                    class="px-2 py-0.5 text-xs border rounded text-primary hover:bg-primary/10"
                                    onClick={() => upgradePerk(id)}
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
                                  onClick={() => downgradePerk(id)}
                                >
                                  {currentRank > 1 ? "Downgrade" : "Remove"}
                                </button>
                              )}
                              {canRemove && (
                                <button
                                  type="button"
                                  class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
                                  onClick={() => unbuyPerk(id)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            {/* Upgradable perk: per-rank inputs */}
                            {isUpgradable &&
                              (perk?.requiresStatChoice || perk?.customInput) &&
                              (
                                <div class="mt-1 space-y-1">
                                  {Array.from(
                                    { length: currentRank },
                                    (_, ri) => {
                                      const chosenForRank = chosenStats[ri];
                                      const usedByOthers = chosenStats.filter(
                                        (_, i) => i !== ri,
                                      );
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
                                                  const val =
                                                    (e.target as HTMLSelectElement)
                                                      .value as BaseStatKey;
                                                  setPerkStatChoices(
                                                    (current) => {
                                                      const choices = [
                                                        ...(current[id] ??
                                                          Array(currentRank)
                                                            .fill(
                                                              "" as BaseStatKey,
                                                            )),
                                                      ];
                                                      choices[ri] = val;
                                                      return {
                                                        ...current,
                                                        [id]: choices,
                                                      };
                                                    },
                                                  );
                                                  // Enforce stat cap: refund base stat points above 1
                                                  if (
                                                    val && baseStats[val] > 1
                                                  ) {
                                                    const refund =
                                                      baseStats[val] - 1;
                                                    setBaseStats((current) => ({
                                                      ...current,
                                                      [val]: 1,
                                                    }));
                                                    setUnallocatedStatPoints((
                                                      current,
                                                    ) => current + refund);
                                                  }
                                                }}
                                              >
                                                <option value="">
                                                  — Select stat —
                                                </option>
                                                {(perk.requiresStatChoice ?? [])
                                                  .filter(
                                                    (s) =>
                                                      !usedByOthers.includes(
                                                        s as BaseStatKey,
                                                      ) ||
                                                      s === chosenForRank,
                                                  )
                                                  .map((s) => (
                                                    <option key={s} value={s}>
                                                      {statLabelMap[s] ?? s}
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
                                              value={(perkUpgradeNotes[id] ??
                                                [])[ri] ?? ""}
                                              onInput={(e) => {
                                                const value =
                                                  (e.target as HTMLInputElement)
                                                    .value;
                                                setPerkUpgradeNotes(
                                                  (current) => {
                                                    const notes = [
                                                      ...(current[id] ??
                                                        Array(currentRank).fill(
                                                          "",
                                                        )),
                                                    ];
                                                    notes[ri] = value;
                                                    return {
                                                      ...current,
                                                      [id]: notes,
                                                    };
                                                  },
                                                );
                                              }}
                                            />
                                          )}
                                        </div>
                                      );
                                    },
                                  )}
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
                                  value={perkPointChoices[id] ?? ""}
                                  onChange={(e) => {
                                    const val = Number(
                                      (e.target as HTMLSelectElement).value,
                                    );
                                    if (!Number.isNaN(val) && val > 0) {
                                      handlePerkPointChoiceChange(id, val);
                                    }
                                  }}
                                >
                                  <option value="">— Choose —</option>
                                  {Array.from(
                                    {
                                      length: perk.variablePointsGranted.max -
                                        perk.variablePointsGranted.min + 1,
                                    },
                                    (_, i) =>
                                      perk.variablePointsGranted!.min + i,
                                  ).map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            {!isUpgradable && perk?.customInput && (
                              <input
                                type="text"
                                class="mt-1 w-full border rounded px-2 py-1 text-sm"
                                placeholder={perk.customInput}
                                value={perkNotes[id] ?? ""}
                                onInput={(e) => {
                                  const value =
                                    (e.target as HTMLInputElement).value;
                                  setPerkNotes((current) => ({
                                    ...current,
                                    [id]: value,
                                  }));
                                }}
                              />
                            )}
                            {perk?.canDisguise && (
                              <div class="mt-1">
                                <label class="text-xs text-base-content/70">
                                  Disguise as:
                                </label>
                                <select
                                  class="select ml-2 border rounded px-2 py-1 text-sm"
                                  value={perkDisguises[id] ?? ""}
                                  onChange={(e) => {
                                    const value =
                                      (e.target as HTMLSelectElement).value;
                                    setPerkDisguises((current) => {
                                      if (!value) {
                                        const next = { ...current };
                                        delete next[id];
                                        return next;
                                      }
                                      return { ...current, [id]: value };
                                    });
                                  }}
                                >
                                  <option value="">
                                    (no disguise)
                                  </option>
                                  {props.perks
                                    .filter((p) =>
                                      p.id !== id &&
                                      !p.canDisguise &&
                                      !p.isFree
                                    )
                                    .map((p) => (
                                      <option key={p.id} value={p.id}>
                                        {p.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            )}
                            {!isDerived &&
                              perk?.selectablePerkIds !== undefined && (() => {
                                const count = perk.selectablePerksCount ?? 1;
                                return (
                                  <div class="mt-1 space-y-1">
                                    {Array.from({ length: count }, (_, si) => {
                                      const currentSelectionId =
                                        perkSelections[id]?.[si] ?? "";
                                      const otherSelectedIds =
                                        (perkSelections[id] ?? [])
                                          .filter((sel, i) =>
                                            i !== si && Boolean(sel)
                                          );
                                      const candidatePerks = props.perks.filter(
                                        (p) => {
                                          if (
                                            perk.selectablePerkIds!.length >
                                              0 &&
                                            !perk.selectablePerkIds!.includes(
                                              p.id,
                                            )
                                          ) return false;
                                          if (otherSelectedIds.includes(p.id)) {
                                            return false;
                                          }
                                          return true;
                                        },
                                      );
                                      return (
                                        <div
                                          key={si}
                                          class="flex items-center gap-2 flex-wrap"
                                        >
                                          <label class="text-xs text-base-content/70">
                                            {count > 1
                                              ? `Choice ${si + 1}:`
                                              : "Choose perk:"}
                                          </label>
                                          <select
                                            class="select border rounded px-1 py-0.5 text-xs"
                                            value={currentSelectionId}
                                            onChange={(e) => {
                                              const newId =
                                                (e.target as HTMLSelectElement)
                                                  .value;
                                              const oldId =
                                                perkSelections[id]?.[si] ?? "";
                                              const currentArr = [
                                                ...(perkSelections[id] ?? []),
                                              ];
                                              while (currentArr.length <= si) {
                                                currentArr.push("");
                                              }
                                              currentArr[si] = newId;
                                              const newSelections = {
                                                ...perkSelections,
                                                [id]: currentArr,
                                              };
                                              setPerkSelections(newSelections);
                                              let newPerkIds = [...perkIds];
                                              const removedPerkIds: string[] =
                                                [];
                                              const addedPerkIds: string[] = [];
                                              if (oldId && oldId !== newId) {
                                                const withoutOld = newPerkIds
                                                  .filter((pid) =>
                                                    pid !== oldId
                                                  );
                                                const stillDerived =
                                                  getDerivedPerkIds(
                                                    withoutOld,
                                                    newSelections,
                                                    description.faction,
                                                    perkOrigins,
                                                  );
                                                if (!stillDerived.has(oldId)) {
                                                  newPerkIds = withoutOld;
                                                  removedPerkIds.push(oldId);
                                                }
                                              }
                                              if (
                                                newId &&
                                                !newPerkIds.includes(newId)
                                              ) {
                                                newPerkIds = [
                                                  ...newPerkIds,
                                                  newId,
                                                ];
                                                addedPerkIds.push(newId);
                                              }
                                              setPerkIds(newPerkIds);
                                              applyPerkGrantedInventoryChanges(
                                                addedPerkIds,
                                                removedPerkIds,
                                              );
                                            }}
                                          >
                                            <option value="">
                                              — Select perk —
                                            </option>
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
                      })}
                    </ul>
                  </div>
                ))}
                {uncategorizedOwnedPerks.length > 0 && (
                  <div class="space-y-1">
                    <h5 class="font-medium">Other</h5>
                    <ul class="space-y-1">
                      {uncategorizedOwnedPerks.map(({ id }) => {
                        const canRemove = canRemoveOldPerks ||
                          !initialPerkIds.includes(id);
                        return (
                          <li class="flex items-center gap-2" key={id}>
                            <span>{id}</span>
                            {canRemove && (
                              <button
                                type="button"
                                class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
                                onClick={() => unbuyPerk(id)}
                              >
                                Remove
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>

        {eligiblePerks.length > 0 && (
          <div class="space-y-2">
            <button
              type="button"
              class="px-2 py-1 border rounded"
              onClick={() => setShowPerkPicker((current) => !current)}
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
                        (e.target as HTMLSelectElement).value as
                          | PerkCategory
                          | "",
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
                      setPerkSearchFilter(
                        (e.target as HTMLInputElement).value,
                      )}
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
                      {availablePerks.map((perk) => {
                        const cost = calculatePerksCost(
                          [...perkIds, perk.id],
                          perkRanks,
                          perkSelections,
                          description.faction,
                          perkPointChoices,
                          perkOrigins,
                        ) -
                          calculatePerksCost(
                            perkIds,
                            perkRanks,
                            perkSelections,
                            description.faction,
                            perkPointChoices,
                            perkOrigins,
                          );
                        const canAfford =
                          (unallocatedStatPoints - inventoryPointCost) >= cost;
                        const costLabel = cost < 0
                          ? `Unlock (+${-cost} SP)`
                          : cost === 0
                          ? "Unlock (Free)"
                          : `Buy (${cost} SP)`;
                        return (
                          <li
                            class="flex items-center justify-between gap-2"
                            key={perk.id}
                          >
                            <span class="text-sm">
                              <PerkDescription
                                name={perk.name}
                                description={perk.description}
                              />
                            </span>
                            <button
                              type="button"
                              class="px-2 py-1 border rounded disabled:opacity-40"
                              disabled={!canAfford}
                              onClick={() => buyPerk(perk.id)}
                            >
                              {costLabel}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      <InventorySection
        inventory={inventory}
        onChange={setInventory}
        availablePoints={unallocatedStatPoints}
        perkIds={perkIds}
        onLoseWeaponPermanently={(cost) =>
          setUnallocatedStatPoints((current) => current - cost)}
      />

      <Button type="submit">{props.submitLabel}</Button>
    </form>
  );
}
