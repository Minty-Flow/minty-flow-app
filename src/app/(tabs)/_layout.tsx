import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { usePagerView } from "react-native-pager-view"
import Animated, {
  createAnimatedComponent,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSymbol, type IconSymbolName } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Tooltip } from "~/components/ui/tooltip"
import { View } from "~/components/ui/view"
import { FAB_BUTTON_STYLE } from "~/constants/fab-button"
import { useButtonPlacementStore } from "~/stores/button-placement.store"
import { DirectionEnum, useLanguageStore } from "~/stores/language.store"
import { NewEnum } from "~/types/new"

import AccountsScreen from "../accounts"
import SettingsScreen from "../settings"
import HomeScreen from "."
import StatsScreen from "./stats-view"

const AnimatedPressable = createAnimatedComponent(Pressable)

type TabConfig = {
  key: string
  component: React.ComponentType
}

type FABOption = {
  icon: IconSymbolName
  color: string
  iconColor: string
  label: string
  onPress: () => void
}

const tabs: TabConfig[] = [
  { key: "home", component: HomeScreen },
  { key: "stats", component: StatsScreen },
  { key: "accounts", component: AccountsScreen },
  { key: "settings", component: SettingsScreen },
]

const INSTANT_TIMING = {
  duration: 80,
  easing: Easing.out(Easing.quad),
}

// Static positions for each FAB option (no translate; same layout as before)
const FAB_OPTION_POSITIONS = [
  { left: 2, top: -78 }, // Top
  { left: 82, top: -38 }, // Top Right
  { left: -78, top: -38 }, // Top Left
]

const AnimatedFABOption = ({
  option,
  index,
  isExpanded,
}: {
  option: FABOption
  index: number
  isExpanded: boolean
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isExpanded ? 1 : 0, INSTANT_TIMING),
  }))

  return (
    <AnimatedPressable
      onPress={option.onPress}
      pointerEvents={isExpanded ? "auto" : "none"}
      style={[
        styles.fabOptionWrapper,
        FAB_OPTION_POSITIONS[index],
        styles.fabOption,
        { backgroundColor: option.color },
        animatedStyle,
      ]}
    >
      <IconSymbol name={option.icon} size={24} color={option.iconColor} />
    </AnimatedPressable>
  )
}

/**
 * Move the shared-value creation + mutation into a hook so mutations
 * happen inside the hook where the values were created. This satisfies
 * the React Compiler requirement and keeps runtime identical.
 */
function useFabAnimation(isExpanded: boolean) {
  const rotation = useDerivedValue(() =>
    withSpring(isExpanded ? 45 : 0, {
      stiffness: 600,
      damping: 20,
      mass: 0.5,
    }),
  )

  const overlayOpacity = useDerivedValue(() =>
    withTiming(isExpanded ? 0.8 : 0, {
      duration: 100,
      easing: Easing.inOut(Easing.quad),
    }),
  )

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }))

  return { rotateStyle, overlayStyle }
  // animateExpand is gone — no longer needed
}

