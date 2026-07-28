import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type {
  BillItem,
  BillSummaryEntry,
  ItemSplit,
  Participant,
} from "~/types/bill-splitter"
import {
  assertMinorUnits,
  rescaleMinorUnits,
  roundToSafeInteger,
} from "~/utils/money"

/**
 * MMKV storage instance for bill splitter data.
 *
 * This instance stores the bill splitter state including participants, items,
 * and payer information. MMKV is ~30x faster than AsyncStorage and provides
 * synchronous operations for fast persistence.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
const billSplitterStorage = createMMKV({
  id: "bill-splitter-storage",
})

interface BillSplitterState {
  participants: Participant[]
  items: BillItem[]
  payerId: string | null
  accountId: string | null
  currencyCode: string | null

  addParticipant: (name: string) => void
  removeParticipant: (id: string) => void
  addItem: (item: Omit<BillItem, "id">) => void
  updateItem: (id: string, item: Omit<BillItem, "id">) => void
  removeItem: (id: string) => void
  setPayerId: (id: string | null) => void
  setAccountId: (id: string | null) => void
  setCurrencyCode: (currencyCode: string) => void
  clearBill: () => void
}

/**
 * we can use crypto cuz this is a native app and crypto exist only in the web
 */
const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36)

export const useBillSplitterStore = create<BillSplitterState>()(
  persist(
    (set) => ({
      participants: [],
      items: [],
      payerId: null,
      accountId: null,
      currencyCode: null,

      addParticipant: (name) =>
        set((state) => ({
          participants: [...state.participants, { id: generateId(), name }],
        })),

      removeParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
          items: state.items.map((item) => {
            const newSplits = item.splits.filter((s) => s.participantId !== id)
            if (item.splitEvenly) {
              return {
                ...item,
                splits: redistributeEvenly(newSplits),
              }
            }
            return { ...item, splits: newSplits }
          }),
          payerId: state.payerId === id ? null : state.payerId,
        })),

      addItem: (item) => {
        assertMinorUnits(item.price)
        if (item.price < 0)
          throw new Error("Bill item price cannot be negative")
        set((state) => ({
          items: [...state.items, { ...item, id: generateId() }],
        }))
      },

      updateItem: (id, item) => {
        assertMinorUnits(item.price)
        if (item.price < 0)
          throw new Error("Bill item price cannot be negative")
        set((state) => ({
          items: state.items.map((existing) =>
            existing.id === id ? { ...item, id } : existing,
          ),
        }))
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      setPayerId: (id) => set({ payerId: id }),

      setAccountId: (id) => set({ accountId: id }),
      setCurrencyCode: (currencyCode) =>
        set((state) => ({
          currencyCode,
          items:
            state.currencyCode && state.currencyCode !== currencyCode
              ? state.items.map((item) => ({
                  ...item,
                  price: rescaleMinorUnits(
                    item.price,
                    state.currencyCode as string,
                    currencyCode,
                  ),
                }))
              : state.items,
        })),

      clearBill: () =>
        set({
          participants: [],
          items: [],
          payerId: null,
          accountId: null,
          currencyCode: null,
        }),
    }),
    {
      name: "bill-splitter-store",
      version: 3,
      migrate: () => ({
        participants: [],
        items: [],
        payerId: null,
        accountId: null,
        currencyCode: null,
      }),
      storage: createJSONStorage(() => ({
        getItem: (name) => billSplitterStorage.getString(name) ?? null,
        setItem: (name, value) => billSplitterStorage.set(name, value),
        removeItem: (name) => billSplitterStorage.remove(name),
      })),
    },
  ),
)

function redistributeEvenly(splits: ItemSplit[]): ItemSplit[] {
  const selected = splits.filter((s) => s.selected)
  const evenPercentage = selected.length > 0 ? 100 / selected.length : 0
  return splits.map((s) => ({
    ...s,
    percentage: s.selected ? evenPercentage : 0,
  }))
}

/** Compute the total bill amount (sum of price * quantity for all items). */
export function getBillTotal(items: BillItem[]): number {
  return items.reduce(
    (sum, item) => sum + roundToSafeInteger(item.price * item.quantity),
    0,
  )
}

/** Compute the total allocated amount across all items and participants. */
export function getAllocatedTotal(items: BillItem[]): number {
  return items.reduce((sum, item) => {
    return (
      sum +
      [...getItemAllocations(item).values()].reduce(
        (allocated, value) => allocated + value,
        0,
      )
    )
  }, 0)
}

/** Compute per-participant summary of owed amounts. */
export function getBillSummary(
  items: BillItem[],
  participants: Participant[],
): BillSummaryEntry[] {
  return participants.map((p) => {
    const owedAmount = items.reduce(
      (sum, item) => sum + (getItemAllocations(item).get(p.id) ?? 0),
      0,
    )

    return {
      participantId: p.id,
      name: p.name,
      owedAmount,
    }
  })
}

export function getItemAllocations(item: BillItem): Map<string, number> {
  const selected = item.splits.filter(
    (split) => split.selected && split.percentage > 0,
  )
  if (selected.length === 0) return new Map()

  const total = roundToSafeInteger(item.price * item.quantity)
  const weight = selected.reduce((sum, split) => sum + split.percentage, 0)
  const allocations = selected.map((split) => {
    const exact = (total * split.percentage) / 100
    const floor = Math.floor(exact)
    return { id: split.participantId, amount: floor, remainder: exact - floor }
  })

  let remainder =
    roundToSafeInteger((total * weight) / 100) -
    allocations.reduce((sum, row) => sum + row.amount, 0)
  allocations.sort(
    (a, b) => b.remainder - a.remainder || a.id.localeCompare(b.id),
  )
  for (const row of allocations) {
    if (remainder-- <= 0) break
    row.amount++
  }
  return new Map(allocations.map((row) => [row.id, row.amount]))
}
