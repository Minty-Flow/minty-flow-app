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

const TOP_PLACES_PREVIEW = 20

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
  // Bumped on Retry so the WebView remounts and loads from scratch.
  const [mapAttempt, setMapAttempt] = useState(0)
  const [showAllPlaces, setShowAllPlaces] = useState(false)

  if (places.length === 0) {
    return <Text variant="muted">{t("screens.stats.spendingMap.empty")}</Text>
  }

  const listedPlaces = showAllPlaces
    ? places
    : places.slice(0, TOP_PLACES_PREVIEW)

  return (
    <>
      {mapFailed ? (
        <View style={styles.offline}>
          <IconSvg
            name="map-outline"
            size={18}
            color={theme.colors.semantic.semi}
          />
          <Text variant="muted" style={styles.offlineText}>
            {t("screens.stats.spendingMap.offline")}
          </Text>
          <Pressable
            onPress={() => {
              setMapFailed(false)
              setMapAttempt((n) => n + 1)
            }}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={styles.retry}>
              {t("screens.stats.spendingMap.retry")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.mapCard}>
          <SpendingMap
            key={mapAttempt}
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
        {listedPlaces.map((place) => (
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
        {!showAllPlaces && places.length > TOP_PLACES_PREVIEW && (
          <Pressable
            style={styles.showAll}
            accessibilityRole="button"
            onPress={() => setShowAllPlaces(true)}
          >
            <Text style={styles.showAllText}>
              {t("screens.stats.spendingMap.showAll", { count: places.length })}
            </Text>
          </Pressable>
        )}
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
  offlineText: {
    flex: 1,
  },
  retry: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  showAll: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  showAllText: {
    color: theme.colors.primary,
    fontWeight: "700",
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
