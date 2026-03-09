import { useMemo, useState } from "preact/hooks";
import {
  PERK_CATEGORY_LABELS,
  PERK_CATEGORY_ORDER,
  type PerkDefinition,
  PERKS_BY_ID,
} from "@/data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDraft,
  type CharacterSheet,
} from "@/lib/character_types.ts";
import { useCharacterStats } from "@/lib/useCharacterStats.ts";
import OtherStatsSection from "@/components/OtherStatsSection.tsx";
import EncumbranceSection from "@/components/EncumbranceSection.tsx";
import PerkDescription from "@/components/PerkDescription.tsx";
import InventorySection from "@/components/InventorySection.tsx";
import { createEmptyInventory } from "@/lib/inventory_types.ts";
// Sass's change
import {
  calculateInventoryPointCost,
  createEmptyInventory,
} from "@/lib/inventory_types.ts";

interface CharacterSheetViewerProps {
  character: CharacterDraft | CharacterSheet;
  perks: PerkDefinition[];
  /** Cloudflare Images delivery URL for existing character image */
  imageUrl?: string;
  /** Character ID for auto-saving combat state (ammo, charges, magazines) */
  characterId?: string;
  /** Whether the viewer can see the real identity of disguised perks (owner/admin). */
  canSeeDisguisedPerks?: boolean;
  /** Perk IDs to show for display only (not used in stat calculations). */
  displayOnlyPerkIds?: string[];
  /** Whether the current user can edit ammo/charges (owner or admin). */
  canEditCombatState?: boolean;
}

