// ---------------------------------------------------------------------------
// VehicleCard - renders a single vehicle item in the inventory
// ---------------------------------------------------------------------------

import { VEHICLE_TRAITS_BY_ID, VEHICLES_BY_ID } from "@/data/equipment.ts";
import type { InventoryVehicle } from "@/lib/inventory_types.ts";
import {
  formatVehicleModuleDetails,
  formatVehicleModuleLabel,
  getEffectiveVehicleTraitIds,
  getVehicleHp,
  groupVehicleModules,
} from "@/lib/vehicle_module_helpers.ts";
import DeprecatedBadge from "@/components/DeprecatedBadge.tsx";
import type { InventoryLocation } from "./helpers.ts";
import TraitBadge from "./TraitBadge.tsx";
import UnknownInventoryItem from "./UnknownInventoryItem.tsx";
import InventoryItemActions from "./InventoryItemActions.tsx";
import PatronToggle, { PatronBadge } from "./PatronToggle.tsx";

interface VehicleCardProps {
  vehicle: InventoryVehicle;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  hasPatronPerk?: boolean;
  onTogglePatron?: (location: InventoryLocation, index: number) => void;
  onMove: (
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
}

export default function VehicleCard(props: VehicleCardProps) {
  const {
    vehicle,
    location,
    index,
    readOnly,
    hasPatronPerk,
    onTogglePatron,
    onMove,
    onRemove,
  } = props;
  const isPatron = !!vehicle.isPatron && !!hasPatronPerk;
  const def = VEHICLES_BY_ID.get(vehicle.vehicleId);

  if (!def) {
    return (
      <UnknownInventoryItem
        kind="vehicle"
        id={vehicle.vehicleId}
        readOnly={readOnly}
        onRemove={() => onRemove(location, index)}
      />
    );
  }

  const traitIds = getEffectiveVehicleTraitIds(def);

  return (
    <div
      class={`border rounded p-2 space-y-1 ${
        isPatron ? "bg-secondary/10 border-secondary/50" : "bg-base-100"
      }`}
    >
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          <strong>{def.name}</strong>
          {def.deprecated && <DeprecatedBadge />}{" "}
          <span class="text-xs text-base-content/60">
            ({def.nation} · Size: {def.size} · Speed: {def.speed} · HP:{" "}
            {getVehicleHp(def)} · Crew: {def.crew} · Seats: {def.seats} · Doors:
            {def.doors})
          </span>
          {isPatron && <PatronBadge />}
        </div>
        {!readOnly && (
          <div class="flex gap-1 flex-wrap">
            {hasPatronPerk && onTogglePatron && (
              <PatronToggle
                active={isPatron}
                onClick={() => onTogglePatron(location, index)}
              />
            )}
            <InventoryItemActions
              location={location}
              deprecated={def.deprecated}
              canMove={location === "carried"}
              onMove={(to) => onMove(location, index, to)}
              onRemove={() => onRemove(location, index)}
            />
          </div>
        )}
      </div>
      <div class="flex flex-wrap gap-3 text-xs text-base-content/70 ml-2">
        <span>Front: {def.armor.front}</span>
        <span>Side: {def.armor.side}</span>
        <span>Rear: {def.armor.rear}</span>
      </div>
      {traitIds.length > 0 && (
        <div class="ml-2 space-y-1">
          <span class="text-xs font-medium text-base-content/70">Traits:</span>
          <div class="flex flex-wrap gap-1">
            {traitIds.map((tid) => {
              const trait = VEHICLE_TRAITS_BY_ID.get(tid);
              return (
                <TraitBadge
                  key={tid}
                  name={trait?.name ?? tid}
                  description={trait?.description ?? ""}
                />
              );
            })}
          </div>
        </div>
      )}
      {def.modules.length > 0 && (
        <div class="ml-2 space-y-1">
          <span class="text-xs font-medium text-base-content/70">Modules:</span>
          <div class="flex flex-wrap gap-1">
            {groupVehicleModules(def.modules).map((
              { moduleId, moduleIds, count },
            ) => (
              <TraitBadge
                key={moduleId}
                name={formatVehicleModuleLabel(moduleId, count)}
                description={formatVehicleModuleDetails(moduleIds)}
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
