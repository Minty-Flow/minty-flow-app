import { and, eq, inArray, isNotNull, notInArray, sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  budgetCategories,
  budgets,
  categories,
  loans,
  transactions,
} from "~/database/drizzle/schema"
import { type DbTransaction, runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import {
  clearCategoryFromRecurringTemplates,
  countRecurringTemplatesUsingCategory,
  moveCategoryInRecurringTemplates,
} from "~/database/utils/recurring-template-refs"
import type {
  AddCategoriesFormSchema,
  UpdateCategoriesFormSchema,
} from "~/schemas/categories.schema"

export async function createCategory(
  data: AddCategoriesFormSchema,
): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("category.create", (db) => {
    db.insert(categories)
      .values({
        id,
        name: data.name,
        type: data.type,
        icon: data.icon ?? null,
        colorSchemeName: data.colorSchemeName ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  })
  return id
}

export async function updateCategoryById(
  id: string,
  data: Partial<UpdateCategoriesFormSchema>,
): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("category.update", (db) => {
    db.update(categories)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
        ...(data.colorSchemeName !== undefined
          ? { colorSchemeName: data.colorSchemeName ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(categories.id, id))
      .run()
  })
}

/**
 * Active budgets whose only category is `categoryId`. A budget needs at least
 * one category and the cascade on `budget_categories` removes the link when
 * the category goes, so deleting the category would leave these with none.
 */
const losesLastCategory = (categoryId: string) =>
  and(
    eq(budgets.isActive, 1),
    inArray(
      budgets.id,
      drizzleDb
        .select({ id: budgetCategories.budgetId })
        .from(budgetCategories)
        .where(eq(budgetCategories.categoryId, categoryId)),
    ),
    sql`NOT EXISTS (
      SELECT 1 FROM ${budgetCategories}
      WHERE ${budgetCategories.budgetId} = ${budgets.id}
        AND ${budgetCategories.categoryId} <> ${categoryId}
    )`,
  )

export interface BudgetLosingLastCategory {
  id: string
  name: string
}

/**
 * The active budgets that deleting `categoryId` would switch off. The delete
 * confirmation warns about these before `deleteCategoryById` runs.
 */
export async function getBudgetsLosingLastCategory(
  categoryId: string,
): Promise<BudgetLosingLastCategory[]> {
  return drizzleDb
    .select({ id: budgets.id, name: budgets.name })
    .from(budgets)
    .where(losesLastCategory(categoryId))
    .orderBy(budgets.name)
    .all()
}

/**
 * Thrown by {@link deleteCategoryById} when a loan still uses the category. A
 * loan must have a category, so deleting it would leave the loan without one.
 */
export class CategoryHasLoansError extends Error {
  readonly loanNames: string[]

  constructor(loanNames: string[]) {
    super(
      `Category is used by ${loanNames.length} loan(s): ${loanNames.join(", ")}`,
    )
    this.name = "CategoryHasLoansError"
    this.loanNames = loanNames
  }
}

/** Names of the loans that use `categoryId`, which block deleting it. */
export async function getLoansUsingCategory(
  categoryId: string,
): Promise<string[]> {
  return drizzleDb
    .select({ name: loans.name })
    .from(loans)
    .where(eq(loans.categoryId, categoryId))
    .orderBy(loans.name)
    .all()
    .map((loan) => loan.name)
}

/** What deleting a category touches, shown before the user confirms. */
export interface CategoryDeleteImpact {
  /** Transactions of the category, trashed ones included. */
  transactionCount: number
  recurringRuleCount: number
}

export async function getCategoryDeleteImpact(
  categoryId: string,
): Promise<CategoryDeleteImpact> {
  const transactionCount =
    drizzleDb
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.categoryId, categoryId))
      .get()?.count ?? 0
  return {
    transactionCount,
    recurringRuleCount: countRecurringTemplatesUsingCategory(
      drizzleDb,
      categoryId,
    ),
  }
}

/** Why a category cannot take over another category's transactions. */
export type CategoryMoveTargetReason =
  | "same-category"
  | "not-found"
  | "type-mismatch"

/**
 * Thrown by {@link deleteCategoryById} when the category to move to is not
 * valid. The service checks it so the rule holds whatever the UI offers.
 */
