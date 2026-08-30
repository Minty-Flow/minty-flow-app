# Transaction `kind` — Slice 2 (recurrence: interval + unit) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed recurrence frequencies (`daily|weekly|biweekly|monthly|yearly` + "ends after N occurrences") with a free "every **N** **unit**" model plus an "Until <date> | Forever" end, driven by the `subscription` / `repetitive` kinds, and make those two kinds selectable in the form.

**Architecture:** `src/utils/recurrence.ts` becomes the single owner of the interval+unit ⇄ RRULE mapping (`buildRRuleString`, `countOccurrencesBetween`, new `parseRecurrence`). The form's `RecurringState` drops `enabled`/`frequency`/`endAfterOccurrences` — recurrence is "on" iff `kind ∈ {subscription, repetitive}`. A new `recurrence-card.tsx` (rendered by `form-kind-card.tsx`) shows the discrete controls. Existing recurring rules are read through `parseRecurrence` at display time — **no SQL migration, no rewrite of stored `rules` blobs**.

**Tech Stack:** React Native / Expo SDK 57, `rrule`, `react-hook-form` + `zod` v4, `react-native-unistyles` v3, `i18next` (en + ar), Drizzle + expo-sqlite, Biome. No test framework — pure modules ship IO-free and are covered by `node scripts/checks/*.mts` assertion scripts; UI is verified manually.

**Spec:** `docs/superpowers/specs/2026-08-30-transaction-form-kind-redesign-design.md` — section "Slice 2 — recurrence: interval + unit" (lines 362-458), plus Cross-slice invariants CSI-1..CSI-4, ES / KT sections, "i18n + RTL", "Old-value cleanup", "Migration safety (live users)".

**Branch:** `feat/transaction-form-kind-redesign` (Slice 1 already merged into this branch — HEAD has the `kind` column, `transaction-form-v4/`, `FormKindSelector` gated to `["default","upcoming"]`).

## Global Constraints

- **No SQL migration in this slice.** Stored RRULE strings already carry `FREQ`+`INTERVAL`. `parseRecurrence` handles every legacy string at read time. Never rewrite a user's `rules` / `range` blob in a migration. (Spec "Migration — none", "Migration safety".)
- **Pure modules stay IO-free:** `src/utils/recurrence.ts`, `src/components/transaction/transaction-form-v4/on-kind-change.ts`, `use-transaction-form.submit.ts`. Type-only imports where a `scripts/checks/*.mts` file loads them under Node type-stripping.
- **`interval` is an integer 1..999.** Non-integer / `<1` → `Math.max(1, Math.floor(n))`; `>999` → clamp to 999. Applied in `parseRecurrence` and in the stepper control.
- **`countOccurrencesBetween` counts the first occurrence.** `rrule.between(start, until, /*inc*/ true).length`. The "(×N)" shown in the form must equal what `synchronizeAllRecurringTransactions` spawns through `until`.
- **RS-3 — "until" is normalised to end-of-day device-local** before building the RRULE or counting. Forever → `range.to = new Date(2099, 11, 31).getTime()` (keep the existing sentinel).
- **RS-2 — editing an existing rule keeps `range.from`** untouched; changing interval/unit/until never recomputes the start anchor.
- **CSI-4 — `kind` is persisted on every write path.** `createRecurringRule` and the recurring synchroniser write the template's `kind` (`subscription` / `repetitive`) onto past **and** future/pending instances. Replace the hard-coded `kind: "repetitive"` in `use-transaction-form.ts`.
- **CSI-2** — a pending future recurring instance keeps `kind = subscription|repetitive` (never `upcoming`); `is_pending = 1` is allowed for these kinds. Already handled by `synchronizeRecurringTransaction` + the `ledger-service` assert; do not regress it.
- i18n keys added to **both** `src/i18n/translation/en.json` and `ar.json`; `pnpm check-i18n-keys` passes (0 missing / 0 extra).
- Pre-commit must pass every task: `pnpm structure`, `pnpm lint:fix`, `pnpm check-number-formatting`, `pnpm types`.
- Commit messages: no attribution trailers, no AI-tool mentions, no GPG signing (repo `CLAUDE.md` rule 1).

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/types/transactions.ts` | **Add** `RecurrenceUnit`, `Recurrence`. **Delete** `RecurringFrequency`, `RecurringEndEnum`, `RecurringEndType`. | 1, 2 |
| `src/utils/recurrence.ts` | Interval+unit ⇄ RRULE: `buildRRuleString`, `countOccurrencesBetween`, **new** `parseRecurrence`. `nextAbsoluteOccurrence` unchanged. | 1 |
| `scripts/checks/verify-recurrence.mts` | **New.** `node:assert` coverage for `recurrence.ts` (round-trip, legacy parse, ×N counting, clamps). | 1 |
| `src/components/transaction/transaction-form-v4/types.ts` | `RecurringState` → `{ recurrence: Recurrence; until: Date | null; startDate: Date }`. `DatePickerTarget` drops `"recurringStart"`. | 2 |
| `src/components/transaction/transaction-form-v4/constants.ts` | **Delete** `RECURRING_OPTIONS`, `ENDS_ON_OCCURRENCE_PRESETS`. | 2 |
| `src/components/transaction/transaction-form-v4/on-kind-change.ts` | Rewrite `disabledRecurring`/`enabledRecurring` → `freshRecurrence()` (new shape). | 2 |
| `src/components/transaction/transaction-form-v4/form-utils.ts` | **Delete** `getRecurrenceDisplayLabel`. `getDefaultValues` unchanged. | 2 |
| `src/components/transaction/transaction-form-v4/use-form-date-picker.tsx` | `applyTarget`: `"recurringEnd"` writes `until`; drop `"recurringStart"`. | 2 |
| `src/components/transaction/transaction-form-v4/use-transaction-form.ts` | `recurring` reducer init (new shape); `occurrenceCount` derive; drop `endsOnType` / `recurringEndDateOccurrenceCount` / `handleRecurringToggle`; submit create branch keys off `kind`; pass `kind: data.kind` to `createRecurringRule`; ES-8 recurrence edit payload. | 2, 3, 4 |
| `src/components/transaction/transaction-form-v4/form-recurring-section.tsx` | **Delete.** | 2 |
| `src/components/transaction/transaction-form-v4/recurrence-card.tsx` | **New.** Discrete "every [N] [unit]" + "Until [date|Forever] · ×N" + reset. | 2 |
| `src/components/transaction/transaction-form-v4/recurrence-unit-modal.tsx` | **New.** Small `Modal` list: day / week / month / year. | 2 |
| `src/components/transaction/transaction-form-v4/form-kind-card.tsx` | `subscription`/`repetitive` → `<RecurrenceCard/>` (was a "coming soon" stub). | 2 |
| `src/components/transaction/transaction-form-v4/form-kind-selector.tsx` | `KINDS` → `["default","upcoming","subscription","repetitive"]`. | 2 |
| `src/components/transaction/transaction-form-v4/index.tsx` | Remove `<FormRecurringSection>` block; Date gate keys off `kind`; refund gate drops `recurring.enabled`; pass recurrence props to `<FormKindCard>`. | 2 |
| `src/database/services/recurring-transaction-service.ts` | **New** `updateRecurringRule(ruleId, { recurrence, until })`. | 4 |
| `src/components/transaction/edit-recurring-modal.tsx` | Accept + forward optional `recurrence` / `until` to `applyRecurringEditScope`. | 4 |
| `src/components/transaction/transaction-form-v4/form-modals.tsx` | Pass `recurrence` / `until` through to `EditRecurringModal`. | 4 |
| `src/i18n/translation/en.json`, `ar.json` | Add `recurrence.*`; delete dead `components.recurring.frequency.*` + `components.transactionForm.recurring.*`. | 5 |

---

## Task 1: `recurrence.ts` — interval + unit RRULE API

**Files:**
- Modify: `src/types/transactions.ts` (add `RecurrenceUnit`, `Recurrence` — additive; leave `RecurringFrequency` for now)
- Modify: `src/utils/recurrence.ts` (rewrite `buildRRuleString`, `countOccurrencesBetween`; add `parseRecurrence`; keep `nextAbsoluteOccurrence`)
- Modify: `src/components/transaction/transaction-form-v4/use-transaction-form.ts` (fix the two call sites so the project still type-checks — a temporary local `FREQ_TO_UNIT` map, deleted in Task 2)
- Create: `scripts/checks/verify-recurrence.mts`

**Interfaces:**
- Produces:
  ```ts
  // src/types/transactions.ts
  export type RecurrenceUnit = "day" | "week" | "month" | "year"
  export interface Recurrence { interval: number; unit: RecurrenceUnit } // interval 1..999

  // src/utils/recurrence.ts
  export function buildRRuleString(opts: {
    interval: number
    unit: RecurrenceUnit
    startDate: Date
    until?: Date | null
  }): string
  export function countOccurrencesBetween(
    startDate: Date,
    endDate: Date,
    recurrence: Recurrence,
  ): number
  export function parseRecurrence(ruleString: string): Recurrence
  // nextAbsoluteOccurrence(ruleStrings, range, anchor) — unchanged signature
  ```

- [ ] **Step 1: Add the types**

In `src/types/transactions.ts`, replace the `RecurringFrequency` block at the top (lines 1-17) — keep `RecurringFrequency` and `RecurringEndEnum` for now (Task 2 deletes them), just prepend the new types:

```ts
export type RecurrenceUnit = "day" | "week" | "month" | "year"

