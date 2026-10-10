import * as Haptics from "expo-haptics"
import * as Location from "expo-location"
import { useEffect, useMemo, useReducer, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  StyleSheet as UnistylesSheet,
  useUnistyles,
} from "react-native-unistyles"
import { WebView, type WebViewMessageEvent } from "react-native-webview"

import { IconSvg } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionLocation } from "~/types/transactions"
import { Toast } from "~/utils/toast"

// Only the map's starting view when nothing is saved and GPS hasn't answered yet.
const DEFAULT_MAP_CENTER = { latitude: 37.7749, longitude: -122.4194 }
const LOCATE_TIMEOUT_MS = 10_000
// A cached position this recent is good enough to move the map immediately.
const LAST_KNOWN_MAX_AGE_MS = 5 * 60_000
// Module-level so the WebView prop is referentially stable across re-renders.
const WEBVIEW_ORIGINS = [
  "https://unpkg.com",
  "https://tiles.openfreemap.org",
  "about:blank",
]
interface LocationPickerModalProps {
  visible: boolean
  initialLocation?: TransactionLocation | null
  onConfirm: (location: TransactionLocation) => void
  /** Clears the saved location. The Delete button only shows when one exists. */
  onDelete?: () => void
  onRequestClose: () => void
}
type LocationContentState = {
  mapHtml: string | null
  coords: {
    latitude: number
    longitude: number
  } | null
}
function mergeReducer<S>(state: S, update: Partial<S>): S {
  return { ...state, ...update }
}
type WebViewMapMessage = {
  type: string
  lat: number
  lng: number
}
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

    // Called from React Native via injectJavaScript (more reliable than
    // postMessage, whose delivery differs between Android and iOS WebViews).
    window.flyTo = function (lat, lng) {
      map.flyTo({ center: [lng, lat], zoom: 15 });
    };
  </script>
