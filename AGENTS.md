# Repository Guidelines

## Project Structure & Module Organization
- `src/app` — Next.js App Router pages and API routes (`/`, `/new`, `/list`, `app/api`).
- `src/lib` — reusable utilities (e.g., PDF fuel parsing in `fuel.ts`).
- `src/types` — domain models and disk I/O for `data/flights.json`.
- `src/scripts` — CLI entry (`my-cli.ts`).
- `public` — static assets. `data/` — local persisted data (git-ignored).

## Build, Test, and Development Commands
- `npm run dev` — start Next.js with Turbopack at `http://localhost:3000`.
- `npm run build` — production build.
- `npm start` — run the built app.
- `npm run lint` — run ESLint using `eslint-config-next`.
- `npm run cli -- hello Alice` — run the CLI example; `npm run cli -- run` executes PDF extraction.

## Coding Style & Naming Conventions
- Language: TypeScript (ES modules). TS `strict` is enabled; prefer explicit types on public APIs.
- Indentation: 2 spaces; keep lines concise and self-documenting.
- Components: default-export page/layout components; use named exports elsewhere.
- Imports: use `@/` alias for `src` (see `tsconfig.json`).
- Linting: fix issues before pushing (`npm run lint`). No Prettier in this repo.

## Testing Guidelines
- No automated tests are set up yet. When adding tests:
  - Unit: place in `src/**/__tests__` or alongside code as `*.test.ts(x)`.
  - E2E: prefer Playwright under `e2e/` with clear fixtures.
  - Aim for meaningful coverage of parsing, types, and route handlers.

## Commit & Pull Request Guidelines
- Commits: short, imperative subject; optionally prefix with scope tag (e.g., `[Pdf]`, `[Prototype]`). Group related changes.
- PRs: include a concise description, linked issues, steps to verify (commands + URLs), and screenshots/GIFs for UI changes. Update docs when commands, structures, or data formats change.

## Security & Configuration Tips
- Do not commit `data/` contents; they are ignored by Git. Treat PDFs and flight data as sensitive.
- If introducing env vars: keep secrets in `.env` (ignored). Client-side vars must be prefixed `NEXT_PUBLIC_`.
- Prefer filesystem-safe operations in `src/types` I/O and validate user inputs in API routes.