export default function CharacterSheetViewer(props: CharacterSheetViewerProps) {
  const {
    character,
    perks,
    imageUrl,
    characterId,
    canSeeDisguisedPerks = false,
    displayOnlyPerkIds = [],
    canEditCombatState = false,
  } = props;
  const desc = character.description;
  const perksById = new Map(perks.map((perk) => [perk.id, perk]));
  const ownedPerks = character.perkIds.map((id) => ({
    id,
    perk: perksById.get(id),
    displayOnly: false,
  }));

  // Sass's change
  const inventoryPointCost = calculateInventoryPointCost(
    inventory,
    (id) => getWeaponPointCost(id, perkIds),
    {
      getEquipment: (id) => EQUIPMENT_BY_ID.get(id),
      getAttachment: (id) => ATTACHMENTS_BY_ID.get(id),
    },
  );

  // Merge display-only perks (fake perks shown to non-owners in place of disguised ones).
  const allDisplayPerks = [
    ...ownedPerks,
    ...displayOnlyPerkIds.map((id) => ({
      id,
      perk: perksById.get(id),
      displayOnly: true,
    })),
  ];
  const ownedPerkGroups = PERK_CATEGORY_ORDER
    .map((category) => ({
      category,
      items: allDisplayPerks.filter((item) => item.perk?.category === category),
    }))
    .filter((group) => group.items.length > 0);
  const uncategorizedOwnedPerks = allDisplayPerks.filter((item) => !item.perk);

  const [showDescription, setShowDescription] = useState(true);
  const [inventory, setInventory] = useState(
    character.inventory ?? createEmptyInventory(),
  );

  // Build a draft that uses the local inventory state so weight/encumbrance updates live
  const viewerDraft = {
    ...character,
    inventory,
  };

  const {
    carriedWeight,
    setCarriedWeight,
    inventoryWeight,
    carryCapacity,
    encumbranceLevel,
    encumbrancePenaltyText,
    effectiveByStat,
  } = useCharacterStats(viewerDraft);

  const isHidden = "hidden" in character &&
    (character as CharacterSheet).hidden;

  return (
    <div class="border rounded-lg p-4 bg-base-100/80 space-y-4">
      <h2 class="text-2xl font-bold">
        {character.name}
        {isHidden && (
          <span class="ml-2 text-base font-semibold text-error">Hidden</span>
        )}
      </h2>

      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt={`${character.name} character image`}
            class="max-w-sm rounded border"
          />
        </div>
      )}

      <div class="rounded border p-3 space-y-1">
        <button
          type="button"
          class="font-semibold text-primary hover:underline cursor-pointer"
          onClick={() => setShowDescription((v) => !v)}
        >
          Description {showDescription ? "▲" : "▼"}
        </button>
        {showDescription && (
          <div class="space-y-1 mt-2">
            <p>
              <strong>Race:</strong> {character.race}
            </p>
            <p>
              <strong>Sex:</strong> {desc.sex}
              {canSeeDisguisedPerks &&
                character.perkDisguises?.["pilzherr-femboy"] && (
                <span class="block ml-5 text-purple-600 italic text-xs">
                  Displayed as: Futa
                </span>
              )}
            </p>
            {desc.isTemplate && (
              <p>
                <strong>Template:</strong> Yes
              </p>
            )}
            {desc.countryOfOrigin && (
              <p>
                <strong>Country of Origin:</strong> {desc.countryOfOrigin}
              </p>
            )}
            {desc.faction && (
              <p>
                <strong>Faction:</strong> {desc.faction}
              </p>
            )}
            {desc.role && (
              <p>
                <strong>Role:</strong> {desc.role}
              </p>
            )}
            {desc.age && (
              <p>
                <strong>Age:</strong> {desc.age}
              </p>
            )}
            {desc.dateOfBirth && (
              <p>
                <strong>Date of Birth:</strong> {desc.dateOfBirth}
              </p>
            )}
            {desc.height && (
              <p>
                <strong>Height:</strong> {desc.height}
              </p>
            )}
            {desc.weight && (
              <p>
                <strong>Weight:</strong> {desc.weight}
              </p>
            )}
            {!imageUrl && (
              <>
                {desc.skinColor && (
                  <p>
                    <strong>Skin Color:</strong> {desc.skinColor}
                  </p>
                )}
                {desc.hairColor && (
                  <p>
                    <strong>Hair Color:</strong> {desc.hairColor}
                  </p>
                )}
                {desc.eyeColor && (
                  <p>
                    <strong>Eye Color:</strong> {desc.eyeColor}
                  </p>
                )}
                {desc.ethnicity && (
                  <p>
                    <strong>Ethnicity:</strong> {desc.ethnicity}
                  </p>
                )}
                {desc.bodyType && (
                  <p>
                    <strong>Body Type:</strong> {desc.bodyType}
                  </p>
                )}
                {desc.generalAppearance && (
                  <p>
                    <strong>General Appearance:</strong>{" "}
                    {desc.generalAppearance}
                  </p>
                )}
              </>
            )}
            {desc.generalHealth && (
              <p>
                <strong>General Health:</strong> {desc.generalHealth}
              </p>
            )}
            {desc.personality && (
              <p>
                <strong>Personality:</strong> {desc.personality}
              </p>
            )}
            {desc.biography && (
              <p>
                <strong>Biography:</strong> {desc.biography}
              </p>
            )}
          </div>
        )}
      </div>

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Base Stats</h3>
        <p class="text-sm text-base-content">
          Unallocated stat points:{" "}
          <strong>{character.unallocatedStatPoints - character.inventoryPointCost}</strong>
        </p>
        {(() => {
          // Compute addiction-affected stats
          const addictionAffectedStats = new Set<BaseStatKey>();
          if (character.perkIds.includes("crippling-addiction")) {
            const mainStats: BaseStatKey[] = ["strength", "dexterity", "constitution", "intelligence", "charisma"];
            const maxValue = Math.max(...mainStats.map(k => character.baseStats[k]));
            for (const k of mainStats) {
              if (character.baseStats[k] === maxValue) addictionAffectedStats.add(k);
            }
          }
          return (
        <ul class="space-y-1 text-sm">
          {BASE_STAT_FIELDS.filter((field) => character.race !== "Baseliner" || field.key !== "digestionStrength").map((field, idx) => (
            <li key={field.key}>
              {idx === 5 && <br /> /* Gap between regular and vore stats */}
              {field.label}
              {addictionAffectedStats.has(field.key) && (
                <span class="ml-1 text-xs font-semibold text-error">[Addiction]</span>
              )}
              : Base{" "}
              <strong>{character.baseStats[field.key]}</strong> | Effective{" "}
              <strong>{effectiveByStat[field.key]}</strong>
            </li>
          ))}
        </ul>
          );
        })()}
      </div>

      <OtherStatsSection draft={character} carryCapacity={carryCapacity} />

      <EncumbranceSection
        carriedWeight={carriedWeight}
        onCarriedWeightChange={setCarriedWeight}
        encumbranceLevel={encumbranceLevel}
        encumbrancePenaltyText={encumbrancePenaltyText}
        inventoryWeight={inventoryWeight}
      />

      <InventorySection
        inventory={inventory}
        onChange={setInventory}
        readOnly
        characterId={characterId}
        perkIds={character.perkIds}
        canEditCombatState={canEditCombatState}
      />

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Perks</h3>
        {allDisplayPerks.length === 0
          ? <p class="text-sm text-base-content">No perks unlocked.</p>
          : (
            <div class="space-y-3 text-sm">
              {ownedPerkGroups.map((group) => (
                <div key={group.category} class="space-y-1">
                  <h4 class="font-medium">
                    {PERK_CATEGORY_LABELS[group.category]}
                  </h4>
                  <ul class="list-disc list-inside">
                    {group.items.map(({ id, perk, displayOnly }) => {
                      const rank = character.perkRanks?.[id] ?? 1;
                      const perkDef = perk
                        ? PERKS_BY_ID.get(id)
                        : undefined;
                      const statLabelMap = BASE_STAT_FIELDS.reduce(
                        (m, f) => { m[f.key] = f.label; return m; },
                        {} as Record<string, string>,
                      );
                      return (
                      <li key={id}>
                        {perk
                          ? (
                            <PerkDescription
                              name={perk.name}
                              description={perk.description}
                            />
                          )
                          : id}
                        {perkDef?.upgradable && rank > 1 && (
                          <span class="ml-1 text-xs bg-primary/20 text-primary px-1 rounded">
                            Rank {rank}
                          </span>
                        )}
                        {/* Owner/admin: show which perk this is disguised as */}
                        {canSeeDisguisedPerks &&
                          character.perkDisguises?.[id] && (() => {
                            const fakePerk = perksById.get(
                              character.perkDisguises![id],
                            );
                            return (
                              <span class="block ml-5 text-purple-600 italic text-xs">
                                Disguised as: {fakePerk?.name ??
                                  character.perkDisguises![id]}
                              </span>
                            );
                          })()}
                        {/* Show selected sub-perk for perks with selectablePerkIds */}
                        {perkDef?.selectablePerkIds !== undefined &&
                          character.perkSelections?.[id]?.filter(Boolean).map((selId, si) => {
                            const selPerk = PERKS_BY_ID.get(selId);
                            if (!selPerk) return null;
                            const count = perkDef.selectablePerksCount ?? 1;
                            return (
                              <span key={si} class="block ml-5 text-xs text-base-content/70 italic">
                                {count > 1 ? `Choice ${si + 1}: ` : "Chosen perk: "}
                                <span class="not-italic font-medium">{selPerk.name}</span>
                              </span>
                            );
                          })}
                        {/* Per-rank notes for upgradable perks */}
                        {!displayOnly && perkDef?.upgradable && (
                          <div class="ml-5 space-y-0.5">
                            {Array.from({ length: rank }, (_, ri) => {
                              const statKey =
                                character.perkStatChoices?.[id]?.[ri];
                              const note =
                                character.perkUpgradeNotes?.[id]?.[ri] ??
                                (ri === 0 ? character.perkNotes?.[id] : undefined);
                              if (!statKey && !note) return null;
                              return (
                                <div
                                  key={ri}
                                  class="text-xs text-base-content/70 italic"
                                >
                                  {rank > 1 && (
                                    <span class="font-semibold not-italic">
                                      Rank {ri + 1}:{" "}
                                    </span>
                                  )}
                                  {statKey && (
                                    <span class="text-warning not-italic">
                                      [{statLabelMap[statKey] ?? statKey} locked]
                                      {note ? " — " : ""}
                                    </span>
                                  )}
                                  {note}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {/* Show legacy perk notes for non-upgradable perks */}
                        {!displayOnly && !perkDef?.upgradable &&
                          character.perkNotes?.[id] && (
                          <span class="block ml-5 text-base-content/70 italic">
                            {character.perkNotes[id]}
                          </span>
                        )}
                      </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              {uncategorizedOwnedPerks.length > 0 && (
                <div class="space-y-1">
                  <h4 class="font-medium">Other</h4>
                  <ul class="list-disc list-inside">
                    {uncategorizedOwnedPerks.map(({ id }) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
