import { type Ref, useMemo } from "react"
import { StyleSheet } from "react-native-unistyles"
import { WebView, type WebViewMessageEvent } from "react-native-webview"

import {
  MAPLIBRE_CSS_SRI,
  MAPLIBRE_JS_SRI,
  MAPLIBRE_VERSION,
  WEBVIEW_ORIGINS,
} from "~/components/transaction/location-picker-modal"
import type { SpendingPlace } from "~/database/drizzle/read-models/stats-extras-data"

interface SpendingMapProps {
  places: SpendingPlace[]
  color: string
  /** Called when the map script or its tiles fail to load (offline). */
  onError: () => void
  ref?: Ref<WebView>
}

/**
 * Only numbers reach the page (no addresses), so nothing user-typed is
 * interpolated into the script.
 */
function buildSpendingMapHtml(places: SpendingPlace[], color: string): string {
  const features = places.map((p) => ({
    type: "Feature",
    properties: { total: p.total },
    geometry: {
      type: "Point",
      coordinates: [Number(p.longitude), Number(p.latitude)],
    },
  }))
  const safeColor = /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : "#0EA5E9"
  const max = Math.max(1, ...places.map((p) => p.total))
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css" integrity="${MAPLIBRE_CSS_SRI}" crossorigin="anonymous"/>
  <script src="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js" integrity="${MAPLIBRE_JS_SRI}" crossorigin="anonymous"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body, #map { width:100%; height:100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    function fail() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error' }));
    }
    if (typeof maplibregl === 'undefined') {
      fail();
    } else {
      const data = { type: 'FeatureCollection', features: ${JSON.stringify(features)} };
      const map = new maplibregl.Map({
        container: 'map',
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: data.features[0].geometry.coordinates,
        zoom: 12,
        attributionControl: { compact: true }
      });
      let loaded = false;
      map.on('error', () => { if (!loaded) fail(); });
      map.on('load', () => {
        loaded = true;
        map.addSource('places', {
          type: 'geojson',
          data: data,
          cluster: true,
          clusterRadius: 40,
          clusterProperties: { total: ['+', ['get', 'total']] }
        });
        map.addLayer({
          id: 'places',
          type: 'circle',
          source: 'places',
          paint: {
            'circle-color': '${safeColor}',
            'circle-opacity': 0.55,
            'circle-stroke-color': '${safeColor}',
            'circle-stroke-width': 2,
            'circle-radius': ['interpolate', ['linear'], ['sqrt', ['/', ['get', 'total'], ${max}]], 0, 8, 1, 28]
          }
        });
        const bounds = new maplibregl.LngLatBounds();
        data.features.forEach((f) => bounds.extend(f.geometry.coordinates));
        map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 0 });
      });
      window.flyTo = function (lat, lng) {
        map.flyTo({ center: [lng, lat], zoom: 16 });
      };
    }
  </script>
</body>
</html>`
}

export function SpendingMap({ places, color, onError, ref }: SpendingMapProps) {
  // Rebuild only when the points change, not on every parent render.
  const signature = places
    .map((p) => `${p.latitude},${p.longitude},${p.total}`)
    .join("|")
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on signature
  const source = useMemo(
    () => ({ html: buildSpendingMapHtml(places, color) }),
    [signature, color],
  )
  const handleMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent.data.includes('"error"')) onError()
  }
  return (
    <WebView
      ref={ref}
      style={styles.map}
      source={source}
      onMessage={handleMessage}
      onError={onError}
      javaScriptEnabled
      nestedScrollEnabled
      originWhitelist={WEBVIEW_ORIGINS}
    />
  )
}

const styles = StyleSheet.create(() => ({
  map: {
    flex: 1,
  },
}))
