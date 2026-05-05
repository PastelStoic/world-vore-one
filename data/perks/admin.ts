import type { PerkDefinition } from "@/data/perks.ts";

export const ADMIN_PERKS: PerkDefinition[] = [
  {
    id: "admin-placeholder",
    name: "Admin placeholder",
    category: "gimmick",
    adminOnly: true,
    description: `A placeholder perk created for admin-only testing.

*This perk has no mechanical effect.
*It is only visible to admin users when adding perks.
*Use it as a sample hidden perk for the new admin-only feature.`,
  },
];
