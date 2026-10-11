# Transaction form + `kind` axis redesign

Status: approved (rev 2, 2026-08-30) — Slice 1 in implementation planning

## Goal

Reshape the transaction form around a single **transaction kind** axis and a
simplified primary field order, restructure the 988-line form monolith into a
deep `useTransactionForm` hook + dumb coordinator, replace the fixed recurrence
frequency set with an "every N units" model, promote "upcoming" to a first-class
kind, and split the loans engine into one-time vs long-term loans that can be
created and closed from the transaction form.

Local-first app, Expo SDK 57, Drizzle + expo-sqlite, **live users, no server
backup**. One migration baseline today (`drizzle/0000_safe_maximus.sql`); a
large one-time data migration lives in `src/database/forced-migration.ts`.
No test framework.

## Vocabulary

See `CONTEXT.md`. Key new terms: **kind**, **upcoming**, **subscription**,
**repetitive**, **one-time loan**, **long-term loan**, **opening entry**,
**Paid / Collected / Settled**, **recurrence (interval + unit)**.

---

## Decisions

Formerly open questions — now requirements:

1. **Account picker** sits directly under Amount (it drives `SmartAmountInput`'s
   currency). Goal / budget / tags / location / refund go below Attachments.
2. **Kind selector** is a `ListItem` that opens a bottom-sheet listing the 6
   kinds (not a chip row). The active kind's inline card renders beneath the row.
3. **"End after N occurrences"** end-type is **removed**. The only end options
   are a date or Forever; the date field shows a live "(×N)" occurrence count.
4. **Lent money in expense stats** — no stats change for v1. The Collect
   transaction naturally offsets the Lent opening entry.
5. **Loans-screen loan form** gets a **segmented `One-time` / `Long-term`
   toggle** (default `Long-term` for screen-created loans).
6. **One-time / Long-term filter chip** on the loans list — deferred.

---

## Cross-slice invariants

These bind all slices. Implement the helper module in Slice 1; every later slice
consumes it.

### CSI-1 — kind ↔ type matrix + `transaction-kind` helper

New module `src/domain/transaction-kind.ts` (pure, no IO, unit-testable). Single
source of truth; the zod schema, the form hook, and the ledger service all
import it — none re-encode the rules.

| kind | allowed `type` |
|---|---|
| `default` | expense, income, transfer |
| `upcoming` | expense, income |
| `subscription` | expense, income, transfer |
| `repetitive` | expense, income, transfer |
| `lent` | expense |
| `borrowed` | income |

*(transfer is allowed for subscription/repetitive because recurring transfers
already exist via `recurring_transactions.transfer_to_account_id`.)*

Linked-loan repayment type:

| linked loan `loanType` | repayment `type` | top-tab label |
|---|---|---|
| `lent` | income | Collected |
| `borrowed` | expense | Paid |

Exports:

```ts
ALLOWED_TYPES_BY_KIND: Record<TransactionKind, readonly TransactionType[]>
getAllowedTransactionTypes(kind): readonly TransactionType[]
isKindTypeValid(kind, type): boolean
getKindForLoanType(loanType): "lent" | "borrowed"          // lent→lent, borrowed→borrowed
getOpeningTypeForLoan(loanType): "expense" | "income"      // lent→expense, borrowed→income
getRepaymentTypeForLoan(loanType): "income" | "expense"    // lent→income, borrowed→expense
```

`transactionSchema.superRefine` uses `isKindTypeValid` to reject any invalid
`(kind, type)` pair (covers the old transfer-only check and more).

### CSI-2 — `kind` is authoritative for pending state

`kind === 'upcoming'` is the **canonical** representation of a user-created
unpaid transaction. Rules:

- On write, `kind === 'upcoming'` ⟹ `is_pending = 1`. No other kind may be
  written with `is_pending = 1` **except the one sanctioned internal case**:
  recurring **future** instances — `synchronizeRecurringTransaction` creates
  not-yet-due `subscription` / `repetitive` instances as `is_pending = 1` while
  `kind` stays `subscription` / `repetitive`. When they come due, sync / confirm
  clears `is_pending` and leaves `kind`.
- `createTransaction` / `updateTransaction` assert (throw in `__DEV__`,
  `logger.error` in prod) if `is_pending === 1 && kind ∉ {upcoming, subscription,
  repetitive}`.
- UI trusts `kind` for the "Upcoming" chip. A pending `subscription`/`repetitive`
  instance shows the existing scheduled-recurring indicator, not "Upcoming".
- Migration `0001` step 4 only promotes non-transfer pending rows that are still
  `kind='default'`, so it never mislabels pending recurring instances (already
  `repetitive` by step 2/3). Any residual `kind='default' && is_pending=1` after
  migration is a bug — the `__DEV__` assert catches it.

### CSI-3 — pending rows never contribute to monetary aggregates

**Invariant:** a row with `is_pending = 1` must not affect any balance, total,
or progress figure. Concrete audit checklist (Slice 3 owns closing it; each item
is an acceptance line — confirm a `is_pending = 0` / `NOT is_pending` guard, add
where missing):

Audit result (Slice 3, ticket 01 — 2026-08-30): one gap found and fixed
(`summary-card.tsx`); every other target was already guarded.

