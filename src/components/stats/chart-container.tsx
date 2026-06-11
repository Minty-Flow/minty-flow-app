import type { ReactNode } from "react"
import { StyleSheet } from "react-native-unistyles"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface ChartContainerProps {
  title: string
  children: ReactNode
  legend?: ReactNode
  legendBelow?: boolean
}

export function ChartContainer({
  title,
  children,
  legend,
  legendBelow = false,
}: ChartContainerProps) {
  return (
    <View style={styles.container}>
      <View style={legendBelow ? styles.headerStacked : styles.header}>
        <Text variant="small" style={styles.title}>
          {title}
        </Text>
        {legend && legendBelow ? (
          <View style={styles.legendCentered}>{legend}</View>
        ) : (
          legend
        )}
      </View>
      <View style={styles.chartWrapper}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
    borderCurve: "continuous",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerStacked: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  title: {
    fontWeight: "600",
  },
  legendCentered: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  chartWrapper: {
    // overflow: "hidden",
  },
}))
