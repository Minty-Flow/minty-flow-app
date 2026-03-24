import { z } from "zod"

import { AccountTypeEnum } from "~/types/accounts"

const addAccountsSchema = z
  .object({
    name: z
      .string()
      .min(1, "validation.account.name.required")
      .max(50, "validation.account.name.tooLong"),
    type: z.enum(AccountTypeEnum),
    balance: z.number({
      error: "validation.account.initialBalance.invalid",
    }),
    currencyCode: z
      .string()
      .min(3, "validation.account.currency.required")
      .max(3, "validation.account.currency.required"),
    icon: z.string().nullable().optional(),
    colorSchemeName: z.string().nullable().optional(),
    isPrimary: z.boolean().default(false),
    excludeFromBalance: z.boolean().default(false),
  })
  .refine((data) => data.balance >= 0, {
    message: "validation.account.initialBalance.negative",
    path: ["balance"],
  })

const updateAccountsSchema = addAccountsSchema

export { addAccountsSchema, updateAccountsSchema }
export type AddAccountsFormSchema = z.infer<typeof addAccountsSchema>
export type AddAccountsFormInput = z.input<typeof addAccountsSchema>
export type UpdateAccountsFormSchema = z.infer<typeof updateAccountsSchema>
