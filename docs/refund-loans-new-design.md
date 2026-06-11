# Transaction Architecture

## Foundations

Two rules apply to every transaction without exception:

- Store `amount` always as a **positive number**.
- Use `type` to determine whether that amount adds to or removes from the balance.

There are exactly two types: **income** (adds to balance) and **expense** (removes from balance).

A third field, `subtype`, carries real-world semantic meaning. It never changes how `amount` is stored. It controls two things: how the balance is affected, and whether the transaction counts toward spending and income statistics.

---

## Subtypes

| Subtype           | Belongs to | Plain meaning                        |
| ----------------- | ---------- | ------------------------------------ |
| `one_time`        | expense    | A regular one-off purchase           |
| `recurring`       | expense    | A repeating purchase (subscription)  |
| `refund`          | expense    | A reversal of a past purchase        |
| `loan_borrowed`   | income     | Money someone lent you               |
| `loan_repayment`  | expense    | Paying back money you borrowed       |
| `loan_lent`       | expense    | Money you lent to someone else       |
| `loan_received`   | income     | Someone repaying money they owe you  |

---

## Balance Calculation

### Rule

Route every balance change through a **single centralized function**. Never compute a balance delta inline or directly in a feature. The refund exception lives here and only here.

Income adds, expense removes — with one override:

> **Refunds are stored as expenses but must increase the balance.**

| Subtype           | Balance effect |
| ----------------- | -------------- |
| `one_time`        | − amount       |
| `recurring`       | − amount       |
| `refund`          | + amount       |
| `loan_borrowed`   | + amount       |
| `loan_repayment`  | − amount       |
| `loan_lent`       | − amount       |
| `loan_received`   | + amount       |

### Implementation directive

Implement a `getBalanceDelta(transaction)` function. Every part of the codebase that needs a balance delta must call this function — no exceptions.

---

## Statistics Calculation

### Rule

Not all transactions represent real economic activity. Loan movements affect the balance but must never touch statistics. Apply two inclusion guards before any transaction touches a stat:

1. **Does this count as a real expense?**
2. **Does this count as real income?**

Implement these as two shared helper functions: `isRealExpense(transaction)` and `isRealIncome(transaction)`. Every stats function must call these helpers — never inspect `subtype` directly inside a stats function.

### Real expense inclusion

| Subtype           | Counts as expense? | Notes                       |
| ----------------- | ------------------ | --------------------------- |
| `one_time`        | Yes                | Standard purchase           |
| `recurring`       | Yes                | Standard recurring purchase |
| `refund`          | Yes, as negative   | Reduces spending            |
| `loan_repayment`  | No                 | Not consumption             |
| `loan_lent`       | No                 | Not consumption             |

### Real income inclusion

| Subtype           | Counts as income?  | Notes                       |
| ----------------- | ------------------ | --------------------------- |
| `one_time`        | Yes                | Standard earnings           |
| `recurring`       | Yes                | Standard recurring earnings |
| `loan_borrowed`   | No                 | Not earnings — it's a debt  |
| `loan_received`   | No                 | Not earnings — it's recovery|

### Signed contribution

When a transaction passes the inclusion check, its contribution to a stat is:

- Normal expense → positive amount (adds to spending total)
- Refund → negative amount (reduces spending total)
- Income → positive amount
- Excluded → zero

---

## Refund Design

### Problem

A refund must:

- Increase the account balance.
- Stay attached to its expense category (e.g. Shopping).
- Reduce reported spending in that category.
- Appear in analytics as a correction, not as new income.
- Require no new category or schema change.

If `type = income` were used, the refund would disconnect from expense categories entirely.

### Solution

Set `type = expense` and `subtype = refund`. This keeps the refund inside expense categories, lets the balance delta function override the direction to positive, and lets the stats engine treat it as negative spending.

### Example

```
Salary      income             100
Jacket      expense, one_time   10
Refund      expense, refund     10
```

Balance:

```
0  →  +100  →  +90  →  +100
```

Statistics:

```
Income:      100
Expense:       0    (10 spent, 10 refunded)
Net:         100
```

Category breakdown:

```
Shopping:      0
```

A category total can go negative if a refund is recorded in a different period from the original purchase. Display the negative — do not hide or clamp it.

### Refund + recurring constraint

