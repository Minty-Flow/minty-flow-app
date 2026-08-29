# Easy-tier — Manual QA checklist

No automated tests for this tier. Verify each feature on a dev build (native
modules required). Tick items as they pass. Full steps live in each ticket's
"Manual QA" section.

Legend: [x] verified on the running emulator this cycle · [~] implemented,
still needs a device pass by the human.

## 02 — Safe-to-spend
- [x] Number ≈ (income − bills − spent) ÷ days left; matches breakdown sheet
- [~] Drops immediately after adding an expense
- [~] "over by X" state when the period is overspent
- [~] Cadence daily↔weekly changes caption + divisor
- [x] Zero-state hint when no usable data (not "0")
- [x] Hidden under privacy mask
- [~] Arabic: mirrored + translated

## 03 — Subscriptions hub
- [~] Weekly/monthly/yearly next dates correct; /month and /year totals add up
- [~] Non-preferred-currency recurring still totalled in preferred currency
- [~] "↑" chip after a template amount rises
- [~] Disabled template → Paused section, excluded from totals
- [~] Row tap → recurring-template editor
- [x] EmptyState when none
- [~] Arabic: mirrored + translated

## 04 — Payee rule engine
- [x] "Always categorise" toggle creates a rule
- [x] "contains" match auto-categorises a new transaction + shows "auto" badge
- [~] Transfers never auto-categorised
- [~] Manual category choice not overridden by a rule
- [~] Manual category change clears the badge
- [x] Income-category rule never lands on an expense (type gate — user-verified)
- [~] Arabic: mirrored + translated

## 05 — Rules management + backlog apply
- [x] Backlog apply confirm shows the right count; applies; toast reports count
- [x] Second backlog apply → count 0
- [~] Disabled rule stops auto-categorising
- [~] Reorder changes which overlapping rule wins
- [~] Delete rule leaves existing categorisations intact
- [x] EmptyState with working add
- [x] Income-category rule + matching expense txn → category NOT applied (type gate)
- [x] Rule row shows "· on income" / "· on expenses"; edit sheet shows "Applies to <kind> only"
- [x] Backlog apply skips type-mismatched rows

## 06 — Budget pace alerts
- [~] One notification when projected spend exceeds limit + sensitivity
- [~] No repeat notification same period, survives relaunch
- [~] InfoBanner on budget card + detail
- [x] Global off / per-budget off both silence it (global switch + conditional UI verified)
- [~] Higher sensitivity stops a borderline budget
- [~] OS notifications off → InfoBanner still shows
- [~] New period re-arms
- [~] Arabic: translated

## 07 — Debt payoff planner core
- [x] No entry point when there are no borrowed loans
- [x] EmptyState "No borrowed loans to plan" on the route
- [~] Debt-free date + per-strategy interest; avalanche ≤ snowball
- [~] Strategy toggle updates the date
- [~] All-0 APR still resolves + shows the "add rates" note
- [~] Repayment recorded → outstanding + date update
- [~] Single loan → no strategy toggle
- [~] Planner-local APR/min persist; loan rows unchanged
- [~] Loans in a non-plan currency → "N not included" note
- [~] Arabic: mirrored + translated

## 08 — Projected balance timeline
- [ ] Line dips below zero with red markers + "projected low" caption
- [ ] 30/60/90 horizon extends the line + recalculates low
- [ ] Forward portion dashed, past portion solid
- [ ] Empty-state copy when nothing to project
- [ ] Also on Stats → Cash-flow
- [ ] Arabic: axis mirrored, caption translated

## 09 — Debt payoff chart
- [ ] Curve hits zero at the debt-free date
- [ ] Reacts to extra/month and strategy changes
- [ ] Matches existing chart styling
- [ ] Arabic: axis mirrored
