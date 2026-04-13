import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
import { endOfMonth, startOfMonth } from "date-fns"
import { combineLatest, of } from "rxjs"
import { filter, map } from "rxjs/operators"

import type {
  AddAccountsFormSchema,
  UpdateAccountsFormSchema,
} from "~/schemas/accounts.schema"
import type { Account } from "~/types/accounts"
import { TransactionTypeEnum } from "~/types/transactions"

import { database } from "../index"
import type AccountModel from "../models/account"
import { modelToAccount } from "../utils/model-to-account"
import {
  createTransactionWriter,
  destroyTransactionWriter,
  getTransactionModels,
  observeTransactionModels,
} from "./transaction-service"

/**
 * Account Service
 *
 * Provides functions for managing account data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the accounts collection
 */
const getAccountCollection = () => {
  return database.get<AccountModel>("accounts")
}

/**
 * Find an account by ID
 */
const findAccount = async (id: string): Promise<AccountModel | null> => {
  try {
    return await getAccountCollection().find(id)
  } catch {
    return null
  }
}

const ACCOUNT_OBSERVE_COLUMNS = [
  "name",
  "type",
  "balance",
  "currency_code",
  "icon",
  "color_scheme_name",
  "is_primary",
  "exclude_from_balance",
  "is_archived",
  "sort_order",
]

/**
 * Observe all active (non-archived) accounts reactively
 */
export const observeAccountModels = (): Observable<AccountModel[]> => {
  const accounts = getAccountCollection()
  const query = accounts.query(
    Q.where("is_archived", false),
    Q.sortBy("sort_order", Q.asc),
  )

  return query.observeWithColumns(ACCOUNT_OBSERVE_COLUMNS)
}

/**
 * Observes all active (non-archived) accounts reactively, sorted by sort order ascending.
 * Emits a new array of plain `Account` domain objects whenever any observed column changes.
 *
 * @returns An observable that emits the current list of active accounts on every relevant change.
 */
export const observeAccounts = (): Observable<Account[]> => {
  const accounts = getAccountCollection()
  const query = accounts.query(
    Q.where("is_archived", false),
    Q.sortBy("sort_order", Q.asc),
  )

  return query
    .observeWithColumns(ACCOUNT_OBSERVE_COLUMNS)
    .pipe(map((accounts) => accounts.map((account) => modelToAccount(account))))
}

/**
 * Observes all archived accounts reactively, sorted by sort order ascending.
 * Emits a new array of plain `Account` domain objects whenever any observed column changes.
 *
 * @returns An observable that emits the current list of archived accounts on every relevant change.
 */
export const observeArchivedAccounts = (): Observable<Account[]> => {
  const accounts = getAccountCollection()
  const query = accounts.query(
    Q.where("is_archived", true),
    Q.sortBy("sort_order", Q.asc),
  )

  return query
    .observeWithColumns(ACCOUNT_OBSERVE_COLUMNS)
    .pipe(map((accounts) => accounts.map((account) => modelToAccount(account))))
}

/**
 * Observes the display names of accounts matching the given IDs.
 * Returns an observable of an empty array immediately when `ids` is empty.
 *
 * @param ids - The account IDs whose names should be observed.
 * @returns An observable that emits an array of account names in DB order.
 */
export const observeAccountNamesByIds = (
  ids: string[],
): Observable<string[]> => {
  if (ids.length === 0) return of([])
  return database
    .get<AccountModel>("accounts")
    .query(Q.where("id", Q.oneOf(ids)))
    .observe()
    .pipe(map((rows) => rows.map((r) => r.name)))
}

/**
 * Observes a single account model by ID, emitting whenever the record changes.
 *
 * @param id - The account ID to observe.
 * @returns An observable that emits the raw `AccountModel` on every change.
 */
export const observeAccountById = (id: string): Observable<AccountModel> => {
  return getAccountCollection().findAndObserve(id)
}

/**
 * Observe a specific account by ID
 * Observes specific columns to ensure reactivity to field changes
 */
const observeAccountDetailsById = (id: string): Observable<Account> => {
  return getAccountCollection()
    .query(Q.where("id", id))
    .observeWithColumns(ACCOUNT_OBSERVE_COLUMNS)
    .pipe(
      filter((results) => results.length > 0),
      map((results) => {
        const model = results[0]
        return modelToAccount(model) // convert to immutable plain object here
      }),
    )
}

/** Current calendar month as Unix timestamps (start 00:00:00, end 23:59:59.999) */
const getCurrentMonthRange = (): {
  fromDate: number
  toDate: number
} => {
  const now = new Date()
  return {
    fromDate: startOfMonth(now).getTime(),
    toDate: endOfMonth(now).getTime(),
  }
}

/**
 * Computes the start and end Unix timestamps (ms) for a given calendar month.
 * `fromDate` is midnight on the first day; `toDate` is 23:59:59.999 on the last day.
 *
 * @param year - The full calendar year (e.g. 2025).
 * @param month - The zero-based month index (0 = January, 11 = December).
 * @returns An object with `fromDate` and `toDate` timestamps in milliseconds.
 */
