# Phase 2: Schema Baseline

## Goal

Create Drizzle schema files that exactly describe the current SQLite v3 schema.
This phase should not change runtime behavior.

## Files

Create `src/database/drizzle/schema.ts` as the public schema barrel.

Use small table modules only if the single file becomes hard to review:

- `accounts`
- `categories`
- `transactions`
- `tags`
- `transactionTags`
- `transfers`
- `goals`
- `goalAccounts`
- `loans`
- `recurringTransactions`
- `budgets`
- `budgetAccounts`
- `budgetCategories`

## Mapping Rules

- Match table names exactly.
- Match column names exactly, including snake_case.
- Keep text enum checks from v3 as Drizzle `check(...)` constraints.
- Keep integer money columns as `integer(...)`, never `real(...)`.
- Keep boolean-like columns as integer `0 | 1` values.
- Keep current foreign key actions:
  - `transactions.account_id` restricts account delete.
  - nullable links use `ON DELETE SET NULL` where v3 does.
  - join rows use cascade where v3 does.
- Keep all indexes from `SQLITE_V3_SQL`.
- Keep the unique partial index for one primary account.

## Schema Source Of Truth

Use `src/database/migrations/sqlite-v3.ts` as the exact baseline. Compare the
generated Drizzle SQL against `SQLITE_V3_SQL`; do not infer from TypeScript
domain types where they differ from database rows.

## Acceptance Criteria

- `npx drizzle-kit generate` produces a baseline SQL migration whose tables and indexes match SQLite v3.
- Generated SQL uses integer money columns and preserves checks.
- `pnpm types` passes.
- No app screen or service is changed in this phase.