export class CategoryMoveTargetError extends Error {
  readonly reason: CategoryMoveTargetReason

  constructor(reason: CategoryMoveTargetReason) {
    super(`Cannot move transactions to this category: ${reason}`)
    this.name = "CategoryMoveTargetError"
    this.reason = reason
  }
}

export interface DeleteCategoryOptions {
  /**
   * Give the category's transactions, recurring rules and budget links to this
   * category instead of leaving the transactions uncategorized. It must exist
   * and have the same type.
   */
  moveToCategoryId?: string
}

export async function deleteCategoryById(
  id: string,
  options: DeleteCategoryOptions = {},
): Promise<void> {
  const targetId = options.moveToCategoryId
  await runInTransaction("category.delete", (db) => {
    const categoryLoans = db
      .select({ name: loans.name })
      .from(loans)
      .where(eq(loans.categoryId, id))
      .orderBy(loans.name)
      .all()
    if (categoryLoans.length > 0) {
      throw new CategoryHasLoansError(categoryLoans.map((loan) => loan.name))
    }
    if (targetId !== undefined) {
      moveCategoryContents(db, id, targetId)
    } else {
      // Switch off the budgets that would be left with no category. Do it
      // before the delete: the cascade removes the links.
      db.update(budgets)
        .set({ isActive: 0, updatedAt: new Date().toISOString() })
        .where(losesLastCategory(id))
        .run()
      // A budget picks its transactions by category, and the transaction form
      // only offers a budget whose categories include the transaction's, so an
      // uncategorized transaction cannot keep its budget either.
      db.update(transactions)
        .set({
          categoryId: null,
          budgetId: null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(transactions.categoryId, id))
        .run()
      clearCategoryFromRecurringTemplates(db, id)
    }
    db.delete(categories).where(eq(categories.id, id)).run()
  })
}

/**
 * Hand a category's transactions, recurring rules and budget links to
 * `targetId`. Runs inside the delete transaction, before the category row goes.
 */
function moveCategoryContents(
  db: DbTransaction,
  id: string,
  targetId: string,
): void {
  if (targetId === id) throw new CategoryMoveTargetError("same-category")
  const source = db
    .select({ type: categories.type })
    .from(categories)
    .where(eq(categories.id, id))
    .get()
  const target = db
    .select({ type: categories.type })
    .from(categories)
    .where(eq(categories.id, targetId))
    .get()
  if (!target || !source) throw new CategoryMoveTargetError("not-found")
  if (target.type !== source.type) {
    throw new CategoryMoveTargetError("type-mismatch")
  }

  // A budget whose only category is the deleted one takes the target. Any
  // other budget simply loses the link through the cascade.
  const onlyCategoryBudgets = db
    .select({ id: budgetCategories.budgetId })
    .from(budgetCategories)
    .where(
      and(
        eq(budgetCategories.categoryId, id),
        sql`NOT EXISTS (
          SELECT 1 FROM ${budgetCategories} AS other
          WHERE other.budget_id = ${budgetCategories.budgetId}
            AND other.category_id <> ${id}
        )`,
      ),
    )
    .all()
    .map((row) => row.id)
  if (onlyCategoryBudgets.length > 0) {
    db.update(budgetCategories)
      .set({ categoryId: targetId })
      .where(
        and(
          eq(budgetCategories.categoryId, id),
          inArray(budgetCategories.budgetId, onlyCategoryBudgets),
        ),
      )
      .run()
  }

  // A transaction keeps its budget only when that budget includes the new
  // category (the transaction form offers no other).
  const now = new Date().toISOString()
  db.update(transactions)
    .set({ budgetId: null, updatedAt: now })
    .where(
      and(
        eq(transactions.categoryId, id),
        isNotNull(transactions.budgetId),
        notInArray(
          transactions.budgetId,
          db
            .select({ budgetId: budgetCategories.budgetId })
            .from(budgetCategories)
            .where(eq(budgetCategories.categoryId, targetId)),
        ),
      ),
    )
    .run()
  db.update(transactions)
    .set({ categoryId: targetId, updatedAt: now })
    .where(eq(transactions.categoryId, id))
    .run()
  moveCategoryInRecurringTemplates(db, id, targetId)
}
