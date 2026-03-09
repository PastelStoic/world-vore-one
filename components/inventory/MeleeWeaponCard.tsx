// ---------------------------------------------------------------------------
// MeleeWeaponCard – renders a premade melee weapon in the inventory
// ---------------------------------------------------------------------------

import type { InventoryMeleeWeapon } from "@/lib/inventory_types.ts";
import { MELEE_TRAITS, MELEE_TRAITS_BY_ID, MELEE_WEAPONS_BY_ID } from "@/data/equipment.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
import type { InventoryLocation } from "./helpers.ts";
import TraitBadge from "./TraitBadge.tsx";

interface MeleeWeaponCardProps {
  meleeWeapon: InventoryMeleeWeapon;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  hasSignatureWeaponPerk: boolean;
  onToggleSignature: (location: InventoryLocation, index: number) => void;
  onSetSignatureTrait: (
    location: InventoryLocation,
    index: number,
    traitId: string,
  ) => void;
  onMove: (from: InventoryLocation, index: number, to: InventoryLocation) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
}

export default function MeleeWeaponCard(props: MeleeWeaponCardProps) {
  const {
    meleeWeapon: mw,
    location,
    index,
    readOnly,
    hasSignatureWeaponPerk,
    onToggleSignature,
    onSetSignatureTrait,
    onMove,
    onRemove,
  } = props;

  const def = MELEE_WEAPONS_BY_ID.get(mw.meleeWeaponId);
  const otherLocation: InventoryLocation = location === "carried"
    ? "stowed"
    : "carried";

  const isSignature = mw.isSignatureWeapon && hasSignatureWeaponPerk;
  const damage = def?.damage ?? 0;
  const damageDisplay = isSignature ? `${damage}+1` : String(damage);
  const weight = def?.weight ?? 0;
  const isPerkGranted = !!mw.perkGranted;
  const grantingPerkName = isPerkGranted
    ? PERKS_BY_ID.get(mw.perkGranted!)?.name ?? mw.perkGranted
    : null;
  const signatureExtraTrait = isSignature && mw.signatureExtraTraitId
    ? MELEE_TRAITS_BY_ID.get(mw.signatureExtraTraitId)
    : undefined;
  const displayedTraitIds = Array.from(new Set(
    signatureExtraTrait ? [...def.traitIds, signatureExtraTrait.id] : def.traitIds,
  ));

  if (!def) {
    return (
      <div class="border rounded p-2 bg-base-100 text-sm text-error">
        Unknown melee weapon: {mw.meleeWeaponId}
        {!readOnly && !isPerkGranted && (
          <button
            type="button"
            class="ml-2 px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
            onClick={() => onRemove(location, index)}
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      class={`border rounded p-2 space-y-1 ${
        isSignature ? "bg-warning/10 border-warning/50" : "bg-base-100"
      }`}
    >
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          {isSignature && (
            <span class="text-warning mr-1" title="Signature Weapon">
              ★
            </span>
          )}
          <strong>{def.name}</strong>
          <span class="text-xs text-base-content/60 ml-1">
            (DMG:{damageDisplay} · W:{weight})
          </span>
          {isSignature && (
            <span class="text-xs text-warning ml-1 font-medium">
              [Signature Weapon · +1 extra trait]
            </span>
          )}
          {isPerkGranted && (
            <span class="ml-1 text-xs font-semibold text-primary">
              [{grantingPerkName}]
            </span>
          )}
        </div>
        {!readOnly && !isPerkGranted && (
          <div class="flex gap-1">
            {hasSignatureWeaponPerk && (
              <button
                type="button"
                class={`px-2 py-0.5 text-xs border rounded ${
                  isSignature
                    ? "bg-warning/20 border-warning/60 text-warning"
                    : "hover:bg-warning/10 text-warning"
                }`}
                onClick={() => onToggleSignature(location, index)}
                title={isSignature
                  ? "Unmark as Signature Weapon"
                  : "Mark as Signature Weapon"}
              >
                {isSignature ? "★ Signature" : "☆ Set Signature"}
              </button>
            )}
            <button
              type="button"
              class="px-2 py-0.5 text-xs border rounded hover:bg-base-200"
              onClick={() => onMove(location, index, otherLocation)}
            >
              → {otherLocation === "carried" ? "Carry" : "Stow"}
            </button>
            <button
              type="button"
              class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
              onClick={() => onRemove(location, index)}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {def.description && (
        <div class="text-xs text-base-content/70 whitespace-pre-line ml-2">
          {def.description}
        </div>
      )}

      {/* Traits */}
      {displayedTraitIds.length > 0 && (
        <div class="flex flex-wrap gap-1">
          {displayedTraitIds.map((tid) => {
            const trait = MELEE_TRAITS_BY_ID.get(tid);
            return (
              <TraitBadge
                key={tid}
                name={trait?.name ?? tid}
                description={trait?.description ?? ""}
              />
            );
          })}
        </div>
      )}

      {isSignature && !readOnly && (
        <div class="ml-2 text-xs">
          <label class="mr-1">Extra trait:</label>
          <select
            class="select text-xs border rounded px-1 py-0.5"
            value={mw.signatureExtraTraitId ?? ""}
            onChange={(e) =>
              onSetSignatureTrait(location, index, (e.target as HTMLSelectElement).value)}
          >
            <option value="">Select a trait…</option>
            {MELEE_TRAITS.map((trait) => (
              <option key={trait.id} value={trait.id}>
                {trait.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
