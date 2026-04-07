import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
import { startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { combineLatest, of } from "rxjs"
import { map } from "rxjs/operators"

import type {
  AddBudgetFormSchema,
  UpdateBudgetFormSchema,
} from "~/schemas/budgets.schema"
import type { Budget, BudgetPeriod } from "~/types/budgets"
import { BudgetPeriodEnum } from "~/types/budgets"

import { database } from "../index"
import type BudgetModel from "../models/budget"
import type BudgetAccountModel from "../models/budget-account"
import type BudgetCategoryModel from "../models/budget-category"
import type TransactionModel from "../models/transaction"
import { modelToBudget } from "../utils/model-to-budget"

/**
 * Budget Service
 *
 * Provides functions for managing budget data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 *
 * Budgets use a join table (budget_accounts) so accountIds are fetched
 * separately and merged at mapping time.
 */

const getBudgetCollection = () => database.get<BudgetModel>("budgets")

const getBudgetAccountCollection = () =>
  database.get<BudgetAccountModel>("budget_accounts")

const getBudgetCategoryCollection = () =>
  database.get<BudgetCategoryModel>("budget_categories")

const getTransactionCollection = () =>
  database.get<TransactionModel>("transactions")

/**
 * Observe account IDs for a budget reactively (for withObservables).
 */
export const observeAccountIdsForBudget = (
  budgetId: string,
): Observable<string[]> =>
  getBudgetAccountCollection()
    .query(Q.where("budget_id", budgetId))
    .observe()
    .pipe(map((rows) => rows.map((r) => r.accountId)))

/**
 * Observe category IDs for a budget reactively (for withObservables).
 */
export const observeCategoryIdsForBudget = (
  budgetId: string,
): Observable<string[]> =>
  getBudgetCategoryCollection()
    .query(Q.where("budget_id", budgetId))
    .observe()
    .pipe(map((rows) => rows.map((r) => r.categoryId)))

/**
 * Observe all budgets, optionally including archived ones.
 *
 * Uses observeWithColumns so the list reacts to field changes, not just
 * record additions/deletions. Because accountIds live in a separate join
 * table, each emission fetches budget_account rows and groups them by
 * budget_id before mapping to plain Budget objects.
 *
 * Join-row observation note: budget_accounts and budget_categories are
 * observed globally (not per-budget), so any join-row change re-maps all
 * budgets. This is intentional: at personal-finance scale (< 20 budgets,
 * < 100 total join rows) the single-pass Map grouping is negligible. If
 * budget counts grow to hundreds, scope the join observables per-budget
 * using withObservables from @nozbe/with-observables.
 */
export const observeBudgets = (): Observable<Budget[]> => {
  const query = getBudgetCollection().query(Q.sortBy("name", Q.asc))
  const accountJoinRows$ = getBudgetAccountCollection().query().observe()
  const categoryJoinRows$ = getBudgetCategoryCollection().query().observe()

  return combineLatest([
    query.observeWithColumns([
      "name",
      "amount",
      "currency_code",
      "period",
      "start_date",
      "end_date",
      "alert_threshold",
      "is_active",
      "icon",
      "color_scheme_name",
    ]),
    accountJoinRows$,
    categoryJoinRows$,
  ]).pipe(
    map(([models, accountRows, categoryRows]) => {
      if (models.length === 0) return []

      const accountIdsByBudget = new Map<string, string[]>()
      for (const row of accountRows) {
        const existing = accountIdsByBudget.get(row.budgetId) ?? []
        existing.push(row.accountId)
        accountIdsByBudget.set(row.budgetId, existing)
      }

      const categoriesByBudget = new Map<string, string[]>()
      for (const row of categoryRows) {
        const arr = categoriesByBudget.get(row.budgetId) ?? []
        arr.push(row.categoryId)
        categoriesByBudget.set(row.budgetId, arr)
      }

      const budgets = models.map((m) =>
        modelToBudget(
          m,
          accountIdsByBudget.get(m.id) ?? [],
          categoriesByBudget.get(m.id) ?? [],
        ),
      )

      return budgets.sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
        return a.name.localeCompare(b.name)
      })
    }),
  )
}

/**
 * Observe a single budget model by ID (raw model, for edit screens).
 */
