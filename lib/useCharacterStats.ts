import { useMemo, useState } from "preact/hooks";
import type { CharacterDraft } from "./character_types.ts";
import {
  calculateEffectiveCarryCapacity,
  calculateEffectiveCharisma,
  calculateEffectiveConstitution,
  calculateEffectiveDexterity,
  calculateEffectiveDigestionResilience,
  calculateEffectiveDigestionStrength,
  calculateEffectiveEscapeTraining,
  calculateEffectiveIntelligence,
  calculateEffectiveStrength,
  calculateEncumbranceLevel,
  type EncumbranceLevel,
} from "./stat_calculations.ts";

export interface CharacterStatsResult {
  carriedWeight: number;
  setCarriedWeight: (weight: number) => void;
  carryCapacity: number;
  encumbranceLevel: EncumbranceLevel;
  encumbrancePenaltyText: string;
  effectiveByStat: Record<string, number>;
}

/**
 * Shared hook for computing effective stats, carry capacity, and encumbrance.
 * Used by both CharacterSheetEditor and CharacterSheetViewer.
 */
export function useCharacterStats(draft: CharacterDraft): CharacterStatsResult {
  const [carriedWeight, setCarriedWeight] = useState(0);

  const carryCapacity = calculateEffectiveCarryCapacity(draft);
  const encumbranceLevel = calculateEncumbranceLevel(
    carryCapacity,
    carriedWeight,
  );
  const encumbrancePenaltyText = encumbranceLevel > 0
    ? `-${encumbranceLevel} STR / -${encumbranceLevel} DEX`
    : "No STR/DEX penalty";

  const effectiveByStat = useMemo(() => {
    return {
      strength: calculateEffectiveStrength(draft, { encumbranceLevel }),
      dexterity: calculateEffectiveDexterity(draft, { encumbranceLevel }),
      constitution: calculateEffectiveConstitution(draft),
      intelligence: calculateEffectiveIntelligence(draft),
      charisma: calculateEffectiveCharisma(draft),
      escapeTraining: calculateEffectiveEscapeTraining(draft),
      digestionStrength: calculateEffectiveDigestionStrength(draft),
      digestionResilience: calculateEffectiveDigestionResilience(draft),
    };
  }, [draft, encumbranceLevel]);

  return {
    carriedWeight,
    setCarriedWeight,
    carryCapacity,
    encumbranceLevel,
    encumbrancePenaltyText,
    effectiveByStat,
  };
}
