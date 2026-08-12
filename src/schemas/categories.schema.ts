import { z } from "zod"

import { CategoryTypeEnum } from "~/types/categories"

const addCategoriesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.required.name")
    .max(50, "validation.tooLong.name"),
  icon: z.string().max(100).nullable().optional(),
  colorSchemeName: z.string().max(50).nullable().optional(),
  type: z.enum(CategoryTypeEnum),
})

export { addCategoriesSchema }
export type AddCategoriesFormSchema = z.infer<typeof addCategoriesSchema>
export type UpdateCategoriesFormSchema = z.infer<typeof addCategoriesSchema>
