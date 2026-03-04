import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import {
  ATTACHMENTS,
  EQUIPMENT,
  FREE_ACCESSORIES,
  MELEE_TRAITS,
} from "@/data/equipment.ts";

export default define.page(function WikiEquipment() {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Equipment – Wiki – World Vore One</title>
      </Head>
      <div class="max-w-4xl mx-auto space-y-10">
        <header>
          <a href="/wiki" class="text-sm text-primary hover:underline">← Wiki</a>
          <h1 class="text-3xl font-bold mt-2">Equipment &amp; Attachments</h1>
          <p class="text-base-content">
            General gear, weapon attachments, free accessories, and melee weapon
            traits.
          </p>
        </header>

        {/* ── General Equipment ── */}
        <section class="space-y-2">
          <h2 class="text-xl font-semibold border-b pb-1">General Equipment</h2>
          <div class="space-y-2">
            {EQUIPMENT.map((item) => {
              const lines = item.description.split("\n");
              const brief = lines[0];
              const rest = lines.slice(1).join("\n").trim();
              return (
                <details
                  key={item.id}
                  class="border rounded-lg bg-base-100/80 px-4 py-2"
                >
                  <summary class="cursor-pointer font-medium select-none list-none flex items-center gap-3 flex-wrap">
                    <span class="font-semibold">{item.name}</span>
                    {item.isCharge && (
                      <span class="text-xs text-primary">charge</span>
                    )}
                    {item.isBulky && (
                      <span class="text-xs text-warning">bulky</span>
                    )}
                    <span class="ml-auto flex items-center gap-3 text-xs text-base-content/70 shrink-0">
                      <span>Wt: {item.weight}</span>
                      <span class="text-base-content/50">▶ details</span>
                    </span>
                  </summary>
                  <div class="mt-2 text-sm text-base-content border-t pt-2 space-y-1">
                    <p class="whitespace-pre-line">{brief}</p>
                    {rest && (
                      <p class="whitespace-pre-line text-base-content/70">{rest}</p>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* ── Weapon Attachments ── */}
        <section class="space-y-2">
          <h2 class="text-xl font-semibold border-b pb-1">
            Weapon Attachments
          </h2>
          <div class="space-y-2">
            {ATTACHMENTS.map((att) => {
              const lines = att.description.split("\n");
              const brief = lines[0];
              const rest = lines.slice(1).join("\n").trim();
              return (
                <details
                  key={att.id}
                  class="border rounded-lg bg-base-100/80 px-4 py-2"
                >
                  <summary class="cursor-pointer font-medium select-none list-none flex items-center gap-3 flex-wrap">
                    <span class="font-semibold">{att.name}</span>
                    <span class="text-xs text-base-content/60">
                      {att.appliesTo}
                    </span>
                    {att.nation !== "Any" && (
                      <span class="text-xs text-purple-700">{att.nation}</span>
                    )}
                    {att.isCharge && (
                      <span class="text-xs text-primary">charge</span>
                    )}
                    <span class="ml-auto flex items-center gap-3 text-xs text-base-content/70 shrink-0">
                      <span>Wt: {att.weight}</span>
                      <span class="text-base-content/50">▶ details</span>
                    </span>
                  </summary>
                  <div class="mt-2 text-sm text-base-content border-t pt-2 space-y-1">
                    <p class="whitespace-pre-line">{brief}</p>
                    {rest && (
                      <p class="whitespace-pre-line text-base-content/70">{rest}</p>
                    )}
                    {(att.ammoOverride !== undefined ||
                      att.weightOverride !== undefined ||
                      att.reloadTurnsOverride !== undefined ||
                      att.damageOverride !== undefined ||
                      att.rateOfFireBonus !== undefined) && (
                      <div class="flex flex-wrap gap-3 text-xs text-base-content/60 mt-1">
                        {att.ammoOverride !== undefined && (
                          <span>Ammo override: {att.ammoOverride}</span>
                        )}
                        {att.weightOverride !== undefined && (
                          <span>Weight override: {att.weightOverride}</span>
                        )}
                        {att.reloadTurnsOverride !== undefined && (
                          <span>
                            Reload turns override: {att.reloadTurnsOverride}
                          </span>
                        )}
                        {att.damageOverride !== undefined && (
                          <span>Damage override: {att.damageOverride}</span>
                        )}
                        {att.rateOfFireBonus !== undefined && (
                          <span>RoF bonus: +{att.rateOfFireBonus}</span>
                        )}
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* ── Free Accessories ── */}
        {FREE_ACCESSORIES.length > 0 && (
          <section class="space-y-2">
            <h2 class="text-xl font-semibold border-b pb-1">
              Free Accessories
            </h2>
            <p class="text-sm text-base-content/70">
              Items that come bundled with certain weapons at scene start.
            </p>
            <div class="space-y-2">
              {FREE_ACCESSORIES.map((acc) => (
                <div
                  key={acc.id}
                  class="border rounded-lg bg-base-100/80 px-4 py-2"
                >
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="font-semibold">{acc.name}</span>
                    <span class="text-xs text-base-content/60">
                      Ammo: {acc.ammo}
                    </span>
                    <span class="text-xs text-base-content/60">Wt: {acc.weight}</span>
                  </div>
                  <p class="text-sm text-base-content/70 mt-1">{acc.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Melee Weapon Traits ── */}
        <section class="space-y-2">
          <h2 class="text-xl font-semibold border-b pb-1">
            Melee Weapon Traits
          </h2>
          <p class="text-sm text-base-content/70">
            Traits that describe how a melee weapon behaves in combat.
          </p>
          <div class="space-y-2">
            {MELEE_TRAITS.map((trait) => (
              <details
                key={trait.id}
                class="border rounded-lg bg-base-100/80 px-4 py-2"
              >
                <summary class="cursor-pointer font-medium select-none list-none flex items-center justify-between">
                  <span>{trait.name}</span>
                  <span class="text-xs text-base-content/50">▶ details</span>
                </summary>
                <p class="mt-2 text-sm text-base-content border-t pt-2 whitespace-pre-line">
                  {trait.description}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
});
