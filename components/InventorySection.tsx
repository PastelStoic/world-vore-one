import { useCallback, useRef, useState } from "preact/hooks";
import {
  ATTACHMENTS,
  ATTACHMENTS_BY_ID,
  EQUIPMENT,
  EQUIPMENT_BY_ID,
  FREE_ACCESSORIES_BY_ID,
  MELEE_TRAITS,
  MELEE_TRAITS_BY_ID,
  type Nation,
  NATIONS,
  WEAPONS,
  WEAPONS_BY_ID,
} from "../data/equipment.ts";
import type {
  CharacterInventory,
  InventoryAttachment,
  InventoryEquipment,
  InventoryMeleeWeapon,
  InventoryWeapon,
} from "../lib/inventory_types.ts";
import {
  calculateInventoryPointCost,
  calculateInventoryWeight,
  countAllItemSlots,
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
  /**
   * Character ID for auto-saving combat state (ammo, charges, magazines).
   * When set, changes to ammo/charges/magazines are auto-saved via PATCH.
   */
  characterId?: string;
  /** The character's perk IDs – used for features like Signature Weapon */
  perkIds?: string[];
}

// ─── Lookups for weight calculation ─────────────────────────────────────────

const weightLookups = {
  getWeapon: (id: string) => WEAPONS_BY_ID.get(id),
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

const slotLookups = {
  getEquipment: (id: string) => EQUIPMENT_BY_ID.get(id),
  getAttachment: (id: string) => ATTACHMENTS_BY_ID.get(id),
};

function getWeaponPointCost(id: string, perkIds?: string[]): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;
  // Apply faction discount: restricted weapons cost 1pt if character has a matching faction perk
  if (def.pointCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (def.discountFactionPerkIds.some((pid) => perkIds.includes(pid))) {
      return 1;
    }
  }
  return def.pointCost;
}

/**
 * Get the point cost for a weapon taking signature weapon status and faction discount into account.
 * Restricted signature weapons cost 1pt instead of 3pt; other signature weapons are free.
 */
