import { useTranslation } from "react-i18next"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Account } from "~/types/accounts"
import { getBalancesByCurrency } from "~/utils/account-balances"

import { totalBalanceStyles as styles } from "./total-balance.styles"

/** The "Total Balance" label and one row per currency. */
export function TotalBalance({
  accounts,
  compact = false,
}: {
  accounts: Account[]
  /** Small summary-card text, for the home box. */
  compact?: boolean
}) {
  const { t } = useTranslation()
  return (
    <>
      <Text
        variant="small"
        style={[styles.label, compact && styles.labelCompact]}
      >
        {t("screens.accounts.totalBalance")}
      </Text>
      <View style={[styles.rows, compact && styles.rowsCompact]}>
        {getBalancesByCurrency(accounts).map((item) => (
          <View key={item.currency} style={styles.row}>
            <Text
              variant={compact ? "small" : "default"}
              style={[styles.currency, compact && styles.currencyCompact]}
            >
              {item.currency}
            </Text>
            <Money
              value={item.balance}
              variant={compact ? "small" : "h3"}
              currency={item.currency}
              style={compact ? undefined : styles.amount}
            />
          </View>
        ))}
      </View>
    </>
  )
}
