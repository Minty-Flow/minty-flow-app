import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"
import {
  StyleSheet as UnistylesSheet,
  useUnistyles,
} from "react-native-unistyles"
import { WebView } from "react-native-webview"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionLocation } from "~/types/transactions"

const H_PAD = 20
const CARD_HEIGHT = 200

/** Static, non-interactive Leaflet map for the inline preview card. */
function buildPreviewHtml(lat: number, lng: number, pinColor: string): string {
  const safeLat = Number(lat)
  const safeLng = Number(lng)
  if (!Number.isFinite(safeLat) || !Number.isFinite(safeLng)) {
    throw new Error(`Invalid coordinates: ${lat}, ${lng}`)
  }
  // Only allow CSS color values — hex or rgb/rgba. Fall back to a safe default.
  const safeColor = /^#[0-9a-fA-F]{3,8}$|^rgba?\(/.test(pinColor)
    ? pinColor
    : "#3b82f6"
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body,#map{width:100%;height:100%}
    .leaflet-control-container{display:none}
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map',{
      zoomControl:false,dragging:false,touchZoom:false,
      doubleClickZoom:false,scrollWheelZoom:false,keyboard:false,
    }).setView([${safeLat},${safeLng}],15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);

    const icon = L.divIcon({
      html:'<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;background:${safeColor};border:3px solid white;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.45)"></div>',
      iconSize:[20,20],
      iconAnchor:[10,20],
      className:'',
    });
    L.marker([${safeLat},${safeLng}],{icon}).addTo(map);
  </script>
</body>
</html>`
}

interface FormLocationPickerProps {
  location: TransactionLocation | null
  isCapturingLocation: boolean
  onPress: () => void
  onClear: () => void
}

export function FormLocationPicker({
  location,
  isCapturingLocation,
  onPress,
  onClear,
}: FormLocationPickerProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const previewHtml = useMemo(() => {
    if (!location) return null
    return buildPreviewHtml(
      location.latitude,
      location.longitude,
      theme.colors.primary,
    )
  }, [location?.latitude, location?.longitude, theme.colors.primary, location])

  // ── Location set: map preview card ─────────────────────────────────────
  if (location && previewHtml) {
    return (
      <View style={styles.card}>
        {/* Full-card tap target — rendered first so clear button wins on overlap */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
          {/* WebView is visual-only; pointer events disabled so Pressable gets taps */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <WebView
              style={styles.webview}
              source={{ html: previewHtml }}
              scrollEnabled={false}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={[
                "https://unpkg.com",
                "https://*.tile.openstreetmap.org",
                "about:blank",
              ]}
            />
          </View>
        </Pressable>

        {/* "Tap to edit" hint bar pinned to bottom */}
        <View style={styles.hintBar} pointerEvents="none">
          <IconSvg name="info-circle" size={14} style={styles.hintIcon} />
          <Text style={styles.hintText}>
            {t("components.locationPicker.tapToEdit")}
          </Text>
        </View>

        {/* Clear button — rendered last so it sits above the absoluteFill Pressable */}
        <View style={styles.clearBtnWrap}>
          <Pressable
            onPress={onClear}
            style={styles.clearBtn}
            hitSlop={8}
            accessibilityLabel={t("components.locationPicker.removeLocation")}
          >
            <IconSvg name="x" size={14} color={styles.clearIcon.color} />
          </Pressable>
        </View>
      </View>
    )
  }

  // ── No location: placeholder card ──────────────────────────────────────
  return (
    <Pressable
      style={[styles.placeholder, { backgroundColor: theme.colors.secondary }]}
      onPress={onPress}
      disabled={isCapturingLocation}
    >
      {isCapturingLocation ? (
        <ActivityIndicatorMinty color={theme.colors.primary} />
      ) : (
        <View
          style={[styles.addBtn, { backgroundColor: theme.colors.surface }]}
        >
          <DynamicIcon
            icon="map-pin"
            size={18}
            color={theme.colors.primary}
            variant="badge"
          />
          <Text style={[styles.addBtnText, { color: theme.colors.onSurface }]}>
            {t("components.locationPicker.addLocation")}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = UnistylesSheet.create((theme) => ({
  // ── Map preview card ───────────────────────────────────────────────────
  card: {
    marginHorizontal: H_PAD,
    height: CARD_HEIGHT,
    borderRadius: theme.radius ?? 16,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
  hintBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.shadow,
  },
  hintIcon: {
    color: "white",
    opacity: 0.85,
  },
  hintText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  clearBtnWrap: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  clearIcon: {
    color: "white",
  },

  // ── Placeholder card ───────────────────────────────────────────────────
  placeholder: {
    marginHorizontal: H_PAD,
    height: CARD_HEIGHT,
    borderRadius: theme.radius ?? 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
}))
