# Spec: Budget-App Feature Gaps — Easy Tier

Status: ready-for-agent
Source: web research spike (`/home/adelfael/.claude/plans/crispy-shimmying-beaver.md`)
Tier definition: pure TypeScript/SQL over existing tables and UI patterns; no
new native dependency, no backend. Each feature below is independently
shippable and can be split into its own issue later.

Features in this tier:

1. Safe-to-spend number
2. Payee / auto-categorisation rules
3. Spending-pace push alerts
4. Subscriptions & bills hub
5. Debt payoff planner
6. Projected balance timeline

---

## Problem Statement

Minty Flow tracks money accurately but makes the user do the interpretation.
There is no single "can I afford this right now" number, categorising every
transaction is manual and repetitive, budget warnings only appear if you open
the app at the right moment, recurring costs are scattered with no combined
view, loans show a balance but never a payoff date, and there is no way to see
where an account balance is heading. Competing apps (PocketGuard, Simplifi,
Rocket Money, YNAB) lead with exactly these answers.

## Solution

Add six read-mostly features that derive insight from data Minty Flow already
stores:

- A **safe-to-spend** figure on Home: expected income minus known future bills,
  goal contributions and spending already done, divided across the days left in
  the period.
- **Payee rules**: remember "this payee means this category" and auto-apply on
  new transactions, with the user able to review and override.
- **Pace alerts**: a local notification when a budget is trending to blow its
  limit before the period ends, not just a toast while the app is open.
- A **Subscriptions & bills** screen: every recurring expense in one list with
  next charge date, monthly and annualised totals, and a flag when the amount
  increased versus the previous occurrence.
- A **debt payoff planner**: given extra monthly payment, project payoff dates
  under snowball and avalanche ordering, with a chart.
- A **projected balance timeline**: chart an account's balance forward using
  scheduled and recurring transactions.

## User Stories

1. As a user, I want a single "safe to spend" number on the home screen, so that I can decide whether to make a purchase without doing math.
2. As a user, I want the safe-to-spend figure to subtract bills I know are coming, so that I do not overspend money that is already committed.
3. As a user, I want the safe-to-spend figure to subtract my planned goal contributions, so that saving stays on track.
4. As a user, I want to choose whether safe-to-spend is shown per day or per week, so that it matches how I think about spending.
5. As a user, I want to pick which accounts feed the safe-to-spend figure, so that savings accounts are not counted as spendable.
6. As a user, I want to tap the safe-to-spend number and see how it was calculated, so that I trust it.
7. As a user, I want the safe-to-spend number to update immediately after I add a transaction, so that it always reflects reality.
8. As a user, I want the safe-to-spend number to respect my privacy-masking setting, so that it is hidden when I mask amounts.
9. As a user, I want the safe-to-spend number to handle a negative result, so that I get a clear "you are over" state instead of a confusing figure.
10. As a user, I want a transaction I categorise to be remembered for that payee, so that I do not re-categorise the same shop every week.
11. As a user, I want to create a rule that matches a payee by text (contains / equals), so that variations of a merchant name still match.
12. As a user, I want a rule to optionally set the category, the subtype, and tags, so that one rule fully classifies a transaction.
13. As a user, I want to see all my rules in one list and edit or delete them, so that I stay in control of automation.
14. As a user, I want to turn a rule on or off without deleting it, so that I can pause automation temporarily.
15. As a user, I want rules applied only to newly created transactions by default, so that my history is not silently rewritten.
16. As a user, I want the option to run a rule against existing uncategorised transactions, so that I can clean up a backlog on demand.
17. As a user, I want an auto-applied category to be visibly marked as rule-set, so that I can tell it apart from my manual choices.
18. As a user, I want to override a rule's result on a single transaction, so that exceptions are easy.
19. As a user, I want rules to be evaluated in a defined order with the first match winning, so that behaviour is predictable.
20. As a user, I want rules to never apply to transfers, so that internal movements stay uncategorised.
21. As a user, I want a notification when a budget is on pace to exceed its limit, so that I can adjust before it is too late.
22. As a user, I want the pace alert to fire at most once per budget per period, so that I am not spammed.
23. As a user, I want to set how sensitive the pace alert is (e.g. projected overspend of 10% vs 25%), so that it matches my tolerance.
24. As a user, I want to disable pace alerts globally or per budget, so that I control interruptions.
25. As a user, I want pace alerts to respect the existing quiet-hours / reminder preferences, so that they follow my notification settings.
26. As a user, I want tapping a pace alert to open the relevant budget, so that I can act immediately.
27. As a user, I want pace alerts to be recalculated when I add or edit a transaction, so that they reflect current spending.
28. As a user, I want one screen listing every recurring expense, so that I can see all my commitments at once.
29. As a user, I want each subscription to show its next charge date, so that I can anticipate the hit to my balance.
30. As a user, I want the total monthly cost of all subscriptions, so that I understand my fixed outgoings.
31. As a user, I want the annualised cost of each subscription and of the whole list, so that I see the yearly impact.
32. As a user, I want subscriptions grouped by account or category, so that I can review them in context.
33. As a user, I want a subscription flagged when its amount went up compared to the last charge, so that I catch price creep.
34. As a user, I want to jump from a subscription to its underlying recurring template to edit or cancel it, so that management is one tap away.
35. As a user, I want subscriptions shown in my primary currency with conversion applied, so that totals make sense across currencies.
36. As a user, I want to see subscriptions I have paused, so that I know what is dormant.
37. As a user with loans, I want to enter an extra monthly amount and see when each debt is paid off, so that I can plan being debt-free.
38. As a user, I want to compare snowball (smallest balance first) and avalanche (highest rate first) strategies, so that I can pick one.
39. As a user, I want a chart of total debt over time under the chosen strategy, so that progress is visual.
40. As a user, I want to see total interest paid under each strategy, so that I understand the cost difference.
41. As a user, I want the planner to use the interest rate and minimum payment I already recorded on each loan, so that I do not re-enter data.
42. As a user, I want a clear message when a loan has no rate recorded, so that I know the projection is approximate.
43. As a user, I want the planner to update when I record a loan repayment, so that the payoff date stays accurate.
44. As a user, I want to see a forward projection of an account's balance, so that I can spot a future shortfall.
45. As a user, I want the projection to include recurring transactions and any scheduled one-off transactions, so that it is realistic.
46. As a user, I want to choose the projection horizon (e.g. 30 / 60 / 90 days), so that I can look as far ahead as I need.
47. As a user, I want the projected timeline to mark the days a balance would go negative, so that danger points stand out.
48. As a user, I want the projection to start from the current real balance, so that it is anchored in fact.
49. As a user, I want the projection chart to match the app's existing chart styling, so that it feels native to the app.
50. As a user, I want all six features to be available in both English and Arabic with correct RTL layout, so that the app stays fully localised.
51. As a user, I want every monetary value in these features formatted through the app's existing money formatting, so that decimals, symbols and grouping are consistent.

