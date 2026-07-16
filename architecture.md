# Architecture Overview

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| **Runtime**    | Deno (Deno Deploy)                            |
| **Framework**  | Fresh v2 (SSR + Islands architecture)         |
| **UI Library** | Preact 10.x                                   |
| **Signals**    | `@preact/signals`                             |
| **Build Tool** | Vite 7 with `@fresh/plugin-vite`              |
| **CSS**        | Tailwind CSS v4 via `@tailwindcss/vite`       |
| **Database**   | Neon Postgres via Drizzle ORM                 |
| **Auth**       | Discord OAuth2 (authorization code flow)      |
| **Images**     | Cloudflare Images (Direct Creator Upload API) |

---

## High-Level Data Flow

```
Browser ──POST/GET──▶ Routes (server-rendered) ──▶ lib/ (business logic) ──▶ Neon Postgres
                            │
                            ▼
                      Islands (hydrate on client, interactive UI)
                            │
                            ▼
                      useCharacterStats hook ──▶ stat_calculations (pure functions)
```

Pages are **server-rendered by default**. Only components in `islands/` ship
JavaScript to the browser and hydrate interactively. Character mutations use
native `<form method="POST">` submissions handled by server-side route handlers;
the admin panel uses client-side `fetch()` calls to API endpoints.

---

## Directory Structure

```
├── main.ts                  # App entry point, middleware, routing setup
├── client.ts                # Client-side entry (CSS import for HMR)
├── utils.ts                 # Shared State type and define() helper
├── vite.config.ts           # Vite + Tailwind + Fresh plugin config
├── deno.json                # Import map, tasks, compiler options
│
├── lib/                     # Business logic & data access
│   ├── character_types.ts   # Domain types & constants
│   ├── characters.ts        # Character CRUD & snapshot operations
│   ├── stat_calculations.ts # Pure derived-stat calculators
│   ├── useCharacterStats.ts # Preact hook for editor/viewer
│   ├── form_helpers.ts      # Server-side form parsing & validation
│   ├── auth.ts              # Discord OAuth2 + session management
│   └── admin.ts             # Admin role management
│
├── data/                    # Static game data
│   ├── perks.ts             # Aggregated perk registry
│   └── perks/               # Perk definitions by category
│       ├── combat.ts
│       ├── vore.ts
│       ├── smut.ts
│       ├── gimmick.ts
│       ├── pf-type.ts
│       ├── faction.ts
│       └── negative.ts
│
├── routes/                  # File-system routing (pages + API)
│   ├── _app.tsx             # Root layout (nav, head, body)
│   ├── index.tsx            # Home page (character list / login)
│   ├── admin/index.tsx      # Admin dashboard page
│   ├── auth/                # Discord OAuth2 flow
│   ├── characters/          # Character CRUD pages
│   └── api/                 # JSON API endpoints
│
├── islands/                 # Client-hydrated interactive components
│   ├── CharacterSheetEditor.tsx
│   ├── CharacterSheetViewer.tsx
│   ├── AdminPanel.tsx
│   ├── BattlerHub.tsx
│   └── HexGridBattler.tsx
│
├── components/              # Server-rendered shared components
│   ├── CharacterPageLayout.tsx
│   ├── OtherStatsSection.tsx
│   ├── EncumbranceSection.tsx
│   └── Button.tsx
│
├── assets/styles.css        # Tailwind import + custom classes
└── static/                  # Static files served as-is
```

---

## Entry Point & Middleware

**`main.ts`** creates the Fresh `App<State>`, registers static file serving, and
adds authentication middleware that runs on every request. The middleware reads
the session cookie, resolves the user from Deno KV, checks admin status, and
populates `ctx.state.user` and `ctx.state.isAdmin` for all downstream routes.

**`utils.ts`** defines the shared `State` interface and exports a typed
`define()` helper (via `createDefine<State>()`) used throughout routes and
handlers.

---

## Data Layer

### Neon Postgres (Drizzle)

All runtime persistence uses Neon-managed Postgres via Drizzle ORM
(`lib/db/client.ts`, `lib/db/schema.ts`). Connection string:
`DATABASE_URL` or `NEON_CONNECTION_STRING`.

| Table                 | Data                                      |
| --------------------- | ----------------------------------------- |
| `characters`          | Character sheets (JSONB + user_id index)  |
| `character_snapshots` | Snapshot history (CASCADE on character)   |
| `sessions`            | Auth sessions (app-enforced `expires_at`) |
| `admins`              | Admin grants (user_id, username)          |
| `bans`                | Banned users (user_id, username, banned_at) |
| `battles`             | Multiplayer hex battles (JSONB board + turn metadata) |

