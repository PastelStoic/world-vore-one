import type { VehicleDefinition } from "./equipment_types.ts";

// Reusable module definitions are referenced by ID from VehicleDefinition.modules.

// ---------------------------------------------------------------------------
// DATA - Vehicles
// ---------------------------------------------------------------------------

export const VEHICLES: VehicleDefinition[] = [

  // BRITISH VEHICLES
  
  {
    id: "mark_v",
    name: "Tank, mark IV ( MALE )",
    nation: "Britain",
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
      "tracks",
      "light-ammo-stowage",
    ],
    description:
      `The first tank of the war, but outdated by this point - nevertheless, it remains in production and use alike.

      Crew:
      1 commander ( 5/5/5 ).
      1 driver ( 5/5/5 ).
      1 engineer ( 5/5/5 ).
      6 gunner & assistant gunners ( 3/3/4 ).

      *The commander mans one of the frontal machineguns.
      *The cannons can only aim forward; they cannot target an enemy at distance 3 or closer, as the side-sponsons will not have visibility in such a case.
      *Each machinegun can only fire in their respective directions. Difficulty doubled if trying to attack a machinegun that's on the opposite end.
      *One machinegun points left, one right, and one to the front.`,
  },

  {
    id: "mark_v_female",
    name: "Tank, mark IV ( FEMALE )",
    nation: "Britain",
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
      "frontal-machine-gun",
      "frontal-machine-gun",
      "frontal-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
      "light-ammo-stowage",
    ],
    description:
      `The first tank of the war, but outdated by this point - nevertheless, it remains in production and use alike. Female variant, sporting only MGs.

      Crew:
      1 commander ( 5/5/5 ).
      1 driver ( 5/5/5 ).
      1 engineer ( 5/5/5 ).
      6 gunner & assistant gunners ( 3/3/4 ).

      *The commander mans one of the frontal machineguns.
      *Two frontal machineguns can only aim forward; they cannot target an enemy at distance 3 or closer, as the side-sponsons will not have visibility in such a case.
      *Each machinegun can only fire in their respective directions. Difficulty doubled if trying to attack a machinegun that's on the opposite end.
      *One machinegun points left, one right, and one to the front.`,
  },

// GERMAN VEHICLES

  {
    id: "a7v",
    name: "Sturmpanzerwagen A7V ( MALE )",
    nation: "Germany",
    pointCost: 6,
    armor: {
      front: "heavy",
      side: "medium",
      rear: "heavy",
    },
    seats: 9,
    doors: 2,
    crew: 11,
    size: 54,
    agility: 1,
    speed: 1,
    modules: [
      "light-cannon",
      "rear-light-cannon",
      "side-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
      "light-ammo-stowage",
    ],
    description:
      `German tank, more closely resembling a pilbox on threads! Outdated, but still used - crew has been optimized!

      Crew:
      1 commander ( 5/5/5 ).
      1 driver ( 5/5/5 ).
      1 engineer ( 5/5/5 ).
      1 frontal gunner & assistant gunner ( 3/4/5 ).
      1 rear gunner & assistant gunner ( 5/4/3 ).
      4 lateral machinegunners ( 4/3/4 ).

      *One cannon is aiming forwards, one cannon is aming backwards.
      *Each machinegun can only fire in their respective directions. Difficulty doubled if trying to attack a machinegun that's on the opposite end.
      *Two machineguns point left, and two machineguns point right.`
  },

  {
    id: "a7v_female",
    name: "Sturmpanzerwagen A7V ( FEMALE )",
    nation: "Germany",
    pointCost: 6,
    armor: {
      front: "heavy",
      side: "medium",
      rear: "heavy",
    },
    seats: 9,
    doors: 2,
    crew: 11,
    size: 54,
    agility: 1,
    speed: 1,
    modules: [
      "front-machine-gun",
      "front-machine-gun",
      "rear-machine-gun",
      "rear-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
      "light-ammo-stowage",
    ],
    description:
      `German tank, more closely resembling a pilbox on threads! Outdated, but still used - crew has been optimized! Female variant, with only MGs!

      Crew:
      1 commander ( 5/5/5 ).
      1 driver ( 5/5/5 ).
      1 engineer ( 5/5/5 ).
      2 frontal machhinegunners ( 3/4/5 ).
      2 rear machinegunners ( 5/4/3 ).
      4 lateral machinegunners ( 4/3/4 ).

      *Each machinegun can only fire in their respective directions. Difficulty doubled if trying to attack a machinegun that's on the opposite end.
      *Two machineguns in each direction; front, left, right and rear.`
  },
  
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));
