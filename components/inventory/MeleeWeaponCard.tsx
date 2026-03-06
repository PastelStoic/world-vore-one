// ---------------------------------------------------------------------------
// MeleeWeaponCard – renders a premade melee weapon in the inventory
// ---------------------------------------------------------------------------

import type { InventoryMeleeWeapon } from "@/lib/inventory_types.ts";
import { MELEE_TRAITS_BY_ID, MELEE_WEAPONS_BY_ID } from "@/data/equipment.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
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
      {def.traitIds.length > 0 && (
        <div class="space-y-0.5">
          <span class="text-xs font-medium">Traits:</span>
          <ul class="ml-2 text-xs space-y-0.5">
            {def.traitIds.map((tid) => {
              const trait = MELEE_TRAITS_BY_ID.get(tid);
              return (
                <li key={tid}>
                  <strong>{trait?.name ?? tid}:</strong>{" "}
                  {trait?.description ?? ""}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
