import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import { confirmTransaction } from "~/database/services/ledger-service"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { TransactionKindEnum, TransactionTypeEnum } from "~/types/transactions"
import { Toast } from "~/utils/toast"

/**
 * Shown only when editing a transaction whose `kind` is `upcoming`. Confirms the
 * row in place (applies the balance delta, flips it to `default`) without making
 * the user open the edit flow.
 */
export function UpcomingBanner({
  transaction,
}: {
  transaction: TransactionWithRelations | null
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const updateDateUponConfirmation = usePendingTransactionsStore(
    (s) => s.updateDateUponConfirmation,
  )
  const [confirming, setConfirming] = useState(false)

  if (transaction?.kind !== TransactionKindEnum.UPCOMING) return null

  const isExpense = transaction.type === TransactionTypeEnum.EXPENSE
  const markLabel = isExpense
    ? t("components.transactionForm.upcoming.markPaid")
    : t("components.transactionForm.upcoming.markDeposited")

  const handleMark = async () => {
    setConfirming(true)
    try {
      await confirmTransaction(transaction.id, {
        updateTransactionDate: updateDateUponConfirmation,
      })
      router.back()
    } catch {
      setConfirming(false)
      Toast.error({
        title: t("components.transactionForm.toast.upcomingConfirmFailed"),
      })
    }
  }

  return (
    <View style={styles.banner}>
      <IconSvg
        name="history-toggle-outline"
        size={16}
        color={styles.icon.color}
      />
      <Text variant="small" style={styles.text}>
        {t("components.transactionForm.upcoming.banner")}
      </Text>
      <Button
        variant="secondary"
        size="sm"
        onPress={handleMark}
        disabled={confirming}
      >
        <Text variant="small">{markLabel}</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius,
    backgroundColor: `${theme.colors.semantic.warning}18`,
  },
  text: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  icon: {
    color: theme.colors.semantic.warning,
  },
}))
