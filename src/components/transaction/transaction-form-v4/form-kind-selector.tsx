import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { modalStyles } from "~/components/selector-modals/styles"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import type { TransactionKind } from "~/types/transactions"

import { transactionFormStyles } from "./form.styles"

const KIND_LABEL_KEYS: Record<TransactionKind, TranslationKey> = {
  default: "common.transaction.kinds.default",
  upcoming: "common.transaction.kinds.upcoming",
  subscription: "common.transaction.kinds.subscription",
  repetitive: "common.transaction.kinds.repetitive",
  lent: "common.transaction.kinds.lent",
  borrowed: "common.transaction.kinds.borrowed",
}

// Slice 1 wires only `default` and `upcoming`. `subscription`/`repetitive` (Slice 2)
// and `lent`/`borrowed` (Slice 4) stay defined in the enum + onKindChange/KT
// matrix, but must not be user-selectable until their submit paths exist.
const KINDS: TransactionKind[] = ["default", "upcoming"]

type Props = {
  kind: TransactionKind
  onSelect: (kind: TransactionKind) => void
  disabled?: boolean
}

export function FormKindSelector({ kind, onSelect, disabled = false }: Props) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  const close = () => setVisible(false)
  const handleSelect = (next: TransactionKind) => {
    onSelect(next)
    close()
  }

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <Text variant="small" style={transactionFormStyles.sectionLabel}>
        {t("components.transactionForm.kind.label")}
      </Text>
      <ListItem
        style={transactionFormStyles.inlineDateRow}
        onPress={() => setVisible(true)}
        disabled={disabled}
        accessibilityState={{ disabled }}
      >
        <Text
          variant="default"
          style={[
            transactionFormStyles.inlineDateText,
            disabled && transactionFormStyles.clearButtonDisabled,
          ]}
        >
          {t(KIND_LABEL_KEYS[kind])}
        </Text>
        {!disabled && (
          <ChevronIcon
            direction="trailing"
            size={20}
            style={transactionFormStyles.chevronIcon}
          />
        )}
      </ListItem>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={close}
        statusBarTranslucent
        accessibilityViewIsModal
      >
        <SafeAreaView
          style={modalStyles.modalContainer}
          edges={["top", "bottom"]}
        >
          <View style={modalStyles.header}>
            <Text variant="default" style={modalStyles.headerTitle}>
              {t("components.transactionForm.kind.label")}
            </Text>
            <Button variant="ghost" onPress={close}>
              <Text variant="default">{t("common.actions.cancel")}</Text>
            </Button>
          </View>
          <View style={modalStyles.listWrapper}>
            {KINDS.map((k) => (
              <ListItem
                key={k}
                style={[
                  modalStyles.item,
                  k === kind && modalStyles.itemSelected,
                ]}
                onPress={() => handleSelect(k)}
              >
                <Text variant="large">{t(KIND_LABEL_KEYS[k])}</Text>
              </ListItem>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}
