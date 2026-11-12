import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { useState } from "react"

import { toAccount } from "~/database/mappers/account.mapper"
import type { Account } from "~/types/accounts"
import { logger } from "~/utils/logger"

import { drizzleDb } from "../db"
import { accounts } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

const accountsQuery = () =>
  drizzleDb
    .select()
    .from(accounts)
    .orderBy(accounts.sortOrder, accounts.createdAt)

/**
 * The live query only loads after mount, so its first render is empty. A
 * synchronous read of the (small) accounts table fills that render; the live
 * query takes over once it reports. null when the read fails: then the hook
 * reports "loading" until the live query arrives, as before.
 */
function readAccountsNow() {
  try {
    return { rows: accountsQuery().all(), at: new Date() }
  } catch (error) {
    logger.warn("Sync accounts read failed; waiting for the live query", {
      error,
    })
    return null
  }
}

export function useAccountsQuery(): LiveReadModelResult<Account[]> {
  const [seed] = useState(readAccountsNow)
  const result = useLiveQuery(accountsQuery())
  const live = result.updatedAt !== undefined
  const rows = live || !seed ? result.data : seed.rows

  return createLiveReadModelResult(rows.map(toAccount), [
    { error: result.error, updatedAt: live ? result.updatedAt : seed?.at },
  ])
}

export function useAccounts(): Account[] {
  return useAccountsQuery().data
}

export function useActiveAccounts(): Account[] {
  return useAccounts().filter((account) => !account.isArchived)
}

/**
 * Active accounts plus any archived account the edited row still points at.
 * A form needs the row's own account even when archived: without it the
 * currency falls back to the default and the amount is off by 10^n.
 */
export function useActiveAccountsWith(
  ...ids: (string | null | undefined)[]
): Account[] {
  return useActiveAccountsWithQuery(...ids).data
}

/** `useActiveAccountsWith` plus the load status, for a form that must wait. */
export function useActiveAccountsWithQuery(
  ...ids: (string | null | undefined)[]
): LiveReadModelResult<Account[]> {
  const result = useAccountsQuery()
  return {
    ...result,
    data: result.data.filter(
      (account) => !account.isArchived || ids.includes(account.id),
    ),
  }
}

export function useActiveAccountsQuery(): LiveReadModelResult<Account[]> {
  const result = useAccountsQuery()
  return {
    ...result,
    data: result.data.filter((account) => !account.isArchived),
  }
}

export function useAccount(id: string): Account | undefined {
  return useAccounts().find((account) => account.id === id)
}
