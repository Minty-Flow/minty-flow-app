import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
import { of } from "rxjs"
import { map, switchMap } from "rxjs/operators"

import type {
  AddGoalFormSchema,
  UpdateGoalFormSchema,
} from "~/schemas/goals.schema"
import type { Goal, GoalType } from "~/types/goals"

import { database } from "../index"
import type GoalModel from "../models/goal"
import type GoalAccountModel from "../models/goal-account"
import type TransactionModel from "../models/transaction"
import { modelToGoal } from "../utils/model-to-goal"

/**
 * Goal Service
 *
 * Provides functions for managing goal data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 *
 * Goals use a join table (goal_accounts) so accountIds are fetched
 * separately and merged at mapping time. Progress is derived from
 * the sum of linked account balances at read time.
 */

const getGoalCollection = () => database.get<GoalModel>("goals")

const getGoalAccountCollection = () =>
  database.get<GoalAccountModel>("goal_accounts")

/**
 * Observe account IDs for a goal reactively (for withObservables).
 */
export const observeAccountIdsForGoal = (
  goalId: string,
): Observable<string[]> =>
  getGoalAccountCollection()
    .query(Q.where("goal_id", goalId))
    .observe()
    .pipe(map((rows) => rows.map((r) => r.accountId)))

const GOAL_OBSERVED_COLUMNS = [
  "name",
  "description",
  "target_amount",
  "currency_code",
  "target_date",
  "icon",
  "color_scheme_name",
  "goal_type",
  "is_archived",
] as const

/**
 * Shared pipeline: merges join-table accountIds into each Goal domain object.
 */
const toGoalsObservable = (
  baseQuery: ReturnType<ReturnType<typeof getGoalCollection>["query"]>,
): Observable<Goal[]> =>
  baseQuery.observeWithColumns([...GOAL_OBSERVED_COLUMNS]).pipe(
    switchMap((goalModels) => {
      if (goalModels.length === 0) return of([])

      const goalIds = goalModels.map((m) => m.id)
      return getGoalAccountCollection()
        .query(Q.where("goal_id", Q.oneOf(goalIds)))
        .observe()
        .pipe(
          map((joinRows) => {
            const accountIdsByGoal = new Map<string, string[]>()
            for (const row of joinRows) {
              const existing = accountIdsByGoal.get(row.goalId) ?? []
              existing.push(row.accountId)
              accountIdsByGoal.set(row.goalId, existing)
            }
            return goalModels.map((model) =>
              modelToGoal(model, accountIdsByGoal.get(model.id) ?? []),
            )
          }),
        )
    }),
  )

/**
 * Observe active (non-archived) goals, sorted by name.
 */
export const observeGoals = (): Observable<Goal[]> =>
  toGoalsObservable(
    getGoalCollection().query(
      Q.where("is_archived", false),
      Q.sortBy("name", Q.asc),
    ),
  )

/**
 * Observe archived goals, sorted by name.
 */
export const observeArchivedGoals = (): Observable<Goal[]> =>
  toGoalsObservable(
    getGoalCollection().query(
      Q.where("is_archived", true),
      Q.sortBy("name", Q.asc),
    ),
  )

/**
 * Observe a single goal model by ID (raw model, for edit screens).
 */
export const observeGoalById = (id: string): Observable<GoalModel> =>
  getGoalCollection().findAndObserve(id)

/**
 * Create a new goal and its account associations in a single write.
 */
export const createGoal = async (
  data: AddGoalFormSchema,
): Promise<GoalModel> => {
  return database.write(async () => {
    const goal = await getGoalCollection().create((g) => {
      g.goalType = data.goalType ?? "savings"
      g.name = data.name
      g.description = data.description ?? null
      g.targetAmount = data.targetAmount
      g.currencyCode = data.currencyCode
      // WatermelonDB @date fields accept Date objects; schema stores as Unix ms
      g.targetDate = data.targetDate != null ? new Date(data.targetDate) : null
      g.icon = data.icon ?? null
      g.colorSchemeName = data.colorSchemeName ?? null
      g.isArchived = false
    })

    // Create one goal_account row per linked account
    for (const accountId of data.accountIds) {
      await getGoalAccountCollection().create((ga) => {
        ga.goalId = goal.id
        ga.accountId = accountId
      })
    }

    return goal
  })
}

