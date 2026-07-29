import {
  TransactionSubTypeEnum,
  type TransactionType,
  TransactionTypeEnum,
} from "~/types/transactions"
import { assertMinorUnits } from "~/utils/money"

/**
 * Compute the signed balance delta for a transaction.
 *
 * Single source of truth for all balance-delta logic. Every part of the
 * codebase that needs a balance delta must call this function.
 *
 * | Type    | Subtype       | Delta     |
 * |---------|---------------|-----------|
 * | income  | any           | +amount   |
 * | expense | refund        | +amount   | ← stored as expense, increases balance
 * | expense | other         | −amount   |
 * | transfer| (pre-signed)  | amount    |
 *
 * Transfer rows carry pre-signed amounts: the debit row has a negative amount
 * and the credit row has a positive amount. Return the stored signed amount as
 * is for transfer rows.
 *
 * @param amount  - The raw `amount` column value. Always positive for
 *                  income/expense; pre-signed for transfers.
 * @param type    - The transaction type (`income`, `expense`, or `transfer`).
 * @param subtype - The transaction subtype, used to detect the refund override.
 * @returns The signed number to add to the account balance.
 */
export const getBalanceDelta = (
  amount: number,
  type: TransactionType,
  subtype?: string | null,
): number => {
  assertMinorUnits(amount)

  if (type === TransactionTypeEnum.INCOME) return amount
  if (type === TransactionTypeEnum.TRANSFER) return amount // signed amount on row

  // Expense path: refunds increase the balance even though stored as expense.
  if (subtype === TransactionSubTypeEnum.REFUND) return amount
  return -amount
}
