import type { Faction, FactionDefinition } from "@/lib/character_types.ts";
import { FACTIONS } from "@/lib/character_types.ts";

/**
 * Per-faction bonus definitions.
 *
 * Only list factions that have special bonuses here.  Every faction not listed
 * will have no automatic perk grants or extra stat points.
 *
 * ── How to add bonuses for a faction ────────────────────────────────────────
 *
 * Add an entry using the exact faction name from the FACTIONS list in
 * lib/character_types.ts.  Both fields are optional; omit whichever you don't
 * need.
 *
 *   "FACTION NAME HERE": {
 *
 *     // ── Auto-granted perks ───────────────────────────────────────────────
 *     // Perk IDs listed here are added to the player's sheet for free when
 *     // they join the faction and removed automatically if they leave.
 *     // Use the perk `id` values found in data/perks/ files.
 *     grantsPerkIds: ["runner", "tough"],
 *
 *     // ── Extra stat points ────────────────────────────────────────────────
 *     // Positive numbers give the player more stat points to spend.
 *     grantsStatPoints: 2,
 *   },
 *
 * ────────────────────────────────────────────────────────────────────────────
 */
const FACTION_BONUS_DEFINITIONS: Partial<
  Record<Faction, Omit<FactionDefinition, "id">>
> = {
  "ROLEPLAYER - The Church of Provisional Rations": {
    grantsPerkIds: ["free-range"],
  },
  "ROLEPLAYER - Gambling And Guts (GAG)": {
    grantsPerkIds: ["patron"],
  },
  "ROLEPLAYER - The Shinyakaze - Right Hand of the Goddess": {
    grantsPerkIds: ["hidden-personality"],
  },
  // Example (remove the leading // to activate):
  // "SWITZERLAND - King's Royal Army": {
  //   grantsPerkIds: ["runner"],
  //   grantsStatPoints: 1,
  // },
};

// ── Built-in definitions (do not edit below this line) ───────────────────────

export const FACTION_DEFINITIONS: FactionDefinition[] = FACTIONS.map((id) => ({
  id,
  ...(FACTION_BONUS_DEFINITIONS[id] ?? {}),
}));

export const FACTION_DEFINITIONS_BY_ID = new Map<string, FactionDefinition>(
  FACTION_DEFINITIONS.map((f) => [f.id as string, f]),
);
