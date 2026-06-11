import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { MintyColorScheme } from "~/styles/theme/types"

import { transactionItemStyles } from "./styles"

type TransactionItemLeftProps = {
  displayIcon: string | null | undefined
  displayColorScheme: MintyColorScheme | null | undefined
  displayTitle: string
  subtitleText: string
  isRefund?: boolean
}

export const TransactionItemLeft = ({
  displayIcon,
  displayColorScheme,
  displayTitle,
  subtitleText,
  isRefund,
}: TransactionItemLeftProps) => {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  return (
    <View style={transactionItemStyles.leftSection}>
      <DynamicIcon
        icon={displayIcon}
        size={28}
        colorScheme={displayColorScheme}
        variant="badge"
      />
      <View style={transactionItemStyles.details}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          {isRefund && (
            <IconSvg
              name="receipt-refund-outline"
              size={14}
              color={theme.colors.onSecondary}
            />
          )}
          <Text
            variant="small"
            style={[transactionItemStyles.title, { flexShrink: 1 }]}
            numberOfLines={1}
          >
            {displayTitle || t("common.transaction.untitledTransaction")}
          </Text>
        </View>
        <View style={transactionItemStyles.subtitleRow}>
          <Text style={transactionItemStyles.subtitle} numberOfLines={1}>
            {subtitleText}
          </Text>
        </View>
      </View>
    </View>
  )
}
