import { useMemo, useState } from "preact/hooks";
import type { CharacterDraft } from "./character_types.ts";
import {
  WEAPONS_BY_ID,
  EQUIPMENT_BY_ID,
  ATTACHMENTS_BY_ID,
  MELEE_WEAPONS_BY_ID,
} from "@/data/equipment.ts";
import {
  calculateInventoryWeight,
  createEmptyInventory,
} from "./inventory_types.ts";
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

const weightLookups = {
  getWeapon: (id: string) => WEAPONS_BY_ID.get(id),
  getMeleeWeapon: (id: string) => MELEE_WEAPONS_BY_ID.get(id),
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

export interface CharacterStatsResult {
  carriedWeight: number;
  setCarriedWeight: (weight: number) => void;
  inventoryWeight: number;
  carryCapacity: number;
  encumbranceLevel: EncumbranceLevel;
  encumbrancePenaltyText: string;
  effectiveByStat: Record<string, number>;
}

/**
 * Shared hook for computing effective stats, carry capacity, and encumbrance.
 * Used by both CharacterSheetEditor and CharacterSheetViewer.
 *
 * `inventoryWeight` is the minimum carried weight from equipped items.
 * `carriedWeight` can be set higher for extra gear but never below `inventoryWeight`.
 */
export function useCharacterStats(draft: CharacterDraft): CharacterStatsResult {
  const inv = draft.inventory ?? createEmptyInventory();
  const inventoryWeight = calculateInventoryWeight(inv, weightLookups);

  const [extraWeight, setExtraWeight] = useState(0);
  const carriedWeight = inventoryWeight + extraWeight;

  function setCarriedWeight(weight: number) {
    // Clamp so carried weight never goes below inventory weight
    setExtraWeight(Math.max(0, weight - inventoryWeight));
  }

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
    inventoryWeight,
    carryCapacity,
    encumbranceLevel,
    encumbrancePenaltyText,
    effectiveByStat,
  };
}