/** "every {interval} {unit}"; interval is an integer 1..999. */
export interface Recurrence {
  interval: number
  unit: RecurrenceUnit
}

// --- deprecated, deleted in Slice 2 Task 2 ---
export type RecurringFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly"
  | null

export const RecurringEndEnum = {
  NEVER: "never",
  DATE: "date",
  OCCURRENCES: "occurrences",
}

export type RecurringEndType =
  (typeof RecurringEndEnum)[keyof typeof RecurringEndEnum]
```

- [ ] **Step 2: Rewrite `src/utils/recurrence.ts`**

Replace the whole file with:

```ts
import { endOfDay } from "date-fns"
import { RRule, type RRuleSet, rrulestr } from "rrule"

import type { Recurrence, RecurrenceUnit } from "~/types/transactions"

interface TimeRange {
  from: number // Unix ms
  to: number // Unix ms
}

const FREQ_BY_UNIT: Record<RecurrenceUnit, number> = {
  day: RRule.DAILY,
  week: RRule.WEEKLY,
  month: RRule.MONTHLY,
  year: RRule.YEARLY,
}

const UNIT_BY_FREQ: Record<number, RecurrenceUnit> = {
  [RRule.DAILY]: "day",
  [RRule.WEEKLY]: "week",
  [RRule.MONTHLY]: "month",
  [RRule.YEARLY]: "year",
}

/** Clamp any number to an integer in 1..999. */
export function clampInterval(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.min(999, Math.max(1, Math.floor(n)))
}

/**
 * Build an RRULE string from "every {interval} {unit}", a start date, and an
 * optional end date. `until` is normalised to end-of-day (device-local) so an
 * "until Oct 16" rule includes every occurrence that falls on Oct 16.
 * RRule handles month-end roll-over (Jan 31 -> Feb 28/29); never do raw
 * setMonth/setDate arithmetic for intervals.
 */
export function buildRRuleString(opts: {
  interval: number
  unit: RecurrenceUnit
  startDate: Date
  until?: Date | null
}): string {
  const rule = new RRule({
    freq: FREQ_BY_UNIT[opts.unit],
    interval: clampInterval(opts.interval),
    dtstart: opts.startDate,
    ...(opts.until ? { until: endOfDay(opts.until) } : {}),
  })
  return rule.toString()
}

/**
 * Safely parse an RRULE string that may contain a DTSTART line.
 * `rrulestr` handles the full RFC format; fall back to `RRule.fromString`.
 */
function parseRRule(ruleString: string): RRule {
  try {
    const result = rrulestr(ruleString)
    if (result instanceof RRule) return result
    const rules = (result as unknown as RRuleSet).rrules()
    if (rules.length > 0) return rules[0]
    throw new Error(`rrulestr produced empty RRuleSet for: ${ruleString}`)
  } catch {
    return RRule.fromString(ruleString)
  }
}

/**
 * How many times the recurrence fires between `startDate` and `endDate`,
 * **inclusive of both ends and of the first occurrence** — exactly what
 * `synchronizeRecurringTransaction` spawns through `endDate`.
 */
export function countOccurrencesBetween(
  startDate: Date,
  endDate: Date,
  recurrence: Recurrence,
): number {
  if (endDate.getTime() < startDate.getTime()) return 0
  const rule = new RRule({
    freq: FREQ_BY_UNIT[recurrence.unit],
    interval: clampInterval(recurrence.interval),
    dtstart: startDate,
    until: endDate,
  })
  return rule.between(startDate, endDate, true).length
}

/**
 * Read the interval+unit back out of a stored RRULE string, for the edit
 * screen. Never throws into render:
 *  - missing INTERVAL   -> interval = 1
 *  - FREQ absent / unrecognised, or unparseable string -> { interval: 1, unit: "month" }
 *  - INTERVAL non-integer / < 1 -> Math.max(1, Math.floor(n)); > 999 -> 999
 */
export function parseRecurrence(ruleString: string): Recurrence {
  const fallback: Recurrence = { interval: 1, unit: "month" }
  try {
    const rule = parseRRule(ruleString)
    const unit = UNIT_BY_FREQ[rule.options.freq]
    if (!unit) return fallback
    const raw = rule.options.interval
    const interval = raw == null ? 1 : clampInterval(raw)
    return { interval, unit }
  } catch {
    return fallback
  }
}

/**
 * Next occurrence strictly after `anchor` within `range`, or null.
 * (Unchanged from the pre-Slice-2 implementation — the synchroniser relies on
 * the inclusive/exclusive `after()` behaviour described below.)
 */
export function nextAbsoluteOccurrence(
  ruleStrings: string[],
  range: TimeRange,
  anchor: Date,
): Date | null {
  if (ruleStrings.length === 0) return null

  const rrule = parseRRule(ruleStrings[0])
  const fromDate = new Date(range.from)
  const toDate = new Date(range.to)
  if (anchor.getTime() > toDate.getTime()) return null

  const anchorBeforeRange = anchor.getTime() < fromDate.getTime()
  const start = anchorBeforeRange ? fromDate : anchor
  const next = rrule.after(start, anchorBeforeRange)
  if (!next) return null
  if (next.getTime() > range.to) return null
  return next
}
```

> `logger.warn` is intentionally omitted from `parseRecurrence` (the spec's `+ logger.warn` note) — `src/utils/logger.ts` is not IO-free and `verify-recurrence.mts` loads this module under Node. The fallback is silent; a corrupted rule is already visible to the user as "every 1 month". If a log line is wanted later, add it at the call site in `use-transaction-form.ts`, not here.

- [ ] **Step 3: Fix the two call sites in `use-transaction-form.ts` so the project compiles**

Near the top of the hook body (after the other `const` derivations, around line 300), add a temporary bridge (a `// TODO Slice 2 Task 2: delete` comment):

