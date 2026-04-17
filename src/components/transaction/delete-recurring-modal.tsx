/**
 * DeleteRecurringModal
 *
 * Shows 3 options when deleting a transaction that belongs to a recurring rule:
 *   1. This transaction   — soft-delete only this instance
 *   2. All transactions   — soft-delete rule + all instances
 *   3. This and future    — soft-delete rule + instances from this date onward
 */

import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native"
import {
  StyleSheet as UnistylesSheet,
  useUnistyles,
} from "react-native-unistyles"

import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { IconSvg } from "~/components/ui/icon-svg"
import type RecurringTransactionModel from "~/database/models/recurring-transaction"
import type TransactionModel from "~/database/models/transaction"
import { disableRecurringRule } from "~/database/services/recurring-transaction-service"
import {
  deleteAllRecurringInstances,
  deleteFutureRecurringInstances,
  deleteTransactionModel,
} from "~/database/services/transaction-service"
import { autoConfirmationService } from "~/services/auto-confirmation-service"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { ChevronIcon } from "../ui/chevron-icon"

type DeleteScope = "this" | "all" | "this_and_future"

interface DeleteRecurringModalProps {
  visible: boolean
  transaction: TransactionModel
  recurringRule: RecurringTransactionModel
  onRequestClose: () => void
  onDeleted: () => void
}

interface OptionRowProps {
  label: string
  sublabel: string
  onPress: () => void
  loading: boolean
  isLast?: boolean
  isDestructive?: boolean
}

function OptionRow({
  label,
  sublabel,
  onPress,
  loading,
  isLast,
  isDestructive,
}: OptionRowProps) {
  const { theme } = useUnistyles()
  const chevronColor = isDestructive
    ? theme.colors.error
    : theme.colors.onSecondary
  return (
    <Pressable
      style={({ pressed }) => [
        styles.optionRow,
        !isLast && styles.optionRowBorder,
        pressed && styles.optionRowPressed,
      ]}
      onPress={onPress}
      disabled={loading}
      android_ripple={{ color: theme.colors.rippleColor }}
    >
      <View style={styles.optionRowContent}>
        <Text
          style={[
            styles.optionLabel,
            isDestructive && styles.optionLabelDestructive,
          ]}
        >
          {label}
        </Text>
        <Text style={styles.optionSublabel}>{sublabel}</Text>
      </View>
      {loading ? (
        <ActivityIndicatorMinty size="small" color={theme.colors.error} />
      ) : (
        <ChevronIcon
          direction={"trailing"}
          size={20}
          color={chevronColor}
          style={styles.optionChevron}
        />
      )}
    </Pressable>
  )
}

export function DeleteRecurringModal({
  visible,
  transaction,
  recurringRule,
  onRequestClose,
  onDeleted,
}: DeleteRecurringModalProps) {
  const [loadingScope, setLoadingScope] = useState<DeleteScope | null>(null)
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const maxCardWidth = Math.min(width - 48, 400)
  const { theme } = useUnistyles()

  const performDelete = useCallback(
    async (scope: DeleteScope) => {
      if (loadingScope) return
      setLoadingScope(scope)
      autoConfirmationService.cancelSchedule(transaction.id)

      try {
        switch (scope) {
          case "this": {
            await deleteTransactionModel(transaction)
            Toast.success({
              title: t(
                "components.transactionForm.toast.deleteRecurringSuccess",
              ),
            })
            break
          }

          case "all": {
            await deleteAllRecurringInstances(recurringRule.id)
            await disableRecurringRule(recurringRule.id)
            Toast.success({
              title: t(
                "components.transactionForm.toast.deleteRecurringAllSuccess",
              ),
            })
            break
          }

          case "this_and_future": {
            await deleteFutureRecurringInstances(
              recurringRule.id,
              transaction.transactionDate,
            )
            await disableRecurringRule(recurringRule.id)
            Toast.success({
              title: t(
                "components.transactionForm.toast.deleteRecurringFutureSuccess",
              ),
            })
            break
          }
        }

        onRequestClose()
        onDeleted()
      } catch (error) {
        logger.error("DeleteRecurringModal: failed to delete", {
          scope,
          error: error instanceof Error ? error.message : String(error),
        })
        Toast.error({
          title: t("components.transactionForm.toast.deleteRecurringFailed"),
        })
      }
      setLoadingScope(null)
    },
    [loadingScope, transaction, recurringRule, onRequestClose, onDeleted, t],
  )

  const handleDelete = useCallback(
    (scope: DeleteScope) => {
      if (scope === "all" || scope === "this_and_future") {
        Alert.alert(
          t("components.recurring.deleteModal.confirmTitle"),
          t("components.recurring.deleteModal.confirmMessage"),
          [
            {
              text: t("components.recurring.deleteModal.cancel"),
              style: "cancel",
            },
            {
              text: t("components.recurring.deleteModal.delete"),
              style: "destructive",
              onPress: () => performDelete(scope),
            },
          ],
        )
      } else {
        void performDelete(scope)
      }
    },
    [performDelete, t],
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}
      accessibilityViewIsModal
    >
      <Pressable
        style={[styles.backdrop, { width }]}
        onPress={onRequestClose}
        accessibilityLabel={t("common.actions.close")}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[
              styles.card,
              {
                maxWidth: maxCardWidth,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius ?? 16,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.header}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.colors.error}20` },
                ]}
              >
                <IconSvg name="trash" size={24} color={theme.colors.error} />
              </View>
              <Text style={styles.title}>
                {t("components.recurring.deleteModal.title")}
              </Text>
              <Text style={styles.subtitle}>
                {t("components.recurring.deleteModal.subtitle")}
              </Text>
            </View>

            <View style={styles.optionsCard}>
              <OptionRow
                label={t("components.recurring.deleteModal.optionThis")}
                sublabel={t(
                  "components.recurring.deleteModal.optionThisSublabel",
                )}
                onPress={() => handleDelete("this")}
                loading={loadingScope === "this"}
                isDestructive
              />
              <OptionRow
                label={t("components.recurring.deleteModal.optionAll")}
                sublabel={t(
                  "components.recurring.deleteModal.optionAllSublabel",
                )}
                onPress={() => handleDelete("all")}
                loading={loadingScope === "all"}
                isDestructive
              />
              <OptionRow
                label={t("components.recurring.deleteModal.optionFuture")}
                sublabel={t(
                  "components.recurring.deleteModal.optionFutureSublabel",
                )}
                onPress={() => handleDelete("this_and_future")}
                loading={loadingScope === "this_and_future"}
                isLast
                isDestructive
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              onPress={onRequestClose}
              disabled={!!loadingScope}
            >
              <Text style={styles.cancelText}>
                {t("components.recurring.deleteModal.cancel")}
              </Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  )
}

const styles = UnistylesSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.shadow,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    ...theme.typography.headlineSmall,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
    color: theme.colors.onSurface,
  },
  subtitle: {
    fontSize: theme.typography.labelLarge.fontSize,
    textAlign: "center",
    color: theme.colors.onSecondary,
  },
  optionsCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderColor: theme.colors.customColors.semi,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.customColors.semi,
  },
  optionRowPressed: { opacity: 0.7 },
  optionRowContent: { flex: 1, gap: 2 },
  optionLabel: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: theme.colors.onSurface,
  },
  optionLabelDestructive: { color: theme.colors.error },
  optionSublabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "400",
    color: theme.colors.onSecondary,
  },
  optionChevron: { marginLeft: 8 },
  cancelButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderColor: theme.colors.customColors.semi,
  },
  cancelButtonPressed: { opacity: 0.7 },
  cancelText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
}))
