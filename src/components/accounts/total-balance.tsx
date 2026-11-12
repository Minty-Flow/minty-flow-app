import { useTranslation } from "react-i18next"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Account } from "~/types/accounts"
import { getBalancesByCurrency } from "~/utils/account-balances"

import { totalBalanceStyles as styles } from "./total-balance.styles"

/** The "Total Balance" label and one row per currency. */
export function TotalBalance({ accounts }: { accounts: Account[] }) {
  const { t } = useTranslation()
  return (
    <>
      <Text variant="small" style={styles.label}>
        {t("screens.accounts.totalBalance")}
      </Text>
      <View style={styles.rows}>
        {getBalancesByCurrency(accounts).map((item) => (
          <View key={item.currency} style={styles.row}>
            <Text variant="default" style={styles.currency}>
              {item.currency}
            </Text>
            <Money
              value={item.balance}
              variant="h3"
              currency={item.currency}
              style={styles.amount}
            />
          </View>
        ))}
      </View>
    </>
  )
}
