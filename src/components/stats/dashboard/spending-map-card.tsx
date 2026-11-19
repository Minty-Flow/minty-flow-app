import * as Location from "expo-location"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useSpendingPlaces } from "~/database/drizzle/read-models/stats-read-model"
import { useLocationPermissionStatus } from "~/hooks/use-permission-status"
import type { StatsDateRange } from "~/types/stats"

import { StatCard } from "./stat-card"

const TOP_PLACES = 3

interface SpendingMapCardProps {
  dateRange: StatsDateRange
  currency: string
  onPress: () => void
}

/** Hidden without location permission or without located expenses. */
export function SpendingMapCard({
  dateRange,
  currency,
  onPress,
}: SpendingMapCardProps) {
  const { t } = useTranslation()
  const { permissionStatus } = useLocationPermissionStatus()
  const places = useSpendingPlaces(dateRange, currency)

  if (permissionStatus !== Location.PermissionStatus.GRANTED) return null
  if (places.length === 0) return null

  return (
    <StatCard
      title={t("screens.stats.dashboard.spendingMap")}
      icon="map-outline"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text variant="muted">
          {t("screens.stats.dashboard.places", { count: places.length })}
        </Text>
        {places.slice(0, TOP_PLACES).map((place) => (
          <View key={place.key} style={styles.row}>
            <View style={styles.name}>
              <Text>
                {place.address ?? t("screens.stats.spendingMap.unnamedPlace")}
              </Text>
              <Text variant="muted">
                {t("screens.stats.spendingMap.entries", { count: place.count })}
              </Text>
            </View>
            <Money
              value={place.total}
              currency={currency}
              tone="transfer"
              visualTone="expense"
              compact
            />
          </View>
        ))}
      </View>
    </StatCard>
  )
}

const styles = StyleSheet.create(() => ({
  body: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  name: {
    flex: 1,
    gap: 2,
  },
}))
