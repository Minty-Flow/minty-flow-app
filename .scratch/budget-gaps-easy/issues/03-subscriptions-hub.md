# 03: Subscriptions & bills hub

**What to build:** One screen that lists every recurring expense with its next
charge date and normalised monthly / yearly cost, so the user can see all
their commitments in one place and spot price creep. Read-only aggregation of
data that already exists.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

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

- [ ] `subscriptions` service selector: next date, monthly + annual cost per row, list totals, `amountIncreased` flag — tested (monthly/weekly/yearly normalisation, multi-currency totals, increase detection, paused excluded from totals)
- [ ] New screen with month/year total strip and grouped list
- [ ] Group-by control (date / account / category)
- [ ] Price-increase chip on rows where the amount rose
- [ ] Collapsed paused section
- [ ] Row tap opens the recurring-template editor
- [ ] Settings entry added; linked from Insights
- [ ] `EmptyState` when there are no recurring expenses
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types`, `pnpm test` pass
