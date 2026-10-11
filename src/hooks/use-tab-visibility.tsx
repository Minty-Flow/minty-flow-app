import { createContext, useContext } from "react"

/** Index of the tab currently showing in the home pager. */
export const ActiveTabContext = createContext<number | null>(null)

/** Index of the tab a screen is mounted as; `null` outside the pager. */
export const TabIndexContext = createContext<number | null>(null)

/**
 * Whether the calling screen's tab is the one showing. Pager tabs stay
 * "focused" for navigation when swiped away, so focus alone cannot tell.
 * Screens outside the pager are always considered visible.
 */
export function useIsActiveTab(): boolean {
  const active = useContext(ActiveTabContext)
  const index = useContext(TabIndexContext)
  return active === null || index === null || active === index
}
