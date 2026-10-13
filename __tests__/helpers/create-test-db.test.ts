import { createTestDb } from "@tests/helpers/create-test-db"
import { describe, expect, it } from "vitest"

import { accounts } from "~/database/drizzle/schema"

describe("createTestDb", () => {
  it("applies the migrations and round-trips a row", async () => {
    const db = await createTestDb()
    const now = new Date().toISOString()

    db.insert(accounts)
      .values({
        id: "acc-1",
        name: "Checking",
        type: "checking",
        balance: 10_000,
        currencyCode: "USD",
        createdAt: now,
        updatedAt: now,
      })
      .run()

    const rows = db.select().from(accounts).all()
    expect(rows).toHaveLength(1)
    expect(rows[0].balance).toBe(10_000)
  })

  it("enforces check constraints", async () => {
    const db = await createTestDb()
    const now = new Date().toISOString()

    expect(() =>
      db
        .insert(accounts)
        .values({
          id: "acc-2",
          name: "Bad",
          type: "not-a-type",
          currencyCode: "USD",
          createdAt: now,
          updatedAt: now,
        })
        .run(),
    ).toThrow()
  })
})
