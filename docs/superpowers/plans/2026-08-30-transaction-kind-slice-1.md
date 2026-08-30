# Transaction `kind` axis — Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single `kind` axis to transactions (`default | upcoming | subscription | repetitive | lent | borrowed`), migrate existing data onto it, and restructure the transaction form into a coordinator + `useTransactionForm` hook with a kind selector, top-tab state machine, and edit-semantics locks — without changing recurrence, loans, or upcoming behavior (Slices 2–5).

**Architecture:** New additive SQLite column `transactions.kind` (no table rebuild) with a guarded, idempotent backfill in migration `0001`. A pure domain module `src/domain/transaction-kind.ts` is the single source of truth for kind↔type rules; the zod schema, the form hook, and the ledger service all import it. The 988-line `transaction-form-v3/index.tsx` is `git mv`'d to `transaction-form-v4/` and split into a thin coordinator, a deep `useTransactionForm` hook, pure builder functions, and a pure `onKindChange` transition function. `subtype` shrinks to `refund`-only in the final task once `kind` is everywhere.

**Tech Stack:** Expo SDK 57, React Native New Arch, Drizzle ORM + expo-sqlite, `drizzle-orm/expo-sqlite/migrator` (`useMigrations`), react-hook-form + zod v4, react-native-unistyles v3, i18next, Biome, TypeScript (`tsc --noEmit`). **No test framework** — verification is `pnpm types` + `pnpm lint` + committed `node` check scripts (`node:sqlite`, `node:assert`) + explicit manual QA in the running app.

**Spec:** `docs/superpowers/specs/2026-08-30-transaction-form-kind-redesign-design.md` (rev 2, approved). This plan implements **Slice 1** only. Read the spec's *Cross-slice invariants* (CSI-1…CSI-4), *ES-1…ES-8*, *KT matrix*, and *Slice 1* sections alongside this plan.

## Global Constraints

- **Commit messages / PR bodies carry NO attribution** — no `Co-Authored-By`, no `Claude-Session`, no "Generated with…", no AI/tool mention. Do not GPG-sign. (`CLAUDE.md` rule 1.)
- **Money is integer minor units.** Never `parseFloat`/`toFixed`/`Number()`/`Intl.NumberFormat` in feature code. This slice does not touch money math; keep it that way.
- **No `console.*`** — use `src/utils/logger.ts` (`logger.warn` / `logger.error`).
- **No `any`.** TypeScript strict.
- **Biome import order:** external packages → blank line → `~/` alias imports → blank line → relative imports. Semicolons as-needed (Biome-managed). Run `pnpm lint:fix` before every commit.
- **All unistyles StyleSheets use the callback form** `StyleSheet.create((theme) => ({…}))`, co-located in `*.styles.ts`.
- **Pre-commit hook runs** `pnpm structure`, `pnpm lint:fix` (stages fixes), `pnpm check-number-formatting`, `pnpm types` — all must pass. Every "Commit" step assumes this gate.
- **i18n:** every user-facing string is a key present in **both** `src/i18n/translation/en.json` and `ar.json`; `pnpm check-i18n-keys` must pass.
- **Migrations are additive and forward-only.** `drizzle-orm`'s async sqlite migrator wraps *all* pending migration files in **one** `session.transaction()` (verified in `node_modules/drizzle-orm/sqlite-core/dialect.cjs` `async migrate`), so a failing statement rolls the whole thing back and the next launch retries cleanly — **do not** add explicit `BEGIN`/`COMMIT` to `.sql` files. Statements are still written guarded + idempotent.
- **Do not read/inspect `src/components/icons/**`.**

---

## File Structure

**New files**

| File | Responsibility |
|---|---|
| `src/domain/transaction-kind.ts` | Pure CSI-1 module: kind↔type matrix, loan-type↔kind/repayment-type maps, `isKindTypeValid`. No IO. **Type-only imports only** (`import type …`) so Node's type-stripping elides them and the `.mts` check scripts can load the file with zero runtime resolution. |
| `src/domain/transaction-kind.assertions.ts` | Compile-time exhaustiveness assertions (`satisfies`, `assertNever`). Imported nowhere; picked up by `tsc`. |
| `scripts/checks/verify-transaction-kind.mts` | Runnable `node:assert` sanity check for the CSI-1 module. `node ./scripts/checks/verify-transaction-kind.mts`. |
| `scripts/checks/verify-migration-0001.mts` | Runnable `node:sqlite` validation of migration `0001` against a copied `.db` file. `node ./scripts/checks/verify-migration-0001.mts <path-to-copy.db>`. |
| `drizzle/0001_<name>.sql` | `ALTER TABLE transactions ADD COLUMN kind …` + 4 guarded backfill `UPDATE`s. |
| `src/components/transaction/transaction-form-v4/**` | `git mv` of `transaction-form-v3/` (history preserved), then split. |
| `src/components/transaction/transaction-form-v4/use-transaction-form.ts` | Deep hook: RHF instance, `kind` state, tab-label derivation, `onKindChange` wiring, `canEditKind`/`lockedFields`, submit/delete/restore/destroy branching. |
| `src/components/transaction/transaction-form-v4/use-transaction-form.submit.ts` | Pure `buildTransactionPayload(data, ctx)` (+ stubs `buildRecurringRuleInput`, `buildLoanCreateInput` returning `never`-guarded TODOs for Slices 2/4 — see Task 9). |
| `src/components/transaction/transaction-form-v4/on-kind-change.ts` | Pure `onKindChange(prev, next, state) → Partial<KindScratchState>`. |
| `src/components/transaction/transaction-form-v4/transaction-top-tabs.tsx` | Replaces `transaction-type-selector.tsx`. Props: `labels`, `value`, `onChange`, `hiddenSlots?`, `lockedTo?`. |
| `src/components/transaction/transaction-form-v4/form-kind-selector.tsx` | `ListItem` → bottom-sheet of the 6 kinds; renders `FormKindCard` beneath. |
| `src/components/transaction/transaction-form-v4/form-kind-card.tsx` | `switch(kind)` → placeholder cards for subscription/repetitive/lent/borrowed (real cards land in Slices 2/4); `null` for default/upcoming. |

**Modified files**

| File | Change |
|---|---|
| `src/types/transactions.ts` | Add `TransactionKindEnum` + `TransactionKind`; add `kind` to `Transaction`. (Keep `TransactionSubTypeEnum` values until Task 11.) |
| `src/database/types/rows.ts` | `RowTransaction.kind: string`. |
| `src/database/drizzle/schema.ts` | `kind` column def + CHECK. |
| `src/database/drizzle/read-models/transaction-read-model.ts` | `kind: transactions.kind` in `txSelection`. |
| `src/database/mappers/transaction.mapper.ts` | Map `kind` (`(row.kind as TransactionKind) ?? "default"`). |
| `src/schemas/transactions.schema.ts` | `kind: z.enum(TransactionKindEnum).optional()`; `superRefine` → `isKindTypeValid`. |
| `src/database/services/ledger-service.ts` | Persist `kind` (`data.kind ?? "default"`) in `createTransaction` + `updateTransaction`; CSI-2 pending assert; `confirmTransaction` resets `kind` → `"default"` for an `upcoming` row; ES-5 locked-field re-assert in `updateTransaction`. |
| `src/database/services/recurring-transaction-service.ts` | `RecurringTransactionTemplate` + `CreateRecurringRuleInput` carry `kind`; `parseTemplate` default; spawn passes `kind` into `createTransaction` (CSI-4). |
| `src/database/services/data-management-service.ts`, `src/database/utils/import-snapshot.ts` | Export `kind`; on import of a pre-`kind` snapshot, backfill via shared `deriveKind`; bump snapshot version; reject newer-than-supported snapshots. |
| `drizzle/meta/_journal.json`, `drizzle/migrations.js` | Register `0001`. |
| `src/app/transaction/[id].tsx` | Import `transaction-form-v4`; `initialType` plumbing → keep, add `initialKind` from `?kind=` param. |
| `src/components/transaction/transaction-form-v4/index.tsx` | Reduced to coordinator (~200 lines): skeleton + new field order + wire hook. |
| `src/components/transaction/transaction-form-v4/types.ts` | `TransactionFormV3Props` → `TransactionFormV4Props`: replace `transactionType`/`onTransactionTypeChange`/`initialSubtype`/`onSubtypeChange` with `initialKind`. |
| `src/components/transaction/transaction-form-v4/form-utils.ts` | `getDefaultValues` sets `kind`. |
| various consumers of `TransactionSubTypeEnum.RECURRING/ONE_TIME/LOAN_*` | Task 11: switch to `kind`. |

