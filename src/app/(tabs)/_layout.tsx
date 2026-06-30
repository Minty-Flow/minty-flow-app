import { useRouter } from "expo-router"
import { Fragment, useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { View as RNView } from "react-native"
import { usePagerView } from "react-native-pager-view"
import Animated, {
  createAnimatedComponent,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Tooltip } from "~/components/ui/tooltip"
import { View } from "~/components/ui/view"
import { FAB_BUTTON_STYLE } from "~/constants/fab-button"
import { DirectionEnum } from "~/i18n/language.constants"
import { useButtonPlacementStore } from "~/stores/button-placement.store"
import { useLanguageStore } from "~/stores/language.store"
import { NewEnum } from "~/types/new"
import { TransactionTypeEnum } from "~/types/transactions"

import AccountsScreen from "../accounts"
import SettingsScreen from "../settings"
import HomeScreen from "."
import StatsScreen from "./stats-view"

const AnimatedPressable = createAnimatedComponent(Pressable)

type FABOption = {
  icon: IconSvgName
  color: string
  iconColor: string
  label: string
  onPress: () => void
}

const TABS = [
  {
    key: "home",
    icon: "circle-outline",
    label: "navigation.tabs.home",
    component: HomeScreen,
  },
  {
    key: "stats",
    icon: "graph-outline",
    label: "navigation.tabs.statistics",
    component: StatsScreen,
  },
  {
    key: "accounts",
    icon: "wallet-outline",
    label: "navigation.tabs.accounts",
    component: AccountsScreen,
  },
  {
    key: "settings",
    icon: "settings-outline",
    label: "navigation.tabs.settings",
    component: SettingsScreen,
  },
] as const

const CENTER_SPACER_INDEX = 2

const TAB_BAR_BOTTOM = 8
const TAB_BAR_HEIGHT = 54
const FAB_OPTIONS_BOTTOM = TAB_BAR_BOTTOM + TAB_BAR_HEIGHT / 2
const CENTER_FAB_BOTTOM = TAB_BAR_BOTTOM + 5

const FAB_OPTION_POSITIONS = [
  { left: 2, top: -78 },
  { left: 82, top: -38 },
  { left: -78, top: -38 },
]

const OPEN_SPRING = { stiffness: 260, damping: 18, mass: 0.7 }
const CLOSE_TIMING = {
  duration: 140,
  easing: Easing.in(Easing.quad),
}
const STAGGER_MS = 35

const AnimatedFABOption = ({
  option,
  index,
  isExpanded,
}: {
  option: FABOption
  index: number
  isExpanded: boolean
}) => {
  const progress = useSharedValue(0)
  const pos = FAB_OPTION_POSITIONS[index]

  useEffect(() => {
    if (isExpanded) {
      progress.value = withDelay(index * STAGGER_MS, withSpring(1, OPEN_SPRING))
    } else {
      progress.value = withTiming(0, CLOSE_TIMING)
    }
  }, [isExpanded, index, progress])

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value
    return {
      opacity: p,
      transform: [
        { translateX: pos.left * (p - 1) },
        { translateY: pos.top * (p - 1) },
        { scale: p },
      ],
    }
  })

  return (
    <Tooltip text={option.label}>
      <AnimatedPressable
        onPress={option.onPress}
        pointerEvents={isExpanded ? "auto" : "none"}
        style={[
          styles.fabOptionWrapper,
          pos,
          styles.fabOption,
          { backgroundColor: option.color },
          animatedStyle,
        ]}
      >
        <IconSvg name={option.icon} size={24} color={option.iconColor} />
      </AnimatedPressable>
    </Tooltip>
  )
}