export const getMonthRange = (
  year: number,
  month: number,
): { fromDate: number; toDate: number } => {
  const d = new Date(year, month, 1)
  return {
    fromDate: startOfMonth(d).getTime(),
    toDate: endOfMonth(d).getTime(),
  }
}

/**
 * Observe a single account with transaction totals for a given date range.
 * Use for account detail when user selects a specific month.
 * When excludeFromTotals is false, transfer amounts are included (credits → in, debits → out).
 */
export const observeAccountWithMonthTotalsByIdAndRange = (
  id: string,
  fromDate: number,
  toDate: number,
  excludeFromTotals = true,
): Observable<AccountWithMonthTotals> => {
  const account$ = observeAccountDetailsById(id)
  const transactions$ = observeTransactionModels({
    accountId: id,
    fromDate,
    toDate,
    includeDeleted: false,
  })

  return combineLatest([account$, transactions$]).pipe(
    map(([account, transactions]) => {
      let in_ = 0
      let out = 0
      for (const t of transactions) {
        if (t.type === TransactionTypeEnum.INCOME) {
          in_ += t.amount
        } else if (t.type === TransactionTypeEnum.EXPENSE) {
          out += t.amount
        } else if (
          !excludeFromTotals &&
          (t.type === TransactionTypeEnum.TRANSFER || t.isTransfer)
        ) {
          if (t.amount > 0) in_ += t.amount
          else out += Math.abs(t.amount)
        }
      }
      return {
        ...account,
        monthIn: in_,
        monthOut: out,
        monthNet: in_ - out,
        monthTransactionCount: transactions.length,
      }
    }),
  )
}

/** Account plus current-month transaction totals (in, out, net) and count */
export interface AccountWithMonthTotals extends Account {
  monthIn: number
  monthOut: number
  monthNet: number
  monthTransactionCount: number
}

/**
 * Observe accounts with their transaction totals for the current month.
 * IN = sum of income transactions, OUT = sum of expense transactions, NET = IN - OUT.
 * When excludeFromTotals is false, transfer amounts are included (credits → in, debits → out).
 */
export const observeAccountsWithMonthTotals = (
  excludeFromTotals = true,
): Observable<AccountWithMonthTotals[]> => {
  const { fromDate, toDate } = getCurrentMonthRange()
  const accounts$ = observeAccountModels()
  const transactions$ = observeTransactionModels({
    fromDate,
    toDate,
    includeDeleted: false,
  })

  return combineLatest([accounts$, transactions$]).pipe(
    map(([accounts, transactions]) => {
      const totalsByAccount = new Map<
        string,
        { in: number; out: number; net: number; count: number }
      >()
      for (const t of transactions) {
        const cur = totalsByAccount.get(t.accountId) ?? {
          in: 0,
          out: 0,
          net: 0,
          count: 0,
        }
        cur.count += 1
        if (t.type === TransactionTypeEnum.INCOME) {
          cur.in += t.amount
        } else if (t.type === TransactionTypeEnum.EXPENSE) {
          cur.out += t.amount
        } else if (
          !excludeFromTotals &&
          (t.type === TransactionTypeEnum.TRANSFER || t.isTransfer)
        ) {
          if (t.amount > 0) cur.in += t.amount
          else cur.out += Math.abs(t.amount)
        }
        cur.net = cur.in - cur.out
        totalsByAccount.set(t.accountId, cur)
      }
      return accounts.map((model): AccountWithMonthTotals => {
        const account = modelToAccount(model)
        const totals = totalsByAccount.get(model.id) ?? {
          in: 0,
          out: 0,
          net: 0,
          count: 0,
        }
        return {
          ...account,
          monthIn: totals.in,
          monthOut: totals.out,
          monthNet: totals.net,
          monthTransactionCount: totals.count,
        }
      })
    }),
  )
}

/**
 * Creates a new account row in the database.
 * Automatically appends the account at the end of the sort order by reading the
 * current highest `sort_order` value and incrementing it.
 *
 * @param data - Validated form data for the new account.
 * @returns The newly created `AccountModel` instance.
 */
export const createAccount = async (
  data: AddAccountsFormSchema,
): Promise<AccountModel> => {
  // Get the last account's sort order to append the new one at the end
  const lastAccount = await getAccountCollection()
    .query(Q.sortBy("sort_order", Q.desc), Q.take(1))
    .fetch()
  const nextSortOrder =
    lastAccount.length > 0 ? (lastAccount[0].sortOrder || 0) + 1 : 0

  return await database.write(async () => {
    return await getAccountCollection().create((account) => {
      account.name = data.name
      account.type = data.type
      account.balance = data.balance
      account.currencyCode = data.currencyCode
      account.icon = data.icon ?? null
      account.colorSchemeName = data.colorSchemeName ?? null
      account.isPrimary = data.isPrimary
      account.sortOrder = nextSortOrder
      account.excludeFromBalance = data.excludeFromBalance
      account.isArchived = false
    })
  })
}

/**
 * Enforce "exactly one primary account" invariant.
 * Unsets isPrimary on all accounts except the one with the given id.
 * Must be called from within a database.write.
 */
