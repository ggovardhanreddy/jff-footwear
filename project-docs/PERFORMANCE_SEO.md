# Performance & SEO

JFF Footwear web app (`apps/web`) is optimized for static export on **GitHub Pages**.

## SEO (`apps/web/lib/seo.ts`)

- `createMetadata()` — titles, descriptions, canonical URLs, Open Graph, Twitter cards
- `index: false` on utility pages (cart, checkout, wishlist, compare, search, recently-viewed)
- JSON-LD: Organization, WebSite, LocalBusiness, Product, BreadcrumbList, ItemList, SearchAction

## Sitemap & robots

- `apps/web/lib/sitemap-config.ts` — public routes and priorities
- `apps/web/app/sitemap.ts` — dynamic sitemap generation at build time
- `apps/web/app/robots.ts` — allows indexing; blocks `/api/` if present

## Static export

- `output: "export"` in `apps/web/next.config.ts`
- Deploy script: `npm run deploy:pages` → copies `apps/web/out` to `/docs`

## Performance

- **Images:** `AssetImage` with lazy loading defaults
- **Code splitting:** cinematic home hero, gallery lightbox loaded on demand
- **Caching:** GitHub Pages CDN for static assets; service worker `apps/web/public/sw.js`
- **Budgets:** `apps/web/performance-budgets.json`
- **Lighthouse CI:** `apps/web/lighthouserc.cjs` (runs in `deploy-main` workflow)

## Accessibility

- Skip link, focus trap in modals, `useEscapeKey`, reduced-motion gates in motion components
- Route-change focus management on `main#main-content`

## Environment

```bash
NEXT_PUBLIC_SITE_URL=https://www.jffstores.com
```
