import { PERK_IDS, validatePerkRequirements } from "@/data/perks.ts";
import { EQUIPMENT_BY_ID } from "@/data/equipment.ts";
import { type CharacterDraft, type Race } from "./character_types.ts";
import {
  hasMultipleCarriedBulkyEquipment,
  parseInventory,
} from "./inventory_types.ts";
import {
  parseBaseStats,
  parseDescription,
  parsePerkDisguises,
  parsePerkIds,
  parsePerkNotes,
  parsePerkOrigins,
  parsePerkPointChoices,
  parsePerkRanks,
  parsePerkSelections,
  parsePerkStatChoices,
  parsePerkUpgradeNotes,
  parseRace,
  validateCharacterProgression,
} from "./characters.ts";
import { validateStatCaps } from "./draft_validation.ts";
import { calculateInventoryPointCostWithPerks } from "@/components/inventory/helpers.ts";

export function parseNonNegativeInt(
  rawValue: FormDataEntryValue | null,
): number | null {
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

export interface ParsedCharacterFields {
  name: string;
  action: string;
  changelog: string;
  race: Race;
  description: NonNullable<ReturnType<typeof parseDescription>>;
  baseStats: NonNullable<ReturnType<typeof parseBaseStats>>;
  perkIds: NonNullable<ReturnType<typeof parsePerkIds>>;
  perkNotes: Record<string, string>;
  perkUpgradeNotes: Record<string, string[]>;
  perkStatChoices: Record<
    string,
    ReturnType<typeof parsePerkStatChoices>[string]
  >;
  perkRanks: Record<string, number>;
  perkDisguises: Record<string, string>;
  perkSelections: Record<string, string[]>;
  perkPointChoices: Record<string, number>;
  perkOrigins: Record<string, import("./character_types.ts").PerkOrigin>;
  factionCompensatedPerkIds: string[];
  unallocatedStatPoints: number;
  basedOnSnapshotId: string;
  pendingImageId: string;
  inventory: ReturnType<typeof parseInventory>;
}

/**
 * Parse and validate the common character form fields from FormData.
 * Returns either the parsed fields or a Response with an error.
 */
export function parseCharacterFormData(
  formData: FormData,
): ParsedCharacterFields | Response {
  const action = String(formData.get("action") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const changelog = String(formData.get("changelog") ?? "").trim();
  const race = parseRace(String(formData.get("race") ?? ""));
  const description = parseDescription(
    String(formData.get("description") ?? "{}"),
  );
  const perkIds = parsePerkIds(String(formData.get("perkIds") ?? ""));
  const baseStats = parseBaseStats(
    String(formData.get("baseStats") ?? ""),
    perkIds ?? undefined,
  );
  const perkNotes = parsePerkNotes(
    String(formData.get("perkNotes") ?? "{}"),
  );
  const perkUpgradeNotes = parsePerkUpgradeNotes(
    String(formData.get("perkUpgradeNotes") ?? "{}"),
  );
  const perkDisguises = parsePerkDisguises(
    String(formData.get("perkDisguises") ?? "{}"),
  );
  const perkOrigins = parsePerkOrigins(
    String(formData.get("perkOrigins") ?? "{}"),
  );
  const perkSelections = parsePerkSelections(
    String(formData.get("perkSelections") ?? "{}"),
  );
  const factionCompensatedPerkIds = parsePerkIds(
    String(formData.get("factionCompensatedPerkIds") ?? "[]"),
  );
  // perkRanks is parsed after perkIds so we can scope it to owned perks
  // perkPointChoices is parsed after perkIds so we can scope values to owned perks with variablePointsGranted
  const perkStatChoices = parsePerkStatChoices(
    String(formData.get("perkStatChoices") ?? "{}"),
  );
  const unallocatedStatPoints = parseNonNegativeInt(
    formData.get("unallocatedStatPoints"),
  );
  const basedOnSnapshotId = String(
    formData.get("basedOnSnapshotId") ?? "",
  ).trim();
  const pendingImageId = String(formData.get("pendingImageId") ?? "").trim();
  const inventory = parseInventory(
    String(formData.get("inventory") ?? "{}"),
  );

  if (!name) {
    return new Response("Name is required.", { status: 400 });
  }

  if (
    !description || !baseStats || !perkIds || !factionCompensatedPerkIds ||
    unallocatedStatPoints === null
  ) {
    return new Response("Invalid character payload.", { status: 400 });
  }

  if (perkIds.some((id) => !PERK_IDS.has(id))) {
    return new Response("Invalid perk id in payload.", { status: 400 });
  }

  const perkRanks = parsePerkRanks(
    String(formData.get("perkRanks") ?? "{}"),
    perkIds,
  );
  const perkPointChoices = parsePerkPointChoices(
    String(formData.get("perkPointChoices") ?? "{}"),
    perkIds,
  );

  return {
    name,
    action,
    changelog,
    race,
    description,
    baseStats,
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
    unallocatedStatPoints,
    basedOnSnapshotId,
    pendingImageId,
    inventory,
  };
}

/**
 * Build a CharacterDraft from parsed form fields and validate progression.
 * Returns either the draft or a Response with an error.
 */
export function buildAndValidateDraft(
  fields: ParsedCharacterFields,
): CharacterDraft | Response {
  const draft: CharacterDraft = {
    name: fields.name,
    race: fields.race,
    description: fields.description,
    baseStats: fields.baseStats,
    unallocatedStatPoints: fields.unallocatedStatPoints,
    perkIds: fields.perkIds,
    perkNotes: fields.perkNotes,
    perkUpgradeNotes: Object.keys(fields.perkUpgradeNotes).length > 0
      ? fields.perkUpgradeNotes
      : undefined,
    perkStatChoices: Object.keys(fields.perkStatChoices).length > 0
      ? fields.perkStatChoices
      : undefined,
    perkRanks: Object.keys(fields.perkRanks).length > 0
      ? fields.perkRanks
      : undefined,
    perkDisguises: Object.keys(fields.perkDisguises).length > 0
      ? fields.perkDisguises
      : undefined,
    perkSelections: Object.keys(fields.perkSelections).length > 0
      ? fields.perkSelections
      : undefined,
    perkPointChoices: Object.keys(fields.perkPointChoices).length > 0
      ? fields.perkPointChoices
      : undefined,
    perkOrigins: Object.fromEntries(
      Object.entries(fields.perkOrigins).filter(([id]) =>
        fields.perkIds.includes(id)
      ),
    ),
    factionCompensatedPerkIds: fields.factionCompensatedPerkIds.filter((id) =>
      fields.perkIds.includes(id)
    ),
    inventory: fields.inventory ?? undefined,
  };

  const progressionError = validateCharacterProgression(draft);
  if (progressionError) {
    return new Response(progressionError, { status: 400 });
  }

  const statCapError = validateStatCaps(draft);
  if (statCapError) {
    return new Response(statCapError, { status: 400 });
  }

  const perkRequirementError = validatePerkRequirements(
    draft.race,
    draft.description.sex,
    draft.perkIds,
    draft.description.faction,
  );
  if (perkRequirementError) {
    return new Response(perkRequirementError, { status: 400 });
  }

  if (
    draft.inventory &&
    hasMultipleCarriedBulkyEquipment(
      draft.inventory,
      (id) => EQUIPMENT_BY_ID.get(id),
    )
  ) {
    return new Response(
      "Only one bulky equipment item can be carried at a time.",
      { status: 400 },
    );
  }

  if (draft.inventory) {
    const inventoryPointCost = calculateInventoryPointCostWithPerks(
      draft.inventory,
      draft.perkIds,
    );
    if (draft.unallocatedStatPoints < inventoryPointCost) {
      return new Response(
        "Not enough stat points to cover inventory costs.",
        { status: 400 },
      );
    }
  }

  return draft;
}
