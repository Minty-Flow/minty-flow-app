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
