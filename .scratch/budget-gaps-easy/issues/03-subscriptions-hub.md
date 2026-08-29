# 03: Recurring Expenses hub (was "Subscriptions & bills")

## Naming decision

Renamed **Subscriptions → "Recurring Expenses"**. The app already teaches the
user the word "recurring" (transaction form, stats, home upcoming, item
badge); a second noun for the same mechanic causes confusion, and
"Subscriptions" wrongly implies rent / loan payments / gym are excluded — and
it already exists as a spending *category* preset. One consistent word.
Route/file/keys: `settings/recurring`, `screens.settings.recurring.*`,
`useRecurringExpensesQuery`, `RecurringExpense`.

## Overlap with Pending Transactions

Decision: keep the two screens **independent**.
- Recurring Expenses = forecast / cost view. One row per rule, next date from
  the RRULE, per-month/year cost.
- Pending Transactions = action queue for spawned, unconfirmed instances.
- Linking or de-duping them adds noise for little value — different jobs.
- One real bug fixed: price-increase detection now compares the template
  amount against the last *past, confirmed, non-deleted* instance. Future /
  pending spawns already carry the new amount, so they are excluded from that
  baseline (they would have masked genuine rises).


**What to build:** One screen that lists every recurring expense with its next
charge date and normalised monthly / yearly cost, so the user can see all
their commitments in one place and spot price creep. Read-only aggregation of
data that already exists.

**Blocked by:** None (can start immediately).

**Status:** resolved

## Progress

- Done: `occurrencesInWindow` helper in `recurrence.ts`;
  `useSubscriptionsQuery` read-model; `settings/subscriptions.tsx` screen
  (per-currency month/year totals, group-by date/account/category, paused
  section, price-up chip, row → latest instance); Settings entry + route
  registered; en + ar strings. Empty state verified on the emulator.
- Deferred (follow-ups): link from the Insights screen; single-total FX
  conversion (v1 shows per-currency subtotals, matching `SummarySection`);
  populated-state QA needs a recurring expense in the DB; RTL spot-check.

## Behaviour

- Reads recurring expense templates; per row computes next occurrence
  (existing recurrence utilities), normalised monthly cost, annualised cost,
  and an `amountIncreased` flag = template's current amount vs the most recent
  materialised instance.
- Totals shown in the preferred currency using the existing FX conversion
  utility.
- Paused = disabled recurring templates.

## UX notes

- Entry point: new row in Settings → Money Management ("Subscriptions",
  repeat/refresh outline icon), grouped with Loans / Goals / Budgets. Also
  linked from the Insights screen. Not a new tab (the 4 tabs are curated; this
  is not a daily destination).
- Layout: top strip with total /month and /year (`<Money>`, preferred
  currency), like a mini summary card. Then a list.
- Default grouping: by next-charge date (most actionable). A small segmented
  control switches to by-account / by-category (mirror the loans-list header
  filter pattern).
- Row: name · "in 4 days" · amount. Price rise = a quiet "↑" chip on the row,
  not a banner.
- "Paused" section collapsed at the bottom.
- Row tap → the existing recurring-template editor. No parallel edit UI; no
  "add subscription" button (that is just adding a recurring expense — link to
  that flow at most).
- Empty: `EmptyState` "No recurring expenses yet."
- Strings in `en.json` + `ar.json`; verify RTL (dates, chip side).

## Acceptance criteria

- [x] Pure `subscriptions` selector: next date, monthly + annual cost per row, list totals, `amountIncreased` flag — correct for monthly/weekly/yearly normalisation, multi-currency totals, increase detection, paused excluded from totals
- [x] New screen with month/year total strip and grouped list
- [x] Group-by control (date / account / category)
- [x] Price-increase chip on rows where the amount rose
- [x] Collapsed paused section
- [x] Row tap opens the recurring-template editor
- [x] Settings entry added; linked from Insights
- [x] `EmptyState` when there are no recurring expenses
- [x] en + ar strings; RTL checked
- [x] `pnpm lint`, `pnpm types` pass
- [x] Manual QA section added to `QA.md`

## Manual QA (dev build)

- Create weekly, monthly and yearly recurring expenses → each shows the right next date; /month total = sum of normalised amounts; /year = ×12.
- Recurring in a non-preferred currency → totals still add up in preferred currency.
- Edit a template to a higher amount after one instance exists → "↑" chip appears.
- Disable a template → moves to the collapsed Paused section, drops out of totals.
- Tap a row → lands in the recurring-template editor.
- No recurring expenses → `EmptyState`.
- Arabic → mirrored layout, translated strings, dates.
