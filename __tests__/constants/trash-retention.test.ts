import { describe, expect, it } from "vitest"

import {
  DEFAULT_TRASH_RETENTION,
  getTrashRetentionDays,
  TRASH_RETENTION_CHOICES,
} from "~/constants/trash-retention"

describe("trash retention choices", () => {
  it("keeps the stored values users already have", () => {
    expect(TRASH_RETENTION_CHOICES.map((c) => c.value)).toEqual([
      "1 day",
      "7 days",
      "14 days",
      "30 days",
      "90 days",
      "180 days",
      "365 days",
      "forever",
    ])
  })

  it("gives every choice the number of days its name says", () => {
    for (const { value, days } of TRASH_RETENTION_CHOICES) {
      expect(getTrashRetentionDays(value)).toBe(days)
      if (days !== null)
        expect(value).toBe(`${days} ${days === 1 ? "day" : "days"}`)
    }
  })

  it("keeps forever as no purge", () => {
    expect(getTrashRetentionDays("forever")).toBeNull()
  })

  it("does not read a value the app never stores", () => {
    for (const value of ["30days", "7", "1 days", "7 Days", "", "someday"]) {
      expect(getTrashRetentionDays(value)).toBeNull()
    }
  })

  it("defaults to one of the choices", () => {
    expect(TRASH_RETENTION_CHOICES.map((c) => c.value as string)).toContain(
      DEFAULT_TRASH_RETENTION,
    )
    expect(getTrashRetentionDays(DEFAULT_TRASH_RETENTION)).toBe(7)
  })
})
