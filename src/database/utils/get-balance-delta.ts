import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"

/**
 * Compute the signed balance delta for a transaction.
 *
 * Rules:
 * - Income: amount is positive → delta = +amount
 * - Expense: amount is positive → delta = -amount
 * - Transfer: amount is pre-signed (debit negative, credit positive) → delta = amount
 *
 * This is the single source of truth for balance delta logic shared across
 * balance-service and transaction-service. Changes here propagate to both.
 */
export const getBalanceDelta = (
  amount: number,
  type: TransactionType,
): number => {
  if (__DEV__ && type === TransactionTypeEnum.TRANSFER && amount > 0) {
    // Transfer amounts must be pre-signed by the caller (debit row negative, credit row positive).
    // A positive amount on a transfer row indicates the sign contract was not applied upstream.
    logger.warn("[getBalanceDelta] Transfer amount should be pre-signed:", {
      amount,
    })
  }
  if (type === TransactionTypeEnum.INCOME) return amount
  if (type === TransactionTypeEnum.TRANSFER) return amount // signed amount on row
  return -amount // expense (money out of account)
}
