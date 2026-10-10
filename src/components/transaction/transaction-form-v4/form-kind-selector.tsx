import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Chip } from "~/components/ui/chips"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionKind } from "~/types/transactions"

import { transactionFormStyles } from "./form.styles"
import { KIND_ICONS, KIND_LABEL_KEYS, KIND_ORDER } from "./kind-info"
import { KindInfoSheet } from "./kind-info-sheet"

const isLoanKind = (k: TransactionKind) => k === "lent" || k === "borrowed"

type Props = {
  kind: TransactionKind
  onSelect: (kind: TransactionKind) => void
  isNew: boolean
  /** Kind can't change (tied to a loan or a recurring rule). */
  locked: boolean
  /** The loan this transaction belongs to, when there is one. */
  linkedLoan?: { id: string; name: string } | null
}

export function FormKindSelector({
  kind,
  onSelect,
  isNew,
  locked,
  linkedLoan,
}: Props) {
  const { t } = useTranslation()
  const [infoVisible, setInfoVisible] = useState(false)

  if (locked) {
    return <LockedKindRow kind={kind} linkedLoan={linkedLoan} />
  }

  // An existing transaction can't become a loan, so lent / borrowed are only
  // offered when creating (the current kind always stays visible).
  const kinds = isNew
    ? KIND_ORDER
    : KIND_ORDER.filter((k) => k === kind || !isLoanKind(k))

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={transactionFormStyles.kindScrollContent}
      >
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setInfoVisible(true)}
          accessibilityLabel={t(
            "components.transactionForm.kind.info.a11yOpen",
          )}
        >
          <IconSvg name="info-circle" size={20} />
        </Button>
        {kinds.map((k) => (
          <Chip
            key={k}
            label={t(KIND_LABEL_KEYS[k])}
            selected={k === kind}
            onPress={() => k !== kind && onSelect(k)}
          />
        ))}
      </ScrollView>

      <KindInfoSheet
        visible={infoVisible}
        onRequestClose={() => setInfoVisible(false)}
      />
    </View>
  )
}

/**
 * Read-only kind for a transaction tied to a loan or a recurring rule. A loan
 * row is a disclosure link to the loan, where the loan is actually managed.
 */
function LockedKindRow({
  kind,
  linkedLoan,
}: {
  kind: TransactionKind
  linkedLoan?: { id: string; name: string } | null
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()

  const subtitle = linkedLoan
    ? t("components.transactionForm.kind.locked.loan", {
        name: linkedLoan.name,
      })
    : t("components.transactionForm.kind.locked.recurring")

  return (
    <ListItem
      style={transactionFormStyles.lockedKindRow}
      disabled={!linkedLoan}
      onPress={
        linkedLoan
          ? () =>
              router.push({
                pathname: "/settings/loans/[loanId]",
                params: { loanId: linkedLoan.id },
              })
          : undefined
      }
      accessibilityRole={linkedLoan ? "link" : undefined}
    >
      <View style={transactionFormStyles.lockedKindLeft}>
        <DynamicIcon
          icon={KIND_ICONS[kind]}
          size={20}
          color={theme.colors.primary}
          variant="badge"
        />
        <View style={transactionFormStyles.lockedKindText}>
          <Text style={transactionFormStyles.switchLabel}>
            {t(KIND_LABEL_KEYS[kind])}
          </Text>
          <Text
            variant="small"
            style={transactionFormStyles.lockedKindSubtitle}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      {linkedLoan ? (
        <ChevronIcon
          direction="trailing"
          size={18}
          color={theme.colors.semantic.semi}
        />
      ) : (
        <IconSvg
          name="lock-outline"
          size={18}
          color={theme.colors.semantic.semi}
        />
      )}
    </ListItem>
  )
}
