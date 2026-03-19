import ConfigPlugins from "@expo/config-plugins"

const { withDangerousMod } = ConfigPlugins

import * as fs from "node:fs"
import * as path from "node:path"

/**
 * Expo config plugin to automatically configure WatermelonDB JSI for Android
 * This plugin will:
 * 1. Add watermelondb-jsi module to settings.gradle
 * 2. Add dependency and packaging options to build.gradle
 * 3. Add WatermelonDBJSIPackage to MainApplication.kt
 * 4. Add ProGuard rules
 */
export default function withWatermelonDBJSI(config) {
  // Step 1: Modify settings.gradle
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const settingsGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        "settings.gradle",
      )

      if (fs.existsSync(settingsGradlePath)) {
        let settingsGradle = fs.readFileSync(settingsGradlePath, "utf-8")

        // Check if watermelondb-jsi is already added
        if (!settingsGradle.includes("watermelondb-jsi")) {
          // Add watermelondb-jsi module before the last line
          const watermelondbJSIInclude = `
// WatermelonDB JSI
include ':watermelondb-jsi'
project(':watermelondb-jsi').projectDir =
    new File(rootProject.projectDir, '../node_modules/@nozbe/watermelondb/native/android-jsi')
`

          // Insert before the last line (usually includeBuild or similar)
          settingsGradle = `${settingsGradle.trimEnd()}\n${watermelondbJSIInclude}`
          fs.writeFileSync(settingsGradlePath, settingsGradle)
        }
      }

      return config
    },
  ])

  // Step 2: Modify build.gradle
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const buildGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "build.gradle",
      )

      if (fs.existsSync(buildGradlePath)) {
        let buildGradle = fs.readFileSync(buildGradlePath, "utf-8")

        // Add packaging options for libc++_shared.so
        if (!buildGradle.includes("pickFirst '**/libc++_shared.so'")) {
          // Find the packagingOptions block and add pickFirst
          // Find packagingOptions block - it typically has jniLibs inside
          // Look for the closing brace of jniLibs and add pickFirst after it
          const jniLibsCloseRegex =
            /(packagingOptions\s*\{[^}]*jniLibs\s*\{[^}]*useLegacyPackaging[^}]*\s*\})(\s*\})/s

          if (jniLibsCloseRegex.test(buildGradle)) {
            // Add pickFirst after jniLibs block closes, before packagingOptions closes
            buildGradle = buildGradle.replace(
              jniLibsCloseRegex,
              `$1
        pickFirst '**/libc++_shared.so' // Required for WatermelonDB JSI
    $2`,
            )
          } else {
            // Try to find packagingOptions block without jniLibs
            const packagingOptionsSimpleRegex = /(packagingOptions\s*\{)/s
            if (packagingOptionsSimpleRegex.test(buildGradle)) {
              buildGradle = buildGradle.replace(
                packagingOptionsSimpleRegex,
                `$1
        pickFirst '**/libc++_shared.so' // Required for WatermelonDB JSI`,
              )
            } else {
              // Add packagingOptions block inside android block, before androidResources
              const androidResourcesRegex =
                /(android\s*\{[^}]*)(\s+androidResources)/s
              if (androidResourcesRegex.test(buildGradle)) {
                buildGradle = buildGradle.replace(
                  androidResourcesRegex,
                  `$1    packagingOptions {
        pickFirst '**/libc++_shared.so' // Required for WatermelonDB JSI
    }
$2`,
                )
              } else {
                // Fallback: add before the closing brace of android block
                const androidBlockEndRegex = /(android\s*\{[^}]*)(\s*\})/s
                if (androidBlockEndRegex.test(buildGradle)) {
                  buildGradle = buildGradle.replace(
                    androidBlockEndRegex,
                    `$1    packagingOptions {
        pickFirst '**/libc++_shared.so' // Required for WatermelonDB JSI
    }
$2`,
                  )
                }
              }
            }
          }
        }

        // Add dependency
        if (
          !buildGradle.includes("implementation project(':watermelondb-jsi')")
        ) {
          // Find the dependencies block and add the implementation before the closing brace
          // Use a more careful approach: find the last } that closes the dependencies block
          const dependenciesStart = buildGradle.indexOf("dependencies {")
          if (dependenciesStart !== -1) {
            // Find the matching closing brace by counting braces
            let braceCount = 0
            let insertPos = -1

            for (let i = dependenciesStart; i < buildGradle.length; i++) {
              if (buildGradle[i] === "{") {
                braceCount++
              } else if (buildGradle[i] === "}") {
                braceCount--
                if (braceCount === 0) {
                  insertPos = i
                  break
                }
              }
            }

            if (insertPos !== -1) {
              // Insert before the closing brace, with proper indentation
              const beforeBrace = buildGradle.substring(0, insertPos)
              const afterBrace = buildGradle.substring(insertPos)
              // Find the indentation level by looking at the last non-empty line
              const lines = beforeBrace.split("\n")
              let indent = "    " // default
              for (let i = lines.length - 1; i >= 0; i--) {
                const line = lines[i]
                if (line.trim()) {
                  const match = line.match(/^(\s*)/)
                  if (match) {
                    indent = match[1]
                    break
                  }
                }
              }
              // Ensure we have a newline before if the last line isn't empty
              const needsNewline = !beforeBrace.endsWith("\n")
              buildGradle = `${beforeBrace}${needsNewline ? "\n" : ""}${indent}// WatermelonDB JSI
${indent}implementation project(':watermelondb-jsi')
${afterBrace}`
            }
          }
        }

        fs.writeFileSync(buildGradlePath, buildGradle)
      }

      return config
    },
  ])

  // Step 3: Modify MainApplication.kt
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      // Find MainApplication.kt (could be .kt or .java)
      const packageName = config.android?.package || "com.anonymous.mintyflow"
      const packagePath = packageName.replace(/\./g, path.sep)
      const mainAppKtPath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "java",
        packagePath,
        "MainApplication.kt",
      )

      const mainAppJavaPath = mainAppKtPath.replace(".kt", ".java")

      let mainAppPath = null
      if (fs.existsSync(mainAppKtPath)) {
        mainAppPath = mainAppKtPath
      } else if (fs.existsSync(mainAppJavaPath)) {
        mainAppPath = mainAppJavaPath
      }

      if (mainAppPath) {
        let mainApp = fs.readFileSync(mainAppPath, "utf-8")

        // Add import if not present
        if (
          !mainApp.includes(
            "import com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage",
          )
        ) {
          // Add import after the last expo.modules import
          const lastExpoImportRegex =
            /(import expo\.modules\.[\w.]+\n)(?![\s\S]*import expo\.modules\.)/
          if (lastExpoImportRegex.test(mainApp)) {
            mainApp = mainApp.replace(
              lastExpoImportRegex,
              `$1\nimport com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage\n`,
            )
          } else {
            // Try to find any import statement and add after the last one
            const lastImportRegex = /(import [^\n]+\n)(?![\s\S]*import )/
            if (lastImportRegex.test(mainApp)) {
              mainApp = mainApp.replace(
                lastImportRegex,
                `$1\nimport com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage\n`,
              )
            } else {
              // Add after package declaration
              const packageRegex = /(package\s+[\w.]+\n)/
              if (packageRegex.test(mainApp)) {
                mainApp = mainApp.replace(
                  packageRegex,
                  `$1\nimport com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage\n`,
                )
              }
            }
          }
        }

        // Add package to getPackages() if not present
        if (!mainApp.includes("WatermelonDBJSIPackage()")) {
          // Find getPackages method and add the package
          // Look for the pattern: packages.apply { ... }
          const packagesApplyRegex =
            /(PackageList\(this\)\.packages\.apply\s*\{[\s\S]*?)(\n\s*\})/

          if (packagesApplyRegex.test(mainApp)) {
            // Find the indentation inside the apply block
            const match = mainApp.match(packagesApplyRegex)
            if (match) {
              const insideBlock = match[1]
              // Find indentation by looking at existing lines inside the block
              const lines = insideBlock.split("\n")
              let indent = "              " // default fallback
              // Find a line with content (comment or code) to get indentation
              for (let i = lines.length - 1; i >= 1; i--) {
                const line = lines[i]
                if (line.trim()) {
                  const indentMatch = line.match(/^(\s*)/)
                  if (indentMatch?.[1]) {
                    indent = indentMatch[1]
                    break
                  }
                }
              }
              mainApp = mainApp.replace(
                packagesApplyRegex,
                `$1\n${indent}// Add WatermelonDB JSI package\n${indent}add(WatermelonDBJSIPackage())$2`,
              )
            }
          } else {
            // Try Java syntax
            const packagesJavaRegex =
              /(PackageList\(this\)\.packages[^}]*?)(\n\s*\})/s

            if (packagesJavaRegex.test(mainApp)) {
              const match = mainApp.match(packagesJavaRegex)
              if (match) {
                const insideBlock = match[1]
                const lastLineMatch = insideBlock.match(/\n(\s*)([^\s]|$)/)
                const indent = lastLineMatch
                  ? lastLineMatch[1]
                  : "              "
                mainApp = mainApp.replace(
                  packagesJavaRegex,
                  `$1${indent}// Add WatermelonDB JSI package
${indent}add(new WatermelonDBJSIPackage());
$2`,
                )
              }
            }
          }
        }

        fs.writeFileSync(mainAppPath, mainApp)
      }

      return config
    },
  ])

  // Step 4: Modify proguard-rules.pro
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const proguardPath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "proguard-rules.pro",
      )

      if (fs.existsSync(proguardPath)) {
        let proguard = fs.readFileSync(proguardPath, "utf-8")

        // Add ProGuard rules if not present
        if (!proguard.includes("# WatermelonDB")) {
          proguard += `
# WatermelonDB
-keep class com.nozbe.watermelondb.** { *; }
`
          fs.writeFileSync(proguardPath, proguard)
        }
      }

      return config
    },
  ])

  return config
}
