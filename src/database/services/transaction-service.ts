import { Q } from "@nozbe/watermelondb"
import { startOfDay, subDays } from "date-fns"
import type { Observable } from "rxjs"
import { combineLatest, from, map, of, startWith, switchMap } from "rxjs"

import type {
  RecurringEditPayload,
  TransactionFormValues,
} from "~/schemas/transactions.schema"
import {
  type TransactionListFilters,
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
import type TransferModel from "../models/transfer"
import { getBalanceDelta } from "../utils/get-balance-delta"
import {
  deleteTransferWriter,
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

/**
 * Hydrates an array of transactions in a fixed number of batch DB queries
 * regardless of list size — O(queries) = 4 regardless of N:
 *   1. accounts (primary + related, one Q.oneOf)
 *   2. categories (one Q.oneOf)
 *   3. transaction_tags join rows (one Q.oneOf on transaction ids)
 *   4. tags (one Q.oneOf on tag ids from join rows)
 *   + one query per transfer transaction for conversion rate (small subset)
 *
 * Transactions whose primary account is not found (orphaned after account
 * deletion) are silently dropped — they never reach consumers.
 */
const hydrateTransactionsBatch = async (
  transactions: TransactionModel[],
): Promise<TransactionWithRelations[]> => {
  if (transactions.length === 0) return []

  const accounts = database.get<AccountModel>("accounts")
  const categories = database.get<CategoryModel>("categories")
  const tt = transactionTagsCollection()

  // 1. Collect IDs for batch fetches
  const accountIdSet = new Set<string>()
  const categoryIdSet = new Set<string>()
  const txIds: string[] = []
  for (const t of transactions) {
    accountIdSet.add(t.accountId)
    if (t.relatedAccountId) accountIdSet.add(t.relatedAccountId)
    if (t.categoryId) categoryIdSet.add(t.categoryId)
    txIds.push(t.id)
  }
  const accountIds = [...accountIdSet]
  const categoryIds = [...categoryIdSet]

  // 2. Parallel batch fetches: accounts, categories, tag join rows
  const [accountRows, categoryRows, ttRows] = await Promise.all([
    accounts.query(Q.where("id", Q.oneOf(accountIds))).fetch(),
    categoryIds.length
      ? categories.query(Q.where("id", Q.oneOf(categoryIds))).fetch()
      : Promise.resolve([] as CategoryModel[]),
    tt.query(Q.where("transaction_id", Q.oneOf(txIds))).fetch(),
  ])

  // 3. Batch-fetch tags referenced by join rows
  const tagIdSet = new Set(ttRows.map((r) => r.tagId))
  const tagRows = tagIdSet.size
    ? await tagsCollection()
        .query(Q.where("id", Q.oneOf([...tagIdSet])))
        .fetch()
    : ([] as TagModel[])

  // 4. Build lookup Maps
  const accountMap = new Map(accountRows.map((a) => [a.id, a]))
  const categoryMap = new Map(categoryRows.map((c) => [c.id, c]))
  const tagMap = new Map(tagRows.map((t) => [t.id, t]))

  const tagsByTxId = new Map<string, TagModel[]>()
  for (const row of ttRows) {
    const tag = tagMap.get(row.tagId)
    if (!tag) continue
    const arr = tagsByTxId.get(row.transactionId) ?? []
    arr.push(tag)
    tagsByTxId.set(row.transactionId, arr)
  }

  // 5. Resolve conversion rates for transfer transactions (small subset)
  const rateMap = new Map<string, number | null>()
  const transferTxs = transactions.filter((t) => t.isTransfer)
  if (transferTxs.length) {
    await Promise.all(
      transferTxs.map(async (t) => {
        rateMap.set(t.id, await getConversionRateForTransaction(t))
      }),
    )
  }

  // 6. Assemble — drop orphaned transactions (account deleted after creation)
  const results: TransactionWithRelations[] = []
  for (const t of transactions) {
    const account = accountMap.get(t.accountId)
    if (!account) continue // orphaned: primary account not found

    const result: TransactionWithRelations = {
      transaction: t,
      account,
      category: t.categoryId ? (categoryMap.get(t.categoryId) ?? null) : null,
      tags: tagsByTxId.get(t.id) ?? [],
    }
    if (t.relatedAccountId) {
      result.relatedAccount = accountMap.get(t.relatedAccountId) ?? null
    }
    const rate = rateMap.get(t.id)
    if (t.isTransfer && rate != null) {
      result.conversionRate = rate
    }
    results.push(result)
  }
  return results
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
 * Fetches future-dated and explicitly-pending (isPending === true) transactions,
 * deduplicated and sorted by transaction_date ascending (closest upcoming first).
 * Excludes soft-deleted rows. Optionally constrained to a fromDate/toDate range (Unix ms).
 *
 * @param options - Optional date range to narrow results.
 * @returns Deduplicated, sorted array of pending transaction models.
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

/**
 * Same as {@link getPendingTransactionModels} but returns each row fully hydrated
 * with its account, category, and tags resolved into a {@link TransactionWithRelations} object.
 *
 * @param options - Optional date range to narrow results.
 * @returns Hydrated pending transactions sorted by date ascending.
 */
export const getPendingTransactionModelsFull = async (options?: {
  fromDate?: number
  toDate?: number
}): Promise<TransactionWithRelations[]> => {
  const rows = await getPendingTransactionModels(options)
  return hydrateTransactionsBatch(rows)
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

  // Build the list of transactions to update before entering the write.
  // **Race condition note**: `transaction` and `pair` are fetched outside the write block.
  // The isPending guards above (lines ~423-424) use this snapshot, so a second rapid
  // tap that confirms between the fetch and the write could slip through. In a
  // single-user mobile context this is extremely unlikely, but if `confirmTransactionSync`
  // is ever called from a concurrent context the guard should be re-checked inside the write.
  const toUpdate: TransactionModel[] = [transaction]
  if (pair) {
    if (shouldConfirm && pair.isPending) toUpdate.push(pair)
    if (!shouldConfirm && !pair.isPending) toUpdate.push(pair)
  }

  return database.write(async () => {
    // Fetch all accounts inside the write block to ensure we read the latest balance
    // and prevent concurrent confirmation calls from applying deltas to stale snapshots.
    // **Concurrency safety**: WatermelonDB guarantees sequential execution within a write,
    // so all account reads reflect the current state.
    const accountIds = [...new Set(toUpdate.map((t) => t.accountId))]
    const accounts = await Promise.all(
      accountIds.map((id) => accountsCollection().find(id)),
    )
    const accountMap = new Map(accounts.map((a) => [a.id, a]))

    const now = new Date()
    const batchOps: Parameters<typeof database.batch>[0] = []

    for (const t of toUpdate) {
      // Intentionally capture amount and type from pre-update model snapshot.
      // These values are used to calculate the balance delta; we need the original
      // amount/type before prepareUpdate modifies them in the callback.
      const { amount, type } = t

      // Resolve account before prepareUpdate so accountBalanceBefore can reference it.
      const account = accountMap.get(t.accountId)

      batchOps.push(
        t.prepareUpdate((x) => {
          x.isPending = !shouldConfirm
          if (shouldConfirm && options.updateTransactionDate) {
            x.transactionDate = now
          }
          // Keep accountBalanceBefore in sync with the new pending state.
          // Confirming: snapshot the pre-transaction balance (account.balance before delta is applied).
          // Holding (re-pending): reset to 0 — pending txs have no balance effect.
          if (shouldConfirm && account) {
            x.accountBalanceBefore = account.balance
          } else if (!shouldConfirm) {
            x.accountBalanceBefore = 0
          }
        }),
      )

      // Balance: confirming adds delta; holding reverses delta.
      if (account) {
        const balanceDelta = getBalanceDelta(amount, type)
        batchOps.push(
          account.prepareUpdate((a) => {
            a.balance = shouldConfirm
              ? a.balance + balanceDelta
              : a.balance - balanceDelta
          }),
        )
      }
    }

    await database.batch(...batchOps)
  })
}

/* ------------------------------------------------------------------ */
/* READ – raw models (for edit screen, etc.) */
/* ------------------------------------------------------------------ */

/**
 * Fetches transactions matching the supplied filters (non-reactive, one-shot read).
 * Excludes soft-deleted rows by default unless `filters.deletedOnly` or `filters.includeDeleted` is set.
 *
 * @param filters - Optional query filters (accounts, categories, date range, search, etc.).
 * @returns Array of matching transaction models.
 */
export const getTransactionModels = async (
  filters?: TransactionListFilters,
): Promise<TransactionModel[]> => {
  return buildTransactionQuery(filters).fetch()
}

/**
 * Returns a reactive count of non-deleted transactions belonging to the given account.
 * Emits a new value whenever the underlying transaction list changes.
 *
 * @param accountId - The account whose transactions are counted.
 * @returns Observable that emits the current transaction count.
 */
export const observeTransactionCountByAccountId = (
  accountId: string,
): Observable<number> =>
  observeTransactionModels({ accountId }).pipe(map((rows) => rows.length))

/**
 * Writer body — must be called within a `database.write()` context.
 * Permanently destroys every `transaction_tags` row linked to the given tag,
 * effectively unlinking the tag from all transactions. Call before deleting or destroying a tag.
 *
 * @param tagId - The tag whose join rows should be removed.
 */
export async function unlinkTagFromAllTransactionsWriter(
  tagId: string,
): Promise<void> {
  const rows = await transactionTagsCollection()
    .query(Q.where("tag_id", tagId))
    .fetch()
  for (const row of rows) {
    await row.destroyPermanently()
  }
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

/**
 * Returns a reactive list of transactions matching the supplied filters.
 * Re-emits whenever any of the tracked columns (title, amount, date, etc.) change.
 *
 * @param filters - Optional query filters applied to the transaction collection.
 * @returns Observable that emits the current matching transaction models.
 */
export const observeTransactionModels = (
  filters?: TransactionListFilters,
): Observable<TransactionModel[]> => {
  return buildTransactionQuery(filters).observeWithColumns([
    ...TRANSACTION_OBSERVE_COLUMNS,
  ])
}

/**
 * Returns a reactive observable for a single transaction by its ID.
 * Emits `null` if no matching row is found.
 *
 * @param id - The transaction row ID to observe.
 * @returns Observable that emits the transaction model or `null`.
 */
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
      rows.length === 0 ? of([]) : from(hydrateTransactionsBatch(rows)),
    ),
  )
}

/* ------------------------------------------------------------------ */
/* Tag helpers (for edit screen) */
/* ------------------------------------------------------------------ */

/**
 * Returns a reactive list of tag IDs linked to the given transaction.
 * Emits a new array whenever the set of transaction_tag join rows changes.
 *
 * @param transactionId - The transaction whose linked tag IDs are observed.
 * @returns Observable that emits an array of tag ID strings.
 */
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

/**
 * Writer body — must be called within a `database.write()` context.
 * Creates a new transaction row, updates the owning account's balance (unless pending),
 * increments the category transaction count, and links any provided tag IDs.
 *
 * @param data - Validated transaction form values from the create form.
 * @returns The newly created transaction model.
 */
export async function createTransactionWriter(
  data: TransactionFormValues,
): Promise<TransactionModel> {
  const transactions = transactionsCollection()
  const categories = database.get<CategoryModel>("categories")

  // Pre-fetch all related rows before building the batch so we have their
  // current state (account balance, category/tag counts) before any write.
  const [account, category, tagModels] = await Promise.all([
    accountsCollection().find(data.accountId),
    data.categoryId ? categories.find(data.categoryId) : Promise.resolve(null),
    data.tags?.length
      ? Promise.all(data.tags.map((id) => tagsCollection().find(id)))
      : Promise.resolve([] as TagModel[]),
  ])

  const preparedTransaction = transactions.prepareCreate((t) => {
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
    // Snapshot: capture the account balance before this transaction is applied.
    // Used by getBalanceAtTransaction for O(1) detail-screen balance display.
    // Pending transactions keep 0 — they have no balance effect until confirmed.
    t.accountBalanceBefore = data.isPending ? 0 : account.balance
  })

  const batchOps: Parameters<typeof database.batch>[0] = [preparedTransaction]

  if (!data.isPending) {
    const balanceDelta = getBalanceDelta(data.amount, data.type)
    batchOps.push(
      account.prepareUpdate((a) => {
        a.balance = a.balance + balanceDelta
      }),
    )
  }

  if (category) {
    batchOps.push(category.prepareUpdate(incrementCount))
  }

  if (data.tags?.length) {
    const tt = transactionTagsCollection()
    for (let i = 0; i < data.tags.length; i++) {
      const tagId = data.tags[i]
      const tag = tagModels[i]
      batchOps.push(
        tt.prepareCreate((r) => {
          r.transactionId = preparedTransaction.id
          r.tagId = tagId
        }),
        tag.prepareUpdate(incrementCount),
      )
    }
  }

  await database.batch(...batchOps)
  return preparedTransaction
}

/**
 * Public wrapper for {@link createTransactionWriter}.
 * Executes the creation inside a `database.write()` context and returns the new model.
 *
 * @param data - Validated transaction form values.
 * @returns The newly created transaction model.
 */
export const createTransactionModel = async (
  data: TransactionFormValues,
): Promise<TransactionModel> => {
  return database.write(() => createTransactionWriter(data))
}

/**
 * Writer body — must be called within a `database.write()` context.
 * Updates the given transaction with the supplied partial values, reconciles the account
 * balance for amount/type/account changes, adjusts category transaction counts, and
 * syncs the tag join rows (adds new, removes removed).
 *
 * @param transaction - The existing transaction model to update.
 * @param updates - Partial set of form values to apply.
 * @returns The updated transaction model.
 */
export async function updateTransactionWriter(
  transaction: TransactionModel,
  updates: Partial<TransactionFormValues>,
): Promise<TransactionModel> {
  const categories = database.get<CategoryModel>("categories")
  const oldAmount = transaction.amount
  const oldType = transaction.type
  const oldAccountId = transaction.accountId

  const oldCategoryId = transaction.categoryId
  let oldCategory: CategoryModel | null = null
  if (oldCategoryId) {
    try {
      oldCategory = await categories.find(oldCategoryId)
    } catch {
      // ignore
    }
  }

  // Fetch all required models outside the batch
  const accounts = accountsCollection()
  const newCategoryModel =
    updates.categoryId && updates.categoryId !== oldCategoryId
      ? await categories.find(updates.categoryId).catch(() => null)
      : null

  const transactionTags = transactionTagsCollection()
  const tagsCollectionRef = tagsCollection()
  const existingTags =
    updates.tags !== undefined
      ? await transactionTags
          .query(Q.where("transaction_id", transaction.id))
          .fetch()
      : []

  const oldAccount =
    oldAccountId && updates.accountId && updates.accountId !== oldAccountId
      ? await accounts.find(oldAccountId)
      : oldAccountId
        ? await accounts.find(oldAccountId)
        : null

  const newAccount =
    updates.accountId && updates.accountId !== oldAccountId
      ? await accounts.find(updates.accountId)
      : null

  // Compute pending/account state before building batch ops so the prepareUpdate
  // closure can reference them (callbacks execute during database.batch).
  const oldPending = transaction.isPending
  const newPending =
    updates.isPending !== undefined ? updates.isPending : oldPending
  const newAccountId =
    updates.accountId !== undefined ? updates.accountId : oldAccountId

  // Build batch operations
  const batchOps: Parameters<typeof database.batch>[0] = []

  // Transaction update
  batchOps.push(
    transaction.prepareUpdate((t) => {
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
      if (updates.accountId !== undefined) {
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

      // Keep accountBalanceBefore in sync with pending state and account changes.
      // - Reverting to pending: reset to 0 (pending txs have no balance effect).
      // - Confirming: snapshot the pre-transaction balance of the target account.
      // - Account change while confirmed: snapshot new account's pre-transaction balance.
      // - Amount/type change on same confirmed account: snapshot is still correct (unchanged).
      if (newPending) {
        t.accountBalanceBefore = 0
      } else if (oldPending && !newPending) {
        const targetAccount =
          newAccountId !== oldAccountId ? newAccount : oldAccount
        t.accountBalanceBefore = targetAccount?.balance ?? 0
      } else if (!oldPending && newAccountId !== oldAccountId && newAccount) {
        t.accountBalanceBefore = newAccount.balance
      }
    }),
  )

  // Category count updates
  if (
    updates.categoryId !== undefined &&
    oldCategoryId !== updates.categoryId
  ) {
    if (oldCategory && !transaction.isDeleted) {
      batchOps.push(oldCategory.prepareUpdate(decrementCount))
    }
    if (newCategoryModel && !transaction.isDeleted) {
      batchOps.push(newCategoryModel.prepareUpdate(incrementCount))
    }
  }

  // Tag sync operations
  if (updates.tags !== undefined) {
    const existingTagIds = new Set(existingTags.map((tt) => tt.tagId))
    const newTagIds = new Set(updates.tags)

    for (const tt of existingTags) {
      if (!newTagIds.has(tt.tagId)) {
        const tag = await tagsCollectionRef.find(tt.tagId)
        batchOps.push(tag.prepareUpdate(decrementCount))
        batchOps.push(tt.prepareDestroyPermanently())
      }
    }
    for (const tagId of newTagIds) {
      if (!existingTagIds.has(tagId)) {
        const tag = await tagsCollectionRef.find(tagId)
        batchOps.push(
          transactionTags.prepareCreate((ttRecord) => {
            ttRecord.transactionId = transaction.id
            ttRecord.tagId = tagId
          }),
        )
        batchOps.push(tag.prepareUpdate(incrementCount))
      }
    }
  }

  // Balance updates
  const newAmount = updates.amount !== undefined ? updates.amount : oldAmount
  const newType = updates.type !== undefined ? updates.type : oldType

  const reverseOldDelta = !oldPending ? -getBalanceDelta(oldAmount, oldType) : 0
  const forwardNewDelta = !newPending ? getBalanceDelta(newAmount, newType) : 0

  if (newAccountId === oldAccountId && oldAccount) {
    batchOps.push(
      oldAccount.prepareUpdate((a) => {
        a.balance = a.balance + reverseOldDelta + forwardNewDelta
      }),
    )
  } else {
    if (oldAccount) {
      batchOps.push(
        oldAccount.prepareUpdate((a) => {
          a.balance = a.balance + reverseOldDelta
        }),
      )
    }
    if (newAccount) {
      batchOps.push(
        newAccount.prepareUpdate((a) => {
          a.balance = a.balance + forwardNewDelta
        }),
      )
    }
  }

  // Execute all operations atomically
  await database.batch(...batchOps)

  return transaction
}

/**
 * Public wrapper for {@link updateTransactionWriter}.
 * Executes the update inside a `database.write()` context and returns the updated model.
 *
 * @param transaction - The existing transaction model to update.
 * @param updates - Partial set of form values to apply.
 * @returns The updated transaction model.
 */
export const updateTransactionModel = async (
  transaction: TransactionModel,
  updates: Partial<TransactionFormValues>,
): Promise<TransactionModel> => {
  return database.write(() => updateTransactionWriter(transaction, updates))
}

/* ------------------------------------------------------------------ */
/* DELETE */
/* ------------------------------------------------------------------ */

/**
 * Writer body — must be called within a `database.write()` context.
 * Soft-deletes the transaction by setting `is_deleted = true`, reverses the account
 * balance delta, and decrements the category transaction count. For transfer rows,
 * delegates to {@link deleteTransferWriter} to soft-delete both legs atomically.
 *
 * All three operations (category count, account balance, transaction soft-delete)
 * are batched in a single atomic write to prevent partial deletes on crash.
 *
 * @param transaction - The transaction model to soft-delete.
 */
export async function deleteTransactionWriter(
  transaction: TransactionModel,
): Promise<void> {
  // Transfers: soft-delete both legs and restore both account balances (matches Flow moveToBinSync).
  if (transaction.isTransfer && transaction.transferId) {
    return deleteTransferWriter(transaction)
  }

  const categories = database.get<CategoryModel>("categories")
  const batchOps: Parameters<typeof database.batch>[0] = []
  const now = new Date()

  // Decrement the category transaction count (if not already deleted).
  if (!transaction.isDeleted && transaction.categoryId) {
    const category = await categories.find(transaction.categoryId)
    batchOps.push(category.prepareUpdate(decrementCount))
  }

  // Reverse the balance delta (if not already deleted and not pending).
  if (!transaction.isDeleted && !transaction.isPending) {
    const reverseDelta = -getBalanceDelta(transaction.amount, transaction.type)
    const account = await accountsCollection().find(transaction.accountId)
    batchOps.push(
      account.prepareUpdate((a) => {
        a.balance = a.balance + reverseDelta
      }),
    )
  }

  // Soft-delete via is_deleted flag (preserves record in trash queries).
  // Note: WatermelonDB's markAsDeleted() sets _status = 'deleted' and hides from all queries.
  batchOps.push(
    transaction.prepareUpdate((t) => {
      t.isDeleted = true
      t.deletedAt = now
    }),
  )

  // Commit all operations atomically.
  await database.batch(...batchOps)
}

/**
 * Public wrapper for {@link deleteTransactionWriter}.
 * Soft-deletes the transaction (moves it to trash) inside a `database.write()` context.
 *
 * @param transaction - The transaction model to soft-delete.
 */
export const deleteTransactionModel = async (
  transaction: TransactionModel,
): Promise<void> => {
  return database.write(() => deleteTransactionWriter(transaction))
}

/* ------------------------------------------------------------------ */
/* RECURRING SCOPE HELPERS (for DeleteRecurringModal / EditRecurringModal) */
/* ------------------------------------------------------------------ */

/**
 * Soft-deletes every non-deleted transaction instance linked to the given recurring rule.
 * All instances are processed within a single `database.write()` call.
 *
 * @param ruleId - The ID of the recurring rule whose instances should be deleted.
 */
export const deleteAllRecurringInstances = async (
  ruleId: string,
): Promise<void> => {
  const instances = await transactionsCollection()
    .query(Q.where("recurring_id", ruleId), Q.where("is_deleted", false))
    .fetch()
  await database.write(async () => {
    for (const tx of instances) {
      await deleteTransactionWriter(tx)
    }
  })
}

/**
 * Soft-deletes non-deleted recurring instances whose transaction_date is on or after
 * `fromDate`, processed in a single `database.write()` call.
 *
 * @param ruleId - The ID of the recurring rule.
 * @param fromDate - Instances on or after this date are deleted (inclusive).
 */
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
  await database.write(async () => {
    for (const tx of instances) {
      await deleteTransactionWriter(tx)
    }
  })
}

/**
 * Detaches a single transaction from its recurring rule by setting `recurringId = null`.
 * The transaction itself is not modified in any other way.
 *
 * @param transaction - The transaction to detach from its rule.
 */
export const detachTransactionFromRule = async (
  transaction: TransactionModel,
): Promise<void> => {
  await database.write(async () => {
    await transaction.update((t) => {
      t.recurringId = null
    })
  })
}

/**
 * Updates all pending instances of a recurring rule whose transaction_date is on or
 * after `fromDate`, applying the given payload to each, within a single `database.write()` call.
 *
 * @param ruleId - The ID of the recurring rule.
 * @param fromDate - Only instances on or after this date are updated (inclusive).
 * @param payload - The field values to apply to each matching instance.
 */
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

  await database.write(async () => {
    for (const tx of instances) {
      await updateTransactionWriter(tx, updates)
    }
  })
}

