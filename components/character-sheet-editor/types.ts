import type { PerkDefinition } from "@/data/perks.ts";
import type { CharacterDraft, CharacterSheet } from "@/lib/character_types.ts";
import type { PerkAvailability } from "@/lib/draft_validation.ts";

export interface CharacterSheetEditorProps {
  action: "create" | "update";
  title: string;
  submitLabel: string;
  characterId?: string;
  basedOnSnapshotId?: string;
  initialCharacter: CharacterDraft | CharacterSheet;
  perks: PerkDefinition[];
  accountPerkCounts?: Record<string, number>;
  isModerator?: boolean;
  /** Cloudflare Images delivery URL for existing character image */
  imageUrl?: string;
  /** Whether the character is still pending admin approval */
  isPending?: boolean;
}

export interface ListedPerk {
  perk: PerkDefinition;
  availability: PerkAvailability;
}
