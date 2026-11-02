import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"
import { migrateStoredProfileImage } from "~/utils/profile-image"

/**
 * MMKV storage instance for user profile data.
 *
 * This instance stores the user's profile information including name and profile image.
 * MMKV is ~30x faster than AsyncStorage and provides synchronous operations.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
const profileStorage = createMMKV({
  id: "profile-storage",
})

/**
 * Profile store interface defining the shape of the profile state and actions.
 */
interface ProfileStore {
  /** The user's profile name */
  name: string
  /**
   * The file name of the user's profile image in app storage, or null if no
   * image is set. Resolve it with `resolveProfileImage`, never use it as a URI.
   */
  imageUri: string | null
  /**
   * Sets the profile name.
   * @param name - The name to set
   */
  setName: (name: string) => void
  /**
   * Sets the profile image.
   * @param imageUri - The image file name to set, or null to remove the image
   */
  setImageUri: (imageUri: string | null) => void
}

/**
 * Zustand store hook for managing user profile data.
 *
 * This store is persisted to MMKV storage, providing fast and reliable
 * persistence of profile information across app sessions.
 *
 * @example
 * ```tsx
 * // Subscribe per field (or useShallow) so unrelated changes don't re-render.
 * const name = useProfileStore((s) => s.name)
 * const setName = useProfileStore((s) => s.setName)
 *
 * // Update name
 * setName("John Doe")
 *
 * // Set image
 * setImageUri("minty_profile_123.jpg")
 *
 * // Remove image
 * setImageUri(null)
 * ```
 *
 * @see https://github.com/pmndrs/zustand
 */
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      // State definitions
      name: "",
      imageUri: null,

      // Actions
      setName: (name) => set({ name: name.trim() }),
      setImageUri: (imageUri) => set({ imageUri }),
    }),
    {
      name: "profile-store",
      storage: mmkvJSONStorage(profileStorage),
      // v1: the image is a file name, not an absolute URI (which breaks when
      // the iOS app container path changes).
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as Partial<ProfileStore>
        if (version < 1) {
          return {
            ...state,
            imageUri: migrateStoredProfileImage(state.imageUri ?? null),
          }
        }
        return state
      },
    },
  ),
)
