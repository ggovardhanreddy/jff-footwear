# JFF Footwear Monorepo

Turborepo monorepo: **Next.js website (PWA)** + **Expo mobile** (Android/iOS) with shared packages and a **Supabase** backend.

**Live site:** https://www.jffstores.com/

## Docs

| Doc                                                             | Purpose                        |
| --------------------------------------------------------------- | ------------------------------ |
| [ARCHITECTURE.md](project-docs/ARCHITECTURE.md)                 | System diagram                 |
| [FREE_STACK_SETUP.md](project-docs/FREE_STACK_SETUP.md)         | Supabase + Gemini + Realtime   |
| [ADMIN_GUIDE.md](project-docs/ADMIN_GUIDE.md)                   | Admin + AI products            |
| [AUTOMATED_DEPLOYMENT.md](project-docs/AUTOMATED_DEPLOYMENT.md) | CI/CD                          |
| [SECRETS_SETUP.md](project-docs/SECRETS_SETUP.md)               | GitHub / Vercel / Expo secrets |
| [STORE_CHECKLIST.md](project-docs/STORE_CHECKLIST.md)           | Play / TestFlight / EAS        |
| [OTA_UPDATES.md](project-docs/OTA_UPDATES.md)                   | Expo OTA                       |
| [DEFERRED_ROADMAP.md](project-docs/DEFERRED_ROADMAP.md)         | What is not built yet          |

## Structure

```
apps/web/          Next.js 15 → GitHub Pages / Vercel
apps/mobile/       Expo 52 → EAS Update + store builds
packages/
  api/             Supabase, Realtime, Edge invoke, coins
  types/           Shared TypeScript types
  config/          Constants, shipping, pricing
  utils/           Business logic
  shared/          Products catalog, content
  hooks/           TanStack Query
  ui/              Brand theme
supabase/          Migrations + Edge Functions
```

## Quick start

```bash
npm install
npm run dev:web       # http://localhost:3000
npm run dev:mobile    # Expo
npm run build
npm run generate      # Regenerate products from images
```

## Environment

See [.env.example](.env.example). Never put `GEMINI_API_KEY` or service-role keys in `NEXT_PUBLIC_*`.

## CI/CD (`git push origin main`)

| Step                             | Action                      |
| -------------------------------- | --------------------------- |
| Lint + typecheck + tests + build | Quality gates               |
| Sitemap + Lighthouse             | SEO audit                   |
| GitHub Pages                     | Always (static `/docs`)     |
| Vercel                           | When `VERCEL_*` secrets set |
| EAS Update                       | When `EXPO_TOKEN` set       |

**Vercel pause:** until secrets are added, production stays on GitHub Pages. See [SECRETS_SETUP.md](project-docs/SECRETS_SETUP.md).

## Company

**JFF Footwear** — Rayachoty, Andhra Pradesh (founded January 2021). WhatsApp: +91 81064 07372
