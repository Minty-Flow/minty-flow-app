# 06: Budget pace alerts

**What to build:** A local notification when a budget is trending to blow its
limit before the period ends — plus the same message shown inside the app —
so the user can adjust in time instead of finding out after the fact.

**Blocked by:** 01

**Status:** in-progress

## Progress

- Pure calc `src/utils/pace-alert.ts` — `projectedSpendMinor`,
  `isOnPaceToExceed(input, sensitivity)` (false when already over, or on the
  last day), `paceOverageMinor`. No React, no DB.
- `src/utils/pace-alert-storage.ts` — MMKV: `alertedByBudget` (budgetId →
  periodKey, one notification per budget per period) + `disabledBudgetIds`
  (per-budget opt-out). No new `budgets` column, no migration.
- Globals in `notification.store.ts`: `isPaceAlertEnabled` (default true),
  `paceSensitivity` (default 0.1) + setters.
- `src/hooks/use-budget-pace-alert-sync.ts` — mounted in `_layout.tsx` beside
  `useNotificationSync`. Reads active budgets + a live transaction window,
  reuses `getLiveBudgetSpent` (no SQL drift), evaluates the predicate, fires
  one `expo-notifications` local notification per outstanding (budget, period)
  with `data { itemType: "budget", id }`, then marks the dedupe key.
  Re-evaluates whenever the live queries push (covers add/edit transaction).
  No-op while global/per-budget off or OS permission not granted.
- Deep link: `addNotificationResponseReceivedListener` in `_layout.tsx` routes
  `itemType === "budget"` → `/settings/budgets/[budgetId]`.
- In-app: `BudgetCard` shows a warning line (semantic.warning) and the detail
  screen an `InfoBanner`, same copy, when on pace to exceed and not disabled.
- Budget modify form (edit mode only): "Pace alerts" `Switch` bound to the
  per-budget opt-out store.
- Reminder preference screen: "Budget pace alerts" `Switch` + "Sensitivity"
  chips (10% / 25%), chips hidden when the switch is off.
- en + ar strings. Verified on emulator: app boots with the new hook, reminder
  prefs toggle + sensitivity + conditional hide all work, budgets list renders.

## Notes

- Live pace warning on the card/detail + the notification firing still want a
  manual budget-plus-transactions scenario on device to see end to end; the
  predicate reuses `getBudgetProgressModel` values already proven in-app and
  the emulator has no notification permission (which does confirm the gate).

## Behaviour

- `projectedSpend(budget) = spentSoFar / elapsedFraction`. "On pace to exceed"
  when `projectedSpend > limit * (1 + sensitivity)`.
- Evaluated on the existing notification-sync path: on app foreground and after
  data-change signals. Posts a local notification via `expo-notifications`.
- De-dupe via a keyed MMKV store `{ [budgetId]: lastAlertedPeriodKey }` — at
  most one alert per budget per period. (No new `budgets` column.)
- Respects the existing notify / quiet-hours preferences. Notification
  deep-links to the budget detail route.
- New preferences: global on/off + sensitivity; per-budget on/off.

## UX notes

- No new screen. Three surfaces:
  1. The notification — specific copy: "Dining is on track to go £30 over by
     month-end." Tap → that budget's detail.
  2. In-app `InfoBanner` on the budget card (list) and budget detail when
     on-pace-to-exceed, saying the same thing — so a user who never taps the
     push still sees it, and a user with notifications off is not cut out.
     Reuse the visual language of the existing `alert_threshold` warning.
  3. Settings — piggyback on the existing reminder/notification preference
     screen: one global "Pace alerts" `Switch` + a sensitivity segmented
     control (e.g. 10% / 25%). Per-budget override = a single `Switch` on the
     budget modify form.
- Hard cap: one notification per budget per period. No digest, no badges.
- Strings in `en.json` + `ar.json`; verify RTL.

## Acceptance criteria

- [ ] Pure `projectedSpend` + on-pace predicate (util or `budget-service`, no React): correct at first/last day of period, across sensitivity thresholds, and does not fire when under pace
- [ ] Local notification fires at most once per budget per period (keyed store), respects notify/quiet-hours prefs, deep-links to budget detail
- [ ] In-app `InfoBanner` on budget list card and detail when on pace to exceed
- [ ] Global switch + sensitivity in the notification preference screen; per-budget override on the budget form
- [ ] Re-evaluated after adding/editing a transaction
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types` pass
- [ ] Manual QA section added to `QA.md`

## Manual QA (dev build)

- Monthly budget of 300; on day 10 spend 150 (projects to ~450) → one notification, InfoBanner on the card + detail.
- Add another transaction same period → no second notification.
- Kill and relaunch the app → still no repeat for that period.
- Turn pace alerts off globally → banner and notification stop; turn the per-budget switch off → same for that budget only.
- Raise sensitivity to 25% → a borderline budget stops firing.
- Disable notifications at OS level → InfoBanner still shows in-app.
- New period rolls over → alerting re-arms.
- Arabic → notification copy + banner translated.
