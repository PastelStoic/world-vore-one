# Copilot instructions for world-vore-one

## Project overview
- This repository is a **Deno + Fresh v2** web app with **Preact islands** and Tailwind CSS.
- Main entry points are `main.ts`, `routes/`, `islands/`, and `lib/`.
- Use TypeScript and existing path imports (`@/`) from `deno.json`.

## How to make changes
- Keep changes small and focused on the requested task.
- Reuse existing utilities and patterns in `lib/`, `components/`, and `routes/`.
- Do not introduce new frameworks or large structural refactors unless explicitly requested.
- If dependencies change, update both `deno.json` and `deno.lock`.

## Validation commands
- Run formatting, linting, and type checks:
  - `deno task check`
- Run production build:
  - `deno task build`

## Fresh app conventions
- Use route handlers and page components in `routes/`.
- Put interactive client logic in `islands/`.
- Keep business logic and parsing in `lib/`.
- Prefer existing component composition patterns in `components/`.

## Security and safety
- Preserve server-side validation for form/API inputs.
- Do not commit secrets or `.env` values.
- Keep auth/admin flows in `lib/auth.ts`, `lib/admin.ts`, and `routes/api/admin/*` consistent with existing access checks.
