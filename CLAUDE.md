# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ATLAS AI is a single-page landing site for a web design agency. It's a React 19 + TypeScript app built with Vite, styled with Tailwind CSS v4. There is no routing, no backend, no tests, and no linter configured.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build (outputs to `dist/`)
- `npm run preview` — Preview production build locally

## Architecture

**Entry flow:** `index.html` → `index.tsx` (React mount) → `App.tsx` (layout shell) → section components rendered in page order.

**Page section order in App.tsx:** Header → Hero → TrustLogos → Scanner → Features → Testimonials → CTASection → Footer

**Component patterns:**
- All components are in `components/` as standalone `.tsx` files (no shared state, no props drilling between siblings — each section is self-contained).
- Scanner is the exception: it lives in `components/Scanner/` with its own `index.tsx` and `styles.css` because it uses imperative DOM manipulation + canvas rendering rather than declarative React.
- Animations are done via inline `<style>` tags with CSS keyframes inside each component (not in a shared stylesheet). Look inside the component's JSX return for `<style>{...}</style>` blocks when modifying animations.
- The `glass` CSS class (glassmorphism effect) is defined globally in `index.html`, not in Tailwind.

**Scanner component (`components/Scanner/`):** This is the most complex component. It contains three imperative class-based controllers instantiated inside a single `useEffect`:
1. `ParticleScanner` — 2D canvas particle system for the scanner beam glow effect
2. `ParticleSystem` — Three.js (WebGL) background star particles
3. `CardStreamController` — Manages the draggable/auto-scrolling card carousel with ASCII reveal effect via CSS `clip-path`

All three are initialized on mount and cleaned up on unmount. They communicate through refs, not React state.

**Features component:** Uses `recharts` (BarChart, AreaChart) for data visualizations inside feature cards. Each card has an `IntersectionObserver` that triggers number animation (`AnimatedNumber`) and chart render on scroll-into-view. Features are filterable by category (All/Technical/Creative/Strategic).

**CTASection:** Contains a scroll-locking modal triggered by button click. The modal locks `document.body.style.overflow`.

## Styling

- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `index.css`, integrated through `@tailwindcss/vite` plugin (not PostCSS config file).
- **No `tailwind.config` file** — Tailwind v4 uses CSS-based configuration. Custom colors are used inline as arbitrary values (e.g., `text-[#BFF549]`, `bg-zinc-950`).
- **Brand colors:** Primary lime `#BFF549`, background `#09090b` (zinc-950), accent pink `#ec4899`.
- **Fonts:** Loaded via Google Fonts and Fontshare CDN links in `index.html` — Satoshi (headlines), Inter (body), Playfair Display (serif accents).
- **Path alias:** `@/*` maps to project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Environment

- `vite.config.ts` injects `GEMINI_API_KEY` from `.env` as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`, though this isn't currently used by any component.
- Icons come from `lucide-react`.
- Three.js is used only in the Scanner component.
