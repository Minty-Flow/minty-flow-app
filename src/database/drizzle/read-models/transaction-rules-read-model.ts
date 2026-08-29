import { asc } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import type {
  RuleMatchField,
  RuleMatchType,
  TransactionRule,
} from "~/types/transaction-rules"

import { drizzleDb } from "../db"
import { transactionRules } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

function parseTagIds(raw: string | null): string[] | null {
  if (!raw) return null
  try {
    const arr = JSON.parse(raw) as unknown
    return Array.isArray(arr) ? (arr as string[]) : null
  } catch {
    return null
  }
}

export function useTransactionRulesQuery(): LiveReadModelResult<
  TransactionRule[]
> {
  const result = useLiveQuery(
    drizzleDb
      .select()
      .from(transactionRules)
      .orderBy(asc(transactionRules.priority)),
  )

  const data: TransactionRule[] = result.data.map((row) => ({
    id: row.id,
    matchField: row.matchField as RuleMatchField,
    matchType: row.matchType as RuleMatchType,
    matchValue: row.matchValue,
    setCategoryId: row.setCategoryId,
    setSubtype: row.setSubtype,
    setTagIds: parseTagIds(row.setTagIds),
    priority: row.priority,
    isActive: !!row.isActive,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }))

  return createLiveReadModelResult(data, [result])
}

export function useTransactionRules(): TransactionRule[] {
  return useTransactionRulesQuery().data
}
