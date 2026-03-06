import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { Money } from "~/components/money"
import { IconSymbol } from "~/components/ui/icon-symbol"
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
          style={transactionItemStyles.amount}
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
          <IconSymbol
            name="repeat"
            size={12}
            color={theme.colors.customColors.info}
          />
          <Text
            style={[
              transactionItemStyles.statusBadgeText,
              { color: theme.colors.customColors.info },
            ]}
          >
            {t("components.transactionItem.recurring")}
          </Text>
        </View>
      )}

      {showPendingBadge && (
        <View style={transactionItemStyles.statusBadge}>
          <IconSymbol
            name="progress-clock"
            size={12}
            color={theme.colors.customColors.warning}
          />
          <Text
            style={[
              transactionItemStyles.statusBadgeText,
              { color: theme.colors.customColors.warning },
            ]}
          >
            {t("components.transactionItem.pending")}
          </Text>
        </View>
      )}
    </View>
  )
}