```ts
// TODO Slice 2 Task 2: delete — bridges the old `frequency` state to the new API.
const FREQ_TO_UNIT: Record<string, RecurrenceUnit> = {
  daily: "day",
  weekly: "week",
  biweekly: "week",
  monthly: "month",
  yearly: "year",
}
const bridgeRecurrence: Recurrence = {
  interval: recurring.frequency === "biweekly" ? 2 : 1,
  unit: FREQ_TO_UNIT[recurring.frequency ?? "monthly"] ?? "month",
}
```

Add `Recurrence`, `RecurrenceUnit` to the `~/types/transactions` import.

Replace the `recurringEndDateOccurrenceCount` derive (lines ~288-300) body:

```ts
const recurringEndDateOccurrenceCount = (() => {
  if (endsOnType !== RecurringEndEnum.DATE || !recurring.endDate) return null
  return countOccurrencesBetween(
    recurring.startDate,
    recurring.endDate,
    bridgeRecurrence,
  )
})()
```

Replace the `buildRRuleString({ frequency, startDate, endDate, count })` call in the create branch (lines ~452-457):

```ts
const rruleStr = buildRRuleString({
  interval: bridgeRecurrence.interval,
  unit: bridgeRecurrence.unit,
  startDate: recurring.startDate,
  until: recurring.endDate,
})
```

(The `count` / `endAfterOccurrences` path is dropped here — Task 2 removes the state field and the UI. A rule created via the old "occurrences" end-type in the gap between Task 1 and Task 2 becomes a Forever rule; acceptable, that UI is deleted next task.)

- [ ] **Step 4: Write `scripts/checks/verify-recurrence.mts`**

```ts
#!/usr/bin/env node
import assert from "node:assert/strict"

import {
  buildRRuleString,
  clampInterval,
  countOccurrencesBetween,
  parseRecurrence,
} from "../../src/utils/recurrence.ts"

// clampInterval
assert.equal(clampInterval(0), 1)
assert.equal(clampInterval(2.9), 2)
assert.equal(clampInterval(5000), 999)
assert.equal(clampInterval(Number.NaN), 1)

// build -> parse round-trip
const s = new Date(2026, 0, 1, 9, 0, 0)
for (const r of [
  { interval: 1, unit: "day" },
  { interval: 2, unit: "week" },
  { interval: 3, unit: "month" },
  { interval: 1, unit: "year" },
] as const) {
  const str = buildRRuleString({ ...r, startDate: s })
  assert.deepEqual(parseRecurrence(str), r, `round-trip ${r.interval} ${r.unit}`)
}

// legacy strings parse
assert.deepEqual(parseRecurrence("RRULE:FREQ=WEEKLY;INTERVAL=2"), {
  interval: 2,
  unit: "week",
}) // migrated "biweekly"
assert.deepEqual(parseRecurrence("RRULE:FREQ=MONTHLY"), {
  interval: 1,
  unit: "month",
}) // missing INTERVAL -> 1

// garbage -> fallback, never throws
assert.deepEqual(parseRecurrence("not an rrule"), { interval: 1, unit: "month" })
assert.deepEqual(parseRecurrence(""), { interval: 1, unit: "month" })

// countOccurrencesBetween counts the FIRST occurrence
const start = new Date(2026, 0, 1)
const until = new Date(2026, 0, 29) // Jan 1, 8, 15, 22, 29 -> 5
assert.equal(
  countOccurrencesBetween(start, until, { interval: 1, unit: "week" }),
  5,
)
// every 2 weeks Jan 1 .. Jan 29 -> Jan 1, 15, 29 -> 3
assert.equal(
  countOccurrencesBetween(start, until, { interval: 2, unit: "week" }),
  3,
)
// until before start -> 0
assert.equal(
  countOccurrencesBetween(until, start, { interval: 1, unit: "day" }),
  0,
)

console.log("recurrence: OK")
```

- [ ] **Step 5: Run the checks**

```bash
node scripts/checks/verify-recurrence.mts     # expect: recurrence: OK
pnpm types                                    # expect: clean
pnpm lint                                     # expect: clean (1 pre-existing biome-schema info)
```

- [ ] **Step 6: Commit**

```bash
git add src/types/transactions.ts src/utils/recurrence.ts scripts/checks/verify-recurrence.mts src/components/transaction/transaction-form-v4/use-transaction-form.ts
git commit -m "feat(recurrence): interval+unit RRULE API + parseRecurrence"
```

---

## Task 2: interval+unit recurrence in the form (state, card, kind selector)

**Files:**
- Modify: `src/components/transaction/transaction-form-v4/types.ts` (`RecurringState`, `DatePickerTarget`)
- Modify: `src/components/transaction/transaction-form-v4/constants.ts` (delete `RECURRING_OPTIONS`, `ENDS_ON_OCCURRENCE_PRESETS`)
- Modify: `src/components/transaction/transaction-form-v4/on-kind-change.ts`
- Modify: `src/components/transaction/transaction-form-v4/form-utils.ts` (delete `getRecurrenceDisplayLabel`)
- Modify: `src/components/transaction/transaction-form-v4/use-form-date-picker.tsx`
- Modify: `src/components/transaction/transaction-form-v4/use-transaction-form.ts`
- Modify: `src/components/transaction/transaction-form-v4/index.tsx`
- Modify: `src/components/transaction/transaction-form-v4/form-kind-card.tsx`
- Modify: `src/components/transaction/transaction-form-v4/form-kind-selector.tsx`
- Delete: `src/components/transaction/transaction-form-v4/form-recurring-section.tsx`
- Create: `src/components/transaction/transaction-form-v4/recurrence-card.tsx`
- Create: `src/components/transaction/transaction-form-v4/recurrence-unit-modal.tsx`
- Modify: `src/types/transactions.ts` (delete `RecurringFrequency`, `RecurringEndEnum`, `RecurringEndType`)
- Modify: `scripts/checks/verify-transaction-kind.mts` (on-kind-change assertions → new shape)
- Create: temporary i18n keys used by the card (`recurrence.*`) — final wording/`ar.json` parity is Task 5, but the keys must exist now so `pnpm check-i18n-keys` passes. Add the real English strings here and mirrored Arabic; Task 5 only audits.

**Interfaces:**
- Consumes: `Recurrence`, `RecurrenceUnit`, `buildRRuleString`, `countOccurrencesBetween` (Task 1).
- Produces:
  ```ts
  // types.ts
  export type RecurringState = {
    recurrence: Recurrence
    until: Date | null      // null = Forever
    startDate: Date         // count anchor; = transactionDate (new) or range.from (edit)
  }
  export type DatePickerTarget = "transaction" | "recurringEnd"

  // use-transaction-form.ts return object — CHANGED keys:
  //   recurring: RecurringState
  //   setRecurring: (u: Partial<RecurringState>) => void
  //   occurrenceCount: number | null   // null = Forever; 0 = until < start
  //   isRecurringKind: boolean         // kind === "subscription" || kind === "repetitive"
  // REMOVED keys: endsOnType, recurringEndDateOccurrenceCount, handleRecurringToggle

  // recurrence-card.tsx
  export function RecurrenceCard(props: {
    recurrence: Recurrence
    until: Date | null
    occurrenceCount: number | null
    onIntervalChange: (n: number) => void
    onUnitChange: (u: RecurrenceUnit) => void
    onUntilPress: () => void
    onUntilReset: () => void
  }): JSX.Element

  // recurrence-unit-modal.tsx
  export function RecurrenceUnitModal(props: {
    visible: boolean
    value: RecurrenceUnit
    onSelect: (u: RecurrenceUnit) => void
    onClose: () => void
  }): JSX.Element
  ```

