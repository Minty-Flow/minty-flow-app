# Reactive Data Migration Roadmap

## Goal

Move Minty Flow from raw `expo-sqlite` reads plus Zustand DB caches plus custom
`*:dirty` events to Drizzle ORM with `useLiveQuery`, while preserving existing
production data in `minty_flow_db_v2`.

This is a must-migrate path because current reactivity depends on every write
remembering the right event payload. Any missed event, narrow id payload, or
filter-boundary change can leave screens stale. `useLiveQuery` should make the
SQLite database the reactive source of truth.

## Current State

- SQLite opens in `src/database/db.ts` with `SQLite.openDatabaseSync("minty_flow_db_v2")`.
- Migrations are synchronous and custom in `src/database/migrations/sqlite-runner.ts`.
- Current schema is v3, declared in `src/database/migrations/sqlite-v3.ts`.
- DB reads go through repos, mappers, service helpers, and Zustand stores in `src/stores/db/`.
- DB reactivity is event-driven through `src/database/events.ts`.
- Money values are integer minor units and must stay integer minor units.
- Existing devices must keep their data. Fresh reset is not acceptable.

Do not inspect, change, or reference `src/components/icons` during this migration.

## Phases

1. Foundation: add Drizzle packages and create a Drizzle database wrapper beside the current DB singleton.
2. Schema baseline: define Drizzle schema that exactly matches SQLite v3.
3. Migration adoption: make Drizzle migration tracking coexist with current `PRAGMA user_version = 3`.
4. Read cutover: replace Zustand DB stores screen by screen with `useLiveQuery`.
5. Write cutover: move raw SQL service writes to Drizzle transactions.
6. Cleanup: remove dirty-event domain reactivity, stale repos, and obsolete store caches.

## Success Criteria

- All screens update after DB writes without manual `*:dirty` events.
- Existing v3 user databases open without destructive migration.
- Fresh installs create the same tables, indexes, checks, and foreign keys as v3.
- Transfers still write two transaction rows plus one transfer row atomically.
- Import/export and recovery flows remain data-safe.
- Existing pre-commit commands pass.

## Source References

- Expo SQLite docs: https://docs.expo.dev/versions/latest/sdk/sqlite/
- Drizzle Expo SQLite docs: https://orm.drizzle.team/docs/sqlite/connect-expo-sqlite
- Expo Drizzle Studio plugin: https://www.npmjs.com/package/expo-drizzle-studio-plugin

