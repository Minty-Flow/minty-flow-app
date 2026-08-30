import { useState } from "react"
import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Chip } from "~/components/ui/chips"
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
