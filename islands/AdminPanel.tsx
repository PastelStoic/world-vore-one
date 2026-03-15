import { useSignal } from "@preact/signals";

interface CharacterResult {
  id: string;
  name: string;
  userId: string;
  race: string;
  status: string;
  hidden: boolean;
  updatedAt: string;
}

interface AdminRecord {
  userId: string;
  username: string;
}

interface BannedRecord {
  userId: string;
  username: string;
  bannedAt: string;
}

interface AdminPanelProps {
  isAdmin: boolean;
  hasAdmins: boolean;
}

export default function AdminPanel(props: AdminPanelProps) {
  const isAdmin = useSignal(props.isAdmin);
  const hasAdmins = useSignal(props.hasAdmins);

  // Bootstrap state
  const bootstrapError = useSignal("");
  const bootstrapping = useSignal(false);

  // Character search
  const searchQuery = useSignal("");
  const characters = useSignal<CharacterResult[]>([]);
  const searchLoading = useSignal(false);

  // Admin management
  const admins = useSignal<AdminRecord[]>([]);
  const adminsLoaded = useSignal(false);
  const newAdminUserId = useSignal("");
  const newAdminUsername = useSignal("");
  const adminError = useSignal("");

  // Ban management
  const bannedUsers = useSignal<BannedRecord[]>([]);
  const bannedLoaded = useSignal(false);
  const newBanUserId = useSignal("");
  const newBanUsername = useSignal("");
  const banError = useSignal("");

  // All characters list
  const allCharacters = useSignal<CharacterResult[]>([]);
  const allCharsLoaded = useSignal(false);
  const allCharsLoading = useSignal(false);
  const filterPendingOnly = useSignal(false);
  const filterIncludeHidden = useSignal(false);

  async function bootstrap() {
    bootstrapping.value = true;
    bootstrapError.value = "";
    try {
      const res = await fetch("/api/admin/bootstrap", { method: "POST" });
      if (res.ok) {
        // Reload the page to pick up the new admin status
        location.reload();
      } else {
        const data = await res.json().catch(() => null);
        bootstrapError.value = data?.error ?? "Failed to bootstrap admin.";
      }
    } catch {
      bootstrapError.value = "Network error.";
    } finally {
      bootstrapping.value = false;
    }
  }

  async function searchCharacters() {
    searchLoading.value = true;
    try {
      const res = await fetch(
        `/api/admin/search-characters?q=${
          encodeURIComponent(searchQuery.value)
        }`,
      );
      if (res.ok) {
        characters.value = await res.json();
      }
    } finally {
      searchLoading.value = false;
    }
  }

  async function approveCharacter(id: string) {
    try {
      const res = await fetch("/api/admin/approve-character", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ characterId: id }),
      });
      if (res.ok) {
        // Update both local lists to reflect the approved status
        characters.value = characters.value.map((c) =>
          c.id === id ? { ...c, status: "approved" } : c
        );
        allCharacters.value = allCharacters.value.map((c) =>
          c.id === id ? { ...c, status: "approved" } : c
        );
      }
    } catch {
      // ignore
    }
  }

  async function loadAdmins() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        admins.value = await res.json();
        adminsLoaded.value = true;
      }
    } catch {
      // ignore
    }
  }

  async function loadBannedUsers() {
    try {
      const res = await fetch("/api/admin/ban-user");
      if (res.ok) {
        bannedUsers.value = await res.json();
        bannedLoaded.value = true;
      }
    } catch {
      // ignore
    }
  }

  async function banUser() {
    banError.value = "";
    const userId = newBanUserId.value.trim();
    const username = newBanUsername.value.trim();
    if (!userId) {
      banError.value = "Discord User ID is required.";
      return;
    }
    if (
      !confirm(
        `Ban user ${
          username || userId
        }? This will permanently delete all of their characters.`,
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          username: username || userId,
          action: "ban",
        }),
      });
      if (res.ok) {
        bannedUsers.value = await res.json();
        newBanUserId.value = "";
        newBanUsername.value = "";
      } else {
        const data = await res.json().catch(() => null);
        banError.value = data?.error ?? "Failed to ban user.";
      }
    } catch {
      banError.value = "Network error.";
    }
  }

  async function unbanUser(userId: string) {
    banError.value = "";
    try {
      const res = await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, action: "unban" }),
      });
      if (res.ok) {
        bannedUsers.value = await res.json();
      } else {
        const data = await res.json().catch(() => null);
        banError.value = data?.error ?? "Failed to unban user.";
      }
    } catch {
      banError.value = "Network error.";
    }
  }

  async function addAdmin() {
    adminError.value = "";
    const userId = newAdminUserId.value.trim();
    const username = newAdminUsername.value.trim();
    if (!userId) {
      adminError.value = "Discord User ID is required.";
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          username: username || userId,
          action: "add",
        }),
      });
      if (res.ok) {
        admins.value = await res.json();
        newAdminUserId.value = "";
        newAdminUsername.value = "";
      } else {
        const data = await res.json().catch(() => null);
        adminError.value = data?.error ?? "Failed to add admin.";
      }
    } catch {
      adminError.value = "Network error.";
    }
  }

  async function removeAdminUser(userId: string) {
    adminError.value = "";
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, action: "remove" }),
      });
      if (res.ok) {
        admins.value = await res.json();
      } else {
        const data = await res.json().catch(() => null);
        adminError.value = data?.error ?? "Failed to remove admin.";
      }
    } catch {
      adminError.value = "Network error.";
    }
  }

  async function loadAllCharacters() {
    allCharsLoading.value = true;
    try {
      const params = new URLSearchParams();
      if (filterPendingOnly.value) params.set("status", "pending");
      if (filterIncludeHidden.value) params.set("includeHidden", "true");
      const res = await fetch(
        `/api/admin/search-characters?${params.toString()}`,
      );
      if (res.ok) {
        allCharacters.value = await res.json();
        allCharsLoaded.value = true;
      }
    } finally {
      allCharsLoading.value = false;
    }
  }

  async function toggleHideCharacter(id: string, currentlyHidden: boolean) {
    try {
      const res = await fetch(`/api/admin/hide-character`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ characterId: id, hidden: !currentlyHidden }),
      });
      if (res.ok) {
        allCharacters.value = allCharacters.value.map((c) =>
          c.id === id ? { ...c, hidden: !currentlyHidden } : c
        );
      }
    } catch {
      // ignore
    }
  }

  async function adminDeleteCharacter(id: string, name: string) {
    if (
      !globalThis.confirm(
        `Permanently delete "${name}" and all its data? This cannot be undone.`,
      )
    ) return;
    try {
      const res = await fetch(`/api/admin/delete-character`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ characterId: id }),
      });
      if (res.ok) {
        allCharacters.value = allCharacters.value.filter((c) => c.id !== id);
        characters.value = characters.value.filter((c) => c.id !== id);
      }
    } catch {
      // ignore
    }
  }

  // Not admin and no admins exist → show bootstrap
  if (!isAdmin.value && !hasAdmins.value) {
    return (
      <div class="space-y-4">
        <p class="text-base-content">
          No admin accounts exist yet. As the site owner, you can make yourself
          the first admin.
        </p>
        <button
          type="button"
          onClick={bootstrap}
          disabled={bootstrapping.value}
          class="px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {bootstrapping.value ? "Setting up…" : "Become Admin"}
        </button>
        {bootstrapError.value && (
          <p class="text-error">{bootstrapError.value}</p>
        )}
      </div>
    );
  }

  // Not admin but admins exist → access denied
  if (!isAdmin.value) {
    return (
      <p class="text-error">
        You do not have admin access. Ask an existing admin to grant you access.
      </p>
    );
  }

  // Admin view
  if (!adminsLoaded.value) {
    loadAdmins();
  }
  if (!bannedLoaded.value) {
    loadBannedUsers();
  }

  return (
    <div class="space-y-8">
      {/* ── Character Search ─────────────────────────────── */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Search Characters</h2>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="Character name or user ID…"
            value={searchQuery.value}
            onInput={(
              e,
            ) => (searchQuery.value = (e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchCharacters();
            }}
            class="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="button"
            onClick={searchCharacters}
            disabled={searchLoading.value}
            class="px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {searchLoading.value ? "Searching…" : "Search"}
          </button>
        </div>

        {characters.value.length > 0 && (
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-base-200">
                <tr>
                  <th class="text-left px-3 py-2">Name</th>
                  <th class="text-left px-3 py-2">Race</th>
                  <th class="text-left px-3 py-2">Status</th>
                  <th class="text-left px-3 py-2">Owner ID</th>
                  <th class="text-left px-3 py-2">Updated</th>
                  <th class="text-left px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {characters.value.map((c) => (
                  <tr key={c.id} class="border-t hover:bg-base-200">
                    <td class="px-3 py-2">
                      <a
                        href={`/characters/${c.id}`}
                        class="underline text-primary"
                      >
                        {c.name}
                      </a>
                    </td>
                    <td class="px-3 py-2">{c.race}</td>
                    <td class="px-3 py-2">
                      {c.status === "pending"
                        ? (
                          <button
                            type="button"
                            onClick={() => approveCharacter(c.id)}
                            class="px-2 py-1 text-xs bg-warning/20 text-warning border border-warning/50 rounded hover:bg-success/20 hover:text-success hover:border-success/50 transition-colors"
                          >
                            Pending — Approve
                          </button>
                        )
                        : <span class="text-xs text-success">Approved</span>}
                    </td>
                    <td class="px-3 py-2 font-mono text-xs">{c.userId}</td>
                    <td class="px-3 py-2 text-xs">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </td>
                    <td class="px-3 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          adminDeleteCharacter(c.id, c.name)}
                        class="text-xs text-error hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── All Characters ───────────────────────────────── */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">All Characters</h2>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              filterPendingOnly.value = !filterPendingOnly.value;
              loadAllCharacters();
            }}
            class={`px-3 py-1.5 border rounded text-sm transition-colors ${
              filterPendingOnly.value
                ? "bg-warning/20 border-warning text-warning"
                : "bg-base-100 hover:bg-base-200"
            }`}
          >
            {filterPendingOnly.value ? "✓ Pending Only" : "Pending Only"}
          </button>
          <button
            type="button"
            onClick={() => {
              filterIncludeHidden.value = !filterIncludeHidden.value;
              loadAllCharacters();
            }}
            class={`px-3 py-1.5 border rounded text-sm transition-colors ${
              filterIncludeHidden.value
                ? "bg-base-200 border-base-300"
                : "bg-base-100 hover:bg-base-200"
            }`}
          >
            {filterIncludeHidden.value ? "✓ Include Hidden" : "Include Hidden"}
          </button>
          <button
            type="button"
            onClick={loadAllCharacters}
            disabled={allCharsLoading.value}
            class="px-3 py-1.5 border rounded text-sm bg-primary text-primary-content hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {allCharsLoading.value
              ? "Loading…"
              : allCharsLoaded.value
              ? "Refresh"
              : "Load"}
          </button>
        </div>

        {allCharsLoaded.value && (
          <>
            <p class="text-sm text-base-content/60">
              {allCharacters.value.length}{" "}
              character{allCharacters.value.length !== 1 ? "s" : ""} found
            </p>
            {allCharacters.value.length > 0 && (
              <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-sm">
                  <thead class="bg-base-200">
                    <tr>
                      <th class="text-left px-3 py-2">Name</th>
                      <th class="text-left px-3 py-2">Race</th>
                      <th class="text-left px-3 py-2">Status</th>
                      <th class="text-left px-3 py-2">Owner ID</th>
                      <th class="text-left px-3 py-2">Updated</th>
                      <th class="text-left px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCharacters.value.map((c) => (
                      <tr
                        key={c.id}
                        class={`border-t hover:bg-base-200 ${
                          c.hidden ? "opacity-50" : ""
                        }`}
                      >
                        <td class="px-3 py-2">
                          <a
                            href={`/characters/${c.id}`}
                            class="underline text-primary"
                          >
                            {c.name}
                          </a>
                          {c.hidden && (
                            <span class="ml-1 text-xs text-base-content/50">
                              (hidden)
                            </span>
                          )}
                        </td>
                        <td class="px-3 py-2">{c.race}</td>
                        <td class="px-3 py-2">
                          {c.status === "pending"
                            ? (
                              <button
                                type="button"
                                onClick={() => approveCharacter(c.id)}
                                class="px-2 py-1 text-xs bg-warning/20 text-warning border border-warning/50 rounded hover:bg-success/20 hover:text-success hover:border-success/50 transition-colors"
                              >
                                Pending — Approve
                              </button>
                            )
                            : (
                              <span class="text-xs text-success">Approved</span>
                            )}
                        </td>
                        <td class="px-3 py-2 font-mono text-xs">{c.userId}</td>
                        <td class="px-3 py-2 text-xs">
                          {new Date(c.updatedAt).toLocaleDateString()}
                        </td>
                        <td class="px-3 py-2">
                          <div class="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                toggleHideCharacter(c.id, c.hidden)}
                              class="text-xs hover:underline"
                            >
                              {c.hidden ? "Unhide" : "Hide"}
                            </button>
                            <button
                              type="button"
                              onClick={() => adminDeleteCharacter(c.id, c.name)}
                              class="text-xs text-error hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Admin Management ─────────────────────────────── */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Manage Admins</h2>

        {admins.value.length > 0 && (
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-base-200">
                <tr>
                  <th class="text-left px-3 py-2">Username</th>
                  <th class="text-left px-3 py-2">User ID</th>
                  <th class="text-left px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.value.map((a) => (
                  <tr key={a.userId} class="border-t hover:bg-base-200">
                    <td class="px-3 py-2">{a.username}</td>
                    <td class="px-3 py-2 font-mono text-xs">{a.userId}</td>
                    <td class="px-3 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          removeAdminUser(a.userId)}
                        class="text-error hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div class="flex gap-2 items-end">
          <div class="flex-1 space-y-1">
            <label class="text-xs text-base-content/60">Discord User ID</label>
            <input
              type="text"
              placeholder="e.g. 123456789012345678"
              value={newAdminUserId.value}
              onInput={(
                e,
              ) => (newAdminUserId.value =
                (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <div class="flex-1 space-y-1">
            <label class="text-xs text-base-content/60">
              Username (optional)
            </label>
            <input
              type="text"
              placeholder="Display name"
              value={newAdminUsername.value}
              onInput={(
                e,
              ) => (newAdminUsername.value =
                (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={addAdmin}
            class="px-4 py-2 bg-success text-success-content rounded hover:bg-success/90 transition-colors"
          >
            Add Admin
          </button>
        </div>
        {adminError.value && (
          <p class="text-error text-sm">{adminError.value}</p>
        )}
      </section>

      {/* ── Ban Management ───────────────────────────────── */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Ban Management</h2>

        {bannedUsers.value.length > 0 && (
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-base-200">
                <tr>
                  <th class="text-left px-3 py-2">Username</th>
                  <th class="text-left px-3 py-2">User ID</th>
                  <th class="text-left px-3 py-2">Banned At</th>
                  <th class="text-left px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bannedUsers.value.map((b) => (
                  <tr key={b.userId} class="border-t hover:bg-base-200">
                    <td class="px-3 py-2">{b.username}</td>
                    <td class="px-3 py-2 font-mono text-xs">{b.userId}</td>
                    <td class="px-3 py-2 text-xs">
                      {b.bannedAt
                        ? new Date(b.bannedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td class="px-3 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          unbanUser(b.userId)}
                        class="text-success hover:underline text-xs"
                      >
                        Unban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {bannedUsers.value.length === 0 && bannedLoaded.value && (
          <p class="text-sm text-base-content/60">No banned users.</p>
        )}

        <div class="flex gap-2 items-end">
          <div class="flex-1 space-y-1">
            <label class="text-xs text-base-content/60">Discord User ID</label>
            <input
              type="text"
              placeholder="e.g. 123456789012345678"
              value={newBanUserId.value}
              onInput={(
                e,
              ) => (newBanUserId.value = (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <div class="flex-1 space-y-1">
            <label class="text-xs text-base-content/60">
              Username (optional)
            </label>
            <input
              type="text"
              placeholder="Display name"
              value={newBanUsername.value}
              onInput={(
                e,
              ) => (newBanUsername.value =
                (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={banUser}
            class="px-4 py-2 bg-error text-error-content rounded hover:bg-error/90 transition-colors"
          >
            Ban User
          </button>
        </div>
        {banError.value && <p class="text-error text-sm">{banError.value}</p>}
      </section>
    </div>
  );
}
