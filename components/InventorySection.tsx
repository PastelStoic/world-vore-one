import { useState } from "preact/hooks";
import {
  ATTACHMENTS_BY_ID,
  EQUIPMENT,
  EQUIPMENT_BY_ID,
  FREE_ACCESSORIES_BY_ID,
  MELEE_TRAITS,
  MELEE_TRAITS_BY_ID,
  WEAPONS,
  WEAPONS_BY_ID,
} from "../data/equipment.ts";
import type {
  CharacterInventory,
  InventoryEquipment,
  InventoryMeleeWeapon,
  InventoryWeapon,
} from "../lib/inventory_types.ts";
import {
  calculateInventoryPointCost,
  calculateInventoryWeight,
  countCarriedItemSlots,
  CREATION_FREE_ITEM_SLOTS,
  EXTRA_ITEM_POINT_COST,
} from "../lib/inventory_types.ts";
import PerkDescription from "./PerkDescription.tsx";

// ─── Types ──────────────────────────────────────────────────────────────────

type InventoryLocation = "carried" | "stowed";

interface InventorySectionProps {
  inventory: CharacterInventory;
  onChange: (inventory: CharacterInventory) => void;
  /** Whether this is in read-only viewer mode */
  readOnly?: boolean;
  /** Available stat points for display / validation (after perks, before inventory) */
  availablePoints?: number;
}

// ─── Lookups for weight calculation ─────────────────────────────────────────

