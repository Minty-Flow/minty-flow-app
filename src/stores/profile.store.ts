import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

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
  /** The URI of the user's profile image, or null if no image is set */
  imageUri: string | null
  /**
   * Sets the profile name.
   * @param name - The name to set
   */
  setName: (name: string) => void
  /**
   * Sets the profile image URI.
   * @param imageUri - The image URI to set, or null to remove the image
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
 * const { name, imageUri, setName, setImageUri } = useProfileStore()
 *
 * // Update name
 * setName("John Doe")
 *
 * // Set image
 * setImageUri("file:///path/to/image.jpg")
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
      storage: createJSONStorage(() => ({
        getItem: (name) => profileStorage.getString(name) ?? null,
        setItem: (name, value) => profileStorage.set(name, value),
        removeItem: (name) => profileStorage.remove(name),
      })),
    },
  ),
)
