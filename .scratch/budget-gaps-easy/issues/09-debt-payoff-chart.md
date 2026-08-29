# 09: Debt payoff chart

**What to build:** Add the total-debt-over-time chart to the payoff planner so
progress under the chosen strategy is visual, not just a date.

**Blocked by:** 07

**Status:** resolved

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

- [x] Total-debt line chart on the payoff screen, fed by the ticket-07 schedule
- [x] Re-renders when extra-payment or strategy changes (schedule is a render-time prop)
- [x] Matches existing chart styling (`PayoffChart` mirrors `net-worth-chart`)
- [x] en + ar strings; RTL checked (matches net-worth chart behaviour)
- [x] `pnpm lint`, `pnpm types` pass
- [x] Manual QA section added to `QA.md`

## Progress

- `src/components/loans/payoff-chart.tsx` — `PayoffChart` renders `active.schedule`
  from `debtPayoff` plus a month-0 point (total owed now) as a descending line.
- Wired into `src/app/settings/loans/payoff.tsx` between the debt-free headline
  and the interest block.
- New i18n keys: `screens.settings.loans.payoff.chartTitle`, `.chartMonthLabel`.

## Deviations

- Selected strategy only — no dual snowball/avalanche overlay. The per-strategy
  interest totals already sit right below; two lines added clutter without much
  gain (spec called the overlay optional).

## Manual QA (dev build)

- Chart descends to zero at the debt-free date shown above it.
- Change extra/month → curve steepens, endpoint moves.
- Switch strategy → curve updates.
- Arabic → axis direction mirrored.
