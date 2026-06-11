import { type ToastOptions, useToastStore } from "~/stores/toast.store"

type ToastOptionsWithoutType = Omit<ToastOptions, "type">

/**
 * Toast API for showing notifications.
 *
 * This API provides a simple interface for displaying toast notifications
 * throughout the application. It's similar to toastify-react-native but
 * implemented directly in the codebase.
 *
 * Global defaults for position, progress bar, and close icon are applied
 * from the toast style store unless explicitly overridden.
 *
 * @example
 * ```tsx
 * import { Toast } from '~/utils/toast'
 *
 * // Show a success toast (uses global defaults)
 * Toast.success({ title: 'Success!', description: 'Operation completed' })
 *
 * // Show an error toast with custom position
 * Toast.error({ title: 'Error', description: 'Something went wrong', position: 'bottom' })
 *
 * // Show a custom toast
 * Toast.show({
 *   type: 'info',
 *   title: 'Info',
 *   description: 'This is an info message',
 *   position: 'bottom',
 *   visibilityTime: 5000,
 * })
 * ```
 */
class ToastAPI {
  private getStore() {
    // We need to access the store directly since this is a utility class
    // In React components, use useToastStore hook instead
    return useToastStore.getState()
  }

  /**
   * Show a toast notification with custom options.
   */
  show(options: ToastOptions): string {
    return this.getStore().show(options)
  }

  /**
   * Show a success toast.
   */
  success(options: ToastOptionsWithoutType): string {
    return this.getStore().show({ type: "success", ...options })
  }

  /**
   * Show an error toast.
   */
  error(options: ToastOptionsWithoutType): string {
    return this.getStore().show({ type: "error", ...options })
  }

  /**
   * Show an info toast.
   */
  info(options: ToastOptionsWithoutType): string {
    return this.getStore().show({ type: "info", ...options })
  }

  /**
   * Show a warning toast.
   */
  warn(options: Omit<ToastOptions, "type">): string {
    return this.getStore().show({ type: "warn", ...options })
  }

  /**
   * Hide a specific toast by ID.
   */
  hide(id?: string): void {
    this.getStore().hide(id)
  }

  /**
   * Hide all toasts.
   */
  hideAll(): void {
    this.getStore().hideAll()
  }
}

export const Toast = new ToastAPI()
