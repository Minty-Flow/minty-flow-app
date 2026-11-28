import { describe, expect, it, vi } from "vitest"

import { createChangeBatcher } from "~/database/utils/change-batcher"

function setup(isBlocked: () => boolean = () => false) {
  const queue: Array<() => void> = []
  const batcher = createChangeBatcher({
    schedule: (flush) => {
      queue.push(flush)
    },
    isBlocked,
  })
  const runNext = () => queue.shift()?.()
  return { batcher, queue, runNext }
}

describe("createChangeBatcher", () => {
  it("runs each affected watcher once for a burst", () => {
    const { batcher, queue, runNext } = setup()
    const rows = vi.fn()
    const both = vi.fn()
    const other = vi.fn()
    batcher.watch(["transactions"], rows)
    batcher.watch(["transfers", "transactions"], both)
    batcher.watch(["tags"], other)

    for (let i = 0; i < 100; i++) {
      batcher.notify("transactions")
      batcher.notify("transfers")
    }
    expect(queue).toHaveLength(1)
    runNext()

    expect(rows).toHaveBeenCalledTimes(1)
    expect(both).toHaveBeenCalledTimes(1)
    expect(other).not.toHaveBeenCalled()
  })

  it("flushes again for a change that lands during a flush", () => {
    const { batcher, queue, runNext } = setup()
    const accounts = vi.fn()
    batcher.watch(["accounts"], accounts)
    batcher.watch(["transactions"], () => batcher.notify("accounts"))

    batcher.notify("transactions")
    runNext()
    expect(queue).toHaveLength(1)
    runNext()

    expect(accounts).toHaveBeenCalledTimes(1)
  })

  it("waits while a transaction is open", () => {
    let open = true
    const { batcher, queue, runNext } = setup(() => open)
    const watcher = vi.fn()
    batcher.watch(["transactions"], watcher)

    batcher.notify("transactions")
    runNext()
    batcher.notify("transactions")
    expect(watcher).not.toHaveBeenCalled()
    expect(queue).toHaveLength(1)

    open = false
    runNext()
    expect(watcher).toHaveBeenCalledTimes(1)
    expect(queue).toHaveLength(0)
  })

  it("stops running a watcher that unsubscribed", () => {
    const { batcher, runNext } = setup()
    const watcher = vi.fn()
    const stop = batcher.watch(["transactions"], watcher)
    batcher.notify("transactions")
    stop()
    runNext()
    expect(watcher).not.toHaveBeenCalled()
  })
})
