import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
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
  /** Line items under the transaction; a count shows next to the title. */
  itemCount?: number
}

export const TransactionItemLeft = ({
  displayIcon,
  displayColorScheme,
  displayTitle,
  subtitleText,
  isRefund,
  itemCount = 0,
}: TransactionItemLeftProps) => {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
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
            {displayTitle}
          </Text>
          {itemCount > 0 && (
            <View
              style={transactionItemStyles.itemCount}
              accessible
              accessibilityLabel={t(
                "components.transactionForm.items.a11y.count",
                { count: itemCount },
              )}
            >
              <IconSvg
                name="list-outline"
                size={12}
                color={theme.colors.onSecondary}
              />
              <Text style={transactionItemStyles.subtitle}>{itemCount}</Text>
            </View>
          )}
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
