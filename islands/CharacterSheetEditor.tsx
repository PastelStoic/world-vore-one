import { useMemo, useState } from "preact/hooks";
import type { PerkDefinition } from "../data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDraft,
  type CharacterDescription,
  type CharacterSheet,
  type Sex,
  RACES,
  SEX_OPTIONS,
} from "../lib/character_types.ts";
import {
  calculateEncumbranceLevel,
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
  getEncumbranceLabel,
} from "../lib/stat_calculations.ts";

interface CharacterSheetEditorProps {
  action: "create" | "update";
  title: string;
  submitLabel: string;
  characterId?: string;
  basedOnSnapshotId?: string;
  initialCharacter: CharacterDraft | CharacterSheet;
  perks: PerkDefinition[];
}

export default function CharacterSheetEditor(props: CharacterSheetEditorProps) {
  const [name, setName] = useState(props.initialCharacter.name);
  const [race, setRace] = useState(props.initialCharacter.race);
  const [description, setDescription] = useState<CharacterDescription>(
    props.initialCharacter.description,
  );
  const [initialBaseStats] = useState(props.initialCharacter.baseStats);
  const [baseStats, setBaseStats] = useState(props.initialCharacter.baseStats);
  const [unallocatedStatPoints, setUnallocatedStatPoints] = useState(
    props.initialCharacter.unallocatedStatPoints,
  );
  const [unspentPerkPoints, setUnspentPerkPoints] = useState(
    props.initialCharacter.unspentPerkPoints,
  );
  const [perkIds, setPerkIds] = useState(props.initialCharacter.perkIds);
  const [carriedWeight, setCarriedWeight] = useState(0);
  const [changelog, setChangelog] = useState("");
  const [showDescription, setShowDescription] = useState(true);
  const [showPerkPicker, setShowPerkPicker] = useState(false);

  const draft: CharacterDraft = {
    name,
    race,
    description,
    baseStats,
    unallocatedStatPoints,
    unspentPerkPoints,
    perkIds,
  };

  const carryCapacity = calculateEffectiveCarryCapacity(draft);
  const encumbranceLevel = calculateEncumbranceLevel(carryCapacity, carriedWeight);
  const encumbrancePenaltyText =
    encumbranceLevel > 0
      ? `-${encumbranceLevel} STR / -${encumbranceLevel} DEX`
      : "No STR/DEX penalty";

  const effectiveByStat = useMemo(() => {
    return {
      strength: calculateEffectiveStrength(draft, { encumbranceLevel }),
      dexterity: calculateEffectiveDexterity(draft, { encumbranceLevel }),
      constitution: calculateEffectiveConstitution(draft),
      intelligence: calculateEffectiveIntelligence(draft),
      charisma: calculateEffectiveCharisma(draft),
      escapeTraining: calculateEffectiveEscapeTraining(draft),
      digestionStrength: calculateEffectiveDigestionStrength(draft),
      digestionResilience: calculateEffectiveDigestionResilience(draft),
    };
  }, [draft, encumbranceLevel]);

  const availablePerks = props.perks.filter((perk) =>
    !perkIds.includes(perk.id)
  );

  function updateDescription<K extends keyof CharacterDescription>(
    key: K,
    value: CharacterDescription[K],
  ) {
    setDescription((current) => ({ ...current, [key]: value }));
  }

  function increaseStat(statKey: BaseStatKey) {
    if (unallocatedStatPoints < 1) {
      return;
    }

    setBaseStats((current) => ({
      ...current,
      [statKey]: current[statKey] + 1,
    }));
    setUnallocatedStatPoints((current) => current - 1);
  }

  function decreaseStat(statKey: BaseStatKey) {
    if (baseStats[statKey] <= initialBaseStats[statKey]) {
      return;
    }

    setBaseStats((current) => ({
      ...current,
      [statKey]: current[statKey] - 1,
    }));
    setUnallocatedStatPoints((current) => current + 1);
  }

  function buyPerkPoint() {
    if (unallocatedStatPoints < 3) {
      return;
    }

    setUnallocatedStatPoints((current) => current - 3);
    setUnspentPerkPoints((current) => current + 1);
  }

  function buyPerk(perkId: string) {
    if (unspentPerkPoints < 1 || perkIds.includes(perkId)) {
      return;
    }

    setPerkIds((current) => [...current, perkId]);
    setUnspentPerkPoints((current) => current - 1);
  }

  return (
    <form method="POST" class="space-y-4 border rounded-lg p-4 bg-white/80">
      <h2 class="text-xl font-semibold">{props.title}</h2>
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
      <input type="hidden" name="baseStats" value={JSON.stringify(baseStats)} />
      <input type="hidden" name="description" value={JSON.stringify(description)} />
      <input type="hidden" name="perkIds" value={JSON.stringify(perkIds)} />
      <input
        type="hidden"
        name="unallocatedStatPoints"
        value={String(unallocatedStatPoints)}
      />
      <input
        type="hidden"
        name="unspentPerkPoints"
        value={String(unspentPerkPoints)}
      />

      <label class="block">
        <span class="block font-medium mb-1">Name</span>
        <input
          class="w-full border rounded px-3 py-2"
          name="name"
          type="text"
          value={name}
          onInput={(event) =>
            setName(event.currentTarget.value)}
          required
        />
      </label>

      <div class="rounded border p-3 space-y-3">
        <button
          type="button"
          class="font-semibold text-blue-600 hover:underline cursor-pointer"
          onClick={() => setShowDescription((v) => !v)}
        >
          Description {showDescription ? "▲" : "▼"}
        </button>
        {showDescription && <>

        <label class="block">
          <span class="block font-medium mb-1">Race</span>
          <select
            class="w-full border rounded px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
            name="race"
            value={race}
            disabled={props.action === "update"}
            onInput={(event) =>
              setRace(event.currentTarget.value as CharacterDraft["race"])}
          >
            {RACES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        {race === "Pilzfraun" && (
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={description.isTemplate}
              onChange={(event) =>
                updateDescription("isTemplate", event.currentTarget.checked)}
            />
            <span class="font-medium">Is a template</span>
          </label>
        )}

        <label class="block">
          <span class="block font-medium mb-1">Country of Origin</span>
          <input
            class="w-full border rounded px-3 py-2"
            type="text"
            value={description.countryOfOrigin}
            onInput={(event) =>
              updateDescription("countryOfOrigin", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">Faction</span>
          <input
            class="w-full border rounded px-3 py-2"
            type="text"
            value={description.faction}
            onInput={(event) =>
              updateDescription("faction", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">Role</span>
          <input
            class="w-full border rounded px-3 py-2"
            type="text"
            placeholder="Cook, politician, soldier, sapper, conscript, etc."
            value={description.role}
            onInput={(event) =>
              updateDescription("role", event.currentTarget.value)}
          />
        </label>

        {description.role.toLowerCase() === "soldier" && (
          <label class="block">
            <span class="block font-medium mb-1">Subfaction</span>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={description.subfaction}
              onInput={(event) =>
                updateDescription("subfaction", event.currentTarget.value)}
            />
          </label>
        )}

        <label class="block">
          <span class="block font-medium mb-1">Age</span>
          <input
            class="w-full border rounded px-3 py-2"
            type="text"
            placeholder={race === "Pilzfraun" ? "Biological age is 21 by default. Include chronological age." : "Must be 18+. Include chronological age (year 1922)."}
            value={description.age}
            onInput={(event) =>
              updateDescription("age", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">Date of Birth</span>
          <input
            class="w-full border rounded px-3 py-2"
            type="text"
            placeholder="M/D/Y — Year is mandatory, month and day are optional"
            value={description.dateOfBirth}
            onInput={(event) =>
              updateDescription("dateOfBirth", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">Sex</span>
          <select
            class="w-full border rounded px-3 py-2"
            value={description.sex}
            onInput={(event) =>
              updateDescription("sex", event.currentTarget.value as Sex)}
          >
            {SEX_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="block font-medium mb-1">Height</span>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={description.height}
              onInput={(event) =>
                updateDescription("height", event.currentTarget.value)}
            />
          </label>

          <label class="block">
            <span class="block font-medium mb-1">Weight</span>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={description.weight}
              onInput={(event) =>
                updateDescription("weight", event.currentTarget.value)}
            />
          </label>
        </div>

        <p class="text-sm text-gray-500 italic">
          The appearance fields below may be left blank if using an image to represent your character.
        </p>

        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="block font-medium mb-1">Skin Color</span>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={description.skinColor}
              onInput={(event) =>
                updateDescription("skinColor", event.currentTarget.value)}
            />
          </label>

          <label class="block">
            <span class="block font-medium mb-1">Hair Color</span>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={description.hairColor}
              onInput={(event) =>
                updateDescription("hairColor", event.currentTarget.value)}
            />
          </label>

          <label class="block">
            <span class="block font-medium mb-1">Eye Color</span>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={description.eyeColor}
              onInput={(event) =>
                updateDescription("eyeColor", event.currentTarget.value)}
            />
          </label>

          <label class="block">
            <span class="block font-medium mb-1">Ethnicity</span>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={description.ethnicity}
              onInput={(event) =>
                updateDescription("ethnicity", event.currentTarget.value)}
            />
          </label>
        </div>

        <label class="block">
          <span class="block font-medium mb-1">Body Type</span>
          <input
            class="w-full border rounded px-3 py-2"
            type="text"
            value={description.bodyType}
            onInput={(event) =>
              updateDescription("bodyType", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">General Appearance</span>
          <textarea
            class="w-full border rounded px-3 py-2"
            rows={3}
            value={description.generalAppearance}
            onInput={(event) =>
              updateDescription("generalAppearance", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">General Health</span>
          <textarea
            class="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Permanent factors: scars, missing limbs, mental conditions, etc."
            value={description.generalHealth}
            onInput={(event) =>
              updateDescription("generalHealth", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">Personality</span>
          <textarea
            class="w-full border rounded px-3 py-2"
            rows={3}
            value={description.personality}
            onInput={(event) =>
              updateDescription("personality", event.currentTarget.value)}
          />
        </label>

        <label class="block">
          <span class="block font-medium mb-1">Biography</span>
          <textarea
            class="w-full border rounded px-3 py-2"
            rows={5}
            value={description.biography}
            onInput={(event) =>
              updateDescription("biography", event.currentTarget.value)}
          />
        </label>

        </>}
      </div>

      {props.action === "update" && (
        <label class="block">
          <span class="block font-medium mb-1">Changelog</span>
          <input
            class="w-full border rounded px-3 py-2"
            name="changelog"
            type="text"
            value={changelog}
            onInput={(event) => setChangelog(event.currentTarget.value)}
            placeholder="Describe what changed in this save"
            required
          />
        </label>
      )}

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Base Stats</h3>
        <p class="text-sm text-gray-700">
          Unallocated stat points: <strong>{unallocatedStatPoints}</strong>
        </p>
        <ul class="space-y-2">
          {BASE_STAT_FIELDS.map((field) => (
            <li class="flex items-center justify-between gap-2" key={field.key}>
              <span class="text-sm">{field.label}</span>
              <span class="text-sm">
                Base: <strong>{baseStats[field.key]}</strong> | Effective:{" "}
                <strong>{effectiveByStat[field.key]}</strong>
              </span>
              <div class="flex gap-1">
                <button
                  type="button"
                  class="px-2 py-1 border rounded disabled:opacity-40"
                  disabled={baseStats[field.key] <= initialBaseStats[field.key]}
                  onClick={() => decreaseStat(field.key)}
                >
                  -1
                </button>
                <button
                  type="button"
                  class="px-2 py-1 border rounded disabled:opacity-40"
                  disabled={unallocatedStatPoints < 1}
                  onClick={() => increaseStat(field.key)}
                >
                  +1
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Other Stats</h3>
        <ul class="space-y-1 text-sm">
          <li>
            Health: <strong>{calculateEffectiveHealth(draft)}</strong>
          </li>
          <li>
            Carry Capacity:{" "}
            <strong>{carryCapacity}</strong>
          </li>
          <li>
            Organ Capacity:{" "}
            <strong>{calculateEffectiveOrganCapacity(draft)}</strong>
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
              Encumbrance: <strong>{getEncumbranceLabel(encumbranceLevel)}</strong>
            </span>
            <span class="text-sm text-gray-700 whitespace-nowrap">
              <strong>{encumbrancePenaltyText}</strong>
            </span>
          </div>
        </label>
      </div>

      <div class="rounded border p-3 space-y-3">
        <h3 class="font-semibold">Perks</h3>
        <p class="text-sm text-gray-700">
          Unspent perk points: <strong>{unspentPerkPoints}</strong>
        </p>

        <button
          type="button"
          class="px-2 py-1 border rounded disabled:opacity-40"
          disabled={unallocatedStatPoints < 3}
          onClick={buyPerkPoint}
        >
          Buy 1 perk point (cost: 3 stat points)
        </button>

        <div>
          <h4 class="font-medium">Owned Perks</h4>
          {perkIds.length === 0
            ? <p class="text-sm text-gray-700">No perks unlocked.</p>
            : (
              <ul class="list-disc list-inside text-sm">
                {perkIds.map((id) => {
                  const perk = props.perks.find((entry) => entry.id === id);
                  return (
                    <li key={id}>
                      {perk ? `${perk.name}: ${perk.description}` : id}
                    </li>
                  );
                })}
              </ul>
            )}
        </div>

        {unspentPerkPoints > 0 && (
          <div class="space-y-2">
            <button
              type="button"
              class="px-2 py-1 border rounded"
              onClick={() => setShowPerkPicker((current) => !current)}
            >
              Add Perk
            </button>
            {showPerkPicker && (
              <div class="space-y-2">
                {availablePerks.length === 0
                  ? (
                    <p class="text-sm text-gray-700">
                      No more perks available.
                    </p>
                  )
                  : (
                    <ul class="space-y-2">
                      {availablePerks.map((perk) => (
                        <li
                          class="flex items-center justify-between gap-2"
                          key={perk.id}
                        >
                          <span class="text-sm">
                            <strong>{perk.name}</strong>: {perk.description}
                          </span>
                          <button
                            type="button"
                            class="px-2 py-1 border rounded"
                            onClick={() => buyPerk(perk.id)}
                          >
                            Buy
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        class="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        {props.submitLabel}
      </button>
    </form>
  );
}
