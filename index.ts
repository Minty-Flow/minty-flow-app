import "./src/styles/unistyles" // <-- file that initializes Unistyles (MUST be first!)
import "./src/i18n/config" // initialise i18next before any screen calls useTranslation (inlineRequires would otherwise defer it)
import "expo-router/entry"
