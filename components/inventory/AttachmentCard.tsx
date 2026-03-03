// ---------------------------------------------------------------------------
// AttachmentCard – renders a loose (unattached) attachment in the inventory
// ---------------------------------------------------------------------------

import type { InventoryAttachment } from "../../lib/inventory_types.ts";
import { ATTACHMENTS_BY_ID } from "../../data/equipment.ts";
import PerkDescription from "../PerkDescription.tsx";
import type { InventoryLocation } from "./helpers.ts";

interface AttachmentCardProps {
  attachment: InventoryAttachment;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  onMove: (from: InventoryLocation, index: number, to: InventoryLocation) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
  onSetTotalCharges: (location: InventoryLocation, index: number, total: number) => void;
  onToggleCharge: (location: InventoryLocation, index: number, chargeIndex: number) => void;
}

export default function AttachmentCard(props: AttachmentCardProps) {
  const {
    attachment: att,
    location,
    index,
    readOnly,
    onMove,
    onRemove,
    onSetTotalCharges,
    onToggleCharge,
  } = props;

  const def = ATTACHMENTS_BY_ID.get(att.attachmentId);
  if (!def) {
    return (
      <div class="text-error">Unknown attachment: {att.attachmentId}</div>
    );
  }

  const otherLocation: InventoryLocation = location === "carried"
    ? "stowed"
    : "carried";
  const remaining = def.isCharge
    ? Math.max(0, att.totalCharges - att.usedCharges)
    : 0;
  const currentWeight = def.isCharge ? def.weight * remaining : def.weight;

  return (
    <div class="border rounded p-2 space-y-1 bg-base-100">
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          <strong>{def.name}</strong>{" "}
          <span class="text-xs text-base-content/60">
            (W:{currentWeight} · For: {def.appliesTo})
          </span>
        </div>
        {!readOnly && (
          <div class="flex gap-1">
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

      <div class="text-xs text-base-content/70 whitespace-pre-line ml-2">
        <PerkDescription
          name=""
          description={def.description}
          hideByDefault
        />
      </div>

      {/* Charge tracking for charge-based attachments */}
      {def.isCharge && (
        <div class="space-y-1 text-sm">
          <div class="flex items-center gap-2">
            <span>Charges:</span>
            {!readOnly && (
              <span class="text-xs text-base-content/60">
                (Total:{" "}
                <input
                  type="number"
                  class="w-12 border rounded px-1 text-xs"
                  min="1"
                  value={att.totalCharges}
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
            {Array.from({ length: att.totalCharges }, (_, ci) => {
              const isUsed = ci >= att.totalCharges - att.usedCharges;
              return (
                <button
                  key={ci}
                  type="button"
                  class={`w-6 h-6 border rounded text-xs flex items-center justify-center ${
                    isUsed
                      ? "bg-error/20 border-error/70 text-error"
                      : "bg-success/10 border-success/70 text-success"
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
          <div class="text-xs text-base-content/60 ml-2">
            {remaining} remaining · {att.usedCharges} used · W:{currentWeight}
          </div>
        </div>
      )}
    </div>
  );
}
