import { create } from "zustand"

import { type ToastPosition, useToastStyleStore } from "./toast-style.store"

export type { ToastPosition }
export type ToastType = "success" | "error" | "info" | "warn" | "default"

export interface ToastOptions {
  type?: ToastType
  title?: string
  description?: string
  position?: ToastPosition
  visibilityTime?: number
  autoHide?: boolean
  showProgressBar?: boolean
  showCloseIcon?: boolean
  onShow?: () => void
  onHide?: () => void
  onPress?: () => void
}

export interface Toast extends ToastOptions {
  id: string
  type: ToastType
  title?: string
  description?: string
  position: ToastPosition
  visibilityTime: number
  autoHide: boolean
  showProgressBar: boolean
  showCloseIcon: boolean
}

interface ToastStore {
  toasts: Toast[]
  show: (options: ToastOptions) => string
  hide: (id?: string) => void
  hideAll: () => void
}

/**
 * Zustand store for managing toast notifications.
 *
 * @example
 * ```tsx
 * const { show, hide } = useToastStore()
 *
 * // Show a success toast
 * show({ type: 'success', title: 'Success!', description: 'Operation completed' })
 *
 * // Show an error toast
 * show({ type: 'error', title: 'Error', description: 'Something went wrong' })
 * ```
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  show: (options) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const styleDefaults = useToastStyleStore.getState()
    const toast: Toast = {
      id,
      type: options.type ?? "default",
      title: options.title,
      description: options.description,
      position: options.position ?? styleDefaults.position,
      visibilityTime: options.visibilityTime ?? 3000,
      autoHide: options.autoHide ?? true,
      showProgressBar: options.showProgressBar ?? styleDefaults.showProgressBar,
      showCloseIcon: options.showCloseIcon ?? styleDefaults.showCloseIcon,
      onShow: options.onShow,
      onHide: options.onHide,
      onPress: options.onPress,
    }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    options.onShow?.()

    // Auto-hide is driven by the ToastItem component's exit animation.

    return id
  },

  hide: (id) => {
    set((state) => {
      const toast = state.toasts.find((t) => t.id === id)
      toast?.onHide?.()
      return {
        toasts: state.toasts.filter((t) => t.id !== id),
      }
    })
  },

  hideAll: () => {
    set((state) => {
      for (const toast of state.toasts) {
        toast.onHide?.()
      }
      return { toasts: [] }
    })
  },
}))
