import { define } from "../../../utils.ts";
import { listCharacters } from "../../../lib/characters.ts";
import { isAdmin } from "../../../lib/admin.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const user = ctx.state.user;
    if (!user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const query = ctx.url.searchParams.get("q")?.trim().toLowerCase() ?? "";
    const allCharacters = await listCharacters();

    const filtered = query
      ? allCharacters.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.userId.includes(query),
        )
      : allCharacters;

    const results = filtered.slice(0, 50).map((c) => ({
      id: c.id,
      name: c.name,
      userId: c.userId,
      race: c.race,
      updatedAt: c.updatedAt,
    }));

    return new Response(JSON.stringify(results), {
      headers: { "content-type": "application/json" },
    });
  },
});
