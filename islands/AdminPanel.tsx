import { useSignal } from "@preact/signals";

interface CharacterResult {
  id: string;
  name: string;
  userId: string;
  race: string;
  updatedAt: string;
}

interface AdminRecord {
  userId: string;
  username: string;
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
        `/api/admin/search-characters?q=${encodeURIComponent(searchQuery.value)}`,
      );
      if (res.ok) {
        characters.value = await res.json();
      }
    } finally {
      searchLoading.value = false;
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
        body: JSON.stringify({ userId, username: username || userId, action: "add" }),
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

  // Not admin and no admins exist → show bootstrap
  if (!isAdmin.value && !hasAdmins.value) {
    return (
      <div class="space-y-4">
        <p class="text-gray-700">
          No admin accounts exist yet. As the site owner, you can make yourself the first admin.
        </p>
        <button
          onClick={bootstrap}
          disabled={bootstrapping.value}
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {bootstrapping.value ? "Setting up…" : "Become Admin"}
        </button>
        {bootstrapError.value && (
          <p class="text-red-600">{bootstrapError.value}</p>
        )}
      </div>
    );
  }

  // Not admin but admins exist → access denied
  if (!isAdmin.value) {
    return (
      <p class="text-red-600">
        You do not have admin access. Ask an existing admin to grant you access.
      </p>
    );
  }

  // Admin view
  if (!adminsLoaded.value) {
    loadAdmins();
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
            onInput={(e) => (searchQuery.value = (e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchCharacters();
            }}
            class="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={searchCharacters}
            disabled={searchLoading.value}
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {searchLoading.value ? "Searching…" : "Search"}
          </button>
        </div>

        {characters.value.length > 0 && (
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="text-left px-3 py-2">Name</th>
                  <th class="text-left px-3 py-2">Race</th>
                  <th class="text-left px-3 py-2">Owner ID</th>
                  <th class="text-left px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {characters.value.map((c) => (
                  <tr key={c.id} class="border-t hover:bg-gray-50">
                    <td class="px-3 py-2">
                      <a href={`/characters/${c.id}`} class="underline text-blue-600">
                        {c.name}
                      </a>
                    </td>
                    <td class="px-3 py-2">{c.race}</td>
                    <td class="px-3 py-2 font-mono text-xs">{c.userId}</td>
                    <td class="px-3 py-2 text-xs">{new Date(c.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Admin Management ─────────────────────────────── */}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Manage Admins</h2>

        {admins.value.length > 0 && (
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="text-left px-3 py-2">Username</th>
                  <th class="text-left px-3 py-2">User ID</th>
                  <th class="text-left px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.value.map((a) => (
                  <tr key={a.userId} class="border-t hover:bg-gray-50">
                    <td class="px-3 py-2">{a.username}</td>
                    <td class="px-3 py-2 font-mono text-xs">{a.userId}</td>
                    <td class="px-3 py-2">
                      <button
                        onClick={() => removeAdminUser(a.userId)}
                        class="text-red-600 hover:underline text-xs"
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
            <label class="text-xs text-gray-600">Discord User ID</label>
            <input
              type="text"
              placeholder="e.g. 123456789012345678"
              value={newAdminUserId.value}
              onInput={(e) => (newAdminUserId.value = (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <div class="flex-1 space-y-1">
            <label class="text-xs text-gray-600">Username (optional)</label>
            <input
              type="text"
              placeholder="Display name"
              value={newAdminUsername.value}
              onInput={(e) => (newAdminUsername.value = (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            onClick={addAdmin}
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Add Admin
          </button>
        </div>
        {adminError.value && (
          <p class="text-red-600 text-sm">{adminError.value}</p>
        )}
      </section>
    </div>
  );
}