const TabLayout = () => {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
  const {
    AnimatedPagerView,
    ref,
    activePage,
    setPage,
    onPageSelected,
    onPageScroll,
    onPageScrollStateChanged,
  } = usePagerView()

  const [fabExpanded, setFabExpanded] = useState(false)

  // Use the encapsulated animation hook
  const { rotateStyle, overlayStyle } = useFabAnimation(fabExpanded)

  const isActiveTab = (index: number) =>
    activePage === index ? { opacity: 1 } : { opacity: 0.5 }

  const toggleFab = useCallback(() => {
    setFabExpanded((prev) => !prev)
  }, [])

  const router = useRouter()
  const buttonOrder = useButtonPlacementStore((s) => s.order)

  const fabOptionsByType: Record<string, FABOption> = {
    income: {
      icon: "chevron-double-down",
      color: theme.colors.customColors.income,
      iconColor: theme.colors.onError,
      label: t("navigation.fab.income"),
      onPress: () => {
        router.push(`/transaction/${NewEnum.NEW}?type=income`)
        toggleFab()
      },
    },
    expense: {
      icon: "chevron-double-up",
      color: theme.colors.customColors.expense,
      iconColor: theme.colors.onError,
      label: t("navigation.fab.expense"),
      onPress: () => {
        router.push(`/transaction/${NewEnum.NEW}?type=expense`)
        toggleFab()
      },
    },
    transfer: {
      icon: "swap-horizontal",
      color: theme.colors.secondary,
      iconColor: theme.colors.onSecondary,
      label: t("navigation.fab.transfer"),
      onPress: () => {
        router.push(`/transaction/${NewEnum.NEW}?type=transfer`)
        toggleFab()
      },
    },
  }

  const fabOptions: FABOption[] = buttonOrder.map(
    (type) => fabOptionsByType[type],
  )

  const tabBarBottom = 8
  const tabBarHeight = 54
  const fabContainerBottom = tabBarBottom + tabBarHeight / 2

  const isRTL = useLanguageStore((s) => s.isRTL)

  return (
    <View style={styles.container}>
      <AnimatedPagerView
        ref={ref}
        style={styles.pager}
        initialPage={0}
        layoutDirection={isRTL ? DirectionEnum.RTL : DirectionEnum.LTR}
        onPageSelected={onPageSelected}
        onPageScroll={onPageScroll}
        onPageScrollStateChanged={onPageScrollStateChanged}
      >
        {tabs.map((tab) => (
          <tab.component key={tab.key} />
        ))}
      </AnimatedPagerView>

      {/* Tab Bar Background & Icons - Lower Z-Index */}
      <View style={[styles.tabBarContainer, { zIndex: 10 }]}>
        <View
          style={[styles.tabBar, { backgroundColor: theme.colors.secondary }]}
        >
          <Tooltip text={t("navigation.tabs.home")}>
            <Button
              variant="link"
              size="icon"
              onPress={() => setPage(0)}
              style={styles.tabButton}
            >
              <IconSymbol name="circle" style={isActiveTab(0)} />
            </Button>
          </Tooltip>

          <Tooltip text={t("navigation.tabs.statistics")}>
            <Button
              variant="link"
              size="icon"
              onPress={() => setPage(1)}
              style={styles.tabButton}
            >
              <IconSymbol name="chart-box" style={isActiveTab(1)} />
            </Button>
          </Tooltip>

          {/* Placeholder for center button */}
          <View style={{ width: 44 }} />

          <Tooltip text={t("navigation.tabs.accounts")}>
            <Button
              variant="link"
              size="icon"
              onPress={() => setPage(2)}
              style={styles.tabButton}
            >
              <IconSymbol name="wallet-bifold" style={isActiveTab(2)} />
            </Button>
          </Tooltip>

          <Tooltip text={t("navigation.tabs.settings")}>
            <Button
              variant="link"
              size="icon"
              onPress={() => setPage(3)}
              style={styles.tabButton}
            >
              <IconSymbol name="cog" style={isActiveTab(3)} />
            </Button>
          </Tooltip>
        </View>
      </View>

      {/* Overlay - backgroundColor from theme so it updates when theme changes */}
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: theme.colors.surface },
          overlayStyle,
        ]}
        pointerEvents={fabExpanded ? "auto" : "none"}
      >
        <Pressable
          native
          disableRipple
          style={styles.overlayPressable}
          onPress={toggleFab}
        />
      </Animated.View>

      {/* FAB Options & Center Button - Higher Z-Index */}
      <View
        style={[styles.tabBarContainer, { zIndex: 30 }]}
        pointerEvents="box-none"
      >
        {/* FAB Options - disable entire area when collapsed so invisible options don't receive touches */}
        <View
          style={[styles.fabOptionsContainer, { bottom: fabContainerBottom }]}
          pointerEvents={fabExpanded ? "box-none" : "none"}
          native
        >
          {fabOptions.map((option, index) => (
            <AnimatedFABOption
              key={option.label}
              option={option}
              index={index}
              isExpanded={fabExpanded}
            />
          ))}
        </View>

        {/* Center Button Wrapper - Overlay style positioning to match exactly */}
        <View
          style={[styles.tabBar, { backgroundColor: "transparent" }]}
          pointerEvents="box-none"
        >
          {/* Side placeholders to ensure center button is centered exactly as before */}
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />

          <Tooltip text={t("navigation.tabs.addTransaction")}>
            <Animated.View style={rotateStyle}>
              <Button
                size="icon"
                onPress={toggleFab}
                style={[
                  styles.centerButton,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <IconSymbol
                  name="plus"
                  size={28}
                  color={theme.colors.onPrimary}
                />
              </Button>
            </Animated.View>
          </Tooltip>

          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  )
}

export default TabLayout

const styles = StyleSheet.create((t) => ({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },

  // Overlay (backgroundColor set inline from theme so it reacts to theme change)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  overlayPressable: {
    flex: 1,
  },

  // Tab bar container
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "transparent",
    pointerEvents: "box-none",
    // marginBottom: insetBottom,
  },

  // FAB options
  fabOptionsContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    pointerEvents: "box-none",
    width: 60,
    height: 60,
  },
  fabOptionWrapper: {
    position: "absolute",
    pointerEvents: "box-none",
  },
  fabOption: {
    ...FAB_BUTTON_STYLE,
    pointerEvents: "auto",
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 54,
    width: "90%",
    borderRadius: t.colors.radius,
    marginBottom: 8,
    pointerEvents: "auto",
    overflow: "visible",
  },

  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  centerButton: {
    borderRadius: t.colors.radius,
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    zIndex: 20,
    flexShrink: 0,
  },
}))
