import { and, desc, eq, gte, inArray, lte, type SQL } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Account, AccountType } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type {
  Transaction,
  TransactionSubType,
  TransactionType,
} from "~/types/transactions"
import { logger } from "~/utils/logger"

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
  isPending?: boolean
  deletedOnly?: boolean
  includeDeleted?: boolean
  limit?: number
  offset?: number
}

function parseExtra(
  raw: string | null,
  id: string,
): Record<string, string> | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    logger.warn("Failed to parse transaction.extra; treating as null", { id })
    return null
  }
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
  if (filters.accountIds?.length) {
    conditions.push(inArray(transactions.accountId, filters.accountIds))
  }
  if (filters.categoryIds?.length) {
    conditions.push(inArray(transactions.categoryId, filters.categoryIds))
  }
  if (filters.categoryId) {
    conditions.push(eq(transactions.categoryId, filters.categoryId))
  }
  if (filters.loanId) conditions.push(eq(transactions.loanId, filters.loanId))
  if (filters.goalId) conditions.push(eq(transactions.goalId, filters.goalId))
  return conditions
}

export function useTransactionsQuery(filters: TransactionFilters): {
  items: TransactionWithRelations[]
  status: "loading" | "ready" | "error"
} {
  const filterHash = stableFilterHash(filters)
  const transactionsResult = useLiveQuery(
    drizzleDb
      .select()
      .from(transactions)
      .where(and(...getConditions(filters)))
      .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
      .limit(filters.limit ?? -1)
      .offset(filters.offset ?? 0),
    [filterHash],
  )
  const accountsResult = useLiveQuery(drizzleDb.select().from(accounts))
  const categoriesResult = useLiveQuery(drizzleDb.select().from(categories))
  const tagLinksResult = useLiveQuery(drizzleDb.select().from(transactionTags))
  const transfersResult = useLiveQuery(drizzleDb.select().from(transfers))

  const accountMap = new Map<string, Account>(
    accountsResult.data.map((row) => [
      row.id,
      {
        id: row.id,
        name: row.name,
        type: row.type as AccountType,
        balance: row.balance,
        currencyCode: row.currencyCode,
        icon: row.icon,
        colorSchemeName: row.colorSchemeName,
        colorScheme: getThemeStrict(row.colorSchemeName),
        isPrimary: !!row.isPrimary,
        excludeFromBalance: !!row.excludeFromBalance,
        isArchived: !!row.isArchived,
        sortOrder: row.sortOrder,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      },
    ]),
  )
  const categoryMap = new Map<string, Category>(
    categoriesResult.data.map((row) => [
      row.id,
      {
        id: row.id,
        name: row.name,
        type: row.type as TransactionType,
        icon: row.icon,
        colorSchemeName: row.colorSchemeName,
        colorScheme: getThemeStrict(row.colorSchemeName),
        transactionCount: 0,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      },
    ]),
  )
  const txIds = new Set(transactionsResult.data.map((row) => row.id))
  const tagMap = new Map<string, string[]>()
  for (const row of tagLinksResult.data) {
    if (!txIds.has(row.transactionId)) continue
    const ids = tagMap.get(row.transactionId) ?? []
    ids.push(row.tagId)
    tagMap.set(row.transactionId, ids)
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
  for (const row of transfersResult.data) {
    if (txIds.has(row.fromTransactionId)) {
      transferMap.set(row.fromTransactionId, {
        transferId: row.toTransactionId,
        transferGroupId: row.id,
        relatedAccountId: row.toAccountId,
        conversionRate: row.conversionRate,
      })
    }
    if (txIds.has(row.toTransactionId)) {
      transferMap.set(row.toTransactionId, {
        transferId: row.fromTransactionId,
        transferGroupId: row.id,
        relatedAccountId: row.fromAccountId,
        conversionRate: row.conversionRate,
      })
    }
  }

  return {
    items: transactionsResult.data.map((row) => {
      const tf = transferMap.get(row.id)
      return {
        id: row.id,
        type: row.type as TransactionType,
        transactionDate: new Date(row.transactionDate),
        title: row.title,
        description: row.description,
        amount: row.amount,
        isDeleted: !!row.isDeleted,
        deletedAt: row.deletedAt ? new Date(row.deletedAt) : null,
        isPending: !!row.isPending,
        requiresManualConfirmation: !!row.requiresManualConfirmation,
        accountBalanceBefore: row.accountBalanceBefore,
        subtype: row.subtype as TransactionSubType,
        extra: parseExtra(row.extra, row.id),
        categoryId: row.categoryId,
        accountId: row.accountId,
        goalId: row.goalId,
        budgetId: row.budgetId,
        loanId: row.loanId,
        location: row.location,
        recurringId: row.recurringId,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        account: accountMap.get(row.accountId),
        category: row.categoryId ? categoryMap.get(row.categoryId) : undefined,
        isTransfer: !!tf,
        transferId: tf?.transferId ?? null,
        transferGroupId: tf?.transferGroupId ?? null,
        relatedAccountId: tf?.relatedAccountId ?? null,
        relatedAccount: tf ? accountMap.get(tf.relatedAccountId) : undefined,
        conversionRate: tf?.conversionRate ?? null,
        tagIds: tagMap.get(row.id) ?? [],
      }
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
