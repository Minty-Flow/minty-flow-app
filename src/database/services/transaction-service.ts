import { Q } from "@nozbe/watermelondb"
import { startOfDay, subDays } from "date-fns"
import type { Observable } from "rxjs"
import { combineLatest, from, map, of, startWith, switchMap } from "rxjs"

import type { TransactionFormValues } from "~/schemas/transactions.schema"
import {
  type TransactionListFilters,
  type TransactionType,
  TransactionTypeEnum,
} from "~/types/transactions"
import { logger } from "~/utils/logger"
import { startOfNextMinute } from "~/utils/pending-transactions"

import { database } from "../index"
import type AccountModel from "../models/account"
import type CategoryModel from "../models/category"
import type TagModel from "../models/tag"
import type TransactionModel from "../models/transaction"
import type TransactionTagModel from "../models/transaction-tag"
import {
  deleteTransfer,
  getConversionRateForTransaction,
  getPairedTransaction,
} from "./transfer-service"

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

interface CountableModel {
  transactionCount: number
}

function incrementCount(model: CountableModel) {
  model.transactionCount += 1
}

function decrementCount(model: CountableModel) {
  model.transactionCount = Math.max(0, model.transactionCount - 1)
}

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface TransactionWithRelations {
  transaction: TransactionModel
  account: AccountModel
  category: CategoryModel | null
  tags: TagModel[]
  /** Set for transfer rows: the other account in the transfer (from related_account_id). */
  relatedAccount?: AccountModel | null
  /** Set for cross-currency transfer rows: rate = to-currency per 1 from-currency (for showing other account amount). */
  conversionRate?: number | null
}

/* ------------------------------------------------------------------ */
/* Base collections */
/* ------------------------------------------------------------------ */

const transactionsCollection = () => {
  try {
    return database.get<TransactionModel>("transactions")
  } catch (e) {
    logger.error("Failed to access transactions collection", {
      error: String(e),
    })
    throw e
  }
}

const accountsCollection = () => database.get<AccountModel>("accounts")

const transactionTagsCollection = () =>
  database.get<TransactionTagModel>("transaction_tags")

const tagsCollection = () => database.get<TagModel>("tags")

/* ------------------------------------------------------------------ */
/* Hydration helpers */
/* ------------------------------------------------------------------ */

const hydrateTransaction = async (
  transaction: TransactionModel,
): Promise<TransactionWithRelations> => {
  const accounts = database.get<AccountModel>("accounts")
  const categories = database.get<CategoryModel>("categories")
  const [account, category, tags, relatedAccount, conversionRate] =
    await Promise.all([
      accounts.find(transaction.accountId),
      transaction.categoryId
        ? categories.find(transaction.categoryId)
        : Promise.resolve(null),
      loadTransactionTags(transaction.id),
      transaction.relatedAccountId
        ? accounts
            .find(transaction.relatedAccountId)
            .catch(() => null as AccountModel | null)
        : Promise.resolve(null),
      transaction.isTransfer
        ? getConversionRateForTransaction(transaction)
        : Promise.resolve(null),
    ])

  return {
    transaction,
    account,
    category,
    tags,
    ...(transaction.relatedAccountId ? { relatedAccount } : {}),
    ...(transaction.isTransfer && conversionRate != null
      ? { conversionRate }
      : {}),
  }
}

/**
 * Balance delta for the account.
 * - Income: amount is positive → delta = amount.
 * - Expense: amount is positive → delta = -amount.
 * - Transfer: amount is signed (debit negative, credit positive) → delta = amount.
 *
 * Balance rule (Flutter parity): we only apply this when the transaction is
 * confirmed (!isPending). Pending transactions must never affect account balance.
 */
const getBalanceDelta = (amount: number, type: TransactionType): number => {
  if (type === TransactionTypeEnum.INCOME) return amount
  if (type === TransactionTypeEnum.TRANSFER) return amount // signed amount on row
  return -amount // expense (money out of account)
}

