import { z } from "zod"

const addTagsSchema = z.object({
  name: z
    .string()
    .min(1, "validation.tag.name.required")
    .max(50, "validation.tag.name.tooLong"),
  type: z.enum(["generic", "location", "contact"]),
  icon: z.string().nullable().optional(),
  colorSchemeName: z.string().nullable().optional(),
})

export { addTagsSchema }
export type AddTagsFormSchema = z.infer<typeof addTagsSchema>
