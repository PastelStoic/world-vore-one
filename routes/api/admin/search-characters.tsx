import { define } from "@/utils.ts";
import { listCharacters } from "@/lib/characters.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const user = ctx.state.user;
    if (!user || !ctx.state.isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const query = ctx.url.searchParams.get("q")?.trim().toLowerCase() ?? "";
    const statusFilter = ctx.url.searchParams.get("status") ?? "";
    const includeHidden = ctx.url.searchParams.get("includeHidden") === "true";
    const allCharacters = await listCharacters();

    let filtered = allCharacters;

    // Exclude hidden characters unless explicitly requested
    if (!includeHidden) {
      filtered = filtered.filter((c) => !c.hidden);
    }

    // Filter by status if specified
    if (statusFilter) {
      filtered = filtered.filter(
        (c) => (c.status ?? "approved") === statusFilter,
      );
    }

    // Filter by search query if provided
    if (query) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(query) ||
          c.userId?.includes(query),
      );
    }

    const results = filtered.slice(0, 200).map((c) => ({
      id: c.id,
      name: c.name,
      userId: c.userId,
      race: c.race,
      status: c.status ?? "approved",
      hidden: c.hidden ?? false,
      updatedAt: c.updatedAt,
    }));

    return new Response(JSON.stringify(results), {
      headers: { "content-type": "application/json" },
    });
  },
});
