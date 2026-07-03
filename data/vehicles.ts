import type { VehicleDefinition } from "./equipment_types.ts";

// Reusable module definitions are referenced by ID from VehicleDefinition.modules.

// ---------------------------------------------------------------------------
// DATA - Vehicles
// ---------------------------------------------------------------------------

export const VEHICLES: VehicleDefinition[] = [
  {
    id: "mark_v",
    name: "Tank, mark IV ( MALE )",
    nation: "United Kingdom",
    pointCost: 6,
    armor: {
      front: "medium",
      side: "medium",
      rear: "light",
    },
    seats: 9,
    doors: 3,
    crew: 9,
    size: 54,
    agility: 1,
    speed: 2,
    modules: [
      "light-cannon",
      "light-cannon",
      "frontal-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "engine",
      "fuel-tanks",
    ],
    description:
      `The first tank of the war, but outdated by this point - nevertheless, it remains in production and use alike.

      Crew:
      1 commander ( 5/5/5 ).
      1 driver ( 5/5/5 ).
      1 engineer ( 5/5/5 ).
      6 gunner & assistant gunners ( 3/3/4 ).
      
      *The cannons can only aim forward; they cannot target an enemy at distance 3 or closer, as the side-sponsons will not have visibility in such a case.
      *Each machinegun can only fire in their respective directions. Difficulty doubled if trying to attack a machinegun that's on the opposite end.
      *One machinegun points left, one right, and one to the rear.`,
  },
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));
