import { useState } from "preact/hooks";
import type { PerkDefinition } from "../data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type CharacterDraft,
  type CharacterSheet,
} from "../lib/character_types.ts";
import { useCharacterStats } from "../lib/useCharacterStats.ts";
import OtherStatsSection from "../components/OtherStatsSection.tsx";
import EncumbranceSection from "../components/EncumbranceSection.tsx";

interface CharacterSheetViewerProps {
  character: CharacterDraft | CharacterSheet;
  perks: PerkDefinition[];
  /** Cloudflare Images delivery URL for existing character image */
  imageUrl?: string;
}

export default function CharacterSheetViewer(props: CharacterSheetViewerProps) {
  const { character, perks, imageUrl } = props;
  const desc = character.description;

  const {
    carriedWeight,
    setCarriedWeight,
    carryCapacity,
    encumbranceLevel,
    encumbrancePenaltyText,
    effectiveByStat,
  } = useCharacterStats(character);

  const [showDescription, setShowDescription] = useState(true);

  return (
    <div class="border rounded-lg p-4 bg-white/80 space-y-4">
      <h2 class="text-2xl font-bold">{character.name}</h2>

      <div class="rounded border p-3 space-y-1">
        <button
          type="button"
          class="font-semibold text-blue-600 hover:underline cursor-pointer"
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
            {desc.subfaction && (
              <p>
                <strong>Subfaction:</strong> {desc.subfaction}
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
            {imageUrl
              ? (
                <div class="mt-2">
                  <img
                    src={imageUrl}
                    alt={`${character.name} character image`}
                    class="max-w-sm rounded border"
                  />
                </div>
              )
              : (
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
        <p class="text-sm text-gray-700">
          Unallocated stat points:{" "}
          <strong>{character.unallocatedStatPoints}</strong>
        </p>
        <ul class="space-y-1 text-sm">
          {BASE_STAT_FIELDS.map((field) => (
            <li key={field.key}>
              {field.label}: Base{" "}
              <strong>{character.baseStats[field.key]}</strong> | Effective{" "}
              <strong>{effectiveByStat[field.key]}</strong>
            </li>
          ))}
        </ul>
      </div>

      <OtherStatsSection draft={character} carryCapacity={carryCapacity} />

      <EncumbranceSection
        carriedWeight={carriedWeight}
        onCarriedWeightChange={setCarriedWeight}
        encumbranceLevel={encumbranceLevel}
        encumbrancePenaltyText={encumbrancePenaltyText}
      />

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Perks</h3>
        {character.perkIds.length === 0
          ? <p class="text-sm text-gray-700">No perks unlocked.</p>
          : (
            <ul class="list-disc list-inside text-sm">
              {character.perkIds.map((id) => {
                const perk = perks.find((entry) => entry.id === id);
                return (
                  <li key={id}>
                    {perk ? `${perk.name}: ${perk.description}` : id}
                  </li>
                );
              })}
            </ul>
          )}
      </div>
    </div>
  );
}
