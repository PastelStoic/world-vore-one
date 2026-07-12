// ---------------------------------------------------------------------------
// VehicleCard - renders a single vehicle item in the inventory
// ---------------------------------------------------------------------------

import { VEHICLES_BY_ID } from "@/data/equipment.ts";
import type { InventoryVehicle } from "@/lib/inventory_types.ts";
import {
  formatVehicleModuleDetails,
  formatVehicleModuleLabel,
  getVehicleHp,
} from "@/lib/vehicle_module_helpers.ts";
import type { InventoryLocation } from "./helpers.ts";
import TraitBadge from "./TraitBadge.tsx";

interface VehicleCardProps {
  vehicle: InventoryVehicle;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  onMove: (
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
}

export default function VehicleCard(props: VehicleCardProps) {
  const { vehicle, location, index, readOnly, onMove, onRemove } = props;
  const def = VEHICLES_BY_ID.get(vehicle.vehicleId);

  if (!def) {
    return (
      <div class="border rounded p-2 bg-base-100 text-sm text-error flex items-center justify-between flex-wrap gap-1">
        <span>
          Unknown vehicle: {vehicle.vehicleId}
          <span class="block text-xs text-base-content/60 font-normal">
            Removed from game data — remove to free inventory slots/points.
          </span>
        </span>
        {!readOnly && (
          <button
            type="button"
            class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
            onClick={() => onRemove(location, index)}
            title="Remove invalid item and refund its inventory cost"
          >
            Remove & refund
          </button>
        )}
      </div>
    );
  }

  return (
    <div class="border rounded p-2 space-y-1 bg-base-100">
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          <strong>{def.name}</strong>{" "}
          <span class="text-xs text-base-content/60">
            ({def.nation} · Size: {def.size} · Agility: {def.agility} · Speed:
            {" "}
            {def.speed} · HP: {getVehicleHp(def)} · Crew: {def.crew} · Seats:
            {def.seats} ·
            Doors:{" "}
            {def.doors})
          </span>
        </div>
        {!readOnly && (
          <div class="flex gap-1">
            {location === "carried" && (
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded hover:bg-base-200"
                onClick={() => onMove(location, index, "stowed")}
              >
                → Stow
              </button>
            )}
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
      <div class="flex flex-wrap gap-3 text-xs text-base-content/70 ml-2">
        <span>Front: {def.armor.front}</span>
        <span>Side: {def.armor.side}</span>
        <span>Rear: {def.armor.rear}</span>
      </div>
      {def.modules.length > 0 && (
        <div class="ml-2 space-y-1">
          <span class="text-xs font-medium text-base-content/70">Modules:</span>
          <div class="flex flex-wrap gap-1">
            {def.modules.map((module, i) => (
              <TraitBadge
                key={`module-${i}`}
                name={formatVehicleModuleLabel(module)}
                description={formatVehicleModuleDetails(module)}
              />
            ))}
          </div>
        </div>
      )}
      {def.description && (
        <p class="text-xs text-base-content/70 whitespace-pre-line ml-2">
          {def.description}
        </p>
      )}
    </div>
  );
}
