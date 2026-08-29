# 08: Projected balance timeline

**What to build:** A forward projection of an account's balance so the user can
spot a future shortfall before it happens.

**Blocked by:** 01

**Status:** ready-for-agent

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

- [ ] Pure `projectBalance` with tests: starts at current balance, applies overlapping recurring rules, horizon crossing a month boundary, marks negative days, empty-input case
- [ ] "Projected" mode on the account-detail balance chart with a dashed forward line
- [ ] 30/60/90 horizon control
- [ ] Negative-day markers + "projected low" caption
- [ ] Section added to the Cash-flow screen
- [ ] Empty-state copy when there is nothing to project
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types`, `pnpm test` pass