- [ ] **Step 1: `types.ts` — new `RecurringState` + `DatePickerTarget`**

```ts
// replace the RecurrenceUnit/... imports block to include Recurrence
import type {
  Recurrence,
  RecurrenceUnit,               // used by other files importing from here
  TransactionAttachment,
  TransactionKind,
  TransactionType,
} from "~/types/transactions"

// remove RecurringFrequency from the import list (deleted from the source in Step 9)

export type DatePickerTarget = "transaction" | "recurringEnd"

export type RecurringState = {
  recurrence: Recurrence
  until: Date | null
  startDate: Date
}
```

Delete the old `RecurringState` (`enabled`/`frequency`/`endDate`/`endAfterOccurrences`/`endsOnPickerExpanded`) and the `RecurringFrequency` reference on its `frequency` field.

- [ ] **Step 2: `constants.ts` — delete dead option lists**

Remove the `RecurringFrequency` import, `RECURRING_OPTIONS`, and `ENDS_ON_OCCURRENCE_PRESETS`. Keep `EMPTY_TAG_IDS`.

- [ ] **Step 3: `on-kind-change.ts` — new recurrence shape**

Replace `disabledRecurring` / `enabledRecurring` with a single `freshRecurrence`, and simplify the subscription/repetitive branch:

```ts
import type { Recurrence, TransactionKind } from "~/types/transactions"

import type { RecurringState } from "./types"

export type LoanDraft = { name: string; dueDate: Date | null }

export type KindScratchState = {
  recurring: RecurringState
  loanDraft: LoanDraft | null
  linkedLoanId: string | null
  toAccountId: string | undefined
}

const RECURRING_KINDS = new Set<TransactionKind>(["subscription", "repetitive"])
const DEFAULT_RECURRENCE: Recurrence = { interval: 1, unit: "month" }

function freshRecurrence(): RecurringState {
  return { recurrence: { ...DEFAULT_RECURRENCE }, until: null, startDate: new Date() }
}

export function onKindChange(
  prev: TransactionKind,
  next: TransactionKind,
  state: KindScratchState,
): Partial<KindScratchState> {
  if (prev === next) return {}

  // subscription <-> repetitive: label only, keep the recurrence scratch.
  if (RECURRING_KINDS.has(prev) && RECURRING_KINDS.has(next)) return {}

  if (next === "default" || next === "upcoming") {
    const out: Partial<KindScratchState> = {
      recurring: freshRecurrence(),
      loanDraft: null,
      linkedLoanId: null,
    }
    if (next === "upcoming" && state.toAccountId !== undefined) {
      out.toAccountId = undefined
    }
    return out
  }

  if (RECURRING_KINDS.has(next)) {
    // arrived from a non-recurring kind -> seed a fresh recurrence
    return { recurring: freshRecurrence(), loanDraft: null, linkedLoanId: null }
  }

  // next is "lent" | "borrowed"
  return {
    recurring: freshRecurrence(),
    loanDraft: { name: "", dueDate: null },
    toAccountId: undefined,
  }
}
```

- [ ] **Step 4: `verify-transaction-kind.mts` — fix the on-kind-change assertions**

Replace lines 105-123 (the `kindScratch` block) with:

```ts
// KT matrix: leaving a recurring kind reseeds a fresh recurrence + clears loan scratch.
const kindScratch = {
  recurring: {
    recurrence: { interval: 2, unit: "week" },
    until: new Date(),
    startDate: new Date(),
  },
  loanDraft: { name: "x", dueDate: null },
  linkedLoanId: "L1",
  toAccountId: "A2",
} as any
const toDefault = onKindChange("subscription", "default", kindScratch)
assert.deepEqual(toDefault.recurring?.recurrence, { interval: 1, unit: "month" })
assert.equal(toDefault.recurring?.until, null)
assert.equal(toDefault.loanDraft, null)
assert.equal(toDefault.linkedLoanId, null)
// subscription <-> repetitive keeps the recurrence scratch untouched.
const subToRep = onKindChange("subscription", "repetitive", kindScratch)
assert.equal("recurring" in subToRep, false)
// -> lent seeds a loan draft, reseeds recurrence, drops to-account.
const toLent = onKindChange("default", "lent", kindScratch)
assert.deepEqual(toLent.loanDraft, { name: "", dueDate: null })
assert.equal(toLent.toAccountId, undefined)
```

- [ ] **Step 5: `use-form-date-picker.tsx` — `until` target**

In `applyTarget`, replace the `recurringStart`/`recurringEnd` branches with a single `recurringEnd` → `until`:

```ts
const applyTarget = (date: Date) => {
  if (datePickerTargetRef.current === "recurringEnd") {
    setRecurring({ until: date })
    return
  }
  setValue("transactionDate", date, { shouldDirty: true })
  setValue("isPending", date.getTime() > startOfNextMinute().getTime(), {
    shouldDirty: true,
  })
}
```

In `openDatePicker`, replace the `current` computation:

```ts
const current =
  target === "recurringEnd"
    ? (recurring.until ?? new Date())
    : watch("transactionDate")
```

- [ ] **Step 6: `use-transaction-form.ts` — state, derives, submit branch**

1. Imports: drop `RecurringEndEnum`, `RecurringEndType`, `RecurringFrequency`; add `Recurrence`. Drop the Task 1 `FREQ_TO_UNIT` / `bridgeRecurrence` bridge added in Task 1 Step 3.

2. Replace the `recurring` reducer init (lines ~232-239):

```ts
const [recurring, setRecurring] = useReducer(mergeReducer<RecurringState>, {
  recurrence: { interval: 1, unit: "month" },
  until: null,
  startDate: watch("transactionDate"),
})
```

3. `isRecurringKind` + `occurrenceCount` derives (replace `endsOnType` + `recurringEndDateOccurrenceCount`, lines ~282-300):

```ts
const isRecurringKind = kind === "subscription" || kind === "repetitive"
const occurrenceCount = recurring.until
  ? countOccurrencesBetween(
      recurring.startDate,
      endOfDay(recurring.until),
      recurring.recurrence,
    )
  : null
```

Add `import { endOfDay } from "date-fns"`.

4. Delete `handleRecurringToggle` (lines ~301-306).

5. Keep `recurring.startDate` synced to the form date for new recurring rules. Just after the derives, add:

```ts
// RS-1: a new subscription/repetitive starts at the form's transactionDate
// (which is `new Date()` at open for these kinds — Date field is hidden).
if (isNew && isRecurringKind && recurring.startDate !== watch("transactionDate")) {
  // reducer merge is cheap + idempotent; no effect needed
  setRecurring({ startDate: watch("transactionDate") })
}
```

> If a lint rule flags the bare conditional `setRecurring` call in render, wrap it in a `useEffect(() => { ... }, [isNew, isRecurringKind, ...])`. Prefer the effect if unsure.

6. Submit — replace the create branch condition (line ~450) `if (recurring.enabled && recurring.frequency) {` with:

```ts
if (data.kind === "subscription" || data.kind === "repetitive") {
```

Inside it, replace the `buildRRuleString` call + `range`:

