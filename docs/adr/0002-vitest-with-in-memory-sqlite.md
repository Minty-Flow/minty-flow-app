# 2. Vitest with an in-memory SQLite for data-layer tests

Date: 2026-10-13

## Status

Accepted

## Context

The project had no test framework. A code review found money and recurrence
bugs in the data layer (balance deltas, stats timeline, recurring sync) that
are cheap to pin with tests but slow to catch by running the app.

The services import `drizzleDb`, which opens `expo-sqlite`. That module does
not exist in Node. Options considered:

1. **`node --test`** — no dependency, but no `~/` alias resolution and no
   module mocking without extra loaders.
2. **Vitest + `better-sqlite3`** — real SQLite, but a native build that needs a
   `pnpm` build allowance and a prebuilt binary per CI runner.
3. **Vitest + `sql.js`** — SQLite compiled to WebAssembly. No native build.
   Synchronous like the app's driver, so Drizzle transactions behave the same.

## Decision

Use Vitest with `sql.js` (option 3). `createTestDb()` builds an in-memory
database and applies every migration in `drizzle/`. A test replaces
`~/database/drizzle/db` with it through `vi.mock`.

## Consequences

- `pnpm test` is part of `pnpm verify` and CI.
- Tests cover pure logic and services. UI is not tested.
- `sql.js` does not model `expo-sqlite` WAL, `busy_timeout` or the change
  listener, so write-queue retry and contention paths are not testable.
- Services that import native modules at load time (for example `expo-crypto`)
  need those modules mocked in the test.
