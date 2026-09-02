/**
 * Unit tests for vehicle module display helpers.
 * Run: deno test -A lib/vehicle_module_helpers_test.ts
 */

import { assertEquals } from "jsr:@std/assert@1";
import { VEHICLES } from "@/data/vehicles.ts";
import {
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
      { moduleId: "engine", count: 1 },
      { moduleId: "fuel-tanks", count: 1 },
      { moduleId: "tracks", count: 1 },
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
      { moduleId: "light-cannon", count: 2 },
      { moduleId: "side-machine-gun", count: 2 },
      { moduleId: "engine", count: 1 },
    ],
  );
});

Deno.test("groupVehicleModules collapses non-consecutive copies at first occurrence", () => {
  assertEquals(
    groupVehicleModules(["engine", "tracks", "engine"]),
    [
      { moduleId: "engine", count: 2 },
      { moduleId: "tracks", count: 1 },
    ],
  );
});

Deno.test("groupVehicleModules keeps same-name modules with different IDs separate", () => {
  assertEquals(
    groupVehicleModules(["light-turret", "rear-light-turret", "light-turret"]),
    [
      { moduleId: "light-turret", count: 2 },
      { moduleId: "rear-light-turret", count: 1 },
    ],
  );
});

Deno.test("groupVehicleModules matches catalog vehicles that repeat module IDs", () => {
  const markV = catalogVehicle("mark-v");
  assertEquals(groupVehicleModules(markV.modules), [
    { moduleId: "light-cannon", count: 2 },
    { moduleId: "frontal-machine-gun", count: 1 },
    { moduleId: "side-machine-gun", count: 2 },
    { moduleId: "engine", count: 1 },
    { moduleId: "fuel-tanks", count: 1 },
    { moduleId: "tracks", count: 1 },
    { moduleId: "light-ammo-stowage", count: 1 },
  ]);
});

Deno.test("formatVehicleModuleLabel prefixes the module name with Nx", () => {
  assertEquals(formatVehicleModuleLabel("light-cannon", 1), "1x Light cannon");
  assertEquals(formatVehicleModuleLabel("light-cannon", 2), "2x Light cannon");
  assertEquals(
    formatVehicleModuleLabel("side-machine-gun", 4),
    "4x Lateral machinegun",
  );
});

Deno.test("getVehicleHp still counts each module copy", () => {
  const markV = catalogVehicle("mark-v");
  assertEquals(markV.modules.length > new Set(markV.modules).size, true);
  assertEquals(getVehicleHp(markV), 40);
});
