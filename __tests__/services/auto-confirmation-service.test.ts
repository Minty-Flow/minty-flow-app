import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const getPendingTransactions = vi.fn()
const confirmTransaction = vi.fn()

vi.mock("~/database/drizzle/read-models/transaction-read-model", () => ({
  getPendingTransactions: () => getPendingTransactions(),
}))
vi.mock("~/database/services/ledger-service", () => ({
  confirmTransaction: (id: string) => confirmTransaction(id),
}))

import { emitWriteCommitted } from "~/database/commit-events"
import { autoConfirmationService } from "~/services/auto-confirmation-service"

const pendingRow = (dueInMs: number) => ({
  id: "p1",
  isPending: true,
  isDeleted: false,
  requiresManualConfirmation: false,
  kind: "upcoming",
  transactionDate: new Date(Date.now() + dueInMs),
})

beforeEach(() => {
  vi.useFakeTimers()
  getPendingTransactions.mockReset().mockResolvedValue([])
  confirmTransaction.mockReset().mockResolvedValue(undefined)
  autoConfirmationService.configure({
    autoPaySubscriptions: true,
    autoPayRepetitive: true,
    autoPayUpcoming: true,
    updateDateUponConfirmation: false,
  })
  autoConfirmationService.start()
})

afterEach(() => {
  autoConfirmationService.stop()
  vi.useRealTimers()
})

describe("sweep on committed writes", () => {
  it("schedules a newly saved pending row straight away", async () => {
    getPendingTransactions.mockResolvedValue([pendingRow(5_000)])

    emitWriteCommitted("transaction.create")
    emitWriteCommitted("transaction.create")
    await vi.advanceTimersByTimeAsync(100)
    expect(getPendingTransactions).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(5_000)
    expect(confirmTransaction).toHaveBeenCalledWith("p1")
  })

  it("ignores writes that cannot change a pending row", async () => {
    emitWriteCommitted("category.update")
    await vi.advanceTimersByTimeAsync(1_000)
    expect(getPendingTransactions).not.toHaveBeenCalled()
  })

  it("runs again for a write that lands during a sweep", async () => {
    let finish: (rows: unknown[]) => void = () => {}
    getPendingTransactions.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve
      }),
    )
    const running = autoConfirmationService.sweep()

    emitWriteCommitted("transaction.create")
    await vi.advanceTimersByTimeAsync(100)
    expect(getPendingTransactions).toHaveBeenCalledTimes(1)

    finish([])
    await running
    expect(getPendingTransactions).toHaveBeenCalledTimes(2)
  })

  it("stops listening when stopped", async () => {
    autoConfirmationService.stop()
    emitWriteCommitted("transaction.create")
    await vi.advanceTimersByTimeAsync(1_000)
    expect(getPendingTransactions).not.toHaveBeenCalled()
  })
})
