import type { ConfigPlugin } from "expo/config-plugins.js"
import configPlugins from "expo/config-plugins.js"

import fs from "node:fs"
import path from "node:path"

const { withAppBuildGradle, withDangerousMod, withGradleProperties } =
  configPlugins

const SIGNING_CONFIG_BLOCK = `        release {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }`

const KEYSTORE_FILE = "minty-flow-upload.keystore"
const KEY_ALIAS = "my-key-alias"

type KeystoreConfig = {
  storeFile: string
  keyAlias: string
  storePassword: string
  keyPassword: string
}

let envLoaded = false
function loadDotEnvLocal(projectRoot: string) {
  if (envLoaded) return
  envLoaded = true
  const envPath = path.join(projectRoot, ".env.local")
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "")
    if (!(key in process.env)) process.env[key] = value
  }
}

function loadKeystoreConfig(projectRoot: string): KeystoreConfig {
  loadDotEnvLocal(projectRoot)
  const storePassword = process.env.MYAPP_UPLOAD_STORE_PASSWORD
  const keyPassword = process.env.MYAPP_UPLOAD_KEY_PASSWORD
  if (!storePassword || !keyPassword) {
    throw new Error(
      "with-android-release-signing: missing MYAPP_UPLOAD_STORE_PASSWORD or MYAPP_UPLOAD_KEY_PASSWORD. " +
        "Set both in .env.local (gitignored) or your shell.",
    )
  }
  return {
    storeFile: KEYSTORE_FILE,
    keyAlias: KEY_ALIAS,
    storePassword,
    keyPassword,
  }
}

const withReleaseSigningConfig: ConfigPlugin = (config) =>
  withAppBuildGradle(config, (cfg) => {
    let src = cfg.modResults.contents

    if (!src.includes("signingConfigs.release")) {
      src = src.replace(
        /(signingConfigs\s*\{[\s\S]*?debug\s*\{[\s\S]*?\}\s*)\}/,
        `$1\n${SIGNING_CONFIG_BLOCK}\n    }`,
      )
    }

    src = src.replace(
      /release\s*\{\s*\/\/ Caution[^}]*?signingConfig signingConfigs\.debug/,
      "release {\n            signingConfig signingConfigs.release",
    )
    src = src.replace(
      /(release\s*\{[^}]*?)signingConfig signingConfigs\.debug/,
      "$1signingConfig signingConfigs.release",
    )

    cfg.modResults.contents = src
    return cfg
  })

const withReleaseGradleProperties: ConfigPlugin = (config) =>
  withGradleProperties(config, (cfg) => {
    const keystore = loadKeystoreConfig(cfg.modRequest.projectRoot)
    const entries: [string, string][] = [
      ["MYAPP_UPLOAD_STORE_FILE", keystore.storeFile],
      ["MYAPP_UPLOAD_KEY_ALIAS", keystore.keyAlias],
      ["MYAPP_UPLOAD_STORE_PASSWORD", keystore.storePassword],
      ["MYAPP_UPLOAD_KEY_PASSWORD", keystore.keyPassword],
    ]
    for (const [key, value] of entries) {
      const existing = cfg.modResults.find(
        (item): item is { type: "property"; key: string; value: string } =>
          item.type === "property" && item.key === key,
      )
      if (existing) {
        existing.value = value
      } else {
        cfg.modResults.push({ type: "property", key, value })
      }
    }
    return cfg
  })

const withKeystoreCopy: ConfigPlugin = (config) =>
  withDangerousMod(config, [
    "android",
    async (cfg) => {
      const source = path.join(cfg.modRequest.projectRoot, KEYSTORE_FILE)
      const destDir = path.join(cfg.modRequest.platformProjectRoot, "app")
      const dest = path.join(destDir, KEYSTORE_FILE)

      if (!fs.existsSync(source)) {
        throw new Error(
          `with-android-release-signing: keystore file not found at ${source}`,
        )
      }
      fs.mkdirSync(destDir, { recursive: true })
      fs.copyFileSync(source, dest)
      return cfg
    },
  ])

const withAndroidReleaseSigning: ConfigPlugin = (config) => {
  config = withKeystoreCopy(config)
  config = withReleaseGradleProperties(config)
  config = withReleaseSigningConfig(config)
  return config
}

export default withAndroidReleaseSigning
