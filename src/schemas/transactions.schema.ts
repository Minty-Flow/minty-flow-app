import { z } from "zod"

import { TransactionTypeEnum } from "~/types/transactions"

export const transactionSchema = z.object({
  amount: z.number().gt(0, "validation.transaction.amount.zero"),
  type: z.enum(TransactionTypeEnum),
  transactionDate: z.date(),
  accountId: z.string().min(1, "validation.transaction.account.required"),
  /** When type is transfer: destination account (required for transfer). */
  toAccountId: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  title: z.string().max(255).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  isPending: z.boolean().default(false),
  requiresManualConfirmation: z.boolean().nullable().optional(),
  tags: z.array(z.string()).default([]),
  goalId: z.string().nullable().optional(),
  budgetId: z.string().nullable().optional(),
  loanId: z.string().nullable().optional(),
  recurringId: z.string().nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  extra: z.record(z.string(), z.string()).nullable().optional(),
  subtype: z.string().nullable().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
export type RecurringEditPayload = z.infer<typeof transactionSchema>

/* ------------------------------------------------------------------ */
/* Transfer (create / edit) — single source of truth for form & service */
/* ------------------------------------------------------------------ */

const dateOrNumber = z.union([z.number(), z.date()])

const createTransferParamsSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.number().gt(0),
  /** When from/to accounts have different currencies: rate (toCurrency per 1 fromCurrency). Credit amount = amount * conversionRate. */
  conversionRate: z.number().gt(0).optional(),
  transactionDate: dateOrNumber.optional(),
  title: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type CreateTransferParams = z.infer<typeof createTransferParamsSchema>

const editTransferFieldsSchema = z.object({
  amount: z.number().gt(0).optional(),
  /** When from/to have different currencies: rate (toCurrency per 1 fromCurrency). Credit amount = amount * conversionRate. */
  conversionRate: z.number().gt(0).optional(),
  transactionDate: dateOrNumber.optional(),
  title: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  fromAccountId: z.string().min(1).optional(),
  toAccountId: z.string().min(1).optional(),
})

export type EditTransferFields = z.infer<typeof editTransferFieldsSchema>