```ts
const startDate = data.transactionDate
const untilEod = recurring.until ? endOfDay(recurring.until) : null

// RS-4: until before start -> no valid occurrences; block the save.
if (untilEod && countOccurrencesBetween(startDate, untilEod, recurring.recurrence) === 0) {
  Toast.error({ title: t("components.transactionForm.toast.recurringUntilBeforeStart") })
  return
}

const rruleStr = buildRRuleString({
  interval: recurring.recurrence.interval,
  unit: recurring.recurrence.unit,
  startDate,
  until: recurring.until,
})
const rangeEnd = untilEod?.getTime() ?? new Date(2099, 11, 31).getTime()
await createRecurringRule({
  amount: data.amount,
  type: data.type,
  accountId: data.accountId,
  categoryId: data.categoryId ?? null,
  title: data.title?.trim() ?? null,
  description: data.description?.trim() ?? null,
  subtype: data.subtype ?? null,
  tags: data.tags ?? [],
  kind: data.kind,                              // CSI-4 — was hard-coded "repetitive"
  range: { from: startDate.getTime(), to: rangeEnd },
  rules: [rruleStr],
})
```

7. `effectiveDate` (line ~432): it currently branches on `recurring.enabled`. Change to `isRecurringKind`:

```ts
const effectiveDate = isRecurringKind ? recurring.startDate : data.transactionDate
```

8. Return object: remove `endsOnType`, `recurringEndDateOccurrenceCount`, `handleRecurringToggle`; add `occurrenceCount`, `isRecurringKind`. Keep `recurring`, `setRecurring`, `openDatePicker`.

- [ ] **Step 7: `recurrence-unit-modal.tsx` (new)**

```tsx
import { useTranslation } from "react-i18next"
import { Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { modalStyles } from "~/components/selector-modals/styles"
import { Button } from "~/components/ui/button"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import type { RecurrenceUnit } from "~/types/transactions"

const UNITS: RecurrenceUnit[] = ["day", "week", "month", "year"]
const UNIT_KEY: Record<RecurrenceUnit, TranslationKey> = {
  day: "components.transactionForm.recurrence.unit.day",
  week: "components.transactionForm.recurrence.unit.week",
  month: "components.transactionForm.recurrence.unit.month",
  year: "components.transactionForm.recurrence.unit.year",
}

type Props = {
  visible: boolean
  value: RecurrenceUnit
  onSelect: (u: RecurrenceUnit) => void
  onClose: () => void
}

export function RecurrenceUnitModal({ visible, value, onSelect, onClose }: Props) {
  const { t } = useTranslation()
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <SafeAreaView style={modalStyles.modalContainer} edges={["top", "bottom"]}>
        <View style={modalStyles.header}>
          <Text variant="default" style={modalStyles.headerTitle}>
            {t("components.transactionForm.recurrence.unitTitle")}
          </Text>
          <Button variant="ghost" onPress={onClose}>
            <Text variant="default">{t("common.actions.cancel")}</Text>
          </Button>
        </View>
        <View style={modalStyles.listWrapper}>
          {UNITS.map((u) => (
            <ListItem
              key={u}
              style={[modalStyles.item, u === value && modalStyles.itemSelected]}
              onPress={() => {
                onSelect(u)
                onClose()
              }}
            >
              {/* count:2 so the label reads as a plural noun ("weeks"), not "every 2 week" */}
              <Text variant="large">{t(UNIT_KEY[u], { count: 2 })}</Text>
            </ListItem>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  )
}
```

- [ ] **Step 8: `recurrence-card.tsx` (new)**

Discrete controls. `[N]` is an inline `−  N  +` stepper (clamped 1..999 — simpler than a modal and RTL-safe); `[unit]` opens `RecurrenceUnitModal`; "Until" opens the date picker via `onUntilPress`; when a date is set, show `<date> · ×N` with a reset (✕).

```tsx
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Recurrence, RecurrenceUnit } from "~/types/transactions"
import { clampInterval } from "~/utils/recurrence"
import { formatTransactionDateTime } from "~/utils/time-utils"

import { transactionFormStyles } from "./form.styles"
import { RecurrenceUnitModal } from "./recurrence-unit-modal"

type Props = {
  recurrence: Recurrence
  until: Date | null
  occurrenceCount: number | null
  onIntervalChange: (n: number) => void
  onUnitChange: (u: RecurrenceUnit) => void
  onUntilPress: () => void
  onUntilReset: () => void
}

export function RecurrenceCard({
  recurrence,
  until,
  occurrenceCount,
  onIntervalChange,
  onUnitChange,
  onUntilPress,
  onUntilReset,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [unitModal, setUnitModal] = useState(false)

  const unitLabel = t(
    `components.transactionForm.recurrence.unit.${recurrence.unit}` as const,
    { count: recurrence.interval },
  )
  const untilLabel = until
    ? `${formatTransactionDateTime(until)}${
        occurrenceCount != null ? `  ·  ×${occurrenceCount}` : ""
      }`
    : t("components.transactionForm.recurrence.forever")

  return (
    <View style={transactionFormStyles.fieldBlock}>
      {/* "every  [−] N [+]  [unit ▾]" */}
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.recurrence.every")}
        </Text>
      </View>
      <View style={transactionFormStyles.recurrenceRow /* new style: flexDirection row, gap 8, alignItems center */}>
        <Pressable
          onPress={() => onIntervalChange(clampInterval(recurrence.interval - 1))}
          disabled={recurrence.interval <= 1}
          accessibilityLabel={t("components.transactionForm.recurrence.decrement")}
          style={transactionFormStyles.stepperButton /* new style */}
        >
          <Text variant="large">−</Text>
        </Pressable>
        <Text variant="large" style={transactionFormStyles.stepperValue /* new style, min width, textAlign center, writingDirection ltr */}>
          {recurrence.interval}
        </Text>
        <Pressable
          onPress={() => onIntervalChange(clampInterval(recurrence.interval + 1))}
          disabled={recurrence.interval >= 999}
          accessibilityLabel={t("components.transactionForm.recurrence.increment")}
          style={transactionFormStyles.stepperButton}
        >
          <Text variant="large">+</Text>
        </Pressable>

        <Pressable
          onPress={() => setUnitModal(true)}
          style={transactionFormStyles.recurrenceUnitButton /* new style: flex 1 row space-between */}
          accessibilityRole="button"
        >
          <Text variant="default">{unitLabel}</Text>
          <ChevronIcon direction="trailing" size={20} style={transactionFormStyles.chevronIcon} />
        </Pressable>
      </View>

      {/* "Until  <Forever | date · ×N>  [✕]" */}
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.recurrence.until")}
        </Text>
        {until && (
          <Pressable
            onPress={onUntilReset}
            style={transactionFormStyles.clearButton}
            accessibilityLabel={t("components.transactionForm.recurrence.reset")}
          >
            <Text variant="small" style={transactionFormStyles.clearButtonText}>
              {t("components.transactionForm.recurrence.reset")}
            </Text>
          </Pressable>
        )}
      </View>
      <ListItem style={transactionFormStyles.inlineDateRow} onPress={onUntilPress}>
        <DynamicIcon icon="calendar-outline" size={20} color={theme.colors.primary} variant="badge" />
        <Text
          variant="default"
          style={[
            transactionFormStyles.inlineDateText,
            !until && transactionFormStyles.fieldPlaceholder,
          ]}
        >
          {untilLabel}
        </Text>
        <ChevronIcon direction="trailing" size={20} style={transactionFormStyles.chevronIcon} />
      </ListItem>

      {occurrenceCount === 0 && (
        <Text variant="small" style={transactionFormStyles.fieldError}>
          {t("components.transactionForm.recurrence.untilBeforeStart")}
        </Text>
      )}

      <RecurrenceUnitModal
        visible={unitModal}
        value={recurrence.unit}
        onSelect={onUnitChange}
        onClose={() => setUnitModal(false)}
      />
    </View>
  )
}
```

