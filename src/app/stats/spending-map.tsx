import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import type { WebView } from "react-native-webview"

import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { SpendingMap } from "~/components/stats/spending-map"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useSpendingPlaces } from "~/database/drizzle/read-models/stats-read-model"
import type { StatsDateRange } from "~/types/stats"

function SpendingMapContent({
  dateRange,
  currency,
}: {
  dateRange: StatsDateRange
  currency: string
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const places = useSpendingPlaces(dateRange, currency)
  const mapRef = useRef<WebView>(null)
  const [mapFailed, setMapFailed] = useState(false)

  if (places.length === 0) {
    return <Text variant="muted">{t("screens.stats.spendingMap.empty")}</Text>
  }

  return (
    <>
      {mapFailed ? (
        <View style={styles.offline}>
          <IconSvg
            name="map-outline"
            size={18}
            color={theme.colors.semantic.semi}
          />
          <Text variant="muted">{t("screens.stats.spendingMap.offline")}</Text>
        </View>
      ) : (
        <View style={styles.mapCard}>
          <SpendingMap
            ref={mapRef}
            places={places}
            color={theme.colors.primary}
            onError={() => setMapFailed(true)}
          />
        </View>
      )}

      <Text variant="h4" style={styles.sectionTitle}>
        {t("screens.stats.spendingMap.topPlaces")}
      </Text>
      <View style={styles.card}>
        {places.map((place) => (
          <Pressable
            key={place.key}
            style={styles.row}
            disabled={mapFailed}
            accessibilityRole="button"
            onPress={() =>
              mapRef.current?.injectJavaScript(
                `window.flyTo && window.flyTo(${Number(place.latitude)}, ${Number(place.longitude)}); true;`,
              )
            }
          >
            <IconSvg name="map-pin" size={18} color={theme.colors.primary} />
            <View style={styles.rowText}>
              <Text numberOfLines={1}>
                {place.address ?? t("screens.stats.spendingMap.unnamedPlace")}
              </Text>
              <Text variant="muted">
                {t("screens.stats.spendingMap.entries", {
                  count: place.count,
                })}
              </Text>
            </View>
            <Money
              value={place.total}
              currency={currency}
              tone="transfer"
              visualTone="expense"
              compact
            />
          </Pressable>
        ))}
      </View>
    </>
  )
}

export default function StatsSpendingMapScreen() {
  return (
    <StatsDetailShell>
      {({ stats, dateRange }) => (
        <SpendingMapContent dateRange={dateRange} currency={stats.currency} />
      )}
    </StatsDetailShell>
  )
}

const styles = StyleSheet.create((theme) => ({
  mapCard: {
    height: 300,
    borderRadius: theme.radius,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
  },
  offline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
}))
