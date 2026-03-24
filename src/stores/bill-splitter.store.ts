import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type {
  BillItem,
  BillSummaryEntry,
  ItemSplit,
  Participant,
} from "~/types/bill-splitter"

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

  addParticipant: (name: string) => void
  removeParticipant: (id: string) => void
  addItem: (item: Omit<BillItem, "id">) => void
  updateItem: (id: string, item: Omit<BillItem, "id">) => void
  removeItem: (id: string) => void
  setPayerId: (id: string | null) => void
  setAccountId: (id: string | null) => void
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

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: generateId() }],
        })),

      updateItem: (id, item) =>
        set((state) => ({
          items: state.items.map((existing) =>
            existing.id === id ? { ...item, id } : existing,
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      setPayerId: (id) => set({ payerId: id }),

      setAccountId: (id) => set({ accountId: id }),

      clearBill: () =>
        set({
          participants: [],
          items: [],
          payerId: null,
          accountId: null,
        }),
    }),
    {
      name: "bill-splitter-store",
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
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/** Compute the total allocated amount across all items and participants. */
export function getAllocatedTotal(items: BillItem[]): number {
  return items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    const allocatedPercent = item.splits
      .filter((s) => s.selected)
      .reduce((acc, s) => acc + s.percentage, 0)
    return sum + itemTotal * (allocatedPercent / 100)
  }, 0)
}

/** Compute per-participant summary of owed amounts. */
export function getBillSummary(
  items: BillItem[],
  participants: Participant[],
): BillSummaryEntry[] {
  return participants.map((p) => {
    const owedAmount = items.reduce((sum, item) => {
      const split = item.splits.find((s) => s.participantId === p.id)
      if (!split?.selected) return sum
      const itemTotal = item.price * item.quantity
      return sum + itemTotal * (split.percentage / 100)
    }, 0)

    return {
      participantId: p.id,
      name: p.name,
      owedAmount: Math.round(owedAmount * 100) / 100,
    }
  })
}
