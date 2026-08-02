import { and, desc, eq, gte, inArray, lte, or, type SQL } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { mapAccount } from "~/database/mappers/account.mapper"
import { mapCategory } from "~/database/mappers/category.mapper"
import { mapTransaction } from "~/database/mappers/transaction.mapper"
import type {
  RowAccount,
  RowCategory,
  RowTransaction,
  RowTransactionTag,
} from "~/database/types/rows"
import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Transaction } from "~/types/transactions"

import { drizzleDb } from "../db"
import {
  accounts,
  categories,
  transactions,
  transactionTags,
  transfers,
} from "../schema"

export interface TransactionWithRelations extends Transaction {
  account: Account | undefined
  category: Category | undefined
  isTransfer: boolean
  transferId: string | null
  transferGroupId: string | null
  relatedAccountId: string | null
  relatedAccount: Account | undefined
  conversionRate: number | null
  tagIds: string[]
}

export interface TransactionFilters {
  from?: string
  to?: string
  accountIds?: string[]
  categoryIds?: string[]
  categoryId?: string
  id?: string
  loanId?: string
  goalId?: string
  budgetId?: string
  isPending?: boolean
  deletedOnly?: boolean
  includeDeleted?: boolean
  limit?: number
  offset?: number
}

interface RowTransfer {
  id: string
  from_transaction_id: string
  to_transaction_id: string
  from_account_id: string
  to_account_id: string
  conversion_rate: number
}

const txSelection = {
  id: transactions.id,
  account_id: transactions.accountId,
  category_id: transactions.categoryId,
  amount: transactions.amount,
  type: transactions.type,
  transaction_date: transactions.transactionDate,
  title: transactions.title,
  description: transactions.description,
  is_deleted: transactions.isDeleted,
  deleted_at: transactions.deletedAt,
  is_pending: transactions.isPending,
  requires_manual_confirmation: transactions.requiresManualConfirmation,
  account_balance_before: transactions.accountBalanceBefore,
  subtype: transactions.subtype,
  extra: transactions.extra,
  has_attachments: transactions.hasAttachments,
  recurring_id: transactions.recurringId,
  location: transactions.location,
  goal_id: transactions.goalId,
  budget_id: transactions.budgetId,
  loan_id: transactions.loanId,
  created_at: transactions.createdAt,
  updated_at: transactions.updatedAt,
}

const accountSelection = {
  id: accounts.id,
  name: accounts.name,
  type: accounts.type,
  balance: accounts.balance,
  currency_code: accounts.currencyCode,
  icon: accounts.icon,
  color_scheme_name: accounts.colorSchemeName,
  is_primary: accounts.isPrimary,
  exclude_from_balance: accounts.excludeFromBalance,
  is_archived: accounts.isArchived,
  sort_order: accounts.sortOrder,
  created_at: accounts.createdAt,
  updated_at: accounts.updatedAt,
}

const categorySelection = {
  id: categories.id,
  name: categories.name,
  type: categories.type,
  icon: categories.icon,
  color_scheme_name: categories.colorSchemeName,
  created_at: categories.createdAt,
  updated_at: categories.updatedAt,
}

const tagSelection = {
  transaction_id: transactionTags.transactionId,
  tag_id: transactionTags.tagId,
}

const transferSelection = {
  id: transfers.id,
  from_transaction_id: transfers.fromTransactionId,
  to_transaction_id: transfers.toTransactionId,
  from_account_id: transfers.fromAccountId,
  to_account_id: transfers.toAccountId,
  conversion_rate: transfers.conversionRate,
}

function stableFilterHash(filters: TransactionFilters): string {
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(filters).sort()) {
    const value = filters[key as keyof TransactionFilters]
    if (value !== undefined) sorted[key] = value
  }
  return JSON.stringify(sorted)
}

function getConditions(filters: TransactionFilters): SQL[] {
  const conditions: SQL[] = filters.includeDeleted
    ? []
    : [eq(transactions.isDeleted, filters.deletedOnly ? 1 : 0)]
  if (filters.id) conditions.push(eq(transactions.id, filters.id))
  if (filters.isPending) conditions.push(eq(transactions.isPending, 1))
  if (filters.from)
    conditions.push(gte(transactions.transactionDate, filters.from))
  if (filters.to) conditions.push(lte(transactions.transactionDate, filters.to))
  if (filters.accountIds?.length)
    conditions.push(inArray(transactions.accountId, filters.accountIds))
  if (filters.categoryIds?.length)
    conditions.push(inArray(transactions.categoryId, filters.categoryIds))
  if (filters.categoryId)
    conditions.push(eq(transactions.categoryId, filters.categoryId))
  if (filters.loanId) conditions.push(eq(transactions.loanId, filters.loanId))
  if (filters.goalId) conditions.push(eq(transactions.goalId, filters.goalId))
  if (filters.budgetId)
    conditions.push(eq(transactions.budgetId, filters.budgetId))
  return conditions
}