const loadTransactionTags = async (
  transactionId: string,
): Promise<TagModel[]> => {
  const tts = await transactionTagsCollection()
    .query(Q.where("transaction_id", transactionId))
    .fetch()

  if (tts.length === 0) return []

  const tagIds = tts.map((t) => t.tagId)

  return tagsCollection()
    .query(Q.where("id", Q.oneOf(tagIds)))
    .fetch()
}

/**
 * Single source of truth for the derived rule:
 *   has_attachments = (extra.attachments is non-empty)
 *
 * This value is denormalized into the `has_attachments` column for indexed
 * filtering. Whenever extra is written (create or update), has_attachments
 * must be set in the same write so the cache never drifts.
 */
function hasAttachmentsFromExtra(
  extra: Record<string, string> | null,
): boolean {
  if (!extra?.attachments) return false
  try {
    const parsed = JSON.parse(extra.attachments) as unknown
    if (Array.isArray(parsed)) return parsed.length > 0
    if (typeof parsed === "object" && parsed !== null)
      return Object.keys(parsed).length > 0
    return false
  } catch {
    return extra.attachments.length > 0
  }
}

/* ------------------------------------------------------------------ */
/* Query builder */
/* ------------------------------------------------------------------ */

/** Escape % and _ for SQL LIKE so they match literally. */
function escapeLike(term: string): string {
  return term.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_")
}

const buildTransactionQuery = (filters?: TransactionListFilters) => {
  let query = transactionsCollection().query()

  // Always exclude deleted unless explicitly requested
  if (filters?.deletedOnly) {
    query = query.extend(Q.where("is_deleted", true))
  } else if (filters?.includeDeleted !== true) {
    query = query.extend(Q.where("is_deleted", false))
  }

  if (filters?.accountIds?.length) {
    query = query.extend(Q.where("account_id", Q.oneOf(filters.accountIds)))
  } else if (filters?.accountId) {
    query = query.extend(Q.where("account_id", filters.accountId))
  }
  if (filters?.categoryIds?.length) {
    query = query.extend(Q.where("category_id", Q.oneOf(filters.categoryIds)))
  } else if (filters?.categoryId) {
    query = query.extend(Q.where("category_id", filters.categoryId))
  }
  if (filters?.typeFilters?.length) {
    query = query.extend(Q.where("type", Q.oneOf(filters.typeFilters)))
  } else if (filters?.type) {
    query = query.extend(Q.where("type", filters.type))
  }
  if (filters?.isPending !== undefined) {
    query = query.extend(Q.where("is_pending", filters.isPending))
  }
  if (filters?.fromDate !== undefined) {
    query = query.extend(Q.where("transaction_date", Q.gte(filters.fromDate)))
  }
  if (filters?.toDate !== undefined) {
    query = query.extend(Q.where("transaction_date", Q.lte(filters.toDate)))
  }
  if (filters?.minAmount !== undefined) {
    query = query.extend(Q.where("amount", Q.gte(filters.minAmount)))
  }
  if (filters?.maxAmount !== undefined) {
    query = query.extend(Q.where("amount", Q.lte(filters.maxAmount)))
  }
  const matchType = filters?.searchMatchType ?? "partial"
  const isUntitled = matchType === "untitled"
  if (isUntitled) {
    query = query.extend(Q.or(Q.where("title", null), Q.where("title", "")))
  }
  const searchTrimmed = filters?.search?.trim()
  if (searchTrimmed && searchTrimmed.length > 0) {
    const includeNotes = filters?.searchIncludeNotes !== false
    const escaped = escapeLike(searchTrimmed)
    const isExact = matchType === "exact"
    const pattern = isExact ? escaped : `%${escaped}%`
    if (isUntitled) {
      const notesCondition = isExact
        ? Q.where("description", searchTrimmed)
        : Q.where("description", Q.like(pattern))
      query = query.extend(notesCondition)
    } else {
      const isSmart = matchType === "smart"
      // Smart mode also matches null-titled (untitled) transactions so they
      // aren't invisible to search just because they have no title.
      const titleCondition = isExact
        ? Q.where("title", searchTrimmed)
        : isSmart
          ? Q.or(Q.where("title", null), Q.where("title", Q.like(pattern)))
          : Q.where("title", Q.like(pattern))
      if (includeNotes) {
        const notesCondition = isExact
          ? Q.where("description", searchTrimmed)
          : Q.where("description", Q.like(pattern))
        query = query.extend(Q.or(titleCondition, notesCondition))
      } else {
        query = query.extend(titleCondition)
      }
    }
  }
  if (filters?.tagIds?.length) {
    query = query.extend(
      Q.on("transaction_tags", Q.where("tag_id", Q.oneOf(filters.tagIds))),
    )
  }
  if (filters?.goalId) {
    query = query.extend(Q.where("goal_id", filters.goalId))
  }
  if (filters?.budgetId) {
    query = query.extend(Q.where("budget_id", filters.budgetId))
  }
  if (filters?.loanId) {
    query = query.extend(Q.where("loan_id", filters.loanId))
  }
  if (filters?.attachmentFilter === "has") {
    query = query.extend(Q.where("has_attachments", true))
  } else if (filters?.attachmentFilter === "none") {
    query = query.extend(Q.where("has_attachments", false))
  }

  return query
}

