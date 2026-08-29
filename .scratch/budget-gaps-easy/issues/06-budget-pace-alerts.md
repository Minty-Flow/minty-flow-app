# 06: Budget pace alerts

**What to build:** A local notification when a budget is trending to blow its
limit before the period ends — plus the same message shown inside the app —
so the user can adjust in time instead of finding out after the fact.

**Blocked by:** 01

**Status:** ready-for-agent

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
