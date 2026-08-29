# Spec: Budget-App Feature Gaps — Medium Tier

Status: ready-for-agent
Source: web research spike (`/home/adelfael/.claude/plans/crispy-shimmying-beaver.md`)
Tier definition: requires a schema change + migration, or a new native
dependency / config plugin, or a non-trivial algorithm or heavy UI. Still
local-first, still no backend. Each feature is independently shippable and can
be split into its own issue later.

Features in this tier:

1. Split transactions
2. Budget rollover / carryover modes
3. CSV / bank-statement import
4. On-device OCR receipt scan
5. Subscription auto-detection
6. Asset / investment account types
7. Zero-based monthly allocation view
8. Customisable reports + PDF export
9. Voice / natural-language quick add
10. Home-screen widgets

---

## Problem Statement

Minty Flow cannot represent a single purchase that spans categories, so users
either mis-file the whole amount or split it into fake transactions. Budgets
reset every period with no memory of what was left over, which breaks true
envelope budgeting. There is no way to bring in history from a bank export or
a previous app, so switching to Minty Flow means starting from zero. Capturing
a cash purchase means typing everything by hand. Recurring costs must be set
up manually even when the pattern is obvious in the history. Net worth ignores
property and investments. There is no "assign every dollar" screen, no
report you can shape yourself, no quick-capture from voice, and no
home-screen presence.

## Solution

Ten features, each closing one structural gap:

- **Split transactions**: one transaction distributes its amount across
  multiple category lines that budgets and stats understand.
- **Rollover modes**: each budget category chooses Roll Over, Cap, or Zero Out
  for leftover money at period end.
- **CSV import**: a guided importer that maps columns, previews, de-duplicates,
  and commits transactions from an arbitrary CSV.
- **OCR receipt scan**: capture a receipt image on-device, extract amount,
  date and merchant, prefill the form, keep the image as an attachment.
- **Subscription auto-detection**: scan transaction history for repeating
  merchant+amount patterns and offer to convert them into recurring templates.
- **Asset accounts**: a manual-valuation account type (property, vehicle,
  investment) with a value history that feeds net worth.
- **Allocation view**: a per-period screen to assign available money to budget
  categories until every unit has a job.
- **Custom reports + PDF**: user-defined filters/grouping over the stats data,
  exportable as PDF or CSV.
- **Voice quick add**: dictate "spent 15 on lunch", parse it, confirm, save.
- **Widgets**: iOS/Android home-screen widgets showing safe-to-spend, a
  budget, or recent transactions.

## User Stories

### Split transactions
1. As a user, I want to split one transaction across several categories, so that a supermarket trip that includes groceries and household goods is recorded correctly.
2. As a user, I want each split line to have its own amount and category, so that the breakdown is precise.
3. As a user, I want the split lines to always sum to the transaction total, so that the books stay balanced.
4. As a user, I want the app to show the remaining unallocated amount while I build a split, so that I know when it is complete.
5. As a user, I want each split line to optionally carry its own note and tags, so that detail is not lost.
6. As a user, I want budgets to count each split line against its own category, so that budget tracking is accurate.
7. As a user, I want category stats and charts to reflect split lines, so that reports are not skewed.
8. As a user, I want to convert an existing simple transaction into a split, so that I can fix past entries.
9. As a user, I want to collapse a split back into a single-category transaction, so that mistakes are reversible.
10. As a user, I want split transactions clearly marked in lists, so that I can recognise them at a glance.
11. As a user, I want transfers to be excluded from splitting, so that the transfer invariant is preserved.
12. As a user, I want deleting a split transaction to remove all its lines together, so that no orphan lines remain.

### Budget rollover / carryover modes
13. As a user, I want to choose per budget whether leftover money rolls into next period, so that under-spending is rewarded.
14. As a user, I want a "cap" mode that rolls over only up to a ceiling, so that a category cannot accumulate indefinitely.
15. As a user, I want a "zero out" mode that discards leftover, so that each period starts fresh.
16. As a user, I want overspending in a period to carry as a negative into the next period when rollover is on, so that I must make it up.
17. As a user, I want to see the carried-in amount separately from this period's fresh allocation, so that the math is transparent.
18. As a user, I want the rollover to recompute correctly if I edit a past transaction, so that history changes propagate.
19. As a user, I want a sensible default (zero out) for existing budgets after the update, so that nothing changes unexpectedly.
20. As a user, I want rollover to work with all existing period types (daily/weekly/monthly/yearly/custom), so that the feature is consistent.