</body>
</html>`
}
// ---------------------------------------------------------------------------
// Async helpers — defined OUTSIDE the component so React Compiler never sees
// try/finally inside component scope.
// (Compiler limitation: BuildHIR::lowerStatement can't handle try/finally)
// ---------------------------------------------------------------------------
type LocateResult =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; reason: "permission" | "services" | "unavailable" }

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms)
    promise.then(
      (v) => {
        clearTimeout(timer)
        resolve(v)
      },
      (e) => {
        clearTimeout(timer)
        reject(e)
      },
    )
  })
}

type Coords = { latitude: number; longitude: number }

/**
 * Real device position, or the reason there isn't one — never a fake fallback.
 * Progressive: a cached fix (instant) is reported through `onFix` first so the
 * map moves right away, then the fresh fix refines it.
 */
async function locateDevice(
  onFix: (coords: Coords) => void,
): Promise<LocateResult> {
  try {
    let { status } = await Location.getForegroundPermissionsAsync()
    if (status !== Location.PermissionStatus.GRANTED) {
      status = (await Location.requestForegroundPermissionsAsync()).status
    }
    if (status !== Location.PermissionStatus.GRANTED) {
      return { ok: false, reason: "permission" }
    }
    if (!(await Location.hasServicesEnabledAsync())) {
      return { ok: false, reason: "services" }
    }
    const last = await Location.getLastKnownPositionAsync({
      maxAge: LAST_KNOWN_MAX_AGE_MS,
    })
    if (last) {
      onFix({
        latitude: last.coords.latitude,
        longitude: last.coords.longitude,
      })
    }
    try {
      const pos = await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        LOCATE_TIMEOUT_MS,
      )
      const fresh = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }
      onFix(fresh)
      return { ok: true, ...fresh }
    } catch {
      // No fresh fix in time (indoors, cold GPS): the cached one already moved the map.
      return last
        ? {
            ok: true,
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
          }
        : { ok: false, reason: "unavailable" }
    }
  } catch {
    return { ok: false, reason: "unavailable" }
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
  onDelete,
  onRequestClose,
}: Omit<LocationPickerModalProps, "visible">) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const webviewRef = useRef<WebView>(null)
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mapReadyRef = useRef(false)
  const pendingFlyRef = useRef<{ latitude: number; longitude: number } | null>(
    null,
  )
  const [address, setAddress] = useState<string | null>(null)
  // With no saved location we start on GPS: confirm stays off until the first fix.
  const [awaitingFirstFix, setAwaitingFirstFix] = useState(!initialLocation)
  // Button spinner only; the footer and Confirm don't change on later presses.
  const [isLocating, setIsLocating] = useState(false)
  const [locState, setLocState] = useReducer(
    mergeReducer<LocationContentState>,
    initialLocation, // passed as the seed
    (init) => {
      const initLat = init?.latitude ?? DEFAULT_MAP_CENTER.latitude
      const initLng = init?.longitude ?? DEFAULT_MAP_CENTER.longitude
      return {
        mapHtml: buildMaplibreHtml(initLat, initLng),
        coords: { latitude: initLat, longitude: initLng },
      }
    },
  )
  // Same object across re-renders: a fresh `source` object makes the WebView reload (the flash).
  const webSource = useMemo(
    () => ({ html: locState.mapHtml ?? "" }),
    [locState.mapHtml],
  )
  const triggerReverseGeocode = (lat: number, lng: number) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
    // async/await with try/finally moved into fetchReverseGeocode() above
    geocodeTimer.current = setTimeout(() => {
      fetchReverseGeocode(lat, lng).then((result) => setAddress(result))
    }, 800)
  }
  const flyTo = (coords: { latitude: number; longitude: number }) => {
    if (!mapReadyRef.current) {
      pendingFlyRef.current = coords
      return
    }
    webviewRef.current?.injectJavaScript(
      `window.flyTo(${Number(coords.latitude)}, ${Number(coords.longitude)}); true;`,
    )
  }
  const locate = async () => {
    setIsLocating(true)
    const result = await locateDevice((fix) => {
      setAwaitingFirstFix(false)
      flyTo(fix)
    })
    setIsLocating(false)
    setAwaitingFirstFix(false)
    if (result.ok) return
    Toast.warn({
      title: t(
        result.reason === "permission"
          ? "components.locationPicker.permissionDenied"
          : result.reason === "services"
            ? "components.locationPicker.servicesOff"
            : "components.locationPicker.unavailable",
      ),
    })
  }
  // Start on the user's position when there is no saved location.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    if (!initialLocation) void locate()
    return () => {
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
    }
  }, [])
  const handleMessage = (event: WebViewMessageEvent) => {
    const data = parseWebViewMessage(event.nativeEvent.data)
    if (!data) return
    if (data.type === "map_loaded") {
      mapReadyRef.current = true
      if (pendingFlyRef.current) {
        const pending = pendingFlyRef.current
        pendingFlyRef.current = null
        flyTo(pending)
      }
    }
    if (data.type === "pin_moved" || data.type === "map_loaded") {
      setLocState({ coords: { latitude: data.lat, longitude: data.lng } })
      triggerReverseGeocode(data.lat, data.lng)
    }
    if (data.type === "pin_moved") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }
  const handleConfirm = () => {
    if (!locState.coords) return
    onConfirm({
      latitude: locState.coords.latitude,
      longitude: locState.coords.longitude,
      address,
    })
  }
  const footerLabel = awaitingFirstFix
    ? t("components.locationPicker.gettingLocation")
    : (address ??
      (locState.coords
        ? `${locState.coords.latitude.toFixed(5)}, ${locState.coords.longitude.toFixed(5)}`
        : t("components.locationPicker.tapOrDrag")))
  return (
    <View style={styles.container}>
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
            source={webSource}
            onMessage={handleMessage}
            javaScriptEnabled
            domStorageEnabled
            nestedScrollEnabled
            originWhitelist={WEBVIEW_ORIGINS}
          />

          <Pressable
            onPress={locate}
            disabled={isLocating}
            hitSlop={8}
            style={styles.fabMyLocation}
          >
            {isLocating ? (
              <ActivityIndicatorMinty size="small" />
            ) : (
              <IconSvg name="current-location" size={24} />
            )}
          </Pressable>
        </View>
      )}

      {/* Footer: address/coords + Cancel / Delete / Confirm */}
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
            variant="ghost"
            onPress={onRequestClose}
            style={styles.actionBtn}
          >
            <Text variant="default">{t("common.actions.cancel")}</Text>
          </Button>
          {onDelete && initialLocation && (
            <Button variant="ghost" onPress={onDelete} style={styles.actionBtn}>
              <Text variant="default" style={{ color: theme.colors.error }}>
                {t("common.actions.delete")}
              </Text>
            </Button>
          )}
          <Button
            variant="default"
            onPress={handleConfirm}
            disabled={!locState.coords || awaitingFirstFix}
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
  onDelete,
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
        onDelete={onDelete}
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
    borderBottomColor: `${t.colors.semantic.semi}30`,
    backgroundColor: t.colors.surface,
  },
  title: {
    ...t.typography.titleSmall,
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
    fontSize: t.typography.bodyLarge.fontSize,
    color: t.colors.semantic.semi,
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
    borderTopColor: `${t.colors.semantic.semi}30`,
    backgroundColor: t.colors.surface,
  },
  addressText: {
    fontSize: t.typography.bodyMedium.fontSize,
    textAlign: "center",
    color: t.colors.semantic.semi,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
  },
}))
