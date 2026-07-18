<p align="center">
  <img src="src/assets/images/icon.png" width="96" alt="Minty Flow icon" />
</p>

<h1 align="center">Minty Flow</h1>

<p align="center">
  A free, open-source, and beautifully simple personal finance tracker — fully offline, privacy-first, built for Android (iOS coming soon/when im rich).
</p>

---

## Download

<!-- [![Google Play - Download](https://img.shields.io/badge/Google_Play-Download-C0FFCA?style=for-the-badge&logo=google-play&logoColor=C0FFCA)](https://play.google.com/store/apps/details?id=com.mintyflow.tracker)
[![GitHub - Releases](https://img.shields.io/badge/GitHub-Releases-C0FFCA?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Minty-Flow/minty-flow-app/releases)
[![Minty Flow - Website](https://img.shields.io/badge/Minty_Flow-Website-C0FFCA?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/Minty-Flow/minty-flow-page)
 -->

[![Google Play - Download](https://img.shields.io/badge/Google_Play-Download-161b22?style=for-the-badge&logo=google-play&logoColor=C0FFCA&labelColor=21262d)](https://play.google.com/store/apps/details?id=com.mintyflow.tracker)
[![GitHub - Releases](https://img.shields.io/badge/GitHub-Releases-161b22?style=for-the-badge&logo=github&logoColor=C0FFCA&labelColor=21262d)](https://github.com/Minty-Flow/minty-flow-app/releases)
[![Minty Flow - Website](https://img.shields.io/badge/Minty_Flow-Website-161b22?style=for-the-badge&logo=googlechrome&logoColor=C0FFCA&labelColor=21262d)](https://github.com/Minty-Flow/minty-flow-page)


> **iOS support is coming.** The app is built with React Native and the iOS build works locally — a public TestFlight release is in progress.

---

## Features

- Simple, clean UX for tracking daily finances
- Unlimited accounts with multi-currency support
- Income, expense, and transfer tracking
- Categories, tags, and file attachments
- Geo-tagging (optional)
- Budget tracking with period-based limits and alert thresholds
- Savings goals with live progress tracking
- Loan management (lent & borrowed) with settlement automation
- Recurring transactions via RRULE
- Bill splitter
- Exchange rate support
- Fully offline — no cloud, no sync, your data stays on device
- No trackers, no analytics
- Full data export (JSON backup) and import recovery
- Biometric / PIN app lock
- Multiple themes: Minty (Light/Dark/OLED), Catppuccin (Frappé/Macchiato/Mocha), Palenight, Nord, Monochrome
- English & Arabic (RTL) support
- Absolutely free

---

## Development

### Prerequisites

- Node.js 18+
- pnpm
- Android Studio with AVD (for Android)
- Xcode (for iOS, macOS only)

> Native modules (`expo-sqlite`, MMKV) require a **dev build**. `pnpm start` with Expo Go will not work.

### Setup

```bash
# Install dependencies
pnpm install

# Generate native projects (first time or after native dep changes)
pnpm prebuild

# Run
pnpm android    # Android
pnpm ios        # iOS (macOS only)
```

### Useful commands

| Command | Description |
|---|---|
| `pnpm lint` | Biome lint check |
| `pnpm lint:fix` | Lint and auto-fix |
| `pnpm types` | TypeScript type check |
| `pnpm structure` | Regenerate docs/STRUCTURE.md |
| `pnpm check-i18n-keys` | Find missing translation keys |

**Pre-commit hook** (husky): runs `pnpm structure` → `pnpm lint:fix` → `pnpm types` automatically. All three must pass.

### Icons

Icons are generated from [tabler-icons](https://github.com/tabler/tabler-icons)
via `svgr` into `src/components/icons/{filled,outline}`. That folder holds the
full tabler set (every icon, used or not) as the single source of truth —
`src/components/ui/icon-svg.tsx` only imports the ones it actually uses, so
unused icons sit on disk but never enter the bundle.

One-time setup — clone tabler-icons as a sibling of this repo, shallow and
sparse so you only pull the `icons/` folder, not the whole tabler monorepo history:

```bash
git clone --depth=1 --filter=blob:none --sparse https://github.com/tabler/tabler-icons.git
cd tabler-icons
git sparse-checkout set icons
cd ..
```

To pick up new/updated tabler icons:

```bash
cd tabler-icons && git pull && cd ..
pnpm icons:sync
```

To use a new icon, add one import + one `ICON_MAP` entry in `icon-svg.tsx` —
the file is already on disk after `icons:sync`.

---

## Support

Minty Flow is a personal project built in free time. If you find it useful:

- ⭐ Star the repo on GitHub
- Leave a review on Google Play
- Tell a friend

---

## Languages

- English
- Arabic — including full RTL layout support

Want to add your language? Translations live in `src/i18n/translation/`.