A recurring refund has no real-world meaning. Enforce this in both UI and business logic:

- Enabling `refund` must disable the `recurring` option.
- Enabling `recurring` must disable the `refund` option.

---

## Loan Design

### Principle

Loans move money against a liability or receivable — not earnings, not spending. Exclude all loan subtypes from statistics. Do not negate them; exclude them entirely.

```
Without exclusion:
  Food:             200
  Rent:             800
  Loan repayment:   500
  Total expenses: 1,500   ← wrong

With exclusion:
  Food:             200
  Rent:             800
  Real expenses:  1,000   ← correct
```

### The four subtypes

| Event                        | Balance | Exclusion reason            |
| ---------------------------- | ------- | --------------------------- |
| Borrow money (`loan_borrowed`) | +     | Debt, not earnings          |
| Repay borrowed (`loan_repayment`) | −  | Settlement, not consumption |
| Lend money (`loan_lent`)     | −       | Claim, not consumption      |
| Receive repayment (`loan_received`) | + | Recovery, not earnings    |

### Refund vs. loan repayment distinction

Both can increase the balance. They are handled differently in stats:

| Event           | Stats treatment      | Reason                           |
| --------------- | -------------------- | -------------------------------- |
| Jacket purchase | + expense            | Real consumption                 |
| Jacket refund   | − expense            | That consumption was reversed    |
| Borrow money    | excluded from income | It's a debt, not earnings        |
| Repay a loan    | excluded from expense| It's a settlement, not spending  |
| Lend money      | excluded from expense| It's a claim, not spending       |
| Receive repayment | excluded from income| It's recovery, not earnings     |

---

## Stats Functions — Implementation Directives

### Functions to update

Every function below aggregates expense or income amounts. Replace any direct use of the raw stored amount with the shared effective-amount helpers.

| Function                     | What to update                                          |
| ---------------------------- | ------------------------------------------------------- |
| `computePeriodStats`         | Total expense aggregation                               |
| `computeDailyData`           | Per-day expense accumulation                            |
| `computeIntervalData`        | Both current and previous period loops                  |
| `computeCategoryBreakdown`   | Both current and previous period maps                   |
| `computeSpendingByDayOfWeek` | Per-day-of-week accumulation                            |
| `computeForecast`            | Total expense baseline used for projection              |
| `computeExpenseBySubtype`    | Amount before subtype aggregation                       |
| `computeTopTags`             | Tag amount accumulation                                 |
| `computeByAccount`           | Per-account expense total                               |

### Functions that need no changes

These derive their values from account balances or already-corrected calculations. The balance delta function handles correctness at the source.

- `computeBalanceTimeline`
- `groupByCurrency`
- `groupBalanceByCurrency`
- `fetchStatsTransactions`
- `fetchBalanceTimeline`
- `fetchHistoricalOpenings`

---

## Loan Tracking and Schema

Each loan transaction carries a `loanId` linking it to a loan record. The loan record tracks the counterparty.

Do **not** store the outstanding balance as a separate field. Derive it by summing the balance delta of every transaction associated with that loan. This keeps the loan balance consistent with transaction history and prevents drift.

This is the only genuine schema addition this design introduces. Everything else — new subtypes, updated stat helpers, balance delta overrides — works within the existing transaction table structure.

---

## UI Directives

- Follow the existing project UI patterns precisely. Do not introduce new component styles, layouts, or interaction patterns that are not already present in the codebase.
- Any new screens, forms, or controls for loans and refunds must match the visual language, spacing, typography, and component choices already used in the transaction flow.
- Where the project has existing patterns for toggling mutually exclusive options (such as the refund/recurring constraint), use that same pattern — do not invent a new one.

---

## Quick Reference

| Subtype           | Type    | Balance | Counts as expense | Counts as income |
| ----------------- | ------- | ------- | ----------------- | ---------------- |
| `one_time`        | expense | −       | Yes               | —                |
| `recurring`       | expense | −       | Yes               | —                |
| `refund`          | expense | +       | Yes (negative)    | —                |
| `loan_borrowed`   | income  | +       | —                 | No               |
| `loan_repayment`  | expense | −       | No                | —                |
| `loan_lent`       | expense | −       | No                | —                |
| `loan_received`   | income  | +       | —                 | No               |