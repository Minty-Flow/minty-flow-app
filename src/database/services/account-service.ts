import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
import { endOfMonth, startOfMonth } from "date-fns"
import { combineLatest } from "rxjs"
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
  createTransactionModel,
  destroyTransactionModel,
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
 * Get all accounts
 */
export const getAccounts = async (
  includeArchived = false,
): Promise<AccountModel[]> => {
  const accounts = getAccountCollection()
  if (includeArchived) {
    return await accounts.query(Q.sortBy("sort_order", Q.asc)).fetch()
  }
  return await accounts
    .query(Q.where("is_archived", false), Q.sortBy("sort_order", Q.asc))
    .fetch()
}

/**
 * Get all accounts
 */
export const observeArchivedAccounts = () =>
  getAccountCollection()
    .query(Q.where("is_archived", true), Q.sortBy("sort_order", Q.asc))
    .observe()

/**
 * Find an account by ID
 */
export const findAccount = async (id: string): Promise<AccountModel | null> => {
  try {
    return await getAccountCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe all accounts reactively
 */
export const observeAccountModels = (
  includeArchived = false,
): Observable<AccountModel[]> => {
  const accounts = getAccountCollection()
  let query = accounts.query(Q.sortBy("sort_order", Q.asc))

  if (!includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  // Observe specific columns that can change when editing
  // This makes the query reactive to column changes, not just record additions/deletions
  return query.observeWithColumns([
    "name",
    "type",
    "balance",
    "currency_code",
    "icon",
    "color_scheme_name",
    "is_archived",
    "is_primary",
    "exclude_from_balance",
    "sort_order",
  ])
}
/**
 * Observe all accounts reactively
 */
export const observeAccounts = (
  includeArchived = false,
): Observable<Account[]> => {
  const accounts = getAccountCollection()
  let query = accounts.query(Q.sortBy("sort_order", Q.asc))

  if (!includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  // Observe specific columns that can change when editing
  // This makes the query reactive to column changes, not just record additions/deletions
  return query
    .observeWithColumns([
      "name",
      "type",
      "balance",
      "currency_code",
      "icon",
      "color_scheme_name",
      "is_archived",
      "is_primary",
      "exclude_from_balance",
      "sort_order",
    ])
    .pipe(map((accounts) => accounts.map((account) => modelToAccount(account))))
}

/**
 * Observe a specific account by ID
 */
export const observeAccountById = (id: string): Observable<AccountModel> => {
  return getAccountCollection().findAndObserve(id)
}

/**
 * Observe a specific account by ID
 * Observes specific columns to ensure reactivity to field changes
 */
export const observeAccountDetailsById = (id: string): Observable<Account> => {
  return getAccountCollection()
    .query(Q.where("id", id))
    .observeWithColumns([
      "name",
      "type",
      "balance",
      "currency_code",
      "icon",
      "color_scheme_name",
      "is_archived",
      "is_primary",
      "exclude_from_balance",
      "sort_order",
    ])
    .pipe(
      filter((results) => results.length > 0),
      map((results) => {
        const model = results[0]
        return modelToAccount(model) // convert to immutable plain object here
      }),
    )
}

/**
 * Observe a single account with its current-month transaction totals (in, out, net).
 * Use for account detail screen header. Includes archived accounts.
 */
export const observeAccountWithMonthTotalsById = (
  id: string,
): Observable<AccountWithMonthTotals> => {
  const { fromDate, toDate } = getCurrentMonthRange()
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
        if (t.type === TransactionTypeEnum.INCOME) in_ += t.amount
        else if (t.type === TransactionTypeEnum.EXPENSE) out += t.amount
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

/** Current calendar month as Unix timestamps (start 00:00:00, end 23:59:59.999) */
export const getCurrentMonthRange = (): {
  fromDate: number
  toDate: number
} => {
  const now = new Date()
  return {
    fromDate: startOfMonth(now).getTime(),
    toDate: endOfMonth(now).getTime(),
  }
}

/** Month range for a given year and month (month 0–11). */
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
  includeArchived = false,
  excludeFromTotals = true,
): Observable<AccountWithMonthTotals[]> => {
  const { fromDate, toDate } = getCurrentMonthRange()
  const accounts$ = observeAccountModels(includeArchived)
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
 * Create a new account
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
      a.updatedAt = new Date()
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
  if (updates.isArchived !== undefined) a.isArchived = updates.isArchived
  if (updates.isPrimary !== undefined) a.isPrimary = updates.isPrimary
  if (updates.excludeFromBalance !== undefined)
    a.excludeFromBalance = updates.excludeFromBalance
  a.updatedAt = new Date()
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

  await createTransactionModel({
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
 * Update account.
 * Enforces system invariants: balance from transactions, exactly one primary.
 */
export const updateAccount = async (
  account: AccountModel,
  updates: Partial<UpdateAccountsFormSchema>,
): Promise<AccountModel> => {
  const oldBalance = account.balance
  const updatesWithoutBalance = {
    ...updates,
    balance: undefined,
  } as Partial<UpdateAccountsFormSchema>

  const updated = await database.write(async () => {
    if (updatesWithoutBalance.isPrimary === true) {
      await ensureSinglePrimary(account.id)
    }
    return await account.update((a) =>
      applyAccountUpdates(a, updatesWithoutBalance),
    )
  })

  const newBalance = updates.balance
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
}

/**
 * Update account by ID
 */
export const updateAccountById = async (
  id: string,
  updates: Partial<UpdateAccountsFormSchema>,
): Promise<AccountModel> => {
  const account = await findAccount(id)
  if (!account) {
    throw new Error(`Account with id ${id} not found`)
  }
  return await updateAccount(account, updates)
}

/**
 * Permanently destroy account.
 * Also permanently destroys all transactions belonging to this account.
 */
export const destroyAccount = async (account: AccountModel): Promise<void> => {
  const transactions = await getTransactionModels({
    accountId: account.id,
    includeDeleted: true,
  })
  for (const t of transactions) {
    await destroyTransactionModel(t)
  }
  await database.write(async () => {
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
