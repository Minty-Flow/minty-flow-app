import type { Category } from "~/types/categories"

/**
 * The `limit` categories with the most transactions (ties keep the incoming,
 * alphabetical order). With `fillUnused`, unused categories pad the result so
 * a brand-new user still gets quick picks; without it only used ones count.
 */
export function getMostUsedCategories(
  categories: Category[],
  limit: number,
  fillUnused = true,
): Category[] {
  const ranked = categories
    .map((category, index) => ({ category, index }))
    .filter(({ category }) => fillUnused || category.transactionCount > 0)
    .sort(
      (a, b) =>
        b.category.transactionCount - a.category.transactionCount ||
        a.index - b.index,
    )
  return ranked.slice(0, limit).map(({ category }) => category)
}
