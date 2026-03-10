// deno-lint-ignore-file react-no-danger
import { define } from "@/utils.ts";
import DarkModeToggle from "@/islands/DarkModeToggle.tsx";
import { NavLink } from "@/components/NavLink.tsx";

export default define.page(function App({ Component, state }) {
  const user = state.user;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>world-vore-one</title>
        {/* Set theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `(function(){var s=localStorage.getItem('darkMode');var d=s!==null?s==='true':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');})();`,
          }}
        />
      </head>
      <body>
        <nav class="flex items-center justify-end px-4 py-2 bg-base-300/80 border-b border-base-300 gap-3">
          <DarkModeToggle />
          <NavLink href="/wiki" class="mr-auto">Wiki</NavLink>
          {user
            ? (
              <div class="flex items-center gap-3">
                {state.isAdmin && <NavLink href="/admin">Admin</NavLink>}
                <span class="text-sm font-medium">{user.username}</span>
                <NavLink href="/auth/logout">Logout</NavLink>
              </div>
            )
            : <NavLink href="/auth/discord">Login with Discord</NavLink>}
        </nav>
        <Component />
      </body>
    </html>
  );
});
