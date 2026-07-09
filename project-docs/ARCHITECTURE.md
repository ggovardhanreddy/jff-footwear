# Architecture

```
jff-footwear/
├── apps/
│   ├── web/          Next.js 15 static export → GitHub Pages / Vercel
│   └── mobile/       Expo 52 → EAS Update + store builds
├── packages/
│   ├── config/       Constants, routes, business pages
│   ├── types/        Shared TypeScript types
│   ├── utils/        Pricing, delivery, WhatsApp orders
│   ├── shared/       Products, pages content, validation
│   ├── hooks/        TanStack Query
│   └── ui/           Brand theme, format helpers
├── docs/             GitHub Pages static output (generated)
└── project-docs/     Developer documentation (this folder)
```

## Import rules

Always import shared code from packages — do not duplicate in apps:

```ts
import { products } from "@jff/shared/products";
import { COMPANY } from "@jff/config/constants";
import { formatINR } from "@jff/utils/pricing";
```

## Build pipeline

Turbo orchestrates `dev`, `build`, `lint`, `typecheck`, `test` across workspaces.

## Deploy paths

| Change                   | Trigger                   |
| ------------------------ | ------------------------- |
| `apps/web`, `packages/*` | CI + GitHub Pages rebuild |
| Secrets configured       | + Vercel + Expo OTA       |

See [AUTOMATED_DEPLOYMENT.md](./AUTOMATED_DEPLOYMENT.md).
