import { useTranslation } from "react-i18next"

import { Chip } from "~/components/ui/chips"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import type { TransactionKind } from "~/types/transactions"

import { FieldLabel } from "./field-label"
import { transactionFormStyles } from "./form.styles"

const KIND_LABEL_KEYS: Record<TransactionKind, TranslationKey> = {
  default: "common.transaction.kinds.default",
  upcoming: "common.transaction.kinds.upcoming",
  subscription: "common.transaction.kinds.subscription",
  repetitive: "common.transaction.kinds.repetitive",
  lent: "common.transaction.kinds.lent",
  borrowed: "common.transaction.kinds.borrowed",
}

// `lent`/`borrowed` (Slice 4) stay defined in the enum + onKindChange/KT matrix,
// but must not be user-selectable until their submit paths exist.
const KINDS: TransactionKind[] = [
  "default",
  "upcoming",
  "subscription",
  "repetitive",
]

type Props = {
  kind: TransactionKind
  onSelect: (kind: TransactionKind) => void
  disabled?: boolean
}

export function FormKindSelector({ kind, onSelect, disabled = false }: Props) {
  const { t } = useTranslation()

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <FieldLabel style={transactionFormStyles.sectionLabel}>
        {t("components.transactionForm.kind.label")}
      </FieldLabel>
      <View style={transactionFormStyles.tagsWrapGrid}>
        {KINDS.map((k) => (
          <Chip
            key={k}
            label={t(KIND_LABEL_KEYS[k])}
            selected={k === kind}
            disabled={disabled}
            onPress={() => !disabled && k !== kind && onSelect(k)}
          />
        ))}
      </View>
    </View>
  )
}
