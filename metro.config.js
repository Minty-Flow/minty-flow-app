const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push("sql")

// Evaluate a module on first use instead of at startup: the ~900-icon map and
// most screens are not needed for the first frame.
config.transformer.getTransformOptions = async () => ({
  transform: { experimentalImportSupport: false, inlineRequires: true },
})

module.exports = config