- [x] `src/database/services/balance-service.ts` — `eq(transactions.isPending, 0)` in `getBalanceAtTransaction`
- [x] `src/database/services/budget-service.ts` — CRUD only, no aggregation; spent is computed in `src/utils/live-progress.ts` `getLiveBudgetSpent` which skips `transaction.isPending`
- [x] `src/database/services/goal-service.ts` — CRUD only; progress via `getLiveGoalProgress`, guards `transaction.isPending`
- [x] `src/database/services/loan-service.ts` + loan read-model — CRUD / stored-column only; progress via `getLiveLoanProgress`, guards `transaction.isPending`
- [x] `stats-service.ts` does not exist — stats aggregation lives in `stats-data.ts` / `stats-read-model.ts`
- [x] `src/database/drizzle/read-models/stats-data.ts` — every `fetchStatsTransactions` / `fetchBalanceTimeline` SQL has `AND t.is_pending = 0`; the lone `is_pending = 1` block is `fetchPendingSummary`, a deliberate separate preview never mixed into totals; `fetchWrappedInsights` shares `fetchStatsTransactions`
- [x] `src/database/drizzle/read-models/stats-read-model.ts` — no raw transaction aggregation; sums stored `accounts.balance`
- [x] `src/utils/live-progress.ts` — `getLiveBudgetSpent`, `getLiveBudgetSpentByCategory`, `getLiveGoalProgress`, `getLiveLoanProgress` all guard `transaction.isPending`
- [x] `src/utils/transaction-list-utils.ts` — `buildTransactionSections` totals are guarded upstream: `transaction-section-list.tsx` runs `applyPendingFilter` first, which drops pending rows for every view except the deliberate "pending" filter
- [x] `src/components/summary-card.tsx` — **was the gap.** `SummarySection` summed home income/expense with no pending guard and home passes it unfiltered `transactionsFull`. Fixed: filter `!row.isPending` before splitting income/expense/transfer rows
- [x] account list balances / account detail totals — list reads stored `accounts.balance` (ledger-service guards every mutation with `if (!isPending)`); `accounts/[accountId]/index.tsx` in/out totals do `if (t.isPending || t.isDeleted) continue`
- [x] category totals (`stats/categories`) — reads `useStats()` → `fetchAllStatsData` (guarded); no direct transaction sum
- [x] net-worth / cash-flow / calendar stat screens — all consume `useStats()` data via props; no direct transaction access
- [x] `recurring-transaction-service` — only *creates* rows with `isPending`; performs no summation and routes writes through the ledger service

### CSI-4 — `kind` persistence, every write path

| path | `kind` written | notes |
|---|---|---|
| normal create | from form | validated against CSI-1 |
| normal update | from form | subject to edit-semantics locks (ES-*) |
| upcoming create | `upcoming` (+ `is_pending=1`) | |
| upcoming confirm (`confirmTransaction`) | `default` | only when confirmed row was `upcoming`; clears pending |
| recurring spawn | template kind (`subscription`/`repetitive`) | preserved on past **and** future/pending instances |
| transfer create/edit | `default` (or `subscription`/`repetitive` for a recurring transfer) | never `upcoming`/`lent`/`borrowed` |
| loan opening entry | `lent` / `borrowed` | written in the same tx as the loan row (LA-1) |
| loan repayment | linked loan's `lent` / `borrowed` | |
| import (older snapshot) | backfill-derive, else `default` | shares the `0001` backfill logic (see DM-1) |
| restore | unchanged | soft-delete/restore never mutates `kind` |
| destroy | n/a | hard delete |

No transaction duplicate/copy feature exists. The "conversion" in the form is
cross-currency FX for transfers, not a kind change — not a persistence path.

---

## Primary field order (target)

Top → bottom in the form body:

