# 03 — Wire registry search into the modal currency selector

**What to build:** The modal currency selector has its own local filter that only matches name/code/country. Replace it with the registry's shared search function so symbol matches work, keeping the auto-clear-on-open behavior.

**Blocked by:** 02 — Add searchCurrencies to the currency registry

**Status:** ready-for-agent

- [ ] Typing symbol (e.g. "$", "€", "¥") filters list correctly
- [ ] Name and code searches still work
- [ ] Search clears when modal reopens