# 02 — Enable nested scrolling in account picker option lists

**What to build:** The option lists inside the account picker and the transfer-destination picker are inner ScrollViews without `nestedScrollEnabled` — on Android the inner list hijacks/conflicts with the outer form scroll, so the dropdown list won't scroll and the form gets stuck. Add the flag to the inner lists, and check the dropdown container's max-height/overflow clipping doesn't cut the list.

**Blocked by:** 01 — Fix account inline select scroll

**Status:** ready-for-agent

- [ ] Option list scrolls on its own when it overflows
- [ ] Opening the dropdown no longer blocks outer form scrolling (Android)
- [ ] Transfer-destination picker behaves identically to account picker