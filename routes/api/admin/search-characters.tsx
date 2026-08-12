import { define } from "@/utils.ts";
import { listCharacters } from "@/lib/characters.ts";
import { requireAdmin } from "@/lib/http.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const admin = requireAdmin(ctx);
    if (admin instanceof Response) return admin;

    const query = ctx.url.searchParams.get("q")?.trim().toLowerCase() ?? "";
    const statusFilter = ctx.url.searchParams.get("status") ?? "";
    const includeHidden = ctx.url.searchParams.get("includeHidden") === "true";
    const allCharacters = await listCharacters();

    let filtered = allCharacters;

    if (!includeHidden) {
      filtered = filtered.filter((c) => !c.hidden);
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (c) => (c.status ?? "approved") === statusFilter,
      );
    }

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

    return Response.json(results);
  },
});
