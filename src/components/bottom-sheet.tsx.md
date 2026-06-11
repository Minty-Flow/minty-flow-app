import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFooter,
  type BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { InteractionManager, Keyboard, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet as UnistylesSheet } from "react-native-unistyles"
import { create } from "zustand"

// Unistyles for theme-aware styles
const sheetStyles = UnistylesSheet.create((theme) => ({
  background: {
    backgroundColor: theme.colors.surface,
  },
  contentContainer: {
    flex: 1,
  },
  handleIndicator: {
    backgroundColor: theme.colors.onSurface,
  },
  footerContainer: (bottomPadding: number) => ({
    backgroundColor: theme.colors.surface,
    paddingBottom: bottomPadding,
  }),
}))

/**
 * Zustand Store for Bottom Sheets
 */
interface BottomSheetStore {
  sheets: Map<string, React.RefObject<BottomSheetModalMethods | null>>
  registerSheet: (
    id: string,
    ref: React.RefObject<BottomSheetModalMethods | null>,
  ) => void
  unregisterSheet: (id: string) => void
  present: (id: string) => void
  dismiss: (id: string) => void
  snapToIndex: (id: string, index: number) => void
  collapse: (id: string) => void
}

const useBottomSheetStore = create<BottomSheetStore>((set, get) => ({
  sheets: new Map(),
  registerSheet: (id, ref) => {
    const { sheets } = get()
    sheets.set(id, ref)
    set({ sheets: new Map(sheets) })
  },
  unregisterSheet: (id) => {
    const { sheets } = get()
    sheets.delete(id)
    set({ sheets: new Map(sheets) })
  },
  present: (id) => {
    const { sheets } = get()
    sheets.get(id)?.current?.present()
  },
  dismiss: (id) => {
    const { sheets } = get()
    sheets.get(id)?.current?.dismiss()
  },
  snapToIndex: (id, index) => {
    const { sheets } = get()
    sheets.get(id)?.current?.snapToIndex(index)
  },
  collapse: (id) => {
    const { sheets } = get()
    sheets.get(id)?.current?.collapse()
  },
}))

/**
 * Hook to control bottom sheets
 */
export const useBottomSheet = (id: string) => {
  const present = useBottomSheetStore((state) => state.present)
  const dismiss = useBottomSheetStore((state) => state.dismiss)
  const snapToIndex = useBottomSheetStore((state) => state.snapToIndex)
  const collapse = useBottomSheetStore((state) => state.collapse)

  return {
    present: () => present(id),
    dismiss: () => dismiss(id),
    snapToIndex: (index: number) => snapToIndex(id, index),
    collapse: () => collapse(id),
  }
}

/**
 * Bottom Sheet Modal Component - Use this for multiple bottom sheets
 * Renders at the root level and overlays everything including tab bars
 */
export type BottomSheetModalProps = {
  /** Unique identifier for this bottom sheet */
  id: string
  /** Content to render inside the bottom sheet */
  children: ReactNode
  /** Snap points for the bottom sheet (e.g., ['25%', '50%', '90%'] or [100, 300, 500]) */
  snapPoints?: Array<string | number>
  /** Callback when sheet index changes */
  onChange?: (index: number) => void
  /** Callback when sheet is dismissed */
  onDismiss?: () => void
  /** Enable pan down to close */
  enablePanDownToClose?: boolean
  /** Background color for the sheet */
  backgroundColor?: string
  /** Backdrop component render function */
  backdropComponent?: (props: BottomSheetBackdropProps) => ReactNode
  /** Backdrop opacity (0-1) */
  backdropOpacity?: number
  /** Snap point index when backdrop appears */
  backdropAppearsOnIndex?: number
  /** Snap point index when backdrop disappears */
  backdropDisappearsOnIndex?: number
  /** Enable touch through backdrop */
  backdropEnableTouchThrough?: boolean
  /** Backdrop press behavior: 'none' | 'close' | 'collapse' | number */
  backdropPressBehavior?: "none" | "close" | "collapse" | number
  /** Enable dynamic sizing */
  enableDynamicSizing?: boolean
  /** Keyboard behavior: 'interactive' | 'fillParent' | 'extend' */
  keyboardBehavior?: "interactive" | "fillParent" | "extend"
  /** Keyboard blur behavior: 'none' | 'restore' */
  keyboardBlurBehavior?: "none" | "restore"
  /** Skip the BottomSheetView wrapper (useful for scrollable content like FlatList) */
  skipBottomSheetView?: boolean
  /** Footer component render function */
  footerComponent?: ReactNode
  enableContentPanningGesture?: boolean
  enableHandlePanningGesture?: boolean
}

