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
    doors: 2,
    crew: 3,
    size: 100,
    modules: [
      {
        name: "Light cannon",
        description:
          "Rapid-firing cannon suited to light armor, emplacements, and exposed infantry.",
        hp: 8,
        position: "external",
        difficulty: { front: "10", side: "7", rear: "6" },
        destructionEffect: "This cannon cannot be fired.",
        count: 1,
        damage: "5",
        rateOfFire: 3,
        ammoCapacity: 150,
        reloadSpeed: 3,
      },
      {
        name: "Machine gun",
        description:
          "Vehicle-mounted automatic weapon for suppressing infantry and light targets.",
        hp: 4,
        position: "external",
        difficulty: { front: "9", side: "7", rear: "6" },
        destructionEffect: "This machine gun cannot be fired.",
        count: 1,
        damage: "3",
        rateOfFire: 4,
        ammoCapacity: 200,
        reloadSpeed: 2,
      },
      {
        name: "Anti-armor missile launcher",
        description:
          "Guided missile launcher meant for threatening armored vehicles at range.",
        hp: 5,
        position: "external",
        difficulty: { front: "12", side: "6", rear: "7" },
        destructionEffect: "This launcher cannot be fired.",
        count: 2,
        damage: "12",
        rateOfFire: 1,
        ammoCapacity: 2,
        reloadSpeed: 4,
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