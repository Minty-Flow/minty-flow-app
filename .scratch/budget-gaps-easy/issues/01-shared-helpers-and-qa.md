# 01: Shared helpers + QA convention (prefactor)

**What to build:** Confirm the shared building blocks the rest of the tier
reuses, and set up a lightweight manual-QA convention. No automated test
framework (declined). No user-facing change.

**Blocked by:** None. Advisory-first, but does not hard-gate the other
tickets — they can start in parallel.

**Status:** resolved

## Shared helpers (already in the codebase — reuse, do not re-implement)

- `src/utils/planning-progress.ts` — `getBudgetPeriodBounds(period, start,
  end, now)`, `getBudgetPeriodKey(budget, now)`, `getBudgetProgressModel`.
- `src/utils/live-progress.ts` — `getLiveBudgetSpent(budget, txns)` (the
  transfer / pending / income / currency / category exclusion predicate,
  already pure), `getLiveGoalProgress`, `getLiveLoanProgress`.
- `src/utils/time-utils.ts` — locale / week-start-aware date ops.
- `src/utils/money.ts` — minor/major, currency exponent, FX. All money math
  goes through it.
- Existing recurrence utilities for next-occurrence dates.

New calc for this tier (`computeSafeToSpend`, `debtPayoff`, `projectBalance`,
the subscriptions selector, `applyRules`) must be written as **pure functions**
in the util/service layer — no React, no direct DB handle — so they can be
exercised by hand and are easy to reason about. This is a structural
requirement even without a test runner.

## QA convention

- Each feature ticket lists a **Manual QA** section: concrete steps and the
  expected result, runnable on a dev build.
- Keep a running `.scratch/budget-gaps-easy/QA.md` — one checklist section per
  ticket, ticked when verified on device.

## Acceptance criteria

- [x] `.scratch/budget-gaps-easy/QA.md` created with a section per ticket 02–09
- [x] Shared-helper list documented here and linked from the spec
- [x] No new dependencies

## Answer

Test framework declined. `QA.md` holds the per-feature manual checklists.
Shared helpers to reuse: `src/utils/planning-progress.ts`,
`src/utils/live-progress.ts`, `src/utils/time-utils.ts`, `src/utils/money.ts`,
existing recurrence utilities. New tier calc must be pure functions (no React,
no DB handle). No `.gitignore` / dependency changes landed.
