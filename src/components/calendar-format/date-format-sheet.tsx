import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { sheetHeaderStyles } from "~/components/selectors/styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Chip } from "~/components/ui/chips"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import {
  type DateOrderPreference,
  type DateStylePreference,
  useCalendarFormatStore,
} from "~/stores/calendar-format.store"
import { formatDatePreview } from "~/utils/time-utils"

const STYLES: DateStylePreference[] = [
  "full",
  "dateOnly",
  "numeric",
  "numericOnly",
]
const ORDERS: DateOrderPreference[] = ["default", "mdy", "dmy", "ymd", "ydm"]

type Props = {
  visible: boolean
  onClose: () => void
}

/** Date style (how the day reads) + order (month / day / year) picker. */
export function DateFormatSheet({ visible, onClose }: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const dateStyle = useCalendarFormatStore((s) => s.dateStyle)
  const dateOrder = useCalendarFormatStore((s) => s.dateOrder)
  const setDateStyle = useCalendarFormatStore((s) => s.setDateStyle)
  const setDateOrder = useCalendarFormatStore((s) => s.setDateOrder)
  const now = new Date()
  const key = (suffix: string) =>
    `screens.settings.preferences.calendarFormat.date.${suffix}` as TranslationKey

  return (
    <BottomSheet isPresented={visible} onDismiss={onClose} contentPadding={0}>
      <View style={styles.container}>
        <View style={sheetHeaderStyles.header}>
          <Text style={sheetHeaderStyles.title}>{t(key("label"))}</Text>
        </View>

        <Text variant="small" style={styles.sectionLabel}>
          {t(key("styleLabel"))}
        </Text>
        {STYLES.map((style) => (
          <ListItem
            key={style}
            style={styles.row}
            onPress={() => setDateStyle(style)}
            accessibilityRole="radio"
            accessibilityState={{ selected: style === dateStyle }}
          >
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>{t(key(`style.${style}`))}</Text>
              <Text variant="muted" style={styles.rowExample}>
                {formatDatePreview(now, style, dateOrder)}
              </Text>
            </View>
            {style === dateStyle ? (
              <IconSvg
                name="check-outline"
                size={20}
                color={theme.colors.primary}
              />
            ) : null}
          </ListItem>
        ))}

        <Text variant="small" style={styles.sectionLabel}>
          {t(key("orderLabel"))}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {ORDERS.map((order) => (
            <Chip
              key={order}
              label={t(key(`order.${order}`))}
              selected={order === dateOrder}
              onPress={() => setDateOrder(order)}
              accessibilityRole="radio"
              accessibilityState={{ selected: order === dateOrder }}
            />
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { paddingBottom: 8 },
  sectionLabel: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: theme.colors.semantic?.semi,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
  },
  row: { justifyContent: "space-between", minHeight: 56 },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { ...theme.typography.titleSmall, color: theme.colors.onSurface },
  rowExample: { fontSize: theme.typography.labelLarge.fontSize },
  chips: { gap: 8, paddingHorizontal: 20, paddingVertical: 8 },
}))
