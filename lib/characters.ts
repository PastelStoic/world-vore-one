// ---------------------------------------------------------------------------
// Characters  barrel file re-exporting database and parsing modules
// ---------------------------------------------------------------------------

export {
  deleteCharacter,
  getCharacter,
  getCharacterSnapshot,
  listCharacters,
  listCharacterSnapshots,
  setCharacterHidden,
  setCharacterImageId,
  setCharacterStatus,
  updateCharacterInventory,
  upsertCharacter,
  upsertCharacterDirect,
} from "./character_db.ts";

export {
  calculatePerksCost,
  getDerivedPerkIds,
  parseBaseStats,
  parseDescription,
  parsePerkDisguises,
  parsePerkIds,
  parsePerkNotes,
  parsePerkPointChoices,
  parsePerkRanks,
  parsePerkSelections,
  parsePerkStatChoices,
  parsePerkUpgradeNotes,
  parseRace,
  validateCharacterProgression,
} from "./character_parsing.ts";

export {
  getStatFloor,
  isPerkEligible,
  type PerkEligibilityContext,
  validateStatCaps,
} from "./draft_validation.ts";

export {
  type CharacterDescription,
  type CharacterDraft,
  type CharacterSheet,
  type CharacterSnapshot,
  createDefaultCharacterDraft,
  createDefaultDescription,
} from "./character_types.ts";
