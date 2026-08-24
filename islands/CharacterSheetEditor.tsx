import { useLayoutEffect, useState } from "preact/hooks";
import OtherStatsSection from "@/components/OtherStatsSection.tsx";
import EncumbranceSection from "@/components/EncumbranceSection.tsx";
import InventorySection from "@/components/InventorySection.tsx";
import { Button } from "@/components/Button.tsx";
import { HiddenFormFields } from "@/components/character-sheet-editor/HiddenFormFields.tsx";
import { IdentitySection } from "@/components/character-sheet-editor/IdentitySection.tsx";
import { BaseStatsSection } from "@/components/character-sheet-editor/BaseStatsSection.tsx";
import { PerksSection } from "@/components/character-sheet-editor/PerksSection.tsx";
import { useCharacterSheetEditor } from "@/components/character-sheet-editor/useCharacterSheetEditor.ts";
import type { CharacterSheetEditorProps } from "@/components/character-sheet-editor/types.ts";

export type { CharacterSheetEditorProps };

function isBfcacheRestore(event?: Event): boolean {
  return event instanceof PageTransitionEvent && event.persisted;
}

export default function CharacterSheetEditor(props: CharacterSheetEditorProps) {
  const [formKey, setFormKey] = useState(0);
  // Cold loads restore named fields after paint, mixing race/sex/points from
  // earlier visits. Remount from server props once restoration has run; keep
  // in-progress edits when the document comes back from bfcache.
  useLayoutEffect(() => {
    const discardRestoredForm = (event?: Event) => {
      if (isBfcacheRestore(event)) return;
      setFormKey((key) => key + 1);
    };
    discardRestoredForm();
    globalThis.addEventListener("pageshow", discardRestoredForm);
    return () =>
      globalThis.removeEventListener("pageshow", discardRestoredForm);
  }, []);

  return <CharacterSheetEditorForm key={formKey} {...props} />;
}

