import { Image } from "expo-image"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { BackHandler } from "react-native"
import PagerView from "react-native-pager-view"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { AppData } from "~/constants/app-data"

const TOTAL_PAGES = 3

interface InfoSlideProps {
  icon: React.ReactNode
  title: string
  description: string
}

function InfoSlide({ icon, title, description }: InfoSlideProps) {
  return (
    <View style={styles.infoSlide}>
      <View style={styles.infoIconBox}>{icon}</View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDescription}>{description}</Text>
      </View>
    </View>
  )
}

export default function OnboardingScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const pagerRef = useRef<PagerView>(null)
  const [currentPage, setCurrentPage] = useState(0)

  useFocusEffect(
    useCallback(() => {
      // Android hardware back button → close app
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        BackHandler.exitApp()
        return true // consume the event
      })
      return () => sub.remove()
    }, []),
  )

  const goToPage = (page: number) => {
    pagerRef.current?.setPage(page)
    // State is updated via onPageSelected — not set here to avoid drift if the
    // PagerView scroll is rejected or interrupted mid-animation.
  }

  const goNext = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1)
    } else {
      router.push("/onboarding/start")
    }
  }

  const nextLabel =
    currentPage === TOTAL_PAGES - 1
      ? t("onboarding.actions.getStarted")
      : t("onboarding.actions.next")

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {/* Page 1 — Welcome */}
        <View key="0" style={styles.page}>
          <InfoSlide
            icon={
              <Image
                source={require("~/assets/images/icon.png")}
                style={styles.appLogoImage}
                contentFit="cover"
              />
            }
            title={AppData.name}
            description={t("onboarding.welcome.subtitle")}
          />
        </View>

        {/* Page 2 — Free & open-source */}
        <View key="1" style={styles.page}>
          <InfoSlide
            icon={<IconSvg name="world-map" size={80} />}
            title={t("onboarding.openSource.title")}
            description={t("onboarding.openSource.description")}
          />
        </View>

        {/* Page 3 — You control your data */}
        <View key="2" style={styles.page}>
          <InfoSlide
            icon={<IconSvg name="shield-checkered" size={80} />}
            title={t("onboarding.privacy.title")}
            description={t("onboarding.privacy.description")}
          />
        </View>
      </PagerView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.dotsContainer}>
          <View
            style={[
              styles.dot,
              currentPage === 0 ? styles.dotActive : styles.dotInactive,
            ]}
          />
          <View
            style={[
              styles.dot,
              currentPage === 1 ? styles.dotActive : styles.dotInactive,
            ]}
          />
          <View
            style={[
              styles.dot,
              currentPage === 2 ? styles.dotActive : styles.dotInactive,
            ]}
          />
        </View>
        <Button onPress={goNext}>
          <Text>{nextLabel}</Text>
          <ChevronIcon
            direction="trailing"
            color={styles.nextButtonIconColor.color}
            size={18}
          />
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },

  // ── Info slides ──────────────────────────────────────
  infoSlide: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 16,
  },
  infoIconBox: {
    width: 160,
    height: 160,
    borderRadius: theme.radius * 2,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
    overflow: "hidden",
  },
  appLogoImage: {
    width: 160,
    height: 160,
  },
  infoTextContainer: {
    gap: 16,
  },
  infoTitle: {
    fontSize: theme.typography.displayMedium.fontSize,
    fontWeight: "700",
    color: theme.colors.primary,
    lineHeight: 44,
  },
  infoDescription: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
    lineHeight: 24,
  },

  // ── Bottom navigation ──────────────────────────────
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  dotsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
  dotInactive: {
    backgroundColor: theme.colors.secondary,
  },
  nextButtonIconColor: {
    color: theme.colors.onPrimary,
  },
}))
