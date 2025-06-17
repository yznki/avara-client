# Avara — Modern Banking Made Simple 

**Avara** is a sleek, responsive, and modular frontend application designed for managing bank accounts, visualizing financial analytics, and enabling seamless user and admin operations. Built with **React**, **TailwindCSS**, and **ShadCN UI**, it delivers a smooth, modern interface with built-in customization and theming.

🌐 Live API: [https://api.av4ra.com](https://api.av4ra.com)

---

## Features

- **Smart Dashboard** – User-centric homepage with KPIs, real-time data, and clear insights.
- **Transactions Module** – Supports deposits, withdrawals, internal & external transfers.
- **Admin Panel** – Manage users, perform manual transactions, and audit logs.
- **Light & Dark Modes** – Theme-aware design system using CSS variables.
- **Beautiful Charts** – Recharts-powered visualizations with theme-aligned gradients.
- **Custom Theming** – Font, spacing, and token-based system using Tailwind & CVA.

---

## Tech Stack

- **React 19**
- **TypeScript**
- **TailwindCSS**
- **ShadCN UI**
- **Vite**
- **react-router-dom**
- **Recharts**

---

## Folder Structure

```
src/
├── components/       # Reusable UI components
├── context/          # Global state management (user, currency, etc.)
├── lib/              # Utilities (formatting, tokens, API)
├── pages/            # Page-level components/views
├── styles/           # Fonts, themes, and token config
└── App.tsx           # App root with routing
```

---

## Customization

- Fonts: [Satoshi](https://www.fontshare.com/fonts/satoshi)
- All themes use design tokens defined in `theme.ts`
- Easily extendable with CVA (Class Variance Authority) for component theming
- Toggle dark mode via `.dark` class (using `tailwind.config.js` and `theme.ts`)

---

## Setup

```bash
pnpm install
pnpm dev
```

> ⚠️ Requires Node.js 18+ and `pnpm` installed globally

---

## Environment Variables

Make sure to configure your `.env` file as shown below (see `.env.example`):

- `VITE_AUTH0_DOMAIN` – Auth0 domain
- `VITE_AUTH0_CLIENT_ID` – Auth0 client ID
- `VITE_AUTH0_AUDIENCE` – API audience identifier
- `VITE_CURRENCY_API_KEY` – Currency API key

---

## License

[MIT](LICENSE) — build freely, fork confidently.

Made with 💚 by [@yznki](https://github.com/yznki)