function CharacterSheetEditorForm(props: CharacterSheetEditorProps) {
  const editor = useCharacterSheetEditor(props);
  const remainingPoints = editor.unallocatedStatPoints -
    editor.inventoryPointCost;
  const hasNegativePoints = remainingPoints < 0;

  return (
    <form
      method="POST"
      autocomplete="off"
      class="space-y-4 border rounded-lg p-4 bg-base-100/80"
      onSubmit={(event) => {
        if (hasNegativePoints) event.preventDefault();
      }}
    >
      <h2 class="text-xl font-semibold">{props.title}</h2>
      <HiddenFormFields
        action={props.action}
        characterId={props.characterId}
        basedOnSnapshotId={props.basedOnSnapshotId}
        lockIdentityFields={editor.lockIdentityFields}
        name={editor.name}
        race={editor.race}
        baseStats={editor.baseStats}
        description={editor.description}
        perkIds={editor.perkIds}
        perkNotes={editor.perkNotes}
        perkUpgradeNotes={editor.perkUpgradeNotes}
        perkStatChoices={editor.perkStatChoices}
        perkRanks={editor.perkRanks}
        perkDisguises={editor.perkDisguises}
        perkSelections={editor.perkSelections}
        perkPointChoices={editor.perkPointChoices}
        perkOrigins={editor.perkOrigins}
        factionCompensatedPerkIds={editor.factionCompensatedPerkIds}
        pendingImageId={editor.pendingImageId}
        inventory={editor.inventory}
        unallocatedStatPoints={editor.unallocatedStatPoints}
      />

      {editor.lockIdentityFields && (
        <p class="text-sm text-base-content/70">
          Name and description are locked after approval. An admin must
          disapprove the character to change them.
        </p>
      )}

      <IdentitySection
        lockIdentityFields={editor.lockIdentityFields}
        name={editor.name}
        onNameChange={editor.setName}
        description={editor.description}
        onDescriptionChange={editor.updateDescription}
        race={editor.race}
        racesForCurrentSex={editor.racesForCurrentSex}
        displayedRaceName={editor.displayedRaceName}
        availableFactions={editor.availableFactions}
        onSexChange={editor.handleSexChange}
        onRaceChange={editor.changeRace}
        onFactionChange={editor.handleFactionChange}
        currentImageUrl={editor.currentImageUrl}
        imageUploading={editor.imageUploading}
        imageError={editor.imageError}
        fileInputRef={editor.fileInputRef}
        onImageUpload={editor.handleImageUpload}
        onImageDelete={editor.handleImageDelete}
      />

      <BaseStatsSection
        race={editor.race}
        perkIds={editor.perkIds}
        baseStats={editor.baseStats}
        effectiveByStat={editor.effectiveByStat}
        unallocatedStatPoints={editor.unallocatedStatPoints}
        inventoryPointCost={editor.inventoryPointCost}
        statCaps={editor.statCaps}
        getStatFloor={editor.getStatFloor}
        onIncreaseStat={editor.increaseStat}
        onDecreaseStat={editor.decreaseStat}
        onAdjustUnallocated={(delta) =>
          editor.setUnallocatedStatPoints((current) => current + delta)}
      />

      <OtherStatsSection
        draft={editor.draft}
        carryCapacity={editor.carryCapacity}
      />

      <EncumbranceSection
        carriedWeight={editor.carriedWeight}
        onCarriedWeightChange={editor.setCarriedWeight}
        encumbranceLevel={editor.encumbranceLevel}
        encumbrancePenaltyText={editor.encumbrancePenaltyText}
        inventoryWeight={editor.inventoryWeight}
      />

      <PerksSection
        perkIds={editor.perkIds}
        perkNotes={editor.perkNotes}
        perkUpgradeNotes={editor.perkUpgradeNotes}
        perkStatChoices={editor.perkStatChoices}
        perkRanks={editor.perkRanks}
        perkDisguises={editor.perkDisguises}
        perkSelections={editor.perkSelections}
        perkPointChoices={editor.perkPointChoices}
        perkOrigins={editor.perkOrigins}
        ownedPerks={editor.ownedPerks}
        ownedPerkGroups={editor.ownedPerkGroups}
        uncategorizedOwnedPerks={editor.uncategorizedOwnedPerks}
        derivedPerkIds={editor.derivedPerkIds}
        listedPerks={editor.listedPerks}
        allPerks={editor.allPerks}
        initialPerkIds={editor.initialPerkIds}
        initialPerkRanks={editor.initialPerkRanks}
        canRemoveOldPerks={editor.canRemoveOldPerks}
        unallocatedStatPoints={editor.unallocatedStatPoints}
        inventoryPointCost={editor.inventoryPointCost}
        baseStats={editor.baseStats}
        faction={editor.description.faction}
        race={editor.race}
        onBuyPerk={editor.buyPerk}
        onUnbuyPerk={editor.unbuyPerk}
        onUpgradePerk={editor.upgradePerk}
        onDowngradePerk={editor.downgradePerk}
        onPerkPointChoiceChange={editor.handlePerkPointChoiceChange}
        onPerkStatChoiceChange={editor.handlePerkStatChoiceChange}
        onPerkUpgradeNoteChange={editor.handlePerkUpgradeNoteChange}
        onPerkNoteChange={editor.handlePerkNoteChange}
        onPerkDisguiseChange={editor.handlePerkDisguiseChange}
        onPerkSelectionChange={editor.handlePerkSelectionChange}
      />

      <InventorySection
        inventory={editor.inventory}
        onChange={editor.setInventory}
        availablePoints={editor.unallocatedStatPoints}
        perkIds={editor.perkIds}
        onLoseWeaponPermanently={(cost) =>
          editor.setUnallocatedStatPoints((current) => current - cost)}
      />

      {props.action === "update" && !props.isPending && (
        <label class="block">
          <span class="block font-medium mb-1">Changelog</span>
          <input
            class="input w-full border rounded px-3 py-2"
            name="changelog"
            type="text"
            value={editor.changelog}
            onInput={(event) => editor.setChangelog(event.currentTarget.value)}
            placeholder="Describe what changed in this save"
            required
          />
        </label>
      )}

      {hasNegativePoints && (
        <p class="text-sm text-error">
          Cannot save a sheet with negative stat points ({remainingPoints}pt
          remaining). Decrease stats, remove paid perks, or drop inventory items
          first.
        </p>
      )}

      <Button type="submit" disabled={hasNegativePoints}>
        {props.submitLabel}
      </Button>
    </form>
  );
}
