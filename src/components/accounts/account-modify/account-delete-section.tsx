import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Account } from "~/types/accounts"

import { accountModifyStyles } from "./account-modify.styles"

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
    <View style={accountModifyStyles.deleteSection}>
      <Button
        variant="ghost"
        onPress={onDeletePress}
        style={accountModifyStyles.actionButton}
      >
        <IconSvg
          name="trash"
          size={20}
          color={accountModifyStyles.deleteIcon.color}
        />
        <Text variant="default" style={accountModifyStyles.deleteText}>
          {t("screens.accounts.form.deleteLabel")}
        </Text>
      </Button>
    </View>
  )
}
