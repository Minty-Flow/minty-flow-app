import { z } from "zod"

import { GoalTypeEnum } from "~/types/goals"

const addGoalSchema = z.object({
  goalType: z.enum(GoalTypeEnum),
  name: z
    .string()
    .trim()
    .min(1, "validation.required.name")
    .max(50, "validation.tooLong.name"),
  description: z.string().max(1000).nullable().optional(),
  icon: z.string().max(100).nullable().optional(),
  colorSchemeName: z.string().max(50).nullable().optional(),
  currencyCode: z
    .string()
    .min(1, "validation.required.currency")
    .max(6, "validation.required.currency"),
  accountIds: z.array(z.string()).min(1, "validation.required.accounts"),
  targetAmount: z.number().positive("validation.amount.targetPositive"),
  targetDate: z.number().nullable().optional(), // Unix timestamp
})

export { addGoalSchema }
export type AddGoalFormSchema = z.infer<typeof addGoalSchema>
export type UpdateGoalFormSchema = z.infer<typeof addGoalSchema>