/**
 * Pending transactions: future-dated OR explicitly pending (isPending === true).
 * Excludes deleted. Order: transaction_date ascending (closest upcoming first).
 * Optional range: fromDate/toDate (Unix ms) to limit results (e.g. home timeframe).
 */
export const getPendingTransactionModels = async (options?: {
  fromDate?: number
  toDate?: number
}): Promise<TransactionModel[]> => {
  const anchor = startOfNextMinute()
  const anchorTs = anchor.getTime()

  let futureQuery = transactionsCollection().query(
    Q.where("is_deleted", false),
    Q.where("transaction_date", Q.gte(anchorTs)),
  )
  if (options?.fromDate !== undefined) {
    futureQuery = futureQuery.extend(
      Q.where("transaction_date", Q.gte(options.fromDate)),
    )
  }
  if (options?.toDate !== undefined) {
    futureQuery = futureQuery.extend(
      Q.where("transaction_date", Q.lte(options.toDate)),
    )
  }

  const [pendingTrue, futureDated] = await Promise.all([
    buildTransactionQuery({
      isPending: true,
      includeDeleted: false,
      ...(options?.fromDate !== undefined && {
        fromDate: options.fromDate,
      }),
      ...(options?.toDate !== undefined && { toDate: options.toDate }),
    }).fetch(),
    futureQuery.fetch(),
  ])

  const byId = new Map<string, TransactionModel>()
  for (const t of pendingTrue) byId.set(t.id, t)
  for (const t of futureDated) if (!byId.has(t.id)) byId.set(t.id, t)

  const merged = Array.from(byId.values())
  merged.sort(
    (a, b) => a.transactionDate.getTime() - b.transactionDate.getTime(),
  )
  return merged
}

/** Pending transactions with account, category, and tags hydrated. */
export const getPendingTransactionModelsFull = async (options?: {
  fromDate?: number
  toDate?: number
}): Promise<TransactionWithRelations[]> => {
  const rows = await getPendingTransactionModels(options)
  return Promise.all(rows.map(hydrateTransaction))
}

/* ------------------------------------------------------------------ */
/* CONFIRM PENDING */
/* ------------------------------------------------------------------ */

interface ConfirmTransactionOptions {
  /** When true, set transactionDate to now on confirm; when false, keep original date. */
  updateTransactionDate: boolean
  /**
   * When true (default), confirms the transaction (isPending → false).
   * When false, "holds" the transaction (isPending → true).
   * Flutter equivalent: `Transaction.confirm([bool confirm = true, ...])`
   */
  confirm?: boolean
}

