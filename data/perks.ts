import type { BaseStatKey, Faction, Race } from "../lib/character_types.ts";
import { COMBAT_PERKS } from "./perks/combat.ts";
import { VORE_PERKS } from "./perks/vore.ts";
import { SMUT_PERKS } from "./perks/smut.ts";
import { GIMMICK_PERKS } from "./perks/gimmick.ts";
import { PF_TYPE_PERKS } from "./perks/pf-type.ts";
import { FACTION_PERKS } from "./perks/faction.ts";
import { NEGATIVE_PERKS } from "./perks/negative.ts";

export type PerkCategory =
  | "combat"
  | "vore"
  | "smut"
  | "gimmick"
  | "pf-type"
  | "faction"
  | "negative";

export const PERK_CATEGORY_ORDER: PerkCategory[] = [
  "combat",
  "vore",
  "smut",
  "gimmick",
  "pf-type",
  "faction",
  "negative",
];

export const PERK_CATEGORY_LABELS: Record<PerkCategory, string> = {
  combat: "Combat",
  vore: "Vore",
  smut: "Smut",
  gimmick: "Gimmick",
  "pf-type": "PF Type",
  faction: "Faction",
  negative: "Negative",
};

interface PerkModifiers {
  baseStatBonuses?: Partial<Record<BaseStatKey, number>>;
  healthMultiplier?: number;
  carryCapacityMultiplier?: number;
  organCapacityMultiplier?: number;
}

export interface PerkDefinition {
  id: string;
  name: string;
  category: PerkCategory;
  description: string;
  modifiers?: PerkModifiers;
  requiredRaces?: Race[];
  requiredFaction?: Faction;
  lockCategory?: string;
}

export const PERKS: PerkDefinition[] = [
  ...COMBAT_PERKS,
  ...VORE_PERKS,
  ...SMUT_PERKS,
  ...GIMMICK_PERKS,
  ...PF_TYPE_PERKS,
  ...FACTION_PERKS,
  ...NEGATIVE_PERKS,
];

export const PERKS_BY_ID = new Map(PERKS.map((perk) => [perk.id, perk]));
export const PERK_IDS = new Set(PERKS.map((perk) => perk.id));

export function validatePerkRequirements(
  race: Race,
  perkIds: string[],
): string | null {
  const selectedByLockCategory = new Map<string, string>();

  for (const perkId of perkIds) {
    const perk = PERKS_BY_ID.get(perkId);
    if (!perk) {
      return "Invalid perk id in payload.";
    }

    if (perk.requiredRaces && !perk.requiredRaces.includes(race)) {
      return `Perk "${perk.name}" requires one of: ${perk.requiredRaces.join(", ")}.`;
    }

    if (perk.lockCategory) {
      const lockedByPerkName = selectedByLockCategory.get(perk.lockCategory);
      if (lockedByPerkName && lockedByPerkName !== perk.name) {
        return `Perk "${perk.name}" cannot be combined with "${lockedByPerkName}".`;
      }
      selectedByLockCategory.set(perk.lockCategory, perk.name);
    }
  }

  return null;
}
