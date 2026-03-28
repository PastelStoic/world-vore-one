import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import {
  ATTACHMENTS,
  EQUIPMENT,
  FREE_ACCESSORIES,
  MELEE_TRAITS,
  MELEE_TRAITS_BY_ID,
  MELEE_WEAPONS,
} from "@/data/equipment.ts";
import { PageShell } from "@/components/PageShell.tsx";
import { BackLink } from "@/components/BackLink.tsx";

export default define.page(function WikiEquipment() {
  return (
    <PageShell maxWidth="4xl" innerClass="space-y-10">
      <Head>
        <title>Equipment – Wiki – World Vore One</title>
      </Head>
      <header>
        <BackLink href="/wiki">← Wiki</BackLink>
        <h1 class="text-3xl font-bold mt-2">Equipment &amp; Attachments</h1>
        <p class="text-base-content">
          General gear, weapon attachments, free accessories, melee weapons, and
          melee weapon traits.
        </p>
      </header>

      {/* ── General Equipment ── */}
      <section class="space-y-2">
        <h2 class="text-xl font-semibold border-b pb-1">General Equipment</h2>
        <div class="space-y-2">
          {EQUIPMENT.filter((item) => !item.isGhost).map((item) => {
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
                    <p class="whitespace-pre-line text-base-content/70">
                      {rest}
                    </p>
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
                    <p class="whitespace-pre-line text-base-content/70">
                      {rest}
                    </p>
                  )}
                  {(att.ammoOverride !== undefined ||
                    att.weightOverride !== undefined ||
                    att.reloadTurnsOverride !== undefined ||
                    att.damageOverride !== undefined ||
                    (att.requiresAttachmentIds?.length ?? 0) > 0 ||
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
                      {(att.requiresAttachmentIds?.length ?? 0) > 0 && (
                        <span>
                          Requires attached:{" "}
                          {att.requiresAttachmentIds!.join(", ")}
                        </span>
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
                  <span class="text-xs text-base-content/60">
                    Wt: {acc.weight}
                  </span>
                </div>
                <p class="text-sm text-base-content/70 mt-1">
                  {acc.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Melee Weapons ── */}
      {MELEE_WEAPONS.length > 0 && (
        <section class="space-y-2">
          <h2 class="text-xl font-semibold border-b pb-1">Melee Weapons</h2>
          <p class="text-sm text-base-content/70">
            Premade melee weapons, with their base damage, weight, and traits.
          </p>
          <div class="space-y-2">
            {MELEE_WEAPONS.map((weapon) => (
              <details
                key={weapon.id}
                class="border rounded-lg bg-base-100/80 px-4 py-2"
              >
                <summary class="cursor-pointer font-medium select-none list-none flex items-center gap-3 flex-wrap">
                  <span class="font-semibold">{weapon.name}</span>
                  <span class="ml-auto flex items-center gap-3 text-xs text-base-content/70 shrink-0">
                    <span>DMG: {weapon.damage}</span>
                    <span>Wt: {weapon.weight}</span>
                    <span class="text-base-content/50">▶ details</span>
                  </span>
                </summary>
                <div class="mt-2 text-sm text-base-content border-t pt-2 space-y-2">
                  <div class="flex flex-wrap gap-3 text-xs text-base-content/70">
                    <span>
                      <span class="font-medium">Damage:</span> {weapon.damage}
                    </span>
                    <span>
                      <span class="font-medium">Weight:</span> {weapon.weight}
                    </span>
                  </div>
                  <p class="text-base-content/70 whitespace-pre-line">
                    {weapon.description}
                  </p>
                  {weapon.traitIds.length > 0 && (
                    <div class="space-y-1">
                      <span class="text-xs font-medium">Traits:</span>
                      {weapon.traitIds.map((traitId) => {
                        const trait = MELEE_TRAITS_BY_ID.get(traitId);
                        return (
                          <div
                            key={`${weapon.id}-${traitId}`}
                            class="text-xs text-base-content/70 ml-2"
                          >
                            <span class="font-medium">
                              {trait?.name ?? traitId}:
                            </span>{" "}
                            {trait?.description ?? ""}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </details>
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
    </PageShell>
  );
});
