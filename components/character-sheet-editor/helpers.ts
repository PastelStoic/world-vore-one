import { FACTION_DEFINITIONS_BY_ID } from "@/data/factions.ts";
import {
  BASE_STAT_FIELDS,
  type CharacterDraft,
  type CharacterSheet,
  getStartingStatPoints,
  type PerkOrigin,
} from "@/lib/character_types.ts";
import { calculatePerksCost } from "@/lib/character_parsing.ts";

export function inferInitialPerkState(
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
        initialCharacter.race,
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

/** Grant leftover starting budget so older sheets pick up a raised race allotment. */
export function getStartingBudgetTopUp(
  character: CharacterDraft | CharacterSheet,
  perkOrigins: Record<string, PerkOrigin>,
  factionCompensatedPerkIds: string[],
): number {
  const spentOnStats = BASE_STAT_FIELDS.reduce(
    (total, stat) => total + character.baseStats[stat.key],
    0,
  ) - BASE_STAT_FIELDS.length;
  const spentOnPerks = calculatePerksCost(
    character.perkIds,
    character.perkRanks,
    character.perkSelections,
    character.description.faction,
    character.perkPointChoices,
    perkOrigins,
    character.race,
  );
  const totalUsed = spentOnStats + spentOnPerks +
    character.unallocatedStatPoints;
  const totalAvailable = getStartingStatPoints(character.race) +
    (FACTION_DEFINITIONS_BY_ID.get(character.description.faction)
      ?.grantsStatPoints ?? 0) +
    factionCompensatedPerkIds.length * 2;
  return Math.max(0, totalAvailable - totalUsed);
}
