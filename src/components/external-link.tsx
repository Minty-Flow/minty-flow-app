import { type Href, Link } from "expo-router"
import { openBrowserAsync, WebBrowserPresentationStyle } from "expo-web-browser"
import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"
import { Platform } from "react-native"

import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string
}

export const ExternalLink = ({ href, onPress, ...rest }: Props) => {
  const { t } = useTranslation()
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as Href}
      onPress={async (event) => {
        onPress?.(event)

        if (Platform.OS !== "web") {
          const isExternal = /^(https?:)/.test(href)
          if (!isExternal) return

          event.preventDefault()

          try {
            await openBrowserAsync(href, {
              presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
            })
          } catch (e) {
            Toast.warn({ title: t("common.failedToOpenLink") })
            logger.warn("Failed to open browser", { e })
          }
        }
      }}
    />
  )
}
