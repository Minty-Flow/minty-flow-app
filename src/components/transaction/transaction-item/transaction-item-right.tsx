import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

import { transactionItemStyles } from "./styles"

type TransactionItemRightProps = {
  amount: number
  currencyCode: string
  amountTone: TransactionType
  isTransfer: boolean
  isCombinedTransfer: boolean
  isCrossCurrencyTransfer: boolean | null | undefined
  otherCurrencyAmount: number | null
  relatedAccountCurrencyCode?: string
  showRecurringBadge: boolean
  showPendingBadge: boolean
}

export const TransactionItemRight = ({
  amount,
  currencyCode,
  amountTone,
  isTransfer,
  isCombinedTransfer,
  isCrossCurrencyTransfer,
  otherCurrencyAmount,
  relatedAccountCurrencyCode,
  showRecurringBadge,
  showPendingBadge,
}: TransactionItemRightProps) => {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <View style={transactionItemStyles.rightSection}>
      <View style={transactionItemStyles.amountBlock}>
        <Money
          value={amount}
          currency={currencyCode}
          tone={amountTone}
          visualTone={isTransfer ? TransactionTypeEnum.TRANSFER : undefined}
          hideSign={isCombinedTransfer}
          native
        />
        {isCrossCurrencyTransfer &&
          otherCurrencyAmount != null &&
          relatedAccountCurrencyCode && (
            <Money
              value={otherCurrencyAmount}
              currency={relatedAccountCurrencyCode}
              style={transactionItemStyles.secondaryAmount}
              variant="small"
              tone="transfer"
              native
            />
          )}
      </View>

      {showRecurringBadge && (
        <View style={transactionItemStyles.statusBadge}>
          <IconSvg
            name="repeat-outline"
            size={12}
            color={theme.colors.semantic.info}
          />
          <Text
            style={[
              transactionItemStyles.statusBadgeText,
              { color: theme.colors.semantic.info },
            ]}
          >
            {t("components.transactionItem.recurring")}
          </Text>
        </View>
      )}

      {showPendingBadge && (
        <View style={transactionItemStyles.statusBadge}>
          <IconSvg
            name="history-toggle-outline"
            size={12}
            color={theme.colors.semantic.warning}
          />
          <Text
            style={[
              transactionItemStyles.statusBadgeText,
              { color: theme.colors.semantic.warning },
            ]}
          >
            {t("components.transactionItem.pending")}
          </Text>
        </View>
      )}
    </View>
  )
}
