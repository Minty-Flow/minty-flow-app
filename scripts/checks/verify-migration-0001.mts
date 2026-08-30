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

// Pending recurring instances are 'repetitive', never 'upcoming'
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
