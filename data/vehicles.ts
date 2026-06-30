import type { VehicleDefinition } from "./equipment_types.ts";

// Vehicle weapons are modules. Reusable weapon/module definitions (including hp and mounting stats)
// are referenced directly by ID string from VehicleDefinition.modules.

// ---------------------------------------------------------------------------
// DATA - Vehicles
// ---------------------------------------------------------------------------

export const VEHICLES: VehicleDefinition[] = [
  {
    id: "m2-bradley-ifv",
    name: "M2 Bradley IFV",
    nation: "United States",
    armor: {
      front: "medium",
      side: "light",
      rear: "light",
    },
    seats: 9,
    doors: 2,
    crew: 3,
    size: 100,
    agility: 10,
    modules: ["light-cannon","vehicle-machine-gun"],
    description:
      "Infantry fighting vehicle with a crew and carried infantry squad. Heavier frontal armor with lighter flank and rear protection.",
  },
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));