const ensureSinglePrimary = async (primaryAccountId: string): Promise<void> => {
  const primaryAccounts = await getAccountCollection()
    .query(Q.where("is_primary", true))
    .fetch()
  const others = primaryAccounts.filter((a) => a.id !== primaryAccountId)
  for (const other of others) {
    await other.update((a) => {
      a.isPrimary = false
    })
  }
}

/**
 * Apply non-balance field updates to an account record.
 * Mutates the record in place; call from within model.update().
 */
const applyAccountUpdates = (
  a: AccountModel,
  updates: Partial<UpdateAccountsFormSchema>,
): void => {
  if (updates.name !== undefined) a.name = updates.name
  if (updates.type !== undefined) a.type = updates.type
  if (updates.currencyCode !== undefined) a.currencyCode = updates.currencyCode
  if (updates.icon !== undefined) a.icon = updates.icon ?? null
  if (updates.colorSchemeName !== undefined)
    a.colorSchemeName = updates.colorSchemeName ?? null
  if (updates.isPrimary !== undefined) a.isPrimary = updates.isPrimary
  if (updates.excludeFromBalance !== undefined)
    a.excludeFromBalance = updates.excludeFromBalance
}

/**
 * Reconcile account balance via an adjustment transaction.
 * Balance is always derived from transactions; this creates the compensating tx.
 */
const applyBalanceAdjustment = async (
  account: AccountModel,
  oldBalance: number,
  newBalance: number,
): Promise<AccountModel | null> => {
  const delta = newBalance - oldBalance
  const amount = Math.abs(delta)
  if (amount <= 0) return null

  await createTransactionWriter({
    amount,
    type: delta > 0 ? TransactionTypeEnum.INCOME : TransactionTypeEnum.EXPENSE,
    transactionDate: new Date(),
    accountId: account.id,
    categoryId: null,
    title: "Balance adjustment",
    description: "",
    isPending: false,
    tags: [],
  })
  return findAccount(account.id)
}

/**
 * Updates account fields and enforces system invariants in a single atomic write.
 * If `updates.balance` differs from the current balance, a compensating
 * income or expense "Balance adjustment" transaction is created in the same write.
 * If `updates.isPrimary` is `true`, all other accounts have `isPrimary` unset.
 *
 * @param account - The existing account model to update.
 * @param updates - Partial set of fields to change; `balance` triggers an adjustment transaction.
 * @returns The refreshed `AccountModel` after all writes complete.
 */
export const updateAccount = async (
  account: AccountModel,
  updates: Partial<UpdateAccountsFormSchema>,
): Promise<AccountModel> => {
  const oldBalance = account.balance
  const newBalance = updates.balance
  const updatesWithoutBalance = {
    ...updates,
    balance: undefined,
  } as Partial<UpdateAccountsFormSchema>

  // Single write keeps field updates and the balance-adjustment transaction atomic.
  // applyBalanceAdjustment calls createTransactionWriter (a writer body) directly,
  // so it runs inside this outer write context without queuing a nested write.
  return await database.write(async () => {
    if (updatesWithoutBalance.isPrimary === true) {
      await ensureSinglePrimary(account.id)
    }
    const updated = await account.update((a) =>
      applyAccountUpdates(a, updatesWithoutBalance),
    )

    if (
      newBalance !== undefined &&
      typeof newBalance === "number" &&
      newBalance !== oldBalance
    ) {
      const refreshed = await applyBalanceAdjustment(
        account,
        oldBalance,
        newBalance,
      )
      return refreshed ?? updated
    }

    return updated
  })
}

/**
 * Archives an account, hiding it from all active account lists.
 * Sets `isArchived` to `true`; the account remains in the database and its
 * transactions are preserved.
 *
 * @param account - The account model to archive.
 */
export const archiveAccount = async (account: AccountModel): Promise<void> => {
  await database.write(async () => {
    await account.update((a) => {
      a.isArchived = true
    })
  })
}

/**
 * Restores an archived account, making it visible in active account lists again.
 * Sets `isArchived` to `false`.
 *
 * @param account - The account model to unarchive.
 */
export const unarchiveAccount = async (
  account: AccountModel,
): Promise<void> => {
  await database.write(async () => {
    await account.update((a) => {
      a.isArchived = false
    })
  })
}

/**
 * Permanently destroys an account and all of its transactions in a single atomic write.
 * This operation is irreversible — both the account row and every transaction
 * linked to it (including soft-deleted ones) are removed from the database.
 *
 * @param account - The account model to permanently delete.
 */
export const destroyAccount = async (account: AccountModel): Promise<void> => {
  await database.write(async () => {
    const transactions = await getTransactionModels({
      accountId: account.id,
      includeDeleted: true,
    })
    for (const t of transactions) {
      await destroyTransactionWriter(t)
    }
    await account.destroyPermanently()
  })
}

/**
 * Update the order of accounts
 */
export const updateAccountsOrder = async (
  accounts: AccountModel[],
): Promise<void> => {
  await database.write(async () => {
    const updates = accounts.map((account, index) =>
      account.prepareUpdate((a) => {
        a.sortOrder = index
      }),
    )
    await database.batch(...updates)
  })
}
