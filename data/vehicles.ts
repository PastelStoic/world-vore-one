import type { VehicleDefinition } from "./equipment_types.ts";

// Reusable module definitions are referenced by ID from VehicleDefinition.modules.

// ---------------------------------------------------------------------------
// DATA - Vehicles
// ---------------------------------------------------------------------------

export const VEHICLES: VehicleDefinition[] = [

  // BRITISH VEHICLES
  
  {
    id: "mark_v",
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
    agility: 1,
    speed: 3,
    modules: [
      "frontal-machine-gun",
      "frontal-machine-gun",
      "side-machine-gun",
      "side-machine-gun",
      "engine",
      "fuel-tanks",
      "tracks",
    ],
    description:
      `Light and fast "cavalry" tank, meant to fit Britain's armor doctrine. Faster than most other tanks, but only armed with machineguns!

      Crew:
      1 commander ( 5/5/5 ).
      1 driver ( 5/5/5 ).
      1 engineer ( 5/5/5 ).
      2 gunner ( 3/3/3 ).
      
      *Each machinegun can only fire in their respective directions. Difficulty doubled if trying to attack a machinegun that's on the opposite end.
      *The vehicle has a rear gun port, allowing one of the machineguns to be slotted into it. It takes 3 turns to do so.
      *Slotting the machinegun into the rear port also flips its front/rearr targetting difficulties.
      *One of the side machinegun points left, one points right.`,
  },

// FRENCH VEHICLES

  {
    id: "renault_f17",
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
    agility: 1,
    speed: 3,
    modules: [
      "light-cannon",
      "light-turret",
      "engine",
      "fuel-tanks",
      "tracks",
    ],
    description:
      `The first turreted tank in the world! Very small and compact, as well as easy to destroy, making it cheaper than most tanks.

      Crew:
      1 commander, gunner AND engineer. ( 3/3/4 ).
      1 driver ( 3/3/4 ).
      
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
    agility: 1,
    speed: 3,
    modules: [
      "frontal-machine-gun",
      "light-turret",
      "engine",
      "fuel-tanks",
      "tracks",
    ],
    description:
      `The first turreted tank in the world! Very small and compact, as well as easy to destroy, making it cheaper than most tanks.

      Crew:
      1 commander, gunner AND engineer. ( 3/3/4 ).
      1 driver ( 3/3/4 ).
      
      *The commander is also the gunner and the engineer. Good luck doing all the work alone!
      *The machinegun is inside the turret, and turns alongside it.`,
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

// MILITARY BUT GENERIC

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
    agility: 1,
    speed: 3,
    modules: [
      "artillery-train",
      "wheels-4",
    ],
    description:
      `An artillery train, meant to carry artillery around.

      Crew:
      1 conductor ( 0/0/0 ).
      
      *Required in order to move artillery around. Or better yet, use a truck! ...
      *You're not using this if you can afford a truck, which means you're a brokie.`,
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
    agility: 1,
    speed: 3,
    modules: [
      "horse-artillery-train",
      "wheels-4",
    ],
    description:
      `An artillery train, meant to carry artillery around, except its faster since it has more horses.

      Crew:
      1 conductor ( 0/0/0 ).
      
      *Required in order to move artillery around. Or better yet, use a truck! ...
      *You're still a brokie.`,
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
    agility: 2,
    speed: 6,
    modules: [
      "civilian-engine",
      "civilian-fuel-tank",
      "civilian-wheels-4",
    ],
    description:
      `An average ol' car. It's just like a Puma, it drives on all fours.

      Crew:
      1 driver ( 2/2/3 ).
      1 front passenger seat ( 2/2/3 ).
      3 passengers ( 3/2/2 ).
      
      *The driver cannot shoot out of the vehicle, they need to focus on driving!
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
    agility: 2,
    speed: 4,
    modules: [
      "civilian-engine",
      "civilian-fuel-tank",
      "civilian-wheels-4",
    ],
    description:
      `A truck! A bit slower than most, but can carry a lot of weight!

      Crew:
      1 driver ( 2/2/3 ).
      1 front passenger seat ( 2/2/3 ).
      16 passengers on the back ( 3/0/0 ).

      *Targetting the rear crew on this vehicle does not deal damage to the vehicle.
      *The driver cannot shoot out of the vehicle, they need to focus on driving!
      *Each seat for passengers on the back can carry 3 weight units, for a total of 16 x 3 = 48 weight.
      *Choose whether to have a tarp cover over the back of the truck. No cover leaves the stats as they are, and rear passengers can fire out of the vehicle.
      *Covering the back with a tarp gives the rear passengers ( 3/3/0 ) cover instead, but only allows them to shoot backwards.
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
    agility: 2,
    speed: 6,
    modules: [
      "civilian-engine",
      "civilian-fuel-tank",
      "civilian-wheels-2",
    ],
    description:
      `An average motorcycle. Pretty agile, but you can't bring all of your friends.

      Crew:
      1 driver ( 0/0/0 ).
      1 passenger ( 0/0/0 ).

      *Targetting the crew on this vehicle does not deal damage to the vehicle.
      *The driver cannot shoot out of the vehicle, they need to focus on driving!
      *If the driver is incapacitated/dies while the vehicle is moving, it collapses immediately.
      *When collapsing, it will move however many distances it had moved last turn, dragging its rider(s) with it.
      *The riders take damage equal to how many distances it moves.
      *Optionally choose to have a Pannier - a side cart to your motorcycle. Not having a pannier leaves the stats unchanged.
      *Choosing to have a pannier decreases speed to 5, but allows a 3rd passenger, and raises the number of doors to 3.
      *The 3rd passenger has ( 0/0/0 ) cover.`,
  },

  
];

export const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [
  vehicle.id,
  vehicle,
]));
