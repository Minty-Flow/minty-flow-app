import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { BottomSheet } from "~/components/ui/bottom-sheet"
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

export function KindInfoSheet({ visible, onRequestClose }: Props) {
  const { t } = useTranslation()

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onRequestClose}
      heightFraction={0.75}
    >
      <View style={styles.card}>
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
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: { flex: 1, paddingVertical: 8, gap: 16 },
  list: { flex: 1 },
  title: { textAlign: "center", fontWeight: "600" },
  listContent: { gap: 18, paddingVertical: 4 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconBox: { marginTop: 2 },
  icon: { color: theme.colors.primary },
  rowText: { flex: 1, gap: 3 },
  name: { fontWeight: "600" },
  desc: { lineHeight: 20 },
}))
