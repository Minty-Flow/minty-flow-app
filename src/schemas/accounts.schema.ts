import { z } from "zod"

import { AccountTypeEnum } from "~/types/accounts"

const accountFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.required.name")
    .max(50, "validation.tooLong.name"),
  type: z.enum(AccountTypeEnum),
  balance: z
    .number({ error: "validation.amount.invalid" })
    .int("validation.amount.invalid"),
  currencyCode: z
    .string()
    .min(1, "validation.required.currency")
    .max(6, "validation.required.currency"),
  icon: z.string().max(100).nullable().optional(),
  colorSchemeName: z.string().max(50).nullable().optional(),
  isPrimary: z.boolean().default(false),
  excludeFromBalance: z.boolean().default(false),
})

/** A new account cannot open below zero. */
const addAccountsSchema = accountFieldsSchema.refine(
  (data) => data.balance >= 0,
  {
    message: "validation.initialBalance.negative",
    path: ["balance"],
  },
)

/**
 * An existing account can be below zero (a credit card, an overdraft), so
 * editing one must not require a non-negative balance. Same shape as the add
 * schema, so the form types stay identical.
 */
const editAccountsSchema = accountFieldsSchema.refine(() => true)

export { addAccountsSchema, editAccountsSchema }
export type AddAccountsFormSchema = z.infer<typeof addAccountsSchema>
export type AddAccountsFormInput = z.input<typeof addAccountsSchema>
export type UpdateAccountsFormSchema = z.infer<typeof editAccountsSchema>
