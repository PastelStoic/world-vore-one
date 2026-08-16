import { useState } from "preact/hooks";
import type { RefObject } from "preact";
import {
  type CharacterDescription,
  type CharacterDraft,
  isPilzRace,
  isTierRace,
  type Sex,
  SEX_OPTIONS,
} from "@/lib/character_types.ts";
import { CharacterImageUpload } from "./CharacterImageUpload.tsx";

interface IdentitySectionProps {
  lockIdentityFields: boolean;
  name: string;
  onNameChange: (name: string) => void;
  description: CharacterDescription;
  onDescriptionChange: <K extends keyof CharacterDescription>(
    key: K,
    value: CharacterDescription[K],
  ) => void;
  race: CharacterDraft["race"];
  racesForCurrentSex: CharacterDraft["race"][];
  displayedRaceName: string;
  availableFactions: readonly string[];
  onSexChange: (sex: Sex) => void;
  onRaceChange: (race: CharacterDraft["race"]) => void;
  onFactionChange: (faction: string) => void;
  currentImageUrl: string;
  imageUploading: boolean;
  imageError: string;
  fileInputRef: RefObject<HTMLInputElement>;
  onImageUpload: (file: File) => void;
  onImageDelete: () => void;
}

export function IdentitySection(props: IdentitySectionProps) {
  const [showDescription, setShowDescription] = useState(true);
  const { description } = props;

  return (
    <fieldset
      disabled={props.lockIdentityFields}
      class="space-y-4 disabled:opacity-70"
    >
      <label class="block">
        <span class="block font-medium mb-1">Name</span>
        <input
          class="w-full border rounded px-3 py-2"
          name="name"
          type="text"
          value={props.name}
          onInput={(event) => props.onNameChange(event.currentTarget.value)}
          required
        />
      </label>

      <div class="rounded border p-3 space-y-3">
        <button
          type="button"
          class="font-semibold text-primary hover:underline cursor-pointer"
          onClick={() => setShowDescription((v) => !v)}
        >
          Description {showDescription ? "▲" : "▼"}
        </button>
        {showDescription && (
          <>
            <label class="block">
              <span class="block font-medium mb-1">Sex</span>
              <select
                class="select w-full border rounded px-3 py-2"
                value={description.sex}
                onChange={(event) => {
                  props.onSexChange(
                    (event.target as HTMLSelectElement).value as Sex,
                  );
                }}
              >
                {SEX_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label class="block">
              <span class="block font-medium mb-1">Race</span>
              {
                /* key forces a full remount when sex changes so option lists
                  cannot stick to the previous gendered set in the DOM */
              }
              <select
                key={`race-${description.sex}`}
                class="select w-full border rounded px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                name="race"
                value={props.racesForCurrentSex.includes(props.race)
                  ? props.race
                  : props.racesForCurrentSex[0]}
                disabled={props.lockIdentityFields}
                onChange={(event) => {
                  props.onRaceChange(
                    (event.target as HTMLSelectElement)
                      .value as CharacterDraft["race"],
                  );
                }}
              >
                {props.racesForCurrentSex.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {props.displayedRaceName !== props.race && (
                <span class="block mt-1 text-xs text-base-content/70">
                  Displayed as: {props.displayedRaceName}
                </span>
              )}
            </label>

            {(isPilzRace(props.race) || isTierRace(props.race)) && (
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={description.isTemplate}
                  disabled={props.lockIdentityFields}
                  onChange={(event) =>
                    props.onDescriptionChange(
                      "isTemplate",
                      event.currentTarget.checked,
                    )}
                  class={props.lockIdentityFields
                    ? "opacity-60 cursor-not-allowed"
                    : ""}
                />
                <span class="font-medium">Is a template</span>
              </label>
            )}

            <label class="block">
              <span class="block font-medium mb-1">Country of Origin</span>
              <input
                class="input w-full border rounded px-3 py-2"
                type="text"
                value={description.countryOfOrigin}
                onInput={(event) =>
                  props.onDescriptionChange(
                    "countryOfOrigin",
                    event.currentTarget.value,
                  )}
              />
            </label>

            <label class="block">
              <span class="block font-medium mb-1">Faction</span>
              <select
                class="select w-full border rounded px-3 py-2"
                value={description.faction}
                onChange={(event) => {
                  props.onFactionChange(
                    (event.target as HTMLSelectElement).value,
                  );
                }}
              >
                <option value="">— None —</option>
                {props.availableFactions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </label>

            <label class="block">
              <span class="block font-medium mb-1">Role</span>
              <input
                class="input w-full border rounded px-3 py-2"
                type="text"
                placeholder="Cook, politician, soldier, sapper, conscript, etc."
                value={description.role}
                onInput={(event) =>
                  props.onDescriptionChange("role", event.currentTarget.value)}
              />
            </label>

            <label class="block">
              <span class="block font-medium mb-1">Age</span>
              <input
                class="input w-full border rounded px-3 py-2"
                type="text"
                placeholder={isPilzRace(props.race) || isTierRace(props.race)
                  ? "Biological age is 21 by default. Include chronological age. Year is 1923."
                  : "Must be 18+. Include chronological age (year 1923)."}
                value={description.age}
                onInput={(event) =>
                  props.onDescriptionChange("age", event.currentTarget.value)}
              />
            </label>

            <label class="block">
              <span class="block font-medium mb-1">Date of Birth</span>
              <input
                class="input w-full border rounded px-3 py-2"
                type="text"
                placeholder="M/D/Y — Year is mandatory, month and day are optional"
                value={description.dateOfBirth}
                onInput={(event) =>
                  props.onDescriptionChange(
                    "dateOfBirth",
                    event.currentTarget.value,
                  )}
              />
            </label>

            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="block font-medium mb-1">Height</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.height}
                  onInput={(event) =>
                    props.onDescriptionChange(
                      "height",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Weight</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.weight}
                  onInput={(event) =>
                    props.onDescriptionChange(
                      "weight",
                      event.currentTarget.value,
                    )}
                />
              </label>
            </div>

            <p class="text-sm text-base-content/60 italic">
              The appearance fields below may be left blank if using an image to
              represent your character.
            </p>

            <CharacterImageUpload
              characterName={props.name}
              currentImageUrl={props.currentImageUrl}
              imageUploading={props.imageUploading}
              imageError={props.imageError}
              fileInputRef={props.fileInputRef}
              onUpload={props.onImageUpload}
              onDelete={props.onImageDelete}
            />

            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="block font-medium mb-1">Skin Color</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.skinColor}
                  onInput={(event) =>
                    props.onDescriptionChange(
                      "skinColor",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Hair Color</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.hairColor}
                  onInput={(event) =>
                    props.onDescriptionChange(
                      "hairColor",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Eye Color</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.eyeColor}
                  onInput={(event) =>
                    props.onDescriptionChange(
                      "eyeColor",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Ethnicity</span>
                <input
                  class="input w-full border rounded px-3 py-2"
                  type="text"
                  value={description.ethnicity}
                  onInput={(event) =>
                    props.onDescriptionChange(
                      "ethnicity",
                      event.currentTarget.value,
                    )}
                />
              </label>
            </div>

            <label class="block">
              <span class="block font-medium mb-1">Body Type</span>
              <input
                class="input w-full border rounded px-3 py-2"
                type="text"
                value={description.bodyType}
                onInput={(event) =>
                  props.onDescriptionChange(
                    "bodyType",
                    event.currentTarget.value,
                  )}
              />
            </label>

            <label class="block">
              <span class="block font-medium mb-1">General Appearance</span>
              <textarea
                class="textarea w-full border rounded px-3 py-2"
                rows={3}
                value={description.generalAppearance}
                onInput={(event) =>
                  props.onDescriptionChange(
                    "generalAppearance",
                    event.currentTarget.value,
                  )}
              />
            </label>

            <label class="block">
              <span class="block font-medium mb-1">General Health</span>
              <textarea
                class="textarea w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Permanent factors: scars, missing limbs, mental conditions, etc."
                value={description.generalHealth}
                onInput={(event) =>
                  props.onDescriptionChange(
                    "generalHealth",
                    event.currentTarget.value,
                  )}
              />
            </label>

            <label class="block">
              <span class="block font-medium mb-1">Personality</span>
              <textarea
                class="textarea w-full border rounded px-3 py-2"
                rows={3}
                value={description.personality}
                onInput={(event) =>
                  props.onDescriptionChange(
                    "personality",
                    event.currentTarget.value,
                  )}
              />
            </label>

            <label class="block">
              <span class="block font-medium mb-1">Biography</span>
              <textarea
                class="textarea w-full border rounded px-3 py-2"
                rows={5}
                value={description.biography}
                onInput={(event) =>
                  props.onDescriptionChange(
                    "biography",
                    event.currentTarget.value,
                  )}
              />
            </label>
          </>
        )}
      </div>
    </fieldset>
  );
}
