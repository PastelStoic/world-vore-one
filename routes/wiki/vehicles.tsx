import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { NATIONS, VEHICLES } from "@/data/equipment.ts";
import {
  formatVehicleModuleDetails,
  formatVehicleModuleLabel,
  getVehicleHp,
  groupVehicleModules,
} from "@/lib/vehicle_module_helpers.ts";
import { PageShell } from "@/components/PageShell.tsx";
import { BackLink } from "@/components/BackLink.tsx";
import DeprecatedBadge from "@/components/DeprecatedBadge.tsx";

function pointCostLabel(cost: number): string {
  if (cost === 0) return "Free";
  return `${cost}pt`;
}

export default define.page(function WikiVehicles() {
  return (
    <PageShell maxWidth="4xl" innerClass="space-y-8">
      <Head>
        <title>Vehicles – Wiki – World Vore One</title>
      </Head>
      <header>
        <BackLink href="/wiki">← Wiki</BackLink>
        <h1 class="text-3xl font-bold mt-2">Vehicles</h1>
        <p class="text-base-content">
          Statistics, crew, armor, and modules for every vehicle, grouped by
          nation.
        </p>
      </header>

      {NATIONS.map((nation) => {
        const vehicles = VEHICLES.filter((vehicle) =>
          vehicle.nation === nation
        );
        if (vehicles.length === 0) return null;
        return (
          <section key={nation} class="space-y-2">
            <h2 class="text-xl font-semibold border-b pb-1">{nation}</h2>
            <div class="space-y-2">
              {vehicles.map((vehicle) => (
                <details
                  key={vehicle.id}
                  class="border rounded-lg bg-base-100/80 px-4 py-2"
                >
                  <summary class="cursor-pointer font-medium select-none list-none flex items-center gap-3 flex-wrap">
                    <span class="font-semibold">
                      {vehicle.name}
                      {vehicle.deprecated ? <DeprecatedBadge /> : null}
                    </span>
                    <span class="text-xs text-base-content/60">
                      {vehicle.nation}
                    </span>
                    <span class="ml-auto flex items-center gap-3 text-xs text-base-content/70 shrink-0">
                      <span>Size: {vehicle.size}</span>
                      <span>Agility: {vehicle.agility}</span>
                      <span>Speed: {vehicle.speed}</span>
                      <span>HP: {getVehicleHp(vehicle)}</span>
                      <span>Crew: {vehicle.crew}</span>
                      <span>Seats: {vehicle.seats}</span>
                      <span>Doors: {vehicle.doors}</span>
                      {vehicle.pointCost !== 0 && (
                        <span
                          class={vehicle.pointCost >= 3
                            ? "text-error font-medium"
                            : "text-warning"}
                        >
                          {pointCostLabel(vehicle.pointCost)}
                        </span>
                      )}
                      <span class="text-base-content/50">▶ details</span>
                    </span>
                  </summary>
                  <div class="mt-2 text-sm text-base-content border-t pt-2 space-y-2">
                    <div class="flex flex-wrap gap-3 text-xs text-base-content/70">
                      <span>
                        <span class="font-medium">Nation:</span>{" "}
                        {vehicle.nation}
                      </span>
                      <span>
                        <span class="font-medium">Front armor:</span>{" "}
                        {vehicle.armor.front}
                      </span>
                      <span>
                        <span class="font-medium">Side armor:</span>{" "}
                        {vehicle.armor.side}
                      </span>
                      <span>
                        <span class="font-medium">Rear armor:</span>{" "}
                        {vehicle.armor.rear}
                      </span>
                      <span>
                        <span class="font-medium">Size:</span> {vehicle.size}
                      </span>
                      <span>
                        <span class="font-medium">Agility:</span>{" "}
                        {vehicle.agility}
                      </span>
                      <span>
                        <span class="font-medium">Speed:</span> {vehicle.speed}
                      </span>
                      <span>
                        <span class="font-medium">HP:</span>{" "}
                        {getVehicleHp(vehicle)}
                      </span>
                      <span>
                        <span class="font-medium">Crew:</span> {vehicle.crew}
                      </span>
                      <span>
                        <span class="font-medium">Seats:</span> {vehicle.seats}
                      </span>
                      <span>
                        <span class="font-medium">Doors:</span> {vehicle.doors}
                      </span>
                    </div>
                    {vehicle.modules.length > 0 && (
                      <div class="space-y-2">
                        <p class="text-sm font-medium text-base-content/70">
                          Modules
                        </p>
                        <div class="space-y-2">
                          {groupVehicleModules(vehicle.modules).map((
                            { moduleId, count },
                          ) => (
                            <details
                              key={moduleId}
                              class="border rounded-lg bg-base-100/80 px-4 py-2"
                            >
                              <summary class="cursor-pointer font-medium select-none list-none flex items-center justify-between">
                                <span>
                                  {formatVehicleModuleLabel(moduleId, count)}
                                </span>
                                <span class="text-xs text-base-content/50">
                                  ▶ details
                                </span>
                              </summary>
                              <p class="mt-2 text-sm text-base-content border-t pt-2 whitespace-pre-line">
                                {formatVehicleModuleDetails(moduleId)}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}
                    {vehicle.description && (
                      <p class="text-sm text-base-content/70 whitespace-pre-line">
                        {vehicle.description}
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}
    </PageShell>
  );
});