Add the four new style keys (`recurrenceRow`, `stepperButton`, `stepperValue`, `recurrenceUnitButton`) to `src/components/transaction/transaction-form-v4/form.styles.ts` following the existing `StyleSheet.create((t) => ...)` callback form. `stepperValue` must set `writingDirection: "ltr"` and a fixed `minWidth` so the number stays LTR inside an RTL layout.

- [ ] **Step 9: delete `form-recurring-section.tsx`; wire `form-kind-card.tsx`; `index.tsx`; kind selector; delete dead types**

`form-kind-card.tsx` — replace the `subscription`/`repetitive` case:

```tsx
type Props = {
  kind: TransactionKind
  recurrence: Recurrence
  until: Date | null
  occurrenceCount: number | null
  onIntervalChange: (n: number) => void
  onUnitChange: (u: RecurrenceUnit) => void
  onUntilPress: () => void
  onUntilReset: () => void
}

export function FormKindCard(props: Props) {
  const { t } = useTranslation()
  switch (props.kind) {
    case "subscription":
    case "repetitive":
      return (
        <RecurrenceCard
          recurrence={props.recurrence}
          until={props.until}
          occurrenceCount={props.occurrenceCount}
          onIntervalChange={props.onIntervalChange}
          onUnitChange={props.onUnitChange}
          onUntilPress={props.onUntilPress}
          onUntilReset={props.onUntilReset}
        />
      )
    case "lent":
    case "borrowed":
      return (
        <View style={formKindCardStyles.card}>
          <Text variant="small" style={formKindCardStyles.text}>
            {t("components.transactionForm.kind.loanComingSoon")}
          </Text>
        </View>
      )
    default:
      return null
  }
}
```

`index.tsx`:
- `<FormKindCard kind={f.kind} />` → pass the recurrence props:
  ```tsx
  <FormKindCard
    kind={f.kind}
    recurrence={f.recurring.recurrence}
    until={f.recurring.until}
    occurrenceCount={f.occurrenceCount}
    onIntervalChange={(n) => f.setRecurring({ recurrence: { ...f.recurring.recurrence, interval: n } })}
    onUnitChange={(u) => f.setRecurring({ recurrence: { ...f.recurring.recurrence, unit: u } })}
    onUntilPress={() => f.openDatePicker("recurringEnd")}
    onUntilReset={() => f.setRecurring({ until: null })}
  />
  ```
- Date section gate (line ~103): `{!f.recurring.enabled && (` → `{!f.isRecurringKind && (`
- Refund `ListItem` gate (line ~245): drop `!f.recurring.enabled &&`; drop `disabled={f.recurring.enabled}` on the `ListItem` and `<Switch>`.
- Delete the entire `{!f.isRefund && f.kind !== "subscription" && f.kind !== "repetitive" && (<FormRecurringSection .../>)}` block (lines ~274-323) and the `FormRecurringSection` import.

`form-kind-selector.tsx`:
```ts
const KINDS: TransactionKind[] = ["default", "upcoming", "subscription", "repetitive"]
```
(Leave the `lent`/`borrowed` comment; those wait for Slice 4.)

`src/types/transactions.ts` — delete `RecurringFrequency`, `RecurringEndEnum`, `RecurringEndType` (nothing imports them after this task — verify with grep in Step 10).

`git rm src/components/transaction/transaction-form-v4/form-recurring-section.tsx`.

- [ ] **Step 10: add the `recurrence.*` i18n keys (en + ar)**

`src/i18n/translation/en.json` under `components.transactionForm` — add a `recurrence` object:

```json
"recurrence": {
  "every": "Repeat every",
  "unitTitle": "Repeat unit",
  "unit": {
    "day_one": "day",
    "day_other": "days",
    "week_one": "week",
    "week_other": "weeks",
    "month_one": "month",
    "month_other": "months",
    "year_one": "year",
    "year_other": "years"
  },
  "until": "Until",
  "forever": "Forever",
  "reset": "Reset",
  "increment": "Increase interval",
  "decrement": "Decrease interval",
  "untilBeforeStart": "End date is before the start date — no occurrences."
}
```

Add `"recurringUntilBeforeStart": "The end date is before the start date"` under `components.transactionForm.toast`.