function getSignatureAdjustedPointCost(
  id: string,
  isSignature: boolean,
  perkIds?: string[],
): number {
  const def = WEAPONS_BY_ID.get(id);
  if (!def) return 0;

  // Apply faction discount first
  let baseCost = def.pointCost;
  if (baseCost >= 3 && def.discountFactionPerkIds && perkIds) {
    if (def.discountFactionPerkIds.some((pid) => perkIds.includes(pid))) {
      baseCost = 1;
    }
  }

  if (!isSignature) return baseCost;
  // "If you wish to pick a ranged weapon with the 'restricted' gimmick, you must still pay 1 point.
  //  Every other weapon is free."
  if (def.pointCost >= 3) return 1; // Originally restricted → still 1pt as signature
  return 0;
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
            const states = [...attInv.savedMagazineStates].sort((a, b) =>
              b - a
            );
            // Load the best magazine
            const best = states.shift()!;
            weapon.currentAmmo = best;
            // Separate remaining into full and partial
            const ammoOverride = attDef.ammoOverride!;
            const fullMags = states.filter((s) => s >= ammoOverride).length;
            const partials = states.filter((s) => s < ammoOverride);
            weapon.magazines = fullMags;
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

        inv[location].attachments.push({
          attachmentId,
          totalCharges: savedStates.length,
          usedCharges: 0,
          savedMagazineStates: savedStates,
        });
        weapon.magazines = 0;
        weapon.partialMagazines = [];
        // Revert ammo to weapon default (gun is empty after removing magazine)
        const wDef = WEAPONS_BY_ID.get(weapon.weaponId);
        weapon.currentAmmo = Math.min(weapon.currentAmmo, wDef?.ammo ?? 999);
      } else {
        // Return the attachment to the same location's inventory
        inv[location].attachments.push({
          attachmentId,
          totalCharges: attDef?.isCharge ? 1 : 0,
          usedCharges: 0,
        });
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

  function renderWeapon(
    w: InventoryWeapon,
    location: InventoryLocation,
    index: number,
  ) {
    const def = WEAPONS_BY_ID.get(w.weaponId);
    if (!def) {
      return <div class="text-red-500">Unknown weapon: {w.weaponId}</div>;
    }

    const otherLocation: InventoryLocation = location === "carried"
      ? "stowed"
      : "carried";

    // Check for ammo override from attached attachments
    let effectiveAmmo = def.ammo;
    let effectiveWeight = def.weight;
    let effectiveDamage: string | number = def.damage;
    let effectiveRateOfFire = def.rateOfFire;
    let attachmentMagazineSystem = false;
    let attachmentRequiresMags = false;
    for (const aId of w.attachedIds) {
      const aDef = ATTACHMENTS_BY_ID.get(aId);
      if (aDef?.ammoOverride) {
        effectiveAmmo = aDef.ammoOverride;
      }
      if (aDef?.weightOverride != null) {
        effectiveWeight = aDef.weightOverride;
      }
      if (aDef?.damageOverride != null) {
        effectiveDamage = aDef.damageOverride;
      }
      if (aDef?.rateOfFireBonus != null) {
        effectiveRateOfFire += aDef.rateOfFireBonus;
      }
      if (aDef?.requiresMagazines) {
        attachmentRequiresMags = true;
        attachmentMagazineSystem = true;
      }
      if (aDef?.ammoOverride && aDef?.isCharge) {
        attachmentMagazineSystem = true;
      }
    }

    // Find compatible attachments owned in the same location's inventory
    // For charge-based attachments, only show if they have remaining charges
    const ownedAttachments = inventory[location].attachments ?? [];
    const ownedAttachmentIds = new Set(
      ownedAttachments
        .filter((a) => {
          const aDef = ATTACHMENTS_BY_ID.get(a.attachmentId);
          if (aDef?.isCharge) {
            return (a.totalCharges - a.usedCharges) > 0;
          }
          return true;
        })
        .map((a) => a.attachmentId),
    );
    const availableAttachments = def.compatibleAttachmentIds
      .filter((aId) =>
        !w.attachedIds.includes(aId) && ownedAttachmentIds.has(aId)
      )
      .map((aId) => ATTACHMENTS_BY_ID.get(aId))
      .filter(Boolean);

    // Check if weapon uses magazines (freeAccessoryIds) or attachment-based magazine system
    const hasFreeAccessoryMags = def.freeAccessoryIds &&
      def.freeAccessoryIds.length > 0;
    const hasMagazines = hasFreeAccessoryMags || attachmentMagazineSystem;
    const magazineAccessory = hasFreeAccessoryMags
      ? FREE_ACCESSORIES_BY_ID.get(def.freeAccessoryIds![0])
      : undefined;

    // Weapon requires magazines to reload (no fallback to standard reload)
    const weaponRequiresMags = def.requiresMagazines || attachmentRequiresMags;

    // Total available mags (full + partial)
    const totalAvailableMags = w.magazines + (w.partialMagazines ?? []).length;

    // Check if weapon reloads individually (tubular magazine, cylinder without quickloader)
    const hasQuickloader = w.attachedIds.includes("quickloader");
    const reloadsIndividually = def.reloadsIndividually && !hasQuickloader;

    // Weapon is at full ammo
    const isAmmoFull = w.currentAmmo >= effectiveAmmo;

    // Can reload?
    const canReload = !isAmmoFull && (
      hasMagazines ? totalAvailableMags > 0 || !weaponRequiresMags : true
    );

    // Multi-turn reload tracking
    let effectiveReloadTurns = def.reloadTurns ?? 1;
    for (const aId of w.attachedIds) {
      const aDef = ATTACHMENTS_BY_ID.get(aId);
      if (aDef?.reloadTurnsOverride != null) {
        effectiveReloadTurns = aDef.reloadTurnsOverride;
      }
    }
    // C96 Mauser: "Wasteful reload" — 2 turns when rounds remain in magazine, 1 turn when empty
    if (def.id === "c96-mauser" && w.currentAmmo > 0) {
      effectiveReloadTurns = 2;
    }
    const reloadProgress = w.reloadProgress ?? 0;
    const isReloading = reloadProgress > 0;

    // Signature weapon benefits
    const isSignature = w.isSignatureWeapon && hasSignatureWeaponPerk;
    const damageDisplay = isSignature
      ? `${effectiveDamage}+1`
      : String(effectiveDamage);

    return (
      <div
        class={`border rounded p-2 space-y-1 ${
          isSignature ? "bg-amber-50 border-amber-300" : "bg-white"
        }`}
      >
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div>
            {isSignature && (
              <span class="text-amber-500 mr-1" title="Signature Weapon">
                ★
              </span>
            )}
            <strong>{def.name}</strong>{" "}
            <span class="text-xs text-gray-500">
              ({def.type} · {def.nation} · W:{effectiveWeight}{" "}
              · DMG:{damageDisplay} · ROF:{effectiveRateOfFire})
            </span>
            {isSignature && (
              <span class="text-xs text-amber-600 ml-1 font-medium">
                [Signature Weapon]
              </span>
            )}
            {def.pointCost > 0 && (
              <span class="text-xs text-amber-600 ml-1">
                [Cost: {isSignature
                  ? getSignatureAdjustedPointCost(w.weaponId, true, perkIds)
                  : getWeaponPointCost(w.weaponId, perkIds)}pt]
              </span>
            )}
          </div>
          {!readOnly && (
            <div class="flex gap-1">
              {hasSignatureWeaponPerk && (
                <button
                  type="button"
                  class={`px-2 py-0.5 text-xs border rounded ${
                    isSignature
                      ? "bg-amber-100 border-amber-400 text-amber-700"
                      : "hover:bg-amber-50 text-amber-600"
                  }`}
                  onClick={() => toggleSignatureWeapon(location, index)}
                  title={isSignature
                    ? "Unmark as Signature Weapon"
                    : "Mark as Signature Weapon"}
                >
                  {isSignature ? "★ Signature" : "☆ Set Signature"}
                </button>
              )}
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
          <PerkDescription name="" description={def.gimmicks} hideByDefault />
        </div>

        {/* Ammo tracker – always editable for combat tracking */}
        <div class="flex items-center gap-2 text-sm">
          <span>Ammo:</span>
          <input
            type="number"
            class="w-16 border rounded px-1 py-0.5 text-sm font-mono text-center"
            min="0"
            max={effectiveAmmo}
            value={w.currentAmmo}
            onInput={(e) => {
              const val = Number((e.target as HTMLInputElement).value);
              if (!Number.isNaN(val)) setCurrentAmmo(location, index, val);
            }}
          />
          <span class="text-xs text-gray-500">/ {effectiveAmmo}</span>
          <button
            type="button"
            class={`px-1 text-xs border rounded ${
              canReload || isReloading
                ? "hover:bg-gray-100"
                : "opacity-50 cursor-not-allowed"
            } ${isReloading ? "bg-yellow-50 border-yellow-400" : ""}`}
            onClick={() => {
              if (!canReload && !isReloading) return;

              // Multi-turn reload: track progress
              if (effectiveReloadTurns > 1) {
                updateCombat((inv) => {
                  const weapon = inv[location].weapons[index];
                  const newProgress = (weapon.reloadProgress ?? 0) + 1;

                  if (newProgress >= effectiveReloadTurns) {
                    // Reload complete!
                    weapon.reloadProgress = 0;
                    if (reloadsIndividually && !hasMagazines) {
                      weapon.currentAmmo = Math.min(
                        weapon.currentAmmo + 1,
                        effectiveAmmo,
                      );
                    } else if (hasMagazines && totalAvailableMags > 0) {
                      const oldAmmo = weapon.currentAmmo;
                      if (weapon.magazines > 0) {
                        weapon.magazines -= 1;
                        weapon.currentAmmo = effectiveAmmo;
                      }
                      if (oldAmmo > 0) {
                        if (oldAmmo >= effectiveAmmo) {
                          weapon.magazines += 1;
                        } else {
                          if (!weapon.partialMagazines) {
                            weapon.partialMagazines = [];
                          }
                          weapon.partialMagazines.push(oldAmmo);
                        }
                      }
                    } else if (!hasMagazines || !weaponRequiresMags) {
                      if (reloadsIndividually) {
                        weapon.currentAmmo = Math.min(
                          weapon.currentAmmo + 1,
                          effectiveAmmo,
                        );
                      } else {
                        weapon.currentAmmo = effectiveAmmo;
                      }
                    }
                  } else {
                    weapon.reloadProgress = newProgress;
                  }
                  return inv;
                });
                return;
              }

              // Single-turn reload (original behavior)
              if (reloadsIndividually && !hasMagazines) {
                // Individual bullet reload: add 1 round
                setCurrentAmmo(
                  location,
                  index,
                  Math.min(w.currentAmmo + 1, effectiveAmmo),
                );
              } else if (hasMagazines && totalAvailableMags > 0) {
                // Magazine-fed reload: consume a full magazine
                updateCombat((inv) => {
                  const weapon = inv[location].weapons[index];
                  const oldAmmo = weapon.currentAmmo;

                  if (weapon.magazines > 0) {
                    // Use a full magazine
                    weapon.magazines -= 1;
                    weapon.currentAmmo = effectiveAmmo;
                  } else {
                    return inv; // No full magazines; user must pick a partial via its Load button
                  }

                  // Save the old magazine if it had ammo remaining
                  if (oldAmmo > 0) {
                    if (oldAmmo >= effectiveAmmo) {
                      weapon.magazines += 1; // Full magazine goes back to full pool
                    } else {
                      if (!weapon.partialMagazines) {
                        weapon.partialMagazines = [];
                      }
                      weapon.partialMagazines.push(oldAmmo);
                    }
                  }

                  return inv;
                });
              } else if (!hasMagazines || !weaponRequiresMags) {
                if (reloadsIndividually) {
                  // Individual bullet reload: add 1 round
                  setCurrentAmmo(
                    location,
                    index,
                    Math.min(w.currentAmmo + 1, effectiveAmmo),
                  );
                } else {
                  // Full reload
                  setCurrentAmmo(location, index, effectiveAmmo);
                }
              }
            }}
            disabled={!canReload && !isReloading}
            title={isReloading
              ? `Reloading: ${reloadProgress}/${effectiveReloadTurns} turns`
              : !canReload
              ? (isAmmoFull ? "Weapon is fully loaded" : "No spare magazines")
              : hasMagazines
              ? "Reload (uses a full magazine)"
              : reloadsIndividually
              ? "Load 1 round"
              : "Reload"}
          >
            {isReloading
              ? `Reloading… ${reloadProgress}/${effectiveReloadTurns} turns`
              : effectiveReloadTurns > 1
              ? (reloadsIndividually && !hasMagazines
                ? `Reload +1 (${effectiveReloadTurns} turns)`
                : hasMagazines
                ? `Reload (${w.magazines} full mag · ${effectiveReloadTurns} turns)`
                : `Reload (${effectiveReloadTurns} turns)`)
              : (reloadsIndividually && !hasMagazines
                ? "Reload +1"
                : hasMagazines
                ? `Reload (${w.magazines} full mag)`
                : "Reload")}
          </button>
          {isReloading && (
            <button
              type="button"
              class="px-1 text-xs border rounded text-red-500 hover:bg-red-50"
              title="Cancel reload"
              onClick={() => {
                updateCombat((inv) => {
                  inv[location].weapons[index].reloadProgress = 0;
                  return inv;
                });
              }}
            >
              Cancel
            </button>
          )}
          {/* Standard reload option: for magazine-fed weapons that can also reload without a magazine */}
          {hasMagazines && !weaponRequiresMags && !isAmmoFull && !isReloading && (
            <button
              type="button"
              class="px-1 text-xs border rounded hover:bg-gray-100"
              title="Reload without consuming a magazine (standard reload)"
              onClick={() => {
                if (reloadsIndividually) {
                  setCurrentAmmo(
                    location,
                    index,
                    Math.min(w.currentAmmo + 1, effectiveAmmo),
                  );
                } else {
                  setCurrentAmmo(location, index, effectiveAmmo);
                }
              }}
            >
              Reload (standard)
            </button>
          )}
        </div>

        {/* Magazine tracking – always editable for combat tracking */}
        {hasMagazines && (
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-sm">
              <span>
                Full magazines{magazineAccessory
                  ? ` (${magazineAccessory.name})`
                  : ""}:
              </span>
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
                (1W each)
              </span>
            </div>
            {/* Partial magazines list with Load and Discard buttons */}
            {(w.partialMagazines ?? []).length > 0 && (
              <div class="ml-2 text-xs text-gray-600 space-y-0.5">
                <span class="font-medium">Partial magazines:</span>
                {(w.partialMagazines ?? []).map((ammo, pi) => (
                  <div key={pi} class="flex items-center gap-1">
                    <span class="inline-block bg-yellow-50 border border-yellow-300 rounded px-1">
                      {ammo}/{effectiveAmmo} rounds
                    </span>
                    <button
                      type="button"
                      class="px-1 border rounded text-blue-600 hover:bg-blue-50"
                      title="Load this magazine into the weapon"
                      onClick={() => {
                        updateCombat((inv) => {
                          const weapon = inv[location].weapons[index];
                          const oldAmmo = weapon.currentAmmo;
                          const partials = weapon.partialMagazines ?? [];

                          // Remove this partial magazine
                          partials.splice(pi, 1);
                          weapon.currentAmmo = ammo;
                          weapon.partialMagazines = partials;

                          // Save the old magazine
                          if (oldAmmo > 0) {
                            if (oldAmmo >= effectiveAmmo) {
                              weapon.magazines += 1;
                            } else {
                              weapon.partialMagazines.push(oldAmmo);
                            }
                          }

                          return inv;
                        });
                      }}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      class="px-1 border rounded text-red-500 hover:bg-red-50"
                      title="Discard this partial magazine"
                      onClick={() => {
                        updateCombat((inv) => {
                          const weapon = inv[location].weapons[index];
                          const partials = weapon.partialMagazines ?? [];
                          partials.splice(pi, 1);
                          weapon.partialMagazines = partials;
                          return inv;
                        });
                      }}
                    >
                      Discard
                    </button>
                  </div>
                ))}
                <span class="text-gray-400">
                  ({(w.partialMagazines ?? []).length}W total)
                </span>
              </div>
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
                      <span class="text-gray-400">(W:{aDef.weight})</span>
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
                    <span class="text-xs text-gray-500 ml-1">
                      <PerkDescription
                        name=""
                        description={aDef.description}
                        hideByDefault
                      />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Attach new attachment – only shows compatible attachments owned in inventory */}
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
              <option value="">+ Attach from inventory…</option>
              {availableAttachments.map((a) => (
                <option key={a!.id} value={a!.id}>
                  {a!.name} (W:{a!.weight})
                </option>
              ))}
            </select>
          </div>
        )}
        {!readOnly && availableAttachments.length === 0 &&
          def.compatibleAttachmentIds.filter((aId) =>
              !w.attachedIds.includes(aId)
            ).length > 0 &&
          (
            <div class="ml-2 text-xs text-gray-400 italic">
              Compatible attachments exist but none are in your inventory. Add
              them via the Attachments section below.
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
      return (
        <div class="text-red-500">Unknown equipment: {eq.equipmentId}</div>
      );
    }

    const otherLocation: InventoryLocation = location === "carried"
      ? "stowed"
      : "carried";

    const remaining = def.isCharge
      ? Math.max(0, eq.totalCharges - eq.usedCharges)
      : 0;
    const currentWeight = def.isCharge ? def.weight * remaining : def.weight;
    const canMoveToOther = !(
      otherLocation === "carried" &&
      def.isBulky &&
      carriedBulkyCount > 0
    );

    return (
      <div class="border rounded p-2 space-y-1 bg-white">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div>
            <strong>{def.name}</strong>{" "}
            <span class="text-xs text-gray-500">
              (W:{currentWeight}
              {def.isBulky ? " · Bulky" : ""})
            </span>
          </div>
          {!readOnly && (
            <div class="flex gap-1">
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => moveEquipment(location, index, otherLocation)}
                disabled={!canMoveToOther}
                title={!canMoveToOther
                  ? "Only one bulky kit can be carried at a time"
                  : undefined}
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
          <PerkDescription
            name=""
            description={def.description}
            hideByDefault
          />
        </div>

        {/* Charge tracking with checkboxes – always interactive for combat tracking */}
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
                    min="1"
                    value={eq.totalCharges}
                    onInput={(e) => {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!Number.isNaN(val)) {
                        setTotalCharges(location, index, val);
                      }
                    }}
                  />
                  )
                </span>
              )}
            </div>
            <div class="flex flex-wrap gap-1 ml-2">
              {Array.from({ length: eq.totalCharges }, (_, ci) => {
                const isUsed = ci >= eq.totalCharges - eq.usedCharges;
                return (
                  <button
                    key={ci}
                    type="button"
                    class={`w-6 h-6 border rounded text-xs flex items-center justify-center ${
                      isUsed
                        ? "bg-red-100 border-red-400 text-red-600"
                        : "bg-green-50 border-green-400 text-green-700"
                    } cursor-pointer hover:opacity-75`}
                    title={isUsed
                      ? "Used (click to restore)"
                      : "Available (click to use)"}
                    onClick={() => toggleCharge(location, index, ci)}
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

    // Signature weapon benefits
    const isSignature = mw.isSignatureWeapon && hasSignatureWeaponPerk;
    const damageDisplay = isSignature ? `${mw.damage}+1` : String(mw.damage);

    return (
      <div
        class={`border rounded p-2 space-y-1 ${
          isSignature ? "bg-amber-50 border-amber-300" : "bg-white"
        }`}
      >
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div>
            {isSignature && (
              <span class="text-amber-500 mr-1" title="Signature Weapon">
                ★
              </span>
            )}
            {readOnly ? <strong>{mw.name}</strong> : (
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
              (DMG:{damageDisplay} · W:{mw.weight})
            </span>
            {isSignature && (
              <span class="text-xs text-amber-600 ml-1 font-medium">
                [Signature Weapon · +1 extra trait]
              </span>
            )}
          </div>
          {!readOnly && (
            <div class="flex gap-1">
              {hasSignatureWeaponPerk && (
                <button
                  type="button"
                  class={`px-2 py-0.5 text-xs border rounded ${
                    isSignature
                      ? "bg-amber-100 border-amber-400 text-amber-700"
                      : "hover:bg-amber-50 text-amber-600"
                  }`}
                  onClick={() => toggleSignatureMelee(location, index)}
                  title={isSignature
                    ? "Unmark as Signature Weapon"
                    : "Mark as Signature Weapon"}
                >
                  {isSignature ? "★ Signature" : "☆ Set Signature"}
                </button>
              )}
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
        {readOnly
          ? (
            mw.description && (
              <div class="text-xs text-gray-600 whitespace-pre-line ml-2">
                {mw.description}
              </div>
            )
          )
          : (
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
          {readOnly
            ? (
              mw.traitIds.length > 0
                ? (
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
                )
                : <span class="text-xs text-gray-400 ml-1">None</span>
            )
            : (
              <div class="ml-2 flex flex-wrap gap-1">
                {MELEE_TRAITS.map((trait) => {
                  const active = mw.traitIds.includes(trait.id);
                  return (
                    <button
                      key={trait.id}
                      type="button"
                      class={`text-xs px-1.5 py-0.5 rounded border ${
                        active
                          ? "bg-blue-100 border-blue-400"
                          : "hover:bg-gray-50"
                      }`}
                      title={trait.description}
                      onClick={() =>
                        toggleMeleeTrait(location, index, trait.id)}
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

  function renderAttachment(
    att: InventoryAttachment,
    location: InventoryLocation,
    index: number,
  ) {
    const def = ATTACHMENTS_BY_ID.get(att.attachmentId);
    if (!def) {
      return (
        <div class="text-red-500">Unknown attachment: {att.attachmentId}</div>
      );
    }

    const otherLocation: InventoryLocation = location === "carried"
      ? "stowed"
      : "carried";
    const remaining = def.isCharge
      ? Math.max(0, att.totalCharges - att.usedCharges)
      : 0;
    const currentWeight = def.isCharge ? def.weight * remaining : def.weight;

    return (
      <div class="border rounded p-2 space-y-1 bg-white">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div>
            <strong>{def.name}</strong>{" "}
            <span class="text-xs text-gray-500">
              (W:{currentWeight} · For: {def.appliesTo})
            </span>
          </div>
          {!readOnly && (
            <div class="flex gap-1">
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
                onClick={() => moveAttachment(location, index, otherLocation)}
              >
                → {otherLocation === "carried" ? "Carry" : "Stow"}
              </button>
              <button
                type="button"
                class="px-2 py-0.5 text-xs border rounded text-red-600 hover:bg-red-50"
                onClick={() => removeAttachment(location, index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div class="text-xs text-gray-600 whitespace-pre-line ml-2">
          <PerkDescription
            name=""
            description={def.description}
            hideByDefault
          />
        </div>

        {/* Charge tracking for charge-based attachments */}
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
                    min="1"
                    value={att.totalCharges}
                    onInput={(e) => {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!Number.isNaN(val)) {
                        setAttachmentTotalCharges(location, index, val);
                      }
                    }}
                  />
                  )
                </span>
              )}
            </div>
            <div class="flex flex-wrap gap-1 ml-2">
              {Array.from({ length: att.totalCharges }, (_, ci) => {
                const isUsed = ci >= att.totalCharges - att.usedCharges;
                return (
                  <button
                    key={ci}
                    type="button"
                    class={`w-6 h-6 border rounded text-xs flex items-center justify-center ${
                      isUsed
                        ? "bg-red-100 border-red-400 text-red-600"
                        : "bg-green-50 border-green-400 text-green-700"
                    } cursor-pointer hover:opacity-75`}
                    title={isUsed
                      ? "Used (click to restore)"
                      : "Available (click to use)"}
                    onClick={() => toggleAttachmentCharge(location, index, ci)}
                  >
                    {isUsed ? "✕" : "●"}
                  </button>
                );
              })}
            </div>
            <div class="text-xs text-gray-500 ml-2">
              {remaining} remaining · {att.usedCharges} used · W:{currentWeight}
            </div>
          </div>
        )}
      </div>
    );
  }

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
            <span class="text-xs text-gray-500 ml-2">
              (Weight: {totalWeight})
            </span>
          )}
        </h4>

        {isEmpty && <p class="text-sm text-gray-400 italic">No items.</p>}

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

        {/* Attachments (loose, not attached to any weapon) */}
        {(inv.attachments ?? []).length > 0 && (
          <div class="space-y-1">
            <h5 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Attachments (Unattached)
            </h5>
            {(inv.attachments ?? []).map((att, i) => (
              <div key={`${location}-att-${i}`}>
                {renderAttachment(att, location, i)}
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
              pointsAfterInventory < 0 ? "text-red-600" : "text-gray-500"
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
                setShowAddAttachment(false);
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
                setShowAddAttachment(false);
              }}
            >
              {showAddEquipment ? "Cancel" : "+ Equipment"}
            </button>
            <button
              type="button"
              class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
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
              class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
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
            <div class="space-y-1 border rounded p-2 bg-gray-50">
              <div class="flex flex-wrap gap-1 mb-1">
                <button
                  type="button"
                  class={`text-xs px-2 py-0.5 rounded border ${
                    nationFilter === ""
                      ? "bg-blue-100 border-blue-400 font-medium"
                      : "hover:bg-gray-100"
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
                        ? "bg-blue-100 border-blue-400 font-medium"
                        : "hover:bg-gray-100"
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
                  <p class="text-sm text-gray-400 italic">
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
                              <span class="text-xs text-gray-500">
                                ({w.type} · {w.nation} · W:{w.weight}{" "}
                                · DMG:{w.damage})
                              </span>
                              {w.pointCost > 0 && (
                                <span class="text-xs text-amber-600 ml-1">
                                  [Cost: {getWeaponPointCost(w.id, perkIds)}pt]
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
                          </div>
                          <div class="text-xs text-gray-600 ml-2">
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
            <div class="space-y-1 border rounded p-2 bg-gray-50">
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
                  <p class="text-sm text-gray-400 italic">
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
                              <span class="text-xs text-gray-500">
                                (W:{eq.weight}
                                {eq.isCharge ? " · Charges" : ""}
                                {eq.isBulky ? " · Bulky" : ""})
                              </span>
                            </span>
                            <button
                              type="button"
                              class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                              onClick={() => addEquipment(eq.id, addTarget)}
                              disabled={cannotCarryBulky}
                              title={cannotCarryBulky
                                ? "Only one bulky kit can be carried at a time"
                                : undefined}
                            >
                              Add ({costLabel(addCost)})
                            </button>
                          </div>
                          <div class="text-xs text-gray-600 ml-2">
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

          {/* Attachment picker */}
          {showAddAttachment && (
            <div class="space-y-1 border rounded p-2 bg-gray-50">
              <div class="flex flex-wrap gap-1 mb-1">
                <button
                  type="button"
                  class={`text-xs px-2 py-0.5 rounded border ${
                    attachmentNationFilter === ""
                      ? "bg-blue-100 border-blue-400 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setAttachmentNationFilter("")}
                >
                  All
                </button>
                <button
                  type="button"
                  class={`text-xs px-2 py-0.5 rounded border ${
                    attachmentNationFilter === "Any"
                      ? "bg-blue-100 border-blue-400 font-medium"
                      : "hover:bg-gray-100"
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
                        ? "bg-blue-100 border-blue-400 font-medium"
                        : "hover:bg-gray-100"
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
                  <p class="text-sm text-gray-400 italic">
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
                              <span class="text-xs text-gray-500">
                                (W:{att.weight} · For: {att.appliesTo}
                                {att.isCharge ? " · Charges" : ""})
                              </span>
                            </span>
                            <button
                              type="button"
                              class="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
                              onClick={() =>
                                addAttachmentToInventory(att.id, addTarget)}
                            >
                              Add ({costLabel(addCost)})
                            </button>
                          </div>
                          <div class="text-xs text-gray-600 ml-2">
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