export const observeBudgetById = (id: string): Observable<BudgetModel> =>
  getBudgetCollection().findAndObserve(id)

/**
 * Create a new budget and its account associations in a single write.
 */
export const createBudget = async (
  data: AddBudgetFormSchema,
): Promise<BudgetModel> => {
  return database.write(async () => {
    const budget = await getBudgetCollection().create((b) => {
      b.name = data.name
      b.amount = data.amount
      b.currencyCode = data.currencyCode
      b.period = data.period
      // WatermelonDB @date fields accept Date objects; schema stores as Unix ms
      b.startDate = new Date(data.startDate)
      b.endDate = data.endDate != null ? new Date(data.endDate) : null
      b.alertThreshold = data.alertThreshold ?? null
      b.isActive = data.isActive ?? true
      b.icon = data.icon ?? null
      b.colorSchemeName = data.colorSchemeName ?? null
    })

    // Create one budget_account row per linked account
    for (const accountId of data.accountIds) {
      await getBudgetAccountCollection().create((ba) => {
        ba.budgetId = budget.id
        ba.accountId = accountId
      })
    }

    for (const categoryId of data.categoryIds) {
      await getBudgetCategoryCollection().create((bc) => {
        bc.budgetId = budget.id
        bc.categoryId = categoryId
      })
    }

    return budget
  })
}

/**
 * Update a budget's fields and, when accountIds changes, replace the join rows.
 */
export const updateBudget = async (
  budget: BudgetModel,
  updates: Partial<UpdateBudgetFormSchema>,
): Promise<BudgetModel> => {
  return database.write(async () => {
    const updated = await budget.update((b) => {
      if (updates.name !== undefined) b.name = updates.name
      if (updates.amount !== undefined) b.amount = updates.amount
      if (updates.currencyCode !== undefined)
        b.currencyCode = updates.currencyCode
      if (updates.period !== undefined) b.period = updates.period
      if (updates.startDate !== undefined)
        b.startDate = new Date(updates.startDate)
      if (updates.endDate !== undefined)
        b.endDate = updates.endDate != null ? new Date(updates.endDate) : null
      if (updates.alertThreshold !== undefined)
        b.alertThreshold = updates.alertThreshold ?? null
      if (updates.isActive !== undefined) b.isActive = updates.isActive
      if (updates.icon !== undefined) b.icon = updates.icon ?? null
      if (updates.colorSchemeName !== undefined)
        b.colorSchemeName = updates.colorSchemeName ?? null
    })

    if (updates.accountIds !== undefined) {
      // Replace all existing join rows with the new set
      const existing = await getBudgetAccountCollection()
        .query(Q.where("budget_id", budget.id))
        .fetch()
      for (const row of existing) {
        await row.destroyPermanently()
      }
      for (const accountId of updates.accountIds) {
        await getBudgetAccountCollection().create((ba) => {
          ba.budgetId = budget.id
          ba.accountId = accountId
        })
      }
    }

    if (updates.categoryIds !== undefined) {
      const existingCats = await getBudgetCategoryCollection()
        .query(Q.where("budget_id", budget.id))
        .fetch()
      for (const row of existingCats) {
        await row.destroyPermanently()
      }
      for (const categoryId of updates.categoryIds) {
        await getBudgetCategoryCollection().create((bc) => {
          bc.budgetId = budget.id
          bc.categoryId = categoryId
        })
      }
    }

    return updated
  })
}

/**
 * Permanently delete a budget and its join rows in a single write.
 */
export const destroyBudget = async (budget: BudgetModel): Promise<void> => {
  await database.write(async () => {
    const accountJoinRows = await getBudgetAccountCollection()
      .query(Q.where("budget_id", budget.id))
      .fetch()
    for (const row of accountJoinRows) {
      await row.destroyPermanently()
    }
    const categoryJoinRows = await getBudgetCategoryCollection()
      .query(Q.where("budget_id", budget.id))
      .fetch()
    for (const row of categoryJoinRows) {
      await row.destroyPermanently()
    }
    await budget.destroyPermanently()
  })
}

/**
 * Duplicate a budget, creating a new record with identical settings.
 *
 * The duplicate's name is prefixed with "Copy of " and isActive is set to
 * true regardless of the source budget's active state. All linked account
 * and category join rows are re-created for the new budget ID.
 */
