import type { VehicleDefinition } from "./equipment_types.ts";

// Reusable module definitions are referenced by ID from VehicleDefinition.modules.

// ---------------------------------------------------------------------------
// DATA - Vehicles
// ---------------------------------------------------------------------------

export const VEHICLES: VehicleDefinition[] = [
  // BRITISH VEHICLES

  {
    id: "mark-v",
    name: "Tank, Mark IV ( MALE )",
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
    speed: 2,
    modules: [
      "light-cannon",
      "light-cannon",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
      "light-ammo-stowage",
    ],
    traitIds: ["directional-mounts"],
    description:
      `The first tank of the war, but outdated by this point - nevertheless, it remains in production and use alike.

      Crew:
      1 commander (3).
      1 driver (3).
      1 engineer (3).
      2 cannon gunners (2).
      2 mg gunners / assitant gunners (2).
      2 loaders (2).

      *The commander mans one of the frontal machineguns.
      *The cannons can only aim forward; they cannot target an enemy at distance 3 or closer, as the side-sponsons will not have visibility in such a case.
      *Assistant gunners can help reload the cannons on their respective side. Loaders can help reload any weapon on their respective side, except the commander's
      *One machinegun points left, one right, and one to the front.`,
  },

  {
    id: "mark-v-female",
    name: "Tank, Mark IV ( FEMALE )",
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
    speed: 2,
    modules: [
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
    ],
    traitIds: ["directional-mounts"],
    description:
      `The first tank of the war, but outdated by this point - nevertheless, it remains in production and use alike. Female variant, sporting only MGs.

      Crew:
      1 commander (3).
      1 driver (3).
      1 engineer (3).
      4 mg gunners (2).
      2 loaders (2).

      *The commander mans one of the frontal machineguns.
      *Two frontal machineguns can only aim forward; they cannot target an enemy at distance 3 or closer, as the side-sponsons will not have visibility in such a case.
      *Loaders can help reload any weapon on their respective side, except the commander's.
      *One machinegun points left, one right, and one to the front.`,
  },

  {
    id: "hornet",
    name: "Tank, Hornet",
    nation: "Britain",
    pointCost: 6,
    armor: {
      front: "medium",
      side: "light",
      rear: "light",
    },
    seats: 5,
    doors: 2,
    crew: 5,
    size: 54,
    speed: 3,
    modules: [
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
    ],
    traitIds: ["directional-mounts"],
    description:
      `Light and fast "cavalry" tank, meant to fit Britain's armor doctrine. Faster than most other tanks, but only armed with machineguns!

      Crew:
      1 commander (3).
      1 driver (3).
      1 engineer (3)
      2 gunners (2).

      *The vehicle has a rear gun port, allowing one of the machineguns to be moved into it. It takes 3 turns to do so.
      *Two MGs point forward, one points left, one points right.`,
  },

  // FRENCH VEHICLES

  {
    id: "renault-f17",
    name: "Renault FT-17 ( MALE )",
    nation: "France",
    pointCost: 4,
    armor: {
      front: "medium",
      side: "light",
      rear: "light",
    },
    seats: 2,
    doors: 1,
    crew: 2,
    size: 32,
    speed: 3,
    modules: [
      "light-cannon",
      "light-turret",
      "engine",
      "fuel-tanks",
      "tracks",
      "light-ammo-stowage",
    ],
    description:
      `The first turreted tank in the world! Very small and compact, as well as easy to destroy, making it cheaper than most tanks.

      Crew:
      1 commander / gunner / engineer. (2).
      1 driver (2).
      
      *The commander is also the gunner and the engineer. Good luck doing all the work alone!`,
  },

  {
    id: "renault_f17_female",
    name: "Renault FT-17 ( FEMALE )",
    nation: "France",
    pointCost: 4,
    armor: {
      front: "medium",
      side: "light",
      rear: "light",
    },
    seats: 2,
    doors: 1,
    crew: 2,
    size: 32,
    speed: 3,
    modules: [
      "machine-gun",
      "light-turret",
      "engine",
      "fuel-tanks",
      "tracks",
    ],
    description:
      `The first turreted tank in the world! Very small and compact, as well as easy to destroy, making it cheaper than most tanks.

      Crew:
      1 commander / gunner / engineer. (2).
      1 driver (2).
      
      *The commander is also the gunner and the engineer. Good luck doing all the work alone!
      *The machinegun is inside the turret, and turns alongside it.`,
  },

  //AMERICAN VEHICLES

  {
    id: "m1915-jeffery-armored-car",
    name: "M1915 Jeffery Armored Car",
    nation: "United States",
    pointCost: 3,
    armor: {
      front: "light",
      side: "light",
      rear: "light",
    },
    seats: 5,
    doors: 2,
    crew: 5,
    size: 40,
    speed: 6,
    modules: [
      "machine-gun",
      "machine-gun",
      "light-turret",
      "light-turret",
      "engine",
      "fuel-tanks",
      "wheels-4",
    ],
    description:
      `Light armoured car with a pair of turrets!

      Crew:
      1 commander (3).
      1 driver (3).
      1 engineer (3).
      1 frontal gunner (2).
      1 rear gunner (2).

      *Two turrets, one at the front and one at the back.
      *The rear turret can only aim to the back or the sides of the vehicle - it cannot aim forwards!
      *The machineguns are inside the turrets, and turn alongside it.`,
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
    speed: 1,
    modules: [
      "light-cannon",
      "light-cannon",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
      "light-ammo-stowage",
    ],
    traitIds: ["directional-mounts"],
    description:
      `German tank, more closely resembling a pilbox on threads! Outdated, but still used - crew has been optimized!

      Crew:
      1 commander (3)
      1 driver (3)
      1 engineer (3)
      2 cannon gunners (2).
      2 assistant gunners (2).
      4 mg gunners (2).

      *One cannon is aiming forwards, one cannon is aming backwards. One gunner and asisstant gunner per cannon.
      *Two machineguns point left, and two machineguns point right.`,
  },

  {
    id: "a7v-female",
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
    speed: 1,
    modules: [
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
    ],
    traitIds: ["directional-mounts"],
    description:
      `German tank, more closely resembling a pilbox on threads! Outdated, but still used - crew has been optimized! Female variant, with only MGs!

      Crew:
      1 commander (3)
      1 driver (3)
      1 engineer (3)
      2 frontal mg gunners (2).
      2 rear mg gunners (2).
      4 mg gunners (2).

      *Two machineguns in each direction; front, left, right and rear.`,
  },

  {
    id: "k-wagen",
    name: "Großkampfwagen ( K-wagen )",
    nation: "Germany",
    pointCost: 12,
    armor: {
      front: "heavy",
      side: "heavy",
      rear: "heavy",
    },
    seats: 21,
    doors: 11,
    crew: 21,
    size: 68,
    speed: 1,
    modules: [
      "medium-cannon",
      "medium-cannon",
      "medium-cannon",
      "medium-cannon",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "machine-gun",
      "flamethrower",
      "flamethrower",
      "flamethrower-fuel-tanks",
      "engine",
      "fuel-tanks",
      "medium-tracks",
      "light-ammo-stowage",
    ],
    traitIds: ["directional-mounts"],
    description:
      `A massive bunker on threads. The pinacle of heavy tanks. Slow, cumbersome, but deadly.

      Crew:
      1 commander (3).
      1 driver (3).
      1 engineer (3).
      1 frontal mg gunner (2).
      4 lateral mg gunners (2).
      2 lateral flamethrower gunners (2).
      4 cannon gunners (2).
      10 loaders / assistant gunners (2).

      
      10 assistant gunners ( 4/3/4 )

      *One frontal machinegun, four lateral machineguns, two lateral flamethrowers.
      *Two cannons aim forward, two cannons aim backwards; all can fire to the sides and in their respective directions.
      *Two loaders / assistant gunners per cannon; two per flamethrower.`,
  },

  // MILITARY BUT GENERIC

  {
    id: "light-at-gun",
    name: "Light anti-tank gun",
    nation: "Any",
    pointCost: 2,
    armor: {
      front: "light",
      side: "none",
      rear: "none",
    },
    seats: 5,
    doors: 5,
    crew: 5,
    size: 18,
    speed: 1,
    modules: [
      "light-high-velocity-cannon",
      "light-mantlet",
      "wheels-2",
    ],
    traitIds: ["towed-gun"],
    description: `A light anti-tank gun, meant to take out ... tanks!

      Crew:
      1 commander (1)
      1 gunner (1)
      3 loaders / assistant gunners (1)
      
      *Light anti-tank gun, prone to being flanked. Reloads faster than most tanks. Crew has no protection from attacking coming from the sides/rear.`,
  },

  {
    id: "medium-at-gun",
    name: "Medium anti-tank gun",
    nation: "Any",
    pointCost: 3,
    armor: {
      front: "medium",
      side: "none",
      rear: "none",
    },
    seats: 6,
    doors: 6,
    crew: 6,
    size: 24,
    speed: 1,
    modules: [
      "medium-high-velocity-cannon",
      "medium-mantlet",
      "wheels-2",
    ],
    traitIds: ["towed-gun"],
    description:
      `A medium anti-tank gun, packs a stronger punch, vehicles should avoid it greatly!

      Crew:
      1 commander (1)
      1 gunner (1)
      4 loaders / assistant gunners (1)
      
      *Medium anti-tank gun, prone to being flanked. Reloads faster than most tanks. Crew has no protection from attacking coming from the sides/rear.`,
  },

  {
    id: "artillery-train",
    name: "Artillery train",
    nation: "Any",
    pointCost: 1,
    armor: {
      front: "none",
      side: "none",
      rear: "none",
    },
    seats: 1,
    doors: 1,
    crew: 1,
    size: 54,
    speed: 3,
    modules: [
      "artillery-train",
      "wheels-4",
    ],
    description: `An artillery train, meant to carry artillery around.

      Crew:
      1 conductor (0)
      
      *Required in order to move artillery around. Or better yet, use a truck! ...`,
  },

  {
    id: "horse-artillery-train",
    name: "Horse artillery train",
    nation: "Any",
    pointCost: 2,
    armor: {
      front: "none",
      side: "none",
      rear: "none",
    },
    seats: 1,
    doors: 1,
    crew: 1,
    size: 80,
    speed: 3,
    modules: [
      "horse-artillery-train",
      "wheels-4",
    ],
    description:
      `An artillery train, meant to carry artillery around, except its faster since it has more horses.

      Crew:
      1 conductor (0)
      
      *Required in order to move artillery around. Or better yet, use a truck! ...`,
  },

  // CIVVIE VEHICLES

  {
    id: "car",
    name: "Car",
    nation: "Civilian",
    pointCost: 1,
    armor: {
      front: "none",
      side: "none",
      rear: "none",
    },
    seats: 5,
    doors: 4,
    crew: 1,
    size: 18,
    speed: 6,
    modules: [
      "civilian-engine",
      "civilian-fuel-tank",
      "civilian-wheels-4",
    ],
    traitIds: ["focused-driver"],
    description:
      `An average ol' car. It's just like a Puma, it drives on all fours.

      Crew:
      1 driver (1)
      1 front passenger seat (1)
      3 passengers (1)
      
      *The trunk can hold up to 10 weight units of cargo.
      *Remember that people are considered to have 3 weight.`,
  },
  {
    id: "civilian_truck",
    name: "Civilian truck",
    nation: "Civilian",
    pointCost: 1,
    armor: {
      front: "none",
      side: "none",
      rear: "none",
    },
    seats: 18,
    doors: 18,
    crew: 1,
    size: 24,
    speed: 4,
    modules: [
      "civilian-engine",
      "civilian-fuel-tank",
      "civilian-wheels-4",
    ],
    traitIds: ["focused-driver", "exposed-rear-crew"],
    description:
      `A truck! A bit slower than most, but can carry a lot of weight!

      Crew:
      1 driver (1)
      1 front passenger seat (1)
      16 passengers on the back (1)

      *Each seat for passengers on the back can carry 3 weight units, for a total of 16 x 3 = 48 weight.
      *Choose whether to have a tarp cover over the back of the truck. No cover leaves the stats as they are, and rear passengers can fire out of the vehicle.
      *Covering the back with a tarp gives the rear passengers (2) cover instead, but only allows them to shoot backwards.
      *The tarp limits the doors to 4 instead, as rear passengers can longer climb along the sides of the truck, only through the rear.`,
  },
  {
    id: "motorcycle",
    name: "Motorcycle",
    nation: "Civilian",
    pointCost: 1,
    armor: {
      front: "none",
      side: "none",
      rear: "none",
    },
    seats: 2,
    doors: 2,
    crew: 1,
    size: 6,
    speed: 6,
    modules: [
      "civilian-engine",
      "civilian-fuel-tank",
      "civilian-wheels-2",
    ],
    traitIds: ["focused-driver", "exposed-crew"],
    description:
      `An average motorcycle. Pretty agile, but you can't bring all of your friends.

      Crew:
      1 driver (0).
      1 passenger (0).

      *If the driver is incapacitated/dies while the vehicle is moving, it collapses immediately.
      *When collapsing, it will move however many distances it had moved last turn, dragging its rider(s) with it.
      *The riders take damage equal to how many distances it moves.
      *Optionally choose to have a Pannier - a side cart to your motorcycle. Not having a pannier leaves the stats unchanged.
      *Choosing to have a pannier decreases speed to 5, but allows a 3rd passenger, and raises the number of doors to 3.
      *The 3rd passenger has (0) cover.`,
  },
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));
