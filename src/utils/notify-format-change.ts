import i18n from "~/i18n/config"

/**
 * Date, time and week-start settings are read at format time (not through a
 * hook), so nothing re-renders when they change. Components that call
 * `useTranslation` already re-render on i18next's `languageChanged`, so
 * re-emitting it after the store updates refreshes every formatted date at once.
 */
export function notifyFormatChange(): void {
  i18n.emit("languageChanged", i18n.language)
}
