import type { VehicleDefinition } from "./equipment_types.ts";

// Note: Vehicle weapon stats now come from reusable VEHICLE_WEAPONS via vehicleWeaponId.
// Mounting-specific data (hp, difficulty, position, destructionEffect, count) stay per-vehicle.

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
    modules: [
      {
        name: "Light cannon",
        vehicleWeaponId: "light-cannon",
        hp: 8,
        position: "external",
        difficulty: { front: "10", side: "7", rear: "6" },
        destructionEffect: "This cannon cannot be fired.",
        count: 1,
      },
      {
        name: "Machine gun",
        vehicleWeaponId: "vehicle-machine-gun",
        hp: 4,
        position: "external",
        difficulty: { front: "9", side: "7", rear: "6" },
        destructionEffect: "This machine gun cannot be fired.",
        count: 1,
      },
      {
        name: "Anti-armor missile launcher",
        vehicleWeaponId: "anti-armor-missile-launcher",
        hp: 5,
        position: "external",
        difficulty: { front: "12", side: "6", rear: "7" },
        destructionEffect: "This launcher cannot be fired.",
        count: 2,
      },
      {
        name: "Engine",
        description:
          "Powers the vehicle's movement. Internal and well protected, but disabling it cripples mobility.",
        hp: 10,
        position: "internal",
        difficulty: { front: "14", side: "11", rear: "9" },
        destructionEffect:
          "Vehicle speed is halved and it cannot accelerate for the rest of the scene.",
        count: 1,
      },
      {
        name: "Transmission",
        description:
          "Transfers engine power to the tracks or wheels. Critical for keeping the vehicle mobile.",
        hp: 6,
        position: "internal",
        difficulty: { front: "13", side: "10", rear: "8" },
        destructionEffect: "Vehicle is immobilized for the rest of the scene.",
        count: 1,
      },
    ],
    description:
      "Infantry fighting vehicle with a crew and carried infantry squad. Heavier frontal armor with lighter flank and rear protection.",
  },
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));
