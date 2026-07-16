import { useEffect, useState } from "preact/hooks";
import type { SessionUser } from "@/lib/session_types.ts";
import type { BattleRoom } from "@/lib/battler_types.ts";

interface BattlerHubProps {
  user: SessionUser | null;
  isValidated: boolean;
}

export default function BattlerHub({ user, isValidated }: BattlerHubProps) {
  const [battles, setBattles] = useState<BattleRoom[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoadingList(true);
    fetch("/api/battler/battles")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load battles");
        const data = await res.json();
        if (!cancelled) setBattles(data.battles ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e.message ?? e));
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function createBattle() {
    if (!user) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/battler/battles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Battle" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Create failed");
      globalThis.location.href = `/battler/${data.id}`;
    } catch (e) {
      setError(String((e as Error).message ?? e));
      setCreating(false);
    }
  }

  function openBattle(id: string) {
    const trimmed = id.trim();
    if (!trimmed) return;
    globalThis.location.href = `/battler/${trimmed}`;
  }

  return (
    <div class="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 class="text-2xl font-bold">Hex Battler</h1>
        <p class="text-sm text-base-content/70 mt-1">
          Tactical hex grid for World Vore One. Create a multiplayer battle,
          share the link for spectators, or practice offline.
        </p>
      </div>

      {error && (
        <div class="text-sm text-error border border-error/40 rounded px-3 py-2">
          {error}
        </div>
      )}

      <section class="space-y-3 border border-base-300 rounded-lg p-4 bg-base-100">
        <h2 class="font-semibold">Online battle</h2>
        {user
          ? (
            isValidated
              ? (
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  disabled={creating}
                  onClick={createBattle}
                >
                  {creating ? "Creating…" : "Create battle"}
                </button>
              )
              : (
                <p class="text-sm text-base-content/70">
                  Create and join multiplayer battles require a{" "}
                  <strong>moderator-approved character</strong>. Submit a sheet
                  for review first — you can still spectate any public battle
                  link and use the local sandbox.
                </p>
              )
          )
          : (
            <p class="text-sm text-base-content/70">
              <a href="/auth/discord" class="link link-primary">Log in</a>
              {" "}
              to create a battle or join as a player. Anyone with a link can
              spectate without logging in.
            </p>
          )}

        <div class="flex flex-wrap gap-2 items-end pt-2">
          <label class="form-control flex-1 min-w-48">
            <span class="label-text text-xs">Open battle by UUID</span>
            <input
              type="text"
              class="input input-bordered input-sm w-full font-mono"
              placeholder="paste battle id…"
              value={openId}
              onInput={(e) =>
                setOpenId((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") openBattle(openId);
              }}
            />
          </label>
          <button
            type="button"
            class="btn btn-sm btn-outline"
            onClick={() => openBattle(openId)}
          >
            Open
          </button>
        </div>
      </section>

      {user && (
        <section class="space-y-2 border border-base-300 rounded-lg p-4 bg-base-100">
          <h2 class="font-semibold">Your battles</h2>
          {loadingList && (
            <p class="text-xs text-base-content/60">Loading…</p>
          )}
          {!loadingList && battles.length === 0 && (
            <p class="text-xs text-base-content/60">
              No battles yet. Create one to get a shareable link.
            </p>
          )}
          <ul class="space-y-1 text-sm">
            {battles.map((b) => (
              <li key={b.id}>
                <a
                  href={`/battler/${b.id}`}
                  class="flex items-center justify-between gap-2 border border-base-300 rounded px-3 py-2 hover:bg-base-200"
                >
                  <span class="font-medium truncate">
                    {b.name || "Untitled battle"}
                  </span>
                  <span class="text-xs text-base-content/60 shrink-0">
                    {b.status} · r{b.stateRevision} ·{" "}
                    {b.players.length} players
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section class="space-y-2 border border-base-300 rounded-lg p-4 bg-base-100">
        <h2 class="font-semibold">Local sandbox</h2>
        <p class="text-xs text-base-content/60">
          Offline practice board stored only in this browser. No turns, no
          multiplayer.
        </p>
        <a href="/battler/local" class="btn btn-sm btn-outline">
          Open local sandbox
        </a>
      </section>
    </div>
  );
}