### CSV / bank-statement import
21. As a user, I want to import a CSV of transactions, so that I can move my history into Minty Flow.
22. As a user, I want to map CSV columns to fields (date, amount, description, etc.), so that any bank format works.
23. As a user, I want to save a column mapping per source, so that future imports from the same bank are one step.
24. As a user, I want to choose the date format and decimal/thousands separators, so that parsing is correct for my locale and bank.
25. As a user, I want to pick which account the imported rows belong to, so that balances are right.
26. As a user, I want a preview of parsed rows before committing, so that I can catch mistakes.
27. As a user, I want the importer to detect and skip rows that duplicate existing transactions, so that I do not double-count.
28. As a user, I want a summary after import (added / skipped / failed), so that I know what happened.
29. As a user, I want import to run inside a single transaction so a failure rolls back cleanly, so that I never get a half import.
30. As a user, I want imported transactions tagged as imported, so that I can find or undo them.
31. As a user, I want the importer to apply my payee rules to imported rows, so that they arrive categorised.

### OCR receipt scan
32. As a user, I want to photograph a receipt and have the amount filled in, so that I do not type it.
33. As a user, I want the date extracted from the receipt, so that the transaction is dated correctly.
34. As a user, I want the merchant name extracted and used as the title, so that the entry is descriptive.
35. As a user, I want the receipt image kept as an attachment, so that I have proof of purchase.
36. As a user, I want OCR to run entirely on-device, so that my receipts are never uploaded anywhere.
37. As a user, I want to correct any extracted field before saving, so that OCR errors are easy to fix.
38. As a user, I want a graceful fallback to manual entry when OCR fails, so that the flow never dead-ends.
39. As a user, I want to import an existing image from the gallery, not only the camera, so that saved receipts work too.

### Subscription auto-detection
40. As a user, I want the app to find charges that repeat on a regular cadence, so that I do not have to spot them myself.
41. As a user, I want each detected pattern shown with its cadence, typical amount and merchant, so that I can judge it.
42. As a user, I want to accept a detection and have a recurring template created automatically, so that setup is one tap.
43. As a user, I want to dismiss a detection permanently, so that it stops being suggested.
44. As a user, I want detection to ignore patterns I already have recurring templates for, so that there are no duplicates.
45. As a user, I want detection to tolerate small amount variations, so that slightly changing bills are still found.
46. As a user, I want detection to run in the background without slowing the app, so that it is unobtrusive.

### Asset / investment account types
47. As a user, I want to add an account that represents property or an investment with a manual value, so that my net worth is complete.
48. As a user, I want to update that value over time and keep a history, so that net worth trends are real.
49. As a user, I want asset accounts excluded from spendable/safe-to-spend calculations, so that they do not distort budgeting.
50. As a user, I want asset accounts shown distinctly in the accounts list and net-worth screen, so that they are not confused with cash.
51. As a user, I want an optional linked liability (e.g. a mortgage against a house), so that equity is shown, not just gross value.
52. As a user, I want value-history points to appear on the net-worth chart, so that the chart reflects asset changes.

### Zero-based monthly allocation view
53. As a user, I want a screen showing money available to allocate this period, so that I can give every unit a job.
54. As a user, I want to assign amounts to budget categories from that screen, so that budgeting is one focused task.
55. As a user, I want a running "left to allocate" figure, so that I know when I have reached zero.
56. As a user, I want to see last period's allocation as a starting point, so that I am not starting blank each time.
57. As a user, I want overspent categories highlighted in the allocation view, so that I can cover them first.
58. As a user, I want the allocation to integrate with rollover mode, so that carried-in amounts are shown as already allocated.

### Custom reports + PDF export
59. As a user, I want to build a report by choosing date range, accounts, categories and grouping, so that I can answer my own questions.
60. As a user, I want to save a report definition and re-run it later, so that recurring questions are quick.
61. As a user, I want to export a report as PDF, so that I can file or share it.
62. As a user, I want to export a report as CSV, so that I can work with it in a spreadsheet.
63. As a user, I want report figures formatted with the app's money and date formatting, so that output is consistent.
64. As a user, I want the PDF to be laid out cleanly with a title, range and totals, so that it is presentable.

### Voice / natural-language quick add
65. As a user, I want to dictate a transaction in plain language, so that capture is faster than typing.
66. As a user, I want the parser to extract amount, and guess category and account, so that most of the form is prefilled.
67. As a user, I want to review the parsed result before it saves, so that I stay in control.
68. As a user, I want multiple items in one utterance to create multiple transactions, so that "coffee 4 and lunch 12" works.
69. As a user, I want voice capture to fall back to a text field if speech recognition is unavailable, so that the feature still helps.
70. As a user, I want dictation to work in my app language, so that it is usable in English and Arabic.

