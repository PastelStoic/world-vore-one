import { define } from "@/utils.ts";
import { listCharacters } from "@/lib/characters.ts";
import { calculateEffectiveHealth } from "@/lib/stat_calculations.ts";
import type { CharacterSheet } from "@/lib/character_types.ts";
import type { ImportableCharacter } from "@/lib/battler_types.ts";
import { requireUser } from "@/lib/http.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const user = requireUser(ctx);
    if (user instanceof Response) return user;

    const query = (ctx.url.searchParams.get("q") ?? "").toLowerCase().trim();

    const all = await listCharacters(); // full list for public filtering

    // User's own characters (include everything they own)
    let mine = await listCharacters(user.id);

    // Public / approved characters (exclude the current user's)
    let publicChars = all.filter((c) => {
      const isApproved = (c.status ?? "approved") === "approved";
      const notHidden = !c.hidden;
      const notMine = c.userId !== user.id;
      return isApproved && notHidden && notMine;
    });

    // Apply search filter if provided
    if (query) {
      const matches = (c: CharacterSheet) =>
        c.name?.toLowerCase().includes(query) ||
        c.race?.toLowerCase().includes(query);

      mine = mine.filter(matches);
      publicChars = publicChars.filter(matches);
    }

    // Limit results to keep responses reasonable
    mine = mine.slice(0, 40);
    publicChars = publicChars.slice(0, 40);

    const mapChar = (c: CharacterSheet): ImportableCharacter => ({
      id: c.id,
      name: c.name || "Unnamed",
      maxHealth: calculateEffectiveHealth(c),
      race: c.race,
      imageId: c.imageId,
      status: c.status ?? "approved",
    });

    return Response.json({
      mine: mine.map(mapChar),
      public: publicChars.map(mapChar),
    });
  },
});
