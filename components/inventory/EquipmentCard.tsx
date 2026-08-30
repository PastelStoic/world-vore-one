// ---------------------------------------------------------------------------
// EquipmentCard – renders a single equipment item in the inventory
// ---------------------------------------------------------------------------

import type { InventoryEquipment } from "@/lib/inventory_types.ts";
import { EQUIPMENT_BY_ID } from "@/data/equipment.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
import PerkDescription from "@/components/PerkDescription.tsx";
import DeprecatedBadge from "@/components/DeprecatedBadge.tsx";
import { type InventoryLocation, isEquipmentConcealed } from "./helpers.ts";
import UnknownInventoryItem from "./UnknownInventoryItem.tsx";
import InventoryItemActions from "./InventoryItemActions.tsx";
import ChargeTracker from "./ChargeTracker.tsx";

interface EquipmentCardProps {
  equipment: InventoryEquipment;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  /** When true, charge usage buttons are disabled (non-owner viewer) */
  combatReadOnly?: boolean;
  carriedBulkyCount: number;
  onMove: (
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
  onSetTotalCharges: (
    location: InventoryLocation,
    index: number,
    total: number,
  ) => void;
  onToggleCharge: (
    location: InventoryLocation,
    index: number,
    chargeIndex: number,
  ) => void;
  onToggleConcealed: (location: InventoryLocation, index: number) => void;
}

export default function EquipmentCard(props: EquipmentCardProps) {
  const {
    equipment: eq,
    location,
    index,
    readOnly,
    combatReadOnly,
    carriedBulkyCount,
    onMove,
    onRemove,
    onSetTotalCharges,
    onToggleCharge,
    onToggleConcealed,
  } = props;

  const def = EQUIPMENT_BY_ID.get(eq.equipmentId);
  if (!def) {
    return (
      <UnknownInventoryItem
        kind="equipment"
        id={eq.equipmentId}
        readOnly={readOnly}
        onRemove={() => onRemove(location, index)}
      />
    );
  }

  const effectiveWeight = eq.weightOverride ?? def.weight;
  const effectiveBulky = eq.isBulkyOverride ?? def.isBulky;
  const remaining = def.isCharge
    ? Math.max(0, eq.totalCharges - eq.usedCharges)
    : 0;
  const currentWeight = def.isCharge
    ? effectiveWeight * remaining
    : effectiveWeight;
  const canMoveToOther = !(
    location === "stowed" &&
    effectiveBulky &&
    carriedBulkyCount > 0
  );
  const isPerkGranted = !!eq.perkGranted;
  const grantingPerkName = isPerkGranted
    ? PERKS_BY_ID.get(eq.perkGranted!)?.name ?? eq.perkGranted
    : null;
  const isConcealed = isEquipmentConcealed(eq);

  return (
    <div class="border rounded p-2 space-y-1 bg-base-100">
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          <strong>{def.name}</strong>
          {def.deprecated && <DeprecatedBadge />}{" "}
          <span class="text-xs text-base-content/60">
            (W:{currentWeight}
            {effectiveBulky ? " · Bulky" : ""})
          </span>
          {isPerkGranted && (
            <span class="ml-1 text-xs font-semibold text-primary">
              [{grantingPerkName}]
            </span>
          )}
          {isConcealed && (
            <span
              class="ml-1 text-xs font-semibold text-info"
              title="Only visible to the character owner and admins"
            >
              [Concealed]
            </span>
          )}
        </div>
        {!readOnly && (
          <div class="flex gap-1 flex-wrap">
            <button
              type="button"
              class={`px-2 py-0.5 text-xs border rounded ${
                isConcealed
                  ? "bg-info/20 border-info/60 text-info"
                  : "hover:bg-info/10 text-info"
              }`}
              onClick={() => onToggleConcealed(location, index)}
              title={isConcealed
                ? "Show this item on the public character sheet"
                : "Hide this item from public character sheet viewers"}
            >
              {isConcealed ? "Concealed" : "Conceal"}
            </button>
            {(!isPerkGranted || def.deprecated) && (
              <InventoryItemActions
                location={location}
                deprecated={def.deprecated}
                canMove={!isPerkGranted}
                moveDisabled={!canMoveToOther}
                moveTitle={!canMoveToOther
                  ? "Only one bulky kit can be carried at a time"
                  : undefined}
                onMove={(to) => onMove(location, index, to)}
                onRemove={() => onRemove(location, index)}
              />
            )}
          </div>
        )}
      </div>

      <div class="text-xs text-base-content/70 whitespace-pre-line ml-2">
        <PerkDescription
          name=""
          description={def.description}
          hideByDefault
        />
      </div>

      {/* Charge tracking with checkboxes – editable for owner/admin combat tracking */}
      {def.isCharge && (
        <ChargeTracker
          totalCharges={eq.totalCharges}
          usedCharges={eq.usedCharges}
          currentWeight={currentWeight}
          readOnly={readOnly}
          combatReadOnly={combatReadOnly}
          onSetTotalCharges={(total) =>
            onSetTotalCharges(location, index, total)}
          onToggleCharge={(ci) => onToggleCharge(location, index, ci)}
        />
      )}
    </div>
  );
}
