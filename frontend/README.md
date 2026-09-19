# ImaraRent Frontend

A modern property management web application built with React, TypeScript, and Tailwind CSS. ImaraRent supports three distinct user roles — **Owner**, **Manager**, and **Tenant** — each with role-specific dashboards, routing, and permissions.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
  - [Feature-Based Organization](#feature-based-organization)
  - [Providers & Global State](#providers--global-state)
  - [Routing](#routing)
  - [API Layer](#api-layer)
  - [Role-Based Access](#role-based-access)
  - [Styling](#styling)
  - [PWA & Offline](#pwa--offline)
  - [Testing](#testing)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Conventions](#conventions)

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **UI Primitives** | Radix UI |
| **Icons** | Lucide React |
| **Routing** | React Router DOM 7 |
| **Data Fetching** | TanStack React Query 5 |
| **Global State** | Zustand 5 (auth store with localStorage persistence) |
| **HTTP Client** | Axios |
| **Forms** | React Hook Form 7 + Zod schemas |
| **Notifications** | Sonner (toasts) |
| **Charts** | Recharts |
| **Token Handling** | jwt-decode |
| **Linting** | ESLint 10 + TypeScript ESLint |
| **Formatting** | Prettier |

---

## Project Structure

```
frontend/
├── .env                    # Base environment variables
├── .env.development        # Development overrides
├── .env.production         # Production overrides
├── .eslintrc.cjs           # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .dockerignore
├── vite.config.ts          # Vite configuration (dev server + proxy)
├── tsconfig.json           # Root TypeScript config (references)
├── tsconfig.app.json       # App TypeScript config
├── tsconfig.node.json      # Node TypeScript config (vite config)
├── index.html
├── package.json
├── public/                 # Static assets (favicon, manifest, etc.)
└── src/
    ├── App.tsx             # Root component - composes all providers + routes
    ├── main.tsx            # React entry point
    ├── index.css           # Global CSS imports
    ├── app/
    │   ├── providers/      # React context providers
    │   ├── router/         # Route guards and route definitions
    │   └── store/          # Zustand stores
    ├── components/         # Reusable component library
    │   ├── ui/             # ShadCN-style primitive components
    │   ├── layout/         # App layout, sidebars, header, mobile nav
    │   ├── shared/         # Shared utility components
    │   ├── forms/          # Form field primitives
    │   ├── tables/         # Data table components
    │   ├── charts/         # Recharts-based chart components
    │   └── errors/         # Error boundaries and fallbacks
    ├── features/           # Feature modules (domain-driven)
    ├── pages/              # Page components organized by role
    │   ├── auth/           # Login, register, accept invitation
    │   ├── owner/          # Owner portal pages
    │   ├── manager/        # Manager portal pages
    │   └── tenant/         # Tenant portal pages
    ├── lib/                # Library code (API, storage, security, utils)
    ├── types/              # Domain type definitions
    ├── config/             # App configuration modules
    ├── styles/             # Global CSS and design tokens
    ├── pwa/                # Progressive Web App logic
    ├── hooks/              # Custom React hooks
    ├── utils/              # Utility functions
    └── test/               # Test setup, mocks, and fixtures
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- npm 10+

### Installation

```bash
cd frontend
npm install
```

### Running the Development Server

The Vite dev server proxies `/api` requests to `http://localhost:3000` (the NestJS backend).

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Backend Dependency

The frontend expects a running ImaraRent backend at `VITE_API_URL` (default: `http://localhost:3000/api/v1`).
Start the backend first, then run the frontend.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production (`tsc -b && vite build`) |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Serve the production build locally |

---

## Architecture

### Feature-Based Organization

Each feature under `src/features/` follows a consistent internal structure:

```
src/features/<feature-name>/
├── types/           # TypeScript interfaces for the domain
├── services/        # API service functions (using @/lib/api/client)
├── hooks/           # React Query hooks + custom feature hooks
├── schemas/         # Zod validation schemas for forms
├── components/      # Feature-specific React components (when applicable)
├── __tests__/       # Unit tests
└── index.ts         # Feature barrel exports
```

**Available features (16):**

| Feature | Domain | Key Hooks / Services |
|---|---|---|
| `auth` | Authentication & session management | `use-login`, `use-register`, `use-logout`, `use-accept-invitation`, `authService` |
| `billing` | Invoices & billing cycles | `use-invoices`, `use-invoice`, `use-generate-invoices`, `billingService` |
| `dashboard` | Owner dashboard data | `use-dashboard`, `dashboardService` |
| `leases` | Lease agreements | `use-leases`, `use-lease`, `use-create-lease`, `use-activate-lease`, `leaseService` |
| `maintenance` | Maintenance tickets | `use-tickets`, `maintenanceService` |
| `manager-dashboard` | Manager dashboard data | `manager-dashboardService` |
| `notifications` | In-app & push notifications | `use-notifications`, `use-unread-count`, `notificationService` |
| `organizations` | Organization settings | — |
| `owner-dashboard` | Owner dashboard data | `owner-dashboardService` |
| `payments` | Payment processing (M-Pesa, manual) | `use-payments`, `paymentService` |
| `properties` | Property management | `use-properties`, `use-property`, `use-create-property`, `use-update-property`, `propertyService` |
| `reports` | Financial & operational reports | `use-reports`, `use-generate-report`, `reportService` |
| `tenant-dashboard` | Tenant dashboard data | `use-tenant-dashboard`, `tenant-dashboardService` |
| `tenants` | Tenant profiles & invitations | `use-tenants`, `use-tenant`, `use-invite-tenant`, `use-accept-invitation`, `tenantService` |
| `units` | Unit management | `use-units`, `use-unit`, `use-create-unit`, `use-bulk-create-units`, `unitService` |
| `users` | User account management | `use-users`, `use-user`, `userService` |

### Providers & Global State

The app is bootstrapped in `src/App.tsx`, which composes providers in this order:

1. **QueryProvider** (`src/app/providers/query-provider.tsx`) — Wraps the app with `QueryClientProvider` from TanStack React Query. Default stale time is 5 min, GC time 30 min, with auto-retry and React Query Devtools available in dev mode.
2. **BrowserRouter** — React Router v7 for client-side routing.
3. **AuthProvider** (`src/app/providers/auth-provider.tsx`) — Manages user session state (user object, tokens, authentication status, loading). Loads user from `localStorage` on mount, validates tokens by calling `authService.getCurrentUser()`, and provides `login`/`logout`/`refreshUser` methods via React Context.
4. **ToastProvider** (`src/app/providers/toast-provider.tsx`) — Provides `sonner`'s `<Toaster>` and a `showToast` helper with `success`, `error`, `warning`, `info`, `loading`, `promise`, and `dismiss` methods.

**Zustand Store** — `src/app/store/auth.store.ts` provides a persistent auth store (using `zustand/middleware`) as an alternative or complement to the Context-based `AuthProvider`. State is persisted to `localStorage` with a custom partialize function that stores only `user`, `tokens`, and `isAuthenticated`.

### Routing

Routing is defined in `src/app/router/index.tsx` using React Router v7 with lazy-loaded page components.

**Route guards:**

| Guard | File | Behavior |
|---|---|---|
| `PublicRoute` | `public-route.tsx` | Redirects authenticated users away from auth pages to `/dashboard` |
| `ProtectedRoute` | `protected-route.tsx` | Requires authentication; shows a loading spinner while checking, redirects to `/login` if unauthenticated |
| `RoleBasedRoute` | `role-based-route.tsx` | Renders children only if the user's role is in the `allowedRoles` prop; otherwise redirects to `/dashboard` |

**Role-based page resolution:**
The `RolePage` component dynamically renders the correct page variant based on the current user's role, so routes like `/dashboard`, `/properties`, `/units`, `/tenants`, `/leases`, `/billing/invoices`, `/payments`, `/maintenance`, and `/profile` resolve to role-specific pages without URL prefix differences.

**Route groups:**

| Route Pattern | Role(s) | Pages |
|---|---|---|
| `/login`, `/register`, `/accept-invitation` | Public | Auth pages |
| `/dashboard` | OWNER, MANAGER, TENANT | Role-specific dashboards |
| `/owner/*` | OWNER | Properties, units, tenants, leases, billing, payments, maintenance, reports, settings |
| `/manager/*` | MANAGER | Properties, units, tenants, leases, billing, payments, maintenance, profile |
| `/tenant/*` (and root-level) | TENANT | Lease, invoices, payments, maintenance, notifications, profile |
| `/properties/*`, `/units/*`, `/tenants/*`, `/leases/*`, `/billing/invoices/*`, `/payments/*`, `/maintenance/*` | OWNER/MANAGER (or TENANT for relevant) | Shared routes with role-aware page rendering |
| `/reports/*` | OWNER | Income statement, rent roll, arrears aging, occupancy, maintenance |
| `/settings/*` | OWNER | Organization settings, manager access |
| `*` | — | 404 Not Found page |

### API Layer

**`src/lib/api/client.ts`** — The core HTTP client:

- Uses Axios with a base URL from `VITE_API_URL`.
- **Request interceptor** automatically attaches the `Authorization: Bearer <token>` header from `localStorage`.
- **Response interceptor** handles 401 errors by attempting a token refresh: calls `/auth/refresh`, stores new tokens, retries the original request, and on failure removes all auth data and redirects to `/login`.
- Exports a convenience `api` object with typed `get`, `post`, `put`, `patch`, `delete`, and `upload` (multipart) methods.

**`src/lib/api/api-types.ts`** — Defines `ApiResponse<T>` (data, message, success) and `ApiError` (message, statusCode, errors) interfaces.

**Other lib modules:**

| Module | Purpose |
|---|---|
| `src/lib/constants.ts` | API route definitions, storage keys, user roles, status constants, date formats, regex patterns |
| `src/lib/formatters.ts` | Date, currency (KES), number, phone number, and address formatting utilities |
| `src/lib/security/` | Token decoding/validation (`jwt-decode`), role-based permission checks, input sanitization |
| `src/lib/storage/` | Type-safe `localStorage` and `sessionStorage` wrappers |
| `src/lib/realtime/` | WebSocket event types and notification socket (feature-flagged) |
| `src/lib/utils.ts` | `cn()` helper — merges Tailwind classes with `clsx` + `tailwind-merge` |
| `src/utils/` | Standalone utilities: validators, string/number/date helpers, file helpers, URL helpers, error handlers |

### Role-Based Access

The app supports three roles defined in `src/types/user.types.ts`:

| Role | Description |
|---|---|
| `OWNER` | Full access; manages properties, units, tenants, leases, billing, payments, maintenance, reports, and organization settings. Can invite managers. |
| `MANAGER` | Limited access to properties, units, tenants, leases, billing, payments, and maintenance. Cannot access reports or settings. |
| `TENANT` | Self-service access to lease details, invoices, payments (including M-Pesa), maintenance tickets, notifications, and profile. |

Role-specific sidebars render different navigation items:

| Sidebar | File |
|---|---|
| Owner Sidebar | `src/components/layout/owner-sidebar.tsx` |
| Manager Sidebar | `src/components/layout/manager-sidebar.tsx` |
| Tenant Sidebar | `src/components/layout/tenant-sidebar.tsx` |

### Styling

- **Tailwind CSS v4** with the `@tailwindcss/vite` plugin.
- **Design tokens** defined in `src/styles/variables.css` and `src/styles/globals.css`:
  - Brand color palette (green: `--color-brand-50` through `--color-brand-950`)
  - Neutral color palette (gray: `--color-neutral-50` through `--color-neutral-950`)
  - Status colors (success, warning, error, info)
  - Border radius tokens (`--radius-sm` through `--radius-full`)
  - Shadow tokens (`--shadow-xs` through `--shadow-2xl`)
- **Global CSS** (`src/styles/globals.css`) includes base styles, custom components (`.container-center`, `.card-hover`, `.glass-effect`), and dark mode support (`.dark` class).
- **Animations** (`src/styles/animations.css`) provide fade-in, slide-up, slide-down, scale-in, pulse, spin, and bounce animations.
- **Component utilities** (`src/lib/utils.ts` → `cn()`) combine `clsx` and `tailwind-merge` for conditional class merging.

**Component library** (`src/components/ui/`):

| Component | Description |
|---|---|
| `button.tsx` | Button with variants (default, destructive, outline, secondary, ghost, link) and sizes |
| `input.tsx`, `textarea.tsx` | Form inputs |
| `card.tsx` | Card container with header, content, footer |
| `badge.tsx` | Status badges |
| `select.tsx`, `dropdown-menu.tsx` | Select and dropdown primitives (Radix UI) |
| `dialog.tsx`, `drawer.tsx`, `modal.tsx` | Modal overlays |
| `table.tsx` | Table primitives |
| `avatar.tsx` | User avatar |
| `separator.tsx`, `skeleton.tsx`, `sSwitch.tsx` | Layout primitives |
| `loading-spinner.tsx` | Loading indicator |
| `pagination.tsx` | Paginated data navigation |
| `tooltip.tsx`, `popover.tsx` | Interactive overlays |
| `date-picker.tsx` | Date selection (Radix UI) |
| `file-upload.tsx` | File upload with drag-and-drop |
| `empty-state.tsx` | Empty state illustrations |
| `toast.tsx` | Toast component |

### PWA & Offline

Located in `src/pwa/`, this module provides progressive web app capabilities (disabled by default, controlled by `VITE_ENABLE_PWA=false`):

| Module | Purpose |
|---|---|
| `index.ts` | PWA entry point |
| `register-sw.ts` | Service worker registration |
| `cache.ts` | Caching strategies |
| `offline.ts` | Offline fallback handling |
| `sync.ts` | Background sync for form submissions |
| `push.ts` | Push notification support |

### Testing

Located in `src/test/` with a feature-based test structure:

```
src/test/
├── setup.ts               # Test environment setup
├── mocks/
│   ├── api-mocks.ts       # MSW-based API mocks
│   ├── auth-mocks.ts      # Auth service mocks
│   └── data-mocks.ts      # Domain data mock factories
├── fixtures/
│   ├── user.fixture.ts
│   ├── property.fixture.ts
│   └── invoice.fixture.ts
└── utils/
    ├── test-utils.tsx     # Custom render with providers
    └── render-with-providers.tsx
```

Tests use Jest + React Testing Library with MSW for API mocking. Run tests with:

```bash
npm test          # or however the test command is configured
```

---

## Configuration

| Config File | Description |
|---|---|
| `src/config/env.ts` | Centralized environment variable access with defaults and validation |
| `src/config/api.config.ts` | Axios instance config (base URL, timeout, retry, CORS, headers) |
| `src/config/auth.config.ts` | Token storage keys, expiry times, redirect paths, role redirects |
| `src/config/app.config.ts` | App metadata, theme modes, language locales, date formats, currency (KES), notification config, pagination defaults, file upload limits |
| `src/config/feature-flags.ts` | Feature flag configuration (M-Pesa, realtime WebSockets, PWA, reports, maintenance, tenant portal, dev tools) |
| `src/config/mpesa.config.ts` | M-Pesa payment configuration |

### Vite Config (`vite.config.ts`)

- **@/**: Path alias to `src/`
- **Port**: 5173
- **Proxy**: `/api` → `http://localhost:3000` (backend API)
- **Plugins**: `@vitejs/plugin-react` (Fast Refresh, TypeScript), `@tailwindcss/vite` (Tailwind CSS v4)

---

## Environment Variables

All environment variables use the `VITE_` prefix (exposed to the client bundle).

### Available Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | Backend API base URL |
| `VITE_APP_NAME` | `ImaraRent` | Application name |
| `VITE_APP_DESCRIPTION` | `Property Management System` | App description |
| `VITE_APP_VERSION` | `1.0.0` | App version |
| `VITE_ENABLE_MPESA` | `true` | Enable M-Pesa payment integration |
| `VITE_ENABLE_REALTIME` | `false` | Enable real-time WebSocket features |
| `VITE_ENABLE_PWA` | `false` | Enable Progressive Web App features |
| `VITE_SENTRY_DSN` | *(empty)* | Sentry error tracking DSN |
| `VITE_MOCK_API` | *(empty)* | Enable API mocking in development |
| `MODE` | *(vite-injected)* | `development` / `production` / `test` |

### Environment Files

| File | Usage |
|---|---|
| `.env` | Base configuration (loaded first) |
| `.env.development` | Development overrides |
| `.env.production` | Production overrides |

> **Note:** `.env*` files are gitignored. Copy `.env` or create `.env.local` for local overrides.

**Production environment** enables realtime (`VITE_ENABLE_REALTIME=true`), PWA (`VITE_ENABLE_PWA=true`), and points to `https://api.imararent.com/api/v1`.

**Development environment** uses `http://localhost:3000/api/v1` with the app name suffixed as `(Dev)`.

---

## Conventions

### Code Style

- **Prettier**: 2-space indentation, single quotes, semicolons, trailing commas (es5), 100-char print width.
- **ESLint**: Extends `eslint:recommended`, `@typescript-eslint/recommended`, and `react-hooks/recommended`. Rules include strict hooks rules and unused-vars warnings.
- **Import alias**: Use `@/` to reference `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).
- **Type imports**: Use `import { type Foo }` syntax (enforced by `verbatimModuleSyntax: true`).

### File Naming

- Components: `kebab-case.tsx` (e.g., `loading-spinner.tsx`)
- Hooks: `kebab-case.ts` (e.g., `use-intersection-observer.ts`)
- Types: `kebab-case.ts` (e.g., `property.types.ts`)

### Component Structure

```
components/
├── ui/           # Reusable, design-system primitives (framework-agnostic)
├── layout/       # App-wide layout components (sidebars, header, mobile nav)
├── shared/       # Cross-cutting components (logo, theme toggle, page headers)
├── forms/        # Form field primitives (wrappers around ui components)
├── tables/       # Data table building blocks
├── charts/       # Chart components wrapping Recharts
└── errors/       # Error boundaries and fallback UIs
```

### Domain Model

The app models a property management system with these core entities:

| Entity | File | Key Fields |
|---|---|---|
| **User** | `types/user.types.ts` | id, email, firstName, lastName, role (OWNER/MANAGER/TENANT), isActive |
| **Property** | `types/property.types.ts` | name, address, city, county, units, stats |
| **Unit** | `types/unit.types.ts` | number, bedrooms, bathrooms, squareFeet, rentAmount, status |
| **Tenant** | `types/tenant.types.ts` | firstName, lastName, email, phone, nationalId, status, invitationToken |
| **Lease** | `types/lease.types.ts` | startDate, endDate, rentAmount, depositAmount, status, tenantId, unitId |
| **Invoice** | `types/invoice.types.ts` | invoiceNumber, issueDate, dueDate, totalAmount, paidAmount, balance, status |
| **Payment** | `types/payment.types.ts` | amount, paymentDate, method (MPESA/CASH/BANK_TRANSFER/CARD), status, allocations |
| **MaintenanceTicket** | `types/maintenance.types.ts` | title, description, priority, status, cost, tenantId, unitId, photos |
| **Notification** | `types/notification.types.ts` | — |
| **Report** | `types/report.types.ts` | period, format, metadata, type-specific summary |
| **Organization** | `types/organization.types.ts` | — |

### Key Flows

1. **Authentication**: Login via `/login` → API returns `{ accessToken, refreshToken, user }` → tokens stored in `localStorage`/`zustand` → role-based redirect to `/dashboard`.
2. **Token refresh**: 401 response triggers refresh token flow in the Axios interceptor → new tokens stored → original request retried.
3. **Role routing**: Shared routes (e.g., `/dashboard`) use the `RolePage` component to render the correct role-specific page.
4. **Feature flags**: M-Pesa, realtime WebSockets, and PWA are toggled via `VITE_ENABLE_*` environment variables and consumed via `src/config/feature-flags.ts`.
