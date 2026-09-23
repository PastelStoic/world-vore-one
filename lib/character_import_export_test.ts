/**
 * Unit tests for character sheet JSON import/export.
 * Run: deno test -A lib/character_import_export_test.ts
 */

import { assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { createDefaultCharacterDraft } from "./character_types.ts";
import {
  filenameForCharacterExport,
  parseAndValidateCharacterJson,
  serializeCharacterDraft,
  toExportableDraft,
  unwrapDraftPayload,
} from "./character_import_export.ts";

Deno.test("filenameForCharacterExport slugifies the name", () => {
  assertEquals(filenameForCharacterExport("Ada Lovelace"), "ada-lovelace.json");
  assertEquals(filenameForCharacterExport("  "), "character.json");
  assertEquals(
    filenameForCharacterExport("Hans!! Müller"),
    "hans-m-ller.json",
  );
});

Deno.test("serialize + parse round-trips a default draft", () => {
  const draft = createDefaultCharacterDraft();
  draft.name = "Round Trip";
  const json = serializeCharacterDraft(draft);
  const result = parseAndValidateCharacterJson(json);
  assertEquals(result instanceof Response, false);
  if (result instanceof Response) return;
  assertEquals(result.name, "Round Trip");
  assertEquals(result.race, draft.race);
  assertEquals(result.baseStats, draft.baseStats);
  assertEquals(result.unallocatedStatPoints, draft.unallocatedStatPoints);
});

Deno.test("parse rejects invalid JSON text", async () => {
  const result = parseAndValidateCharacterJson("{not json");
  assertEquals(result instanceof Response, true);
  assertEquals(await (result as Response).text(), "Invalid JSON file.");
});

Deno.test("parse rejects missing name", async () => {
  const draft = createDefaultCharacterDraft();
  const json = serializeCharacterDraft(draft); // name is ""
  const result = parseAndValidateCharacterJson(json);
  assertEquals(result instanceof Response, true);
  assertEquals(await (result as Response).text(), "Name is required.");
});

Deno.test("parse strips server-only fields and still creates from a sheet-shaped object", () => {
  const draft = createDefaultCharacterDraft();
  draft.name = "Imported Sheet";
  const sheetShaped = {
    ...toExportableDraft(draft),
    id: "should-be-ignored",
    userId: "someone-else",
    status: "approved",
    imageId: "img-1",
    createdAt: "2000-01-01T00:00:00.000Z",
    updatedAt: "2000-01-01T00:00:00.000Z",
    latestSnapshotId: "snap-1",
  };
  const result = parseAndValidateCharacterJson(JSON.stringify(sheetShaped));
  assertEquals(result instanceof Response, false);
  if (result instanceof Response) return;
  assertEquals(result.name, "Imported Sheet");
  assertEquals("id" in result, false);
  assertEquals("userId" in result, false);
});

Deno.test("parse accepts snapshot-shaped { data: draft }", () => {
  const draft = createDefaultCharacterDraft();
  draft.name = "From Snapshot";
  const result = parseAndValidateCharacterJson(
    JSON.stringify({ data: toExportableDraft(draft), snapshotId: "x" }),
  );
  assertEquals(result instanceof Response, false);
  if (result instanceof Response) return;
  assertEquals(result.name, "From Snapshot");
});

Deno.test("unwrapDraftPayload ignores non-objects", () => {
  assertEquals(unwrapDraftPayload(null), null);
  assertEquals(unwrapDraftPayload([]), null);
});

Deno.test("parse rejects invalid perk id", async () => {
  const draft = createDefaultCharacterDraft();
  draft.name = "Bad Perk";
  const payload = {
    ...toExportableDraft(draft),
    perkIds: ["not-a-real-perk-id"],
  };
  const result = parseAndValidateCharacterJson(JSON.stringify(payload));
  assertEquals(result instanceof Response, true);
  assertStringIncludes(
    await (result as Response).text(),
    "Invalid perk id",
  );
});
