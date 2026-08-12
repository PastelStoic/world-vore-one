// ---------------------------------------------------------------------------
// Characters barrel – SERVER ROUTES ONLY
// ---------------------------------------------------------------------------
// This re-exports character_db (Postgres/drizzle). In Vite dev, barrel imports
// are not tree-shaken, so importing this from an island pulls `postgres` and
// `node:os` into the browser and breaks client JS (including form handlers).
//
// Islands / components must import client-safe modules directly, e.g.:
//   character_parsing.ts, character_types.ts, draft_validation.ts
// ---------------------------------------------------------------------------

export {
  deleteCharacter,
  getCharacter,
  getCharacterSnapshot,
  getUserPerkCharacterCounts,
  listCharacters,
  listCharacterSnapshots,
  replacePerkAcrossCharacters,
  setCharacterHidden,
  setCharacterImageId,
  setCharacterStatus,
  updateCharacterInventory,
  upsertCharacter,
  upsertCharacterDirect,
  validateAccountLimitedPerksForUser,
} from "./character_db.ts";

export {
  calculatePerksCost,
  getDerivedPerkIds,
  getFactionPerkCompensation,
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
} from "./character_parsing.ts";

export {
  getPerkAvailability,
  getStatFloor,
  isPerkEligible,
  type PerkAvailability,
  type PerkAvailabilityStatus,
  type PerkEligibilityContext,
  validatePerkRequirements,
  validateStatCaps,
} from "./draft_validation.ts";

export {
  type CharacterDescription,
  type CharacterDraft,
  type CharacterSheet,
  type CharacterSnapshot,
  createDefaultCharacterDraft,
  createDefaultDescription,
  type PerkOrigin,
} from "./character_types.ts";