/**
 * Confirm or hold a pending transaction (and its transfer pair if any).
 *
 * Confirm (default): sets isPending = false, optionally sets transactionDate = now,
 * and adds the balance delta to the account.
 *
 * Hold (confirm: false): sets isPending = true (re-pend), and reverses the balance
 * delta if the transaction was previously confirmed.
 *
 * Applies to the transfer pair if present (both legs updated together).
 */
export const confirmTransactionSync = async (
  identifier: string,
  options: ConfirmTransactionOptions,
): Promise<void> => {
  const shouldConfirm = options.confirm !== false
  const transaction = await findTransactionModel(identifier)
  if (!transaction) {
    throw new Error(`Transaction with id ${identifier} not found`)
  }

  // If confirming but already confirmed, or holding but already pending – no-op.
  if (shouldConfirm && !transaction.isPending) return
  if (!shouldConfirm && transaction.isPending) return

  // Resolve transfer pair: we use transfer_id + getPairedTransaction (not extra.transferPairId).
  let pair: TransactionModel | null = null
  if (transaction.isTransfer && transaction.transferId) {
    pair = await getPairedTransaction(transaction)
  }
  const transferPairId = transaction.extra?.transferPairId
  if (!pair && transferPairId) {
    pair = await findTransactionModel(transferPairId)
  }

  return database.write(async () => {
    const toUpdate: TransactionModel[] = [transaction]
    if (pair) {
      if (shouldConfirm && pair.isPending) toUpdate.push(pair)
      if (!shouldConfirm && !pair.isPending) toUpdate.push(pair)
    }

    const now = new Date()
    for (const t of toUpdate) {
      await t.update((x) => {
        x.isPending = !shouldConfirm
        x.updatedAt = now
        if (shouldConfirm && options.updateTransactionDate) {
          x.transactionDate = now
        }
      })

      // Balance: confirming adds delta; holding reverses delta
      const balanceDelta = getBalanceDelta(t.amount, t.type)
      const account = await accountsCollection().find(t.accountId)
      await account.update((a) => {
        a.balance = shouldConfirm
          ? a.balance + balanceDelta
          : a.balance - balanceDelta
        a.updatedAt = now
      })
    }
  })
}

/* ------------------------------------------------------------------ */
/* READ – raw models (for edit screen, etc.) */
/* ------------------------------------------------------------------ */

export const getTransactionModels = async (
  filters?: TransactionListFilters,
): Promise<TransactionModel[]> => {
  return buildTransactionQuery(filters).fetch()
}

/** Observable count of transactions for an account (non-deleted). */
export const observeTransactionCountByAccountId = (
  accountId: string,
): Observable<number> =>
  observeTransactionModels({ accountId }).pipe(map((rows) => rows.length))

/**
 * Unlink a tag from all transactions (removes all transaction_tags for this tag).
 * Call before deleting/destroying a tag.
 */
export const unlinkTagFromAllTransactions = async (
  tagId: string,
): Promise<void> => {
  const rows = await transactionTagsCollection()
    .query(Q.where("tag_id", tagId))
    .fetch()
  await database.write(async () => {
    for (const row of rows) {
      await row.destroyPermanently()
    }
  })
}

const findTransactionModel = async (
  id: string,
): Promise<TransactionModel | null> => {
  try {
    return await transactionsCollection().find(id)
  } catch {
    return null
  }
}

/** Columns that affect list display or commonly change on edit – re-emit when these change. */
const TRANSACTION_OBSERVE_COLUMNS = [
  "title",
  "transaction_date",
  "amount",
  "type",
  "is_pending",
  "category_id",
  "account_id",
  "updated_at",
  "is_deleted",
  "has_attachments",
  "is_transfer",
  "transfer_id",
  "related_account_id",
  "goal_id",
  "budget_id",
  "loan_id",
] as const

