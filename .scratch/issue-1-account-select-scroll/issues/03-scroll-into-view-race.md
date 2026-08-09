# 03 — Resolve scrollIntoView race freezing the form

**What to build:** Opening an account dropdown triggers an auto-scroll-to-field hack that races against the nested ScrollView gestures and can freeze/interrupt form scrolling. Investigate whether the hack still does anything useful once nested scrolling works, then remove or gate it so programmatic scroll and touch scroll never fight.

**Blocked by:** 02 — Enable nested scrolling in account picker option lists

**Status:** ready-for-agent

- [ ] Opening picker mid-form does not freeze form scroll
- [ ] Field still scrolls into view when opened near bottom of form
- [ ] Category picker (horizontal) verified — same race class, scrolls while open