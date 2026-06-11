import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { on } from "~/database/events"
import { mapAccount } from "~/database/mappers/account.mapper"
import { getAllAccounts } from "~/database/repos/account-repo"
import type { Account } from "~/types/accounts"

interface AccountStoreState {
  byId: Record<string, Account>
  ids: string[]
  status: "idle" | "loading" | "ready"
  refreshAll: () => Promise<void>
}

let gen_2 = 0

export const useAccountStore = create<AccountStoreState>()(
  subscribeWithSelector((set) => ({
    byId: {},
    ids: [],
    status: "idle",

    refreshAll: async () => {
      const gen = ++gen_2
      set({ status: "loading" })

      const rows = await getAllAccounts()
      const byId: Record<string, Account> = {}
      const ids: string[] = []

      for (const row of rows) {
        const account = mapAccount(row)
        byId[account.id] = account
        ids.push(account.id)
      }

      if (gen_2 !== gen) return
      set({ byId, ids, status: "ready" })
    },
  })),
)

on("accounts:dirty", () => {
  useAccountStore.getState().refreshAll()
})

on("db:reset", () => {
  useAccountStore.getState().refreshAll()
})

export function useAccounts(): Account[] {
  return useAccountStore(useShallow((s) => s.ids.map((id) => s.byId[id])))
}

export function useActiveAccounts(): Account[] {
  return useAccountStore(
    useShallow((s) =>
      s.ids.map((id) => s.byId[id]).filter((a) => !a?.isArchived),
    ),
  )
}

export function useArchivedAccounts(): Account[] {
  return useAccountStore(
    useShallow((s) =>
      s.ids.map((id) => s.byId[id]).filter((a) => a?.isArchived),
    ),
  )
}

export function useAccount(id: string): Account | undefined {
  return useAccountStore((s) => s.byId[id])
}
