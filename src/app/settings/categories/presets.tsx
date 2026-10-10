import { useLocalSearchParams, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"

import { CategoryPresetsPicker } from "~/components/categories/category-presets-picker"
import { type CategoryType, CategoryTypeEnum } from "~/types/categories"

export default function CategoryPresetsScreen() {
  const params = useLocalSearchParams<{ type: CategoryType }>()
  const type = params.type || CategoryTypeEnum.EXPENSE
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <CategoryPresetsPicker
      key={type}
      type={type}
      preselectCore={false}
      requireSelection
      buttonLabel={(count) =>
        t("components.categories.presets.addSelected", { count })
      }
      onDone={() => router.back()}
    />
  )
}
