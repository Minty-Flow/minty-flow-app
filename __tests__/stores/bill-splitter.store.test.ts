import { describe, expect, it, vi } from "vitest"

vi.mock("~/utils/mmkv-storage", () => ({
  mmkvJSONStorage: () => ({
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }),
}))
vi.mock("react-native-mmkv", () => ({ createMMKV: () => ({}) }))

import { useBillSplitterStore } from "~/stores/bill-splitter.store"

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
    expect(migrate(draft("BTC"), 3)).toEqual(draft("BTC"))
  })
})
