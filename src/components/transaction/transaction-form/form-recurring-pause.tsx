import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  pauseRecurringRule,
  type RecurringRuleDetails,
  resumeRecurringRule,
} from "~/database/services/recurring-transaction-service"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

interface FormRecurringPauseProps {
  rule: RecurringRuleDetails
}

/** Pause or resume the recurring rule this entry belongs to. Applies immediately. */
export function FormRecurringPause({ rule }: FormRecurringPauseProps) {
  const { t } = useTranslation()
  const [paused, setPaused] = useState(rule.paused)
  const [busy, setBusy] = useState(false)

  const handleChange = async (next: boolean) => {
    if (busy) return
    setBusy(true)
    try {
      if (next) await pauseRecurringRule(rule.id)
      else await resumeRecurringRule(rule.id)
      setPaused(next)
    } catch (error) {
      logger.error("Failed to change recurring pause state", {
        error: error instanceof Error ? error.message : String(error),
      })
      Toast.error({
        title: t("components.transactionForm.recurringPause.failed"),
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text variant="default">
          {t("components.transactionForm.recurringPause.title")}
        </Text>
        <Text variant="small" style={styles.description}>
          {t("components.transactionForm.recurringPause.description")}
        </Text>
      </View>
      <Switch value={paused} onValueChange={handleChange} disabled={busy} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  text: { flex: 1 },
  description: { color: theme.colors.onSecondary, opacity: 0.8 },
}))
