#!/usr/bin/env node
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"

const dbPath = process.argv[2]
if (!dbPath) {
  console.error("usage: node ./scripts/checks/verify-migration-0001.mts <path-to-copy.db>")
  process.exit(1)
}

const db = new DatabaseSync(dbPath)
const one = (sql: string): number =>
  (db.prepare(sql).get() as { n: number }).n

const distribution = (): string =>
  (db.prepare("SELECT kind, count(*) n FROM transactions GROUP BY kind ORDER BY kind").all() as { kind: string; n: number }[])
    .map((r) => `${r.kind}=${r.n}`)
    .join(",")

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

// Idempotency: re-applying ALL migration statements changes nothing
const migrationSql = readFileSync(join(import.meta.dirname, "../../drizzle/0001_deep_daredevil.sql"), "utf8")
const backfillStatements = migrationSql
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("ALTER TABLE"))
const distBefore = distribution()
for (const stmt of backfillStatements) db.exec(stmt)
assert.equal(distribution(), distBefore, `backfill is idempotent (${distBefore})`)

console.log("migration 0001: OK")
