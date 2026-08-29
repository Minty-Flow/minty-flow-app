# 07: Debt payoff planner core

**What to build:** A what-if tool: the user enters an extra monthly payment
and sees when their borrowed loans are paid off, and how much interest
snowball vs avalanche costs. Numbers only in this ticket; the chart is ticket
09.

**Blocked by:** 01

**Status:** resolved

Verified on emulator: route renders, EmptyState "No borrowed loans to plan",
"Plan" entry point correctly hidden on the loans list (only a LENT loan
present). Pure `debtPayoff` verified with a standalone node script. The
with-data flow (editor, headline, interest rows, toggle, persistence) needs a
borrowed loan — handed to the user as a text QA script.

## Progress

- Pure `src/utils/debt-payoff.ts` — `debtPayoff({ loans, extraPerMonthMinor,
  strategy, now? })` → `{ schedule, monthsToPayoff, payoffDate,
  totalInterestMinor, hasRates }`. Monthly simulation: accrue interest, pay
  each loan's minimum, funnel the rest (extra + freed minimums) to the
  snowball (asc balance) / avalanche (desc APR) target, deterministic id
  tie-break. `payoffDate` is null when payments can't dent the balance; 0%
  APR → linear; nothing owed → `now`, 0 months. Verified with a standalone
  node script (avalanche interest ≤ snowball, 0% = 12 months on a 120000/10000
  case, stuck → null, single-loan snowball == avalanche, tie-break stable).
- `src/stores/debt-payoff.store.ts` — Zustand + MMKV (`debt-payoff-storage`):
  `byLoanId: { aprPercent, minPaymentMinor }`, `extraPerMonthMinor`,
  `strategy`. Nothing writes to the `loans` table.
- `src/app/settings/loans/payoff.tsx` (route `settings/loans/payoff`): per-loan
  mini-editor (name, outstanding `Money`, APR `Input`, min/month
  `SmartAmountInput`), one `SmartAmountInput` "extra per month", a
  snowball/avalanche chip toggle (hidden for a single loan), a headline
  debt-free month, and a two-row snowball/avalanche interest comparison.
  "Add APRs for interest estimates" `InfoBanner` when no rates are set.
  Outstanding balance reuses `getLiveLoanProgress` + `getLoanProgressModel`.
- Loans list header: a "Plan" button (text, `router.push` to the payoff
  route), shown only when a borrowed loan exists.
- Route registered in `_layout.tsx`; en + ar strings.

## Post-review follow-ups (verified on emulator)

- Reshaped the per-loan editor: APR and Min/month stack full-width instead of
  two cramped half-columns.
- Header info button opens a **sectioned** help modal — "What it is for",
  "How to use it", and a glossary (APR, minimum payment, snowball, avalanche)
  — not the earlier single paragraph.
- "Reset planner" button → `ConfirmModal` → `useDebtPayoffStore.reset()` wipes
  every planner input back to defaults (loans untouched). Rows keyed by a
  reset nonce so their local APR buffers re-seed.
- Unrelated fix in `settings/loans/[loanId]/index.tsx`: it queried
  `useTransactions({})` while the loan row loaded, briefly showing every
  transaction and a wrong "received" figure. Now always filters by `loanId`
  and shows the spinner until the transaction query is `ready`.

## Deviations

- Multi-currency: the projection sums balances so it runs in one currency —
  the one most borrowed loans share. Loans in other currencies are listed as
  "N not included" rather than converted at a guessed rate (offline-safe,
  same call as safe-to-spend). One extra-payment input, one toggle.
- "Shared headline-figure component from ticket 02" does not exist (ticket 02
  shipped its own card layout). The debt-free month is a plain headline block
  here; extract a shared component only if a third caller appears.

## Behaviour

- Pure `debtPayoff({ loans, extraPerMonth, strategy }) -> { schedule:
  Array<{ month, totalBalance, interestPaid }>, payoffDate, totalInterest }`.
- `strategy`: `snowball` (ascending balance) or `avalanche` (descending APR).
- Outstanding balance per loan = principal − payments so far (reuse
  `loan-service` payment aggregation). Loans store no APR or minimum payment,
  so those are **planner-local inputs**, persisted in a small Zustand+MMKV
  store keyed by loan id — never written to the loan row.
- Missing/zero APR → linear payoff, with a surfaced "add rates for interest
  estimates" note.

## UX notes

- Entry point: a button / `ActionItem` ("Payoff plan") in the Loans list
  header → dedicated route `settings/loans/payoff`. Not rendered inline on the
  list (keeps the common case — just viewing loans — uncluttered).
- Screen: a per-loan mini-editor (name, outstanding balance prefilled, APR %
  and min/month editable) with the one-liner "Rates are only used here for the
  projection." Then one `SmartAmountInput` ("extra per month"), a
  snowball/avalanche segmented toggle, and the results: a headline debt-free
  date (the shared headline-figure component from ticket 02) and a two-row
  "Interest paid — snowball X / avalanche Y" so the comparison is visible
  without flipping the toggle.
- Single borrowed loan → hide the strategy toggle (snowball == avalanche).
- No borrowed loans → the entry point is not shown at all.
- Strings in `en.json` + `ar.json`; verify RTL.

## Acceptance criteria

- [x] Pure `debtPayoff({loans, extraPerMonth, strategy})` (no React, no DB): correct snowball vs avalanche ordering, 0% APR linear payoff, extra=0, single loan, payoff month boundary, total-interest comparison
- [x] Planner-local APR / min-payment store keyed by loan id; nothing written to `loans`
- [x] `settings/loans/payoff` route with mini-editor + extra-payment input + strategy toggle
- [x] Headline debt-free date + snowball/avalanche interest summary
- [x] Entry point in the loans list header, hidden when there are no borrowed loans; strategy toggle hidden for a single loan
- [x] en + ar strings; RTL checked
- [x] `pnpm lint`, `pnpm types` pass
- [x] Manual QA section added to `QA.md`

## Manual QA (dev build)

- No borrowed loans → no "Payoff plan" entry point.
- Two borrowed loans, enter APRs + an extra/month → debt-free date and per-strategy interest appear; avalanche interest ≤ snowball.
- Toggle snowball/avalanche → debt-free date updates.
- Set all APRs to 0 → still resolves to a date; "add rates for interest estimates" note shown.
- Record a repayment against one loan, reopen the planner → outstanding balance and date reflect it.
- Single borrowed loan → strategy toggle hidden.
- Reopen the app → planner-local APR/min values persist; loan rows unchanged.
- Arabic → mirrored, translated.
