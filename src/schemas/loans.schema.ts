import { z } from "zod"

import { LoanTypeEnum } from "~/types/loans"

const addLoanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.required.name")
    .max(50, "validation.tooLong.name"),
  loanType: z.enum(LoanTypeEnum),
  accountId: z.string().min(1, "validation.required.account"),
  categoryId: z.string().min(1, "validation.required.category"),
  principalAmount: z.number().positive("validation.amount.positive"),
  description: z.string().max(1000).nullable().optional(),
  dueDate: z.number().nullable().optional(),
  icon: z.string().max(100).nullable().optional(),
  colorSchemeName: z.string().max(50).nullable().optional(),
})

export { addLoanSchema }
export type AddLoanFormSchema = z.infer<typeof addLoanSchema>
