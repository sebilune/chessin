# <img src="public/favicon.svg" width="32" height="32" valign="middle" /> Chessin

**A minimalist monochrome solo chess puzzle game.** Try it **[here](https://chessin.pages.dev)**.

## Description

Chessin is a 5x5 solo chess capture puzzle game where every move must capture another piece until only one remains on the board. Built with a clean, tactile monochrome interface and progressive difficulty across 64 puzzles.

## Features

- 64 puzzles spanning Easy, Medium, and Hard tiers
- Drag-and-drop or click-to-capture controls with piece travel and wobble animations
- Full undo/redo history, board reset, and capture move log
- Built-in solver hints for levels 1–48
- Curated sound effects with a mute toggle and hover volume slider
- Light and dark themes with local progress persistence
- Multi-language support
- Keyboard shortcuts (`Z` / `ArrowLeft` undo, `Y` / `ArrowRight` redo, `R` reset, `H` hint, `ArrowUp` / `ArrowDown` level navigation)

## Build From Source

Ensure you have the following installed on your system:

- **[Git](https://git-scm.com/)**
- **[Bun](https://bun.sh/)**

Run the following commands to start the development server or build for production:

```bash
git clone https://github.com/sebilune/chessin.git
cd chessin
bun install
bun run dev
```

To build the production bundle into `dist/`:

```bash
bun run build
```

## Technologies

<p align="left">
  <a href="https://github.com/sebilune">
    <img src="https://skillicons.dev/icons?i=svelte,vite,tailwind,ts,bun,cloudflare&perline=8" />
  </a>
</p>

- **[Svelte:](https://svelte.dev/)** Component framework.
- **[TypeScript:](https://www.typescriptlang.org/)** Typed superset of JavaScript.
- **[Vite:](https://vite.dev/)** Build tool for modern web apps.
- **[Tailwind CSS:](https://tailwindcss.com/)** Utility CSS framework.
- **[Lucide Svelte:](https://lucide.dev/)** Icons library.
- **[Howler.js:](https://howlerjs.com/)** Web audio library for sound effects.
- **[Paraglide JS:](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)** Type-safe internationalization (i18n).
- **[Bun:](https://bun.sh/)** JavaScript runtime and package manager.
- **[Cloudflare Pages:](https://pages.cloudflare.com/)** Static hosting and deployment via Wrangler.

## License

This project is licensed under the **GNU General Public License v2.0 (GPL-2.0)**. See the [LICENSE](LICENSE) file for details.
