import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { IconSymbol } from "~/components/ui/icon-symbol"
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

  if (!account) return null

  return (
    <View style={accountModifyStyles.deleteSection}>
      {account.isArchived ? (
        <Button
          variant="ghost"
          onPress={onDeletePress}
          style={accountModifyStyles.actionButton}
        >
          <IconSymbol
            name="trash-can"
            size={20}
            style={accountModifyStyles.deleteIcon}
          />
          <Text variant="default" style={accountModifyStyles.deleteText}>
            {t("screens.accounts.form.deleteLabel")}
          </Text>
        </Button>
      ) : (
        <View style={accountModifyStyles.archiveContainer}>
          <IconSymbol
            name="information"
            style={accountModifyStyles.archiveWarningIcon}
            size={14}
          />
          <Text variant="small" style={accountModifyStyles.archiveWarning}>
            {t("screens.accounts.form.archiveWarning")}
          </Text>
        </View>
      )}
    </View>
  )
}