/**
 * Update a goal's fields and, when accountIds changes, replace the join rows.
 */
export const updateGoal = async (
  goal: GoalModel,
  updates: Partial<UpdateGoalFormSchema>,
): Promise<GoalModel> => {
  return database.write(async () => {
    const updated = await goal.update((g) => {
      if (updates.goalType !== undefined) g.goalType = updates.goalType
      if (updates.name !== undefined) g.name = updates.name
      if (updates.description !== undefined)
        g.description = updates.description ?? null
      if (updates.targetAmount !== undefined)
        g.targetAmount = updates.targetAmount
      if (updates.currencyCode !== undefined)
        g.currencyCode = updates.currencyCode
      if (updates.targetDate !== undefined)
        g.targetDate =
          updates.targetDate != null ? new Date(updates.targetDate) : null
      if (updates.icon !== undefined) g.icon = updates.icon ?? null
      if (updates.colorSchemeName !== undefined)
        g.colorSchemeName = updates.colorSchemeName ?? null
    })

    if (updates.accountIds !== undefined) {
      // Replace all existing join rows with the new set
      const existing = await getGoalAccountCollection()
        .query(Q.where("goal_id", goal.id))
        .fetch()
      for (const row of existing) {
        await row.destroyPermanently()
      }
      for (const accountId of updates.accountIds) {
        await getGoalAccountCollection().create((ga) => {
          ga.goalId = goal.id
          ga.accountId = accountId
        })
      }
    }

    return updated
  })
}

/**
 * Archive a goal (hides it from the active list, shown in archived sheet).
 */
export const archiveGoal = async (goal: GoalModel): Promise<void> => {
  await database.write(async () => {
    await goal.update((g) => {
      g.isArchived = true
    })
  })
}

/**
 * Unarchive a goal (restores it to the active list).
 */
export const unarchiveGoal = async (goal: GoalModel): Promise<void> => {
  await database.write(async () => {
    await goal.update((g) => {
      g.isArchived = false
    })
  })
}

/**
 * Permanently delete a goal and its join rows in a single write.
 */
export const destroyGoal = async (goal: GoalModel): Promise<void> => {
  await database.write(async () => {
    const joinRows = await getGoalAccountCollection()
      .query(Q.where("goal_id", goal.id))
      .fetch()
    for (const row of joinRows) {
      await row.destroyPermanently()
    }
    await goal.destroyPermanently()
  })
}

/* ------------------------------------------------------------------ */
/* Transaction-based progress                                         */
/* ------------------------------------------------------------------ */

const getTransactionCollection = () =>
  database.get<TransactionModel>("transactions")

/**
 * Observe goal progress from linked transactions.
 * For savings goals: sums income transaction amounts.
 * For expense goals: sums expense transaction amounts.
 */
export const observeGoalTransactionProgress = (
  goalId: string,
  goalType: GoalType,
): Observable<number> => {
  const typeFilter = goalType === "expense" ? "expense" : "income"
  return getTransactionCollection()
    .query(
      Q.where("goal_id", goalId),
      Q.where("type", typeFilter),
      Q.where("is_deleted", false),
      Q.where("is_pending", false),
    )
    .observeWithColumns([
      "amount",
      "type",
      "is_deleted",
      "is_pending",
      "goal_id",
    ])
    .pipe(map((txs) => txs.reduce((sum, tx) => sum + tx.amount, 0)))
}

/**
 * Observe transactions linked to a goal (for goal detail page).
 */
export const observeGoalTransactions = (
  goalId: string,
): Observable<TransactionModel[]> =>
  getTransactionCollection()
    .query(
      Q.where("goal_id", goalId),
      Q.where("is_deleted", false),
      Q.sortBy("transaction_date", Q.desc),
    )
    .observeWithColumns([
      "title",
      "transaction_date",
      "amount",
      "type",
      "is_deleted",
      "goal_id",
    ])

/**
 * Observe active goals filtered by goal type (for transaction form picker).
 * Maps income transactions → savings goals, expense transactions → expense goals.
 */
export const observeGoalsByType = (goalType: GoalType): Observable<Goal[]> =>
  toGoalsObservable(
    getGoalCollection().query(
      Q.where("is_archived", false),
      Q.where("goal_type", goalType),
      Q.sortBy("name", Q.asc),
    ),
  )
