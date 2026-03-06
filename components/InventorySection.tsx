import { useCallback, useRef, useState } from "preact/hooks";
import {
  ATTACHMENTS,
  ATTACHMENTS_BY_ID,
  EQUIPMENT,
  EQUIPMENT_BY_ID,
  type Nation,
  NATIONS,
  WEAPONS,
  WEAPONS_BY_ID,
} from "@/data/equipment.ts";
import type {
  CharacterInventory,
  InventoryAttachment,
  InventoryEquipment,
  InventoryMeleeWeapon,
  InventoryWeapon,
} from "@/lib/inventory_types.ts";
import {
  calculateInventoryPointCost,
  calculateInventoryWeight,
  countAllItemSlots,
  CREATION_FREE_ITEM_SLOTS,
  EXTRA_ITEM_POINT_COST,
} from "@/lib/inventory_types.ts";
import PerkDescription from "./PerkDescription.tsx";
import WeaponCard from "./inventory/WeaponCard.tsx";
import EquipmentCard from "./inventory/EquipmentCard.tsx";
import MeleeWeaponCard from "./inventory/MeleeWeaponCard.tsx";
import AttachmentCard from "./inventory/AttachmentCard.tsx";
import {
  type InventoryLocation,
  getWeaponPointCost,
  getSignatureAdjustedPointCost,
  weightLookups,
  slotLookups,
} from "./inventory/helpers.ts";

interface InventorySectionProps {
  inventory: CharacterInventory;
  onChange: (inventory: CharacterInventory) => void;
  /** Whether this is in read-only viewer mode */
  readOnly?: boolean;
  /** Available stat points for display / validation (after perks, before inventory) */
  availablePoints?: number;
  /**
   * Character ID for auto-saving combat state (ammo, charges, magazines).
   * When set, changes to ammo/charges/magazines are auto-saved via PATCH.
   */
  characterId?: string;
  /** The character's perk IDs – used for features like Signature Weapon */
  perkIds?: string[];
}


// ─── Component ──────────────────────────────────────────────────────────────

