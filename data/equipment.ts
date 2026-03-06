// ---------------------------------------------------------------------------
// Equipment catalog – barrel file re-exporting all equipment modules
// ---------------------------------------------------------------------------

export type {
  AttachmentDefinition,
  EquipmentDefinition,
  FreeAccessoryDefinition,
  MeleeTraitDefinition,
  MeleeWeaponTemplate,
  WeaponDefinition,
  WeaponKind,
} from "./equipment_types.ts";
export { type Nation, NATIONS } from "./equipment_types.ts";

export { MELEE_TRAITS, MELEE_TRAITS_BY_ID } from "./melee_traits.ts";
export { MELEE_WEAPONS, MELEE_WEAPONS_BY_ID } from "./melee_weapons.ts";
export { EQUIPMENT, EQUIPMENT_BY_ID } from "./general_equipment.ts";
export { ATTACHMENTS, ATTACHMENTS_BY_ID } from "./attachments.ts";
export { WEAPONS, WEAPONS_BY_ID } from "./weapons.ts";
export { FREE_ACCESSORIES, FREE_ACCESSORIES_BY_ID } from "./free_accessories.ts";
