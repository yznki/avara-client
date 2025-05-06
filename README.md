# Avara — Modern Banking Made Simple

Avara is a sleek, modular, and fully customizable frontend application for managing bank accounts, visualizing transaction analytics, and handling internal operations like transfers and user controls. Built with **React**, **TailwindCSS**, and **ShadCN UI**, it merges performance with aesthetics for a next-gen banking experience.

---

## Features

- Clean, card-based user dashboard with KPIs, charts, and filtered transaction history.
- Transaction manager supporting deposits, withdrawals, and internal/external transfers.
- Admin panel with user inspection, admin-side actions, and analytics.
- Light/Dark mode support with a token-based design system and custom fonts.
- Gradient-powered charts with theme-consistent coloring.

---

## Tech Stack

- React 19
- TypeScript
- TailwindCSS
- ShadCN UI
- Vite

---

## Folder Structure

```
src/
├── components/       # Reusable UI components
├── lib/              # Utilities and helpers
├── styles/           # Global styles (e.g., Satoshi, tokens)
├── pages/            # Page-level views
└── App.tsx           # Main entry point
```

---

## Customization

- Typography is powered by [Satoshi](https://www.fontshare.com/fonts/satoshi).
- All colors, spacing, and radii are defined via CSS variables for easy theming.
- Dark mode is fully supported and toggled using `.dark`.

---

## Setup

```bash
pnpm install
pnpm dev
```

> Requires Node.js ≥18 and `pnpm` installed.

---

## License

MIT — feel free to build on top of Avara.

Built by [@yznki](https://github.com/yznki)