export const duplicateBudget = async (budget: Budget): Promise<void> => {
  await database.write(async () => {
    const newBudget = await getBudgetCollection().create((b) => {
      b.name = `Copy of ${budget.name}`
      b.amount = budget.amount
      b.currencyCode = budget.currencyCode
      b.period = budget.period
      b.startDate = budget.startDate
      b.endDate = budget.endDate
      b.alertThreshold = budget.alertThreshold
      // Duplicates are always active so they appear at the top of the list
      b.isActive = true
      b.icon = budget.icon
      b.colorSchemeName = budget.colorSchemeName
    })

    for (const accountId of budget.accountIds) {
      await getBudgetAccountCollection().create((ba) => {
        ba.budgetId = newBudget.id
        ba.accountId = accountId
      })
    }

    for (const categoryId of budget.categoryIds) {
      await getBudgetCategoryCollection().create((bc) => {
        bc.budgetId = newBudget.id
        bc.categoryId = categoryId
      })
    }
  })
}

/**
 * Compute the period range for a budget based on its period type.
 */
const getBudgetPeriodRange = (
  period: BudgetPeriod,
  startDate: number,
  endDate?: number | null,
): { periodStartTs: number; periodEndTs: number } => {
  const now = new Date()
  let periodStart: Date
  let periodEnd: Date = now

  switch (period) {
    case BudgetPeriodEnum.DAILY:
      periodStart = startOfDay(now)
      break
    case BudgetPeriodEnum.WEEKLY:
      periodStart = startOfWeek(now)
      break
    case BudgetPeriodEnum.MONTHLY:
      periodStart = startOfMonth(now)
      break
    case BudgetPeriodEnum.YEARLY:
      periodStart = startOfYear(now)
      break
    default:
      periodStart = new Date(startDate)
      if (endDate != null) {
        periodEnd = new Date(endDate)
      }
      break
  }

  return {
    periodStartTs: periodStart.getTime(),
    periodEndTs: periodEnd.getTime(),
  }
}

/**
 * Build the common query conditions for budget transaction queries.
 */
const buildBudgetTransactionConditions = (
  accountIds: string[],
  categoryIds: string[],
  periodStartTs: number,
  periodEndTs: number,
) => {
  const conditions = [
    Q.where("is_deleted", false),
    Q.where("is_pending", false),
    Q.where("type", "expense"),
    Q.where("is_transfer", false),
    Q.where("account_id", Q.oneOf(accountIds)),
    Q.where("transaction_date", Q.gte(periodStartTs)),
    Q.where("transaction_date", Q.lte(periodEndTs)),
  ]

  if (categoryIds.length > 0) {
    conditions.push(Q.where("category_id", Q.oneOf(categoryIds)))
  }

  return conditions
}

/**
 * Observe the total amount spent against a budget for the relevant period.
 */
export const observeBudgetSpent = (
  accountIds: string[],
  categoryIds: string[],
  period: BudgetPeriod,
  startDate: number,
  endDate?: number | null,
): Observable<number> => {
  if (accountIds.length === 0) return of(0)

  const { periodStartTs, periodEndTs } = getBudgetPeriodRange(
    period,
    startDate,
    endDate,
  )

  const conditions = buildBudgetTransactionConditions(
    accountIds,
    categoryIds,
    periodStartTs,
    periodEndTs,
  )

  return getTransactionCollection()
    .query(...conditions)
    .observe()
    .pipe(map((rows) => rows.reduce((sum, t) => sum + t.amount, 0)))
}

/**
 * Observe the transactions that count against a budget for the relevant period.
 * Returns TransactionModel[] sorted by date desc.
 */
export const observeBudgetTransactions = (
  accountIds: string[],
  categoryIds: string[],
  period: BudgetPeriod,
  startDate: number,
  endDate?: number | null,
): Observable<TransactionModel[]> => {
  if (accountIds.length === 0) return of([] as TransactionModel[])

  const { periodStartTs, periodEndTs } = getBudgetPeriodRange(
    period,
    startDate,
    endDate,
  )

  const conditions = buildBudgetTransactionConditions(
    accountIds,
    categoryIds,
    periodStartTs,
    periodEndTs,
  )

  return getTransactionCollection()
    .query(...conditions, Q.sortBy("transaction_date", Q.desc))
    .observe()
}
