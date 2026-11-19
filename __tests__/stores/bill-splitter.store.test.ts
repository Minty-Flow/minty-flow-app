import { describe, expect, it, vi } from "vitest"

vi.mock("~/utils/mmkv-storage", () => ({
  mmkvJSONStorage: () => ({
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }),
}))
vi.mock("react-native-mmkv", () => ({ createMMKV: () => ({}) }))

import {
  getBillSummary,
  getBillTotal,
  getDefaultSplits,
  getSettlementPlan,
  useBillSplitterStore,
} from "~/stores/bill-splitter.store"

const migrate = (state: unknown, version: number) => {
  const run = useBillSplitterStore.persist.getOptions().migrate
  if (!run) throw new Error("no migrate")
  return run(state, version) as { items: { price: number }[] }
}
const draft = (currencyCode: string) => ({
  participants: [],
  payerId: null,
  accountId: null,
  currencyCode,
  items: [{ id: "1", name: "x", price: 150_000_050_000_000, quantity: 1 }],
})

describe("bill splitter draft upgrade (v3 → v4)", () => {
  it("rescales a PEPE/SHIB draft to 2 digits", () => {
    expect(migrate(draft("SHIB"), 3).items[0].price).toBe(150_000_050)
  })

  it("keeps any other draft as it was", () => {
    expect(migrate(draft("BTC"), 3)).toEqual({ ...draft("BTC"), selfId: null })
  })
})

describe("bill splitter draft upgrade (v4 → v5)", () => {
  it("keeps the draft and treats the payer as the user", () => {
    const upgraded = migrate(
      { ...draft("USD"), payerId: "a" },
      4,
    ) as unknown as {
      selfId: string | null
      items: unknown[]
    }
    expect(upgraded.selfId).toBe("a")
    expect(upgraded.items).toHaveLength(1)
  })
})

describe("getSettlementPlan", () => {
  const people = [
    { id: "me", name: "Me" },
    { id: "b", name: "Bea" },
    { id: "c", name: "Cy" },
  ]
  // 1001 split three ways: allocations carry the odd minor units.
  const items = [
    {
      id: "1",
      name: "dinner",
      price: 1001,
      quantity: 1,
      splitEvenly: true,
      splits: people.map((p) => ({
        participantId: p.id,
        selected: true,
        percentage: 100 / 3,
      })),
    },
  ]
  const summary = getBillSummary(items, people)

  it("user paid: lent loans plus own share add up to the bill", () => {
    const plan = getSettlementPlan(summary, "me", "me")
    expect(plan.map((a) => a.kind).sort()).toEqual(["lent", "lent", "share"])
    expect(plan.reduce((sum, a) => sum + a.amount, 0)).toBe(getBillTotal(items))
  })

  it("someone else paid: the user's share as an expense plus a borrowed loan to the payer", () => {
    const plan = getSettlementPlan(summary, "me", "b")
    const mine = summary.find((s) => s.participantId === "me")?.owedAmount
    expect(plan).toEqual([
      { kind: "share", participantId: "me", amount: mine },
      { kind: "borrowed", participantId: "b", amount: mine, payerName: "Bea" },
    ])
  })

  it("does nothing until both people are chosen", () => {
    expect(getSettlementPlan(summary, null, "me")).toEqual([])
    expect(getSettlementPlan(summary, "me", null)).toEqual([])
  })
})

describe("getDefaultSplits", () => {
  const people = [
    { id: "a", name: "A" },
    { id: "b", name: "B" },
    { id: "c", name: "C" },
  ]
  const selectedIds = (
    splits: { participantId: string; selected: boolean }[],
  ) => splits.filter((s) => s.selected).map((s) => s.participantId)

  it("selects everyone for the first item", () => {
    expect(selectedIds(getDefaultSplits(people, undefined))).toEqual([
      "a",
      "b",
      "c",
    ])
  })

  it("copies the previous item's group and leaves newcomers out", () => {
    const previous = {
      id: "1",
      name: "x",
      price: 100,
      quantity: 1,
      splitEvenly: true,
      splits: [
        { participantId: "a", selected: true, percentage: 100 },
        { participantId: "b", selected: false, percentage: 0 },
      ],
    }
    expect(selectedIds(getDefaultSplits(people, previous))).toEqual(["a"])
  })
})
