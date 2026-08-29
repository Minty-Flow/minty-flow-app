# 01: Test seam + shared period/money helpers (prefactor)

**What to build:** A single place to unit-test database service logic, plus the
shared date/period helpers the rest of the tier depends on. No user-facing
change. Verifiable by running the test command and seeing one real service
test pass against a real (in-memory) schema.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

## Notes

- Test runner: `vitest`. Database under test: SQLite via `better-sqlite3` +
  `drizzle-orm/better-sqlite3`, schema/migrations applied from the existing
  `drizzle/` migration folder so tests exercise the real shape, not a
  hand-written copy.
- Provide a `makeTestDb()` helper: fresh in-memory DB, migrations applied,
  returns a drizzle client + seed helpers (account, category, transaction,
  budget, loan, recurring template).
- Extract shared helpers used by ≥2 later tickets into one module:
  - `periodBounds(period, now)` → `{ start, end }`
  - `remainingUnits(period, now, cadence)` → integer days/weeks left, min 1
  - re-use of the existing transfer/pending/deleted exclusion predicate for
    "spent" aggregation (lift it out of `budget-service` if it is inline).
- Add `pnpm test` / `pnpm test:watch` scripts. Keep Biome/tsc green on the new
  files. Do **not** wire tests into the pre-commit hook in this ticket.

## Acceptance criteria

- [ ] `pnpm test` runs `vitest` and exits non-zero on failure
- [ ] `makeTestDb()` returns a migrated in-memory DB with typed seed helpers
- [ ] One example test covers an existing pure aggregation (e.g. budget spent) and passes
- [ ] `periodBounds` / `remainingUnits` implemented with tests for month/week/custom boundaries and the "last day / zero remaining" edge
- [ ] The transfer/pending/deleted "spent" predicate is a single exported function reused by `budget-service`
- [ ] `pnpm lint` and `pnpm types` pass
