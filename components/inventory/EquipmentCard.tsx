// ---------------------------------------------------------------------------
// EquipmentCard – renders a single equipment item in the inventory
// ---------------------------------------------------------------------------

import type { InventoryEquipment } from "../../lib/inventory_types.ts";
import { EQUIPMENT_BY_ID } from "../../data/equipment.ts";
import PerkDescription from "../PerkDescription.tsx";
import type { InventoryLocation } from "./helpers.ts";

interface EquipmentCardProps {
  equipment: InventoryEquipment;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  carriedBulkyCount: number;
  onMove: (from: InventoryLocation, index: number, to: InventoryLocation) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
  onSetTotalCharges: (location: InventoryLocation, index: number, total: number) => void;
  onToggleCharge: (location: InventoryLocation, index: number, chargeIndex: number) => void;
}

export default function EquipmentCard(props: EquipmentCardProps) {
  const {
    equipment: eq,
    location,
    index,
    readOnly,
    carriedBulkyCount,
    onMove,
    onRemove,
    onSetTotalCharges,
    onToggleCharge,
  } = props;

  const def = EQUIPMENT_BY_ID.get(eq.equipmentId);
  if (!def) {
    return (
      <div class="text-red-500">Unknown equipment: {eq.equipmentId}</div>
    );
  }

  const otherLocation: InventoryLocation = location === "carried"
    ? "stowed"
    : "carried";

  const remaining = def.isCharge
    ? Math.max(0, eq.totalCharges - eq.usedCharges)
    : 0;
  const currentWeight = def.isCharge ? def.weight * remaining : def.weight;
  const canMoveToOther = !(
    otherLocation === "carried" &&
    def.isBulky &&
    carriedBulkyCount > 0
  );

  return (
    <div class="border rounded p-2 space-y-1 bg-white">
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          <strong>{def.name}</strong>{" "}
          <span class="text-xs text-gray-500">
            (W:{currentWeight}
            {def.isBulky ? " · Bulky" : ""})
          </span>
        </div>
        {!readOnly && (
          <div class="flex gap-1">
            <button
              type="button"
              class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => onMove(location, index, otherLocation)}
              disabled={!canMoveToOther}
              title={!canMoveToOther
                ? "Only one bulky kit can be carried at a time"
                : undefined}
            >
              → {otherLocation === "carried" ? "Carry" : "Stow"}
            </button>
            <button
              type="button"
              class="px-2 py-0.5 text-xs border rounded text-red-600 hover:bg-red-50"
              onClick={() => onRemove(location, index)}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div class="text-xs text-gray-600 whitespace-pre-line ml-2">
        <PerkDescription
          name=""
          description={def.description}
          hideByDefault
        />
      </div>

      {/* Charge tracking with checkboxes – always interactive for combat tracking */}
      {def.isCharge && (
        <div class="space-y-1 text-sm">
          <div class="flex items-center gap-2">
            <span>Charges:</span>
            {!readOnly && (
              <span class="text-xs text-gray-500">
                (Total:{" "}
                <input
                  type="number"
                  class="w-12 border rounded px-1 text-xs"
                  min="1"
                  value={eq.totalCharges}
                  onInput={(e) => {
                    const val = Number((e.target as HTMLInputElement).value);
                    if (!Number.isNaN(val)) {
                      onSetTotalCharges(location, index, val);
                    }
                  }}
                />
                )
              </span>
            )}
          </div>
          <div class="flex flex-wrap gap-1 ml-2">
            {Array.from({ length: eq.totalCharges }, (_, ci) => {
              const isUsed = ci >= eq.totalCharges - eq.usedCharges;
              return (
                <button
                  key={ci}
                  type="button"
                  class={`w-6 h-6 border rounded text-xs flex items-center justify-center ${
                    isUsed
                      ? "bg-red-100 border-red-400 text-red-600"
                      : "bg-green-50 border-green-400 text-green-700"
                  } cursor-pointer hover:opacity-75`}
                  title={isUsed
                    ? "Used (click to restore)"
                    : "Available (click to use)"}
                  onClick={() => onToggleCharge(location, index, ci)}
                >
                  {isUsed ? "✕" : "●"}
                </button>
              );
            })}
          </div>
          <div class="text-xs text-gray-500 ml-2">
            {remaining} remaining · {eq.usedCharges} used · W:{currentWeight}
          </div>
        </div>
      )}
    </div>
  );
}
