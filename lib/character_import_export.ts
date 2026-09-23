// ---------------------------------------------------------------------------
// Character sheet JSON import / export
// ---------------------------------------------------------------------------
// Reuses form_helpers parsers/validators — no separate schema.
// Export is CharacterDraft only (no id/userId/image/status).
// Import always creates a new sheet for the current user.

import type { CharacterDraft } from "./character_types.ts";
import { createEmptyInventory } from "./inventory_types.ts";
import {
  buildAndValidateDraft,
  parseCharacterFormData,
  type ParsedCharacterFields,
} from "./form_helpers.ts";

const SERVER_ONLY_KEYS = new Set([
  "id",
  "userId",
  "latestSnapshotId",
  "imageId",
  "hidden",
  "status",
  "createdAt",
  "updatedAt",
  "snapshotId",
  "characterId",
  "timestamp",
  "changelog",
  "basedOnSnapshotId",
]);

/** Build a plain CharacterDraft object suitable for JSON download. */
export function toExportableDraft(draft: CharacterDraft): CharacterDraft {
  const inventory = draft.inventory ?? createEmptyInventory();
  return {
    name: draft.name,
    race: draft.race,
    description: draft.description,
    baseStats: draft.baseStats,
    unallocatedStatPoints: draft.unallocatedStatPoints,
    perkIds: draft.perkIds,
    perkNotes: draft.perkNotes ?? {},
    perkUpgradeNotes: draft.perkUpgradeNotes,
    perkStatChoices: draft.perkStatChoices,
    perkRanks: draft.perkRanks,
    perkDisguises: draft.perkDisguises,
    perkSelections: draft.perkSelections,
    perkPointChoices: draft.perkPointChoices,
    perkOrigins: draft.perkOrigins,
    factionCompensatedPerkIds: draft.factionCompensatedPerkIds,
    inventory,
  };
}

/** Pretty-printed JSON for download. */
export function serializeCharacterDraft(draft: CharacterDraft): string {
  return `${JSON.stringify(toExportableDraft(draft), null, 2)}\n`;
}

/** Sensible download filename from character name. */
export function filenameForCharacterExport(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "character"}.json`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Accept a raw CharacterDraft, a full CharacterSheet, or a snapshot
 * `{ data: CharacterDraft }`. Server-only fields are ignored.
 */
export function unwrapDraftPayload(
  parsed: unknown,
): Record<string, unknown> | null {
  if (!isRecord(parsed)) return null;

  if (isRecord(parsed.data)) {
    return parsed.data;
  }

  // Ignore accidental wrappers like { character: {...} }
  if (isRecord(parsed.character) && typeof parsed.character.name === "string") {
    return parsed.character;
  }

  return parsed;
}

function jsonField(value: unknown, fallback: string): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") {
    // Already serialized JSON string — pass through if it parses as object/array
    try {
      const inner = JSON.parse(value);
      if (typeof inner === "object" && inner !== null) return value;
    } catch {
      // treat as plain string below
    }
  }
  return JSON.stringify(value);
}

/**
 * Convert an untrusted JSON object into ParsedCharacterFields via the same
 * FormData parsers used by create/update, then validate with buildAndValidateDraft.
 */
export function parseAndValidateCharacterJson(
  rawText: string,
  options: { isAdmin?: boolean } = {},
): CharacterDraft | Response {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return new Response("Invalid JSON file.", { status: 400 });
  }

  const payload = unwrapDraftPayload(parsed);
  if (!payload) {
    return new Response("JSON must be a character sheet object.", {
      status: 400,
    });
  }

  // Drop server-only keys so they cannot influence ownership/identity.
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (!SERVER_ONLY_KEYS.has(key)) cleaned[key] = value;
  }

  const formData = new FormData();
  formData.set("action", "create");
  formData.set("changelog", "Imported from JSON");
  formData.set("name", String(cleaned.name ?? "").trim());
  formData.set("race", String(cleaned.race ?? ""));
  formData.set("description", jsonField(cleaned.description, "{}"));
  formData.set("baseStats", jsonField(cleaned.baseStats, ""));
  formData.set("perkIds", jsonField(cleaned.perkIds, "[]"));
  formData.set("perkNotes", jsonField(cleaned.perkNotes, "{}"));
  formData.set("perkUpgradeNotes", jsonField(cleaned.perkUpgradeNotes, "{}"));
  formData.set("perkStatChoices", jsonField(cleaned.perkStatChoices, "{}"));
  formData.set("perkRanks", jsonField(cleaned.perkRanks, "{}"));
  formData.set("perkDisguises", jsonField(cleaned.perkDisguises, "{}"));
  formData.set("perkSelections", jsonField(cleaned.perkSelections, "{}"));
  formData.set("perkPointChoices", jsonField(cleaned.perkPointChoices, "{}"));
  formData.set("perkOrigins", jsonField(cleaned.perkOrigins, "{}"));
  formData.set(
    "factionCompensatedPerkIds",
    jsonField(cleaned.factionCompensatedPerkIds, "[]"),
  );
  formData.set("inventory", jsonField(cleaned.inventory, "{}"));
  formData.set(
    "unallocatedStatPoints",
    cleaned.unallocatedStatPoints === undefined ||
      cleaned.unallocatedStatPoints === null
      ? ""
      : String(cleaned.unallocatedStatPoints),
  );

  const fields = parseCharacterFormData(formData);
  if (fields instanceof Response) return fields;

  const withAdmin: ParsedCharacterFields = {
    ...fields,
    isAdmin: options.isAdmin,
  };
  return buildAndValidateDraft(withAdmin);
}
