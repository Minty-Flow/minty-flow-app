import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Chip } from "~/components/ui/chips"
import {
  DateTimePickerModal,
  useDateTimePicker,
} from "~/components/ui/date-time-picker"
import { Input } from "~/components/ui/input"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Loan } from "~/types/loans"
import { formatShortMonthDayYear } from "~/utils/time-utils"

import { formKindCardStyles } from "./form-kind-card.styles"
import type { LoanDraft } from "./on-kind-change"

type Props = {
  loanDraft: LoanDraft | null
  onLoanDraftChange: (draft: LoanDraft) => void
  linkedLoan: Loan | null
  linkableLoans: Loan[]
  onLink: (loanId: string) => void
  onUnlink: () => void
  onFillRemaining: () => void
  currencyCode: string
}

export function LoanCard({
  loanDraft,
  onLoanDraftChange,
  linkedLoan,
  linkableLoans,
  onLink,
  onUnlink,
  onFillRemaining,
  currencyCode,
}: Props) {
  const { t } = useTranslation()
  const draft = loanDraft ?? { name: "", dueDate: null }
  const isLinking = linkedLoan != null

  const dueDatePicker = useDateTimePicker({
    onConfirm: (date) => onLoanDraftChange({ ...draft, dueDate: date }),
  })

  return (
    <View style={[formKindCardStyles.card, styles.card]}>
      {linkableLoans.length > 0 || isLinking ? (
        <ListItem
          style={styles.switchRow}
          onPress={isLinking ? onUnlink : undefined}
          disabled={!isLinking && linkableLoans.length === 0}
          accessibilityRole="switch"
          accessibilityState={{ checked: isLinking }}
        >
          <Text variant="default" style={styles.switchLabel}>
            {t("components.transactionForm.loan.linkExisting")}
          </Text>
          <Switch value={isLinking} />
        </ListItem>
      ) : null}

      {isLinking && linkedLoan ? (
        <>
          <View style={styles.chipWrap}>
            {linkableLoans.map((loan) => (
              <Chip
                key={loan.id}
                label={loan.name}
                selected={loan.id === linkedLoan.id}
                onPress={() =>
                  loan.id === linkedLoan.id ? onUnlink() : onLink(loan.id)
                }
                leading={
                  <DynamicIcon
                    icon={loan.icon || "banknotes"}
                    size={16}
                    colorScheme={getThemeStrict(loan.colorSchemeName)}
                    variant="badge"
                  />
                }
              />
            ))}
          </View>
          <View style={styles.remainingRow}>
            <Text style={formKindCardStyles.text}>
              {t("components.transactionForm.loan.remainingLabel")}
            </Text>
            <View style={styles.remainingRight}>
              <Money
                value={linkedLoan.remainingAmount}
                currency={currencyCode}
                tone="transfer"
                hideSign
              />
              <Pressable
                onPress={onFillRemaining}
                style={styles.maxButton}
                accessibilityLabel={t(
                  "components.transactionForm.loan.maxButton",
                )}
              >
                <Text style={styles.maxButtonText}>
                  {t("components.transactionForm.loan.maxButton")}
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.field}>
            <Text style={formKindCardStyles.text}>
              {t("components.transactionForm.loan.nameLabel")}
            </Text>
            <Input
              value={draft.name}
              onChangeText={(name) => onLoanDraftChange({ ...draft, name })}
              placeholder={t("components.transactionForm.loan.namePlaceholder")}
            />
          </View>
          <ListItem
            style={styles.dueRow}
            onPress={() => dueDatePicker.open(draft.dueDate ?? new Date())}
          >
            <View style={styles.dueLeft}>
              <IconSvg name="calendar-outline" size={20} />
              <Text variant="default" style={styles.switchLabel}>
                {t("components.transactionForm.loan.dueDateLabel")}
              </Text>
            </View>
            <View style={styles.dueRight}>
              <Text style={formKindCardStyles.text}>
                {draft.dueDate
                  ? formatShortMonthDayYear(draft.dueDate.getTime())
                  : t("components.transactionForm.loan.noDueDate")}
              </Text>
              {draft.dueDate ? (
                <Pressable
                  onPress={() => onLoanDraftChange({ ...draft, dueDate: null })}
                  hitSlop={12}
                  accessibilityLabel={t("common.actions.clear")}
                >
                  <IconSvg name="x-outline" size={18} />
                </Pressable>
              ) : null}
            </View>
          </ListItem>
          <Text style={styles.hint}>
            {t("components.transactionForm.loan.newHint")}
          </Text>
        </>
      )}

      {dueDatePicker.pickerElement}
      <DateTimePickerModal {...dueDatePicker.modalProps} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    gap: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    ...theme.typography.bodyLarge,
    color: theme.colors.onSecondary,
  },
  field: {
    gap: 6,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  remainingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  remainingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  maxButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.primary,
  },
  maxButtonText: {
    ...theme.typography.labelMedium,
    fontWeight: "700",
    color: theme.colors.onPrimary,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dueLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dueRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hint: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSecondary,
  },
}))