**Deleted**

| File | Reason |
|---|---|
| `src/components/transaction/transaction-type-selector.tsx` | Replaced by `transaction-top-tabs.tsx` (Task 7). Only importer is the form. |

---

## Task 1: Migration `0001` — add `transactions.kind` + backfill

**Files:**
- Modify: `src/database/drizzle/schema.ts` (transactions table, near line 98 `subtype`)
- Create: `drizzle/0001_<name>.sql` (via `drizzle-kit generate`, then hand-edited)
- Modify: `drizzle/meta/_journal.json`, `drizzle/migrations.js`
- Create: `scripts/checks/verify-migration-0001.mts`

**Interfaces:**
- Consumes: nothing.
- Produces: a `kind TEXT NOT NULL DEFAULT 'default'` column on `transactions` with `CHECK (kind IN ('default','upcoming','subscription','repetitive','lent','borrowed'))`, backfilled per spec Slice 1 steps 2–5. `scripts/checks/verify-migration-0001.mts` — CLI validator.

- [ ] **Step 1: Add the column to the Drizzle schema**

In `src/database/drizzle/schema.ts`, inside the `transactions` table definition, add after the `subtype` column:

```ts
    kind: text("kind").notNull().default("default"),
```

and in the table's constraints array (after the `transactions_subtype_check`):

```ts
    check(
      "transactions_kind_check",
      sql`${table.kind} IN ('default','upcoming','subscription','repetitive','lent','borrowed')`,
    ),
```

Leave the existing `transactions_subtype_check` untouched.

- [ ] **Step 2: Generate the migration SQL**

Run: `pnpm exec drizzle-kit generate`
Expected: creates `drizzle/0001_<random-name>.sql` containing roughly
`ALTER TABLE \`transactions\` ADD \`kind\` text DEFAULT 'default' NOT NULL;`
and updates `drizzle/meta/_journal.json` (+ a new `0001_snapshot.json`).

If `drizzle-kit` emits a full table rebuild instead of `ALTER TABLE ADD COLUMN` (it may, because of the new CHECK), **discard the generated body** and hand-write the file as below — additive only, no rebuild.

- [ ] **Step 3: Hand-edit the migration file to the additive form + backfill**

Replace the contents of `drizzle/0001_<name>.sql` with exactly (keep the `--> statement-breakpoint` separators — the migrator splits on them):

```sql
ALTER TABLE `transactions` ADD `kind` text DEFAULT 'default' NOT NULL CHECK (`kind` IN ('default','upcoming','subscription','repetitive','lent','borrowed'));
--> statement-breakpoint
UPDATE `transactions` SET `kind` = 'repetitive' WHERE (`recurring_id` IS NOT NULL OR `subtype` = 'recurring') AND `kind` = 'default';
--> statement-breakpoint
UPDATE `transactions` SET `kind` = CASE (SELECT `loan_type` FROM `loans` WHERE `loans`.`id` = `transactions`.`loan_id`) WHEN 'lent' THEN 'lent' WHEN 'borrowed' THEN 'borrowed' ELSE `kind` END WHERE `loan_id` IS NOT NULL AND `kind` IN ('default','repetitive');
--> statement-breakpoint
UPDATE `transactions` SET `kind` = 'upcoming' WHERE `is_pending` = 1 AND `kind` = 'default' AND `type` <> 'transfer';
--> statement-breakpoint
UPDATE `transactions` SET `subtype` = NULL WHERE `subtype` IN ('recurring','one-time','loan_borrowed','loan_repayment','loan_lent','loan_received');
```

