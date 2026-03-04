import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { WEAPONS, type WeaponKind } from "@/data/equipment.ts";

const KIND_LABELS: Record<WeaponKind, string> = {
  "bolt-action-rifle": "Bolt-action Rifles",
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
};

const KIND_ORDER: WeaponKind[] = [
  "bolt-action-rifle",
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
  "bow",
  "crossbow",
  "melee",
];

function pointCostLabel(cost: number): string {
  if (cost === 0) return "Free slot";
  if (cost === 3) return "Restricted (3 pts)";
  return `+${cost} pt`;
}

export default define.page(function WikiWeapons() {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Weapons – Wiki – World Vore One</title>
      </Head>
      <div class="max-w-4xl mx-auto space-y-8">
        <header>
          <a href="/wiki" class="text-sm text-primary hover:underline">← Wiki</a>
          <h1 class="text-3xl font-bold mt-2">Weapons</h1>
          <p class="text-base-content">
            All ranged (and melee-category) weapons, grouped by type.
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
                  <details
                    key={weapon.id}
                    class="border rounded-lg bg-base-100/80 px-4 py-2"
                  >
                    <summary class="cursor-pointer font-medium select-none list-none flex items-center gap-3 flex-wrap">
                      <span class="font-semibold">{weapon.name}</span>
                      <span class="text-xs text-base-content/60">{weapon.nation}</span>
                      <span class="ml-auto flex items-center gap-3 text-xs text-base-content/70 shrink-0">
                        <span>DMG: {weapon.damage}</span>
                        <span>Ammo: {weapon.ammo}</span>
                        <span>RoF: {weapon.rateOfFire}</span>
                        <span>Wt: {weapon.weight}</span>
                        {weapon.pointCost !== 0 && (
                          <span class={weapon.pointCost === 3 ? "text-error font-medium" : "text-warning"}>
                            {pointCostLabel(weapon.pointCost)}
                          </span>
                        )}
                        <span class="text-base-content/50">▶ details</span>
                      </span>
                    </summary>
                    <div class="mt-2 text-sm text-base-content space-y-1 border-t pt-2">
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-base-content/70">
                        <div><span class="font-medium">Damage:</span> {weapon.damage}</div>
                        <div><span class="font-medium">Ammo:</span> {weapon.ammo}</div>
                        <div><span class="font-medium">Rate of fire:</span> {weapon.rateOfFire}</div>
                        <div><span class="font-medium">Weight:</span> {weapon.weight}</div>
                        <div><span class="font-medium">Nation:</span> {weapon.nation}</div>
                        <div><span class="font-medium">Type:</span> {weapon.type}</div>
                        <div>
                          <span class="font-medium">Cost:</span>{" "}
                          {pointCostLabel(weapon.pointCost)}
                        </div>
                        {weapon.reloadTurns && weapon.reloadTurns > 1 && (
                          <div>
                            <span class="font-medium">Reload turns:</span>{" "}
                            {weapon.reloadTurns}
                          </div>
                        )}
                      </div>
                      {weapon.requiresMagazines && (
                        <p class="text-xs text-warning">
                          Requires magazines to reload.
                        </p>
                      )}
                      {weapon.reloadsIndividually && (
                        <p class="text-xs text-warning">
                          Reloads one round at a time.
                        </p>
                      )}
                      {weapon.gimmicks && (
                        <div class="mt-1">
                          <span class="text-xs font-medium">Gimmicks: </span>
                          <span class="text-xs whitespace-pre-line text-base-content/70">
                            {weapon.gimmicks}
                          </span>
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
});
