import { useMemo, useState } from "preact/hooks";
import { PERK_CATEGORY_ORDER, PERKS_BY_ID } from "@/data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDescription,
  type CharacterDraft,
  FACTIONS,
  getDisplayedRaceName,
  getRacesForSex,
  getStartingStatPoints,
  isRaceValidForSex,
  mapRaceForSex,
  type PerkOrigin,
  type Sex,
} from "@/lib/character_types.ts";
import {
  canSelectFaction,
  FACTION_DEFINITIONS_BY_ID,
} from "@/data/factions.ts";
import {
  calculatePerksCost,
  getDerivedPerkIds,
} from "@/lib/character_parsing.ts";
import {
  getPerkAvailability,
  getStatFloor as getSharedStatFloor,
} from "@/lib/draft_validation.ts";
import { useCharacterStats } from "@/lib/useCharacterStats.ts";
import { getStatCap } from "@/lib/stat_calculations.ts";
import {
  cleanupPerkData,
  normalizeCharacterPerkIds,
} from "@/lib/perk_state_helpers.ts";
import { useImageUpload } from "@/lib/useImageUpload.ts";
import type { CharacterInventory } from "@/lib/inventory_types.ts";
import { createEmptyInventory } from "@/lib/inventory_types.ts";
import { calculateInventoryPointCostWithPerks } from "@/components/inventory/helpers.ts";
import { applyPerkGrantedInventory } from "@/lib/perk_grant_inventory.ts";
import { inferInitialPerkState } from "./helpers.ts";
import type { CharacterSheetEditorProps, ListedPerk } from "./types.ts";

