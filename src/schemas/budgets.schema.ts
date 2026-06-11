import { z } from "zod"

import type { BudgetPeriod } from "~/types/budgets"
import { BudgetPeriodEnum } from "~/types/budgets"

const addBudgetSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "validation.required.name")
      .max(50, "validation.tooLong.name"),
    icon: z.string().max(100).nullable().optional(),
    colorSchemeName: z.string().max(50).nullable().optional(),
    currencyCode: z
      .string()
      .min(1, "validation.required.currency")
      .max(6, "validation.required.currency"),
    accountIds: z.array(z.string()).min(1, "validation.required.accounts"),
    amount: z.number().positive("validation.amount.positive"),
    period: z.enum(
      Object.values(BudgetPeriodEnum) as [BudgetPeriod, ...BudgetPeriod[]],
    ),
    startDate: z.number(),
    endDate: z.number().nullable().optional(),
    categoryIds: z.array(z.string()).min(1, "validation.required.categories"),
    alertThreshold: z.number().min(1).max(100).nullable().optional(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.period === BudgetPeriodEnum.CUSTOM && data.endDate == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validation.endDate.requiredForCustom",
        path: ["endDate"],
      })
    }
  })

export { addBudgetSchema }
export type AddBudgetFormSchema = z.infer<typeof addBudgetSchema>
export type UpdateBudgetFormSchema = z.infer<typeof addBudgetSchema>
