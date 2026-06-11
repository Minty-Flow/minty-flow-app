import { z } from "zod"

import { TagKindEnum } from "~/types/tags"

const addTagsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.required.name")
    .max(50, "validation.tooLong.name"),
  type: z.enum(TagKindEnum),
  icon: z.string().max(100).nullable().optional(),
  colorSchemeName: z.string().max(50).nullable().optional(),
})

export { addTagsSchema }
export type AddTagsFormSchema = z.infer<typeof addTagsSchema>
