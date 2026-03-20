import type {
  CharacterInventory,
  InventoryWeapon,
} from "@/lib/inventory_types.ts";
import {
  ATTACHMENTS_BY_ID,
  FREE_ACCESSORIES_BY_ID,
  WEAPON_TRAITS_BY_ID,
  WEAPONS_BY_ID,
} from "@/data/equipment.ts";
import PerkDescription from "@/components/PerkDescription.tsx";
import TraitBadge from "@/components/inventory/TraitBadge.tsx";
import {
  canAttachToWeapon,
  getDependentAttachmentIds,
  getSignatureAdjustedPointCost,
  getWeaponPointCost,
  type InventoryLocation,
  isSignatureUniqueAttachment,
} from "./helpers.ts";

interface WeaponCardProps {
  weapon: InventoryWeapon;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  /** When true, ammo/magazines/reload inputs are disabled (non-owner viewer) */
  combatReadOnly?: boolean;
  hasSignatureWeaponPerk: boolean;
  perkIds?: string[];
  weaponMasterRestrictedUnlocks?: string[];
  inventory: CharacterInventory;
  onToggleSignature: (location: InventoryLocation, index: number) => void;
  onMove: (
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
  /** Called when a weapon is permanently lost (weapon-master "Lost" button) */
  onLoss?: (location: InventoryLocation, index: number) => void;
  /** Called when a weapon is returned to armory (weapon-master "Return to armory" button) */
  onReturn?: (location: InventoryLocation, index: number) => void;
  onSetAmmo: (
    location: InventoryLocation,
    index: number,
    ammo: number,
  ) => void;
  onSetMagazines: (
    location: InventoryLocation,
    index: number,
    count: number,
  ) => void;
  onAttach: (
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
  ) => void;
  onDetach: (
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
  ) => void;
  /** Eject a charge-based magazine attachment and do a standard reload */
  onEjectDrumAndReload?: (
    location: InventoryLocation,
    weaponIndex: number,
    drumAttachmentId: string,
  ) => void;
  onToggleAttachedCharge: (
    location: InventoryLocation,
    weaponIndex: number,
    attachmentId: string,
    chargeIndex: number,
  ) => void;
  onUpdateCombat: (
    fn: (inv: CharacterInventory) => CharacterInventory,
  ) => void;
}

export default function WeaponCard(props: WeaponCardProps) {
  const {
    weapon: w,
    location,
    index,
    readOnly,
    combatReadOnly,
    hasSignatureWeaponPerk,
    perkIds,
    weaponMasterRestrictedUnlocks,
    inventory,
  } = props;

  const def = WEAPONS_BY_ID.get(w.weaponId);
  if (!def) {
    return <div class="text-error">Unknown weapon: {w.weaponId}</div>;
  }

  const otherLocation: InventoryLocation = location === "carried"
    ? "stowed"
    : "carried";
  const isSignature = w.isSignatureWeapon && hasSignatureWeaponPerk;

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

  // Detect charge-based magazine attachment currently in the chamber (e.g. Thompson drum)
  const drumAttachmentId = w.attachedIds.find((aId) => {
    const aDef = ATTACHMENTS_BY_ID.get(aId);
    return aDef?.isCharge && Boolean(aDef?.ammoOverride);
  });

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
      !w.attachedIds.includes(aId) &&
      ownedAttachmentIds.has(aId) &&
      canAttachToWeapon(aId, w.attachedIds)
    )
    .map((aId) => ATTACHMENTS_BY_ID.get(aId))
    .filter(Boolean);
  const blockedByPrerequisiteCount =
    def.compatibleAttachmentIds.filter((aId) =>
      !w.attachedIds.includes(aId) &&
      ownedAttachmentIds.has(aId) &&
      !canAttachToWeapon(aId, w.attachedIds)
    ).length;

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
  const damageDisplay = isSignature
    ? `${effectiveDamage}+1`
    : String(effectiveDamage);

