# JFF Footwear Monorepo

Turborepo monorepo: **Next.js website** + **Expo mobile** (Android/iOS) with shared packages.

**Architecture:** [project-docs/ARCHITECTURE.md](project-docs/ARCHITECTURE.md) · **Free backend setup:** [project-docs/FREE_STACK_SETUP.md](project-docs/FREE_STACK_SETUP.md)

## Structure

```
apps/web/          Next.js 15 → Vercel
apps/mobile/       Expo 52 → EAS Update + store builds
packages/
  types/           Shared TypeScript types
  config/          Constants, shipping, pricing
  utils/           Business logic (pricing, delivery, pincode)
  shared/          Products catalog, content, validation
  hooks/           TanStack Query keys + factories
  ui/              Brand theme + format helpers
  api/             Supabase client, coins helpers, order types
```

## Quick start

```bash
npm install
npm run dev:web       # http://localhost:3000
npm run dev:mobile    # Expo
npm run build         # Build all
npm run generate      # Regenerate products from images
```

## Environment

See [.env.example](.env.example). Per-app:

- `apps/web` — `NEXT_PUBLIC_SITE_URL`
- `apps/mobile` — `EXPO_PUBLIC_WEB_ASSET_BASE_URL`, `EAS_PROJECT_ID`

## CI/CD (`git push origin main`)

| Step                 | Action                             |
| -------------------- | ---------------------------------- |
| Lint + tests + build | Quality gates                      |
| Sitemap + Lighthouse | SEO audit                          |
| GitHub Pages         | Static site at `/docs` (always)    |
| Vercel               | Optional — when secrets configured |
| EAS Update           | Optional — OTA to production       |

**Live site:** https://www.jffstores.com/

Docs: [project-docs/AUTOMATED_DEPLOYMENT.md](project-docs/AUTOMATED_DEPLOYMENT.md) · [project-docs/OTA_UPDATES.md](project-docs/OTA_UPDATES.md) · [project-docs/SECRETS_SETUP.md](project-docs/SECRETS_SETUP.md)

## GitHub Secrets

| Secret               | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `EXPO_TOKEN`         | Expo / EAS API access                        |
| `EAS_PROJECT_ID`     | Expo project UUID                            |
| `VERCEL_TOKEN`       | Vercel deploy token                          |
| `VERCEL_ORG_ID`      | Vercel team ID                               |
| `VERCEL_PROJECT_ID`  | Vercel project ID                            |
| `VERCEL_SITE_URL`    | Production site URL                          |
| `DEPLOY_WEBHOOK_URL` | Optional — Slack/Discord deploy notification |

## Shared code

Import from packages — never duplicate:

```ts
import { products } from "@jff/shared/products";
import { formatINR } from "@jff/utils/pricing";
import { COMPANY } from "@jff/config/constants";
import type { Product } from "@jff/types";
```

## Company

**JFF Footwear** — Rayachoty, Andhra Pradesh (founded January 2021). WhatsApp: +91 81064 07372