## Implementation Decisions

### Shared

- All six features are computed in the database **service layer** and exposed
  through existing Drizzle live-query hooks so UI reads stay reactive. No new
  reactivity mechanism, no boot hydration.
- All money math stays in integer minor units and goes through the existing
  money utilities; display goes through the existing money component.
- New user-facing strings are added to both translation files; new preferences
  follow the existing Zustand-plus-MMKV preference-store pattern.

### 1. Safe-to-spend

- New derived selector in a `safe-to-spend` service module: `income(period)
  − committedBills(remaining) − plannedGoalContributions(remaining) −
  spent(period)`, then divided by remaining day/week count.
- "Income" and "committed bills" are read from the recurring-transactions data
  already present; "spent" reuses the same transfer/pending/deleted exclusion
  filter that budget spent-aggregation uses.
- New preferences: cadence (`daily | weekly`), included account ids,
  include-goals toggle. Stored in a new preference store.
- Rendered as a card on the Home screen; tapping opens a breakdown sheet
  listing each term. Negative result renders an explicit over-budget state.

### 2. Payee rules

- New table `transaction_rules`: id, match_field (`title`/`description` —
  transactions have no `payee` column), match_type
  (`contains | equals | starts_with`), match_value, set_category_id
  (nullable), set_subtype (nullable), set_tag_ids (nullable json), priority
  integer, is_active (0/1), timestamps. Migration added.
- Rule evaluation is a pure function `applyRules(draftTransaction, rules) ->
  patch`. Called by the ledger/transaction service on create and on manual
  edit-save, only when the field is empty, never for `is_transfer = 1`.
- First match by ascending `priority` wins.
- Transaction rows gain a nullable `category_source` marker (`manual | rule`)
  so the UI can badge rule-set categories. Manual edit sets it back to
  `manual`.
- Opt-in bulk apply: a service function that runs rules over existing
  uncategorised, non-transfer transactions, invoked from the rules screen.
- New screen under settings for listing/editing rules; a "make a rule from
  this" affordance on the transaction form.

### 3. Spending-pace alerts

- New function in the budget service: `projectedSpend(budget) = spentSoFar /
  elapsedFraction`; a budget is "on pace to exceed" when `projectedSpend >
  limit * (1 + sensitivity)`.
- Evaluated by the existing notification-sync hook path on app foreground and
  after data-change signals. Uses `expo-notifications` (already a dependency)
  to post a local notification.
- De-dupe: a keyed MMKV store `{ [budgetId]: lastAlertedPeriodKey }` (no new
  `budgets` column) so at most one alert per budget per period.
- New preferences: global on/off, per-budget on/off, sensitivity. Respects the
  existing reminder/quiet-hours preference if present.
