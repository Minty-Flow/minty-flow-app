// The map script runs inside a WebView that receives the chosen coordinates, so
// it is pinned to an exact version and checked against its hash. Bumping the
// version means recomputing both hashes (sha384 of the unpkg files).
export const MAPLIBRE_VERSION = "5.24.0"
export const MAPLIBRE_JS_SRI =
  "sha384-5+cfbwT0iiub6VsQAdn6yz16nr6sDiQoHx6tm4O8OVYXHYOxcffFmCJBL0dgdvGp"
export const MAPLIBRE_CSS_SRI =
  "sha384-uTttxo/aOKbdE5RlD/SPzSDoDmNvGlUYPjONi2MN/b7c9HPSvW07OIuyP7uL6jxK"
// Module-level so the WebView prop is referentially stable across re-renders.
export const WEBVIEW_ORIGINS = [
  "https://unpkg.com",
  "https://tiles.openfreemap.org",
  "about:blank",
]
