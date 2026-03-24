import * as Haptics from "expo-haptics"
import * as Location from "expo-location"
import { useCallback, useReducer, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet as UnistylesSheet } from "react-native-unistyles"
import { WebView, type WebViewMessageEvent } from "react-native-webview"

import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionLocation } from "~/types/transactions"

interface LocationPickerModalProps {
  visible: boolean
  initialLocation?: TransactionLocation | null
  onConfirm: (location: TransactionLocation) => void
  onRequestClose: () => void
}

type LocationContentState = {
  mapHtml: string | null
  coords: { latitude: number; longitude: number } | null
  gpsCoords: { latitude: number; longitude: number } | null
}

function mergeReducer<S>(state: S, update: Partial<S>): S {
  return { ...state, ...update }
}

// Add this helper OUTSIDE the component, next to fetchGpsCoords and fetchReverseGeocode:
type WebViewMapMessage = { type: string; lat: number; lng: number }

function parseWebViewMessage(raw: string): WebViewMapMessage | null {
  try {
    return JSON.parse(raw) as WebViewMapMessage
  } catch {
    return null
  }
}

/**
 * Generates self-contained MapLibre GL HTML with a static center-pin crosshair.
 * The user pans the map under the pin — much more precise for thumb-driven navigation.
 */
function buildMaplibreHtml(lat: number, lng: number): string {
  const safeLat = Number(lat)
  const safeLng = Number(lng)
  if (!Number.isFinite(safeLat) || !Number.isFinite(safeLng)) {
    throw new Error(`Invalid coordinates: ${lat}, ${lng}`)
  }
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css"/>
  <script src="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: rgba(0,0,0,0); }
    html, body, #map { width:100%; height:100%; }
    body { -webkit-user-select: none; user-select: none; }
    #pin {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -100%);
      pointer-events: none;
      z-index: 2;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
    }
    #pin.lifting { transform: translate(-50%, -120%) scale(1.15); }
    #pin-dot {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 10px; height: 10px;
      border-radius: 50%;
      background: rgba(14,165,233,0.3);
      pointer-events: none;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="pin">
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="#0EA5E9"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  </div>
  <div id="pin-dot"></div>
  <script>
    maplibregl.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
      false
    );

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [${safeLng}, ${safeLat}],
      zoom: 15
    });

    const pin = document.getElementById('pin');

    function postCoords(type) {
      const c = map.getCenter();
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: type, lat: c.lat, lng: c.lng })
      );
    }

    let initialLoad = true;
    map.on('moveend', () => {
      const type = initialLoad ? 'map_loaded' : 'pin_moved';
      initialLoad = false;
      postCoords(type);
    });

    map.on('dragstart', () => pin.classList.add('lifting'));
    map.on('dragend', () => pin.classList.remove('lifting'));

    function onRNMessage(raw) {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'reset_pin') {
          map.flyTo({ center: [msg.lng, msg.lat], zoom: 15 });
        }
      } catch (_) {}
    }
    document.addEventListener('message', (e) => onRNMessage(e.data));
    window.addEventListener('message', (e) => onRNMessage(e.data));
  </script>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Async helpers — defined OUTSIDE the component so React Compiler never sees
// try/finally inside component scope.
// (Compiler limitation: BuildHIR::lowerStatement can't handle try/finally)
// ---------------------------------------------------------------------------
async function fetchGpsCoords(): Promise<{
  latitude: number
  longitude: number
}> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== Location.PermissionStatus.GRANTED) {
      return { latitude: 37.7749, longitude: -122.4194 }
    }
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
  } catch {
    return { latitude: 37.7749, longitude: -122.4194 }
  }
}

async function fetchReverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    })
    if (results.length > 0) {
      const r = results[0]
      const parts = [r.name, r.city].filter(Boolean)
      return parts.join(", ") || null
    }
    return null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// LocationPickerContent