**Recurring detection uses `recurring_id IS NOT NULL`** (with `subtype='recurring'`
OR'd in for Flutter-era legacy rows) — the current app spawns recurring
instances with `recurring_id` set and `subtype` NULL, so `subtype='recurring'`
alone would miss every recurring instance and a pending one would wrongly become
`upcoming`. This contradicts an earlier draft of this task; the corrected form
above is authoritative.

- [ ] **Step 4: Register the migration for the expo bundler**

`drizzle-kit generate` updates `drizzle/meta/_journal.json` (a new entry with `"idx": 1`, `"tag": "0001_<name>"`). Confirm it did. Then edit `drizzle/migrations.js` to import and map it:

```js
import m0000 from "./0000_safe_maximus.sql"
import m0001 from "./0001_<name>.sql"
import journal from "./meta/_journal.json"

export default {
  journal,
  migrations: {
    m0000,
    m0001,
  },
}
```

- [ ] **Step 5: Write the migration validation script**

Create `scripts/checks/verify-migration-0001.mts`:

```ts
#!/usr/bin/env node
import assert from "node:assert/strict"
import { DatabaseSync } from "node:sqlite"

const dbPath = process.argv[2]
if (!dbPath) {
  console.error("usage: node ./scripts/checks/verify-migration-0001.mts <path-to-copy.db>")
  process.exit(1)
}

const db = new DatabaseSync(dbPath)
const one = (sql: string): number =>
  (db.prepare(sql).get() as { n: number }).n

// FK integrity
assert.equal((db.prepare("PRAGMA foreign_key_check").all() as unknown[]).length, 0, "foreign_key_check must be clean")

// Column exists, no NULLs
assert.equal(one("SELECT count(*) n FROM transactions WHERE kind IS NULL"), 0, "no NULL kind")

// Every kind value is legal
assert.equal(
  one("SELECT count(*) n FROM transactions WHERE kind NOT IN ('default','upcoming','subscription','repetitive','lent','borrowed')"),
  0,
  "all kind values legal",
)

// Loan-linked rows match their loan type
assert.equal(
  one("SELECT count(*) n FROM transactions t JOIN loans l ON l.id = t.loan_id WHERE t.kind <> l.loan_type"),
  0,
  "loan-linked kind matches loan_type",
)

// Every recurring instance is 'repetitive' (unless loan-overridden), never 'upcoming'/'default'
assert.equal(
  one("SELECT count(*) n FROM transactions WHERE recurring_id IS NOT NULL AND loan_id IS NULL AND kind NOT IN ('repetitive')"),
  0,
  "recurring instances (no loan) are 'repetitive'",
)
assert.equal(
  one("SELECT count(*) n FROM transactions WHERE is_pending = 1 AND recurring_id IS NOT NULL AND kind = 'upcoming'"),
  0,
  "pending recurring instances are not 'upcoming'",
)

// No residual non-refund subtype
assert.equal(
  one("SELECT count(*) n FROM transactions WHERE subtype IS NOT NULL AND subtype <> 'refund'"),
  0,
  "only 'refund' subtype remains",
)

// Idempotency: re-running the backfill statements changes nothing
const before = one("SELECT count(*) n FROM transactions WHERE kind <> 'default'")
db.exec("UPDATE transactions SET kind = 'repetitive' WHERE subtype = 'recurring' AND kind = 'default'")
db.exec("UPDATE transactions SET kind = 'upcoming' WHERE is_pending = 1 AND kind = 'default' AND type <> 'transfer'")
assert.equal(one("SELECT count(*) n FROM transactions WHERE kind <> 'default'"), before, "backfill is idempotent")

console.log("migration 0001: OK")
```

- [ ] **Step 6: Verify types + lint**

Run: `pnpm types && pnpm lint`
Expected: PASS (schema change is additive; nothing consumes `kind` yet).

- [ ] **Step 7: Verify the migration on a real-shaped DB**

Obtain a production-shaped SQLite file: in the running app go to Settings → Data Management → Export, pull the exported `.db`/snapshot, or copy the simulator DB
(`xcrun simctl get_app_container booted <bundle-id> data` → `Documents/SQLite/minty_flow_db_v2`).
Copy it to `/tmp/minty-copy.db`, then apply the migration statements manually:

Run:
```bash
sqlite3 /tmp/minty-copy.db < drizzle/0001_<name>.sql
node ./scripts/checks/verify-migration-0001.mts /tmp/minty-copy.db
```
Expected: `migration 0001: OK`. Also spot-check counts:
`sqlite3 /tmp/minty-copy.db "SELECT kind, count(*) FROM transactions GROUP BY kind;"`

- [ ] **Step 8: Verify in-app migration**

Run: `pnpm ios` (or `pnpm android`) on a simulator that already has data from a previous build.
Expected: app boots past the migration gate; existing transactions still list correctly; no crash. In Drizzle Studio (`npx drizzle-kit studio` if wired, else skip) confirm the `kind` column is populated.

- [ ] **Step 9: Commit**

```bash
git add src/database/drizzle/schema.ts drizzle/ scripts/checks/verify-migration-0001.mts
git commit -m "feat(db): add transactions.kind column with backfill migration 0001"
```

---

## Task 2: `TransactionKind` domain type + read-layer plumbing

**Files:**
- Modify: `src/types/transactions.ts:34-54`
- Modify: `src/database/types/rows.ts:28-52`
- Modify: `src/database/drizzle/read-models/transaction-read-model.ts` (`txSelection`, ~line 65-88)
- Modify: `src/database/mappers/transaction.mapper.ts:24-48`

**Interfaces:**
- Consumes: the `kind` column from Task 1.
- Produces:
  - `TransactionKindEnum` (const) + `type TransactionKind` from `~/types/transactions`
  - `Transaction.kind: TransactionKind`
  - `RowTransaction.kind: string`
  - `mapTransaction` populates `kind`

- [ ] **Step 1: Add the enum + type**

In `src/types/transactions.ts`, after `TransactionTypeEnum` / `TransactionType` (around line 41), add:

```ts
export const TransactionKindEnum = {
  DEFAULT: "default",
  UPCOMING: "upcoming",
  SUBSCRIPTION: "subscription",
  REPETITIVE: "repetitive",
  LENT: "lent",
  BORROWED: "borrowed",
} as const

export type TransactionKind =
  (typeof TransactionKindEnum)[keyof typeof TransactionKindEnum]
```

In the `Transaction` interface (around line 71), add after `type`:

```ts
  kind: TransactionKind
```

Do **not** change `TransactionSubTypeEnum` yet (Task 11).

- [ ] **Step 2: Add `kind` to the raw row type**

In `src/database/types/rows.ts`, in `RowTransaction`, add after `subtype: string | null`:

```ts
  kind: string
```

- [ ] **Step 3: Select `kind` in the read model**

In `src/database/drizzle/read-models/transaction-read-model.ts`, in `txSelection`, add after `subtype: transactions.subtype,`:

```ts
  kind: transactions.kind,
```

- [ ] **Step 4: Map `kind`**

In `src/database/mappers/transaction.mapper.ts`, in `mapTransaction`'s returned object, add after `subtype: row.subtype as TransactionSubType,`:

```ts
    kind: (row.kind as TransactionKind) ?? "default",
```

Add `TransactionKind` to the existing type import from `~/types/transactions`.

- [ ] **Step 5: Verify**

Run: `pnpm types`
Expected: PASS. (`Transaction.kind` is now required, but `mapTransaction` — the only constructor of `Transaction` — provides it, and `TransactionWithRelations extends Transaction` so read models are covered.)
If `pnpm types` reports another literal `Transaction` object elsewhere, add `kind: "default"` there and note it in the commit body.

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/types/transactions.ts src/database/types/rows.ts src/database/drizzle/read-models/transaction-read-model.ts src/database/mappers/transaction.mapper.ts
git commit -m "feat: thread transaction kind through the read layer"
```

---

## Task 3: `src/domain/transaction-kind.ts` — CSI-1 helper

**Files:**
- Create: `src/domain/transaction-kind.ts`
- Create: `src/domain/transaction-kind.assertions.ts`
- Create: `scripts/checks/verify-transaction-kind.mts`

**Interfaces:**
- Consumes: `TransactionType`, `TransactionKind`, `TransactionKindEnum` from `../types/transactions`; `LoanType` from `../types/loans`.
- Produces (imported by Tasks 4, 8, 9, 10):
  - `ALLOWED_TYPES_BY_KIND: Record<TransactionKind, readonly TransactionType[]>`
  - `getAllowedTransactionTypes(kind: TransactionKind): readonly TransactionType[]`
  - `isKindTypeValid(kind: TransactionKind, type: TransactionType): boolean`
  - `getKindForLoanType(loanType: LoanType): "lent" | "borrowed"`
  - `getOpeningTypeForLoan(loanType: LoanType): "expense" | "income"`
  - `getRepaymentTypeForLoan(loanType: LoanType): "income" | "expense"`

- [ ] **Step 1: Write the runnable check first (it will fail — module missing)**

Create `scripts/checks/verify-transaction-kind.mts`:

```ts
#!/usr/bin/env node
import assert from "node:assert/strict"

import {
  ALLOWED_TYPES_BY_KIND,
  getKindForLoanType,
  getOpeningTypeForLoan,
  getRepaymentTypeForLoan,
  isKindTypeValid,
} from "../../src/domain/transaction-kind.ts"

// kind -> allowed types
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.lent], ["expense"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.borrowed], ["income"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.upcoming].sort(), ["expense", "income"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.subscription].sort(), ["expense", "income", "transfer"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.repetitive].sort(), ["expense", "income", "transfer"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.default].sort(), ["expense", "income", "transfer"])

// isKindTypeValid
assert.equal(isKindTypeValid("lent", "expense"), true)
assert.equal(isKindTypeValid("lent", "income"), false)
assert.equal(isKindTypeValid("upcoming", "transfer"), false)
assert.equal(isKindTypeValid("repetitive", "transfer"), true)

// loan maps
assert.equal(getKindForLoanType("lent"), "lent")
assert.equal(getKindForLoanType("borrowed"), "borrowed")
assert.equal(getOpeningTypeForLoan("lent"), "expense")
assert.equal(getOpeningTypeForLoan("borrowed"), "income")
assert.equal(getRepaymentTypeForLoan("lent"), "income")
assert.equal(getRepaymentTypeForLoan("borrowed"), "expense")

console.log("transaction-kind: OK")
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node ./scripts/checks/verify-transaction-kind.mts`
Expected: FAIL — `Cannot find module '../../src/domain/transaction-kind.ts'`.

- [ ] **Step 3: Implement the module**

Create `src/domain/transaction-kind.ts`. All imports are **type-only** — Node's
type-stripping elides them, so the `.mts` check script loads this file with no
`~/` resolution needed. Keep it that way (no runtime imports).

```ts
import type { LoanType } from "~/types/loans"
import type { TransactionKind, TransactionType } from "~/types/transactions"

const EXPENSE_INCOME_TRANSFER = ["expense", "income", "transfer"] as const
const EXPENSE_INCOME = ["expense", "income"] as const

/** Single source of truth for which transaction `type` each `kind` permits. */
export const ALLOWED_TYPES_BY_KIND = {
  default: EXPENSE_INCOME_TRANSFER,
  upcoming: EXPENSE_INCOME,
  subscription: EXPENSE_INCOME_TRANSFER,
  repetitive: EXPENSE_INCOME_TRANSFER,
  lent: ["expense"],
  borrowed: ["income"],
} as const satisfies Record<TransactionKind, readonly TransactionType[]>

export function getAllowedTransactionTypes(
  kind: TransactionKind,
): readonly TransactionType[] {
  return ALLOWED_TYPES_BY_KIND[kind]
}

export function isKindTypeValid(
  kind: TransactionKind,
  type: TransactionType,
): boolean {
  return (ALLOWED_TYPES_BY_KIND[kind] as readonly TransactionType[]).includes(
    type,
  )
}

export function getKindForLoanType(loanType: LoanType): "lent" | "borrowed" {
  return loanType === "lent" ? "lent" : "borrowed"
}

export function getOpeningTypeForLoan(
  loanType: LoanType,
): "expense" | "income" {
  return loanType === "lent" ? "expense" : "income"
}

