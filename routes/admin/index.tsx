import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { anyAdminsExist } from "@/lib/admin.ts";
import AdminPanel from "@/islands/AdminPanel.tsx";

export default define.page(async function AdminPage(ctx) {
  const user = ctx.state.user;

  if (!user) {
    return (
      <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
        <Head>
          <title>Admin – World Vore One</title>
        </Head>
        <div class="max-w-3xl mx-auto space-y-4">
          <a href="/" class="underline">← Back to Home</a>
          <h1 class="text-2xl font-bold">Admin</h1>
          <p class="text-base-content">
            Please{" "}
            <a href="/auth/discord" class="underline font-medium">
              log in with Discord
            </a>{" "}
            to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const hasAdmins = await anyAdminsExist();

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Admin – World Vore One</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-4">
        <a href="/" class="underline">← Back to Home</a>
        <h1 class="text-2xl font-bold">Admin Panel</h1>
        <AdminPanel isAdmin={ctx.state.isAdmin} hasAdmins={hasAdmins} />
      </div>
    </div>
  );
});
