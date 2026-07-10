# Architecture

```
jff-footwear/
├── apps/
│   ├── web/          Next.js 15 static export → GitHub Pages / Vercel + PWA
│   └── mobile/       Expo 52 → EAS Update + store builds
├── packages/
│   ├── api/          Supabase client, Edge invoke, Realtime helpers, coins
│   ├── config/       Constants, routes, business pages
│   ├── types/        Shared TypeScript types
│   ├── utils/        Pricing, delivery, WhatsApp orders
│   ├── shared/       Products, pages content, validation
│   ├── hooks/        TanStack Query
│   └── ui/           Brand theme, format helpers
├── supabase/
│   ├── migrations/   SQL schema (001–005)
│   └── functions/    Edge Functions (analyze-product-images, place-order, …)
├── docs/             GitHub Pages static output (generated)
└── project-docs/     Developer documentation (this folder)
```

## Runtime data flow

```
Admin UI ──write──► Supabase (Postgres + Storage + Realtime)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
      Web PWA         Expo app      Edge Functions
   (subscribe)     (subscribe)     (Gemini / orders)
```

- **Storefront catalog (today):** static generated JSON from image folders.
- **Admin catalog overlay:** `catalog_products` + AI analyzer; Realtime keeps admin lists fresh.
- **Auth / orders / coins / notifications:** Supabase only.

## Import rules

Always import shared code from packages — do not duplicate in apps:

```ts
import { products } from "@jff/shared/products";
import { COMPANY } from "@jff/config/constants";
import { formatINR } from "@jff/utils/pricing";
import { subscribeTable, getSupabaseBrowserClient } from "@jff/api";
```

## Build pipeline

Turbo orchestrates `dev`, `build`, `lint`, `typecheck`, `test` across workspaces.

## Deploy paths

| Change                   | Trigger                   |
| ------------------------ | ------------------------- |
| `apps/web`, `packages/*` | CI + GitHub Pages rebuild |
| Secrets configured       | + Vercel + Expo OTA       |

See [AUTOMATED_DEPLOYMENT.md](./AUTOMATED_DEPLOYMENT.md) · [SECRETS_SETUP.md](./SECRETS_SETUP.md) · [DEFERRED_ROADMAP.md](./DEFERRED_ROADMAP.md) · [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) · [STORE_CHECKLIST.md](./STORE_CHECKLIST.md).