export const observeTransactionModels = (
  filters?: TransactionListFilters,
): Observable<TransactionModel[]> => {
  return buildTransactionQuery(filters).observeWithColumns([
    ...TRANSACTION_OBSERVE_COLUMNS,
  ])
}

export const observeTransactionModelById = (
  id: string,
): Observable<TransactionModel | null> => {
  return transactionsCollection()
    .query(Q.where("id", id))
    .observe()
    .pipe(map((results) => results[0] ?? null))
}

/* ------------------------------------------------------------------ */
/* OBSERVE – fully hydrated */
/* ------------------------------------------------------------------ */

/**
 * Observe transactions with account, category, and tags hydrated.
 * Uses observeTransactionModels (with observeWithColumns) so transaction title/date/amount
 * updates re-emit. When refreshWhen observables are provided, re-hydrates whenever they
 * emit so account/category (e.g. icon) updates appear instantly.
 */
export const observeTransactionModelsFull = (
  filters?: TransactionListFilters,
  refreshWhen?: Observable<unknown>[],
): Observable<TransactionWithRelations[]> => {
  const transactions$ = observeTransactionModels(filters)

  const source$ =
    refreshWhen?.length && Array.isArray(refreshWhen) && refreshWhen.length > 0
      ? combineLatest([
          transactions$.pipe(startWith([] as TransactionModel[])),
          ...refreshWhen.map((o) => o.pipe(startWith(null))),
        ]).pipe(map(([rows]) => rows as TransactionModel[]))
      : transactions$

  return source$.pipe(
    switchMap((rows) =>
      rows.length === 0
        ? of([])
        : combineLatest(rows.map((t) => from(hydrateTransaction(t)))),
    ),
  )
}

/* ------------------------------------------------------------------ */
/* Tag helpers (for edit screen) */
/* ------------------------------------------------------------------ */

export const observeTransactionTagIds = (
  transactionId: string,
): Observable<string[]> => {
  return transactionTagsCollection()
    .query(Q.where("transaction_id", transactionId))
    .observe()
    .pipe(map((rows) => rows.map((row) => row.tagId)))
}

/* ------------------------------------------------------------------ */
/* WRITE */
/* ------------------------------------------------------------------ */

export const createTransactionModel = async (
  data: TransactionFormValues,
): Promise<TransactionModel> => {
  const transactions = transactionsCollection()
  const categories = database.get<CategoryModel>("categories")

  return database.write(async () => {
    const category = data.categoryId
      ? await categories.find(data.categoryId)
      : null

    const transaction = await transactions.create((t) => {
      t.amount = data.amount
      t.type = data.type
      t.transactionDate = data.transactionDate
      t.accountId = data.accountId
      t.categoryId = data.categoryId ?? null
      t.title = data.title ?? null
      t.description = data.description ?? null
      t.isPending = data.isPending ?? false
      if (data.requiresManualConfirmation !== undefined)
        t.requiresManualConfirmation = data.requiresManualConfirmation ?? null
      t.isDeleted = false
      t.extra = data.extra ?? null
      t.recurringId = data.recurringId ?? null
      // Cached derivative: set in same write so has_attachments never drifts from extra.attachments
      t.hasAttachments = hasAttachmentsFromExtra(data.extra ?? null)
      t.subtype = data.subtype ?? null
      t.location = data.location ?? null
      t.goalId = data.goalId ?? null
      t.budgetId = data.budgetId ?? null
      t.loanId = data.loanId ?? null
      // Transfer link fields: single-row (income/expense or legacy transfer) have no pair
      t.isTransfer = data.type === TransactionTypeEnum.TRANSFER
      t.transferId = null
      t.relatedAccountId = null
      // Balance before is computed at read time (source-verified: Flow does not store it)
      t.accountBalanceBefore = 0
    })

    const account = await accountsCollection().find(data.accountId)
    if (!data.isPending) {
      const balanceDelta = getBalanceDelta(data.amount, data.type)
      await account.update((a) => {
        a.balance = a.balance + balanceDelta
      })
    }

    if (category) {
      await category.update(incrementCount)
    }

    if (data.tags?.length) {
      const tt = transactionTagsCollection()
      const tags = tagsCollection()

      for (const tagId of data.tags) {
        const tag = await tags.find(tagId)

        await tt.create((r) => {
          r.transactionId = transaction.id
          r.tagId = tagId
        })

        await tag.update(incrementCount)
      }
    }

    return transaction
  })
}

