/**
 * Get the initials from a name.
 *
 * @param name - The name to extract initials from
 * @returns The initials (e.g., "John Doe" -> "JD", "Alice" -> "A")
 */
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  if (words.length === 0) return "?"
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? "?"
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
