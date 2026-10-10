#!/usr/bin/env node
import assert from "node:assert/strict"

import { deriveKind } from "../../src/domain/derive-kind.ts"
import { onKindChange } from "../../src/components/transaction/transaction-form-v4/on-kind-change.ts"
import {
  ALLOWED_TYPES_BY_KIND,
  getKindForLoanType,
  getOpeningTypeForLoan,
  getRepaymentTypeForLoan,
  isKindTypeValid,
} from "../../src/domain/transaction-kind.ts"

// kind -> allowed types. Loan kinds allow BOTH directions: opening entry vs
// repayment (lent: expense out / income back; borrowed: income in / expense back).
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.lent].sort(), ["expense", "income"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.borrowed].sort(), ["expense", "income"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.upcoming].sort(), ["expense", "income"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.subscription].sort(), ["expense", "income", "transfer"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.repetitive].sort(), ["expense", "income", "transfer"])
assert.deepEqual([...ALLOWED_TYPES_BY_KIND.default].sort(), ["expense", "income", "transfer"])

// isKindTypeValid — all four loan kind/type combinations are valid.
assert.equal(isKindTypeValid("lent", "expense"), true) // money lent out (opening)
assert.equal(isKindTypeValid("lent", "income"), true) // repayment received
assert.equal(isKindTypeValid("borrowed", "income"), true) // money borrowed (opening)
assert.equal(isKindTypeValid("borrowed", "expense"), true) // repayment made
assert.equal(isKindTypeValid("lent", "transfer"), false)
assert.equal(isKindTypeValid("borrowed", "transfer"), false)
assert.equal(isKindTypeValid("upcoming", "transfer"), false)
assert.equal(isKindTypeValid("repetitive", "transfer"), true)

// loan maps
assert.equal(getKindForLoanType("lent"), "lent")
assert.equal(getKindForLoanType("borrowed"), "borrowed")
assert.equal(getOpeningTypeForLoan("lent"), "expense")
assert.equal(getOpeningTypeForLoan("borrowed"), "income")
assert.equal(getRepaymentTypeForLoan("lent"), "income")
assert.equal(getRepaymentTypeForLoan("borrowed"), "expense")

// CSI-2: which kinds may be pending (enforced in ledger-service createTransaction /
// updateTransaction; confirmTransaction resets an `upcoming` kind to `default`).
const PENDING_OK = new Set(["upcoming", "subscription", "repetitive"])
assert.equal(PENDING_OK.has("default"), false)
assert.equal(PENDING_OK.has("upcoming"), true)

// DM-1: deriveKind mirrors migration 0001 — loan > recurring(id or legacy
// subtype) > pending(non-transfer) > default.
assert.equal(
  deriveKind({
    subtype: "recurring",
    isPending: false,
    type: "expense",
    loanType: null,
    recurringId: null,
  }),
  "repetitive",
)
assert.equal(
  deriveKind({
    subtype: null,
    isPending: true,
    type: "expense",
    loanType: null,
    recurringId: "R1",
  }),
  "repetitive",
) // recurring_id wins over pending
assert.equal(
  deriveKind({
    subtype: null,
    isPending: true,
    type: "expense",
    loanType: null,
    recurringId: null,
  }),
  "upcoming",
)
assert.equal(
  deriveKind({
    subtype: null,
    isPending: true,
    type: "transfer",
    loanType: null,
    recurringId: null,
  }),
  "default",
)
assert.equal(
  deriveKind({
    subtype: null,
    isPending: false,
    type: "expense",
    loanType: "lent",
    recurringId: "R1",
  }),
  "lent",
) // loan wins over recurring
assert.equal(
  deriveKind({
    subtype: null,
    isPending: false,
    type: "income",
    loanType: null,
    recurringId: null,
  }),
  "default",
)

// KT matrix: leaving a recurring kind reseeds a fresh recurrence.
const kindScratch = {
  recurring: {
    recurrence: { interval: 2, unit: "week" },
    until: new Date(),
    startDate: new Date(),
  },
  toAccountId: "A2",
} as any
const toDefault = onKindChange("subscription", "default", kindScratch)
assert.deepEqual(toDefault.recurring?.recurrence, { interval: 1, unit: "month" })
assert.equal(toDefault.recurring?.until, null)
// subscription <-> repetitive keeps the recurrence scratch untouched.
const subToRep = onKindChange("subscription", "repetitive", kindScratch)
assert.equal("recurring" in subToRep, false)
// -> lent reseeds recurrence and drops the transfer destination account.
const toLent = onKindChange("default", "lent", kindScratch)
assert.deepEqual(toLent.recurring?.recurrence, { interval: 1, unit: "month" })
assert.equal(toLent.toAccountId, undefined)

console.log("transaction-kind: OK")
