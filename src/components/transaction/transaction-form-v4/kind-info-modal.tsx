import { useTranslation } from "react-i18next"
import { Modal, ScrollView, useWindowDimensions, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

import {
  KIND_ICONS,
  KIND_INFO_KEYS,
  KIND_LABEL_KEYS,
  KIND_ORDER,
} from "./kind-info"

type Props = {
  visible: boolean
  onRequestClose: () => void
}

export function KindInfoModal({ visible, onRequestClose }: Props) {
  const { t } = useTranslation()
  const { width, height } = useWindowDimensions()
  const maxCardWidth = Math.min(width - 48, 420)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <View style={styles.root}>
        <View style={styles.backdrop} />
        <View style={styles.content}>
          <View
            style={[
              styles.card,
              { maxWidth: maxCardWidth, maxHeight: height * 0.8 },
            ]}
          >
            <Text variant="h3" style={styles.title}>
              {t("components.transactionForm.kind.info.title")}
            </Text>

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {KIND_ORDER.map((k) => (
                <View key={k} style={styles.row}>
                  <IconSvg
                    name={KIND_ICONS[k]}
                    size={22}
                    color={styles.icon.color}
                    style={styles.iconBox}
                  />
                  <View style={styles.rowText}>
                    <Text variant="default" style={styles.name}>
                      {t(KIND_LABEL_KEYS[k])}
                    </Text>
                    <Text variant="muted" style={styles.desc}>
                      {t(KIND_INFO_KEYS[k])}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <Button variant="default" onPress={onRequestClose}>
              <Text variant="default">{t("common.actions.ok")}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1 },
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius ?? 16,
  },
  title: { textAlign: "center", fontWeight: "600" },
  list: { flexGrow: 0 },
  listContent: { gap: 18, paddingVertical: 4 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconBox: { marginTop: 2 },
  icon: { color: theme.colors.primary },
  rowText: { flex: 1, gap: 3 },
  name: { fontWeight: "600" },
  desc: { lineHeight: 20 },
}))
