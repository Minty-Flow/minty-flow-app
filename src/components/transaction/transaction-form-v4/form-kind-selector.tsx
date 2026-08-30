import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Chip } from "~/components/ui/chips"
import { View } from "~/components/ui/view"
import type { TransactionKind } from "~/types/transactions"

import { FieldLabel } from "./field-label"
import { transactionFormStyles } from "./form.styles"
import { KIND_LABEL_KEYS, KIND_ORDER } from "./kind-info"
import { KindInfoModal } from "./kind-info-modal"

type Props = {
  kind: TransactionKind
  onSelect: (kind: TransactionKind) => void
  disabled?: boolean
}

export function FormKindSelector({ kind, onSelect, disabled = false }: Props) {
  const { t } = useTranslation()
  const [infoVisible, setInfoVisible] = useState(false)

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <FieldLabel style={transactionFormStyles.sectionLabel}>
        {t("components.transactionForm.kind.label")}
      </FieldLabel>
      <View style={transactionFormStyles.tagsWrapGrid}>
        {KIND_ORDER.map((k) => (
          <Chip
            key={k}
            label={t(KIND_LABEL_KEYS[k])}
            selected={k === kind}
            disabled={disabled}
            onPress={() => !disabled && k !== kind && onSelect(k)}
          />
        ))}
        <Chip
          leading="info-circle"
          hideCheck
          onPress={() => setInfoVisible(true)}
          accessibilityLabel={t(
            "components.transactionForm.kind.info.a11yOpen",
          )}
        />
      </View>

      <KindInfoModal
        visible={infoVisible}
        onRequestClose={() => setInfoVisible(false)}
      />
    </View>
  )
}