export function getRepaymentTypeForLoan(
  loanType: LoanType,
): "income" | "expense" {
  return loanType === "lent" ? "income" : "expense"
}
```

- [ ] **Step 4: Run the check — it passes**

Run: `node ./scripts/checks/verify-transaction-kind.mts`
Expected: `transaction-kind: OK`.

- [ ] **Step 5: Add compile-time assertions**

Create `src/domain/transaction-kind.assertions.ts`:

```ts
import type { TransactionKind, TransactionType } from "~/types/transactions"

import { ALLOWED_TYPES_BY_KIND } from "./transaction-kind"

// Every kind must appear in the matrix, mapping only to real transaction types.
const _exhaustive: Record<TransactionKind, readonly TransactionType[]> =
  ALLOWED_TYPES_BY_KIND
void _exhaustive

// lent/borrowed are single-type.
type _LentIsExpenseOnly = (typeof ALLOWED_TYPES_BY_KIND)["lent"] extends readonly [
  "expense",
]
  ? true
  : never
const _lentOk: _LentIsExpenseOnly = true
void _lentOk
```

- [ ] **Step 6: Verify**

Run: `pnpm types && pnpm lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/domain/transaction-kind.ts src/domain/transaction-kind.assertions.ts scripts/checks/verify-transaction-kind.mts
git commit -m "feat: add transaction-kind domain helper (CSI-1)"
```

---

## Task 4: zod schema — `kind` field + `isKindTypeValid` refinement

**Files:**
- Modify: `src/schemas/transactions.schema.ts:8-43`

**Interfaces:**
- Consumes: `TransactionKindEnum` (Task 2), `isKindTypeValid` (Task 3).
- Produces: `TransactionFormValues` gains optional `kind?: TransactionKind`; the schema rejects any `(kind, type)` pair failing `isKindTypeValid`.

- [ ] **Step 1: Add the field**

In `src/schemas/transactions.schema.ts`, add to the object (near `type: z.enum(TransactionTypeEnum)`):

```ts
    kind: z.enum(TransactionKindEnum).optional(),
```

Add imports:

```ts
import { TransactionKindEnum, TransactionSubTypeEnum, TransactionTypeEnum } from "~/types/transactions"
import { isKindTypeValid } from "~/domain/transaction-kind"
```

- [ ] **Step 2: Replace the transfer-only refinement with the matrix check**

In the `.superRefine((data, ctx) => { … })` block, replace the existing transfer check with:

```ts
    const kind = data.kind ?? "default"
    if (!isKindTypeValid(kind, data.type)) {
      ctx.addIssue({
        code: "custom",
        message: "validation.transaction.kindTypeMismatch",
        path: ["type"],
      })
    }
    if (data.type === TransactionTypeEnum.TRANSFER && !data.toAccountId) {
      ctx.addIssue({
        code: "custom",
        message: "validation.required.toAccountForTransfer",
        path: ["toAccountId"],
      })
    }
```

- [ ] **Step 3: Add the i18n key**

In **both** `src/i18n/translation/en.json` and `src/i18n/translation/ar.json`, under `validation`, add a `transaction` object with:

- en: `"kindTypeMismatch": "This type is not allowed for the selected kind"`
- ar: `"kindTypeMismatch": "هذا النوع غير مسموح به للفئة المحددة"`

(Match the existing nesting style in `validation`.)

- [ ] **Step 4: Verify**

Run: `pnpm types && pnpm lint && pnpm check-i18n-keys`
Expected: PASS. Existing callers that build `TransactionFormValues` without `kind` still compile (`kind` is optional).

- [ ] **Step 5: Commit**

```bash
git add src/schemas/transactions.schema.ts src/i18n/translation/en.json src/i18n/translation/ar.json
git commit -m "feat(schema): add transaction kind field with kind/type validation"
```

---

## Task 5: ledger service — persist `kind`, CSI-2 assert, confirm reset, ES-5 lock

**Files:**
- Modify: `src/database/services/ledger-service.ts` (`createTransaction` ~278-350, `updateTransaction` ~504-560, `confirmTransaction` ~1078-1180)

**Interfaces:**
- Consumes: `TransactionFormValues.kind` (Task 4).
- Produces: every write path persists `kind` (`data.kind ?? "default"`); `is_pending=1` with a disallowed kind throws in `__DEV__` / logs in prod; `confirmTransaction` sets `kind='default'` when clearing an `upcoming` row; `updateTransaction` ignores attempts to change `kind`/`type`/`loanId` on a loan-linked row.

- [ ] **Step 1: Write a runnable guard check first**

Add to `scripts/checks/verify-transaction-kind.mts` (bottom, before the final `console.log`):

```ts
// CSI-2: which kinds may be pending
const PENDING_OK = new Set(["upcoming", "subscription", "repetitive"])
assert.equal(PENDING_OK.has("default"), false)
assert.equal(PENDING_OK.has("upcoming"), true)
```

Run: `node ./scripts/checks/verify-transaction-kind.mts` → `transaction-kind: OK`.
(This documents the invariant; the real enforcement is the code below + manual QA.)

- [ ] **Step 2: Persist `kind` in `createTransaction`**

In `createTransaction`, in the `db.insert(transactions).values({ … })` object, add after `subtype: data.subtype ?? null,`:

```ts
        kind: data.kind ?? "default",
```

Immediately before the `db.insert`, add the CSI-2 assert:

```ts
    const kind = data.kind ?? "default"
    if (
      data.isPending &&
      kind !== "upcoming" &&
      kind !== "subscription" &&
      kind !== "repetitive"
    ) {
      const msg = `Refusing to create pending transaction with kind='${kind}'`
      if (__DEV__) throw new Error(msg)
      logger.error(msg, { kind })
    }
```

- [ ] **Step 3: Persist `kind` + ES-5 lock in `updateTransaction`**

In `updateTransaction`, after `const tx = requireTx(db, id)` and the existing `old*` reads, add:

```ts
    const isLoanLinked = tx.loan_id != null
    const nextKind =
      data.kind !== undefined && !isLoanLinked ? data.kind : (tx.kind ?? "default")
```

ES-5: when `isLoanLinked`, ignore incoming `kind` / `type` / `loanId` changes (do not throw — the form disables them; this is defence in depth). Ensure the `newType` / `newAccountId` etc. computations use the locked values when `isLoanLinked` (for `type`: `const newType = data.type !== undefined && !isLoanLinked ? data.type : oldType`).

In the `db.update(transactions).set({ … })` payload add:

```ts
      kind: nextKind,
```

Apply the same CSI-2 assert against `nextKind` + `newPending` before the write.

- [ ] **Step 4: `confirmTransaction` resets an `upcoming` kind**

In `confirmTransaction`, in the branch that clears pending (`shouldConfirm` true), where each leg row is updated to `is_pending = 0`, also set `kind` for any leg whose current `kind === 'upcoming'`:

```ts
        kind: leg.kind === "upcoming" ? "default" : leg.kind,
```

(Recurring `subscription`/`repetitive` legs keep their kind.)

- [ ] **Step 5: Verify**

Run: `pnpm types && pnpm lint`
Expected: PASS.

- [ ] **Step 6: Manual QA**

Run: `pnpm ios`. Create a normal expense → save → reopen it: still correct, no crash. Create a future-dated pending transaction the existing way → it saves (its `kind` will be `default` for now; Task 10 makes the form set `upcoming`). Confirm a pending transaction from the pending list → it applies to balance and no error is logged.

- [ ] **Step 7: Commit**

```bash
git add src/database/services/ledger-service.ts scripts/checks/verify-transaction-kind.mts
git commit -m "feat(ledger): persist transaction kind; enforce pending-kind invariant (CSI-2, CSI-4)"
```

---

## Task 6: recurring spawn persists template `kind` (CSI-4)

**Files:**
- Modify: `src/database/services/recurring-transaction-service.ts` (`RecurringTransactionTemplate` ~46-57, `parseTemplate` ~61-82, `CreateRecurringRuleInput` ~127-139, `createRecurringRule` ~141-179, `synchronizeRecurringTransaction` txData build ~457-471)

**Interfaces:**
- Consumes: `TransactionKind` (Task 2).
- Produces: `RecurringTransactionTemplate.kind: TransactionKind`; `createRecurringRule` accepts `kind`; spawned instances (past and future/pending) carry the template's `kind`.

- [ ] **Step 1: Add `kind` to the template type + parse default**

In `RecurringTransactionTemplate` add `kind: TransactionKind`. Import `TransactionKind` from `~/types/transactions`.
In `parseTemplate`, in the catch fallback object, add `kind: "repetitive"` (legacy rules had no kind; they were recurring). In the success path, `JSON.parse` may lack `kind` for old rules — normalise:

```ts
    const template = JSON.parse(row.json_transaction_template) as Omit<
      RecurringTransactionTemplate,
      "id"
    >
    return { id: row.id, ...template, kind: template.kind ?? "repetitive" }