export const updateTransactionModel = async (
  transaction: TransactionModel,
  updates: Partial<TransactionFormValues>,
): Promise<TransactionModel> => {
  const categories = database.get<CategoryModel>("categories")
  const oldAmount = transaction.amount
  const oldType = transaction.type
  const oldAccountId = transaction.accountId

  return database.write(async () => {
    const oldCategoryId = transaction.categoryId
    let oldCategory: CategoryModel | null = null
    if (oldCategoryId) {
      try {
        oldCategory = await categories.find(oldCategoryId)
      } catch {
        // ignore
      }
    }

    const updatedTransaction = await transaction.update((t) => {
      if (updates.amount !== undefined) t.amount = updates.amount
      if (updates.type !== undefined) t.type = updates.type
      if (updates.transactionDate !== undefined)
        t.transactionDate = updates.transactionDate
      if (updates.title !== undefined) t.title = updates.title ?? null
      if (updates.description !== undefined)
        t.description = updates.description ?? null
      if (updates.isPending !== undefined) t.isPending = updates.isPending
      if (updates.requiresManualConfirmation !== undefined)
        t.requiresManualConfirmation =
          updates.requiresManualConfirmation ?? null

      if (updates.categoryId !== undefined) {
        t.categoryId = updates.categoryId ?? null
      }
      if (updates.accountId) {
        t.accountId = updates.accountId
      }

      if (updates.extra !== undefined) {
        t.extra = updates.extra ?? null
        // Cached derivative: always update both in same write (atomic, no drift)
        t.hasAttachments = hasAttachmentsFromExtra(updates.extra ?? null)
      }
      if (updates.subtype !== undefined) {
        t.subtype = updates.subtype ?? null
      }
      if (updates.location !== undefined) {
        t.location = updates.location ?? null
      }
      if (updates.recurringId !== undefined) {
        t.recurringId = updates.recurringId ?? null
      }
      if (updates.goalId !== undefined) {
        t.goalId = updates.goalId ?? null
      }
      if (updates.budgetId !== undefined) {
        t.budgetId = updates.budgetId ?? null
      }
      if (updates.loanId !== undefined) {
        t.loanId = updates.loanId ?? null
      }
    })

    if (
      updates.categoryId !== undefined &&
      oldCategoryId !== updates.categoryId
    ) {
      if (oldCategory && !transaction.isDeleted) {
        await oldCategory.update(decrementCount)
      }
      if (updates.categoryId && !transaction.isDeleted) {
        const newCategory = await categories.find(updates.categoryId)
        if (newCategory) {
          await newCategory.update(incrementCount)
        }
      }
    }

    if (updates.tags !== undefined) {
      const transactionTags = transactionTagsCollection()
      const tagsCollectionRef = tagsCollection()
      const existing = await transactionTags
        .query(Q.where("transaction_id", transaction.id))
        .fetch()
      const existingTagIds = new Set(existing.map((tt) => tt.tagId))
      const newTagIds = new Set(updates.tags)

      for (const tt of existing) {
        if (!newTagIds.has(tt.tagId)) {
          const tag = await tagsCollectionRef.find(tt.tagId)
          await tag.update(decrementCount)
          await tt.destroyPermanently()
        }
      }
      for (const tagId of newTagIds) {
        if (!existingTagIds.has(tagId)) {
          const tag = await tagsCollectionRef.find(tagId)
          await transactionTags.create((ttRecord) => {
            ttRecord.transactionId = transaction.id
            ttRecord.tagId = tagId
          })
          await tag.update(incrementCount)
        }
      }
    }

    const newAmount = updatedTransaction.amount
    const newType = updatedTransaction.type
    const newAccountId = updatedTransaction.accountId
    const oldPending = transaction.isPending
    const newPending = updatedTransaction.isPending

    const reverseOldDelta = !oldPending
      ? -getBalanceDelta(oldAmount, oldType)
      : 0
    const forwardNewDelta = !newPending
      ? getBalanceDelta(newAmount, newType)
      : 0

    const accounts = accountsCollection()
    if (newAccountId === oldAccountId) {
      const account = await accounts.find(oldAccountId)
      await account.update((a) => {
        a.balance = a.balance + reverseOldDelta + forwardNewDelta
      })
    } else {
      const oldAccount = await accounts.find(oldAccountId)
      const newAccount = await accounts.find(newAccountId)
      await oldAccount.update((a) => {
        a.balance = a.balance + reverseOldDelta
      })
      await newAccount.update((a) => {
        a.balance = a.balance + forwardNewDelta
      })
    }

    return updatedTransaction
  })
}

