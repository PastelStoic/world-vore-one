import type { VehicleDefinition } from "./equipment_types.ts";

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
    modules: [
      { moduleTypeId: "light-cannon", count: 1 },
      { moduleTypeId: "machine-gun", count: 1 },
      { moduleTypeId: "anti-armor-missile-launcher", count: 2 },
      { moduleTypeId: "engine", count: 1 },
      { moduleTypeId: "transmission", count: 1 },
    ],
    description:
      "Infantry fighting vehicle with a crew and carried infantry squad. The stats emphasize its heavier frontal profile, lighter flank and rear protection, and mixed cannon, machine gun, and missile armament.",
  },
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));