import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"

import { logger } from "~/utils/logger"

import migrations from "./migrations"
import AccountModel from "./models/account"
import BudgetModel from "./models/budget"
import BudgetAccountModel from "./models/budget-account"
import BudgetCategoryModel from "./models/budget-category"
import CategoryModel from "./models/category"
import GoalModel from "./models/goal"
import GoalAccountModel from "./models/goal-account"
import LoanModel from "./models/loan"
import RecurringTransactionModel from "./models/recurring-transaction"
import TagModel from "./models/tag"
import TransactionModel from "./models/transaction"
import TransactionTagModel from "./models/transaction-tag"
import TransferModel from "./models/transfer"
import { schema } from "./schema"

/**
 * SQLite adapter configuration for WatermelonDB.
 *
 * Uses JSI (JavaScript Interface) for better performance on React Native.
 * JSI enables synchronous database operations without the bridge overhead.
 */
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: "minty_flow_db",
  jsi: true, // Use JSI for better performance (React Native only)
  onSetUpError: (error) => {
    logger.error("Database setup error — app data may be unavailable", {
      error: error instanceof Error ? error.message : String(error),
    })
  },
})

/**
 * Database instance.
 *
 * This is the main database connection that should be used throughout the app.
 * All model classes must be registered here.
 *
 * WatermelonDB is ready to use immediately after creation - no initialization needed.
 * The database will be created automatically when first accessed.
 */
export const database = new Database({
  adapter,
  modelClasses: [
    AccountModel,
    BudgetAccountModel,
    BudgetCategoryModel,
    BudgetModel,
    CategoryModel,
    GoalAccountModel,
    GoalModel,
    LoanModel,
    RecurringTransactionModel,
    TagModel,
    TransactionModel,
    TransactionTagModel,
    TransferModel,
  ],
})
