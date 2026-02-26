import { getKv } from "./kv.ts";

// ── Discord OAuth2 config ──────────────────────────────────────────

const DISCORD_CLIENT_ID = Deno.env.get("DISCORD_CLIENT_ID") ?? "";
const DISCORD_CLIENT_SECRET = Deno.env.get("DISCORD_CLIENT_SECRET") ?? "";
const DISCORD_REDIRECT_URI = Deno.env.get("DISCORD_REDIRECT_URI") ??
  "http://127.0.0.1:5173/auth/discord/callback";

const DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize";
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";

// ── Types ──────────────────────────────────────────────────────────

export interface SessionUser {
  id: string; // Discord user id
  username: string;
  avatar: string | null;
}

interface SessionData {
  user: SessionUser;
  expiresAt: number;
}

// ── Session helpers ────────────────────────────────────────────────

const SESSION_PREFIX = ["sessions"] as const;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(user: SessionUser): Promise<string> {
  const kv = await getKv();
  const sessionId = crypto.randomUUID();
  const data: SessionData = {
    user,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  await kv.set([...SESSION_PREFIX, sessionId], data, {
    expireIn: SESSION_TTL_MS,
  });
  return sessionId;
}

export async function getSession(
  sessionId: string,
): Promise<SessionUser | null> {
  const kv = await getKv();
  const entry = await kv.get<SessionData>([...SESSION_PREFIX, sessionId]);
  if (!entry.value) return null;
  if (entry.value.expiresAt < Date.now()) {
    await kv.delete([...SESSION_PREFIX, sessionId]);
    return null;
  }
  return entry.value.user;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const kv = await getKv();
  await kv.delete([...SESSION_PREFIX, sessionId]);
}

// ── Cookie helpers ─────────────────────────────────────────────────

const COOKIE_NAME = "session";

export function getSessionIdFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export function setSessionCookie(headers: Headers, sessionId: string) {
  headers.append(
    "set-cookie",
    `${COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}`,
  );
}

export function clearSessionCookie(headers: Headers) {
  headers.append(
    "set-cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
}

// ── Discord OAuth flow ─────────────────────────────────────────────

export function buildDiscordAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify",
    state,
  });
  return `${DISCORD_AUTH_URL}?${params}`;
}

export async function exchangeCodeForToken(
  code: string,
): Promise<string | null> {
  const res = await fetch(DISCORD_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Discord token exchange failed:", res.status, data);
    return null;
  }
  return data.access_token ?? null;
}

export async function fetchDiscordUser(
  accessToken: string,
): Promise<SessionUser | null> {
  const res = await fetch(DISCORD_USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return {
    id: data.id,
    username: data.username,
    avatar: data.avatar ?? null,
  };
}
