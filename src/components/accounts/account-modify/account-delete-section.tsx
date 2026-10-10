import { useTranslation } from "react-i18next"

import { FormDeleteButton } from "~/components/modify-form/form-fields"
import { modifyFormStyles } from "~/components/modify-form/modify-form.styles"
import { View } from "~/components/ui/view"
import type { Account } from "~/types/accounts"

interface AccountDeleteSectionProps {
  account: Account | undefined
  onDeletePress: () => void
}

export function AccountDeleteSection({
  account,
  onDeletePress,
}: AccountDeleteSectionProps) {
  const { t } = useTranslation()

  if (!account?.isArchived) return null

  return (
    <View style={modifyFormStyles.deleteSection}>
      <FormDeleteButton
        label={t("screens.accounts.form.deleteLabel")}
        onPress={onDeletePress}
      />
    </View>
  )
}
