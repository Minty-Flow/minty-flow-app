/**
 * Checks if a string is an image URL or URI
 *
 * @param url - The string to check
 * @returns True if the string appears to be an image URL/URI
 *
 * @example
 * ```ts
 * isImageUrl("https://example.com/image.jpg") // Returns true
 * isImageUrl("file:///path/to/image.png") // Returns false (file:// not allowed from clipboard)
 * isImageUrl("https://imgur.com/abc123") // Returns true (imgur hostname)
 * isImageUrl("https://example.com/page") // Returns false (no image extension)
 * isImageUrl("http://example.com/image.jpg") // Returns false (http:// not allowed)
 * ```
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false

  // Reject file:// URIs — local gallery images arrive via ImagePicker (not clipboard paste).
  // Allowing file:// from clipboard would expose arbitrary local file paths.
  if (url.startsWith("file://")) {
    return false
  }

  // Only accept https:// for remote URLs (never plain http://).
  try {
    const urlObj = new URL(url)
    if (urlObj.protocol !== "https:") return false

    const pathname = urlObj.pathname.toLowerCase()
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]

    // Check if URL has image extension
    const hasImageExtension = imageExtensions.some((ext) =>
      pathname.endsWith(ext),
    )

    // Check if it's from known image hosting services
    const isKnownImageHost =
      urlObj.hostname.includes("imgur") ||
      urlObj.hostname.includes("unsplash") ||
      urlObj.hostname.includes("pexels")

    return hasImageExtension || isKnownImageHost
  } catch {
    return false
  }
}
