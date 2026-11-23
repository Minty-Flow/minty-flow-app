import type { ConfigPlugin } from "expo/config-plugins.js"
import configPlugins from "expo/config-plugins.js"

const { withGradleProperties } = configPlugins

/**
 * expo-sqlite 57.0.5 ships a prebuilt Android AAR with only arm64-v8a, so
 * armeabi-v7a (and x86_64 emulators) crash with "libexpo-sqlite.so not found".
 * Setting any `expo.sqlite.*` property makes Gradle build the module from
 * source for every ABI in `buildArchs`. enableFTS=true is already the default.
 * Drop this once a release ships a full-ABI AAR.
 */
const withSqliteSourceBuild: ConfigPlugin = (config) =>
  withGradleProperties(config, (cfg) => {
    cfg.modResults = cfg.modResults.filter(
      (p) => !(p.type === "property" && p.key === "expo.sqlite.enableFTS"),
    )
    cfg.modResults.push({
      type: "property",
      key: "expo.sqlite.enableFTS",
      value: "true",
    })
    return cfg
  })

export default withSqliteSourceBuild
