import { useState } from "react"
import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"
import { Chip } from "~/components/ui/chips"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"
import type { TransactionKind } from "~/types/transactions"

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
      <View style={transactionFormStyles.tagsWrapGrid}>
        <Pressable
          onPress={() => setInfoVisible(true)}
          hitSlop={8}
          accessibilityLabel={t(
            "components.transactionForm.kind.info.a11yOpen",
          )}
          style={transactionFormStyles.kindInfoButton}
        >
          <IconSvg name="info-circle" size={20} />
        </Pressable>
        {KIND_ORDER.map((k) => (
          <Chip
            key={k}
            label={t(KIND_LABEL_KEYS[k])}
            selected={k === kind}
            disabled={disabled}
            onPress={() => !disabled && k !== kind && onSelect(k)}
          />
        ))}
      </View>

      <KindInfoModal
        visible={infoVisible}
        onRequestClose={() => setInfoVisible(false)}
      />
    </View>
  )
}
