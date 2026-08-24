/**
 * Unit tests for character form draft validation.
 * Run: deno test -A lib/form_helpers_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import {
  createDefaultCharacterDraft,
  createDefaultDescription,
} from "./character_types.ts";
import { createEmptyInventory } from "./inventory_types.ts";
import {
  buildAndValidateDraft,
  type ParsedCharacterFields,
} from "./form_helpers.ts";

function fields(
  overrides: Partial<ParsedCharacterFields> = {},
): ParsedCharacterFields {
  const draft = createDefaultCharacterDraft();
  return {
    name: "Test",
    action: "create",
    changelog: "Initial creation",
    race: draft.race,
    description: draft.description,
    baseStats: draft.baseStats,
    perkIds: [],
    perkNotes: {},
    perkUpgradeNotes: {},
    perkStatChoices: {},
    perkRanks: {},
    perkDisguises: {},
    perkSelections: {},
    perkPointChoices: {},
    perkOrigins: {},
    factionCompensatedPerkIds: [],
    unallocatedStatPoints: draft.unallocatedStatPoints,
    basedOnSnapshotId: "",
    pendingImageId: "",
    inventory: createEmptyInventory(),
    ...overrides,
  };
}

Deno.test("buildAndValidateDraft accepts the default create draft", () => {
  const result = buildAndValidateDraft(fields());
  assertEquals(result instanceof Response, false);
});

Deno.test("buildAndValidateDraft rejects spy disguised as a faction perk", async () => {
  const result = buildAndValidateDraft(fields({
    perkIds: ["spy"],
    perkDisguises: { spy: "sturmtruppen" },
  }));
  assertEquals(result instanceof Response, true);
  assertEquals(
    await (result as Response).text(),
    'Perk "Spy" can only be disguised as a Combat, Vore, or Gimmick perk.',
  );
});

Deno.test("buildAndValidateDraft rejects spy disguised as an owned perk", async () => {
  const result = buildAndValidateDraft(fields({
    perkIds: ["spy", "runner"],
    perkDisguises: { spy: "runner" },
  }));
  assertEquals(result instanceof Response, true);
  assertEquals(
    await (result as Response).text(),
    'Perk "Spy" cannot be disguised as "Runner", which this character already has. Choose a different disguise first.',
  );
});

Deno.test("buildAndValidateDraft accepts spy disguised as an unowned combat perk", () => {
  const result = buildAndValidateDraft(fields({
    perkIds: ["spy"],
    perkDisguises: { spy: "runner" },
  }));
  assertEquals(result instanceof Response, false);
});

Deno.test("buildAndValidateDraft rejects a male Pilzfraun", async () => {
  const result = buildAndValidateDraft(fields({
    race: "Pilzfraun",
    description: { ...createDefaultDescription(), sex: "Male" },
  }));
  assertEquals(result instanceof Response, true);
  assertEquals(
    await (result as Response).text(),
    'Race "Pilzfraun" is not valid for sex "Male".',
  );
});