const weightLookups = {
  getWeapon: (id: string) => WEAPONS_BY_ID.get(id),
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

function getWeaponPointCost(id: string): number {
  return WEAPONS_BY_ID.get(id)?.pointCost ?? 0;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function InventorySection(props: InventorySectionProps) {
  const { inventory, onChange, readOnly, availablePoints } = props;
  const [showAddWeapon, setShowAddWeapon] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showAddMelee, setShowAddMelee] = useState(false);
  const [weaponFilter, setWeaponFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [addTarget, setAddTarget] = useState<InventoryLocation>("carried");

  // ── Derived ──
  const carriedSlots = countCarriedItemSlots(inventory);
  const totalWeight = calculateInventoryWeight(inventory, weightLookups);
  const inventoryPointCost = calculateInventoryPointCost(inventory, getWeaponPointCost);
  const pointsAfterInventory = availablePoints != null
    ? availablePoints - inventoryPointCost
    : undefined;

  // ── Cost computation for adding an item ──
  /** Compute how many points adding a weapon to a location would cost */
  function weaponAddCost(weaponId: string, location: InventoryLocation): number {
    const def = WEAPONS_BY_ID.get(weaponId);
    if (!def) return 0;
    let cost = def.pointCost;
    if (location === "carried") {
      if (carriedSlots >= CREATION_FREE_ITEM_SLOTS) {
        cost += EXTRA_ITEM_POINT_COST;
      }
    }
    return cost;
  }

  /** Compute how many points adding equipment to a location would cost */
  function equipmentAddCost(location: InventoryLocation): number {
    if (location === "carried") {
      if (carriedSlots >= CREATION_FREE_ITEM_SLOTS) {
        return EXTRA_ITEM_POINT_COST;
      }
    }
    return 0;
  }

  function costLabel(cost: number): string {
    if (cost === 0) return "Free";
    return `${cost}pt`;
  }

  // ── Mutation helpers ──
  function update(fn: (inv: CharacterInventory) => CharacterInventory) {
    onChange(fn(structuredClone(inventory)));
  }

  // -- Add weapon --
  function addWeapon(weaponId: string, location: InventoryLocation) {
    const def = WEAPONS_BY_ID.get(weaponId);
    if (!def) return;
    const item: InventoryWeapon = {
      weaponId,
      currentAmmo: def.ammo,
      attachedIds: [],
      magazines: 0,
    };
    update((inv) => {
      inv[location].weapons.push(item);
      return inv;
    });
    setShowAddWeapon(false);
  }

  // -- Remove weapon --
  function removeWeapon(location: InventoryLocation, index: number) {
    update((inv) => {
      inv[location].weapons.splice(index, 1);
      return inv;
    });
  }

  // -- Move weapon between locations --
  function moveWeapon(
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) {
    update((inv) => {
      const [weapon] = inv[from].weapons.splice(index, 1);
      inv[to].weapons.push(weapon);
      return inv;
    });
  }

  // -- Add equipment --
  function addEquipment(equipmentId: string, location: InventoryLocation) {
    const def = EQUIPMENT_BY_ID.get(equipmentId);
    if (!def) return;
    const item: InventoryEquipment = {
      equipmentId,
      totalCharges: def.isCharge ? 1 : 0,
      usedCharges: 0,
    };
    update((inv) => {
      inv[location].equipment.push(item);
      return inv;
    });
    setShowAddEquipment(false);
  }

  // -- Remove equipment --
  function removeEquipment(location: InventoryLocation, index: number) {
    update((inv) => {
      inv[location].equipment.splice(index, 1);
      return inv;
    });
  }

  // -- Move equipment between locations --
  function moveEquipment(
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) {
    update((inv) => {
      const [eq] = inv[from].equipment.splice(index, 1);
      inv[to].equipment.push(eq);
      return inv;
    });
  }

  // -- Update total charges --
  function setTotalCharges(
    location: InventoryLocation,
    index: number,
    total: number,
  ) {
    update((inv) => {
      const eq = inv[location].equipment[index];
      eq.totalCharges = Math.max(0, total);
      if (eq.usedCharges > eq.totalCharges) eq.usedCharges = eq.totalCharges;
      return inv;
    });
  }

  // -- Toggle a charge used/unused --
  function toggleCharge(
    location: InventoryLocation,
    index: number,
    chargeIndex: number,
  ) {
    update((inv) => {
      const eq = inv[location].equipment[index];
      // chargeIndex < usedCharges means it's marking as unused (un-use from the right)
      // chargeIndex >= usedCharges means it's marking as used
      if (chargeIndex < eq.usedCharges) {
        eq.usedCharges = chargeIndex;
      } else {
        eq.usedCharges = chargeIndex + 1;
      }
      return inv;
    });
  }

  // -- Ammo tracking --
  function setCurrentAmmo(
    location: InventoryLocation,
    index: number,
    ammo: number,
  ) {
    update((inv) => {
      const def = WEAPONS_BY_ID.get(inv[location].weapons[index].weaponId);
      inv[location].weapons[index].currentAmmo = Math.max(
        0,
        Math.min(ammo, def?.ammo ?? 999),
      );
      return inv;
    });
  }

  // -- Magazine tracking --
  function setMagazines(
    location: InventoryLocation,
    index: number,
    count: number,
  ) {
    update((inv) => {
      inv[location].weapons[index].magazines = Math.max(0, count);
      return inv;
    });
  }

  // -- Attach / detach attachments --
  function attachToWeapon(
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
  ) {
    update((inv) => {
      inv[location].weapons[weaponIndex].attachedIds.push(attachmentId);
      return inv;
    });
  }

  function detachFromWeapon(
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
  ) {
    update((inv) => {
      const ids = inv[location].weapons[weaponIndex].attachedIds;
      const idx = ids.indexOf(attachmentId);
      if (idx >= 0) ids.splice(idx, 1);
      return inv;
    });
  }

  // -- Add melee weapon --
  function addMeleeWeapon(location: InventoryLocation) {
    const item: InventoryMeleeWeapon = {
      instanceId: crypto.randomUUID(),
      name: "New Melee Weapon",
      damage: 2,
      weight: 1,
      traitIds: [],
      description: "",
    };
    update((inv) => {
      inv[location].meleeWeapons.push(item);
      return inv;
    });
    setShowAddMelee(false);
  }

  // -- Remove melee weapon --
  function removeMeleeWeapon(location: InventoryLocation, index: number) {
    update((inv) => {
      inv[location].meleeWeapons.splice(index, 1);
      return inv;
    });
  }

  // -- Move melee weapon --
  function moveMeleeWeapon(
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) {
    update((inv) => {
      const [mw] = inv[from].meleeWeapons.splice(index, 1);
      inv[to].meleeWeapons.push(mw);
      return inv;
    });
  }

  // -- Update melee weapon fields --
  function updateMeleeWeapon(
    location: InventoryLocation,
    index: number,
    patch: Partial<InventoryMeleeWeapon>,
  ) {
    update((inv) => {
      inv[location].meleeWeapons[index] = {
        ...inv[location].meleeWeapons[index],
        ...patch,
      };
      return inv;
    });
  }

  // -- Toggle melee trait --
  function toggleMeleeTrait(
    location: InventoryLocation,
    index: number,
    traitId: string,
  ) {
    update((inv) => {
      const mw = inv[location].meleeWeapons[index];
      if (mw.traitIds.includes(traitId)) {
        mw.traitIds = mw.traitIds.filter((t) => t !== traitId);
      } else {
        mw.traitIds.push(traitId);
      }
      return inv;
    });
  }

  // ── Render helpers ──

  function renderWeapon(
    w: InventoryWeapon,
    location: InventoryLocation,
    index: number,
  ) {
    const def = WEAPONS_BY_ID.get(w.weaponId);
    if (!def) return <div class="text-red-500">Unknown weapon: {w.weaponId}</div>;

    const otherLocation: InventoryLocation = location === "carried"
      ? "stowed"
      : "carried";

    // Find compatible attachments not yet attached
    const availableAttachments = def.compatibleAttachmentIds
      .filter((aId) => !w.attachedIds.includes(aId))
      .map((aId) => ATTACHMENTS_BY_ID.get(aId))
      .filter(Boolean);

    // Check if weapon uses magazines (freeAccessoryIds)
    const hasMagazines = def.freeAccessoryIds && def.freeAccessoryIds.length > 0;
    const magazineAccessory = hasMagazines
      ? FREE_ACCESSORIES_BY_ID.get(def.freeAccessoryIds![0])
      : undefined;

    return (
      <div class="border rounded p-2 space-y-1 bg-white">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div>
            <strong>{def.name}</strong>{" "}
            <span class="text-xs text-gray-500">
              ({def.type} · {def.nation} · W:{def.weight} · DMG:{def.damage} · ROF:{def.rateOfFire})
            </span>
            {def.pointCost > 0 && (
              <span class="text-xs text-amber-600 ml-1">
                [Cost: {def.pointCost}pt]
              </span>
            )}
          </div>
          {!readOnly && (
            <div class="flex gap-1">
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
                onClick={() => moveWeapon(location, index, otherLocation)}
              >
                → {otherLocation === "carried" ? "Carry" : "Stow"}
              </button>
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded text-red-600 hover:bg-red-50"
                onClick={() => removeWeapon(location, index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Gimmicks */}
        <div class="text-xs text-gray-600 whitespace-pre-line ml-2">
          <PerkDescription name="" description={def.gimmicks} />
        </div>

        {/* Ammo tracker */}
        <div class="flex items-center gap-2 text-sm">
          <span>Ammo:</span>
          {readOnly ? (
            <strong>
              {w.currentAmmo} / {def.ammo}
            </strong>
          ) : (
            <>
              <input
                type="number"
                class="w-16 border rounded px-1 py-0.5 text-sm font-mono text-center"
                min="0"
                max={def.ammo}
                value={w.currentAmmo}
                onInput={(e) => {
                  const val = Number((e.target as HTMLInputElement).value);
                  if (!Number.isNaN(val)) setCurrentAmmo(location, index, val);
                }}
              />
              <span class="text-xs text-gray-500">/ {def.ammo}</span>
              <button
                type="button"
                class="px-1 text-xs border rounded hover:bg-gray-100"
                onClick={() => setCurrentAmmo(location, index, def.ammo)}
              >
                Reload
              </button>
            </>
          )}
        </div>

        {/* Magazine tracking */}
        {hasMagazines && magazineAccessory && (
          <div class="flex items-center gap-2 text-sm">
            <span>Spare magazines ({magazineAccessory.name}):</span>
            {readOnly ? (
              <strong>{w.magazines}</strong>
            ) : (
              <>
                <input
                  type="number"
                  class="w-16 border rounded px-1 py-0.5 text-sm font-mono text-center"
                  min="0"
                  value={w.magazines}
                  onInput={(e) => {
                    const val = Number((e.target as HTMLInputElement).value);
                    if (!Number.isNaN(val)) setMagazines(location, index, val);
                  }}
                />
                <span class="text-xs text-gray-500">
                  ({magazineAccessory.weight}W each)
                </span>
              </>
            )}
          </div>
        )}

        {/* Attached attachments */}
        {w.attachedIds.length > 0 && (
          <div class="ml-2 space-y-1">
            <span class="text-xs font-medium">Attachments:</span>
            {w.attachedIds.map((aId) => {
              const aDef = ATTACHMENTS_BY_ID.get(aId);
              return (
                <div key={aId} class="flex items-center gap-1 text-xs">
                  <span>
                    {aDef?.name ?? aId}
                    {aDef && aDef.weight > 0 && (
                      <span class="text-gray-400"> (W:{aDef.weight})</span>
                    )}
                  </span>
                  {!readOnly && (
                    <button
                      type="button"
                      class="px-1 border rounded text-red-500 hover:bg-red-50"
                      onClick={() => detachFromWeapon(location, index, aId)}
                    >
                      Detach
                    </button>
                  )}
                  {aDef && (
                    <details class="inline">
                      <summary class="cursor-pointer text-blue-500 ml-1">
                        info
                      </summary>
                      <div class="text-xs text-gray-500 whitespace-pre-line ml-2">
                        <PerkDescription name="" description={aDef.description} />
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Attach new attachment */}
        {!readOnly && availableAttachments.length > 0 && (
          <div class="ml-2">
            <select
              class="text-xs border rounded px-1 py-0.5"
              value=""
              onChange={(e) => {
                const val = (e.target as HTMLSelectElement).value;
                if (val) attachToWeapon(location, index, val);
              }}
            >
              <option value="">+ Attach…</option>
              {availableAttachments.map((a) => (
                <option key={a!.id} value={a!.id}>
                  {a!.name} (W:{a!.weight})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  function renderEquipment(
    eq: InventoryEquipment,
    location: InventoryLocation,
    index: number,
  ) {
    const def = EQUIPMENT_BY_ID.get(eq.equipmentId);
    if (!def) {
      return <div class="text-red-500">Unknown equipment: {eq.equipmentId}</div>;
    }

    const otherLocation: InventoryLocation = location === "carried"
      ? "stowed"
      : "carried";

    const remaining = def.isCharge
      ? Math.max(0, eq.totalCharges - eq.usedCharges)
      : 0;
    const currentWeight = def.isCharge
      ? def.weight * remaining
      : def.weight;

    return (
      <div class="border rounded p-2 space-y-1 bg-white">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div>
            <strong>{def.name}</strong>{" "}
            <span class="text-xs text-gray-500">
              (W:{currentWeight}{def.isBulky ? " · Bulky" : ""})
            </span>
          </div>
          {!readOnly && (
            <div class="flex gap-1">
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
                onClick={() => moveEquipment(location, index, otherLocation)}
              >
                → {otherLocation === "carried" ? "Carry" : "Stow"}
              </button>
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded text-red-600 hover:bg-red-50"
                onClick={() => removeEquipment(location, index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div class="text-xs text-gray-600 whitespace-pre-line ml-2">
          <PerkDescription name="" description={def.description} />
        </div>

        {/* Charge tracking with checkboxes */}
        {def.isCharge && (
          <div class="space-y-1 text-sm">
            <div class="flex items-center gap-2">
              <span>Charges:</span>
              {!readOnly && (
                <span class="text-xs text-gray-500">
                  (Total:{" "}
                  <input
                    type="number"
                    class="w-12 border rounded px-1 text-xs"
                    min="0"
                    value={eq.totalCharges}
                    onInput={(e) => {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!Number.isNaN(val)) setTotalCharges(location, index, val);
                    }}
                  />
                  )
                </span>
              )}
            </div>
            <div class="flex flex-wrap gap-1 ml-2">
              {Array.from({ length: eq.totalCharges }, (_, ci) => {
                const isUsed = ci < eq.usedCharges;
                return (
                  <button
                    key={ci}
                    type="button"
                    disabled={readOnly}
                    class={`w-6 h-6 border rounded text-xs flex items-center justify-center ${
                      isUsed
                        ? "bg-red-100 border-red-400 text-red-600"
                        : "bg-green-50 border-green-400 text-green-700"
                    } ${readOnly ? "cursor-default" : "cursor-pointer hover:opacity-75"}`}
                    title={isUsed ? "Used (click to restore)" : "Available (click to use)"}
                    onClick={() => !readOnly && toggleCharge(location, index, ci)}
                  >
                    {isUsed ? "✕" : "●"}
                  </button>
                );
              })}
            </div>
            <div class="text-xs text-gray-500 ml-2">
              {remaining} remaining · {eq.usedCharges} used · W:{currentWeight}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderMeleeWeapon(
    mw: InventoryMeleeWeapon,
    location: InventoryLocation,
    index: number,
  ) {
    const otherLocation: InventoryLocation = location === "carried"
      ? "stowed"
      : "carried";

    return (
      <div class="border rounded p-2 space-y-1 bg-white">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div>
            {readOnly ? (
              <strong>{mw.name}</strong>
            ) : (
              <input
                type="text"
                class="border rounded px-1 py-0.5 text-sm font-bold"
                value={mw.name}
                onInput={(e) =>
                  updateMeleeWeapon(location, index, {
                    name: (e.target as HTMLInputElement).value,
                  })}
              />
            )}
            <span class="text-xs text-gray-500 ml-1">
              (DMG:{mw.damage} · W:{mw.weight})
            </span>
          </div>
          {!readOnly && (
            <div class="flex gap-1">
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
                onClick={() => moveMeleeWeapon(location, index, otherLocation)}
              >
                → {otherLocation === "carried" ? "Carry" : "Stow"}
              </button>
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded text-red-600 hover:bg-red-50"
                onClick={() => removeMeleeWeapon(location, index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Editable stats */}
        {!readOnly && (
          <div class="flex gap-2 text-sm">
            <label>
              Damage:{" "}
              <input
                type="number"
                class="w-12 border rounded px-1"
                value={mw.damage}
                onInput={(e) =>
                  updateMeleeWeapon(location, index, {
                    damage: Number((e.target as HTMLInputElement).value) || 0,
                  })}
              />
            </label>
            <label>
              Weight:{" "}
              <input
                type="number"
                class="w-12 border rounded px-1"
                min="0"
                value={mw.weight}
                onInput={(e) =>
                  updateMeleeWeapon(location, index, {
                    weight: Math.max(
                      0,
                      Number((e.target as HTMLInputElement).value) || 0,
                    ),
                  })}
              />
            </label>
          </div>
        )}

        {/* Description */}
        {readOnly ? (
          mw.description && (
            <div class="text-xs text-gray-600 whitespace-pre-line ml-2">
              {mw.description}
            </div>
          )
        ) : (
          <textarea
            class="w-full text-xs border rounded px-2 py-1"
            placeholder="Weapon description…"
            rows={2}
            value={mw.description}
            onInput={(e) =>
              updateMeleeWeapon(location, index, {
                description: (e.target as HTMLTextAreaElement).value,
              })}
          />
        )}

        {/* Melee traits */}
        <div class="space-y-0.5">
          <span class="text-xs font-medium">Traits:</span>
          {readOnly ? (
            mw.traitIds.length > 0 ? (
              <ul class="ml-2 text-xs space-y-0.5">
                {mw.traitIds.map((tid) => {
                  const trait = MELEE_TRAITS_BY_ID.get(tid);
                  return (
                    <li key={tid}>
                      <strong>{trait?.name ?? tid}:</strong>{" "}
                      {trait?.description ?? ""}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span class="text-xs text-gray-400 ml-1">None</span>
            )
          ) : (
            <div class="ml-2 flex flex-wrap gap-1">
              {MELEE_TRAITS.map((trait) => {
                const active = mw.traitIds.includes(trait.id);
                return (
                  <button
                    key={trait.id}
                    type="button"
                    class={`text-xs px-1.5 py-0.5 rounded border ${
                      active ? "bg-blue-100 border-blue-400" : "hover:bg-gray-50"
                    }`}
                    title={trait.description}
                    onClick={() => toggleMeleeTrait(location, index, trait.id)}
                  >
                    {trait.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderInventoryBlock(location: InventoryLocation) {
    const inv = inventory[location];
    const label = location === "carried" ? "Equipment (On Person)" : "Stowed (Owned, Not Carried)";
    const isEmpty =
      inv.weapons.length === 0 &&
      inv.meleeWeapons.length === 0 &&
      inv.equipment.length === 0;

    return (
      <div class="space-y-2">
        <h4 class="font-medium text-sm">
          {label}
          {location === "carried" && (
            <span class="text-xs text-gray-500 ml-2">
              (Weight: {totalWeight})
            </span>
          )}
        </h4>

        {isEmpty && (
          <p class="text-sm text-gray-400 italic">No items.</p>
        )}

        {/* Weapons */}
        {inv.weapons.length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Weapons
            </h5>
            {inv.weapons.map((w, i) => (
              <div key={`${location}-weapon-${i}`}>
                {renderWeapon(w, location, i)}
              </div>
            ))}
          </div>
        )}

        {/* Melee weapons */}
        {inv.meleeWeapons.length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Melee Weapons
            </h5>
            {inv.meleeWeapons.map((mw, i) => (
              <div key={`${location}-melee-${mw.instanceId}`}>
                {renderMeleeWeapon(mw, location, i)}
              </div>
            ))}
          </div>
        )}

        {/* Equipment */}
        {inv.equipment.length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Equipment
            </h5>
            {inv.equipment.map((eq, i) => (
              <div key={`${location}-equip-${i}`}>
                {renderEquipment(eq, location, i)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Filter available weapons/equipment ──
  const filteredWeapons = WEAPONS.filter((w) => {
    if (!weaponFilter) return true;
    const q = weaponFilter.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.type.toLowerCase().includes(q) ||
      w.nation.toLowerCase().includes(q)
    );
  });

  const filteredEquipment = EQUIPMENT.filter((e) => {
    if (!equipmentFilter) return true;
    return e.name.toLowerCase().includes(equipmentFilter.toLowerCase());
  });

  return (
    <div class="rounded border p-3 space-y-3">
      <h3 class="font-semibold">
        Inventory
        {pointsAfterInventory != null && (
          <span class={`text-sm font-normal ml-2 ${pointsAfterInventory < 0 ? "text-red-600" : "text-gray-500"}`}>
            (Inventory cost: {inventoryPointCost}pt · Remaining: {pointsAfterInventory}pt)
          </span>
        )}
      </h3>

      {/* Carried inventory */}
      {renderInventoryBlock("carried")}

      <hr class="border-gray-200" />

      {/* Stowed inventory */}
      {renderInventoryBlock("stowed")}

      {/* Add item controls */}
      {!readOnly && (
        <div class="space-y-2 border-t pt-2">
          <div class="flex flex-wrap gap-2">
            <div>
              <label class="text-xs mr-1">Add to:</label>
              <select
                class="text-xs border rounded px-1 py-0.5"
                value={addTarget}
                onChange={(e) =>
                  setAddTarget(
                    (e.target as HTMLSelectElement).value as InventoryLocation,
                  )}
              >
                <option value="carried">Carried</option>
                <option value="stowed">Stowed</option>
              </select>
            </div>
            <button
              type="button"
              class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
              onClick={() => {
                setShowAddWeapon((v) => !v);
                setShowAddEquipment(false);
                setShowAddMelee(false);
              }}
            >
              {showAddWeapon ? "Cancel" : "+ Weapon"}
            </button>
            <button
              type="button"
              class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
              onClick={() => {
                setShowAddEquipment((v) => !v);
                setShowAddWeapon(false);
                setShowAddMelee(false);
              }}
            >
              {showAddEquipment ? "Cancel" : "+ Equipment"}
            </button>
            <button
              type="button"
              class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
              onClick={() => {
                setShowAddMelee((v) => !v);
                setShowAddWeapon(false);
                setShowAddEquipment(false);
              }}
            >
              {showAddMelee ? "Cancel" : "+ Melee Weapon"}
            </button>
          </div>

          {/* Weapon picker */}
          {showAddWeapon && (
            <div class="space-y-1 border rounded p-2 bg-gray-50">
              <input
                type="text"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="Filter weapons by name, type, or nation…"
                value={weaponFilter}
                onInput={(e) =>
                  setWeaponFilter((e.target as HTMLInputElement).value)}
              />
              {filteredWeapons.length === 0 ? (
                <p class="text-sm text-gray-400 italic">No matching weapons.</p>
              ) : (
                <ul class="max-h-64 overflow-y-auto space-y-1">
                  {filteredWeapons.map((w) => {
                    const addCost = weaponAddCost(w.id, addTarget);
                    return (
                      <li
                        key={w.id}
                        class="flex items-center justify-between text-sm"
                      >
                        <span>
                          {w.name}{" "}
                          <span class="text-xs text-gray-500">
                            ({w.type} · {w.nation} · W:{w.weight} · DMG:{w.damage})
                          </span>
                          {w.pointCost > 0 && (
                            <span class="text-xs text-amber-600 ml-1">
                              [Cost: {w.pointCost}pt]
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
                          onClick={() => addWeapon(w.id, addTarget)}
                        >
                          Add ({costLabel(addCost)})
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Equipment picker */}
          {showAddEquipment && (
            <div class="space-y-1 border rounded p-2 bg-gray-50">
              <input
                type="text"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="Filter equipment by name…"
                value={equipmentFilter}
                onInput={(e) =>
                  setEquipmentFilter((e.target as HTMLInputElement).value)}
              />
              {filteredEquipment.length === 0 ? (
                <p class="text-sm text-gray-400 italic">
                  No matching equipment.
                </p>
              ) : (
                <ul class="space-y-1">
                  {filteredEquipment.map((eq) => {
                    const addCost = equipmentAddCost(addTarget);
                    return (
                      <li
                        key={eq.id}
                        class="flex items-center justify-between text-sm"
                      >
                        <span>
                          {eq.name}{" "}
                          <span class="text-xs text-gray-500">
                            (W:{eq.weight}
                            {eq.isCharge ? " · Charges" : ""}
                            {eq.isBulky ? " · Bulky" : ""})
                          </span>
                        </span>
                        <button
                          type="button"
                          class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
                          onClick={() => addEquipment(eq.id, addTarget)}
                        >
                          Add ({costLabel(addCost)})
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Melee weapon creator */}
          {showAddMelee && (
            <div class="border rounded p-2 bg-gray-50 space-y-1">
              <p class="text-sm text-gray-600">
                Create a new melee weapon template. You can customize its name,
                damage, weight, and traits after adding it.
              </p>
              <button
                type="button"
                class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                onClick={() => addMeleeWeapon(addTarget)}
              >
                Create Melee Weapon
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