### Home-screen widgets
71. As a user, I want a widget showing my safe-to-spend number, so that I see it without opening the app.
72. As a user, I want a widget showing a chosen budget's remaining amount, so that I can track a key category.
73. As a user, I want a widget showing my most recent transactions, so that I can confirm something posted.
74. As a user, I want the widget to update when the app data changes, so that it is not stale.
75. As a user, I want tapping the widget to deep-link into the relevant screen, so that acting on it is fast.
76. As a user, I want widgets to respect privacy masking, so that amounts are hidden on my lock screen when masking is on.

### Cross-cutting
77. As a user, I want every new screen localised in English and Arabic with correct RTL, so that the app stays consistent.
78. As a user, I want all new monetary handling to stay in integer minor units via the existing money utilities, so that rounding is never wrong.

## Implementation Decisions

### 1. Split transactions

- New table `transaction_splits`: id, transaction_id (fk, cascade delete),
  amount_minor, category_id, subtype (nullable), note (nullable), sort order.
  Migration added.
- A transaction is "split" when it has >= 1 rows in `transaction_splits`;
  its own `category_id` becomes nullable/ignored in that case. A DB check or
  service-level invariant enforces `sum(splits.amount) = transaction.amount`.
- Writes go through `runInTransaction` so the parent and all lines commit
  atomically; delete cascades.
- Budget spent-aggregation and stats category aggregation switch to reading
  from a unified view: split lines when present, else the transaction's own
  category. This is the main query change and the primary risk area.
- Transaction form gains a split editor with a live remaining-amount readout.
  Splitting disabled for `is_transfer = 1`.

### 2. Budget rollover / carryover modes

- `budgets` gains `carryover_mode` (`zero_out | roll_over | cap`) default
  `zero_out`, and `carryover_cap_minor` (nullable). Migration; existing rows
  default to `zero_out` so behaviour is unchanged.
- Budget service computes `carriedIn(period) = previousPeriodRemaining`
  clamped by mode/cap, recursively from the budget start. Result is memoised
  per period key and recomputed on data-change signal.
- Budget detail and allocation views show carried-in and fresh allocation as
  separate lines.

### 3. CSV / bank-statement import

- New `csv-import` service + a multi-step screen (upload -> map columns ->
  options -> preview -> commit). CSV parsed with a small pure-JS parser
  dependency (e.g. `papaparse`); no native code.
- Column mapping persisted per named source in a preference store.
- Options: date format, decimal/thousand separators, sign handling, target
  account.
- Dedupe key: (account_id, date, amount_minor, normalised description) matched
  against existing rows.
- Commit runs in one `runInTransaction`; imported rows carry an `imported`
  tag and pass through payee-rule evaluation.
- Reuses the existing backup/import summary UI patterns from data-management.

### 4. On-device OCR receipt scan

- New native dependency for on-device text recognition (e.g.
  `@react-native-ml-kit/text-recognition`) wired via config plugin; requires a
  dev-build rebuild and a prebuild config change. No image leaves the device.
- New `receipt-ocr` module: takes recognised text blocks, applies heuristics
  (largest currency-looking number near "total", date patterns, top line as
  merchant) and returns a partial transaction draft.
- Entry point from the transaction form ("scan receipt"): camera or gallery ->
  OCR -> prefilled editable form -> image saved through the existing
  attachments helper.
- Full manual fallback on any failure.

### 5. Subscription auto-detection

- New `recurring-detection` service: groups non-transfer expense transactions
  by normalised merchant, looks for >= 3 occurrences at a near-constant
  interval (weekly/monthly/quarterly/yearly) within an amount tolerance band,
  emits candidate patterns.
- Excludes merchants already covered by a recurring template.
- Candidates surfaced in the subscriptions hub (Easy tier) as a "detected"
  section; accept -> create recurring template via existing service; dismiss
  -> persist a suppression record (small table or keyed store).
- Runs off the main interaction path (on foreground / after import), bounded
  work.

### 6. Asset / investment account types

- Extend the account `type` vocabulary with asset types; add
  `is_manual_value` behaviour and a new `account_value_history` table (id,
  account_id, value_minor, as_of_date).
- Manual-value accounts derive their "balance" from the latest history point,
  not from transactions.
- Excluded from safe-to-spend and spendable sums by default; included in
  net-worth aggregation and chart (history points become chart samples).
- Optional `linked_liability_account_id` on an asset account for equity
  display.

