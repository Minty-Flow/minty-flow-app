# Phase 5: Writes And Transactions

## Goal

Move service writes from raw SQL to Drizzle while preserving transaction
atomicity, balance correctness, and import/export safety.

## Write Rules

- Keep all writes in service functions; do not write directly from screens.
- Keep `runInTransaction` semantics or replace it with one Drizzle transaction wrapper that still serializes writes.
- Keep one global write queue while Expo SQLite allows only one writer.
- Preserve integer minor-unit money checks through `src/utils/money.ts`.
- Preserve `getBalanceDelta` behavior.
- Preserve logger usage; no `console.*`.

## Transfer Writes

Transfer writes are non-negotiable:

- Create writes two `transactions` rows and one `transfers` row atomically.
- Delete/restore/destroy apply to both transfer legs.
- Balance updates cover both accounts.
- Cross-currency conversion remains in minor units.

## Service Cutover Order

1. Tags and categories.
2. Accounts.
3. Budgets, goals, loans and their join tables.
4. Transactions.
5. Transfers.
6. Recurring transactions.
7. Data management import/export/recovery.
8. Stats services.

## Event Removal

During mixed mode, keep emitting existing dirty events for screens not yet
migrated. Once every read for a domain uses `useLiveQuery`, delete that domain's
dirty events and Zustand DB store.

Do not remove `db:reset` until import/recovery is fully Drizzle-aware.

## Import And Recovery

Import/export must remain raw-SQL-compatible until the final data-management
cutover. The import flow can use Drizzle transactions only after backup restore,
snapshot recovery, and attachment staging are verified.

## Acceptance Criteria

- Create/edit/delete/restore/destroy flows update all migrated screens through `useLiveQuery`.
- Transfers remain balanced and atomic.
- Import failure recovery still restores previous data.
- `pnpm check-number-formatting` passes.
- `pnpm types` passes.

