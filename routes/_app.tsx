import { define } from "@/utils.ts";
import DarkModeToggle from "@/islands/DarkModeToggle.tsx";

export default define.page(function App({ Component, state }) {
  const user = state.user;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>world-vore-one</title>
      </head>
      <body>
        <nav class="flex items-center justify-end px-4 py-2 bg-base-300/80 border-b dark:border-base-300 gap-3">
          <DarkModeToggle />
          <a
            href="/wiki"
            class="text-sm px-3 py-1 border rounded hover:bg-base-200 dark:hover:bg-base-200 transition-colors mr-auto"
          >
            Wiki
          </a>
          {user
            ? (
              <div class="flex items-center gap-3">
                {state.isAdmin && (
                  <a
                    href="/admin"
                    class="text-sm px-3 py-1 border rounded hover:bg-base-200 dark:hover:bg-base-200 transition-colors"
                  >
                    Admin
                  </a>
                )}
                <span class="text-sm font-medium">{user.username}</span>
                <a
                  href="/auth/logout"
                  class="text-sm px-3 py-1 border rounded hover:bg-base-200 dark:hover:bg-base-200 transition-colors"
                >
                  Logout
                </a>
              </div>
            )
            : (
              <a
                href="/auth/discord"
                class="text-sm px-3 py-1 border rounded hover:bg-base-200 dark:hover:bg-base-200 transition-colors"
              >
                Login with Discord
              </a>
            )}
        </nav>
        <Component />
      </body>
    </html>
  );
});
