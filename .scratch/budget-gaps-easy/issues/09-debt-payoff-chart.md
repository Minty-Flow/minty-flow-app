# 09: Debt payoff chart

**What to build:** Add the total-debt-over-time chart to the payoff planner so
progress under the chosen strategy is visual, not just a date.

**Blocked by:** 07

**Status:** ready-for-agent

## Behaviour

- Renders the `schedule` array already produced by `debtPayoff` (ticket 07) as
  a line of total balance descending to zero at the payoff date.

## UX notes

- Sits below the headline debt-free date on `settings/loans/payoff`.
- Styled like the other `victory-native` charts in the app (`useChartFont`,
  same axis/grid treatment).
- Updates live as the extra-payment input or strategy toggle changes.
- Optionally overlay both strategies as two lines so the comparison is visual —
  only if it stays readable; otherwise just the selected strategy.
- Strings in `en.json` + `ar.json`; verify RTL (axis direction).

## Acceptance criteria

- [ ] Total-debt line chart on the payoff screen, fed by the ticket-07 schedule
- [ ] Re-renders when extra-payment or strategy changes
- [ ] Matches existing chart styling
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types` pass
