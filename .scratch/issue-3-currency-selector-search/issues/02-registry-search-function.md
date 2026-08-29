# 02 — Add searchCurrencies to the currency registry

**What to build:** The currency registry already knows each currency's code, name, country, and symbol, but has no search function — matching today lives inside one UI component. Add a `searchCurrencies(query)` function to the registry that matches code, name, and symbol (case-insensitive, partial), reusing the existing data including the symbol map.

**Blocked by:** 01 — Add currency search by symbol, name, and code

**Status:** ready-for-agent

- [ ] Search matches by code, name, and symbol, case-insensitive
- [ ] Empty query returns the normal (grouped) list, not a filtered one
- [ ] Crypto currencies searchable too