### 7. Zero-based monthly allocation view

- New screen backed by a `budget_allocations` table (budget_id, period_key,
  allocated_minor) or by reusing the budget amount per period if periods are
  already discrete — decision: add `budget_allocations` to keep per-period
  history without mutating the budget's base amount.
- "Available to allocate" = period income (recurring + actual) − sum of
  allocations; "left to allocate" updates live.
- Integrates with rollover: carried-in shows as pre-allocated.

### 8. Customisable reports + PDF export

- New `reports` service that parameterises the existing stats aggregations by
  {range, accountIds, categoryIds, groupBy, txn types}.
- Saved report definitions in a `saved_reports` table (json params + name).
- PDF via `expo-print` (HTML template -> PDF); CSV reuses the existing CSV
  export writer, generalised to accept a column set.
- All formatting through existing money/number/date utilities.

### 9. Voice / natural-language quick add

- New native dependency for speech-to-text (e.g. `expo-speech-recognition`) via
  config plugin; text fallback field always available.
- New `nl-transaction-parse` pure module: tokenises an utterance, extracts
  amounts (reusing the math-expression / number-format parsing already in the
  codebase), splits on conjunctions for multi-item, fuzzy-matches category and
  account names.
- Produces one or more editable drafts shown in a confirm sheet before save.

### 10. Home-screen widgets

- Native widget targets: iOS WidgetKit and Android (Glance or
  `react-native-android-widget`), added via config plugin(s); prebuild change
  and dev-build rebuild required.
- Data bridge: app writes a small snapshot (safe-to-spend, selected budget,
  recent txns, masking flag) to shared storage (iOS App Group / Android
  shared prefs or shared MMKV) on data-change; the widget reads only that
  snapshot — it does not open SQLite.
- Deep links via existing routing.
- This is the largest item in the tier; may be promoted to its own spec.

## Testing Decisions

> Note: the automated test framework was declined for the Easy tier (see
> `budget-gaps-easy/spec.md`). Until that decision is revisited, verification
> here is also manual QA + pure functions. The seam described below applies if
> a framework is later adopted.

- **What a good test is here:** drives a service/parser module by its public
  function with seeded rows or sample input (a CSV string, a block of OCR
  text, an utterance) and asserts the committed rows or returned draft. No
  assertions on component internals or native module internals.
- Same single seam as the Easy tier: the **database service layer + pure
  parser modules**, under `vitest` with in-memory SQLite. Native modules (OCR,
  speech, widgets) are isolated behind a thin pure adapter so the parsing/
  heuristic logic is testable with fixture text and the native call is not
  unit-tested.
- Modules under test: split-sum invariant and split-aware budget/stats
  aggregation; `carriedIn` across modes/caps and period types; CSV parse +
  column map + dedupe + rollback; `receipt-ocr` heuristics on fixture text;
  `recurring-detection` on synthetic histories (true positives and near-miss
  negatives); manual-value balance + net-worth inclusion; allocation "left to
  allocate" math; `reports` parameterisation vs known stats outputs;
  `nl-transaction-parse` on a table of utterances.
- Representative cases: split that does not sum (must reject), converting
  simple<->split, rollover with a prior negative balance, CSV with European
  number format, CSV duplicate detection, OCR text with multiple totals,
  detection ignoring an existing template, asset account excluded from
  safe-to-spend, multi-item utterance, PDF export of an empty range.
- **Prior art:** the pure aggregation functions in `budget-service`,
  `balance-service` and the CSV export writer in `data-management-service`
  are the style template; the backup validate/import path is prior art for the
  transactional, summary-reporting import flow.

## Out of Scope

- Any automatic bank connection or aggregator; CSV is the only import channel.
- Live market prices for investment accounts; values are manual.
- OCR or speech processing off-device / via cloud APIs.
- ML-based categorisation; detection and parsing are heuristic and
  deterministic.
- Interactive/editable widgets; widgets are read-only with deep links.
- Multi-user or cross-device concerns (Hard tier).
- Scheduled email/delivery of reports; export is on-demand only.

## Further Notes

- Split transactions is a prerequisite for fully accurate reports and
  allocation; sequence it early in the tier.
- OCR, voice and widgets each add a native dependency and a prebuild change —
  batch their rebuild, and consider splitting widgets into its own spec given
  its size.
- Rollover interacts with the Easy-tier safe-to-spend and pace alerts; land
  those first, then have rollover feed carried-in amounts into both.
- Every schema change in this tier is additive (new tables or nullable
  columns) — no destructive migrations.
