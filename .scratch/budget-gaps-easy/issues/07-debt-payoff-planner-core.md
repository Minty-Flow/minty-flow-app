# 07: Debt payoff planner core

**What to build:** A what-if tool: the user enters an extra monthly payment
and sees when their borrowed loans are paid off, and how much interest
snowball vs avalanche costs. Numbers only in this ticket; the chart is ticket
09.

**Blocked by:** 01

**Status:** ready-for-agent

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

- [ ] Pure `debtPayoff` with tests: snowball vs avalanche ordering, 0% APR linear payoff, extra=0, single loan, payoff month boundary, total-interest comparison
- [ ] Planner-local APR / min-payment store keyed by loan id; nothing written to `loans`
- [ ] `settings/loans/payoff` route with mini-editor + extra-payment input + strategy toggle
- [ ] Headline debt-free date + snowball/avalanche interest summary
- [ ] Entry point in the loans list header, hidden when there are no borrowed loans; strategy toggle hidden for a single loan
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types`, `pnpm test` pass