  return (
    <div
      class={`border rounded p-2 space-y-1 ${
        isSignature ? "bg-warning/10 border-warning/50" : "bg-base-100"
      }`}
    >
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          {isSignature && (
            <span class="text-warning mr-1" title="Signature Weapon">
              ★
            </span>
          )}
          <strong>{def.name}</strong>{" "}
          <span class="text-xs text-base-content/60">
            ({def.type} · {def.nation} · W:{effectiveWeight}{" "}
            · DMG:{damageDisplay} · ROF:{effectiveRateOfFire})
          </span>
          {isSignature && (
            <span class="text-xs text-warning ml-1 font-medium">
              [Signature Weapon]
            </span>
          )}
          {def.pointCost > 0 && (
            <span class="text-xs text-warning ml-1">
              [Cost: {isSignature
                ? getSignatureAdjustedPointCost(w.weaponId, true, perkIds)
                : getWeaponPointCost(
                  w.weaponId,
                  perkIds,
                  weaponMasterRestrictedUnlocks,
                )}pt]
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
                    ? "bg-warning/20 border-warning/60 text-warning"
                    : "hover:bg-warning/10 text-warning"
                }`}
                onClick={() => props.onToggleSignature(location, index)}
                title={isSignature
                  ? "Unmark as Signature Weapon"
                  : "Mark as Signature Weapon"}
              >
                {isSignature ? "★ Signature" : "☆ Set Signature"}
              </button>
            )}
            <button
              type="button"
              class="px-2 py-0.5 text-xs border rounded hover:bg-base-200"
              onClick={() => props.onMove(location, index, otherLocation)}
            >
              → {otherLocation === "carried" ? "Carry" : "Stow"}
            </button>
            {props.perkIds?.includes("weapon-master")
              ? (
                <>
                  <button
                    type="button"
                    class="px-2 py-0.5 text-xs border rounded text-primary hover:bg-primary/10"
                    onClick={() =>
                      props.onReturn
                        ? props.onReturn(location, index)
                        : props.onRemove(location, index)}
                  >
                    Return to armory
                  </button>
                  <button
                    type="button"
                    class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
                    title="Permanently lose this weapon — the point cost is not refunded"
                    onClick={() =>
                      props.onLoss
                        ? props.onLoss(location, index)
                        : props.onRemove(location, index)}
                  >
                    Lost
                  </button>
                </>
              )
              : (
                <button
                  type="button"
                  class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
                  onClick={() => props.onRemove(location, index)}
                >
                  Remove
                </button>
              )}
          </div>
        )}
      </div>

      {/* Traits + traits added/removed by equipped attachments */}
      {(() => {
        const removedTraitIds = new Set<string>();
        const addedTraitIds: string[] = [];
        for (const aId of w.attachedIds) {
          const aDef = ATTACHMENTS_BY_ID.get(aId);
          if (aDef?.removesTraitIds) {
            for (const tid of aDef.removesTraitIds) {
              removedTraitIds.add(tid);
            }
          }
          if (aDef?.addsTraitIds) {
            for (const tid of aDef.addsTraitIds) {
              addedTraitIds.push(tid);
            }
          }
        }
        const allTraitIds = [
          ...def.traitIds.filter((tid) => !removedTraitIds.has(tid)),
          ...addedTraitIds,
        ];
        if (allTraitIds.length === 0) return null;
        return (
          <div class="flex flex-wrap gap-1">
            {allTraitIds.map((tid) => {
              const trait = WEAPON_TRAITS_BY_ID.get(tid);
              return (
                <TraitBadge
                  key={tid}
                  name={trait?.name ?? tid}
                  description={trait?.description ?? ""}
                />
              );
            })}
          </div>
        );
      })()}

      {/* Ammo tracker – editable for owner/admin combat tracking */}
      <div class="flex items-center gap-2 text-sm">
        <span>Ammo:</span>
        <input
          type="number"
          class="w-16 border rounded px-1 py-0.5 text-sm font-mono text-center disabled:opacity-50"
          min="0"
          max={effectiveAmmo}
          value={w.currentAmmo}
          disabled={combatReadOnly}
          onInput={(e) => {
            if (combatReadOnly) return;
            const val = Number((e.target as HTMLInputElement).value);
            if (!Number.isNaN(val)) props.onSetAmmo(location, index, val);
          }}
        />
        <span class="text-xs text-base-content/60">/ {effectiveAmmo}</span>
        <button
          type="button"
          class={`px-1 text-xs border rounded ${
            canReload || isReloading
              ? "hover:bg-base-200"
              : "opacity-50 cursor-not-allowed"
          } ${isReloading ? "bg-warning/10 border-warning/60" : ""}`}
          onClick={() => {
            if (combatReadOnly || (!canReload && !isReloading)) return;

            // Multi-turn reload: track progress
            if (effectiveReloadTurns > 1) {
              props.onUpdateCombat((inv) => {
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
              props.onSetAmmo(
                location,
                index,
                Math.min(w.currentAmmo + 1, effectiveAmmo),
              );
            } else if (hasMagazines && totalAvailableMags > 0) {
              // Magazine-fed reload: consume a full magazine
              props.onUpdateCombat((inv) => {
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
                props.onSetAmmo(
                  location,
                  index,
                  Math.min(w.currentAmmo + 1, effectiveAmmo),
                );
              } else {
                // Full reload
                props.onSetAmmo(location, index, effectiveAmmo);
              }
            }
          }}
          disabled={combatReadOnly || (!canReload && !isReloading)}
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
            class="px-1 text-xs border rounded text-error hover:bg-error/10"
            title="Cancel reload"
            disabled={combatReadOnly}
            onClick={() => {
              if (combatReadOnly) return;
              props.onUpdateCombat((inv) => {
                inv[location].weapons[index].reloadProgress = 0;
                return inv;
              });
            }}
          >
            Cancel
          </button>
        )}
        {/* Eject drum + standard reload: when a charge-based magazine is attached */}
        {drumAttachmentId && props.onEjectDrumAndReload && !isReloading &&
          !combatReadOnly && (
          <button
            type="button"
            class="px-1 text-xs border rounded hover:bg-base-200"
            title="Eject drum magazine and reload with standard magazines"
            onClick={() =>
              props.onEjectDrumAndReload!(location, index, drumAttachmentId)}
          >
            Eject + reload ({def.ammo})
          </button>
        )}
        {/* Standard reload option: for magazine-fed weapons without a drum */}
        {!drumAttachmentId && hasMagazines && !weaponRequiresMags &&
          !isAmmoFull && !isReloading && !combatReadOnly && (
          <button
            type="button"
            class="px-1 text-xs border rounded hover:bg-base-200"
            title="Reload without consuming a magazine (standard reload)"
            onClick={() => {
              if (reloadsIndividually) {
                props.onSetAmmo(
                  location,
                  index,
                  Math.min(w.currentAmmo + 1, effectiveAmmo),
                );
              } else {
                props.onSetAmmo(location, index, effectiveAmmo);
              }
            }}
          >
            Reload (standard)
          </button>
        )}
      </div>

      {/* Magazine tracking – editable for owner/admin combat tracking */}
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
              class="w-16 border rounded px-1 py-0.5 text-sm font-mono text-center disabled:opacity-50"
              min="0"
              value={w.magazines}
              disabled={combatReadOnly}
              onInput={(e) => {
                if (combatReadOnly) return;
                const val = Number((e.target as HTMLInputElement).value);
                if (!Number.isNaN(val)) {
                  props.onSetMagazines(location, index, val);
                }
              }}
            />
            <span class="text-xs text-base-content/60">
              (1W each)
            </span>
          </div>
          {/* Partial magazines list with Load and Discard buttons */}
          {(w.partialMagazines ?? []).length > 0 && (
            <div class="ml-2 text-xs text-base-content/70 space-y-0.5">
              <span class="font-medium">Partial magazines:</span>
              {(w.partialMagazines ?? []).map((ammo, pi) => (
                <div key={pi} class="flex items-center gap-1">
                  <span class="inline-block bg-warning/10 border border-warning/50 rounded px-1">
                    {ammo}/{effectiveAmmo} rounds
                  </span>
                  <button
                    type="button"
                    class="px-1 border rounded text-primary hover:bg-primary/10"
                    title="Load this magazine into the weapon"
                    onClick={() => {
                      props.onUpdateCombat((inv) => {
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
                    class="px-1 border rounded text-error hover:bg-error/10"
                    title="Discard this partial magazine"
                    onClick={() => {
                      props.onUpdateCombat((inv) => {
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
              <span class="text-base-content/50">
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
            const dependentAttachmentIds = getDependentAttachmentIds(
              aId,
              w.attachedIds,
            );
            const dependentAttachmentNames = dependentAttachmentIds.map((id) =>
              ATTACHMENTS_BY_ID.get(id)?.name ?? id
            );
            const canDetach = dependentAttachmentIds.length === 0;
            // Charge data for non-magazine isCharge attachments on this weapon
            const attachedChargeData = aDef?.isCharge && !aDef.ammoOverride
              ? w.attachmentChargeData?.[aId]
              : undefined;
            const attachedRemaining = attachedChargeData
              ? Math.max(
                0,
                attachedChargeData.totalCharges -
                  attachedChargeData.usedCharges,
              )
              : 0;
            return (
              <div key={aId} class="flex flex-col gap-0.5 text-xs">
                <div class="flex items-center gap-1">
                  <span>
                    {aDef?.name ?? aId}
                    {aDef && aDef.weight > 0 && (
                      <span class="text-base-content/50">
                        (W:{aDef.weight})
                      </span>
                    )}
                    {isSignature && isSignatureUniqueAttachment(def, aId) && (
                      <span class="ml-1 text-xs font-semibold text-primary">
                        [Signature Weapon]
                      </span>
                    )}
                  </span>
                  {!readOnly && (
                    <button
                      type="button"
                      class="px-1 border rounded text-error hover:bg-error/10"
                      disabled={!canDetach}
                      title={canDetach
                        ? ""
                        : `Cannot detach while required by: ${
                          dependentAttachmentNames.join(", ")
                        }`}
                      onClick={() => props.onDetach(location, index, aId)}
                    >
                      Detach
                    </button>
                  )}
                  {aDef && (
                    <span class="text-xs text-base-content/60 ml-1">
                      <PerkDescription
                        name=""
                        description={aDef.description}
                        hideByDefault
                      />
                    </span>
                  )}
                </div>
                {/* Charge tracking for non-magazine isCharge attachments on this weapon */}
                {attachedChargeData && (
                  <div class="ml-2 space-y-0.5">
                    <div class="flex flex-wrap gap-1">
                      {Array.from(
                        { length: attachedChargeData.totalCharges },
                        (_, ci) => {
                          const usedStartIndex =
                            attachedChargeData.totalCharges -
                            attachedChargeData.usedCharges;
                          const isUsed = ci >= usedStartIndex;
                          return (
                            <button
                              key={ci}
                              type="button"
                              class={`w-5 h-5 border rounded text-xs flex items-center justify-center ${
                                isUsed
                                  ? "bg-error/20 border-error/70 text-error"
                                  : "bg-success/10 border-success/70 text-success"
                              } ${
                                readOnly
                                  ? "cursor-default"
                                  : "cursor-pointer hover:opacity-75"
                              }`}
                              title={isUsed
                                ? "Used (click to restore)"
                                : "Available (click to use)"}
                              disabled={readOnly}
                              onClick={() =>
                                !readOnly &&
                                props.onToggleAttachedCharge(
                                  location,
                                  index,
                                  aId,
                                  ci,
                                )}
                            >
                              {isUsed ? "✕" : "●"}
                            </button>
                          );
                        },
                      )}
                    </div>
                    <div class="text-xs text-base-content/60">
                      {attachedRemaining} remaining ·{" "}
                      {attachedChargeData.usedCharges} used
                    </div>
                  </div>
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
            class="select text-xs border rounded px-1 py-0.5"
            value=""
            onChange={(e) => {
              const val = (e.target as HTMLSelectElement).value;
              if (val) props.onAttach(location, index, val);
            }}
          >
            <option value="">
              + Attach from inventory…
            </option>
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
          <div class="ml-2 text-xs text-base-content/50 italic">
            Compatible attachments exist but none are in your inventory. Add
            them via the Attachments section below.
          </div>
        )}
      {!readOnly && blockedByPrerequisiteCount > 0 && (
        <div class="ml-2 text-xs text-base-content/50 italic">
          Some attachments are currently blocked until their required attachment
          is already attached.
        </div>
      )}
    </div>
  );
}
