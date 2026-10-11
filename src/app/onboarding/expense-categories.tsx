import { useTranslation } from "react-i18next"

import { OnboardingCategoriesStep } from "~/components/categories/onboarding-categories-step"
import { CategoryTypeEnum } from "~/types/categories"

export default function OnboardingExpenseCategoriesScreen() {
  const { t } = useTranslation()
  return (
    <OnboardingCategoriesStep
      type={CategoryTypeEnum.EXPENSE}
      subtitle={t("onboarding.expenseCategories.subtitle")}
      next="/onboarding/income-categories"
    />
  )
}