### Production KV → Neon cutover

The site runs on **Deno Deploy**. Legacy data lives in Deploy’s hosted KV;
runtime now uses Neon. Migrate **from your machine** via KV Connect (not by
opening a local empty KV):

```bash
# New Deno Deploy (console.deno.com): org token (ddo_…) + Databases → Database ID
# In .env:
#   DENO_KV_ACCESS_TOKEN=ddo_...
#   DENO_KV_DATABASE_ID=...
#   NEON_CONNECTION_STRING=...   # same secret you set on Deploy
# Optional: DENO_KV_API_VERSION=classic  # only if data is still on Deploy Classic

deno task migrate:kv:deploy -- --inventory   # confirm non-empty KV first
deno task migrate:kv:deploy                  # pre-copy while old build still serves
# optional maintenance window
deno task migrate:kv:deploy                  # final delta (idempotent)
# deploy this build + set DATABASE_URL / NEON_CONNECTION_STRING on Deploy
```

**Bearer token invalid:** you hit the Classic connect path with a new-platform
token. This repo defaults to `/v2/databases/<id>/connect`.

**Empty inventory:** wrong DB id, or Classic data never moved (new Deploy does
not auto-import Classic KV — contact support@deno.com if needed).

Details: header of `scripts/migrate_kv_to_postgres.ts`.

### Domain Types (`lib/character_types.ts`)

Core types: `CharacterDraft` (editable fields), `CharacterSheet` (persisted,
with id/userId/timestamps/imageId/latestSnapshotId), `CharacterSnapshot`
(immutable version record).

Constants: `RACES`, `SEX_OPTIONS`, `FACTIONS`, `BASE_STAT_FIELDS`,
`BASELINER_STAT_POINTS` (7), `DEFAULT_STAT_POINTS` (5), `PERK_COST_STAT_POINTS`
(3). Helper `getStartingStatPoints(race)` returns 7 for Baseliners and 5 for all
other races.

### Perks (`data/perks/`)

Each category file exports a typed `PerkDefinition[]` array. Perks can carry
`modifiers` (e.g., `healthMultiplier: 2`), race/faction requirements, and
lock-category exclusivity. `data/perks.ts` aggregates all categories and exports
lookup structures (`PERKS_BY_ID`, `PERK_IDS`, `validatePerkRequirements()`).

---

## Business Logic (`lib/`)

### Character Operations (`lib/characters.ts`)

CRUD functions for characters and snapshots. Key operations:

- **`upsertCharacter(input, changelog, options?)`** — Creates or updates a
  character and atomically creates a snapshot.
- **`listCharacters(userId?)`** — Lists characters, optionally filtered by user.
- **`setCharacterImageId(characterId, imageId)`** — Associates a Cloudflare
  image.
- **`calculatePerksCost()`**, **`validateCharacterProgression()`** — Validates
  stat/perk point math.

### Stat Calculations (`lib/stat_calculations.ts`)

Pure functions that compute effective stats from base stats + perk modifiers.
Nothing is stored — all derived values are calculated on the fly. Includes
encumbrance calculations (4 tiers based on carry capacity vs. carried weight,
applying STR/DEX penalties).

### Character Stats Hook (`lib/useCharacterStats.ts`)

A Preact hook (`useCharacterStats(draft)`) shared by the Editor and Viewer
islands. Manages carried-weight state, computes carry capacity, encumbrance
level, and a memoized record of effective stats.

### Form Helpers (`lib/form_helpers.ts`)

Server-side utilities for parsing and validating `FormData` submissions from the
character editor form. Extracts and validates all fields, then constructs and
validates a `CharacterDraft`.

---

## Authentication & Authorization

### Discord OAuth2 (`lib/auth.ts`)

Full OAuth2 authorization code flow: build auth URL → exchange code for token →
fetch Discord user profile. Sessions are stored in Postgres (`sessions` table)
with a 7-day `expires_at` checked on read. Cookie helpers manage `session`.

**Auth routes:**

- `GET /auth/discord/` — Redirects to Discord authorization.
- `GET /auth/discord/callback` — Exchanges code, creates session, sets cookie,
  redirects home.
- `GET /auth/logout` — Deletes session, clears cookie.

### Admin System (`lib/admin.ts`)

Admin roles stored in Postgres (`admins` table). Supports a bootstrap flow: if
no admins exist, the first logged-in user can self-promote via
`POST /api/admin/bootstrap`. Admin APIs are gated by `ctx.state.isAdmin`.

