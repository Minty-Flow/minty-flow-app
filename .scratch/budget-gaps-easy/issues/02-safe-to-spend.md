# 02: Safe-to-spend number on Home

**What to build:** A single "safe to spend" figure at the top of the Home
screen so the user can decide whether to buy something without doing math.
Tapping it opens a breakdown of how it was derived. A preference screen tunes
cadence, which accounts count, and whether goal contributions are subtracted.

**Blocked by:** 01

**Status:** ready-for-agent

## Behaviour

- Figure = `expectedIncome(period) − committedBills(remaining) −
  plannedGoalContributions(remaining) − spent(period)`, divided by
  `remainingUnits(period, now, cadence)`.
- "expectedIncome" and "committedBills" come from recurring-transaction
  templates already stored; "spent" uses the shared exclusion predicate from
  ticket 01.
- Recomputes on any transaction change (live query) and on the day/week
  boundary (existing time-reactivity hook) — never cached across midnight.
- Negative result renders an explicit "over by X" state.
- New preference store (Zustand + MMKV): `cadence` (`daily | weekly`),
  `includedAccountIds`, `includeGoalContributions`.

## UX notes

- Placement: full-width, at the very top of Home, **above** the income/expense
  summary cards. It is the answer; those cards are the detail. Distinct visual
  treatment from the two-up row.
- Face shows only: the number (via `<Money>`, so masking is automatic), a
  caption ("safe to spend today" / "…this week"), and one thin secondary line
  ("N days left"). No math on the face.
- Negative state: expense colour + "over by X" caption. Calm, not a red alarm —
  match the app's restrained tone.
- Tap → bottom sheet: one row per term (+income, −bills, −goals, −spent, =
  subtotal, ÷ N days), each via `<Money>`, plus a link to the preference
  screen.
- Zero/empty: if no included account or no income data, show a one-line hint
  ("Add a recurring income to see this") linking to setup — not a misleading 0.
- This number, the debt-free date (07) and the projected low (08) should share
  one "headline figure" component. Build it here.
- Strings in `en.json` + `ar.json`; verify RTL.

## Acceptance criteria

- [ ] `safe-to-spend` service module exposing a pure `computeSafeToSpend(...)` (no React, no DB handle) that correctly handles period boundaries, zero remaining days, negative result, multi-currency, goals on/off
- [ ] Headline-figure component created and used on Home
- [ ] Tap opens a breakdown sheet listing every term
- [ ] Preference screen under `settings/preferences/` with cadence / included accounts / include-goals; reachable from the sheet
- [ ] Updates immediately after adding a transaction; recomputes on the day boundary
- [ ] Respects privacy masking; all money via `<Money>`
- [ ] Zero-state hint shown when there is no usable data
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types` pass
- [ ] Manual QA section added to `QA.md`

## Manual QA (dev build)

- Fresh account with one recurring income + a few expenses → number ≈ (income − bills − spent) ÷ days left; matches the breakdown sheet sum.
- Add an expense → number drops immediately.
- Overspend the period → "over by X" state, expense colour.
- Toggle cadence daily↔weekly in prefs → caption + divisor change.
- Exclude the only included account → zero-state hint, not "0".
- Privacy mask on → number hidden.
- Switch app language to Arabic → layout mirrors, strings translated.