Mirror all of it in `ar.json` with real Arabic (the reviewer / a fluent check confirms wording; i18next supplies Arabic's `zero`/`one`/`two`/`few`/`many`/`other` plural categories — provide at least `_one` and `_other`, add the others if the translator supplies them).

- [ ] **Step 11: run checks**

```bash
node scripts/checks/verify-recurrence.mts            # recurrence: OK
node scripts/checks/verify-transaction-kind.mts      # transaction-kind: OK
pnpm types
pnpm lint
pnpm check-i18n-keys                                  # 0 missing / 0 extra
grep -rn "RecurringFrequency\|RECURRING_OPTIONS\|biweekly\|endAfterOccurrences\|RecurringEndEnum\|getRecurrenceDisplayLabel\|form-recurring-section\|FormRecurringSection" src/   # expect: no matches
```

- [ ] **Step 12: Manual QA (simulator — record result in the ledger)**

- New expense → set kind `Subscription` → Date row disappears, card shows "Repeat every − 1 + [month]".
- Bump interval to 2, unit → "week". Set "Until" a date ~2 months out → shows `<date> · ×N`. Reset ✕ → back to "Forever".
- Save → a `recurring_transactions` row exists; the first instance appears in the list with the scheduled-recurring indicator (not an "Upcoming" chip).
- Switch kind `Subscription` ↔ `Repetitive` → interval/unit/until survive unchanged.
- Switch kind `Subscription` → `Standard` → recurrence controls vanish, Date row returns.
- Arabic: card mirrors; `−`/number/`+` stay LTR; `×N` stays LTR.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat(transaction-form): interval+unit recurrence card; subscription/repetitive selectable"
```

---

## Task 3: submit semantics — RS-3 / RS-4, and `kind` on the rule

> Most of this landed in Task 2 Step 6. This task is the **verification + hardening** pass: confirm the "(×N)" the card shows equals what the synchroniser spawns, and that `until < start` is blocked in both the card (×0 message) and the submit guard.

**Files:**
- Modify: `src/components/transaction/transaction-form-v4/use-transaction-form.submit.ts` — only if a recurrence concern belongs in the pure builder (see Step 2); otherwise no code change and this task is a review gate.
- Modify: `scripts/checks/verify-recurrence.mts` — add the "count == spawn" cross-check.

- [ ] **Step 1: Add the count-equals-spawn assertion to `verify-recurrence.mts`**

The synchroniser generates every occurrence `> lastGenerated` and `<= range.to`, starting inclusive of `range.from`. Assert `countOccurrencesBetween(from, endOfDay(until), rec)` equals the number of `rrule.between(from, endOfDay(until), true)` entries for a handful of intervals — same call, so this pins the contract:

```ts
import { endOfDay } from "date-fns"
import { RRule } from "rrule"

const from = new Date(2026, 2, 1, 8, 0, 0)
const untilEod = endOfDay(new Date(2026, 5, 1))
for (const rec of [
  { interval: 1, unit: "week" },
  { interval: 2, unit: "week" },
  { interval: 1, unit: "month" },
] as const) {
  const n = countOccurrencesBetween(from, untilEod, rec)
  const spawned = new RRule({
    freq: { day: RRule.DAILY, week: RRule.WEEKLY, month: RRule.MONTHLY, year: RRule.YEARLY }[rec.unit],
    interval: rec.interval,
    dtstart: from,
    until: untilEod,
  }).between(from, untilEod, true).length
  assert.equal(n, spawned, `count==spawn for ${rec.interval} ${rec.unit}`)
}
```

- [ ] **Step 2: Decide whether `buildTransactionPayload` needs a recurrence branch**

Read `use-transaction-form.submit.ts`. The recurring create path calls `createRecurringRule` directly (not `buildTransactionPayload`), so **no change** is expected here. If the reviewer finds recurrence state leaking into `buildTransactionPayload`, move the RS-4 guard into a new pure `assertRecurrenceValid(startDate, until, recurrence)` in `recurrence.ts` and call it from both the card-derive and the submit branch. Otherwise leave the guard inline in `use-transaction-form.ts` (Task 2 Step 6).

- [ ] **Step 3: Manual QA**

- "every 1 week", until = start + 28 days → card shows `×5` (weeks: start, +7, +14, +21, +28). Save. The list shows exactly 5 instances generated through that date (some pending if future).
- Set "Until" to a date **before** today → card shows `×0` + the "before start" line; **Save is blocked** with the toast.

- [ ] **Step 4: Commit**

```bash
git add scripts/checks/verify-recurrence.mts
git commit -m "test(recurrence): pin count==spawn; verify RS-3/RS-4 in submit"
```

---

## Task 4: edit an existing rule — `parseRecurrence` init + `updateRecurringRule` + ES-8

**Files:**
- Modify: `src/database/services/recurring-transaction-service.ts` — add `updateRecurringRule`; extend `applyRecurringEditScope`
- Modify: `src/components/transaction/edit-recurring-modal.tsx` — accept `recurrence` / `until`
- Modify: `src/components/transaction/transaction-form-v4/form-modals.tsx` — forward them
- Modify: `src/components/transaction/transaction-form-v4/use-transaction-form.ts` — init `recurring` from the rule on edit; pass card recurrence into the edit-modal payload

**Interfaces:**
- Consumes: `parseRecurrence` (Task 1), `buildRRuleString` (Task 1), `RecurringState` (Task 2).
- Produces:
  ```ts
  // recurring-transaction-service.ts
  export async function updateRecurringRule(
    ruleId: string,
    opts: { recurrence: Recurrence; until: Date | null },
  ): Promise<void>

  // applyRecurringEditScope — args gain:
  //   recurrence?: Recurrence
  //   until?: Date | null
  // (only consumed on the "this_and_future" branch)
  ```

- [ ] **Step 1: `updateRecurringRule` in `recurring-transaction-service.ts`**

```ts
import { and, count, desc, eq, lte } from "drizzle-orm"
// ...
import type { Recurrence, TransactionKind, TransactionSubType } from "~/types/transactions"
import { buildRRuleString, nextAbsoluteOccurrence } from "~/utils/recurrence"
import { endOfDay } from "date-fns"

const FOREVER_MS = new Date(2099, 11, 31).getTime()

/**
 * ES-8 — rewrite a rule's recurrence (interval/unit) and/or its "until".
 * Keeps `range.from` (RS-2). Resets `last_generated_transaction_date` to the
 * latest already-generated occurrence <= now so the next sync continues without
 * duplicating or skipping. Never touches the template fields.
 */
export async function updateRecurringRule(
  ruleId: string,
  opts: { recurrence: Recurrence; until: Date | null },
): Promise<void> {
  const rule = drizzleDb
    .select(recurringSelection)
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, ruleId))
    .get()
  if (!rule) throw new Error(`Recurring rule ${ruleId} not found`)

  const range = parseTimeRange(rule) // keeps range.from
  const untilEod = opts.until ? endOfDay(opts.until) : null
  const nextRange = {
    from: range.from,
    to: untilEod?.getTime() ?? FOREVER_MS,
  }
  const rrule = buildRRuleString({
    interval: opts.recurrence.interval,
    unit: opts.recurrence.unit,
    startDate: new Date(range.from),
    until: opts.until ?? null,
  })

  const nowIso = new Date().toISOString()
  const lastPast = drizzleDb
    .select({ d: transactions.transactionDate })
    .from(transactions)
    .where(
      and(
        eq(transactions.recurringId, ruleId),
        eq(transactions.isDeleted, 0),
        lte(transactions.transactionDate, nowIso),
      ),
    )
    .orderBy(desc(transactions.transactionDate))
    .get()

  await runInTransaction("recurring.updateRule", (db) => {
    db.update(recurringTransactions)
      .set({
        rules: JSON.stringify([rrule]),
        range: JSON.stringify(nextRange),
        lastGeneratedTransactionDate: lastPast?.d ?? null,
      })
      .where(eq(recurringTransactions.id, ruleId))
      .run()
  })

  await synchronizeAllRecurringTransactions()
}
```

- [ ] **Step 2: extend `applyRecurringEditScope`**

```ts
export async function applyRecurringEditScope({
  scope,
  transactionId,
  transactionDate,
  ruleId,
  payload,
  recurrence,
  until,
}: {
  scope: RecurringEditScope
  transactionId: string
  transactionDate: Date
  ruleId: string
  payload: RecurringEditPayload
  recurrence?: Recurrence
  until?: Date | null
}): Promise<void> {
  const { detachFromRule, updateFutureRecurringInstances, updateTransaction } =
    await import("./ledger-service")

  if (scope === "this") {
    await detachFromRule(transactionId)
    await updateTransaction(transactionId, payload)
    return
  }

  await updateFutureRecurringInstances(ruleId, transactionDate, payload)
  await updateRecurringRuleTemplate(ruleId, {
    amount: payload.amount,
    title: payload.title,
    categoryId: payload.categoryId,
    accountId: payload.accountId,
    type: payload.type,
  })
  if (recurrence) {
    await updateRecurringRule(ruleId, { recurrence, until: until ?? null })
  }
  await updateTransaction(transactionId, payload)
}
```

- [ ] **Step 3: `edit-recurring-modal.tsx` — accept + forward**

Add to `EditRecurringModalProps`: `recurrence?: Recurrence`, `until?: Date | null`. In `handleEdit`, pass them into `applyRecurringEditScope({ ..., recurrence, until })`. (Import `Recurrence` type.)

- [ ] **Step 4: `form-modals.tsx` — thread through**

Where `<EditRecurringModal>` is rendered (line ~102), add `recurrence={...}` / `until={...}` from new props on `FormModals` (`recurrenceForEdit`, `untilForEdit`), which `index.tsx` passes from `f.recurring.recurrence` / `f.recurring.until` — but only when the card actually changed. Simplest correct rule: always pass the current card values; `updateRecurringRule` is idempotent when they equal the stored rule (rebuilds an identical `rules`/`range`, resets `last_generated` to the same value).

- [ ] **Step 5: `use-transaction-form.ts` — init from the rule on edit**

When `transaction?.recurringId` and `recurringRule` are present (the hook already fetches `recurringRule` via `useRecurringRule`), seed `recurring` once from the stored rule. `recurringRule` (`RecurringTransactionTemplate`) does **not** carry `rules`/`range` today — extend `findRecurringById` / `RecurringTransactionTemplate` to also return `rules: string[]` and `range: { from: number; to: number }`, OR add a dedicated `getRecurringRuleRaw(id)`. Prefer extending the template:

```ts
// recurring-transaction-service.ts — RecurringTransactionTemplate gains:
rules: string[]
range: { from: number; to: number }
// parseTemplate: return { ...template, rules: parseRules(row), range: parseTimeRange(row) }
```

Then in the hook:

```ts
const seededRef = useRef(false)
if (!seededRef.current && transaction?.recurringId && recurringRule) {
  seededRef.current = true
  const rec = parseRecurrence(recurringRule.rules[0] ?? "")
  const to = recurringRule.range.to
  setRecurring({
    recurrence: rec,
    until: to >= new Date(2099, 0, 1).getTime() ? null : new Date(to),
    startDate: new Date(recurringRule.range.from), // RS-2 anchor
  })
}
```

> Use a `useEffect` keyed on `[recurringRule?.id]` if a bare conditional in render trips lint.

- [ ] **Step 6: Manual QA**

- Open an existing **migrated biweekly** recurring instance → kind shows `Repetitive`, card shows "every 2 weeks".
- Change to "every 1 month", Save → choose "This and future" → future instances regenerate on the monthly cadence; past instances untouched; no duplicate at the seam.
- Choose "This transaction" on a recurrence change → only that instance detaches (existing behaviour); the rule keeps its old cadence.
- Corrupt a rule's `rules` value in Drizzle Studio to `"garbage"` → the edit screen still renders, card shows "every 1 month" (no crash).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(recurring): updateRecurringRule + ES-8 recurrence edit via this_and_future"
```

