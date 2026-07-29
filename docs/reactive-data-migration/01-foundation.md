# Phase 1: Foundation

## Goal

Install and configure Drizzle without changing app behavior. Existing raw SQL
repos, services, migrations, and Zustand DB stores stay active during this phase.

## Dependencies

Add runtime packages:

```bash
pnpm add drizzle-orm babel-plugin-inline-import
```

Add dev packages:

```bash
pnpm add -D drizzle-kit expo-drizzle-studio-plugin
```

Do not reinstall `expo-sqlite`; the app already uses `expo-sqlite ~57.0.1`.

## Config Changes

Update `babel.config.js`:

- Keep existing `react-native-worklets` and `react-native-unistyles` plugins.
- Add `["inline-import", { extensions: [".sql"] }]`.
- Preserve existing plugin order unless a local build proves order-sensitive.

Update or create `metro.config.js`:

- Ensure default Expo Metro config is still used.
- Add `"sql"` to `config.resolver.sourceExts`.

Add `drizzle.config.ts` at repo root:

- `schema: "./src/database/drizzle/schema.ts"`
- `out: "./drizzle"`
- `dialect: "sqlite"`
- `driver: "expo"`

## DB Wrapper

Add `src/database/drizzle/db.ts`:

- Import `drizzle` from `drizzle-orm/expo-sqlite`.
- Reuse the existing SQLite singleton from `src/database/db.ts`.
- Export `drizzleDb = drizzle(getDb(), { schema })`.
- Do not create a second SQLite connection.

Update `src/database/db.ts` later in this phase:

- Open with `SQLite.openDatabaseSync("minty_flow_db_v2", { enableChangeListener: true })`.
- Keep current pragmas: `journal_mode=WAL`, `foreign_keys=ON`, `busy_timeout=5000`.
- Keep `runSqliteMigrationsSync(db)` until the migration-adoption phase replaces it.

## Acceptance Criteria

- App boots with no behavior change.
- Current raw SQL reads and writes still work.
- `pnpm types` passes.
- `pnpm exec biome check` passes for changed files.