- Notification payload deep-links to the budget detail route.

### 4. Subscriptions & bills hub

- No schema change. New service selector that reads recurring expense
  templates and computes: next occurrence date (from the existing recurrence
  utilities), normalised monthly cost, annualised cost, and a
  `amountIncreased` flag by comparing the template's current amount to the
  most recent materialised instance.
- Totals converted to primary currency via the existing FX conversion utility.
- New screen listing subscriptions with group-by (account/category) and a
  paused section; row tap navigates to the existing recurring-template editor.

### 5. Debt payoff planner

- Pure calculation module `debt-payoff`: input = list of loans (outstanding
  balance, apr, min payment) plus a global extra-payment amount; output =
  per-strategy schedule (array of {month, totalBalance, interestPaid}) and
  payoff date.
- Strategies: `snowball` (ascending balance) and `avalanche` (descending apr).
- Outstanding balance = principal − payments so far (reuse `loan-service`
  aggregation). Loans store **no apr or minimum payment**, so those are
  planner-local inputs held in a Zustand+MMKV store keyed by loan id — never
  written to the loan row. Missing/zero apr => linear payoff with a surfaced
  "add rates for interest estimates" notice.
- New screen (or section within the existing loans area) with a strategy
  toggle, an extra-payment input, a total-debt-over-time chart using
  `victory-native`, and a summary of total interest per strategy.

### 6. Projected balance timeline

- New service selector `projectBalance(accountIds, horizonDays)`: starts from
  current balance (existing balance service), then walks forward applying
  materialised-but-future recurring occurrences and any scheduled one-off
  transactions, producing a daily balance series.
- Negative days are marked in the returned series.
- Rendered with the existing charting stack and chart-font hook; horizon
  selector (30/60/90). Can live on the account detail screen and/or the
  cash-flow screen.

## Testing Decisions

- **What a good test is here:** exercises a service/calculation module through
  its public function with a seeded set of rows and asserts the returned
  numbers/series/flags — never reaches into private helpers or React internals.
- The repo currently has **no test framework**. This tier introduces one at a
  single seam: the **database service layer**, run under `vitest` against an
  in-memory SQLite instance created from the Drizzle schema + migrations. This
  is the highest seam that covers all six features and adds exactly one new
  seam to the codebase.
- Modules under test: `safe-to-spend`, `transaction_rules` evaluation +
  bulk-apply, budget `projectedSpend` / on-pace predicate, subscriptions
  selector (next date, monthly/annual totals, increase flag), `debt-payoff`
  strategy schedules, `projectBalance` series.
- Representative cases: period boundaries (first/last day), zero remaining
  days, negative safe-to-spend, multi-currency totals, rule priority ties,
  rule non-application to transfers, loan with missing apr, projection with
  overlapping recurring rules, horizon crossing a month boundary.
- **Prior art:** none in-repo; this spec establishes the pattern. Closest
  existing reference points are the pure aggregation functions already in
  `budget-service` and `balance-service`, which are written in a testable
  style and should be the template for new modules.
- If adopting a test framework is rejected, the fallback is a written manual QA
  checklist per feature; the service modules must still be pure and
  independently callable.

## Out of Scope

- Any bank/aggregator connection or automatic transaction import.
- Machine-learning categorisation; rules are deterministic string matches only.
- Rewriting historical categories automatically (bulk apply is explicit and
  user-triggered).
- Live investment prices or external rate lookups beyond the existing FX
  mechanism.
- Cross-device delivery of notifications; alerts are local only.
- Widgets, voice input, OCR (Medium tier).
- Changing the existing budget period/rollover model (Medium tier).

## Further Notes

- The known "rolling period window goes stale past midnight" limitation
  affects safe-to-spend and pace alerts too; recompute on the existing
  time-reactivity boundary hook rather than caching across days.
- `category_source` / `last_pace_alert_period` are the only transaction/budget
  column additions in this tier; everything else is new tables or pure
  computation.
- Order of delivery suggestion: subscriptions hub and safe-to-spend first
  (highest visible value, lowest risk), then payee rules, then pace alerts,
  then the two chart features.

## Tickets

Broken into `issues/01`–`09`. Dependency graph:

- `01` test seam + shared helpers — prefactor, blocks the calc-heavy tickets.
- `02` safe-to-spend ← 01
- `03` subscriptions hub ← none
- `04` payee rule engine + create-from-form ← none
- `05` rules management + backlog apply ← 04
- `06` budget pace alerts ← 01
- `07` debt payoff planner core ← 01
- `08` projected balance timeline ← 01
- `09` debt payoff chart ← 07

Frontier at start: `01`, `03`, `04` in parallel. Placement calls (made
UX-first): safe-to-spend stays on Home only (not duplicated on Insights);
subscriptions hub nested in Settings → Money Management + linked from Insights;
debt planner is its own route off the loans-list header, not an inline
section.