1. **Top tabs** — 3 segments, relabelled per kind (state machine below)
2. **Amount**
3. **Account** *(Decision 1 — moved up here; drives Amount's currency)*
4. **Category** (hidden for `transfer`)
5. **Date** (hidden when kind ∈ {`subscription`, `repetitive`})
6. **Kind selector** + inline **kind card** (recurrence card / loan card / none)
7. **Title** (placeholder = resolved category name, or "Untitled")
8. **Notes**
9. **Attachments**
10. below Attachments, in current internal order: to-account + conversion
    (transfer), goal, budget, tags, location, refund toggle,
    delete/restore/destroy actions.

## Top-tab label state machine

| kind | linked loan | tab labels | tab 0 | tab 1 | tab 2 |
|---|---|---|---|---|---|
| default / upcoming | – | Expense / Income / Transfer | expense | income | transfer (hidden for `upcoming`) |
| subscription / repetitive | – | Expense / Income / Transfer | expense | income | transfer |
| lent / borrowed | none (new loan) | Lent / Borrowed | expense | income | hidden |
| lent / borrowed | existing `lent` loan | Collected | hidden | income (locked) | hidden |
| lent / borrowed | existing `borrowed` loan | Paid | expense (locked) | hidden | hidden |

- Selecting tab 0 / tab 1 while kind ∈ {lent, borrowed} sets `kind` + `type`
  together via `getKindForLoanType` inverse (tab 0 → lent+expense, tab 1 →
  borrowed+income).
- On a repayment the single relevant tab is shown selected and locked; `type` is
  forced by the linked loan.

---

## Slice 1 — `kind` column + form reshape (foundation)

### DB — additive only, no table rebuild

```sql
ALTER TABLE transactions ADD COLUMN kind TEXT NOT NULL DEFAULT 'default'
  CHECK (kind IN ('default','upcoming','subscription','repetitive','lent','borrowed'));
```

`ADD COLUMN` with a constant default is metadata-only in SQLite regardless of
table size; the column-level CHECK rides along. The existing `subtype` CHECK is
**left as-is** (still lists old values) — CHECK is write-only enforced, so a
loose constraint on a column we stop writing those values to is harmless. Do
**not** rebuild `transactions`.

**No `idx_tx_kind`.** No current query filters by `kind` alone (lists filter by
account / date / `is_deleted`; the upcoming section filters `is_pending`). Add a
`kind` index only when a kind-filtered query actually lands.

Migration `drizzle/0001_*.sql` — generate `ADD COLUMN` with `drizzle-kit
generate`, hand-add the guarded backfill `UPDATE`s (idempotent — a re-run is a
no-op):

1. `ALTER TABLE transactions ADD COLUMN kind …` (above)
2. `UPDATE transactions SET kind='repetitive'
   WHERE (recurring_id IS NOT NULL OR subtype='recurring') AND kind='default';`
   *(the durable "is a recurring instance" signal in this codebase is
   `recurring_id`; current code never writes `subtype='recurring'` — that value
   is only possible in Flutter-era legacy rows, kept in the OR as belt-and-braces.)*
3. `UPDATE transactions SET kind = CASE
      (SELECT loan_type FROM loans WHERE loans.id = transactions.loan_id)
      WHEN 'lent' THEN 'lent' WHEN 'borrowed' THEN 'borrowed' ELSE kind END
   WHERE loan_id IS NOT NULL AND kind IN ('default','repetitive');`
   *(loan link wins over recurring)*
4. `UPDATE transactions SET kind='upcoming'
   WHERE is_pending=1 AND kind='default' AND type <> 'transfer';`

**No `subtype` cleanup step.** An earlier draft NULLed the legacy
`recurring`/`one-time`/`loan_*` subtypes — that was wrong: `src/app/accounts/`,
account detail, category detail, `summary-card`, and
`stats-data.computeExpenseBySubtype` still filter on `LOAN_*` / `recurring` /
`one-time`, and `loan-service.createLoan` + the loan Collect/Settle flow still
*write* `LOAN_*`. `kind` is the new axis and is now on every row; `subtype`
keeps its legacy values. Retiring `LOAN_*` onto `kind`+`type`+opening-entry
helper is **Slice 4** (loans engine); retiring `recurring`/`one-time` (and
reworking/removing `computeExpenseBySubtype`) rides with the later slice that
owns that stat.

**No `BEGIN; … COMMIT;` in the file** — verified: `drizzle-orm`'s async sqlite
migrator (`sqlite-core/dialect.cjs` `async migrate`) wraps all pending migration
files in one `session.transaction()`, so a failing statement rolls the whole
file back and the next launch retries cleanly.

#### Migration `0001` validation checklist (run on a production-shaped DB copy)

- [ ] `PRAGMA foreign_key_check` clean before and after
- [ ] `SELECT count(*) FROM transactions` unchanged
- [ ] every `0000` index still present (`SELECT name FROM sqlite_master WHERE
      type='index'`) — additive migration cannot drop them; confirm anyway
- [ ] no triggers existed in `0000` to lose (verify) — additive migration is
      inherently rebuild-free
- [ ] `#(kind='repetitive')` == pre-migration `#((recurring_id IS NOT NULL OR
      subtype='recurring') AND loan_id IS NULL)`
- [ ] `#(kind IN ('lent','borrowed'))` == pre-migration `#(loan_id IS NOT NULL)`;
      each matches its loan's `loan_type`
- [ ] `#(kind='upcoming')` == pre-migration `#(is_pending=1 AND type<>'transfer'
      AND recurring_id IS NULL AND subtype IS NOT 'recurring' AND loan_id IS NULL)`
- [ ] `#(kind='default')` == the remainder; no row left `kind IS NULL`
- [ ] pending recurring instances are `repetitive`, not `upcoming`
- [ ] `subtype` column untouched — every pre-migration `subtype` value (incl.
      `refund`, `loan_*`, `recurring`, `one-time`) is exactly as before
- [ ] re-running the file against the migrated DB changes nothing

### Types / rows / mappers / schema / ledger

- `src/types/transactions.ts` — add `TransactionKindEnum` + `TransactionKind`;
  `Transaction` gains `kind`. **`TransactionSubTypeEnum` is left intact** —
  `RECURRING`/`ONE_TIME`/`LOAN_*` are still read by the accounts/category/summary
  screens and written by the loans flows. Retiring them is Slice 4 (`LOAN_*`) and
  a later stats slice (`recurring`/`one-time`).
- `src/database/types/rows.ts` — `RowTransaction.kind: string`.
- `src/database/mappers/transaction.mapper.ts` — map `kind`.
- `src/database/drizzle/schema.ts` — `kind` column + CHECK.
- `src/database/drizzle/read-models/transaction-read-model.ts` — add
  `kind: transactions.kind` to `txSelection`.
- `src/domain/transaction-kind.ts` — **CSI-1 helper module** (new).
- `src/schemas/transactions.schema.ts` — add
  `kind: z.enum(TransactionKindEnum).default("default")`;
  `superRefine` calls `isKindTypeValid`. Remove `subtype`-carries-recurring/loan
  assumptions.
- `src/database/services/ledger-service.ts`
  - `createTransaction` / `updateTransaction` persist `kind`; add the CSI-2
    pending assert.
  - `confirmTransaction`: when the confirmed row was `kind='upcoming'`, also
    `SET kind='default'`.

### Form restructure — `src/components/transaction/transaction-form-v4/`

`git mv src/components/transaction/transaction-form-v3 …/transaction-form-v4`
(preserve history), then split `index.tsx` and add the new files.
`src/app/transaction/[id].tsx` is the only importer.

| File | Responsibility |
|---|---|
| `index.tsx` | Thin coordinator (~150–200 lines). Renders the fixed skeleton, wires the hook, places pickers. No submit/branch logic. |
| `use-transaction-form.ts` | **Deep module.** Owns the RHF instance, `kind` state, `recurrence` state, `loanDraft` state, `linkedLoanId`, tab-label derivation, `onKindChange` transition matrix, and all submit / delete / restore / destroy branching. Returns a stable object (see below). |
| `use-transaction-form.submit.ts` | Pure builders: `buildTransactionPayload`, `buildRecurringRuleInput`, `buildLoanCreateInput`. No IO — unit-testable. |
| `on-kind-change.ts` | Pure `onKindChange(prev, next, state) → partial state` transition function (see ES / KT rules). |
| `transaction-top-tabs.tsx` | Replaces `transaction-type-selector.tsx`. Props: `labels`, `value`, `onChange`, `hiddenSlots?`, `lockedTo?`. |
| `form-kind-selector.tsx` | `ListItem` → bottom-sheet of 6 kinds; renders the active kind card beneath. |
| `form-kind-card.tsx` | Switch → `RecurrenceCard` (S2) / `LoanCard` (S4) / `null`. |
| carried by the `git mv`, reused | `form-account-picker`, `form-to-account-picker`, `form-conversion-section`, `form-category-picker`, `form-goal-picker`, `form-budget-picker`, `form-tags-picker`, `form-date-section`, `form-notes-section`, `form-attachments-section`, `form-footer`, `form-delete-actions`, `form-modals`, `use-form-*`, `form.styles.ts`. |
| dropped / repurposed | `form-recurring-section.tsx` → `RecurrenceCard`; `form-loan-picker.tsx` → the "link existing loan" picker inside `LoanCard`. |

`src/app/transaction/[id].tsx` — import v4; `initialType`/`initialSubtype`
plumbing becomes `initialKind` (still from route params; keeps `?type=`,
`?loanId=`, adds `?kind=`).

### Hook contract (`useTransactionForm`)

Returns `{ control, watch, setValue, errors, isDirty, isSaving, kind, setKind,
tabLabels, tabHiddenSlots, tabLockedTo, topTabType, onTopTabChange, recurrence,
setRecurrence, loanDraft, setLoanDraft, linkedLoanId, linkExistingLoan,
unlinkLoan, canEditKind, lockedFields, submit, remove, restore, destroy }`.

`setKind` internally runs `onKindChange`. `canEditKind` / `lockedFields` express
the edit-semantics locks (ES-*).

### ES — transaction edit semantics

| scenario | allowed via normal form? |
|---|---|
| **ES-1** `default ↔ upcoming` | Yes. Just the kind + `is_pending`. `updateTransaction`'s existing balance reconciliation applies/reverses the delta on the pending transition. |
| **ES-2** `subscription ↔ repetitive` (on an instance) | Yes — label only. Updates the instance `kind`. If the instance is rule-linked, also update the rule template's kind marker via the `this_and_future` scope path. |
| **ES-3** `subscription/repetitive → default/upcoming` on a rule-linked instance | Yes, but it **detaches** the instance from the rule (`detachFromRule`, same as the existing "this" edit scope) — the rule keeps generating. Warn in the recurring-edit scope modal. |
| **ES-4** any kind → `lent`/`borrowed` on an **existing** transaction | **No.** Creating a loan link on edit is disallowed; user creates a fresh transaction. `canEditKind` is false when editing and target is lent/borrowed. |
| **ES-5** loan-linked transaction (opening or repayment): change `kind`, `type`, or `loanId` | **No.** `lockedFields` includes `kind`, `type`, `loanId`, `toAccountId`. Enforced in the hook (controls disabled) **and** re-asserted in `updateTransaction` (ignore/throw on a changed locked field). |
| **ES-6** loan **opening entry**: change `amount` / `account` / `category` | **No** via the transaction form — these define the loan. Editable only through the loan editor (`settings/loans/[loanId]/modify`), which updates the loan row and the opening entry together in one tx. The transaction form may still edit `date`, `title`, `notes`, `attachments`, `tags`. |
| **ES-7** loan **repayment**: change `amount` | Yes, within `0 < amount ≤ remainingAmount + thisRepayment` (this row already counts toward `remaining`). `account`/`category`/`date`/`title`/`notes` editable. Recompute progress on save; may close/re-open the loan (LP-*). |
| **ES-8** recurring **rule** recurrence (interval/unit/until) | Editable via the `this_and_future` scope only — rebuilds `rules` + `range` (S2). `this` scope edits the single instance's date only. |

`transactionSchema` cannot see loan data; ES-5/6/7 amount bounds are enforced in
`use-transaction-form.submit.ts` + a guard in the ledger/loan service, not zod.

### KT — `onKindChange(prev, next, state)` transition matrix

Never clears user content (amount, account, category, date, title, notes,
attachments, tags). Only resets kind-scoped scratch state:

| next | reset |
|---|---|
| `default`, `upcoming` | clear `recurrence`; clear `loanDraft`; clear `linkedLoanId` if it was set by lent/borrowed; keep `toAccountId` only if `type==='transfer'` |
| `subscription`, `repetitive` | init `recurrence` to `{interval:1, unit:'month'}` if empty; clear `loanDraft` / `linkedLoanId`; hide Date (start = `transactionDate`, RS-1) |
| `subscription ↔ repetitive` | keep `recurrence` |
| `lent`, `borrowed` | clear `recurrence`; init `loanDraft` (`name = title || category?.name`); set `type` (lent→expense, borrowed→income); clear `toAccountId` + conversion |
| leaving `transfer` (any next) | clear `toAccountId`, `conversionRate` |

In **edit** mode, `setKind` is a no-op when `!canEditKind` (ES-4/ES-5).

### Acceptance — Slice 1

- Fresh install: create expense/income/transfer with the new field order; saves
  and appears in the list.
- Migration validation checklist above passes on a production-shaped DB copy.
- Editing a migrated recurring transfer round-trips (`repetitive` + `transfer`
  accepted by the schema).
- Every ES row behaves as tabled; locked fields are visibly disabled and
  server-side re-asserted.
- `index.tsx` is pure wiring — no submit/branch logic (that lives in the hook +
  pure builders). Line count is JSX-tree-bound (~350 after Task 9, may grow with
  the kind selector); the bar is "no logic in the coordinator", not a number.
- `pnpm types`, `pnpm lint`, `pnpm structure`, `pnpm check-i18n-keys` pass.

---

## Slice 2 — recurrence: interval + unit

### Types

```ts
export type RecurrenceUnit = "day" | "week" | "month" | "year"
export interface Recurrence { interval: number; unit: RecurrenceUnit }  // interval: integer 1..999
```

Delete `RecurringFrequency`, `RECURRING_OPTIONS`, every `"biweekly"` branch. Keep
`RecurringEndEnum` only if still referenced after the occurrences end-type is
removed (Decision 3) — otherwise delete it too.

### `src/utils/recurrence.ts`

- `buildRRuleString({ interval, unit, startDate, until? })` — `FREQ_MAP` keyed by
  unit (`day→DAILY … year→YEARLY`); `interval` passed to `RRule`. `count` param
  removed (Decision 3).
- `countOccurrencesBetween(start, until, recurrence): number` —
  **`rrule.between(start, until, /*inc*/ true)` length. Inclusive of the start
  occurrence.** This is exactly what `synchronizeRecurringTransaction` spawns
  through `until`, so the "(×N)" shown in the form equals the number of
  instances generated. State this in tests and acceptance.
- **new** `parseRecurrence(ruleString): Recurrence` for the edit screen:
  - missing `INTERVAL` → `interval = 1`
  - `FREQ` absent / unrecognised → fallback `{ interval: 1, unit: "month" }` +
    `logger.warn`
  - malformed / unparseable RRULE → same fallback + `logger.warn`; **never
    throws into render**
  - `INTERVAL` non-integer or `< 1` → `Math.max(1, Math.floor(n))`;
    `> 999` → clamp to 999

### RS — recurrence date semantics

- **RS-1 — start date (new subscription/repetitive):** the Date field is hidden,
  so start = the form's `transactionDate`, which for these kinds is
  `new Date()` at form open (device-local). No future-start UI in v1.
- **RS-2 — start date (editing an existing rule):** the rule's **original
  `range.from`** — never recomputed. Changing interval/unit keeps this anchor;
  changing "until" moves only `range.to`.
- **RS-3 — until normalisation:** the picked "until" date is normalised to
  **end-of-day device-local** before building the RRULE / counting, so "until
  Oct 16" includes Oct 16. Stored `range.to` = that timestamp; Forever →
  `range.to` = far-future sentinel (`new Date(2099,11,31)` — keep the existing
  sentinel).
- **RS-4 — `until < start`:** no valid occurrences. Form shows "(×0)" and blocks
  save with a validation message. A rule is never persisted with
  `range.to < range.from`.
- **RS-5 — timezone:** `dtstart` and all comparisons use local `Date`; storage
  is ISO. `countOccurrencesBetween` and the synchronizer share the same anchor
  (`range.from`), so counts and spawns agree.

### `src/components/transaction/transaction-form-v4/recurrence-card.tsx`

Replaces `form-recurring-section.tsx`. Discrete controls (not an interpolated
sentence — see i18n):

- **"every" `[N]` `[unit]`** — `[N]` tappable → numeric stepper modal (min 1,
  max 999, integer); `[unit]` → native picker modal day / week / month / year
  (reuse `src/components/selector-modals/`).
- **"Until `[ date | Forever ]`"** — placeholder "Until forever"; tap → native
  date picker (`use-form-date-picker`). When set: show `<date> · ×N` where
  `N = countOccurrencesBetween(start, untilEndOfDay, recurrence)`, plus a reset
  (✕) that returns to Forever.
- Default state `{ interval: 1, unit: "month" }`, `until: null`.
- On the edit screen, initialise from `parseRecurrence(rule.rules[0])` +
  `rule.range`.

### Edit behavior

- Editing interval/unit/until on an existing rule = the `this_and_future` scope
  (ES-8): `updateRecurringRule` rewrites `rules[0] = buildRRuleString(...)` and
  `range` (keeping `range.from` per RS-2), and resets
  `last_generated_transaction_date` to the max already-generated occurrence
  `≤ now` so the next sync continues cleanly without duplicating or skipping.
  Add `updateRecurringRule(ruleId, { recurrence, until })` to
  `recurring-transaction-service.ts`.
- `this` scope still edits only the single instance's fields.

### Migration — none

Stored RRULE strings already carry `FREQ`+`INTERVAL` (`buildRRuleString` always
built `new RRule({ freq, interval })`; biweekly emitted `FREQ=WEEKLY;INTERVAL=2`).
`parseRecurrence` handles any legacy string at read time. **Never rewrite a
user's `rules` blob in a migration** — a parse bug there is irreversible.

### Acceptance — Slice 2

- New "every 2 weeks until <date>" subscription: the "(×N)" shown equals the
  number of instances `synchronizeAllRecurringTransactions` produces through
  `<date>`, **counting the first occurrence**.
- Editing a migrated biweekly rule shows "every 2 weeks".
- `parseRecurrence` returns the fallback (not a throw) for a deliberately
  corrupted `rules` value; the edit screen still renders.
- Reset returns "until" to Forever and `range.to` to the sentinel.
- `until` set before `start` blocks save with "(×0)".

---

## Slice 3 — `upcoming` as a first-class kind

`upcoming` = an unpaid transaction that does not count toward balance or stats
until confirmed. `is_pending` already behaves this way for balance and budgets.

### Changes

- `buildTransactionPayload`: `kind === 'upcoming'` ⟹ `isPending = true`
  (CSI-2). `requiresManualConfirmation` follows the existing `requireConfirmation`
  preference.
- `confirmTransaction` clears `is_pending` **and** sets `kind='default'` for an
  `upcoming` row (Slice 1). Recurring pending instances keep their kind.
- **Close CSI-3** — walk the checklist, add `is_pending` guards where missing,
  record each as an acceptance line.
- `transaction-item` + transaction detail: "Upcoming" chip (shown when
  `kind==='upcoming'`) + a "Mark paid" / "Mark deposited" action (label by
  tab shape) wired to `confirmTransaction`.
- `upcoming-transactions-section` — align copy with the kind name; it already
  lists pending rows.
- **Auto-confirmation is split into two per-kind switches** (replaces the single
  `requireConfirmation` pref). `autoPaySubscriptions` (default on) governs
  `subscription` / `repetitive` due instances; `autoPayUpcoming` (default off)
  governs `kind === 'upcoming'`. `isPreapproved(row, { autoPaySubscriptions,
  autoPayUpcoming })` in `auto-confirmation-service.ts` is the single resolver;
  `shouldAutoConfirm` delegates to it. A row's frozen `requiresManualConfirmation`
  flag still wins as an explicit opt-out. New rows no longer bake the pref in —
  the live switch decides. Settings screen (`preferences/pending-transactions`)
  now shows the two switches + Show on home + Notify me.

### Acceptance — Slice 3

- Creating an `upcoming` expense leaves account balance and this-month stats
  unchanged; "Mark paid" applies the delta and flips the row to `default` /
  `is_pending=0`.
- Every CSI-3 checklist item verified — no aggregate counts an `is_pending=1`
  row.
- Restoring a soft-deleted `upcoming` row keeps `kind='upcoming'`,
  `is_pending=1`, no balance applied.

---

## Slice 4 — loans engine: one-time vs long-term

### DB — additive

```sql
ALTER TABLE loans ADD COLUMN term TEXT NOT NULL DEFAULT 'one_time'
  CHECK (term IN ('one_time','long_term'));
```

Migration `drizzle/0002_*.sql`: the `ADD COLUMN`, then
`UPDATE loans SET term='long_term' WHERE term='one_time';` — every loan created
before this migration was a screen-created progress loan.

Validation: `#(loans)` unchanged; every pre-existing loan `term='long_term'`;
`PRAGMA foreign_key_check` clean; re-run = no-op.

### Types

`src/types/loans.ts` — `LoanTermEnum = { ONE_TIME, LONG_TERM }`,
`Loan.term: LoanTerm`. Loan mapper / read-model select `term`. `Loan` gains
computed `remainingAmount`, `progress`, `isClosed` (below). Loan-service /
mapper is the single place these are computed.

### Definitions (product owner)

- **Lent** (one-time by default) — money lent out. Opening entry is
  **expense-shaped**, real balance decrease (`getBalanceDelta` → −amount,
  unchanged). "Negative cash flow until Collected."
- **Borrowed** (one-time by default) — money borrowed. Opening entry is
  **income-shaped**, real balance increase. "Positive cash flow until Settled."
- A **partial** Collect/Settle promotes `term` → `long_term`; thereafter it is
  today's progress-tracked loan.

### LP — progress / remaining math (exact)

For a loan with principal `P = loans.principal_amount`:

```
openingType   = getOpeningTypeForLoan(loanType)     // lent→expense, borrowed→income
repaymentType = getRepaymentTypeForLoan(loanType)   // lent→income,  borrowed→expense

repayments = Σ amount  of non-deleted, non-pending transactions where
             loan_id = loan.id  AND  type = repaymentType
             (the opening entry has type = openingType, so it is excluded)

remainingAmount = max(0, P - repayments)
progress        = P > 0 ? clamp(repayments / P, 0, 1) : 1
isClosed        = progress >= 1        // one-time: "closed"; long-term: "completed" — same check
```

- **LP-1** Repayments may not exceed `remainingAmount`. Form validates
  `0 < amount ≤ remainingAmount` for a repayment; "Collect All" / "Settle All"
  uses `remainingAmount` (not `P`).
- **LP-2** Zero / negative amounts already blocked by the schema (`amount > 0`).
- **LP-3** Concurrency: writes serialise through the write-queue; each repayment
  recomputes `remainingAmount` **inside** its `runInTransaction` and rejects if
  it would exceed it. Two racing repayments: the second sees the first's row.
- **LP-4** Promotion is computed **after** inserting the partial repayment, in
  the same tx: `if term='one_time' AND 0 < progress < 1 → term='long_term'`.
  If the "partial" actually reaches `progress ≥ 1`, the loan closes as one-time
  (no promotion). Promotion is **one-way** — deleting the promoting repayment
  later does not demote (LX-3).
- **LP-5** Full repayment of a `long_term` loan → `progress ≥ 1` → shown
  completed (existing behavior); no term change.

### OE — opening-entry invariant

No new column. A loan's **opening entry** is the non-deleted, loan-linked
transaction whose `type = getOpeningTypeForLoan(loan.loanType)`. Exactly one
exists per loan (the form path and `loan-service.createLoan` each create exactly
one). Repayments are the opposite `type`.

Helpers (loan-service or a loan util):
`getLoanOpeningTransaction(loanId): Promise<Transaction | null>`,
`isLoanOpeningTransaction(tx, loan): boolean`.

Screen-created `long_term` loans keep the same rule (loan-service already writes
one opening cash-flow tx). Loans are single-account — cross-currency / transfer
loans are out of scope.

### LA — atomicity

Every multi-write loan operation runs in **one** `runInTransaction`
(re-entrancy joins nested service calls into the same SQLite tx — verify nested
`drizzleDb.transaction` shares the frame during implementation):

- **LA-1** create loan + opening entry (form path) — new
  `loan-service.createLoanWithOpeningEntry(loanInput, txPayload)`:
  `runInTransaction("loan.createWithOpening", …)` inserts the loan row, then the
  transaction row (`loan_id` set, `kind` = lent/borrowed, `type` = openingType),
  applies the balance delta, inserts tags. Any failure rolls back the whole
  thing — never a loan without its opening entry, never an orphan tx.
- **LA-2** partial repayment + promotion — one tx: insert repayment tx (+ balance
  delta) → recompute progress → `UPDATE loans SET term='long_term'` if LP-4.
- **LA-3** full repayment / close — insert repayment tx (+ delta). Closure is
  computed (LP), nothing else to write.
- **LA-4** link existing loan — just `createTransaction` with `loan_id` + derived
  `kind`/`type`; single tx already.
- `loan-service.createLoan` keeps its current signature for screen callers, gains
  `term?: LoanTerm` (default `one_time`) and `withOpeningTransaction?: boolean`
  (default `true`). The form path uses `createLoanWithOpeningEntry` and does
  **not** double-create.

### `loan-card.tsx` (kind ∈ {lent, borrowed})

- **New loan** (default): `name` input (default `title || category?.name`),
  optional `dueDate`. Principal = the form `amount` (editable — it *is* the
  principal). Account + category from the form.
- **"Link existing loan instead"** switch → shows the repurposed loan picker
  filtered to loans whose `loanType` matches the active tab (not by
  account/category). Picking one:
  - sets `linkedLoanId`, locks the top tab to Paid/Collected, locks
    `kind`/`type`/`loanId`,
  - shows `remainingAmount` as helper text; the amount field is bounded by LP-1;
    a "max" affordance fills `remainingAmount`.

Submit (`use-transaction-form.submit.ts` + hook):

- new-loan → `buildLoanCreateInput` → `createLoanWithOpeningEntry(...)` (LA-1).
- link → `createTransaction({ …payload, loanId, kind: linkedLoan.loanType,
  type: getRepaymentTypeForLoan(linkedLoan.loanType) })` (LA-4).

### Action modal / detail (`src/components/loans/loan-action-modal.tsx`)

- one-time loan: **Collect All / Settle All** → repayment for `remainingAmount`
  (LA-3), loan closes. **Partially Collect / Settle** → repayment for the entered
  amount (LP-1) + promotion (LA-2).
- long-term loan: unchanged.
- Loan list / detail show a **One-time / Long-term** badge and the closed state.

### LX — deletion & restore of loan transactions

| action from the transaction screen | behavior |
|---|---|
| **LX-1** delete a **repayment** (soft) | Allowed. Recompute progress on the next read — may re-open a closed one-time loan or drop a long-term below 1. |
| **LX-2** delete the **opening entry** (soft) | **Blocked** in the transaction form while the loan exists. The delete action routes to "Delete loan", which follows the existing loan-delete semantics (removes the loan + its linked transactions); if repayments exist, it warns first. |
| **LX-3** delete the repayment that caused promotion | Promotion is **not** reversed — the loan stays `long_term`. (One-way; avoids thrash.) |
| **LX-4** delete a repayment on a **closed** one-time loan | Allowed; re-opens the loan (`progress` drops below 1). |
| **LX-5** restore a soft-deleted repayment | Re-adds it to progress; may re-close / re-complete. |
| **LX-6** `destroy` (hard) a repayment | Same progress recompute, permanent. |
| **LX-7** restore a soft-deleted opening entry | Only reachable via loan restore; the loan and its opening entry restore together. |

`FormDeleteActions` in the form must branch on `isLoanOpeningTransaction` (LX-2)
vs repayment (LX-1) vs neither.

### Loans-screen loan form

Add a segmented **One-time / Long-term** toggle (Decision 5), default
`Long-term`. `One-time` from the screen behaves exactly like the form-created
one-time loan.

Per ES-6, editing a loan's `principalAmount` / `accountId` / `categoryId` on
`settings/loans/[loanId]/modify` must update the loan row **and** its opening
entry (OE) in a single `runInTransaction` (extend `loan-service.updateLoanById`;
recompute the opening entry's balance delta). Loan `term` itself is not
user-editable after creation in v1 (it only advances one-way via LP-4).

### Acceptance — Slice 4

- Form → "Lent", amount/account/category, name defaults to category → **one**
  `runInTransaction` writes a `one_time` lent loan + its expense opening entry;
  balance drops by amount. Kill the process mid-write (simulated failure) →
  neither row persists.
- Loan detail → "Collect All" writes a full income repayment; balance returns;
  loan shows closed.
- "Partially Collect" writes a partial income repayment in one tx and flips the
  loan to `long_term` with a progress bar; deleting that repayment leaves it
  `long_term` (LX-3).
- Repayment amount > `remainingAmount` is rejected (LP-1).
- Form → "Borrowed" → "Link existing loan instead" → pick a borrowed loan → top
  tab "Paid" locked, `remainingAmount` shown → save writes an expense repayment.
- Opening-entry delete from the form routes to "Delete loan" (LX-2).
- `0002` validation checklist passes on a production-shaped DB copy.

---

## Slice 5 — title display-time derivation (small, independent)

### `src/stores/transaction-item-appearance.store.ts`

- Rename `showCategoryForUntitled` → `showUntitledForBlankTitle`, default
  `false` (blank title now shows the **category name** by default).
- `persist` version bump + `migrate`: `showUntitledForBlankTitle = !oldValue`
  (old default `false` → new `true`; old `true` → new `false`). Preserves each
  user's current visible behavior. If `migrate` can't read the old value,
  default `false` — the miss is cosmetic, not data loss.
- `showCategory` (subtitle toggle) untouched.

### Display

`src/components/transaction/transaction-item/index.tsx` + transaction detail
header:

```ts
const displayTitle =
  trimmedTitle ??
  (showUntitledForBlankTitle ? untitledLabel : (category?.name ?? untitledLabel))
```

### Screens

- `settings/preferences/transaction-appearance.tsx` — relabel the toggle
  ("Show 'Untitled' for blank titles").
- Form title `Input` placeholder = resolved category name (fallback "Untitled"),
  matching the display rule.

### Acceptance — Slice 5

- Existing users see no change until they toggle the setting.
- New users: a blank-title transaction shows its category name in list + detail;
  enabling the toggle switches it to "Untitled".

---

## Cross-cutting

### i18n + RTL

- The recurrence card renders **discrete controls** ("every" `[N]` `[unit]`),
  **not** an interpolated sentence — so translation reduces to the unit noun
  with i18next `count` plurals: `recurrence.unit.day` / `.week` / `.month` /
  `.year` (Arabic gets all its plural categories via i18next). The "×N" count is
  a bare `×` glyph + number, LTR-safe inside an RTL layout.
- New keys: 6 kind labels; tab labels `Lent`/`Borrowed`/`Paid`/`Collected`/
  `Settled`; `recurrence.every`, `recurrence.until`, `recurrence.forever`,
  `recurrence.reset`; `loan.term.oneTime` / `.longTerm`; `action.markPaid` /
  `.markDeposited` / `.collectAll` / `.settleAll` / `.partiallyCollect` /
  `.partiallySettle`; `loan.remaining`.
- Add to `src/i18n/translation/en.json` **and** `ar.json`;
  `pnpm check-i18n-keys` passes.
- **RTL acceptance:** top tabs, kind selector row + sheet, recurrence card, loan
  card all mirror correctly; numeric "×N" and the stepper stay LTR;
  screenshots in both directions.

### DM-1 — data management import / export

Actual backup architecture (confirmed during implementation): export =
`data-management-service.ts` `buildBackupInMemory()` (`SELECT *`, so new columns
ride along automatically); the import column allowlist + version constant live
in `src/database/backup/backup-format.ts` (`ALLOWED_COLUMNS`, `SCHEMA_VERSION`);
row insertion is `src/database/backup/backup-import-plan.ts` `insertRows()`;
`import-snapshot.ts` is only emergency-snapshot file IO.

- Add `"kind"` to `ALLOWED_COLUMNS.transactions` (and `"term"` to
  `ALLOWED_COLUMNS.loans` in Slice 4); bump `SCHEMA_VERSION` to 4.
- **One-release backward window (revised — live users, no server backup).**
  `validateBackup` accepts `MIN_SUPPORTED_SCHEMA_VERSION (3) ≤ meta.schemaVersion
  ≤ SCHEMA_VERSION (4)` and still refuses anything older or newer with a clear
  message. v3 → v4 differs *only* by the additive `transactions.kind` column, and
  `insertRows` already backfills a missing `kind` via `deriveKind`, so a v3
  backup restores losslessly. This deliberately relaxes the previous
  "reject every non-current version" policy for exactly one column bump; drop
  `MIN_SUPPORTED_SCHEMA_VERSION` back to `SCHEMA_VERSION` once v3 exports have
  aged out. A per-version upgrade framework is still out of scope.
- **`deriveKind` fallback** (`src/domain/derive-kind.ts`, pure, type-only
  imports) still earns its place: it runs in `insertRows` for any transaction
  row that reaches insertion WITHOUT a `kind` — i.e. `recoverInterruptedImport`
  emergency snapshots written by an older build, and hand-edited /
  programmatically-built snapshots. Precedence mirrors migration `0001`: loan
  link > recurring (`recurringId != null || subtype === 'recurring'`) >
  pending(non-transfer) > default. Loan type is resolved from an in-memory
  `buildLoanTypeMap(data.loans)` (no import reorder); unresolvable → `null`.
- **Round-trip (same version):** export → wipe → import → `kind` identical for
  every row (acceptance).

### Old-value cleanup — deferred out of Slice 1

Slice 1 only guarantees `TransactionTypeSelector`, `transaction-form-v3`, and
`initialSubtype` are gone (they were pure form plumbing). The `subtype`-value
retirement (`loan_*`, `recurring`, `one-time`) and the recurrence-internal
renames (`biweekly`, `RecurringFrequency`, `RECURRING_OPTIONS`,
`endAfterOccurrences`) belong to their owning slices:

- `LOAN_*` subtypes → **Slice 4** (loans engine): migrate the accounts /
  account-detail / category-detail / `summary-card` filters and the
  `loan-service.createLoan` + Collect/Settle writes onto `kind` + `type` + the
  opening-entry helper, then drop the enum values.
- `recurring` / `one-time` subtypes + `computeExpenseBySubtype` /
  `ExpenseBySubtype` → the later stats slice: rework onto `kind`
  (`repetitive`/`subscription`) or delete if unused in the UI.
- `biweekly` / `RecurringFrequency` / `RECURRING_OPTIONS` /
  `endAfterOccurrences` → **Slice 2** (interval+unit recurrence).
- `showCategoryForUntitled` → **Slice 5**.

### Other

- Pre-commit (`pnpm structure`, `pnpm lint:fix`, `pnpm check-number-formatting`,
  `pnpm types`) must pass on every slice.
- No test framework — the pure modules (`src/domain/transaction-kind.ts`,
  `use-transaction-form.submit.ts`, `on-kind-change.ts`, `recurrence.ts`) are
  written IO-free so a future harness can cover them; verify manually for now.
- Blast radius: `transaction-form-v3` and `TransactionTypeSelector` are each
  imported only by the form. `data-management` snapshot version bump is the only
  cross-app contract touched.

---

## Migration order

`0001` add `transactions.kind` + backfill (Slice 1) → `0002` add `loans.term` +
backfill (Slice 4). Slices 2, 3, 5 need no SQL migration.

**Both ship in the same release** (revised 2026-10-10; originally `0001` was to
ship alone and `0002` a release later). Why this is safe: both are additive
(`ADD COLUMN` + backfill `UPDATE`s, no table rebuild), the validation
checklists pass on a production-shaped DB copy, and the migrator applies every
pending migration inside one transaction (see Migration safety), so a user's
database either gets both or neither — never `0001` without `0002`. The
isolation benefit of one-migration-per-release does not outweigh shipping the
redesign across two releases with a half-finished loans model.

## Migration safety (live users — no server backup)

`useMigrations` in `src/app/_layout.tsx` gates app render on migrations
succeeding; a throwing or corrupting migration bricks that user's app and can
lose irreplaceable history. See `src/database/forced-migration.ts` for the
repo's existing defensive-migration patterns.

- **Additive only.** `ADD COLUMN` (constant default), backfill `UPDATE`,
  `CREATE INDEX IF NOT EXISTS`. No 12-step table rebuild. Leave loose CHECK
  constraints on existing columns alone.
- **Guarded + idempotent backfills** so a retry after a partial apply is a
  no-op.
- **Transaction behavior (verified).** `useMigrations` → `migrate()` →
  `SQLiteAsyncDialect.migrate` (drizzle-orm `sqlite-core/dialect`) runs *all*
  pending migrations, and records each in `__drizzle_migrations`, inside a
  single `session.transaction(...)`. A failure in any statement rolls back every
  pending migration, so no extra `BEGIN; … COMMIT;` is needed in the `.sql`
  files. Re-check this if drizzle-orm is upgraded.
- **Test against a real DB.** Pull a production-shaped DB (device pull or a user
  data-management export → import) and run each migration on a copy; work the
  validation checklists (`0001`, `0002`).
- **Forward-only.** The expo driver runs no down migrations. A mistake is fixed
  with a corrective forward migration in the next release.
- **Legacy data shapes → read-time**, not migrations (Slice 2 `parseRecurrence`;
  DM-1 `deriveKind`).
- **Snapshot first.** Confirm the `data-management` emergency-snapshot /
  `use-import-recovery` path covers a first-run-after-update failure; if not,
  snapshot immediately before the first pending migration applies.
- `0001` and `0002` ship together (see Migration order). Because they are one
  atomic unit, validate them together on the production-shaped DB copy:
  `0001` checklist, `0002` checklist, `PRAGMA foreign_key_check`, then re-run both
  to confirm the no-op.