export function useCharacterSheetEditor(props: CharacterSheetEditorProps) {
  const [initialCharacter] = useState(() => {
    const normalized = normalizeCharacterPerkIds(props.initialCharacter);
    const sex = normalized.description.sex;
    if (isRaceValidForSex(normalized.race, sex)) return normalized;
    return { ...normalized, race: mapRaceForSex(normalized.race, sex) };
  });
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
  const ownedPerkEntries = perkIds.map((id) => ({
    id,
    perk: PERKS_BY_ID.get(id),
  }));
  const ownedPerks = ownedPerkEntries.flatMap(({ perk }) => perk ? [perk] : []);
  const ownedPerkGroups = PERK_CATEGORY_ORDER
    .map((category) => ({
      category,
      items: ownedPerks.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);
  const uncategorizedOwnedPerks = ownedPerkEntries.filter(({ perk }) => !perk);

  const perkEligibilityCtx = {
    race,
    sex: description.sex,
    faction: description.faction,
    isTemplate: description.isTemplate,
    ownedPerkIds: perkIds,
    derivedPerkIds,
    accountPerkCounts,
    isModerator: props.isModerator,
    perkDisguises,
  };
  const listedPerks: ListedPerk[] = props.perks.flatMap((perk) => {
    const availability = getPerkAvailability(perk, perkEligibilityCtx);
    if (availability.status === "hidden") return [];
    return [{ perk, availability }];
  });

  const availableFactions = useMemo(
    () =>
      FACTIONS.filter((faction) =>
        canSelectFaction(faction, { isModerator: props.isModerator }) ||
        faction === description.faction
      ),
    [description.faction, props.isModerator],
  );
  const displayedRaceName = getDisplayedRaceName(
    race,
    ownedPerks,
  );

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

  /** Change race, refunding race-gated perks and adjusting starting stat points. */
  function changeRace(newRace: CharacterDraft["race"]) {
    if (newRace === race) return;
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
      Object.entries(perkRanks).filter(([id]) => keptPerkIds.includes(id)),
    );
    const perkRefund = calculatePerksCost(
      perkIds,
      perkRanks,
      perkSelections,
      description.faction,
      perkPointChoices,
      perkOrigins,
      race,
    ) -
      calculatePerksCost(
        keptPerkIds,
        keptRanks,
        perkSelections,
        description.faction,
        perkPointChoices,
        withoutRemovedOrigins(
          perkIds.filter((id) => !keptPerkIds.includes(id)),
        ),
        newRace,
      );
    if (keptPerkIds.length !== perkIds.length) {
      const removedIds = perkIds.filter((id) => !keptPerkIds.includes(id));
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
      setFactionCompensatedPerkIds(withoutRemovedCompensations(removedIds));
      setPerkIds(keptPerkIds);
    }
    setRace(newRace);
    setUnallocatedStatPoints((current) => current + pointsDiff + perkRefund);
  }

  function handleSexChange(newSex: Sex) {
    if (newSex === description.sex) return;
    updateDescription("sex", newSex);
    // Remap gendered race (Pilzherr↔Pilzfraun, Tierherr↔Tierfraun) to match sex
    const remapped = mapRaceForSex(race, newSex);
    const allowed = getRacesForSex(newSex);
    const nextRace = allowed.includes(remapped) ? remapped : allowed[0];
    changeRace(nextRace);
  }

  function handleFactionChange(newFaction: string) {
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
      (id) => oldGranted.includes(id) && !newGranted.includes(id),
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
    const toAdd = newGranted.filter((id) => !perkIds.includes(id));

    let updatedPerkIds = perkIds.filter((id) => !toRemove.includes(id));
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
      ((newlyCompensated.length - removedCompensated.length) * 2);

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
            .filter((item) => !toRemove.includes(item.perkGranted ?? ""));
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
      setUnallocatedStatPoints((current) => current + pointsDelta);
    }
  }

  const racesForCurrentSex = getRacesForSex(description.sex);

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
    setInventory((inv) =>
      applyPerkGrantedInventory(inv, addedPerkIds, removedPerkIds)
    );
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

    const perk = PERKS_BY_ID.get(perkId);
    if (!perk || perk.deprecated) return;
    const availability = getPerkAvailability(perk, perkEligibilityCtx);
    if (availability.status === "blocked") {
      return;
    }
    if (availability.status !== "available") {
      return;
    }
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
      race,
    ) -
      calculatePerksCost(
        perkIds,
        perkRanks,
        perkSelections,
        description.faction,
        perkPointChoices,
        perkOrigins,
        race,
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

    applyPerkGrantedInventoryChanges([perkId, ...includedIds], []);
  }

  function unbuyPerk(perkId: string) {
    const perkDef = PERKS_BY_ID.get(perkId);
    // Unknown or deprecated perks can always be removed (migration path)
    const isForceRemovable = !perkDef || !!perkDef.deprecated;
    if (
      !isForceRemovable && !canRemoveOldPerks && initialPerkIds.includes(perkId)
    ) {
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
    const perk = PERKS_BY_ID.get(perkId);
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
      race,
    ) -
      calculatePerksCost(
        newPerkIds,
        perkRanks,
        selectionsWithoutSource,
        description.faction,
        perkPointChoices,
        perkOrigins,
        race,
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

    setInventory((inv) => {
      const next = applyPerkGrantedInventory(inv, [], allRemovedIds);
      if (!allRemovedIds.includes("signature-weapon")) return next;
      for (const location of ["carried", "stowed"] as const) {
        for (const w of next[location].weapons) w.isSignatureWeapon = false;
        for (const mw of next[location].meleeWeapons) {
          mw.isSignatureWeapon = false;
        }
      }
      return next;
    });
  }

  function handlePerkPointChoiceChange(perkId: string, value: number) {
    const oldValue = perkPointChoices[perkId] ?? 0;
    const delta = value - oldValue;
    setPerkPointChoices((current) => ({ ...current, [perkId]: value }));
    setUnallocatedStatPoints((current) => current + delta);
  }

  function handlePerkStatChoiceChange(
    perkId: string,
    rankIndex: number,
    val: BaseStatKey,
  ) {
    const currentRank = perkRanks[perkId] ?? 1;
    setPerkStatChoices((current) => {
      const choices = [
        ...(current[perkId] ?? Array(currentRank).fill("" as BaseStatKey)),
      ];
      choices[rankIndex] = val;
      return { ...current, [perkId]: choices };
    });
    // Enforce stat cap: refund base stat points above 1
    if (val && baseStats[val] > 1) {
      const refund = baseStats[val] - 1;
      setBaseStats((current) => ({ ...current, [val]: 1 }));
      setUnallocatedStatPoints((current) => current + refund);
    }
  }

  function handlePerkUpgradeNoteChange(
    perkId: string,
    rankIndex: number,
    value: string,
  ) {
    const currentRank = perkRanks[perkId] ?? 1;
    setPerkUpgradeNotes((current) => {
      const notes = [
        ...(current[perkId] ?? Array(currentRank).fill("")),
      ];
      notes[rankIndex] = value;
      return { ...current, [perkId]: notes };
    });
  }

  function handlePerkNoteChange(perkId: string, value: string) {
    setPerkNotes((current) => ({ ...current, [perkId]: value }));
  }

  function handlePerkDisguiseChange(perkId: string, value: string) {
    setPerkDisguises((current) => {
      if (!value) {
        const next = { ...current };
        delete next[perkId];
        return next;
      }
      return { ...current, [perkId]: value };
    });
  }

  function handlePerkSelectionChange(
    perkId: string,
    slotIndex: number,
    newId: string,
  ) {
    const oldId = perkSelections[perkId]?.[slotIndex] ?? "";
    const currentArr = [...(perkSelections[perkId] ?? [])];
    while (currentArr.length <= slotIndex) {
      currentArr.push("");
    }
    currentArr[slotIndex] = newId;
    const newSelections = {
      ...perkSelections,
      [perkId]: currentArr,
    };
    setPerkSelections(newSelections);
    let newPerkIds = [...perkIds];
    const removedPerkIds: string[] = [];
    const addedPerkIds: string[] = [];
    if (oldId && oldId !== newId) {
      const withoutOld = newPerkIds.filter((pid) => pid !== oldId);
      const stillDerived = getDerivedPerkIds(
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
    if (newId && !newPerkIds.includes(newId)) {
      newPerkIds = [...newPerkIds, newId];
      addedPerkIds.push(newId);
    }
    setPerkIds(newPerkIds);
    applyPerkGrantedInventoryChanges(addedPerkIds, removedPerkIds);
  }

  function upgradePerk(perkId: string) {
    const perk = PERKS_BY_ID.get(perkId);
    if (!perk?.upgradable || perk.deprecated) return;
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
      race,
    ) -
      calculatePerksCost(
        perkIds,
        perkRanks,
        perkSelections,
        description.faction,
        perkPointChoices,
        perkOrigins,
        race,
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
    const perk = PERKS_BY_ID.get(perkId);
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
      race,
    ) -
      calculatePerksCost(
        perkIds,
        newRanks,
        perkSelections,
        description.faction,
        perkPointChoices,
        perkOrigins,
        race,
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

  return {
    name,
    setName,
    race,
    description,
    updateDescription,
    handleSexChange,
    changeRace,
    handleFactionChange,
    racesForCurrentSex,
    displayedRaceName,
    availableFactions,
    lockIdentityFields,

    currentImageUrl,
    pendingImageId,
    imageUploading,
    imageError,
    fileInputRef,
    handleImageUpload,
    handleImageDelete,

    baseStats,
    unallocatedStatPoints,
    setUnallocatedStatPoints,
    inventoryPointCost,
    statCaps,
    getStatFloor,
    increaseStat,
    decreaseStat,
    effectiveByStat,

    draft,
    carriedWeight,
    setCarriedWeight,
    inventoryWeight,
    carryCapacity,
    encumbranceLevel,
    encumbrancePenaltyText,

    perkIds,
    perkNotes,
    perkUpgradeNotes,
    perkStatChoices,
    perkRanks,
    perkDisguises,
    perkSelections,
    perkPointChoices,
    perkOrigins,
    factionCompensatedPerkIds,
    ownedPerks,
    ownedPerkGroups,
    uncategorizedOwnedPerks,
    derivedPerkIds,
    listedPerks,
    allPerks: props.perks,
    initialPerkIds,
    initialPerkRanks,
    canRemoveOldPerks,
    buyPerk,
    unbuyPerk,
    upgradePerk,
    downgradePerk,
    handlePerkPointChoiceChange,
    handlePerkStatChoiceChange,
    handlePerkUpgradeNoteChange,
    handlePerkNoteChange,
    handlePerkDisguiseChange,
    handlePerkSelectionChange,

    inventory,
    setInventory,
    changelog,
    setChangelog,
  };
}
