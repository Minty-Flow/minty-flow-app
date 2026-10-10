import { useTranslation } from "react-i18next"

import { OnboardingCategoriesStep } from "~/components/categories/onboarding-categories-step"
import { CategoryTypeEnum } from "~/types/categories"

export default function OnboardingIncomeCategoriesScreen() {
  const { t } = useTranslation()
  return (
    <OnboardingCategoriesStep
      type={CategoryTypeEnum.INCOME}
      subtitle={t("onboarding.incomeCategories.subtitle")}
      next="/settings/edit-profile?fromOnboarding=true"
    />
  )
}