// ---------------------------------------------------------------------------
function LocationPickerContent({
  initialLocation,
  onConfirm,
  onRequestClose,
}: Omit<LocationPickerModalProps, "visible">) {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const webviewRef = useRef<WebView>(null)
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [address, setAddress] = useState<string | null>(null)

  const [locState, setLocState] = useReducer(
    mergeReducer<LocationContentState>,
    initialLocation, // passed as the seed
    (init) => {
      const initLat = init?.latitude ?? 37.7749
      const initLng = init?.longitude ?? -122.4194
      return {
        mapHtml: buildMaplibreHtml(initLat, initLng),
        coords: { latitude: initLat, longitude: initLng },
        gpsCoords: null,
      }
    },
  )

  const triggerReverseGeocode = useCallback((lat: number, lng: number) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
    // async/await with try/finally moved into fetchReverseGeocode() above
    geocodeTimer.current = setTimeout(() => {
      fetchReverseGeocode(lat, lng).then((result) => setAddress(result))
    }, 800)
  }, [])

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const data = parseWebViewMessage(event.nativeEvent.data)
      if (!data) return
      if (data.type === "pin_moved" || data.type === "map_loaded") {
        setLocState({ coords: { latitude: data.lat, longitude: data.lng } })
        triggerReverseGeocode(data.lat, data.lng)
      }
      if (data.type === "pin_moved") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    },
    [triggerReverseGeocode],
  )

  const handleResetToGps = useCallback(async () => {
    // Use cached coords if already fetched
    let gps = locState.gpsCoords
    if (!gps) {
      gps = await fetchGpsCoords()
      setLocState({ gpsCoords: gps })
    }
    webviewRef.current?.postMessage(
      JSON.stringify({
        type: "reset_pin",
        lat: gps.latitude,
        lng: gps.longitude,
      }),
    )
  }, [locState.gpsCoords])

  const handleConfirm = useCallback(() => {
    if (!locState.coords) return
    onConfirm({
      latitude: locState.coords.latitude,
      longitude: locState.coords.longitude,
      address,
    })
  }, [onConfirm, locState.coords, address])

  const footerLabel =
    address ??
    (locState.coords
      ? `${locState.coords.latitude.toFixed(5)}, ${locState.coords.longitude.toFixed(5)}`
      : t("components.locationPicker.tapOrDrag"))

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top + 10, 20) }]}
      >
        <Text style={styles.title}>{t("components.locationPicker.title")}</Text>
      </View>

      {/* Map + floating My Location FAB */}
      {!locState.mapHtml ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicatorMinty />
          <Text style={styles.loadingText}>
            {t("components.locationPicker.gettingLocation")}
          </Text>
        </View>
      ) : (
        <View style={styles.mapWrapper}>
          <WebView
            ref={webviewRef}
            style={styles.map}
            source={{ html: locState.mapHtml ?? "" }}
            onMessage={handleMessage}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={[
              "https://unpkg.com",
              "https://tiles.openfreemap.org",
              "about:blank",
            ]}
          />

          <Pressable
            onPress={handleResetToGps}
            hitSlop={8}
            style={styles.fabMyLocation}
          >
            <IconSvg name="current-location" size={24} />
          </Pressable>
        </View>
      )}

      {/* Footer: address/coords + Cancel/Confirm */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 10, 20) },
        ]}
      >
        <Text style={styles.addressText} numberOfLines={1}>
          {footerLabel}
        </Text>
        <View style={styles.actions}>
          <Button
            variant="outline"
            size="lg"
            onPress={onRequestClose}
            style={styles.actionBtn}
          >
            <Text variant="default">{t("common.actions.cancel")}</Text>
          </Button>
          <Button
            variant="default"
            size="lg"
            onPress={handleConfirm}
            disabled={!locState.coords}
            style={styles.actionBtn}
          >
            <Text variant="default">{t("common.actions.confirm")}</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export function LocationPickerModal({
  visible,
  initialLocation,
  onConfirm,
  onRequestClose,
}: LocationPickerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={onRequestClose}
    >
      <LocationPickerContent
        initialLocation={initialLocation}
        onConfirm={onConfirm}
        onRequestClose={onRequestClose}
      />
    </Modal>
  )
}

const styles = UnistylesSheet.create((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.surface,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${t.colors.customColors.semi}30`,
    backgroundColor: t.colors.surface,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: t.colors.onSurface,
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: t.colors.surface,
  },
  loadingText: {
    fontSize: 15,
    color: t.colors.customColors.semi,
  },
  fabMyLocation: {
    position: "absolute",
    bottom: 70,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surface,
    shadowColor: t.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: `${t.colors.customColors.semi}30`,
    backgroundColor: t.colors.surface,
  },
  addressText: {
    fontSize: 13,
    textAlign: "center",
    color: t.colors.customColors.semi,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
  },
}))
