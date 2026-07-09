# Production Audit

Checklist completed for the JFF Footwear monorepo (web + mobile).

## Data layer

- `apps/web/data/pages.ts` re-exports `@jff/shared/pages`
- `company.ts` / `content.ts` re-export shared packages; web-only stats in `COMPANY_STATS`
- Single product catalog in `@jff/shared`

## Web pages

- Business pages: wholesale, OEM, dealer, distributor, catalog, customize, quality-commitment
- `BusinessPageScaffold` + breadcrumbs (`apps/web/lib/breadcrumbs.ts`)
- About, product, dealer, customize use consistent `PageShell`
- Removed fictional UI (awards section, language switcher)

## Mobile parity (`apps/mobile`)

- Screens: customize, collections, catalog, compare, recently-viewed
- Shared config via `@jff/config`, `@jff/shared`, `@jff/hooks`

## Build fixes

- `ProductCustomizerWizard` — `cn` import
- `ProductActions` — compare, toast, share, pricing imports
- `ProductPageSections` — care/size guide paths
- `EmptyState` — optional icon (fixes server→client serialization on empty collections)

## Deploy targets

| Target       | Status        | URL                                             |
| ------------ | ------------- | ----------------------------------------------- |
| GitHub Pages | Live          | https://ggovardhanreddy.github.io/jff-footwear/ |
| Vercel       | Needs secrets | See `SECRETS_SETUP.md`                          |
| Expo OTA     | Needs secrets | See `OTA_UPDATES.md`                            |

## Manual smoke test

1. Home, products, collections (including kids empty state)
2. Cart → checkout → WhatsApp order flow
3. Business pages grid links in footer
4. `/quality-commitment/`, `/catalog/`, `/customize/`
5. Search, wishlist, compare (noindex but functional)
