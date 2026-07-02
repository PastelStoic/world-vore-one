import type { VehicleDefinition } from "./equipment_types.ts";

// Reusable module definitions are referenced by ID from VehicleDefinition.modules.

// ---------------------------------------------------------------------------
// DATA - Vehicles
// ---------------------------------------------------------------------------

export const VEHICLES: VehicleDefinition[] = [
  {
    id: "m2-bradley-ifv",
    name: "M2 Bradley IFV",
    nation: "United States",
    pointCost: 2,
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
    speed: 10,
    modules: [
      "light-cannon",
      "frontal-machine-gun",
      "engine",
      "fuel-tanks",
    ],
    description:
      "Infantry fighting vehicle with a crew and carried infantry squad. Heavier frontal armor with lighter flank and rear protection.",
  },
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));