```

- [ ] **Step 2: Add `kind` to create input + stored template**

In `CreateRecurringRuleInput` add `kind: TransactionKind`.
In `createRecurringRule`, in the `template` object built for `jsonTransactionTemplate`, add `kind: data.kind`.

- [ ] **Step 3: Spawn with `kind`**

In `synchronizeRecurringTransaction`, in the `txData: TransactionFormValues` object (non-transfer branch), add:

```ts
          kind: template.kind,
```

For the transfer branch (`createTransfer(...)` with `recurringOptions`), pass `kind` through if `createTransfer`'s options object supports it; if not, add `kind?: TransactionKind` to that options type and include it in its `db.insert` — mirror the `subtype` handling already there.

- [ ] **Step 4: Callers of `createRecurringRule`**

`pnpm types` will flag the one caller in `transaction-form-v3/index.tsx` (`createRecurringRule({...})` without `kind`). Add `kind: "repetitive"` there for now (the real subscription/repetitive choice is Slice 2; this keeps the build green and behaviour identical).

- [ ] **Step 5: Verify**

Run: `pnpm types && pnpm lint`
Expected: PASS.

- [ ] **Step 6: Manual QA**

Run: `pnpm ios`. Create a recurring transaction (existing UI). Background/foreground the app to trigger `use-recurring-transaction-sync`. Confirm spawned instances appear and (in Drizzle Studio or by editing one) have `kind = 'repetitive'`.

- [ ] **Step 7: Commit**

```bash
git add src/database/services/recurring-transaction-service.ts src/components/transaction/transaction-form-v3/index.tsx
git commit -m "feat(recurring): persist kind on spawned instances (CSI-4)"
```

---

## Task 7: shared `deriveKind` + import/export snapshot (DM-1, CSI-4)

**Files:**
- Create: `src/domain/derive-kind.ts`
- Modify: `src/database/services/data-management-service.ts`, `src/database/utils/import-snapshot.ts`
- Modify: `scripts/checks/verify-transaction-kind.mts`

**Interfaces:**
- Consumes: `TransactionKind` (Task 2).
- Produces: `deriveKind({ subtype, isPending, type, loanType }): TransactionKind` — the same rules as migration `0001`, for importing pre-`kind` snapshots. Export includes `kind` (transactions); import defaults `kind` via `deriveKind` and `loan.term` handling is deferred to Slice 4 (import just preserves absence). Snapshot version bumped; newer-than-supported snapshots rejected.

- [ ] **Step 1: Extend the check script (fails until module exists)**

Add to `scripts/checks/verify-transaction-kind.mts`:

```ts
import { deriveKind } from "../../src/domain/derive-kind.ts"

assert.equal(deriveKind({ subtype: "recurring", isPending: false, type: "expense", loanType: null, recurringId: null }), "repetitive")
assert.equal(deriveKind({ subtype: null, isPending: true, type: "expense", loanType: null, recurringId: "R1" }), "repetitive") // recurring_id wins over pending
assert.equal(deriveKind({ subtype: null, isPending: true, type: "expense", loanType: null, recurringId: null }), "upcoming")
assert.equal(deriveKind({ subtype: null, isPending: true, type: "transfer", loanType: null, recurringId: null }), "default")
assert.equal(deriveKind({ subtype: null, isPending: false, type: "expense", loanType: "lent", recurringId: "R1" }), "lent") // loan wins over recurring
assert.equal(deriveKind({ subtype: null, isPending: false, type: "income", loanType: null, recurringId: null }), "default")
```

Run: `node ./scripts/checks/verify-transaction-kind.mts` → FAIL (module missing).

- [ ] **Step 2: Implement `deriveKind`**

Create `src/domain/derive-kind.ts`:

```ts
import type { TransactionKind } from "~/types/transactions"

// type-only import (elided by Node type-stripping) — keep this module runtime-import-free

export interface DeriveKindInput {
  subtype: string | null
  isPending: boolean
  type: string
  loanType: "lent" | "borrowed" | null
  recurringId: string | null
}