function hydrateTransactionRows({
  rows,
  accountRows,
  categoryRows,
  tagRows,
  transferRows,
}: {
  rows: RowTransaction[]
  accountRows: RowAccount[]
  categoryRows: RowCategory[]
  tagRows: RowTransactionTag[]
  transferRows: RowTransfer[]
}): TransactionWithRelations[] {
  const txIds = new Set(rows.map((row) => row.id))
  const accountMap = new Map(
    accountRows.map((row) => [row.id, mapAccount(row)]),
  )
  const categoryMap = new Map(
    categoryRows.map((row) => [
      row.id,
      { ...mapCategory(row), transactionCount: 0 },
    ]),
  )
  const tagMap = new Map<string, string[]>()
  for (const row of tagRows) {
    if (!txIds.has(row.transaction_id)) continue
    const tagIds = tagMap.get(row.transaction_id) ?? []
    tagIds.push(row.tag_id)
    tagMap.set(row.transaction_id, tagIds)
  }

  const transferMap = new Map<
    string,
    {
      transferId: string
      transferGroupId: string
      relatedAccountId: string
      conversionRate: number
    }
  >()
  for (const row of transferRows) {
    if (txIds.has(row.from_transaction_id)) {
      transferMap.set(row.from_transaction_id, {
        transferId: row.to_transaction_id,
        transferGroupId: row.id,
        relatedAccountId: row.to_account_id,
        conversionRate: row.conversion_rate,
      })
    }
    if (txIds.has(row.to_transaction_id)) {
      transferMap.set(row.to_transaction_id, {
        transferId: row.from_transaction_id,
        transferGroupId: row.id,
        relatedAccountId: row.from_account_id,
        conversionRate: row.conversion_rate,
      })
    }
  }

  return rows.map((row) => {
    const tf = transferMap.get(row.id)
    return {
      ...mapTransaction(row),
      account: accountMap.get(row.account_id),
      category: row.category_id ? categoryMap.get(row.category_id) : undefined,
      isTransfer: !!tf,
      transferId: tf?.transferId ?? null,
      transferGroupId: tf?.transferGroupId ?? null,
      relatedAccountId: tf?.relatedAccountId ?? null,
      relatedAccount: tf ? accountMap.get(tf.relatedAccountId) : undefined,
      conversionRate: tf?.conversionRate ?? null,
      tagIds: tagMap.get(row.id) ?? [],
    }
  })
}

export function useTransactions(filters: TransactionFilters): {
  items: TransactionWithRelations[]
  status: "idle" | "loading" | "ready" | "error"
} {
  const filterHash = stableFilterHash(filters)
  const conditions = getConditions(filters)
  const transactionsResult = useLiveQuery(
    drizzleDb
      .select(txSelection)
      .from(transactions)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
      .limit(filters.limit ?? -1)
      .offset(filters.offset ?? 0),
    [filterHash],
  )
  const accountsResult = useLiveQuery(
    drizzleDb.select(accountSelection).from(accounts),
  )
  const categoriesResult = useLiveQuery(
    drizzleDb.select(categorySelection).from(categories),
  )
  const tagLinksResult = useLiveQuery(
    drizzleDb.select(tagSelection).from(transactionTags),
  )
  const transfersResult = useLiveQuery(
    drizzleDb.select(transferSelection).from(transfers),
  )

  return {
    items: hydrateTransactionRows({
      rows: transactionsResult.data,
      accountRows: accountsResult.data,
      categoryRows: categoriesResult.data,
      tagRows: tagLinksResult.data,
      transferRows: transfersResult.data,
    }),
    status:
      (transactionsResult.error ??
      accountsResult.error ??
      categoriesResult.error ??
      tagLinksResult.error ??
      transfersResult.error)
        ? "error"
        : transactionsResult.updatedAt === undefined ||
            accountsResult.updatedAt === undefined ||
            categoriesResult.updatedAt === undefined ||
            tagLinksResult.updatedAt === undefined ||
            transfersResult.updatedAt === undefined
          ? "loading"
          : "ready",
  }
}

export async function getTransactions(
  filters: TransactionFilters,
): Promise<TransactionWithRelations[]> {
  const conditions = getConditions(filters)
  const rows = drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
    .limit(filters.limit ?? -1)
    .offset(filters.offset ?? 0)
    .all()
  const txIds = rows.map((row) => row.id)
  const [accountRows, categoryRows, tagRows, transferRows] = [
    drizzleDb.select(accountSelection).from(accounts).all(),
    drizzleDb.select(categorySelection).from(categories).all(),
    txIds.length
      ? drizzleDb
          .select(tagSelection)
          .from(transactionTags)
          .where(inArray(transactionTags.transactionId, txIds))
          .all()
      : [],
    txIds.length
      ? drizzleDb
          .select(transferSelection)
          .from(transfers)
          .where(
            or(
              inArray(transfers.fromTransactionId, txIds),
              inArray(transfers.toTransactionId, txIds),
            ),
          )
          .all()
      : [],
  ]

  return hydrateTransactionRows({
    rows,
    accountRows,
    categoryRows,
    tagRows,
    transferRows,
  })
}

export function getPendingTransactions(): Promise<TransactionWithRelations[]> {
  return getTransactions({ isPending: true, deletedOnly: false })
}

export async function getTransactionById(
  id: string,
): Promise<TransactionWithRelations | null> {
  const [transaction] = await getTransactions({ id, includeDeleted: true })
  return transaction ?? null
}
