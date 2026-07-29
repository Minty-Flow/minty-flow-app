# Phase 3: Migration Adoption

## Goal

Let Drizzle own future migrations without breaking existing databases that are
already at `PRAGMA user_version = 3`.

## Strategy

Use a two-step adoption.

Step 1 ships Drizzle schema and wrapper while keeping the custom v3 migration
runner. This lets runtime Drizzle queries work before Drizzle owns migrations.

Step 2 adopts Drizzle migration tracking after schema parity is proven.

## Existing Database Adoption

Existing installs already have all v3 tables but do not have Drizzle's migration
journal. Do not run a generated baseline `CREATE TABLE` migration against those
databases.

Implement an adoption helper before calling Drizzle `useMigrations`:

- Read `PRAGMA user_version`.
- If `user_version` is `0`, let the current fresh-install path create v3 first.
- If `user_version` is `3` and Drizzle migration table is missing, create the Drizzle migration table and seed the baseline migration as already applied.
- If `user_version` is not `3`, keep the existing unsupported-version error.

Before writing the helper, inspect the installed `drizzle-orm` migrator table
shape in `node_modules` after dependency install. Use that exact table shape;
do not hard-code from memory.

## Fresh Installs

Until adoption is complete, fresh installs continue through `bootstrapSqliteV3`.
After adoption is complete, fresh installs may use Drizzle `useMigrations` only
if generated SQL creates a schema identical to v3.

## Startup Gate

Add a small `DatabaseReadyGate` near the root layout:

- Runs migration/adoption before rendering routes that query the DB.
- Shows existing app loading UI while migrations run.
- Shows a recoverable error screen if migration fails.
- Does not call `console.*`; use `src/utils/logger.ts`.

## Rollback And Safety

- Keep import/export restore working before this phase ships.
- Add a temporary manual QA step: export backup, install migration build, verify data, import backup into a clean install.
- Do not delete legacy migration files until at least one release after Drizzle migration adoption.

## Acceptance Criteria

- Existing v3 DB opens and gets a Drizzle migration journal without table recreation.
- Fresh install creates v3-equivalent schema.
- Failed migrations do not render normal app screens.
- `pnpm types` passes.

