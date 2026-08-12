# SpendWise — SME Expense Tracker

A production-ready, ultra-modern, multi-page expense tracking web application designed specifically for small businesses operating in Nigerian Naira (₦).

![Dark Mode Fintech Dashboard](https://img.shields.io/badge/Theme-Dark%20Mode-1F2937?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square)

## Features

### Landing Page
- Hero section with gradient typography and animated background
- Trust badges (₦2.4B tracked, 2,500+ SMEs, 99.9% uptime)
- Feature grid with glassmorphism cards
- Interactive dashboard preview mockup
- CTA sections and clean footer

### Authentication
- Split-screen design with motivational quotes
- Login & Register form toggle with smooth transitions
- Password visibility toggle, Remember Me checkbox
- Simulated auth with instant redirect to dashboard

### Dashboard
- **Top Bar**: Business name, ₦ currency badge, Export CSV/PDF, Add Expense, User dropdown with Log Out
- **Metric Cards**: Total Spent, Monthly Budget (editable), Top Category, Total Entries
- **Charts**: Monthly expense trends (bar chart) + Category breakdown (pie chart) via Recharts
- **Expense Table**: Searchable, filterable, sortable, paginated with edit/delete actions
- **Add Expense Modal**: Full form with category/payment dropdowns, date picker, amount input
- **Edit Expense Modal**: Inline editing for any transaction

### New Enhancements
- **Filter Bar**: Category dropdown + Date Range pickers + Reset filters button
- **Export**: CSV download + PDF print-ready report generation
- **Edit Budget**: Pencil icon on budget card opens a modal to update the monthly threshold
- **Pagination**: Previous/Next buttons with page numbers, showing X-Y of Z transactions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (New York) |
| State Management | Zustand |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

## Project Structure

```
spendwise-expense-tracker/
├── prisma/                  # Database schema (SQLite)
├── public/                  # Static assets (logo.svg, robots.txt)
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── globals.css       # Global styles, theme, glassmorphism
│   │   ├── layout.tsx        # Root layout with fonts
│   │   └── page.tsx          # SPA router (Landing → Auth → Dashboard)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── top-bar.tsx           # Header with export, add expense, user menu
│   │   │   ├── metric-cards.tsx       # KPI cards with edit budget modal
│   │   │   ├── dashboard-charts.tsx   # Recharts bar + pie charts
│   │   │   ├── expense-table.tsx      # Filterable, sortable, paginated table
│   │   │   ├── add-expense-modal.tsx  # Add new transaction form
│   │   │   └── dashboard-view.tsx     # Main dashboard layout
│   │   ├── landing/
│   │   │   └── landing-page.tsx       # Public landing page
│   │   ├── auth/
│   │   │   └── auth-page.tsx          # Login/Register split-screen
│   │   ├── naira-icon.tsx             # Custom ₦ SVG icon
│   │   └── ui/                         # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities (db, utils)
│   └── store/
│       ├── auth-store.ts      # Auth state & view management
│       └── expense-store.ts   # Expenses, filters, pagination, export logic
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json             # shadcn/ui config
├── package.json
└── bun.lock
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Install dependencies
bun install

# (Optional) Push database schema
bun run db:push

# Start development server
bun run dev
```

The app runs at `http://localhost:3000`.

### Production Build

```bash
bun run build
bun start
```

## Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Deep Slate | `#0B0F19` | Background |
| Slate Surface | `#111827` | Secondary backgrounds |
| Glass Card | `#1F2937` (60% opacity) | Cards, modals |
| Electric Violet | `#8B5CF6` | Primary CTAs |
| Emerald Green | `#10B981` | Positive values, savings |
| Crimson Red | `#EF4444` | Expenses, destructive actions |

### Visual Effects
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Glow Effects**: Subtle colored shadows on important elements
- **Micro-interactions**: Hover states, floating badges, animated charts
- **Page Transitions**: Framer Motion fade + scale between views

## Backend Integration Guide

The Zustand stores are designed for easy backend replacement:

### Auth Store (`src/store/auth-store.ts`)
```typescript
// Replace mock login with API call:
login: async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const user = await res.json();
  set({ isAuthenticated: true, user });
}
```

### Expense Store (`src/store/expense-store.ts`)
```typescript
// Replace mock data with API calls:
addExpense: async (expense) => {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
  const newExpense = await res.json();
  set((state) => ({ expenses: [newExpense, ...state.expenses] }));
}
```

### Recommended Backend Stack
- **Runtime**: Bun / Node.js
- **Framework**: Express.js / Hono / Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js / JWT
- **File Storage**: Local / S3 for CSV exports

## License

MIT — Free for personal and commercial use.
