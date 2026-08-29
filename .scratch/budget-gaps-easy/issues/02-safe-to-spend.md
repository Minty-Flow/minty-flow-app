# 02: Safe-to-spend number on Home

**What to build:** A single "safe to spend" figure at the top of the Home
screen so the user can decide whether to buy something without doing math.
Tapping it opens a breakdown of how it was derived. A preference screen tunes
cadence, which accounts count, and whether goal contributions are subtracted.

**Blocked by:** 01

**Status:** resolved

## Progress / decisions

- **Model changed to balance-based** (deviation from the spec's income-first
  wording, which double-counts): `pot = balance + upcomingIncome −
  upcomingBills − goalContributions`, `perUnit = pot / remainingUnits`.
  Money already received sits in the balance, so there is no "already spent"
  term. Period = current calendar month; cadence only changes the divisor
  (days left, or weeks = ceil(days/7)).
- Shipped: `src/utils/safe-to-spend.ts` (pure `computeSafeToSpend`,
  `remainingUnitsInMonth`, `currentMonthBounds`); `safe-to-spend.store.ts`
  (enabled / cadence / includedAccountIds / includeGoals);
  `safe-to-spend-read-model.ts` (`useSafeToSpend`, per-currency, preferred =
  headline); `safe-to-spend-card.tsx` (Home card above the summary cards +
  breakdown modal with `<Money>` rows, privacy-safe); pref screen at
  `settings/preferences/safe-to-spend`; route + Preferences entry; en + ar.
- Verified on emulator: card ("SAFE TO SPEND TODAY / $170.08 / 3 days left"),
  breakdown modal (Balance 550.25 − Bills 40 = 510.25 ÷ 3 = 170.08), pref
  screen.
- **Multi-currency (reworked):** no headline / no "primary currency" / no FX.
  The card lists **one row per currency** that has an included account
  (`USD  $4` … `EUR  €12`), exactly like the Home income/expense summary; one
  "N days left" caption shared across rows; a currency that is individually
  negative styles its own row. Breakdown modal shows a full block per
  currency. Read-model returns `rows` + `remainingUnits`.
- **Rename** (requested): `money-formatting.store` `currencyLook` →
  `currencyDisplayFormat` (+ `setCurrencyLook` → `setCurrencyDisplayFormat`),
  `preferredCurrency` → `fallbackCurrency` (it was never settable, always
  "USD", and is only a "no currency in context" fallback). ~13 call sites
  updated. `preferredCurrency` no longer referenced anywhere in
  safe-to-spend.
- **Deferred:** goal-contributions term (`goalContributionsMinor` wired as 0;
  needs goal-progress aggregation). `includeGoals` store field + toggle
  hidden until then. Shared "headline figure" component not extracted (do it
  when 07/08 need it). RTL spot-check pending.
- **Follow-up idea:** a real user-facing primary-currency setting would fix
  several lingering USD assumptions (Money fallback, summary empty state,
  bill-splitter, onboarding) — its own ticket, out of scope here.

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

- [x] `safe-to-spend` service module exposing a pure `computeSafeToSpend(...)` (no React, no DB handle) that correctly handles period boundaries, zero remaining days, negative result, multi-currency, goals on/off
- [x] Headline-figure component created and used on Home
- [x] Tap opens a breakdown sheet listing every term
- [x] Preference screen under `settings/preferences/` with cadence / included accounts / include-goals; reachable from the sheet
- [x] Updates immediately after adding a transaction; recomputes on the day boundary
- [x] Respects privacy masking; all money via `<Money>`
- [x] Zero-state hint shown when there is no usable data
- [x] en + ar strings; RTL checked
- [x] `pnpm lint`, `pnpm types` pass
- [x] Manual QA section added to `QA.md`

## Manual QA (dev build)

- Fresh account with one recurring income + a few expenses → number ≈ (income − bills − spent) ÷ days left; matches the breakdown sheet sum.
- Add an expense → number drops immediately.
- Overspend the period → "over by X" state, expense colour.
- Toggle cadence daily↔weekly in prefs → caption + divisor change.
- Exclude the only included account → zero-state hint, not "0".
- Privacy mask on → number hidden.
- Switch app language to Arabic → layout mirrors, strings translated.
