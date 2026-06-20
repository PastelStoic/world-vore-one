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
    modules: [
      {
        name: "Light cannon",
        description:
          "Rapid-firing cannon suited to light armor, emplacements, and exposed infantry.",
        hp: 8,
        position: "external",
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