export function BottomSheetModalComponent({
  id,
  children,
  snapPoints,
  onChange,
  onDismiss,
  enablePanDownToClose = true,
  backgroundColor,
  backdropComponent,
  backdropOpacity = 0.5,
  backdropAppearsOnIndex = 0,
  backdropDisappearsOnIndex = -1,
  backdropEnableTouchThrough = false,
  backdropPressBehavior = "close",
  enableDynamicSizing = true,
  keyboardBehavior = "extend",
  keyboardBlurBehavior = "restore",
  enableContentPanningGesture = true,
  enableHandlePanningGesture = true,
  skipBottomSheetView = false,
  footerComponent,
}: BottomSheetModalProps) {
  const insets = useSafeAreaInsets()
  const bottomPadding = Math.max(insets.bottom, 20)

  const registerSheet = useBottomSheetStore((state) => state.registerSheet)
  const unregisterSheet = useBottomSheetStore((state) => state.unregisterSheet)
  const snapToIndex = useBottomSheetStore((state) => state.snapToIndex)

  // Track if component is mounted and context is ready
  const [isReady, setIsReady] = useState(false)

  useLayoutEffect(() => {
    // Use InteractionManager to ensure provider context is ready
    // This runs after all interactions and animations are complete
    let timer: number | null = null
    const interaction = InteractionManager.runAfterInteractions(() => {
      // Additional small delay to ensure BottomSheetModalProvider is fully initialized
      timer = setTimeout(() => {
        setIsReady(true)
      }, 50) as unknown as number
    })

    return () => {
      interaction.cancel()
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [])

  // Use refs to store values for keyboard restore
  const shouldRestoreRef = useRef(
    keyboardBlurBehavior === "restore" && snapPoints && snapPoints.length > 0,
  )
  const sheetIdRef = useRef(id)
  const wasKeyboardVisibleRef = useRef(false)

  useEffect(() => {
    shouldRestoreRef.current =
      keyboardBlurBehavior === "restore" && Boolean(snapPoints?.length)
    sheetIdRef.current = id
  }, [id, keyboardBlurBehavior, snapPoints])

  // Create a stable restore callback
  const restoreSheet = useCallback(() => {
    if (shouldRestoreRef.current) {
      snapToIndex(sheetIdRef.current, 0)
    }
  }, [snapToIndex])

  // Set up keyboard listeners using callback ref pattern (no useEffect)
  const keyboardListenersRef = useRef<{
    hide: ReturnType<typeof Keyboard.addListener> | null
    show: ReturnType<typeof Keyboard.addListener> | null
  }>({ hide: null, show: null })

  // Use callback ref to register/unregister and manage keyboard listeners
  const bottomSheetModalRef = useCallback(
    (node: BottomSheetModalMethods | null) => {
      if (node) {
        // Register when ref is set
        registerSheet(id, { current: node })

        // Set up keyboard listeners when sheet is mounted
        keyboardListenersRef.current.hide = Keyboard.addListener(
          "keyboardDidHide",
          () => {
            if (wasKeyboardVisibleRef.current && shouldRestoreRef.current) {
              wasKeyboardVisibleRef.current = false
              restoreSheet()
            }
          },
        )

        keyboardListenersRef.current.show = Keyboard.addListener(
          "keyboardDidShow",
          () => {
            wasKeyboardVisibleRef.current = true
          },
        )
      } else {
        // Unregister when ref is cleared (component unmounting)
        unregisterSheet(id)

        // Clean up keyboard listeners
        keyboardListenersRef.current.hide?.remove()
        keyboardListenersRef.current.show?.remove()
        keyboardListenersRef.current.hide = null
        keyboardListenersRef.current.show = null
      }
    },
    [id, registerSheet, unregisterSheet, restoreSheet],
  )

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (sheetIndex: number) => {
      onChange?.(sheetIndex)
    },
    [onChange],
  )

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      if (backdropComponent) {
        return backdropComponent(props)
      }
      return (
        <BottomSheetBackdrop
          {...props}
          opacity={backdropOpacity}
          appearsOnIndex={backdropAppearsOnIndex}
          disappearsOnIndex={backdropDisappearsOnIndex}
          enableTouchThrough={backdropEnableTouchThrough}
          pressBehavior={backdropPressBehavior}
        />
      )
    },
    [
      backdropComponent,
      backdropOpacity,
      backdropAppearsOnIndex,
      backdropDisappearsOnIndex,
      backdropEnableTouchThrough,
      backdropPressBehavior,
    ],
  )

  // Centralized Footer Renderer
  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => {
      if (!footerComponent) return null

      return (
        <BottomSheetFooter
          {...props}
          style={sheetStyles.footerContainer(bottomPadding)}
        >
          {/* This allows you to pass simple Views/Buttons without manual wrapping */}

          {footerComponent}
        </BottomSheetFooter>
      )
    },

    [footerComponent, bottomPadding],
  )
  // Don't render until context is ready to avoid context errors
  if (!isReady) {
    return null
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      onChange={handleSheetChanges}
      onDismiss={onDismiss}
      enablePanDownToClose={enablePanDownToClose}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      backgroundStyle={
        backgroundColor ? { backgroundColor } : sheetStyles.background
      }
      handleIndicatorStyle={sheetStyles.handleIndicator}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={enableContentPanningGesture}
      enableHandlePanningGesture={enableHandlePanningGesture}
      footerComponent={renderFooter}
    >
      {skipBottomSheetView ? (
        <View
          style={[
            sheetStyles.contentContainer,
            { paddingBottom: bottomPadding },
          ]}
        >
          {children}
        </View>
      ) : (
        <BottomSheetView
          style={[
            sheetStyles.contentContainer,
            { paddingBottom: bottomPadding },
          ]}
        >
          {children}
        </BottomSheetView>
      )}
    </BottomSheetModal>
  )
}
