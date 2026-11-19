import * as Location from "expo-location"
import { useTranslation } from "react-i18next"

import { Text } from "~/components/ui/text"
import { useSpendingPlaces } from "~/database/drizzle/read-models/stats-read-model"
import { useLocationPermissionStatus } from "~/hooks/use-permission-status"
import type { StatsDateRange } from "~/types/stats"

import { StatCard } from "./stat-card"

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

  const top = places[0]
  return (
    <StatCard
      title={t("screens.stats.dashboard.spendingMap")}
      icon="map-outline"
      onPress={onPress}
    >
      <Text variant="muted" numberOfLines={1}>
        {top.address
          ? t("screens.stats.dashboard.placesWithTop", {
              count: places.length,
              top: top.address,
            })
          : t("screens.stats.dashboard.places", { count: places.length })}
      </Text>
    </StatCard>
  )
}
