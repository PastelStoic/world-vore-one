import { useState } from "preact/hooks";
import type { PerkDefinition } from "../data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type CharacterDraft,
  type CharacterSheet,
} from "../lib/character_types.ts";
import {
  calculateEffectiveCarryCapacity,
  calculateEffectiveCharisma,
  calculateEffectiveConstitution,
  calculateEffectiveDexterity,
  calculateEffectiveDigestionResilience,
  calculateEffectiveDigestionStrength,
  calculateEffectiveEscapeTraining,
  calculateEffectiveHealth,
  calculateEffectiveIntelligence,
  calculateEffectiveOrganCapacity,
  calculateEffectiveStrength,
  calculateEncumbranceLevel,
  getEncumbranceLabel,
} from "../lib/stat_calculations.ts";

interface CharacterSheetViewerProps {
  character: CharacterDraft | CharacterSheet;
  perks: PerkDefinition[];
}

export default function CharacterSheetViewer(props: CharacterSheetViewerProps) {
  const { character, perks } = props;
  const desc = character.description;

  const [carriedWeight, setCarriedWeight] = useState(0);
  const [showDescription, setShowDescription] = useState(true);

  const carryCapacity = calculateEffectiveCarryCapacity(character);
  const encumbranceLevel = calculateEncumbranceLevel(
    carryCapacity,
    carriedWeight,
  );
  const encumbrancePenaltyText =
    encumbranceLevel > 0
      ? `-${encumbranceLevel} STR / -${encumbranceLevel} DEX`
      : "No STR/DEX penalty";

  const effectiveByStat = {
    strength: calculateEffectiveStrength(character, { encumbranceLevel }),
    dexterity: calculateEffectiveDexterity(character, { encumbranceLevel }),
    constitution: calculateEffectiveConstitution(character),
    intelligence: calculateEffectiveIntelligence(character),
    charisma: calculateEffectiveCharisma(character),
    escapeTraining: calculateEffectiveEscapeTraining(character),
    digestionStrength: calculateEffectiveDigestionStrength(character),
    digestionResilience: calculateEffectiveDigestionResilience(character),
  };

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
            <p>
              <strong>Sex:</strong> {desc.sex}
            </p>
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
                <strong>General Appearance:</strong> {desc.generalAppearance}
              </p>
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

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Other Stats</h3>
        <ul class="space-y-1 text-sm">
          <li>
            Health: <strong>{calculateEffectiveHealth(character)}</strong>
          </li>
          <li>
            Carry Capacity: <strong>{carryCapacity}</strong>
          </li>
          <li>
            Organ Capacity:{" "}
            <strong>{calculateEffectiveOrganCapacity(character)}</strong>
          </li>
        </ul>
      </div>

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Effects</h3>
        <label class="block">
          <span class="block font-medium mb-1">Carried Weight</span>
          <div class="flex items-center gap-3">
            <input
              class="w-full border rounded px-3 py-2"
              type="number"
              min="0"
              step="1"
              value={String(carriedWeight)}
              onInput={(event) => {
                const parsed = Number(event.currentTarget.value);
                if (Number.isNaN(parsed) || parsed < 0) {
                  setCarriedWeight(0);
                  return;
                }
                setCarriedWeight(parsed);
              }}
            />
            <span class="text-sm text-gray-700 whitespace-nowrap">
              Encumbrance:{" "}
              <strong>{getEncumbranceLabel(encumbranceLevel)}</strong>
            </span>
            <span class="text-sm text-gray-700 whitespace-nowrap">
              <strong>{encumbrancePenaltyText}</strong>
            </span>
          </div>
        </label>
      </div>

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