function useFabAnimation(isExpanded: boolean) {
  const rotation = useSharedValue(0)
  const overlayOpacity = useSharedValue(0)

  useEffect(() => {
    rotation.value = withSpring(isExpanded ? 45 : 0, {
      stiffness: 600,
      damping: 20,
      mass: 0.5,
    })

    overlayOpacity.value = withTiming(isExpanded ? 0.8 : 0, {
      duration: 150,
      easing: Easing.inOut(Easing.quad),
    })
  }, [isExpanded, overlayOpacity, rotation])

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }))

  return { rotateStyle, overlayStyle }
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

  const { rotateStyle, overlayStyle } = useFabAnimation(fabExpanded)

  const router = useRouter()

  const buttonOrder = useButtonPlacementStore((s) => s.order)

  const isRTL = useLanguageStore((s) => s.isRTL)

  const isActiveTab = (index: number) =>
    activePage === index ? { opacity: 1 } : { opacity: 0.5 }

  const toggleFab = useCallback(() => {
    setFabExpanded((prev) => !prev)
  }, [])

  const fabOptionsByType: Record<string, FABOption> = {
    income: {
      icon: "chevrons-down-outline",
      color: theme.colors.semantic.income,
      iconColor: theme.colors.onError,
      label: t("navigation.fab.income"),
      onPress: () => {
        router.push(
          `/transaction/${NewEnum.NEW}?type=${TransactionTypeEnum.INCOME}`,
        )
        toggleFab()
      },
    },

    expense: {
      icon: "chevrons-up-outline",
      color: theme.colors.semantic.expense,
      iconColor: theme.colors.onError,
      label: t("navigation.fab.expense"),
      onPress: () => {
        router.push(
          `/transaction/${NewEnum.NEW}?type=${TransactionTypeEnum.EXPENSE}`,
        )
        toggleFab()
      },
    },

    transfer: {
      icon: "arrows-right-left-outline",
      color: theme.colors.secondary,
      iconColor: theme.colors.onSecondary,
      label: t("navigation.fab.transfer"),
      onPress: () => {
        router.push(
          `/transaction/${NewEnum.NEW}?type=${TransactionTypeEnum.TRANSFER}`,
        )
        toggleFab()
      },
    },
  }

  const fabOptions: FABOption[] = buttonOrder.map(
    (type) => fabOptionsByType[type],
  )

  return (
    <View style={styles.container}>
      {/* PAGER */}
      <AnimatedPagerView
        collapsable={false}
        ref={ref}
        style={styles.pager}
        initialPage={0}
        layoutDirection={isRTL ? DirectionEnum.RTL : DirectionEnum.LTR}
        onPageSelected={onPageSelected}
        onPageScroll={onPageScroll}
        onPageScrollStateChanged={onPageScrollStateChanged}
      >
        {TABS.map((tab) => (
          <tab.component key={tab.key} />
        ))}
      </AnimatedPagerView>

      <RNView
        collapsable={false}
        pointerEvents="box-none"
        style={styles.floatingLayer}
      >
        {/* TAB CONTROLS */}
        <View style={styles.tabBarContainer} pointerEvents="box-none">
          <View
            style={[styles.tabBar, { backgroundColor: theme.colors.secondary }]}
          >
            {TABS.map((tab, i) => (
              <Fragment key={tab.key}>
                {i === CENTER_SPACER_INDEX && <View style={styles.tabSpacer} />}
                <Tooltip text={t(tab.label)}>
                  <Button
                    variant="link"
                    size="icon"
                    onPress={() => setPage(i)}
                    style={styles.tabButton}
                  >
                    <IconSvg name={tab.icon} style={isActiveTab(i)} />
                  </Button>
                </Tooltip>
              </Fragment>
            ))}
          </View>
        </View>

        {/* OVERLAY — sits between tab controls and FAB, press to close */}
        <AnimatedPressable
          native
          disableRipple
          onPress={toggleFab}
          pointerEvents={fabExpanded ? "auto" : "none"}
          style={[
            styles.overlay,
            { backgroundColor: theme.colors.surface },
            overlayStyle,
          ]}
        />

        {/* FAB LAYER */}
        <View style={styles.tabBarContainer} pointerEvents="box-none">
          <View
            pointerEvents={fabExpanded ? "box-none" : "none"}
            style={[styles.fabOptionsContainer, { bottom: FAB_OPTIONS_BOTTOM }]}
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

          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.centerFabWrapper,
              { bottom: CENTER_FAB_BOTTOM },
              rotateStyle,
            ]}
          >
            <Tooltip text={t("navigation.tabs.addTransaction")}>
              <Button
                size="icon"
                onPress={toggleFab}
                style={[
                  styles.centerButton,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <IconSvg
                  name="plus-outline"
                  size={28}
                  color={theme.colors.onPrimary}
                />
              </Button>
            </Tooltip>
          </Animated.View>
        </View>
      </RNView>
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

  floatingLayer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },

  fabOptionsContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
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
    shadowColor: t.colors.shadow,
    pointerEvents: "auto",
  },

  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 54,
    width: "90%",
    borderRadius: t.radius,
    marginBottom: 8,
    pointerEvents: "auto",
    overflow: "visible",
  },

  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  tabSpacer: {
    width: 44,
  },

  centerButton: {
    borderRadius: t.radius,
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    flexShrink: 0,
  },

  centerFabWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
}))
