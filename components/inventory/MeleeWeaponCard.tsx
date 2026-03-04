// ---------------------------------------------------------------------------
// MeleeWeaponCard – renders a melee weapon in the inventory
// ---------------------------------------------------------------------------

import type { InventoryMeleeWeapon } from "@/lib/inventory_types.ts";
import { MELEE_TRAITS, MELEE_TRAITS_BY_ID } from "@/data/equipment.ts";
import type { InventoryLocation } from "./helpers.ts";

interface MeleeWeaponCardProps {
  meleeWeapon: InventoryMeleeWeapon;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  hasSignatureWeaponPerk: boolean;
  onToggleSignature: (location: InventoryLocation, index: number) => void;
  onMove: (from: InventoryLocation, index: number, to: InventoryLocation) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
  onUpdate: (location: InventoryLocation, index: number, patch: Partial<InventoryMeleeWeapon>) => void;
  onToggleTrait: (location: InventoryLocation, index: number, traitId: string) => void;
}

export default function MeleeWeaponCard(props: MeleeWeaponCardProps) {
  const {
    meleeWeapon: mw,
    location,
    index,
    readOnly,
    hasSignatureWeaponPerk,
    onToggleSignature,
    onMove,
    onRemove,
    onUpdate,
    onToggleTrait,
  } = props;

  const otherLocation: InventoryLocation = location === "carried"
    ? "stowed"
    : "carried";

  // Signature weapon benefits
  const isSignature = mw.isSignatureWeapon && hasSignatureWeaponPerk;
  const damageDisplay = isSignature ? `${mw.damage}+1` : String(mw.damage);

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
          {readOnly ? <strong>{mw.name}</strong> : (
            <input
              type="text"
              class="border rounded px-1 py-0.5 text-sm font-bold"
              value={mw.name}
              onInput={(e) =>
                onUpdate(location, index, {
                  name: (e.target as HTMLInputElement).value,
                })}
            />
          )}
          <span class="text-xs text-base-content/60 ml-1">
            (DMG:{damageDisplay} · W:{mw.weight})
          </span>
          {isSignature && (
            <span class="text-xs text-warning ml-1 font-medium">
              [Signature Weapon · +1 extra trait]
            </span>
          )}
        </div>
        {!readOnly && (
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

      {/* Editable stats */}
      {!readOnly && (
        <div class="flex gap-2 text-sm">
          <label>
            Damage:{" "}
            <input
              type="number"
              class="w-12 border rounded px-1"
              value={mw.damage}
              onInput={(e) =>
                onUpdate(location, index, {
                  damage: Number((e.target as HTMLInputElement).value) || 0,
                })}
            />
          </label>
          <label>
            Weight:{" "}
            <input
              type="number"
              class="w-12 border rounded px-1"
              min="0"
              value={mw.weight}
              onInput={(e) =>
                onUpdate(location, index, {
                  weight: Math.max(
                    0,
                    Number((e.target as HTMLInputElement).value) || 0,
                  ),
                })}
            />
          </label>
        </div>
      )}

      {/* Description */}
      {readOnly
        ? (
          mw.description && (
            <div class="text-xs text-base-content/70 whitespace-pre-line ml-2">
              {mw.description}
            </div>
          )
        )
        : (
          <textarea
            class="w-full text-xs border rounded px-2 py-1"
            placeholder="Weapon description…"
            rows={2}
            value={mw.description}
            onInput={(e) =>
              onUpdate(location, index, {
                description: (e.target as HTMLTextAreaElement).value,
              })}
          />
        )}

      {/* Melee traits */}
      <div class="space-y-0.5">
        <span class="text-xs font-medium">Traits:</span>
        {readOnly
          ? (
            mw.traitIds.length > 0
              ? (
                <ul class="ml-2 text-xs space-y-0.5">
                  {mw.traitIds.map((tid) => {
                    const trait = MELEE_TRAITS_BY_ID.get(tid);
                    return (
                      <li key={tid}>
                        <strong>{trait?.name ?? tid}:</strong>{" "}
                        {trait?.description ?? ""}
                      </li>
                    );
                  })}
                </ul>
              )
              : <span class="text-xs text-base-content/50 ml-1">None</span>
          )
          : (
            <div class="ml-2 flex flex-wrap gap-1">
              {MELEE_TRAITS.map((trait) => {
                const active = mw.traitIds.includes(trait.id);
                return (
                  <button
                    key={trait.id}
                    type="button"
                    class={`text-xs px-1.5 py-0.5 rounded border ${
                      active
                        ? "bg-primary/20 border-primary/70"
                        : "hover:bg-base-200"
                    }`}
                    title={trait.description}
                    onClick={() =>
                      onToggleTrait(location, index, trait.id)}
                  >
                    {trait.name}
                  </button>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