/**
 * Writer body — must be called within a `database.write()` context.
 * Restores a soft-deleted transaction by clearing `is_deleted`, re-applies the balance
 * delta to the account (unless pending), and re-increments the category transaction count.
 *
 * @param transaction - The soft-deleted transaction model to restore.
 */
export async function restoreTransactionWriter(
  transaction: TransactionModel,
): Promise<void> {
  if (!transaction.isDeleted) return
  const categories = database.get<CategoryModel>("categories")

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
}

/**
 * Public wrapper for {@link restoreTransactionWriter}.
 * Restores a soft-deleted transaction inside a `database.write()` context,
 * re-applying its balance delta and category count.
 *
 * @param transaction - The soft-deleted transaction to restore.
 */
export const restoreTransactionModel = async (
  transaction: TransactionModel,
): Promise<void> => {
  return database.write(() => restoreTransactionWriter(transaction))
}

/**
 * Writer body — must be called within a `database.write()` context.
 * Permanently destroys a transaction row via WatermelonDB's `destroyPermanently()`.
 * Reverses the account balance and decrements the category count only if the row
 * was not already soft-deleted (to avoid double-reversal).
 *
 * @param transaction - The transaction model to permanently destroy.
 */
export async function destroyTransactionWriter(
  transaction: TransactionModel,
): Promise<void> {
  const categories = database.get<CategoryModel>("categories")

  if (!transaction.isDeleted && transaction.categoryId) {
    const category = await categories.find(transaction.categoryId)
    await category.update(decrementCount)
  }

  if (!transaction.isDeleted && !transaction.isPending) {
    const reverseDelta = -getBalanceDelta(transaction.amount, transaction.type)
    const account = await accountsCollection().find(transaction.accountId)
    await account.update((a) => {
      a.balance = a.balance + reverseDelta
    })
  }

  // Clean up the transfers join row so it doesn't become an orphan after destroy.
  if (transaction.isTransfer) {
    const transfers = database.get<TransferModel>("transfers")
    const rows = await transfers
      .query(
        Q.or(
          Q.where("from_transaction_id", transaction.id),
          Q.where("to_transaction_id", transaction.id),
        ),
      )
      .fetch()
    for (const row of rows) {
      await row.destroyPermanently()
    }
  }

  await transaction.destroyPermanently()
}