export default function InventorySection(props: InventorySectionProps) {
  const {
    inventory,
    onChange,
    readOnly,
    availablePoints,
    characterId,
    perkIds,
  } = props;
  const hasSignatureWeaponPerk = perkIds?.includes("signiature-weapon") ??
    false;
  const hasWeaponMaster = perkIds?.includes("weapon-master") ?? false;
  const [showAddWeapon, setShowAddWeapon] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showAddMelee, setShowAddMelee] = useState(false);
  const [showAddAttachment, setShowAddAttachment] = useState(false);
  const [weaponFilter, setWeaponFilter] = useState("");
  const [nationFilter, setNationFilter] = useState<Nation | "">("");
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [attachmentFilter, setAttachmentFilter] = useState("");
  const [attachmentNationFilter, setAttachmentNationFilter] = useState<
    Nation | ""
  >("");
  const [addTarget, setAddTarget] = useState<InventoryLocation>("carried");

  // ── Derived ──
  const allSlots = countAllItemSlots(inventory, slotLookups);
  const carriedBulkyCount = inventory.carried.equipment.reduce((count, eq) => {
    return count + (EQUIPMENT_BY_ID.get(eq.equipmentId)?.isBulky ? 1 : 0);
  }, 0);
  const totalWeight = calculateInventoryWeight(inventory, weightLookups);

  // Compute inventory point cost with signature weapon adjustments
  const inventoryPointCost = (() => {
    // Use the signature-adjusted cost function
    const adjustedGetCost = (id: string) => getWeaponPointCost(id, perkIds);
    let cost = calculateInventoryPointCost(
      inventory,
      adjustedGetCost,
      slotLookups,
    );

    if (hasSignatureWeaponPerk) {
      // Recalculate with signature adjustments
      cost = 0;

      const adjustedSlots = countAllItemSlots(inventory, slotLookups);
      const overFree = Math.max(0, adjustedSlots - CREATION_FREE_ITEM_SLOTS);
      cost += overFree * EXTRA_ITEM_POINT_COST;

      // Weapon-specific costs with signature adjustment
      for (const w of inventory.carried.weapons) {
        cost += getSignatureAdjustedPointCost(
          w.weaponId,
          !!w.isSignatureWeapon,
          perkIds,
        );
      }
      for (const w of inventory.stowed.weapons) {
        cost += getSignatureAdjustedPointCost(
          w.weaponId,
          !!w.isSignatureWeapon,
          perkIds,
        );
      }
    } else {
      cost = calculateInventoryPointCost(
        inventory,
        (id) => getWeaponPointCost(id, perkIds),
        slotLookups,
      );
    }

    return cost;
  })();
  const pointsAfterInventory = availablePoints != null
    ? availablePoints - inventoryPointCost
    : undefined;

  // ── Cost computation for adding an item ──
  /** Compute how many points adding a weapon to a location would cost */
  function weaponAddCost(
    weaponId: string,
    _location: InventoryLocation,
  ): number {
    let cost = getWeaponPointCost(weaponId, perkIds);
    if (allSlots >= CREATION_FREE_ITEM_SLOTS) {
      cost += EXTRA_ITEM_POINT_COST;
    }
    return cost;
  }

  /** Compute how many points adding equipment to a location would cost */
  function equipmentAddCost(_location: InventoryLocation): number {
    if (allSlots >= CREATION_FREE_ITEM_SLOTS) {
      return EXTRA_ITEM_POINT_COST;
    }
    return 0;
  }

  /** Compute how many points adding an attachment to a location would cost */
  function attachmentAddCost(_location: InventoryLocation): number {
    if (allSlots >= CREATION_FREE_ITEM_SLOTS) {
      return EXTRA_ITEM_POINT_COST;
    }
    return 0;
  }

  function costLabel(cost: number): string {
    if (cost === 0) return "Free";
    return `${cost}pt`;
  }

  // ── Auto-save combat state (ammo, charges, magazines) ──
  const saveTimerRef = useRef<number | undefined>(undefined);
  const saveCombatState = useCallback(
    (inv: CharacterInventory) => {
      if (!characterId) return;
      if (saveTimerRef.current !== undefined) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        fetch(`/api/characters/${characterId}/combat-state`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inventory: inv }),
        }).catch(() => {/* silent fail */});
      }, 500) as unknown as number;
    },
    [characterId],
  );

  // ── Mutation helpers ──
  function update(fn: (inv: CharacterInventory) => CharacterInventory) {
    const next = fn(structuredClone(inventory));
    onChange(next);
    return next;
  }

  /** Update that also triggers combat-state auto-save */
  function updateCombat(fn: (inv: CharacterInventory) => CharacterInventory) {
    const next = update(fn);
    saveCombatState(next);
  }

  // ── Signature Weapon helpers ──

  /** Clear the signature flag from ALL weapons/melee in the inventory */
  function clearSignatureFlags(inv: CharacterInventory) {
    for (const loc of ["carried", "stowed"] as const) {
      for (const w of inv[loc].weapons) w.isSignatureWeapon = false;
      for (const mw of inv[loc].meleeWeapons) mw.isSignatureWeapon = false;
    }
  }

  /** Toggle a ranged weapon as signature */
  function toggleSignatureWeapon(location: InventoryLocation, index: number) {
    update((inv) => {
      const isAlready = inv[location].weapons[index].isSignatureWeapon;
      clearSignatureFlags(inv);
      if (!isAlready) {
        inv[location].weapons[index].isSignatureWeapon = true;
      }
      return inv;
    });
  }

  /** Toggle a melee weapon as signature */
  function toggleSignatureMelee(location: InventoryLocation, index: number) {
    update((inv) => {
      const isAlready = inv[location].meleeWeapons[index].isSignatureWeapon;
      clearSignatureFlags(inv);
      if (!isAlready) {
        inv[location].meleeWeapons[index].isSignatureWeapon = true;
      }
      return inv;
    });
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
      partialMagazines: [],
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
      const weapon = inv[location].weapons[index];
      // Return attached attachments to inventory before removing
      if (weapon && weapon.attachedIds.length > 0) {
        for (const aId of weapon.attachedIds) {
          const aDef = ATTACHMENTS_BY_ID.get(aId);
          inv[location].attachments.push({
            attachmentId: aId,
            totalCharges: aDef?.isCharge ? 1 : 0,
            usedCharges: 0,
          });
        }
      }
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
    if (location === "carried" && def.isBulky && carriedBulkyCount > 0) {
      return;
    }
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
      const eq = inv[from].equipment[index];
      const def = eq ? EQUIPMENT_BY_ID.get(eq.equipmentId) : undefined;
      if (
        to === "carried" &&
        def?.isBulky &&
        inv.carried.equipment.some((existing, existingIndex) =>
          existingIndex !== index || from !== "carried"
            ? EQUIPMENT_BY_ID.get(existing.equipmentId)?.isBulky
            : false
        )
      ) {
        return inv;
      }

      const [moved] = inv[from].equipment.splice(index, 1);
      if (!moved) return inv;
      inv[to].equipment.push(moved);
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
      eq.totalCharges = Math.max(1, total);
      if (eq.usedCharges > eq.totalCharges) eq.usedCharges = eq.totalCharges;
      return inv;
    });
  }

  // -- Toggle a charge used/unused (right-to-left: rightmost charge is spent first) --
  function toggleCharge(
    location: InventoryLocation,
    index: number,
    chargeIndex: number,
  ) {
    updateCombat((inv) => {
      const eq = inv[location].equipment[index];
      const isUsed = chargeIndex >= eq.totalCharges - eq.usedCharges;
      if (isUsed) {
        // Restore this charge and all to its left
        eq.usedCharges = eq.totalCharges - chargeIndex - 1;
      } else {
        // Use this charge and all to its right
        eq.usedCharges = eq.totalCharges - chargeIndex;
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
    updateCombat((inv) => {
      const weapon = inv[location].weapons[index];
      const def = WEAPONS_BY_ID.get(weapon.weaponId);
      // Check for ammo override from attached attachments
      let maxAmmo = def?.ammo ?? 999;
      for (const aId of weapon.attachedIds) {
        const aDef = ATTACHMENTS_BY_ID.get(aId);
        if (aDef?.ammoOverride) maxAmmo = aDef.ammoOverride;
      }
      weapon.currentAmmo = Math.max(0, Math.min(ammo, maxAmmo));
      return inv;
    });
  }

  // -- Magazine tracking --
  function setMagazines(
    location: InventoryLocation,
    index: number,
    count: number,
  ) {
    updateCombat((inv) => {
      inv[location].weapons[index].magazines = Math.max(0, count);
      return inv;
    });
  }

  // -- Attach / detach attachments (moves from inventory to weapon and back) --
  function attachToWeapon(
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
  ) {
    updateCombat((inv) => {
      const weapon = inv[location].weapons[weaponIndex];
      // Find the attachment in the same location's inventory
      const attIdx = inv[location].attachments.findIndex(
        (a) => a.attachmentId === attachmentId,
      );
      const attDef = ATTACHMENTS_BY_ID.get(attachmentId);
      let attInv: InventoryAttachment | undefined;
      if (attIdx >= 0) {
        attInv = inv[location].attachments.splice(attIdx, 1)[0];
      }
      weapon.attachedIds.push(attachmentId);

      // For charge-based attachments: save charge data on the weapon so totalCharges
      // survives while the attachment is equipped and can be restored on detach.
      if (attDef?.isCharge && attInv) {
        if (!weapon.attachmentChargeData) weapon.attachmentChargeData = {};
        weapon.attachmentChargeData[attachmentId] = {
          totalCharges: attInv.totalCharges,
          usedCharges: attInv.usedCharges,
        };
      }

      // For charge-based magazine attachments: convert charges into weapon magazines
      if (attDef?.isCharge && attDef.ammoOverride && attInv) {
        const remainingCharges = Math.max(
          0,
          attInv.totalCharges - attInv.usedCharges,
        );

        if (remainingCharges > 0) {
          // Check if we have saved magazine states from a previous detach
          if (
            attInv.savedMagazineStates && attInv.savedMagazineStates.length > 0
          ) {
            const ammoOverride = attDef.ammoOverride!;
            // Use only as many saved states as remainingCharges allows, so a
            // manually-reduced totalCharges doesn't resurrect extra magazines.
            const statesToUse = [...attInv.savedMagazineStates]
              .sort((a, b) => b - a)
              .slice(0, remainingCharges);
            // Load the best magazine
            const best = statesToUse.shift()!;
            weapon.currentAmmo = best;
            // Separate remaining into full and partial
            const fullMags = statesToUse.filter((s) => s >= ammoOverride).length;
            const partials = statesToUse.filter((s) => s < ammoOverride);
            // If the user manually increased totalCharges beyond what savedMagazineStates
            // recorded (e.g. bought more magazines after a detach), treat the surplus
            // as additional full magazines so they are not silently dropped.
            const extraFullMags = Math.max(
              0,
              remainingCharges - attInv.savedMagazineStates.length,
            );
            weapon.magazines = fullMags + extraFullMags;
            weapon.partialMagazines = partials;
          } else {
            // Fresh attach: load one magazine, rest are spare
            weapon.currentAmmo = attDef.ammoOverride;
            weapon.magazines = remainingCharges - 1;
            weapon.partialMagazines = [];
          }
        }
        // If remainingCharges === 0, don't change ammo or magazines
      }

      if (attDef?.ammoOverride) {
        weapon.currentAmmo = Math.min(weapon.currentAmmo, attDef.ammoOverride);
      }
      return inv;
    });
  }

  function detachFromWeapon(
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
  ) {
    updateCombat((inv) => {
      const weapon = inv[location].weapons[weaponIndex];
      const ids = weapon.attachedIds;
      const idx = ids.indexOf(attachmentId);
      if (idx >= 0) ids.splice(idx, 1);

      const attDef = ATTACHMENTS_BY_ID.get(attachmentId);

      // For charge-based magazine attachments: convert weapon magazines back to charges
      // and save individual magazine ammo states for re-attachment
      if (attDef?.isCharge && attDef.ammoOverride) {
        const partials = weapon.partialMagazines ?? [];
        // Build array of all magazine ammo states:
        // full spare magazines + partial spare magazines + the loaded magazine
        const savedStates: number[] = [];
        for (let i = 0; i < weapon.magazines; i++) {
          savedStates.push(attDef.ammoOverride);
        }
        for (const p of partials) {
          savedStates.push(p);
        }
        // Include the currently loaded magazine if it has ammo
        if (weapon.currentAmmo > 0) {
          savedStates.push(weapon.currentAmmo);
        }

        // Restore the original totalCharges so that spending magazines only raises
        // usedCharges rather than reducing totalCharges.
        const savedChargeData = weapon.attachmentChargeData?.[attachmentId];
        const originalTotalCharges = savedChargeData?.totalCharges ?? savedStates.length;
        const usedCharges = Math.max(0, originalTotalCharges - savedStates.length);
        inv[location].attachments.push({
          attachmentId,
          totalCharges: originalTotalCharges,
          usedCharges,
          savedMagazineStates: savedStates,
        });
        if (weapon.attachmentChargeData) {
          delete weapon.attachmentChargeData[attachmentId];
        }
        weapon.magazines = 0;
        weapon.partialMagazines = [];
        // Revert ammo to weapon default (gun is empty after removing magazine)
        const wDef = WEAPONS_BY_ID.get(weapon.weaponId);
        weapon.currentAmmo = Math.min(weapon.currentAmmo, wDef?.ammo ?? 999);
      } else {
        // Return the attachment to the same location's inventory.
        // For charge-based non-magazine attachments, restore the charge state that was
        // saved when the attachment was equipped.
        const savedChargeData = weapon.attachmentChargeData?.[attachmentId];
        inv[location].attachments.push({
          attachmentId,
          totalCharges: savedChargeData?.totalCharges ?? (attDef?.isCharge ? 1 : 0),
          usedCharges: savedChargeData?.usedCharges ?? 0,
        });
        // Clean up saved state from weapon
        if (weapon.attachmentChargeData) {
          delete weapon.attachmentChargeData[attachmentId];
        }
      }
      return inv;
    });
  }

  // -- Toggle a charge for a non-magazine isCharge attachment currently on a weapon --
  function toggleAttachedWeaponCharge(
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
    chargeIndex: number,
  ) {
    updateCombat((inv) => {
      const weapon = inv[location].weapons[weaponIndex];
      if (!weapon.attachmentChargeData) return inv;
      const chargeData = weapon.attachmentChargeData[attachmentId];
      if (!chargeData) return inv;
      const { totalCharges, usedCharges } = chargeData;
      // Right-to-left: charges to the right are spent first
      const usedStartIndex = totalCharges - usedCharges;
      if (chargeIndex >= usedStartIndex) {
        // Currently used → restore it
        chargeData.usedCharges = Math.max(0, usedCharges - 1);
      } else {
        // Currently available → use it
        chargeData.usedCharges = Math.min(totalCharges, usedCharges + 1);
      }
      return inv;
    });
  }

  // -- Add / remove loose attachment in inventory --
  function addAttachmentToInventory(
    attachmentId: string,
    location: InventoryLocation,
  ) {
    const def = ATTACHMENTS_BY_ID.get(attachmentId);
    if (!def) return;
    const item: InventoryAttachment = {
      attachmentId,
      totalCharges: def.isCharge ? 1 : 0,
      usedCharges: 0,
    };
    update((inv) => {
      inv[location].attachments.push(item);
      return inv;
    });
    setShowAddAttachment(false);
  }

  function removeAttachment(location: InventoryLocation, index: number) {
    update((inv) => {
      inv[location].attachments.splice(index, 1);
      return inv;
    });
  }

  function moveAttachment(
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) {
    update((inv) => {
      const [att] = inv[from].attachments.splice(index, 1);
      inv[to].attachments.push(att);
      return inv;
    });
  }

  function setAttachmentTotalCharges(
    location: InventoryLocation,
    index: number,
    total: number,
  ) {
    update((inv) => {
      const att = inv[location].attachments[index];
      att.totalCharges = Math.max(1, total);
      if (att.usedCharges > att.totalCharges) {
        att.usedCharges = att.totalCharges;
      }
      return inv;
    });
  }

  // -- Toggle an attachment charge used/unused (same logic as equipment toggleCharge) --
  function toggleAttachmentCharge(
    location: InventoryLocation,
    index: number,
    chargeIndex: number,
  ) {
    updateCombat((inv) => {
      const att = inv[location].attachments[index];
      const isUsed = chargeIndex >= att.totalCharges - att.usedCharges;
      if (isUsed) {
        att.usedCharges = att.totalCharges - chargeIndex - 1;
      } else {
        att.usedCharges = att.totalCharges - chargeIndex;
      }
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

  function renderInventoryBlock(location: InventoryLocation) {
    const inv = inventory[location];
    const label = location === "carried"
      ? "Equipment (On Person)"
      : "Stowed (Owned, Not Carried)";
    const isEmpty = inv.weapons.length === 0 &&
      inv.meleeWeapons.length === 0 &&
      inv.equipment.length === 0 &&
      (inv.attachments ?? []).length === 0;

    return (
      <div class="space-y-2">
        <h4 class="font-medium text-sm">
          {label}
          {location === "carried" && (
            <span class="text-xs text-base-content/60 ml-2">
              (Weight: {totalWeight})
            </span>
          )}
        </h4>

        {isEmpty && <p class="text-sm text-base-content/50 italic">No items.</p>}

        {/* Weapons */}
        {inv.weapons.length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-base-content/70 uppercase tracking-wide">
              Weapons
            </h5>
            {inv.weapons.map((w, i) => (
              <div key={`${location}-weapon-${i}`}>
                <WeaponCard
                  weapon={w}
                  location={location}
                  index={i}
                  readOnly={readOnly}
                  hasSignatureWeaponPerk={hasSignatureWeaponPerk}
                  perkIds={perkIds}
                  inventory={inventory}
                  onToggleSignature={toggleSignatureWeapon}
                  onMove={moveWeapon}
                  onRemove={removeWeapon}
                  onSetAmmo={setCurrentAmmo}
                  onSetMagazines={setMagazines}
                  onAttach={attachToWeapon}
                  onDetach={detachFromWeapon}
                  onToggleAttachedCharge={toggleAttachedWeaponCharge}
                  onUpdateCombat={updateCombat}
                />
              </div>
            ))}
          </div>
        )}

        {/* Melee weapons */}
        {inv.meleeWeapons.length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-base-content/70 uppercase tracking-wide">
              Melee Weapons
            </h5>
            {inv.meleeWeapons.map((mw, i) => (
              <div key={`${location}-melee-${mw.instanceId}`}>
                <MeleeWeaponCard
                  meleeWeapon={mw}
                  location={location}
                  index={i}
                  readOnly={readOnly}
                  hasSignatureWeaponPerk={hasSignatureWeaponPerk}
                  onToggleSignature={toggleSignatureMelee}
                  onMove={moveMeleeWeapon}
                  onRemove={removeMeleeWeapon}
                  onUpdate={updateMeleeWeapon}
                  onToggleTrait={toggleMeleeTrait}
                />
              </div>
            ))}
          </div>
        )}

        {/* Equipment */}
        {inv.equipment.length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-base-content/70 uppercase tracking-wide">
              Equipment
            </h5>
            {inv.equipment.map((eq, i) => (
              <div key={`${location}-equip-${i}`}>
                <EquipmentCard
                  equipment={eq}
                  location={location}
                  index={i}
                  readOnly={readOnly}
                  carriedBulkyCount={carriedBulkyCount}
                  onMove={moveEquipment}
                  onRemove={removeEquipment}
                  onSetTotalCharges={setTotalCharges}
                  onToggleCharge={toggleCharge}
                />
              </div>
            ))}
          </div>
        )}

        {/* Attachments (loose, not attached to any weapon) */}
        {(inv.attachments ?? []).length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-base-content/70 uppercase tracking-wide">
              Attachments (Unattached)
            </h5>
            {(inv.attachments ?? []).map((att, i) => (
              <div key={`${location}-att-${i}`}>
                <AttachmentCard
                  attachment={att}
                  location={location}
                  index={i}
                  readOnly={readOnly}
                  onMove={moveAttachment}
                  onRemove={removeAttachment}
                  onSetTotalCharges={setAttachmentTotalCharges}
                  onToggleCharge={toggleAttachmentCharge}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Filter available weapons/equipment ──
  const filteredWeapons = WEAPONS.filter((w) => {
    if (nationFilter) {
      // "Any" nation weapons show for all non-Civilian nations
      if (w.nation === "Any") {
        if (nationFilter === "Civilian") return false;
      } else if (w.nation !== nationFilter) {
        return false;
      }
    }
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

  const filteredAttachments = ATTACHMENTS.filter((a) => {
    if (attachmentNationFilter) {
      if (attachmentNationFilter === "Any") {
        // "Generic" filter: only show attachments with nation "Any"
        if (a.nation !== "Any") return false;
      } else {
        if (a.nation !== attachmentNationFilter) return false;
      }
    }
    if (!attachmentFilter) return true;
    const q = attachmentFilter.toLowerCase();
    return a.name.toLowerCase().includes(q) ||
      a.appliesTo.toLowerCase().includes(q);
  });

  return (
    <div class="rounded border p-3 space-y-3">
      <h3 class="font-semibold">
        Inventory
        {pointsAfterInventory != null && (
          <span
            class={`text-sm font-normal ml-2 ${
              pointsAfterInventory < 0 ? "text-error" : "text-base-content/60"
            }`}
          >
            (Inventory cost: {inventoryPointCost}pt · Remaining:{" "}
            {pointsAfterInventory}pt)
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
                class="select text-xs border rounded px-1 py-0.5"
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
              class="px-2 py-1 text-sm border rounded hover:bg-base-200"
              onClick={() => {
                setShowAddWeapon((v) => !v);
                setShowAddEquipment(false);
                setShowAddMelee(false);
                setShowAddAttachment(false);
              }}
            >
              {showAddWeapon ? "Cancel" : hasWeaponMaster ? "Armory" : "+ Weapon"}
            </button>
            <button
              type="button"
              class="px-2 py-1 text-sm border rounded hover:bg-base-200"
              onClick={() => {
                setShowAddEquipment((v) => !v);
                setShowAddWeapon(false);
                setShowAddMelee(false);
                setShowAddAttachment(false);
              }}
            >
              {showAddEquipment ? "Cancel" : "+ Equipment"}
            </button>
            <button
              type="button"
              class="px-2 py-1 text-sm border rounded hover:bg-base-200"
              onClick={() => {
                setShowAddAttachment((v) => !v);
                setShowAddWeapon(false);
                setShowAddEquipment(false);
                setShowAddMelee(false);
              }}
            >
              {showAddAttachment ? "Cancel" : "+ Attachment"}
            </button>
            <button
              type="button"
              class="px-2 py-1 text-sm border rounded hover:bg-base-200"
              onClick={() => {
                setShowAddMelee((v) => !v);
                setShowAddWeapon(false);
                setShowAddEquipment(false);
                setShowAddAttachment(false);
              }}
            >
              {showAddMelee ? "Cancel" : "+ Melee Weapon"}
            </button>
          </div>

          {/* Weapon picker */}
          {showAddWeapon && (
            <div class="space-y-1 border rounded p-2 bg-base-200">
              <div class="flex flex-wrap gap-1 mb-1">
                <button
                  type="button"
                  class={`text-xs px-2 py-0.5 rounded border ${
                    nationFilter === ""
                      ? "bg-primary/20 border-primary/70 font-medium"
                      : "hover:bg-base-200"
                  }`}
                  onClick={() => setNationFilter("")}
                >
                  All
                </button>
                {NATIONS.filter((n) => n !== "Any").map((n) => (
                  <button
                    key={n}
                    type="button"
                    class={`text-xs px-2 py-0.5 rounded border ${
                      nationFilter === n
                        ? "bg-primary/20 border-primary/70 font-medium"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setNationFilter(n === nationFilter ? "" : n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <input
                type="text"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="Filter weapons by name, type, or nation…"
                value={weaponFilter}
                onInput={(e) =>
                  setWeaponFilter((e.target as HTMLInputElement).value)}
              />
              {filteredWeapons.length === 0
                ? (
                  <p class="text-sm text-base-content/50 italic">
                    No matching weapons.
                  </p>
                )
                : (
                  <ul class="max-h-64 overflow-y-auto space-y-1">
                    {filteredWeapons.map((w) => {
                      const addCost = weaponAddCost(w.id, addTarget);
                      return (
                        <li
                          key={w.id}
                          class="text-sm border-b border-gray-100 pb-1"
                        >
                          <div class="flex items-center justify-between">
                            <span>
                              {w.name}{" "}
                              <span class="text-xs text-base-content/60">
                                ({w.type} · {w.nation} · W:{w.weight}{" "}
                                · DMG:{w.damage})
                              </span>
                              {w.pointCost > 0 && (
                                <span class="text-xs text-warning ml-1">
                                  [Cost: {getWeaponPointCost(w.id, perkIds)}pt]
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              class="px-2 py-0.5 text-xs border rounded hover:bg-base-200"
                              onClick={() => addWeapon(w.id, addTarget)}
                            >
                              {hasWeaponMaster
                                ? `Withdraw (${costLabel(addCost)})`
                                : `Add (${costLabel(addCost)})`}
                            </button>
                          </div>
                          <div class="text-xs text-base-content/70 ml-2">
                            <PerkDescription
                              name=""
                              description={w.gimmicks}
                              hideByDefault
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
            </div>
          )}

          {/* Equipment picker */}
          {showAddEquipment && (
            <div class="space-y-1 border rounded p-2 bg-base-200">
              <input
                type="text"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="Filter equipment by name…"
                value={equipmentFilter}
                onInput={(e) =>
                  setEquipmentFilter((e.target as HTMLInputElement).value)}
              />
              {filteredEquipment.length === 0
                ? (
                  <p class="text-sm text-base-content/50 italic">
                    No matching equipment.
                  </p>
                )
                : (
                  <ul class="space-y-1">
                    {filteredEquipment.map((eq) => {
                      const addCost = equipmentAddCost(addTarget);
                      const cannotCarryBulky = addTarget === "carried" &&
                        eq.isBulky && carriedBulkyCount > 0;
                      return (
                        <li
                          key={eq.id}
                          class="text-sm border-b border-gray-100 pb-1"
                        >
                          <div class="flex items-center justify-between">
                            <span>
                              {eq.name}{" "}
                              <span class="text-xs text-base-content/60">
                                (W:{eq.weight}
                                {eq.isCharge ? " · Charges" : ""}
                                {eq.isBulky ? " · Bulky" : ""})
                              </span>
                            </span>
                            <button
                              type="button"
                              class="px-2 py-0.5 text-xs border rounded hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed"
                              onClick={() => addEquipment(eq.id, addTarget)}
                              disabled={cannotCarryBulky}
                              title={cannotCarryBulky
                                ? "Only one bulky kit can be carried at a time"
                                : undefined}
                            >
                              Add ({costLabel(addCost)})
                            </button>
                          </div>
                          <div class="text-xs text-base-content/70 ml-2">
                            <PerkDescription
                              name=""
                              description={eq.description}
                              hideByDefault
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
            </div>
          )}

          {/* Melee weapon creator */}
          {showAddMelee && (
            <div class="border rounded p-2 bg-base-200 space-y-1">
              <p class="text-sm text-base-content/70">
                Create a new melee weapon template. You can customize its name,
                damage, weight, and traits after adding it.
              </p>
              <button
                type="button"
                class="px-2 py-1 text-sm border rounded hover:bg-base-200"
                onClick={() => addMeleeWeapon(addTarget)}
              >
                Create Melee Weapon
              </button>
            </div>
          )}

          {/* Attachment picker */}
          {showAddAttachment && (
            <div class="space-y-1 border rounded p-2 bg-base-200">
              <div class="flex flex-wrap gap-1 mb-1">
                <button
                  type="button"
                  class={`text-xs px-2 py-0.5 rounded border ${
                    attachmentNationFilter === ""
                      ? "bg-primary/20 border-primary/70 font-medium"
                      : "hover:bg-base-200"
                  }`}
                  onClick={() => setAttachmentNationFilter("")}
                >
                  All
                </button>
                <button
                  type="button"
                  class={`text-xs px-2 py-0.5 rounded border ${
                    attachmentNationFilter === "Any"
                      ? "bg-primary/20 border-primary/70 font-medium"
                      : "hover:bg-base-200"
                  }`}
                  onClick={() =>
                    setAttachmentNationFilter(
                      attachmentNationFilter === "Any" ? "" : "Any",
                    )}
                >
                  Generic
                </button>
                {NATIONS.filter((n) => n !== "Any").map((n) => (
                  <button
                    key={n}
                    type="button"
                    class={`text-xs px-2 py-0.5 rounded border ${
                      attachmentNationFilter === n
                        ? "bg-primary/20 border-primary/70 font-medium"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() =>
                      setAttachmentNationFilter(
                        n === attachmentNationFilter ? "" : n,
                      )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <input
                type="text"
                class="w-full border rounded px-2 py-1 text-sm"
                placeholder="Filter attachments by name or weapon…"
                value={attachmentFilter}
                onInput={(e) =>
                  setAttachmentFilter((e.target as HTMLInputElement).value)}
              />
              {filteredAttachments.length === 0
                ? (
                  <p class="text-sm text-base-content/50 italic">
                    No matching attachments.
                  </p>
                )
                : (
                  <ul class="max-h-64 overflow-y-auto space-y-1">
                    {filteredAttachments.map((att) => {
                      const addCost = attachmentAddCost(addTarget);
                      return (
                        <li
                          key={att.id}
                          class="text-sm border-b border-gray-100 pb-1"
                        >
                          <div class="flex items-center justify-between">
                            <span>
                              {att.name}{" "}
                              <span class="text-xs text-base-content/60">
                                (W:{att.weight} · For: {att.appliesTo}
                                {att.isCharge ? " · Charges" : ""})
                              </span>
                            </span>
                            <button
                              type="button"
                              class="px-2 py-0.5 text-xs border rounded hover:bg-base-200"
                              onClick={() =>
                                addAttachmentToInventory(att.id, addTarget)}
                            >
                              Add ({costLabel(addCost)})
                            </button>
                          </div>
                          <div class="text-xs text-base-content/70 ml-2">
                            <PerkDescription
                              name=""
                              description={att.description}
                              hideByDefault
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
