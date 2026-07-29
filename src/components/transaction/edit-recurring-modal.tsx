/**
 * EditRecurringModal
 *
 * Shows 2 options when saving edits to a transaction that belongs to a recurring rule:
 *   1. This transaction        — update only this instance (detach from rule)
 *   2. This and future         — update this instance + all future ones + update rule template
 *
 * Past confirmed transactions are never retroactively changed.
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, Pressable, Text, useWindowDimensions, View } from "react-native"
import {
  StyleSheet as UnistylesSheet,
  useUnistyles,
} from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { ListItem } from "~/components/ui/list-item"
import {
  applyRecurringEditScope,
  type RecurringTransactionTemplate,
} from "~/database/services-sqlite/recurring-transaction-service"
import type { RecurringEditPayload } from "~/schemas/transactions.schema"
import type { Transaction } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { ChevronIcon } from "../ui/chevron-icon"

type EditScope = "this" | "this_and_future"
interface EditRecurringModalProps {
  visible: boolean
  transaction: Transaction
  recurringRule: RecurringTransactionTemplate
  pendingPayload: RecurringEditPayload | null
  onRequestClose: () => void
  onSaved: () => void
}
interface OptionRowProps {
  label: string
  sublabel: string
  onPress: () => void
  loading: boolean
  isLast?: boolean
}
function OptionRow({
  label,
  sublabel,
  onPress,
  loading,
  isLast,
}: OptionRowProps) {
  const { theme } = useUnistyles()
  const successColor = theme.colors.semantic?.success ?? theme.colors.primary
  return (
    <ListItem
      style={({ pressed }) => [
        styles.optionRow,
        !isLast && styles.optionRowBorder,
        pressed && styles.optionRowPressed,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.optionRowContent}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionSublabel}>{sublabel}</Text>
      </View>
      {loading ? (
        <ActivityIndicatorMinty size="small" color={successColor} />
      ) : (
        <ChevronIcon
          direction={"trailing"}
          size={20}
          color={theme.colors.onSecondary}
          style={styles.optionChevron}
        />
      )}
    </ListItem>
  )
}
export function EditRecurringModal({
  visible,
  transaction,
  recurringRule,
  pendingPayload,
  onRequestClose,
  onSaved,
}: EditRecurringModalProps) {
  const [loadingScope, setLoadingScope] = useState<EditScope | null>(null)
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const maxCardWidth = Math.min(width - 48, 400)
  const { theme } = useUnistyles()
  const handleEdit = async (scope: EditScope) => {
    if (loadingScope || !pendingPayload) return
    setLoadingScope(scope)
    try {
      await applyRecurringEditScope({
        scope,
        transactionId: transaction.id,
        transactionDate: transaction.transactionDate,
        ruleId: recurringRule.id,
        payload: pendingPayload,
      })
      Toast.success({
        title: t(
          scope === "this"
            ? "components.transactionForm.toast.editRecurringSuccess"
            : "components.transactionForm.toast.editRecurringFutureSuccess",
        ),
      })
      onRequestClose()
      onSaved()
    } catch (error) {
      logger.error("EditRecurringModal: failed to save", {
        scope,
        error: error instanceof Error ? error.message : String(error),
      })
      Toast.error({
        title: t("components.transactionForm.toast.editRecurringFailed"),
      })
    }
    setLoadingScope(null)
  }
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}
      accessibilityViewIsModal
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={onRequestClose}
          accessibilityLabel={t("common.actions.close")}
        />
        <View style={styles.content}>
          <View
            style={[
              styles.card,
              {
                maxWidth: maxCardWidth,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius ?? 16,
              },
            ]}
          >
            <View style={styles.header}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: theme.colors.semantic?.success,
                  },
                ]}
              >
                <IconSvg
                  name="pencil-outline"
                  size={24}
                  color={theme.colors.semantic?.success ?? theme.colors.primary}
                />
              </View>
              <Text style={styles.title}>
                {t("components.recurring.editModal.title")}
              </Text>
              <Text style={styles.subtitle}>
                {t("components.recurring.editModal.subtitle")}
              </Text>
            </View>

            <View style={styles.optionsCard}>
              <OptionRow
                label={t("components.recurring.editModal.optionThis")}
                sublabel={t(
                  "components.recurring.editModal.optionThisSublabel",
                )}
                onPress={() => handleEdit("this")}
                loading={loadingScope === "this"}
              />
              <OptionRow
                label={t("components.recurring.editModal.optionFuture")}
                sublabel={t(
                  "components.recurring.editModal.optionFutureSublabel",
                )}
                onPress={() => handleEdit("this_and_future")}
                loading={loadingScope === "this_and_future"}
                isLast
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
                {t("components.recurring.editModal.cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
const styles = UnistylesSheet.create((theme) => ({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.shadow,
  },
  content: {
    flex: 1,
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
    borderColor: theme.colors.semantic.semi,
  },
  optionRow: {},
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
  },
  optionRowPressed: { opacity: 0.7 },
  optionRowContent: { flex: 1, gap: 2 },
  optionLabel: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: theme.colors.onSurface,
  },
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
    borderColor: theme.colors.semantic.semi,
  },
  cancelButtonPressed: { opacity: 0.7 },
  cancelText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
}))
