import type {
  BaseStatKey,
  BaseStats,
  CharacterDescription,
  PerkOrigin,
  Race,
} from "@/lib/character_types.ts";
import type { CharacterInventory } from "@/lib/inventory_types.ts";

interface HiddenFormFieldsProps {
  action: "create" | "update";
  characterId?: string;
  basedOnSnapshotId?: string;
  lockIdentityFields: boolean;
  name: string;
  race: Race;
  baseStats: BaseStats;
  description: CharacterDescription;
  perkIds: string[];
  perkNotes: Record<string, string>;
  perkUpgradeNotes: Record<string, string[]>;
  perkStatChoices: Record<string, BaseStatKey[]>;
  perkRanks: Record<string, number>;
  perkDisguises: Record<string, string>;
  perkSelections: Record<string, string[]>;
  perkPointChoices: Record<string, number>;
  perkOrigins: Record<string, PerkOrigin>;
  factionCompensatedPerkIds: string[];
  pendingImageId: string;
  inventory: CharacterInventory;
  unallocatedStatPoints: number;
}

export function HiddenFormFields(props: HiddenFormFieldsProps) {
  return (
    <>
      <input type="hidden" name="action" value={props.action} />
      {props.action === "update" && props.characterId && (
        <input type="hidden" name="id" value={props.characterId} />
      )}
      {props.basedOnSnapshotId && (
        <input
          type="hidden"
          name="basedOnSnapshotId"
          value={props.basedOnSnapshotId}
        />
      )}
      <input type="hidden" name="race" value={props.race} autocomplete="off" />
      <input
        type="hidden"
        name="baseStats"
        value={JSON.stringify(props.baseStats)}
      />
      <input
        type="hidden"
        name="description"
        value={JSON.stringify(props.description)}
        autocomplete="off"
      />
      <input
        type="hidden"
        name="perkIds"
        value={JSON.stringify(props.perkIds)}
      />
      <input
        type="hidden"
        name="perkNotes"
        value={JSON.stringify(props.perkNotes)}
      />
      <input
        type="hidden"
        name="perkUpgradeNotes"
        value={JSON.stringify(props.perkUpgradeNotes)}
      />
      <input
        type="hidden"
        name="perkStatChoices"
        value={JSON.stringify(props.perkStatChoices)}
      />
      <input
        type="hidden"
        name="perkRanks"
        value={JSON.stringify(props.perkRanks)}
      />
      <input
        type="hidden"
        name="perkDisguises"
        value={JSON.stringify(props.perkDisguises)}
      />
      <input
        type="hidden"
        name="perkSelections"
        value={JSON.stringify(props.perkSelections)}
      />
      <input
        type="hidden"
        name="perkPointChoices"
        value={JSON.stringify(props.perkPointChoices)}
      />
      <input
        type="hidden"
        name="perkOrigins"
        value={JSON.stringify(props.perkOrigins)}
      />
      <input
        type="hidden"
        name="factionCompensatedPerkIds"
        value={JSON.stringify(props.factionCompensatedPerkIds)}
      />
      <input type="hidden" name="pendingImageId" value={props.pendingImageId} />
      <input
        type="hidden"
        name="inventory"
        value={JSON.stringify(props.inventory)}
      />
      <input
        type="hidden"
        name="unallocatedStatPoints"
        value={String(props.unallocatedStatPoints)}
        autocomplete="off"
      />
      {
        /* When identity fields are locked the fieldset is disabled and its
          inputs are excluded from form submission, so emit a hidden input. */
      }
      {props.lockIdentityFields && (
        <input type="hidden" name="name" value={props.name} />
      )}
    </>
  );
}
