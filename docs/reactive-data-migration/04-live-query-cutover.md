# Phase 4: Live Query Cutover

## Goal

Replace Zustand DB caches with `useLiveQuery` reads. Zustand remains for UI and
MMKV-backed preferences only.

## Cutover Order

Use low-risk stores first, then transaction-heavy screens.

1. Tags: replace `useTags`, `useTag` reads.
2. Categories: replace category reads, then transaction-count derived reads.
3. Accounts: replace account list/detail reads.
4. Budgets, goals, loans: replace base reads and join-table hydration.
5. Transactions: replace `useTransactions` and related detail reload effects.
6. Stats and recurring-derived screens: replace manual `transactions:dirty` subscriptions.

## Hook Shape

Create hooks in `src/database/drizzle/hooks/`:

- `useAccountsQuery()`
- `useCategoriesQuery(type?)`
- `useTagsQuery()`
- `useBudgetsQuery()`
- `useGoalsQuery()`
- `useLoansQuery()`
- `useTransactionsQuery(filters)`

Each hook should:

- Call `useLiveQuery` with a Drizzle query.
- Return `{ data, status, error }` or the closest existing shape needed by current screens.
- Map database rows to existing domain types at the hook boundary.
- Preserve existing sort order.

## Transactions Query

`useTransactionsQuery(filters)` must preserve current filter behavior:

- Date range comes from DB query.
- Deleted and pending filters stay DB-level.
- Structural filters can move to SQL incrementally.
- Transfer relation hydration must include accounts, categories, tags, and transfer metadata.
- Combined/separate transfer display stays a UI preference and remains outside DB writes.

## Removal Rule

After a screen uses `useLiveQuery`, remove its local `on("transactions:dirty")`
or store refresh subscription in the same PR. Do not leave duplicate reactivity.

## Acceptance Criteria

- The migrated screen updates after writes without custom dirty events.
- Empty, loading, and error states still render.
- Existing filter/search/grouping behavior stays unchanged.
- `pnpm types` passes after each screen batch.

