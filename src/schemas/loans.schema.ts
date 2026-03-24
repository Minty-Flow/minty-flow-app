import { z } from "zod"

import { LoanTypeEnum } from "~/types/loans"

const addLoanSchema = z.object({
  name: z.string().min(1, "validation.loan.name.required"),
  loanType: z.enum([LoanTypeEnum.BORROWED, LoanTypeEnum.LENT]),
  accountId: z.string().min(1, "validation.loan.account.required"),
  categoryId: z.string().min(1, "validation.loan.category.required"),
  principalAmount: z.number().positive("validation.loan.amount.positive"),
  description: z.string().nullable().optional(),
  dueDate: z.number().nullable().optional(), // Unix timestamp
  icon: z.string().nullable().optional(),
  colorSchemeName: z.string().nullable().optional(),
})

export { addLoanSchema }
export type LoanFormValues = z.infer<typeof addLoanSchema>
export type AddLoanFormSchema = z.infer<typeof addLoanSchema>
