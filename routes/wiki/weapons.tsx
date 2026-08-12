import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import {
  MELEE_TRAITS_BY_ID,
  MELEE_WEAPONS,
  WEAPON_TRAITS_BY_ID,
  type WeaponKind,
  WEAPONS,
} from "@/data/equipment.ts";
import { PageShell } from "@/components/PageShell.tsx";
import { BackLink } from "@/components/BackLink.tsx";
import { WikiDetailsRow } from "@/components/WikiDetailsRow.tsx";
import { pointCostLabel } from "@/lib/format.ts";

const KIND_LABELS: Record<WeaponKind, string> = {
  "bolt-action-rifle": "Bolt-action Rifles",
  "lever-action-rifle": "Lever-action Rifles",
  "semiautomatic-rifle": "Semi-automatic Rifles",
  "assault-rifle": "Assault Rifles",
  "smg": "Submachine Guns",
  "light-machinegun": "Light Machine Guns",
  "heavy-machinegun": "Heavy Machine Guns",
  "shotgun": "Shotguns",
  "semiautomatic-shotgun": "Semi-automatic Shotguns",
  "pump-action-shotgun": "Pump-action Shotguns",
  "double-action-revolver": "Double-action Revolvers",
  "single-action-revolver": "Single-action Revolvers",
  "semiautomatic-pistol": "Semi-automatic Pistols",
  "black-powder-revolver": "Black Powder Revolvers",
  "flamethrower": "Flamethrowers",
  "flintlock-musket": "Flintlock Muskets",
  "bow": "Bows",
  "crossbow": "Crossbows",
  "melee": "Melee",
  "anti-tank-rifle": "Anti-Tank Rifle"
};

const KIND_ORDER: WeaponKind[] = [
  "bolt-action-rifle",
  "lever-action-rifle",
  "semiautomatic-rifle",
  "assault-rifle",
  "smg",
  "light-machinegun",
  "heavy-machinegun",
  "shotgun",
  "semiautomatic-shotgun",
  "pump-action-shotgun",
  "double-action-revolver",
  "single-action-revolver",
  "semiautomatic-pistol",
  "black-powder-revolver",
  "flamethrower",
  "flintlock-musket",
  "anti-tank-rifle",
  "bow",
  "crossbow",
  "melee",
];

export default define.page(function WikiWeapons() {
  return (
    <PageShell maxWidth="4xl" innerClass="space-y-8">
      <Head>
        <title>Weapons – Wiki – World Vore One</title>
      </Head>
      <header>
        <BackLink href="/wiki">← Wiki</BackLink>
        <h1 class="text-3xl font-bold mt-2">Weapons</h1>
        <p class="text-base-content">
          All ranged and melee weapons, grouped by type.
        </p>
      </header>

      {KIND_ORDER.map((kind) => {
        const weapons = WEAPONS.filter((w) => w.kind === kind);
        if (weapons.length === 0) return null;
        return (
          <section key={kind} class="space-y-2">
            <h2 class="text-xl font-semibold border-b pb-1">
              {KIND_LABELS[kind]}
            </h2>
            <div class="space-y-2">
              {weapons.map((weapon) => (
                <WikiDetailsRow
                  key={weapon.id}
                  title={weapon.name}
                  deprecated={weapon.deprecated}
                  badges={
                    <span class="text-xs text-base-content/60">
                      {weapon.nation}
                    </span>
                  }
                  summary={
                    <>
                      <span>DMG: {weapon.damage}</span>
                      <span>Ammo: {weapon.ammo}</span>
                      <span>RoF: {weapon.rateOfFire}</span>
                      <span>Wt: {weapon.weight}</span>
                      {weapon.pointCost !== 0 && (
                        <span
                          class={weapon.pointCost === 3
                            ? "text-error font-medium"
                            : "text-warning"}
                        >
                          {pointCostLabel(weapon.pointCost, "Free slot")}
                        </span>
                      )}
                    </>
                  }
                >
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-base-content/70">
                    <div>
                      <span class="font-medium">Damage:</span> {weapon.damage}
                    </div>
                    <div>
                      <span class="font-medium">Ammo:</span> {weapon.ammo}
                    </div>
                    <div>
                      <span class="font-medium">Rate of fire:</span>{" "}
                      {weapon.rateOfFire}
                    </div>
                    <div>
                      <span class="font-medium">Weight:</span> {weapon.weight}
                    </div>
                    <div>
                      <span class="font-medium">Nation:</span> {weapon.nation}
                    </div>
                    <div>
                      <span class="font-medium">Type:</span> {weapon.type}
                    </div>
                    <div>
                      <span class="font-medium">Cost:</span>{" "}
                      {pointCostLabel(weapon.pointCost, "Free slot")}
                    </div>
                    {weapon.reloadTurns && weapon.reloadTurns > 1 && (
                      <div>
                        <span class="font-medium">Reload turns:</span>{" "}
                        {weapon.reloadTurns}
                      </div>
                    )}
                    {weapon.reloadAmountOverride !== undefined &&
                      weapon.reloadAmountOverride > 1 && (
                      <div>
                        <span class="font-medium">Reload amount:</span>{" "}
                        {weapon.reloadAmountOverride}
                      </div>
                    )}
                  </div>
                  {weapon.requiresMagazines && (
                    <p class="text-xs text-warning">
                      Requires magazines to reload.
                    </p>
                  )}
                  {weapon.reloadAmountOverride === 1 && (
                    <p class="text-xs text-warning">
                      Reloads one round at a time.
                    </p>
                  )}
                  {weapon.traitIds.length > 0 && (
                    <div class="mt-1 space-y-1">
                      <span class="text-xs font-medium">Traits:</span>
                      {weapon.traitIds.map((tid) => {
                        const trait = WEAPON_TRAITS_BY_ID.get(tid);
                        return (
                          <div
                            key={tid}
                            class="text-xs text-base-content/70 ml-2"
                          >
                            <span class="font-medium">
                              {trait?.name ?? tid}:
                            </span>{" "}
                            {trait?.description ?? ""}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </WikiDetailsRow>
              ))}
            </div>
          </section>
        );
      })}

      {MELEE_WEAPONS.length > 0 && (
        <section class="space-y-2">
          <h2 class="text-xl font-semibold border-b pb-1">Melee Weapons</h2>
          <div class="space-y-2">
            {MELEE_WEAPONS.map((weapon) => (
              <WikiDetailsRow
                key={weapon.id}
                title={weapon.name}
                deprecated={weapon.deprecated}
                summary={
                  <>
                    <span>DMG: {weapon.damage}</span>
                    <span>Wt: {weapon.weight}</span>
                  </>
                }
              >
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
              </WikiDetailsRow>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
});
