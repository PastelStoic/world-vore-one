// ---------------------------------------------------------------------------
// Equipment catalog – barrel file re-exporting all equipment modules
// ---------------------------------------------------------------------------

export type {
  AttachmentDefinition,
  EquipmentDefinition,
  FreeAccessoryDefinition,
  MeleeTraitDefinition,
  MeleeWeaponTemplate,
  VehicleArmorRating,
  VehicleDefinition,
  VehicleModuleDefinition,
  VehicleModuleDifficulty,
  VehicleModulePosition,
  WeaponDefinition,
  WeaponKind,
  WeaponTraitDefinition,
} from "./equipment_types.ts";
export { type Nation, NATIONS } from "./equipment_types.ts";

export { MELEE_TRAITS, MELEE_TRAITS_BY_ID } from "./melee_traits.ts";
export { WEAPON_TRAITS, WEAPON_TRAITS_BY_ID } from "./weapon_traits.ts";
export { MELEE_WEAPONS, MELEE_WEAPONS_BY_ID } from "./melee_weapons.ts";
export { EQUIPMENT, EQUIPMENT_BY_ID } from "./general_equipment.ts";
export {
  FREE_ACCESSORIES,
  FREE_ACCESSORIES_BY_ID,
} from "./free_accessories.ts";
export { VEHICLES, VEHICLES_BY_ID } from "./vehicles.ts";
export { VEHICLE_MODULES, VEHICLE_MODULES_BY_ID } from "./vehicle_modules.ts";

import { ATTACHMENTS as BASE_ATTACHMENTS } from "./attachments.ts";
import { MAGAZINE_ATTACHMENTS } from "./free_accessories.ts";
import { MELEE_WEAPONS } from "./melee_weapons.ts";
import { WEAPONS as RANGED_WEAPONS } from "./weapons.ts";

/** Ranged + melee in one catalog. */
export const WEAPONS = [...RANGED_WEAPONS, ...MELEE_WEAPONS];
export const WEAPONS_BY_ID = new Map(WEAPONS.map((w) => [w.id, w]));

/** Regular attachments plus scene magazines (Lewis drums, MG belts, fuel). */
export const ATTACHMENTS = [...BASE_ATTACHMENTS, ...MAGAZINE_ATTACHMENTS];
export const ATTACHMENTS_BY_ID = new Map(ATTACHMENTS.map((a) => [a.id, a]));
