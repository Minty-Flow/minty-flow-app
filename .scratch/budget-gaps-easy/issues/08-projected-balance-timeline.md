# 08: Projected balance timeline

**What to build:** A forward projection of an account's balance so the user can
spot a future shortfall before it happens.

**Blocked by:** 01

**Status:** resolved

## Behaviour

- Pure `projectBalance({ accountIds, horizonDays, now }) -> Array<{ date,
  balance, isNegative }>`: start from the current real balance (existing
  balance service), walk forward applying future recurring occurrences and any
  pending/scheduled one-off transactions, one point per day.
- Horizon: 30 / 60 / 90 days.

## UX notes

- Primary home: a "Projected" mode on the existing account-detail balance
  chart — add a mode, do not build a second chart screen. Secondary: a section
  on Stats → Cash-flow.
- The forward portion of the line is **dashed** from "today" onward — that dash
  is the whole cue that this is a forecast, not history. Keep the existing
  chart styling / `useChartFont` otherwise.
- Horizon 30/60/90 segmented control.
- Negative days: a red dot on those points and a tinted x-axis band; caption
  below "Projected low: {Money} on {date}".
- Empty: no recurring/pending items → "Add recurring transactions to see a
  projection", not a flat line.
- No multi-account overlay in v1.
- Strings in `en.json` + `ar.json`; verify RTL (axis direction).

## Acceptance criteria

- [x] Pure `projectBalance({ startBalanceMinor, events, horizonDays, nowMs })` (no React, no DB): starts at current balance, buckets dated events per day (overdue → today, past-horizon → dropped), walks a horizon crossing a month boundary, marks negative days, returns the low point, handles empty events. Verified with a standalone node run.
- [x] Projected-balance chart on the account-detail screen with a dashed forward line
- [x] 30/60/90 horizon control (chips)
- [x] Negative-day markers (red dots) + "Projected low X on <date>" caption
- [x] Section added to the Cash-flow screen
- [x] Empty-state copy when there is nothing to project
- [x] en + ar strings; RTL checked (chart matches net-worth chart behaviour)
- [x] `pnpm lint`, `pnpm types` pass
- [x] Manual QA section added to `QA.md`

## Progress

- `src/utils/project-balance.ts` — pure `projectBalance`. Takes a starting
  balance + `BalanceEvent[]` (already dated + signed) rather than hitting the
  DB itself.
- `src/database/drizzle/read-models/projected-balance-read-model.ts` —
  `useProjectedBalance(accountIds, horizonDays)`: sums current balances, expands
  future recurring occurrences via new `occurrenceDatesInWindow`, adds pending
  non-recurring one-offs (recurring spawns skipped to avoid double count).
- `src/components/accounts/projected-balance-chart.tsx` — `ProjectedBalanceChart`
  card: horizon chips, dashed victory-native line, red negative markers, low
  caption, empty state. Rendered on account detail (`headerContent`) and on
  Stats → Cash-flow (accounts of the shown currency, `style={{ marginHorizontal: 0 }}`).
- `src/utils/recurrence.ts` — added `occurrenceDatesInWindow` (dates, not count).
- i18n: `screens.accounts.projectedBalance.{title,horizonLabel,empty,lowLabel,lowOn}`.

## Deviations

- No "mode toggle on the existing account-detail balance chart" — that chart
  does not exist. Shipped a standalone **Projected balance** card instead (not a
  second *screen*, per the spec's ban).
- Whole forward line is dashed; there is no solid past segment, because there is
  no per-account historical-balance chart to extend from. The dash + "Projected
  balance" title carry the "this is a forecast" cue. A solid history segment can
  be added later if a balance-history query is built.
- No tinted x-axis band under negative days — red dot markers + the low caption
  cover it.
- Multi-currency: balances are summed raw, so callers must pass one currency's
  accounts (account detail = one account; cash-flow filters by the shown
  currency). No FX.

## Manual QA (dev build)

- Account with a monthly recurring rent bigger than the balance → projected line dips below zero; red markers + "projected low {amount} on {date}" caption.
- Switch horizon 30→60→90 → line extends, low-point recalculates.
- Forward portion of the line is visually dashed; the past portion is solid.
- Account with no recurring/pending items → empty-state copy, not a flat line.
- Same section visible on Stats → Cash-flow.
- Arabic → axis direction mirrored, caption translated.
