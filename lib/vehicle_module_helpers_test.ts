/**
 * Unit tests for vehicle module display helpers.
 * Run: deno test -A lib/vehicle_module_helpers_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { VEHICLES } from "@/data/vehicles.ts";
import {
  formatVehicleModuleDetails,
  formatVehicleModuleLabel,
  getVehicleHp,
  groupVehicleModules,
} from "./vehicle_module_helpers.ts";

function catalogVehicle(id: string) {
  const vehicle = VEHICLES.find((entry) => entry.id === id);
  if (!vehicle) throw new Error(`Expected ${id} vehicle in catalog`);
  return vehicle;
}

Deno.test("groupVehicleModules returns an empty list for no modules", () => {
  assertEquals(groupVehicleModules([]), []);
});

Deno.test("groupVehicleModules preserves unique modules in order", () => {
  assertEquals(
    groupVehicleModules(["engine", "fuel-tanks", "tracks"]),
    [
      { moduleId: "engine", moduleIds: ["engine"], count: 1 },
      { moduleId: "fuel-tanks", moduleIds: ["fuel-tanks"], count: 1 },
      { moduleId: "tracks", moduleIds: ["tracks"], count: 1 },
    ],
  );
});

Deno.test("groupVehicleModules collapses consecutive copies of the same module", () => {
  assertEquals(
    groupVehicleModules([
      "light-cannon",
      "light-cannon",
      "side-machine-gun",
      "side-machine-gun",
      "engine",
    ]),
    [
      { moduleId: "light-cannon", moduleIds: ["light-cannon"], count: 2 },
      {
        moduleId: "side-machine-gun",
        moduleIds: ["side-machine-gun"],
        count: 2,
      },
      { moduleId: "engine", moduleIds: ["engine"], count: 1 },
    ],
  );
});

Deno.test("groupVehicleModules collapses non-consecutive copies at first occurrence", () => {
  assertEquals(
    groupVehicleModules(["engine", "tracks", "engine"]),
    [
      { moduleId: "engine", moduleIds: ["engine"], count: 2 },
      { moduleId: "tracks", moduleIds: ["tracks"], count: 1 },
    ],
  );
});

Deno.test("groupVehicleModules combines same-name modules with different IDs", () => {
  assertEquals(
    groupVehicleModules(["light-turret", "rear-light-turret", "light-turret"]),
    [
      {
        moduleId: "light-turret",
        moduleIds: ["light-turret", "rear-light-turret"],
        count: 3,
      },
    ],
  );
  assertEquals(
    formatVehicleModuleLabel("light-turret", 3),
    "3x Light turret",
  );
});

Deno.test("groupVehicleModules matches catalog vehicles that repeat module IDs", () => {
  const markV = catalogVehicle("mark-v");
  assertEquals(groupVehicleModules(markV.modules), [
    { moduleId: "light-cannon", moduleIds: ["light-cannon"], count: 2 },
    {
      moduleId: "frontal-machine-gun",
      moduleIds: ["frontal-machine-gun"],
      count: 1,
    },
    {
      moduleId: "side-machine-gun",
      moduleIds: ["side-machine-gun"],
      count: 2,
    },
    { moduleId: "engine", moduleIds: ["engine"], count: 1 },
    { moduleId: "fuel-tanks", moduleIds: ["fuel-tanks"], count: 1 },
    { moduleId: "tracks", moduleIds: ["tracks"], count: 1 },
    {
      moduleId: "light-ammo-stowage",
      moduleIds: ["light-ammo-stowage"],
      count: 1,
    },
  ]);
});

Deno.test("groupVehicleModules combines Jeffery dual Light turret IDs", () => {
  const jeffery = catalogVehicle("m1915-jeffery-armored-car");
  assertEquals(groupVehicleModules(jeffery.modules), [
    {
      moduleId: "frontal-machine-gun",
      moduleIds: ["frontal-machine-gun"],
      count: 1,
    },
    {
      moduleId: "rear-machine-gun",
      moduleIds: ["rear-machine-gun"],
      count: 1,
    },
    {
      moduleId: "light-turret",
      moduleIds: ["light-turret", "rear-light-turret"],
      count: 2,
    },
    { moduleId: "engine", moduleIds: ["engine"], count: 1 },
    { moduleId: "fuel-tanks", moduleIds: ["fuel-tanks"], count: 1 },
    { moduleId: "wheels-4", moduleIds: ["wheels-4"], count: 1 },
  ]);
  assertEquals(
    formatVehicleModuleLabel("light-turret", 2),
    "2x Light turret",
  );
});

Deno.test("formatVehicleModuleLabel prefixes the module name with Nx", () => {
  assertEquals(formatVehicleModuleLabel("light-cannon", 1), "1x Light cannon");
  assertEquals(formatVehicleModuleLabel("light-cannon", 2), "2x Light cannon");
  assertEquals(
    formatVehicleModuleLabel("side-machine-gun", 4),
    "4x Lateral machinegun",
  );
});

Deno.test("formatVehicleModuleDetails keeps single-module output for one ID", () => {
  const expected = [
    "HP: 4",
    "Difficulty: 5 / 5 / 5",
    "Position: Internal",
    "On destruction: The vehicle can no longer move.",
    "",
    "The vehicle's engine, required for the vehicle to move and operate its weaponry.",
  ].join("\n");
  assertEquals(formatVehicleModuleDetails("engine"), expected);
  assertEquals(formatVehicleModuleDetails(["engine"]), expected);
  assertEquals(formatVehicleModuleDetails(["engine", "engine"]), expected);
});

Deno.test("formatVehicleModuleDetails includes rear-aiming text for grouped Light turrets", () => {
  const details = formatVehicleModuleDetails([
    "light-turret",
    "rear-light-turret",
  ]);
  assertEquals(
    details.includes("A light turret mounting, for small cannons!"),
    true,
  );
  assertEquals(details.includes("Aims backwards instead"), true);
  assertEquals(details.match(/HP: 6/g)?.length, 1);
});

Deno.test("getVehicleHp still counts each module copy", () => {
  const markV = catalogVehicle("mark-v");
  assertEquals(markV.modules.length > new Set(markV.modules).size, true);
  assertEquals(getVehicleHp(markV), 40);
});
