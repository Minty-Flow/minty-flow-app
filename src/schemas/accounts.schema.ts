import { z } from "zod"

import { AccountTypeEnum } from "~/types/accounts"

const addAccountsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "validation.required.name")
      .max(50, "validation.tooLong.name"),
    type: z.enum(AccountTypeEnum),
    balance: z.number({
      error: "validation.amount.invalid",
    }),
    currencyCode: z
      .string()
      .min(1, "validation.required.currency")
      .max(6, "validation.required.currency"),
    icon: z.string().max(100).nullable().optional(),
    colorSchemeName: z.string().max(50).nullable().optional(),
    isPrimary: z.boolean().default(false),
    excludeFromBalance: z.boolean().default(false),
  })
  .refine((data) => data.balance >= 0, {
    message: "validation.initialBalance.negative",
    path: ["balance"],
  })

export { addAccountsSchema }
export type AddAccountsFormSchema = z.infer<typeof addAccountsSchema>
export type AddAccountsFormInput = z.input<typeof addAccountsSchema>
export type UpdateAccountsFormSchema = z.infer<typeof addAccountsSchema>
