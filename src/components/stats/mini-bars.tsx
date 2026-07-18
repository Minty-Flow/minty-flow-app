import { StyleSheet } from "react-native-unistyles"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

const BAR_MAX_HEIGHT = 56
/** Keeps zero-value bars visible as a baseline tick rather than nothing. */
const BAR_MIN_HEIGHT = 4

export interface MiniBar {
  label: string
  value: number
  /** Highlights this bar — the one the surrounding sentence is about. */
  active?: boolean
}

interface MiniBarsProps {
  bars: MiniBar[]
}

/** Label-under-bar chart sized against the largest bar. Renders nothing when every value is 0. */
export function MiniBars({ bars }: MiniBarsProps) {
  const max = Math.max(...bars.map((b) => b.value), 0)
  if (max === 0) return null

  return (
    <View style={styles.row}>
      {bars.map((bar, i) => (
        // Positional key: narrow weekday labels repeat (T/T, S/S), so the label
        // is not unique. Order is stable per render.
        // biome-ignore lint/suspicious/noArrayIndexKey: labels are not unique
        <View key={i} style={styles.column}>
          <View
            style={[
              styles.bar,
              bar.active && styles.barActive,
              {
                height: Math.max(
                  BAR_MIN_HEIGHT,
                  (bar.value / max) * BAR_MAX_HEIGHT,
                ),
              },
            ]}
          />
          <Text variant="muted" style={styles.label}>
            {bar.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: BAR_MAX_HEIGHT + 20,
  },
  column: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    backgroundColor: `${theme.colors.primary}40`,
  },
  barActive: {
    backgroundColor: theme.colors.primary,
  },
  label: {
    fontSize: theme.typography.labelXSmall.fontSize,
  },
}))
