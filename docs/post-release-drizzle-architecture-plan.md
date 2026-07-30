# Post-Release Drizzle Architecture Plan

> Deferred until the current Drizzle migration release has shipped and been
> validated. Do not combine these changes with the release migration.

## Intent

Preserve the existing migration behavior:

- Fresh users start directly on Drizzle.
- Legacy Expo SQLite users receive a verified backup before any mutation.
- Legacy data is rebuilt atomically into the Drizzle schema without losing rows.
- Existing Drizzle users continue normally.
- Any failure rolls back and leaves the legacy database available for retry.

Deliver the architecture work in separate, reviewable changes after release.
Do not add adapter interfaces, dependencies, or speculative abstractions.

## 1. Migration Bootstrap

- Replace the migration state store and duplicated layout orchestration with one
  release-only `prepareDatabaseForDrizzle(migrations)` function.
- Keep only local UI states in `_layout.tsx`: preparing, ready, and failed.
- Preserve the friendly success alert and use English and Arabic user-friendly
  preparation, failure, and retry text. Keep technical errors in the logger.
- Handle database states as follows:
  - `fresh`: pass directly to Drizzle's bundled migrator.
  - `drizzle`: no-op, then let the migrator check future migrations.
  - `legacy`: backup, rebuild, validate, stamp, and reopen the Drizzle connection.
  - Incomplete or invalid: mutate nothing and show retry UI.
- Before mutation, create the native SQLite backup and verify it with
  `PRAGMA quick_check` and per-table row-count comparisons.
- Keep the rebuild inside one `BEGIN IMMEDIATE` transaction with foreign keys
  disabled only around that transaction.
- Rebuild from the bundled Drizzle SQL, normalize legacy `loan_type`, copy every
  table, and verify:
  - Every destination table has exactly the source row count.
  - `PRAGMA foreign_key_check` returns no violations.
  - All required tables, columns, and indexes exist.
- Seed `__drizzle_migrations` using bundled journal timestamps and the empty
  hashes expected by the Expo migrator.
- Commit only after every check passes. On failure, roll back, re-enable foreign
  keys, retain the backup, and leave the database classified as legacy.
- Keep one `TODO(remove-after-drizzle-rollout)` boundary around the compatibility
  module. Delete it only when direct upgrades from pre-Drizzle releases are no
  longer supported.
- Correct the contradictory loan foreign key: `loans.category_id` remains
  required and uses `ON DELETE RESTRICT`.

## 2. Backup Restore

- Move import selection, parsing, validation, staging, database replacement, and
  cleanup behind three plain functions:
  - `prepareBackupImport()`
  - `applyBackupImport(preparedImport)`
  - `discardBackupImport(preparedImport)`
- Keep export formats and existing backup compatibility unchanged.
- Validate backup shape, money values, and foreign keys before database mutation.
- Replace the two-transaction reset and insert flow with one transaction that
  clears and inserts all rows atomically.
- Verify imported row counts and foreign keys before commit. Any failure must
  roll back to the original data.
- Remove the SQLite snapshot recovery file, recovery hook, and restore
  choreography once the atomic transaction replaces them.
- Restore staged attachments only after the database commit and always clean the
  staging directory.

## 3. Ledger Reads

- Replace the broad public `useTransactions` API with intent-based entry points:
  - `useTransactionFeed(filters)` for lists.
  - `useTransactionDetail(id)` for the transaction route.
  - `getPendingTransactions()` for background services.
  - Budget, goal, and loan read models expose live progress totals in minor units.
- Keep generic condition building and transaction hydration private.
- Reuse `createLiveReadModelResult`; it already provides shared loading and error
  behavior.
- Keep stats queries in the existing stats read model.
- Remove full transaction hydration from each budget, goal, and loan card after
  their progress read models are available.

## 4. Theme Assembly

- Replace `ThemeFactory` with one pure `buildTheme(scheme)` function.
- Export theme groups, standalone themes, flattened themes, lookup, and
  Unistyles themes from the existing registry module.
- Delete `factory.ts`, `unistyles-themes.ts`, and commented dead helpers.
- Keep the existing registry import path to minimize caller churn.

## Verification

Run the project checks after each implementation change:

```bash
pnpm structure
pnpm lint:fix
pnpm check-number-formatting
pnpm types
pnpm check-i18n-keys
pnpm unused-styles
```

Use a native Android development build for the migration matrix:

- Fresh install with an empty database.
- Legacy database created on `dev`, then opened on the Drizzle branch.
- Legacy data covering all 13 tables, transfers, deleted and pending
  transactions, loans, goals, budgets, recurring transactions, tags, and
  attachments.
- Relaunch after migration; neither migration nor success alert repeats.
- Force-stop during backup and retry; legacy data remains intact.
- Invalid legacy data; migration rolls back and retains its backup.
- Existing Drizzle database; startup is a no-op.
- English and Arabic migration UI.

Also verify JSON and ZIP restore success, invalid backup rejection, rollback
after insertion failure, attachment restoration, transaction feeds, detail
screens, progress cards, stats screens, and every selectable theme.

## Assumptions

- Add no testing framework or dependency.
- Preserve the friendly migration alert copy currently in `_layout.tsx`.
- The current Drizzle baseline has not shipped, so correcting it does not require
  a production migration.
- Implement migration and backup changes before ledger and theme cleanup.
