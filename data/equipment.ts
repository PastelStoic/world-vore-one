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
  VehicleModuleMount,
  VehicleModulePosition,
  VehicleModuleTypeDefinition,
  VehicleWeaponStats,
  WeaponDefinition,
  WeaponKind,
  WeaponTraitDefinition,
} from "./equipment_types.ts";
export { type Nation, NATIONS } from "./equipment_types.ts";

export { MELEE_TRAITS, MELEE_TRAITS_BY_ID } from "./melee_traits.ts";
export { WEAPON_TRAITS, WEAPON_TRAITS_BY_ID } from "./weapon_traits.ts";
export { MELEE_WEAPONS, MELEE_WEAPONS_BY_ID } from "./melee_weapons.ts";
export { EQUIPMENT, EQUIPMENT_BY_ID } from "./general_equipment.ts";
export { ATTACHMENTS, ATTACHMENTS_BY_ID } from "./attachments.ts";
export { WEAPONS, WEAPONS_BY_ID } from "./weapons.ts";
export {
  FREE_ACCESSORIES,
  FREE_ACCESSORIES_BY_ID,
} from "./free_accessories.ts";
export {
  VEHICLE_MODULE_TYPES,
  VEHICLE_MODULE_TYPES_BY_ID,
} from "./vehicle_module_types.ts";
export { VEHICLES, VEHICLES_BY_ID } from "./vehicles.ts";