/** Mirrors migration 0001's backfill precedence: loan link > recurring > pending(non-transfer). */
export function deriveKind(input: DeriveKindInput): TransactionKind {
  if (input.loanType === "lent") return "lent"
  if (input.loanType === "borrowed") return "borrowed"
  if (input.recurringId != null || input.subtype === "recurring") return "repetitive"
  if (input.isPending && input.type !== "transfer") return "upcoming"
  return "default"
}
```

- [ ] **Step 3: Run the check — passes**

Run: `node ./scripts/checks/verify-transaction-kind.mts` → `transaction-kind: OK`.

- [ ] **Step 4: Wire into export**

In `data-management-service.ts`, find where transaction rows are serialised for the snapshot. Add `kind` to the exported shape. Bump the snapshot schema version constant (grep for `version` / `SNAPSHOT_VERSION` in that file and `import-snapshot.ts`).

- [ ] **Step 5: Wire into import**

In `import-snapshot.ts`, when inserting a transaction from a snapshot:
- if the row has `kind`, use it;
- else `deriveKind({ subtype: row.subtype ?? null, isPending: !!row.isPending, type: row.type, loanType: <lent/borrowed of row.loanId's loan if resolvable, else null>, recurringId: row.recurringId ?? null })`.
If the snapshot's version is **newer** than this app supports, reject with the existing error path (grep for how version mismatch is currently handled; if only older is handled, add a `throw` with an i18n'd message key `screens.dataManagement.import.versionTooNew` in both `en.json` and `ar.json`).

- [ ] **Step 6: Verify**

Run: `pnpm types && pnpm lint && pnpm check-i18n-keys`
Expected: PASS.

- [ ] **Step 7: Manual QA — round-trip**

Run: `pnpm ios`. Settings → Data Management → Export. Then Import the just-exported file into a fresh install (or after wiping). Confirm transaction list is identical and (spot-check via Studio) `kind` values match the source.

- [ ] **Step 8: Commit**

```bash
git add src/domain/derive-kind.ts src/database/services/data-management-service.ts src/database/utils/import-snapshot.ts scripts/checks/verify-transaction-kind.mts src/i18n/translation/en.json src/i18n/translation/ar.json
git commit -m "feat(data-management): export/import transaction kind with deriveKind fallback (DM-1)"
```

---

## Task 8: `git mv` v3 → v4 + wire the route

**Files:**
- Rename: `src/components/transaction/transaction-form-v3/` → `src/components/transaction/transaction-form-v4/`
- Modify: `src/app/transaction/[id].tsx`
- Modify: `src/components/transaction/transaction-form-v4/index.tsx` (export name), `types.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `TransactionFormV4` exported from `~/components/transaction/transaction-form-v4`; route renders it. Behaviour identical to before.

- [ ] **Step 1: Move the directory preserving history**

Run:
```bash
git mv src/components/transaction/transaction-form-v3 src/components/transaction/transaction-form-v4
```

- [ ] **Step 2: Rename the export**

In `src/components/transaction/transaction-form-v4/index.tsx`, rename `export function TransactionFormV3(` → `export function TransactionFormV4(`. In `types.ts` rename `TransactionFormV3Props` → `TransactionFormV4Props` (leave its fields for now).

- [ ] **Step 3: Update the route**

In `src/app/transaction/[id].tsx`, change the import and both JSX usages from `TransactionFormV3` to `TransactionFormV4` (import path `~/components/transaction/transaction-form-v4`). Add `kind` to `useLocalSearchParams` destructure typing (`kind?: string`) — unused for now, passed through in Task 10.

- [ ] **Step 4: Verify**

Run: `pnpm types && pnpm lint && pnpm structure`
Expected: PASS (`pnpm structure` regenerates `docs/STRUCTURE.md` with the new path).

- [ ] **Step 5: Manual QA**

Run: `pnpm ios`. Open the FAB → expense/income/transfer; create one of each; edit one; delete one. Everything works exactly as before the move.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename transaction-form-v3 to v4 (no behaviour change)"
```

---

## Task 9: extract `useTransactionForm` hook + pure builders (behaviour-preserving)

**Files:**
- Create: `src/components/transaction/transaction-form-v4/use-transaction-form.ts`
- Create: `src/components/transaction/transaction-form-v4/use-transaction-form.submit.ts`
- Modify: `src/components/transaction/transaction-form-v4/index.tsx` (shrink to coordinator)

**Interfaces:**
- Consumes: existing v4 sub-components, `useFormAttachments`, `useFormConversionRate`, `useFormDatePicker`, `useFormLocation`, `useRecurringRule`, `useNavigationGuard`.
- Produces: `useTransactionForm(props): { control, watch, setValue, errors, isDirty, isSaving, transactionType, setTransactionType, recurring, setRecurring, /* … all handlers currently in index.tsx … */ submit, handleCancelPress, handleDeleteConfirm, handleRestore, handleDestroy, handleDestroyConfirm, addTag, removeTag, modals, setModals, datePicker, setDatePicker, openDatePicker, confirmIosDate, handleSetNow, datePickerAndroidElement, … }`. `buildTransactionPayload(data, ctx)` — pure, returns the object currently assembled inline as `payload`.

- [ ] **Step 1: Move the pure payload assembly into a builder**

Create `use-transaction-form.submit.ts`. Extract the block in `index.tsx` `onSubmit` that builds `const payload = { … }` (the non-transfer branch, lines ~426-444) into:

```ts
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import type { Account } from "~/types/accounts"

export interface BuildPayloadCtx {
  isNew: boolean
  transaction: { extra: Record<string, string> | null; requiresManualConfirmation: boolean } | null
  selectedAccount: Account | undefined
  usdCode: string
  attachmentsJson: string | null
  effectiveDate: Date
  requireConfirmation: boolean
}

export function buildTransactionPayload(
  data: TransactionFormValues,
  ctx: BuildPayloadCtx,
) {
  // …exact logic currently inline in index.tsx onSubmit (extra assembly,
  //   effectiveIsPending, requiresManualConfirmation, payload object)…
  // return { …payload, kind: data.kind ?? "default" }
}
```

Keep the behaviour byte-for-byte; only relocate. Then apply the `kind`
resolution — **bidirectional CSI-2 consistency** for this plain (non-transfer,
non-recurring, non-loan) create/update path:

```ts
const resolvedIsPending = /* the existing effectiveIsPending computation */
const resolvedKind =
  data.kind === "upcoming"
    ? "upcoming"
    : resolvedIsPending && (data.kind ?? "default") === "default"
      ? "upcoming"            // future-dated / pending-toggled default ⇒ upcoming (CSI-2)
      : (data.kind ?? "default")
// return { …payload, kind: resolvedKind, isPending: resolvedKind === "upcoming" ? true : resolvedIsPending }
```

This closes the CSI-2 window opened by Task 5: after Task 5, `createTransaction`
throws in `__DEV__` on `{ kind: "default", isPending: true }`. The current form
produces exactly that for a future-dated transaction, so `buildTransactionPayload`
must map it to `kind: "upcoming"`. `kind: "upcoming"` from the (future) kind
selector likewise forces `isPending`. Recurring/loan paths are unaffected (they
set their own kind). This is still behaviour-preserving from the user's view — a
future-dated entry is still planned/pending — it just now carries the canonical
kind.

- [ ] **Step 2: Move state + handlers into the hook**

Create `use-transaction-form.ts`. Move from `index.tsx`: the `useForm` call, every `watch(...)` derivation, `modals`/`setModals`, `recurring`/`setRecurring`, `isSaving`, `useNavigationGuard`, `useFormAttachments`/`useFormConversionRate`/`useFormDatePicker`/`useFormLocation`, `derivedTransferTitle`, `endsOnType`, all `handle*` functions, `onSubmit`, `addTag`/`removeTag`. The hook takes the current `TransactionFormV4Props` and returns one stable object. `onSubmit` calls `buildTransactionPayload` for the non-transfer path.

- [ ] **Step 3: Shrink `index.tsx` to a coordinator**

`index.tsx` becomes: call `useTransactionForm(props)`, render the same JSX tree as today (same field order for now), passing hook values down. Target ≤ ~220 lines. No logic beyond wiring.

- [ ] **Step 4: Verify**

Run: `pnpm types && pnpm lint`
Expected: PASS.

- [ ] **Step 5: Manual QA — full parity sweep**

Run: `pnpm ios`. Exercise: create expense (with category, tags, notes, attachment, goal, budget), create income, create transfer (same-currency and cross-currency with rate), create a future pending one, create a recurring one, edit each, delete + restore + destroy, unsaved-changes guard on back. Every path must behave exactly as before Task 8 — **and** the future-dated pending create must now succeed and produce a row with `kind='upcoming'` (Step 1's `resolvedKind` mapping). Before this task's Step 1 mapping lands, that create throws in `__DEV__` via the Task 5 CSI-2 assert — expected transient state, not a Task 8 regression.

- [ ] **Step 6: Commit**

```bash
git add src/components/transaction/transaction-form-v4/
git commit -m "refactor(transaction-form): extract useTransactionForm hook + pure payload builder"
```

---

## Task 10: `TransactionTopTabs` + top-tab state machine

**Files:**
- Create: `src/components/transaction/transaction-form-v4/transaction-top-tabs.tsx`
- Delete: `src/components/transaction/transaction-type-selector.tsx`
- Modify: `use-transaction-form.ts` (add `tabLabels`, `tabHiddenSlots`, `tabLockedTo`, `topTabType`, `onTopTabChange`), `index.tsx` (use the new component)
- Modify: `src/i18n/translation/en.json`, `ar.json`

**Interfaces:**
- Consumes: `getKindForLoanType` (Task 3), the hook's `kind` + `linkedLoanId` (Task 11 supplies `linkedLoanId`; for this task it is always `null`).
- Produces: `<TransactionTopTabs labels={[string,string,string]} value={TransactionType} onChange={(t)=>void} hiddenSlots={number[]} lockedTo={number|null} />`. Hook exposes `tabLabels`, `tabHiddenSlots`, `tabLockedTo`, `topTabType`, `onTopTabChange`.

- [ ] **Step 1: Build `TransactionTopTabs`**

Port `transaction-type-selector.tsx` markup/styles into `transaction-form-v4/transaction-top-tabs.tsx`. Change props to `labels: [string, string, string]`, `value`, `onChange`, `hiddenSlots?: number[]` (indices 0/1/2 to hide), `lockedTo?: number | null` (when set, render only that segment, selected, non-interactive). Icons: keep the existing three (`chevrons-up`, `chevrons-down`, `arrows-right-left`); when a slot is relabelled the icon still maps by index.

- [ ] **Step 2: Derive tab state in the hook**

In `use-transaction-form.ts`, add (spec *Top-tab label state machine*):

```ts
const kind = watch("kind") ?? "default"
const tabLabels: [string, string, string] =
  kind === "lent" || kind === "borrowed"
    ? [t("common.transaction.tabs.lent"), t("common.transaction.tabs.borrowed"), ""]
    : [
        t("common.transaction.types.expense"),
        t("common.transaction.types.income"),
        t("common.transaction.types.transfer"),
      ]
const tabHiddenSlots =
  kind === "lent" || kind === "borrowed" ? [2] : kind === "upcoming" ? [2] : []
const tabLockedTo: number | null = null // linked-loan lock arrives in Task 11
```

`onTopTabChange(type)`: sets `type` via `setValue`. When `kind` is `lent`/`borrowed`, also set `kind` (`slot 0 → lent`, `slot 1 → borrowed`) and keep `type` = `expense`/`income` respectively; otherwise unchanged from today's `onChange` in `index.tsx` (which also clears `goalId`, handles transfer title/toAccount).

- [ ] **Step 3: Swap the component in `index.tsx`**

Replace `<TransactionTypeSelector value={…} onChange={…} />` with `<TransactionTopTabs labels={tabLabels} value={topTabType} onChange={onTopTabChange} hiddenSlots={tabHiddenSlots} lockedTo={tabLockedTo} />`. Delete `src/components/transaction/transaction-type-selector.tsx`.

- [ ] **Step 4: i18n keys**

Add under `common.transaction` in `en.json` + `ar.json`:
- `"tabs": { "lent": "Lent", "borrowed": "Borrowed", "paid": "Paid", "collected": "Collected" }`
- ar: `{ "lent": "أقرضت", "borrowed": "اقترضت", "paid": "مدفوع", "collected": "محصّل" }`

- [ ] **Step 5: Verify**

Run: `pnpm types && pnpm lint && pnpm check-i18n-keys && pnpm structure`
Expected: PASS.

- [ ] **Step 6: Manual QA**

Run: `pnpm ios`. Tabs still read Expense/Income/Transfer and switch types as before. RTL: set language to Arabic → tabs mirror correctly.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(transaction-form): TransactionTopTabs with kind-driven labels"
```

---

## Task 11: kind selector + kind-card shell + `onKindChange` + new field order

**Files:**
- Create: `src/components/transaction/transaction-form-v4/form-kind-selector.tsx`, `form-kind-card.tsx`, `on-kind-change.ts`
- Modify: `use-transaction-form.ts` (kind state, `setKind`, `linkedLoanId` placeholder, `canEditKind`, `lockedFields`), `index.tsx` (field reorder + render kind selector), `form-utils.ts` (`getDefaultValues` sets `kind`), `types.ts` (`initialKind`)
- Modify: `src/i18n/translation/en.json`, `ar.json`

**Interfaces:**
- Consumes: `getAllowedTransactionTypes` / `isKindTypeValid` (Task 3), `TransactionKindEnum` (Task 2).
- Produces:
  - `onKindChange(prev: TransactionKind, next: TransactionKind, state: KindScratchState): Partial<KindScratchState>` where `KindScratchState = { recurring: RecurringState; loanDraft: LoanDraft | null; linkedLoanId: string | null; toAccountId: string | undefined }`
  - hook: `kind`, `setKind(next)`, `canEditKind: boolean`, `lockedFields: ReadonlySet<"kind"|"type"|"loanId"|"toAccountId">`
  - `<FormKindSelector kind onSelect disabled />`, `<FormKindCard kind … />`

- [ ] **Step 1: Write `on-kind-change.ts` + a check**

`on-kind-change.ts` must stay **runtime-import-free** (type-only imports; inline
any default-state literal it needs) so the `.mts` check can load it. If it must
pull a runtime constant, skip the runnable check for it and rely on `pnpm types`
+ Step 8 manual QA instead.

Add to `scripts/checks/verify-transaction-kind.mts`:

```ts
import { onKindChange } from "../../src/components/transaction/transaction-form-v4/on-kind-change.ts"

const base = { recurring: { enabled: true }, loanDraft: { name: "x" }, linkedLoanId: "L1", toAccountId: "A2" } as any
// leaving a recurring kind clears recurrence + loan scratch
const toDefault = onKindChange("subscription", "default", base)
assert.equal(toDefault.recurring?.enabled ?? false, false)
assert.equal(toDefault.loanDraft, null)
assert.equal(toDefault.linkedLoanId, null)
// subscription <-> repetitive keeps recurrence
const subToRep = onKindChange("subscription", "repetitive", base)
assert.equal("recurring" in subToRep, false)
```

Run it → FAIL (module missing). Then create `on-kind-change.ts` as a pure function implementing spec **KT matrix**. No React, no IO. Re-run → `transaction-kind: OK`.

- [ ] **Step 2: Kind state in the hook**

In `use-transaction-form.ts`:
- initialise `kind` from `props.initialKind ?? props.transaction?.kind ?? "default"` (store in RHF via `setValue("kind", …)` at mount, and `watch("kind")`).
- `setKind(next)`: if `!canEditKind` return; compute `onKindChange(kind, next, scratch)`, apply the returned partials (`setRecurring`, `setLoanDraft`, `setValue("toAccountId", …)`), then `setValue("kind", next, { shouldDirty: true })`. If `next` is `lent`/`borrowed` set `type` per `getKindForLoanType` inverse; if `next` ∈ {upcoming} set `type` to `expense` when current is `transfer`.
- `canEditKind`: `isNew || (transaction?.loan_id == null && transaction?.recurringId == null)` (ES-4/ES-5/ES-8 — recurrence editing is Slice 2, so lock kind on rule-linked rows here).
- `lockedFields`: `new Set(transaction?.loanId ? ["kind","type","loanId","toAccountId"] : [])` (ES-5).
- `linkedLoanId`: `null` for this slice (Slice 4 populates it). Keep the field so `tabLockedTo`/labels wiring exists.

- [ ] **Step 3: `getDefaultValues` sets `kind`**

In `form-utils.ts`, both return objects gain `kind: initialKind ?? transaction?.kind ?? "default"`; add `initialKind?: TransactionKind` param. In `types.ts` replace `transactionType`/`onTransactionTypeChange`/`initialSubtype`/`onSubtypeChange` with `initialKind?: TransactionKind`; update `index.tsx` + `src/app/transaction/[id].tsx` accordingly (route reads `?kind=` → `initialKind`).

- [ ] **Step 4: `FormKindSelector` + `FormKindCard`**

`form-kind-selector.tsx`: a `ListItem` showing the current kind's label + chevron; on press opens a bottom-sheet (reuse the app's sheet/selector pattern — check `src/components/selector-modals/`) listing all 6 `TransactionKindEnum` values with labels; selecting calls `onSelect(kind)`. `disabled` when `!canEditKind`.
`form-kind-card.tsx`: `switch (kind)` → `subscription`/`repetitive` → `<PlaceholderCard label={t("components.transactionForm.kind.recurrenceComingSoon")} />`; `lent`/`borrowed` → `<PlaceholderCard label={t("components.transactionForm.kind.loanComingSoon")} />`; `default`/`upcoming` → `null`. (Real cards: Slices 2 & 4.)
For `upcoming`: `buildTransactionPayload` already handles the bidirectional
`kind='upcoming' ⟺ isPending` mapping (Task 9 Step 1). Nothing extra needed here
beyond letting the kind selector set `kind: "upcoming"` — full upcoming UX is Slice 3.

- [ ] **Step 5: New field order in `index.tsx`**

Reorder the coordinator JSX to: TopTabs → Amount → **Account** (`FormAccountPicker`) → Category → **Date** (`FormDateSection`) → **`FormKindSelector` + `FormKindCard`** → Title → Notes → Attachments → (below) to-account+conversion, goal, budget, tags, location, refund toggle, delete actions. Move the existing JSX blocks; do not rewrite them. The recurring `<FormRecurringSection>` stays where it is for now (Slice 2 replaces it) but is hidden when `kind` ∈ {subscription, repetitive} to avoid two recurrence UIs — gate it on `kind !== "subscription" && kind !== "repetitive"` in addition to the existing `!isRefund`.

- [ ] **Step 6: i18n keys**

Add under `common.transaction`: `"kinds": { "default": "Standard", "upcoming": "Upcoming", "subscription": "Subscription", "repetitive": "Repeating", "lent": "Lent", "borrowed": "Borrowed" }` (+ Arabic). Add under `components.transactionForm`: `"kind": { "label": "Kind", "recurrenceComingSoon": "Recurrence settings arrive in a later update", "loanComingSoon": "Loan settings arrive in a later update" }` (+ Arabic). *(The "coming soon" placeholder strings exist only until Slices 2/4; keep them real keys so `check-i18n-keys` passes.)*

- [ ] **Step 7: Verify**

Run: `node ./scripts/checks/verify-transaction-kind.mts && pnpm types && pnpm lint && pnpm check-i18n-keys && pnpm structure`
Expected: all PASS.

- [ ] **Step 8: Manual QA (spec ES / KT)**

Run: `pnpm ios`.
- New expense: field order is TopTabs, Amount, Account, Category, Date, Kind, Title, Notes, Attachments. Save works.
- Kind → Upcoming: tab 2 (Transfer) hides; save → transaction is pending, does not hit balance; confirming it from the pending list flips it to Standard.
- Kind → Lent: tabs relabel to Lent/Borrowed; placeholder loan card shows; saving still produces a plain expense (loan wiring is Slice 4) — acceptable for this slice, note it.
- Kind → Subscription then back to Standard: recurrence scratch is cleared (no stray recurring rule created on save).
- Edit a recurring instance: Kind selector is disabled (`canEditKind` false).
- Edit a loan-linked transaction (if any exist from old data): Kind/Type/Account-to disabled.
- Arabic: kind selector row + sheet mirror correctly.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(transaction-form): kind selector, onKindChange matrix, new field order, ES/KT locks"
```

---

## Task 12: retire non-`refund` subtype values + literal grep sweep

**Files:**
- Modify: `src/types/transactions.ts` (`TransactionSubTypeEnum` → `{ REFUND: "refund" }`)
- Modify: every consumer surfaced by the grep list below

**Interfaces:**
- Consumes: `kind` everywhere it now lives.
- Produces: `TransactionSubTypeEnum` has only `REFUND`; `TransactionSubType = "refund"`. No code references `recurring` / `one-time` / `loan_*` subtypes.

- [ ] **Step 1: Grep for literals**

Run:
```bash
rg -n "recurring|one-time|loan_borrowed|loan_repayment|loan_lent|loan_received|biweekly|RecurringFrequency|RECURRING_OPTIONS|endAfterOccurrences|initialType|initialSubtype|TransactionTypeSelector|transaction-form-v3|showCategoryForUntitled" src
```
Record every hit. Expected remaining owners after Slice 1: recurrence internals (`biweekly`, `RecurringFrequency`, `RECURRING_OPTIONS`, `endAfterOccurrences`) belong to **Slice 2** — leave them. `showCategoryForUntitled` belongs to **Slice 5** — leave it. Everything about `subtype` values `recurring`/`one-time`/`loan_*` and `TransactionTypeSelector`/`transaction-form-v3`/`initialSubtype` must be zero after this task.

- [ ] **Step 2: Shrink the enum**

In `src/types/transactions.ts`:

```ts
export const TransactionSubTypeEnum = {
  REFUND: "refund",
} as const

export type TransactionSubType =
  (typeof TransactionSubTypeEnum)[keyof typeof TransactionSubTypeEnum]
```

- [ ] **Step 3: Fix the fallout**

`pnpm types` will list each break. Expected edits:
- `recurring-transaction-service.ts` — `RecurringTransactionTemplate.subtype` field: it stored `one-time`/`recurring`; now that `kind` carries recurrence, set `subtype` in spawned `txData` to `data.subtype ?? null` only for `refund` passthrough; drop any `TransactionSubTypeEnum.RECURRING` usage.
- `transaction-item/index.tsx` — already only checks `REFUND`; ensure the import still resolves.
- `get-balance-delta.ts` — keeps the `refund` branch; no change.
- `data-management` / `loan-service.ts` / `balance-service.ts` / `transaction-list-utils.ts` / `live-progress.ts` — replace any `subtype === 'loan_*'` / `'recurring'` checks with the equivalent `kind` check (`kind === 'lent'` etc.) or delete if now dead.
- `stats-data.ts` `computeExpenseBySubtype` (~line 608-620) currently buckets by `subtype === RECURRING` / `ONE_TIME`. After migration those are always NULL, so it already only ever produces `unclassified`. Rework it to bucket by `kind` (`repetitive`/`subscription` → `recurring` bucket; everything else → the other buckets) so the stat is meaningful again — OR, if the "expense by subtype" stat is unused in the UI, delete `computeExpenseBySubtype` and its `ExpenseBySubtype` type + call site. Grep `computeExpenseBySubtype` / `ExpenseBySubtype` / `expenseBySubtype` across `src/app/stats/**` and `src/components/stats/**` first; pick delete if there are no render consumers.

- [ ] **Step 4: Verify**

Run: `pnpm types && pnpm lint && node ./scripts/checks/verify-transaction-kind.mts`
Expected: PASS. Re-run the Step 1 `rg` — no `subtype`-value / `transaction-form-v3` / `TransactionTypeSelector` / `initialSubtype` hits remain.

- [ ] **Step 5: Manual QA — regression sweep**

Run: `pnpm ios`. Refund toggle on an expense still works (balance goes up). Loan-linked transactions from old data still render with correct sign and labels. Stats screens load. Recurring instances still list.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: reduce transaction subtype to refund-only; kind is now authoritative"
```

---

## Self-Review

**1. Spec coverage (Slice 1 scope):**

| Spec item | Task |
|---|---|
| DB `0001` additive `ADD COLUMN` + guarded backfill | 1 |
| `0001` validation checklist | 1 (Step 5–7, `verify-migration-0001.mts`) |
| `TransactionKindEnum` / `TransactionKind` / `Transaction.kind` | 2 |
| `RowTransaction.kind`, `txSelection`, `mapTransaction` | 2 |
| CSI-1 `src/domain/transaction-kind.ts` + all exports | 3 |
| zod `kind` + `isKindTypeValid` superRefine | 4 |
| CSI-2 pending assert | 5 (create + update) |
| `confirmTransaction` resets `upcoming` → `default` | 5 |
| ES-5 locked-field re-assert in `updateTransaction` | 5, 11 |
| CSI-4 persistence: create, update, confirm | 5 |
| CSI-4 persistence: recurring spawn | 6 |
| CSI-4 persistence: import; DM-1 `deriveKind`, version bump, reject-newer | 7 |
| v3 → v4 `git mv`, coordinator + `useTransactionForm` + pure builder | 8, 9 |
| `on-kind-change.ts` (KT matrix) | 11 |
| Top-tab state machine + `TransactionTopTabs` | 10 |
| Kind selector + kind-card shell | 11 |
| New field order (account under amount, date before kind, title after) | 11 |
| ES-1…ES-8 locks (`canEditKind`, `lockedFields`) | 11 (+ 5 server side) |
| Delete `transaction-type-selector.tsx` | 10 |
| Retire non-`refund` subtype + literal grep sweep | 12 |
| i18n keys (kind labels, tab labels, validation) both `en`+`ar` | 4, 10, 11 |

Out of scope by design (Slices 2–5): real `RecurrenceCard`/interval-unit, real `LoanCard`/one-time-vs-long-term, full "upcoming" UX + CSI-3 stats audit, title display-time derivation. `FormKindCard` renders placeholders for subscription/repetitive/lent/borrowed until then; `buildTransactionPayload` does the minimal `upcoming ⇒ isPending`.

**2. Placeholder scan:** The only "coming soon" strings are deliberate real i18n keys (Task 11 Step 6) that Slices 2/4 delete — flagged as such. No `TODO`/`TBD`/"handle edge cases". Every code step has literal content.

**3. Type consistency:** `TransactionKind`, `TransactionKindEnum`, `ALLOWED_TYPES_BY_KIND`, `isKindTypeValid`, `getKindForLoanType`, `getOpeningTypeForLoan`, `getRepaymentTypeForLoan`, `deriveKind`, `onKindChange`, `buildTransactionPayload`, `TransactionFormV4Props`, `initialKind`, `canEditKind`, `lockedFields`, `tabLabels`/`tabHiddenSlots`/`tabLockedTo` — names are used identically across Tasks 3–12. Pure modules loaded by the `.mts` check scripts (`transaction-kind.ts`, `derive-kind.ts`, ideally `on-kind-change.ts`) keep **type-only imports only** — Node's type-stripping elides them, so `~/` is fine and no runtime resolution happens; all app code imports these via `~/domain/…` / `~/components/…` normally.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-08-30-transaction-kind-slice-1.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
