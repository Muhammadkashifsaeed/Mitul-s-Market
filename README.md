# Mitual Markite — Next.js Starter

A clean, scalable, production-ready **Next.js App Router** starter built with **TypeScript**, **Tailwind CSS v4**, **ESLint**, **Framer Motion**, **React Hook Form**, **Zod**, **Axios**, **Lucide React**, and **React Icons**.

## Getting Started

1. Copy environment variables (optional for local defaults):

```bash
cp .env.example .env.local
```

2. Install dependencies (if not already installed):

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — Start the Next.js development server
- `npm run build` — Create an optimized production build
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint across the codebase
- `npm run lint:fix` — Auto-fix lint issues where possible
- `npm run typecheck` — Run TypeScript type checking (`tsc --noEmit`)
- `npm run clean` — Remove the `.next` build output directory

## Project Structure

```text
├── app/                # App Router pages, layouts, global CSS, and API routes
├── components/         # Composed feature and layout components
│   └── ui/             # Reusable UI primitives (Button, Input, Card, Badge)
├── hooks/              # Custom React hooks (useMounted, useDebounce, useMediaQuery)
├── lib/                # Configuration & integrations (Axios client, Zod env/schemas)
├── public/             # Static assets served from /
├── types/              # Shared TypeScript interfaces and API response types
├── utils/              # Utility helpers (cn class merger, formatters)
├── .env.example        # Environment variable template
├── eslint.config.mjs   # ESLint flat configuration
├── next.config.ts      # Next.js configuration
├── postcss.config.mjs  # PostCSS configuration for Tailwind CSS v4
└── tsconfig.json       # Strict TypeScript configuration
```

