# 04 — Add search to inline currency selector (budget/goal)

**What to build:** The inline currency selector used by budget and goal screens has no search at all — you must scroll the whole list. Add a search input above the list, reusing the registry's shared search function (symbol/name/code), and keep the existing nested-scroll behavior working.

**Blocked by:** 02 — Add searchCurrencies to the currency registry

**Status:** ready-for-agent

- [ ] Search input visible in budget and goal currency pickers
- [ ] Symbol/name/code search works in both
- [ ] List still scrolls correctly on Android with search open