/* ------------------------------------------------------------------ */
/* DELETE */
/* ------------------------------------------------------------------ */

export const deleteTransactionModel = async (
  transaction: TransactionModel,
): Promise<void> => {
  // Transfers: soft-delete both legs and restore both account balances (matches Flow moveToBinSync).
  if (transaction.isTransfer && transaction.transferId) {
    return deleteTransfer(transaction)
  }

  const categories = database.get<CategoryModel>("categories")

  return database.write(async () => {
    if (!transaction.isDeleted && transaction.categoryId) {
      const category = await categories.find(transaction.categoryId)
      await category.update(decrementCount)
    }

    if (!transaction.isDeleted && !transaction.isPending) {
      const reverseDelta = -getBalanceDelta(
        transaction.amount,
        transaction.type,
      )
      const account = await accountsCollection().find(transaction.accountId)
      await account.update((a) => {
        a.balance = a.balance + reverseDelta
      })
    }

    // Use our is_deleted column so the record still appears in trash queries.
    // WatermelonDB's markAsDeleted() sets _status = 'deleted' and hides the record from all queries.
    const now = new Date()
    await transaction.update((t) => {
      t.isDeleted = true
      t.deletedAt = now
      t.updatedAt = now
    })
  })
}

/* ------------------------------------------------------------------ */
/* RECURRING SCOPE HELPERS (for DeleteRecurringModal / EditRecurringModal) */
/* ------------------------------------------------------------------ */

/** Soft-delete every transaction linked to this recurring rule. */
export const deleteAllRecurringInstances = async (
  ruleId: string,
): Promise<void> => {
  const instances = await transactionsCollection()
    .query(Q.where("recurring_id", ruleId), Q.where("is_deleted", false))
    .fetch()
  for (const tx of instances) {
    await deleteTransactionModel(tx)
  }
}

/** Soft-delete instances from the given date onward (inclusive). */
export const deleteFutureRecurringInstances = async (
  ruleId: string,
  fromDate: Date,
): Promise<void> => {
  const fromTs = fromDate.getTime()
  const instances = await transactionsCollection()
    .query(
      Q.where("recurring_id", ruleId),
      Q.where("transaction_date", Q.gte(fromTs)),
      Q.where("is_deleted", false),
    )
    .fetch()
  for (const tx of instances) {
    await deleteTransactionModel(tx)
  }
}

/** Detach this transaction from its recurring rule (sets recurringId = null). */
export const detachTransactionFromRule = async (
  transaction: TransactionModel,
): Promise<void> => {
  await database.write(async () => {
    await transaction.update((t) => {
      t.recurringId = null
    })
  })
}

