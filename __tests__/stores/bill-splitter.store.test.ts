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
  getBillTotal,
  getDefaultSplits,
  getSettlementPlan,
  type SettlementAction,
  useBillSplitterStore,
} from "~/stores/bill-splitter.store"
import type { BillItem } from "~/types/bill-splitter"

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
  const item = (
    id: string,
    price: number,
    sharedBy: string[],
    payerId?: string,
  ): BillItem => ({
    id,
    name: id,
    price,
    quantity: 1,
    splitEvenly: true,
    payerId,
    splits: sharedBy.map((participantId) => ({
      participantId,
      selected: true,
      percentage: 100 / sharedBy.length,
    })),
  })
  const byKind = (plan: SettlementAction[]) =>
    Object.fromEntries(
      plan.map((a) => [`${a.kind}:${a.participantId}`, a.amount]),
    )
  // share + lent - borrowed must equal what the user paid.
  const accountChange = (plan: SettlementAction[]) =>
    plan.reduce(
      (sum, a) => sum + (a.kind === "borrowed" ? -a.amount : a.amount),
      0,
    )
  const paidBy = (items: BillItem[], who: string, fallback: string) =>
    items
      .filter((i) => (i.payerId ?? fallback) === who)
      .reduce((sum, i) => sum + i.price, 0)

  it("user paid everything: lent loans plus own share add up to the bill", () => {
    // 1001 split three ways: allocations carry the odd minor unit.
    const items = [item("dinner", 1001, ["me", "b", "c"])]
    const plan = getSettlementPlan(items, people, "me", "me")
    expect(plan.map((a) => a.kind).sort()).toEqual(["lent", "lent", "share"])
    expect(accountChange(plan)).toBe(getBillTotal(items))
  })

  it("someone else paid everything: own share plus a borrowed loan to them", () => {
    const items = [item("dinner", 900, ["me", "b", "c"])]
    expect(byKind(getSettlementPlan(items, people, "me", "b"))).toEqual({
      "share:me": 300,
      "borrowed:b": 300,
    })
  })

  it("nets each person across items paid by different people", () => {
    const items = [
      item("hotel", 900, ["me", "b", "c"], "b"), // me owes Bea 300
      item("taxi", 600, ["me", "b", "c"], "me"), // Bea and Cy owe me 200 each
      item("lunch", 400, ["me", "c"], "c"), // me owes Cy 200
    ]
    const plan = getSettlementPlan(items, people, "me", "me")
    expect(byKind(plan)).toEqual({
      "share:me": 700,
      "borrowed:b": 100,
    })
    expect(accountChange(plan)).toBe(paidBy(items, "me", "me"))
  })

  it("records nothing for a person whose amounts cancel out", () => {
    const items = [
      item("coffee", 400, ["me", "b"], "me"), // Bea owes me 200
      item("snacks", 400, ["me", "b"], "b"), // me owes Bea 200
    ]
    expect(byKind(getSettlementPlan(items, people, "me", "me"))).toEqual({
      "share:me": 400,
    })
  })

  it("leaves out debts between other participants", () => {
    const items = [item("drinks", 600, ["b", "c"], "b")]
    expect(getSettlementPlan(items, people, "me", "me")).toEqual([])
  })

  it("waits for the user and a payer for every item", () => {
    const items = [item("dinner", 900, ["me", "b"])]
    expect(getSettlementPlan(items, people, null, "me")).toEqual([])
    expect(getSettlementPlan(items, people, "me", null)).toEqual([])
    expect(
      getSettlementPlan([item("x", 900, ["me"], "me")], people, "me", null),
    ).toHaveLength(1)
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

describe("recorded participants", () => {
  it("records once, forgets removed people, and resets with the bill", () => {
    const store = useBillSplitterStore
    store.getState().clearBill({ everything: true })
    store.getState().addParticipant("A")
    const [a] = store.getState().participants
    store.getState().markRecorded(a.id)
    store.getState().markRecorded(a.id)
    expect(store.getState().recordedIds).toEqual([a.id])
    store.getState().removeParticipant(a.id)
    expect(store.getState().recordedIds).toEqual([])
    store.getState().addParticipant("B")
    store.getState().markRecorded(store.getState().participants[0].id)
    store.getState().clearBill()
    expect(store.getState().recordedIds).toEqual([])
  })
})

describe("clearBill", () => {
  const seed = () => {
    const store = useBillSplitterStore
    store.getState().clearBill({ everything: true })
    store.getState().addParticipant("Me")
    store.getState().addParticipant("Bea")
    const [me, bea] = store.getState().participants
    store.getState().setSelfId(me.id)
    store.getState().setPayerId(bea.id)
    store.getState().setAccountId("acc")
    store.getState().addItem({
      name: "x",
      price: 100,
      quantity: 1,
      splitEvenly: true,
      splits: [],
    })
    store.getState().markRecorded(me.id)
    return { store, me }
  }

  it("keeps the people by default and resets the payer to the user", () => {
    const { store, me } = seed()
    store.getState().clearBill()
    const s = store.getState()
    expect(s.items).toEqual([])
    expect(s.recordedIds).toEqual([])
    expect(s.participants).toHaveLength(2)
    expect(s.selfId).toBe(me.id)
    expect(s.payerId).toBe(me.id)
    expect(s.accountId).toBe("acc")
  })

  it("wipes everything when asked", () => {
    const { store } = seed()
    store.getState().clearBill({ everything: true })
    const s = store.getState()
    expect(s.participants).toEqual([])
    expect(s.selfId).toBeNull()
    expect(s.accountId).toBeNull()
  })
})

describe("removing an item's payer", () => {
  it("makes the item fall back to the bill payer", () => {
    const store = useBillSplitterStore
    store.getState().clearBill({ everything: true })
    store.getState().addParticipant("Bea")
    const [bea] = store.getState().participants
    store.getState().addItem({
      name: "hotel",
      price: 900,
      quantity: 1,
      splitEvenly: true,
      splits: [],
      payerId: bea.id,
    })
    store.getState().removeParticipant(bea.id)
    expect(store.getState().items[0].payerId).toBeUndefined()
  })
})
