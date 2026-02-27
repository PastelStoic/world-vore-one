import { PERK_IDS } from "../data/perks.ts";
import {
  type CharacterDraft,
  type Race,
} from "./character_types.ts";
import {
  parseBaseStats,
  parseDescription,
  parsePerkIds,
  parseRace,
  validateCharacterProgression,
} from "./characters.ts";

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
  unallocatedStatPoints: number;
  basedOnSnapshotId: string;
  pendingImageId: string;
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
  const baseStats = parseBaseStats(String(formData.get("baseStats") ?? ""));
  const perkIds = parsePerkIds(String(formData.get("perkIds") ?? ""));
  const unallocatedStatPoints = parseNonNegativeInt(
    formData.get("unallocatedStatPoints"),
  );
  const basedOnSnapshotId = String(
    formData.get("basedOnSnapshotId") ?? "",
  ).trim();
  const pendingImageId = String(formData.get("pendingImageId") ?? "").trim();

  if (!name) {
    return new Response("Name is required.", { status: 400 });
  }

  if (
    !description || !baseStats || !perkIds || unallocatedStatPoints === null
  ) {
    return new Response("Invalid character payload.", { status: 400 });
  }

  if (perkIds.some((id) => !PERK_IDS.has(id))) {
    return new Response("Invalid perk id in payload.", { status: 400 });
  }

  return {
    name,
    action,
    changelog,
    race,
    description,
    baseStats,
    perkIds,
    unallocatedStatPoints,
    basedOnSnapshotId,
    pendingImageId,
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
  };

  const progressionError = validateCharacterProgression(draft);
  if (progressionError) {
    return new Response(progressionError, { status: 400 });
  }

  return draft;
}
