import {
  deleteCharacter,
  getCharacter,
  setCharacterHidden,
  setCharacterStatus,
} from "./character_db.ts";
import type { CharacterSheet } from "./character_types.ts";

export type CharacterAdminAction =
  | "approve"
  | "disapprove"
  | "hide"
  | "unhide"
  | "delete";

export async function applyCharacterAdminAction(
  characterId: string,
  action: CharacterAdminAction,
): Promise<{ character: CharacterSheet | null; deleted: boolean }> {
  const character = await getCharacter(characterId);
  if (!character) return { character: null, deleted: false };

  switch (action) {
    case "approve":
      if (character.status !== "pending") {
        throw Object.assign(new Error("Character is not pending."), {
          status: 400,
        });
      }
      return {
        character: await setCharacterStatus(characterId, "approved"),
        deleted: false,
      };
    case "disapprove":
      return {
        character: await setCharacterStatus(characterId, "pending"),
        deleted: false,
      };
    case "hide":
      return {
        character: await setCharacterHidden(characterId, true),
        deleted: false,
      };
    case "unhide":
      return {
        character: await setCharacterHidden(characterId, false),
        deleted: false,
      };
    case "delete":
      await deleteCharacter(characterId);
      return { character, deleted: true };
  }
}
