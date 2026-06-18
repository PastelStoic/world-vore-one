import type { VehicleModuleTypeDefinition } from "./equipment_types.ts";

// ---------------------------------------------------------------------------
// DATA - Vehicle module types (weapons and non-weapon components)
// ---------------------------------------------------------------------------

export const VEHICLE_MODULE_TYPES: VehicleModuleTypeDefinition[] = [
  {
    id: "machine-gun",
    name: "Machine gun",
    description:
      "Vehicle-mounted automatic weapon for suppressing infantry and light targets.",
    hp: 4,
    position: "external",
    destructionEffect: "This machine gun cannot be fired.",
    weaponStats: {
      damage: "3",
      rateOfFire: 4,
      ammoCapacity: 200,
      reloadSpeed: 2,
    },
  },
  {
    id: "light-cannon",
    name: "Light cannon",
    description:
      "Rapid-firing cannon suited to light armor, emplacements, and exposed infantry.",
    hp: 8,
    position: "external",
    destructionEffect: "This cannon cannot be fired.",
    weaponStats: {
      damage: "5",
      rateOfFire: 3,
      ammoCapacity: 150,
      reloadSpeed: 3,
    },
  },
  {
    id: "anti-armor-missile-launcher",
    name: "Anti-armor missile launcher",
    description:
      "Guided missile launcher meant for threatening armored vehicles at range.",
    hp: 5,
    position: "external",
    destructionEffect: "This launcher cannot be fired.",
    weaponStats: {
      damage: "12",
      rateOfFire: 1,
      ammoCapacity: 2,
      reloadSpeed: 4,
    },
  },
  {
    id: "engine",
    name: "Engine",
    description:
      "Powers the vehicle's movement. Internal and well protected, but disabling it cripples mobility.",
    hp: 10,
    position: "internal",
    destructionEffect:
      "Vehicle speed is halved and it cannot accelerate for the rest of the scene.",
  },
  {
    id: "transmission",
    name: "Transmission",
    description:
      "Transfers engine power to the tracks or wheels. Critical for keeping the vehicle mobile.",
    hp: 6,
    position: "internal",
    destructionEffect: "Vehicle is immobilized for the rest of the scene.",
  },
];

export const VEHICLE_MODULE_TYPES_BY_ID = new Map(
  VEHICLE_MODULE_TYPES.map((type) => [type.id, type]),
);