import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { TimestampScheduler } from "~/utils/timestamp-scheduler"

describe("TimestampScheduler", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("fires at the exact timestamp, not the start of its minute", () => {
    const scheduler = new TimestampScheduler()
    const now = new Date(2026, 0, 1, 10, 30, 0).getTime()
    vi.setSystemTime(now)
    const due = now + 30_500

    const callback = vi.fn()
    scheduler.subscribe(due, callback)

    vi.advanceTimersByTime(30_000)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("notifies a subscriber that joins inside the due minute", () => {
    const scheduler = new TimestampScheduler()
    const now = new Date(2026, 0, 1, 10, 30, 20).getTime()
    vi.setSystemTime(now)
    const due = new Date(2026, 0, 1, 10, 30, 0).getTime()

    const callback = vi.fn()
    scheduler.subscribe(due, callback)

    // Registered first, then notified on the next tick.
    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("re-checks when a timer fires early", () => {
    const scheduler = new TimestampScheduler()
    const now = new Date(2026, 0, 1, 10, 30, 0).getTime()
    vi.setSystemTime(now)
    const due = now + 1_000

    const callback = vi.fn()
    scheduler.subscribe(due, callback)

    // Simulate a platform timer firing before the wall clock reaches `due`.
    vi.advanceTimersByTime(999)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("stops notifying after unsubscribe", () => {
    const scheduler = new TimestampScheduler()
    const now = new Date(2026, 0, 1, 10, 30, 0).getTime()
    vi.setSystemTime(now)

    const callback = vi.fn()
    const unsubscribe = scheduler.subscribe(now + 1_000, callback)
    unsubscribe()

    vi.advanceTimersByTime(1_000)
    expect(callback).not.toHaveBeenCalled()
  })
})