---

## API Endpoints (`routes/api/`)

| Route                          | Methods           | Purpose                                               |
| ------------------------------ | ----------------- | ----------------------------------------------------- |
| `/api/admin/bootstrap`         | POST              | Self-promote to admin when none exist                 |
| `/api/admin/users`             | GET, POST         | List/add/remove admins                                |
| `/api/admin/search-characters` | GET               | Search characters by name/userId (top 50)             |
| `/api/characters/[id]/image`   | POST, PUT, DELETE | Cloudflare upload URL, save/remove image on character |
| `/api/images/direct-upload`    | POST              | Cloudflare upload URL (no character required)         |

---

## Pages (`routes/`)

| Route                                    | Purpose                                     |
| ---------------------------------------- | ------------------------------------------- |
| `/`                                      | Home — character list for logged-in user    |
| `/admin`                                 | Admin dashboard (renders AdminPanel island) |
| `/characters/new`                        | Create character (editor island + POST)     |
| `/characters/[id]`                       | View character (viewer island)              |
| `/characters/[id]/edit`                  | Edit character (editor island + POST)       |
| `/characters/[id]/versions`              | Version history list                        |
| `/characters/[id]/versions/[snapshotId]` | View/restore a snapshot                     |

**`_app.tsx`** is the root layout wrapping all pages with `<html>`, `<head>`,
navigation bar (login/logout/admin links), and `<body>`.

---

## Islands (Client-Side Components)

| Island                   | Description                                                                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CharacterSheetEditor** | Full create/edit form. Manages all state locally. Handles stat allocation, perk selection with filtering & validation, image upload via Cloudflare direct upload, and changelog. Submits via native `<form>` with JSON-serialized hidden fields. |
| **CharacterSheetViewer** | Read-only character display. Shows description, base/effective stats, encumbrance (with interactive weight input), perks grouped by category.                                                                                                    |
| **AdminPanel**           | Admin dashboard with character search, admin user CRUD. Uses `@preact/signals` and `fetch()` for all interactions.                                                                                                                               |
| **BattlerHub**           | Create/open multiplayer battles, list yours, link to local sandbox.                                                                                                                                                                              |
| **HexGridBattler**       | Hex map VTT: local sandbox or online room (poll + turn drafts). Public UUID links are viewable without login.                                                                                                                                    |

---

## Hex Battler (multiplayer)

- **Public capability URL:** `/battler/{uuid}` — anyone with the link can **spectate**
  (full board; good-faith trust model, no fog of war). Create/join/play requires Discord login.
- **Persistence:** `battles` table (`lib/battles.ts`, `lib/db/schema.ts`).
- **Turns:** players array is turn order; only the active player may edit a **local draft**;
  **End Turn** commits state + advances; owner **Force End Turn** advances without applying draft.
- **APIs:** `GET/POST /api/battler/battles`, `GET /api/battler/battles/:id` (public),
  `.../join`, `.../lobby`, `.../start`, `.../end-turn`, `.../force-end-turn`, `.../end`.
- **Local sandbox:** `/battler/local` (localStorage only).

---

## Shared Components (Server-Rendered)

| Component               | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| **CharacterPageLayout** | Page wrapper with title, back-link, gradient background  |
| **OtherStatsSection**   | Derived stats display (Health, Carry/Organ Capacity)     |
| **EncumbranceSection**  | Carried-weight input + encumbrance level/penalty display |
| **Button**              | Generic styled button                                    |

---

## Key Architectural Patterns

1. **Islands Architecture** — Only `islands/` components hydrate on the client.
   Everything else is SSR-only, minimizing client-side JavaScript.

2. **Form-Based Mutations** — Character create/edit use native
   `<form method="POST">` with server-side handlers. Complex state (base stats,
   description, perk IDs) is JSON-serialized into hidden `<input>` fields.

3. **Snapshot Versioning** — Every character save creates an immutable
   `CharacterSnapshot`. Characters track a `latestSnapshotId`. Old snapshots can
   be viewed and restored (which creates a new snapshot based on the old one).

4. **Derived Stat Computation** — Effective stats are always computed on the fly
   from base stats + perk modifiers, never stored. Individual calculator
   functions per stat make the system easy to extend.

5. **Middleware Auth** — Session resolution runs once in `main.ts` middleware,
   populating typed state (`user`, `isAdmin`) for all downstream routes.

6. **Delegated Image Upload** — Images upload directly from the browser to
   Cloudflare via Direct Creator Upload URLs, keeping image bytes off the app
   server.