---

## Task 5: i18n audit + dead-code sweep + full verification

**Files:**
- Modify: `src/i18n/translation/en.json`, `src/i18n/translation/ar.json`
- Modify: `src/components/transaction/transaction-form-v4/form-utils.ts` (confirm `getRecurrenceDisplayLabel` gone; imports pruned)
- Grep-driven deletions only

- [ ] **Step 1: delete dead i18n keys**

Remove (confirmed used only by the deleted `form-recurring-section.tsx` / `getRecurrenceDisplayLabel`):

- `components.recurring.frequency.*` (none, daily, weekly, biweekly, monthly, yearly)
- `components.transactionForm.recurring.recurrence`
- `components.transactionForm.recurring.startsOn`
- `components.transactionForm.recurring.endsOn`
- `components.transactionForm.recurring.never`
- `components.transactionForm.recurring.onADate`
- `components.transactionForm.recurring.occurrences`
- `components.transactionForm.recurring.timesCount_one` / `_other`
- `components.transactionForm.recurring.label`

**Keep** `components.recurring.deleteModal.*`, `components.recurring.editModal.*`, `components.transactionForm.toast.recurring*`, `components.transactionItem.recurring`, `components.transactionForm.kind.recurrenceComingSoon` (still referenced? grep — if `form-kind-card` no longer uses it, delete it too).

Delete the same keys from `ar.json`. Run `pnpm check-i18n-keys` — must be 0/0.

- [ ] **Step 2: grep sweep — no orphans**

```bash
grep -rn "RecurringFrequency\|RecurringEndEnum\|RecurringEndType\|RECURRING_OPTIONS\|ENDS_ON_OCCURRENCE_PRESETS\|endAfterOccurrences\|endsOnType\|endsOnPickerExpanded\|getRecurrenceDisplayLabel\|recurring\.enabled\|handleRecurringToggle\|form-recurring-section\|recurring\.frequency" src/
```

Expect **no matches**. Any hit is a Task 2/4 miss — fix it here.

- [ ] **Step 3: full verification**

```bash
node scripts/checks/verify-recurrence.mts          # recurrence: OK
node scripts/checks/verify-transaction-kind.mts    # transaction-kind: OK
pnpm types
pnpm lint
pnpm structure
pnpm check-i18n-keys
pnpm check-number-formatting
```

- [ ] **Step 4: Slice-2 acceptance walk-through (spec lines 448-457) — record in the ledger**

1. New "every 2 weeks until <date>" subscription: the "(×N)" on the card equals the number of instances `synchronizeAllRecurringTransactions` produced through `<date>`, counting the first occurrence.
2. Editing a migrated biweekly rule shows "every 2 weeks".
3. `parseRecurrence` returns the fallback (not a throw) for a deliberately corrupted `rules` value; the edit screen still renders.
4. Reset returns "until" to Forever and `range.to` to the `2099-12-31` sentinel.
5. `until` set before `start` shows "(×0)" and blocks save.
6. RTL: recurrence card mirrors; `−`/number/`+` and `×N` stay LTR.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(recurrence): drop dead frequency model + i18n keys; Slice 2 verification"
```

---

## Self-Review

**1. Spec coverage**

| Spec item (Slice 2) | Task |
|---|---|
| `Recurrence` / `RecurrenceUnit` types; delete `RecurringFrequency`, `RECURRING_OPTIONS`, `biweekly` | 1 (add), 2 (delete) |
| `buildRRuleString({interval,unit,startDate,until?})`, `count` removed | 1 |
| `countOccurrencesBetween` = `between(...,inc=true).length`, counts first | 1 (+ 3 pin) |
| `parseRecurrence` — missing INTERVAL→1, bad FREQ→`{1,month}`, malformed→fallback (no throw), clamp | 1 |
| RS-1 start = `transactionDate`, Date hidden | 2 (Step 6.5, Step 9 Date gate) |
| RS-2 edit keeps `range.from` | 4 (updateRecurringRule, seed) |
| RS-3 until → end-of-day; Forever → `2099-12-31` sentinel | 1 (`buildRRuleString`), 2 (submit), 4 |
| RS-4 until < start → ×0 + blocks save | 2 (submit guard), 2 (card ×0), 3 (QA) |
| RS-5 shared anchor for count + spawn | 3 (assertion) |
| `recurrence-card.tsx` replaces `form-recurring-section.tsx`; discrete controls | 2 |
| stepper (1..999) + unit modal | 2 (inline stepper + `recurrence-unit-modal.tsx`) |
| "Until [date\|Forever]" + `×N` + reset ✕ | 2 |
| default `{interval:1,unit:'month'}`, `until:null` | 2 (`freshRecurrence`, reducer init) |
| edit init from `parseRecurrence(rule.rules[0])` + `rule.range` | 4 |
| ES-8 `this_and_future` rewrites `rules`+`range`, resets `last_generated` | 4 (`updateRecurringRule`, `applyRecurringEditScope`) |
| `this` scope edits single instance only | 4 (unchanged path) |
| No migration; legacy strings at read time | 1 (`parseRecurrence`), Global Constraints |
| CSI-4 — `kind: data.kind` on `createRecurringRule` (was `"repetitive"`) | 2 (Step 6.6) |
| CSI-2 — pending recurring instance keeps its kind | unchanged; guarded by existing `synchronizeRecurringTransaction` + assert |
| i18n `recurrence.every/until/forever/reset` + `recurrence.unit.*` plurals, en + ar | 2 (add), 5 (audit) |
| RTL — `×N` + stepper LTR | 2 (Step 8 style note), 5 (QA) |
| Old-value cleanup: `biweekly`, `RecurringFrequency`, `RECURRING_OPTIONS`, `endAfterOccurrences` → Slice 2 | 2, 5 (grep sweep) |

No gaps.

**2. Placeholder scan** — none: every code step carries the code; QA steps enumerate concrete cases.

**3. Type consistency** — `Recurrence { interval; unit }` and `RecurrenceUnit` are used identically across `recurrence.ts` (T1), `RecurringState` / `on-kind-change` / `recurrence-card` (T2), `updateRecurringRule` / `applyRecurringEditScope` (T4). `RecurringState` gains `startDate` in T2 and is read as the count anchor in T2 and re-seeded in T4. `occurrenceCount` (`number | null`) is produced by the hook (T2) and consumed by `RecurrenceCard` / `FormKindCard` (T2). `createRecurringRule` already accepts `kind: TransactionKind` (Slice 1) — T2 only changes the argument value.

**Risk carried forward:** `RecurringTransactionTemplate` gains `rules` / `range` in Task 4 Step 5 — any other consumer of `findRecurringById` must still compile (grep: only `use-recurring-rule.ts` → `use-transaction-form.ts`). Confirm during Task 4.