/** Payload shape for editing recurring instances (matches form + updateTransactionModel). */
export interface RecurringEditPayload {
  amount: number
  type: TransactionType
  transactionDate: Date
  categoryId: string | null
  accountId: string
  title: string | null
  description?: string
  isPending: boolean
  requiresManualConfirmation?: boolean
  tags: string[]
  extra?: Record<string, string>
  subtype?: string
}

/** Update all pending/future instances of a rule from the given date onward. */
export const updateFutureRecurringInstances = async (
  ruleId: string,
  fromDate: Date,
  payload: RecurringEditPayload,
): Promise<void> => {
  const fromTs = fromDate.getTime()
  const instances = await transactionsCollection()
    .query(
      Q.where("recurring_id", ruleId),
      Q.where("transaction_date", Q.gte(fromTs)),
      Q.where("is_pending", true),
      Q.where("is_deleted", false),
    )
    .fetch()

  const updates: Partial<TransactionFormValues> = {
    amount: payload.amount,
    type: payload.type,
    transactionDate: payload.transactionDate,
    categoryId: payload.categoryId,
    accountId: payload.accountId,
    title: payload.title,
    description: payload.description,
    isPending: payload.isPending,
    requiresManualConfirmation: payload.requiresManualConfirmation,
    tags: payload.tags,
    extra: payload.extra,
    subtype: payload.subtype,
  }

  for (const tx of instances) {
    await updateTransactionModel(tx, updates)
  }
}

/**
 * Restore a soft-deleted transaction: set is_deleted = false, re-add balance to
 * account, and re-increment category transaction count.
 */
export const restoreTransactionModel = async (
  transaction: TransactionModel,
): Promise<void> => {
  if (!transaction.isDeleted) return
  const categories = database.get<CategoryModel>("categories")

  return database.write(async () => {
    await transaction.update((t) => {
      t.isDeleted = false
      t.deletedAt = null
    })

    if (!transaction.isPending) {
      const balanceDelta = getBalanceDelta(transaction.amount, transaction.type)
      const account = await accountsCollection().find(transaction.accountId)
      await account.update((a) => {
        a.balance = a.balance + balanceDelta
      })
    }

    if (transaction.categoryId) {
      const category = await categories.find(transaction.categoryId)
      await category.update(incrementCount)
    }
  })
}

export const destroyTransactionModel = async (
  transaction: TransactionModel,
): Promise<void> => {
  const categories = database.get<CategoryModel>("categories")

  return database.write(async () => {
    if (!transaction.isDeleted && transaction.categoryId) {
      const category = await categories.find(transaction.categoryId)
      await category.update(decrementCount)
    }

    if (!transaction.isDeleted && !transaction.isPending) {
      const reverseDelta = -getBalanceDelta(
        transaction.amount,
        transaction.type,
      )
      const account = await accountsCollection().find(transaction.accountId)
      await account.update((a) => {
        a.balance = a.balance + reverseDelta
      })
    }

    await transaction.destroyPermanently()
  })
}

export const destroyAllDeletedTransactionModels = async (): Promise<void> => {
  const transactions = await getTransactionModels({ deletedOnly: true })
  for (const transaction of transactions) {
    await destroyTransactionModel(transaction)
  }
}

function parseDaysToKeep(retentionValue: string): number | null {
  if (retentionValue === "forever") return null
  if (retentionValue.endsWith("days")) {
    const n = parseInt(retentionValue, 10)
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return null
}

export const autoPurgeTrash = async (retentionValue: string) => {
  const daysToKeep = parseDaysToKeep(retentionValue)

  if (daysToKeep === null) {
    return
  }

  const cutoffDate = subDays(startOfDay(new Date()), daysToKeep).getTime()

  const transactionsToPurge = await transactionsCollection()
    .query(Q.where("is_deleted", true), Q.where("deleted_at", Q.lt(cutoffDate)))
    .fetch()

  if (transactionsToPurge.length > 0) {
    await database.write(async () => {
      for (const transaction of transactionsToPurge) {
        await transaction.destroyPermanently()
      }
    })
  }
}