/**
 * Public wrapper for {@link destroyTransactionWriter}.
 * Permanently destroys a transaction inside a `database.write()` context,
 * reversing its balance contribution and category count if not already soft-deleted.
 *
 * @param transaction - The transaction model to permanently destroy.
 */
export const destroyTransactionModel = async (
  transaction: TransactionModel,
): Promise<void> => {
  return database.write(() => destroyTransactionWriter(transaction))
}

/**
 * Permanently destroys all soft-deleted transaction rows in a single `database.write()` call.
 * This is the "empty trash" operation — rows cannot be recovered after this call.
 */
export const destroyAllDeletedTransactionModels = async (): Promise<void> => {
  const transactions = await getTransactionModels({ deletedOnly: true })
  await database.write(async () => {
    for (const transaction of transactions) {
      await destroyTransactionWriter(transaction)
    }
  })
}

function parseDaysToKeep(retentionValue: string): number | null {
  if (retentionValue === "forever") return null
  if (retentionValue.endsWith("days")) {
    const n = parseInt(retentionValue, 10)
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return null
}

/**
 * Permanently deletes soft-deleted transactions older than the specified retention window.
 * Accepts `"forever"` (no purge) or a string like `"30days"` (purge rows whose `deleted_at`
 * is before today minus N days). Called on app foreground to enforce the user's trash retention setting.
 *
 * @param retentionValue - Retention policy: `"forever"` to skip, or `"{N}days"` to purge.
 */
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
        await destroyTransactionWriter(transaction)
      }
    })
  }
}
