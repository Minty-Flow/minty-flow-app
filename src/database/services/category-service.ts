import { and, eq, inArray, sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  budgetCategories,
  budgets,
  categories,
  loans,
  transactions,
} from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import { clearCategoryFromRecurringTemplates } from "~/database/utils/recurring-template-refs"
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

export async function deleteCategoryById(id: string): Promise<void> {
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
    db.delete(categories).where(eq(categories.id, id)).run()
  })
}
