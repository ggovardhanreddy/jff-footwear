# Free Stack Setup — JFF Premium E-Commerce

Zero monthly cost path for auth, coins, orders, payments (test), and PWA install.

## Architecture decisions (locked)

| Decision                       | Choice                                                                     |
| ------------------------------ | -------------------------------------------------------------------------- |
| Auth / DB / Storage / Realtime | **Supabase Free Tier only**                                                |
| Catalog source of truth (now)  | **Static JSON** in the repo (`apps/web` data generators)                   |
| Supabase `catalog_products`    | Optional admin overlay — **do not migrate the full catalog yet**           |
| Payments                       | Razorpay **test** keys + WhatsApp / COD fallback                           |
| Hosting                        | Vercel Hobby and/or GitHub Pages static export                             |
| Native stores                  | **Deferred** — PWA `/install` first (no Play $25 / Apple $99 until proven) |
| Firebase / AWS / paid APIs     | **Out of scope**                                                           |

## 1. Supabase (free)

1. Create a project at [supabase.com](https://supabase.com) (Free plan).
2. Open **SQL Editor** and run [`supabase/migrations/001_jff_schema.sql`](../supabase/migrations/001_jff_schema.sql).
3. Copy **Project URL** and **anon public** key into `apps/web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

4. Auth: enable **Email** provider. Magic link works on free tier. Phone OTP may need SMS credits — email-first is free.

### Catalog admin migration (required for `/admin`)

Run the combined paste file once:

1. Open [SQL Editor](https://supabase.com/dashboard/project/paklcbkldoocuaxuavxn/sql/new) (or your project).
2. Paste contents of [`supabase/migrations/APPLY_002_AND_PROMOTE.sql`](../supabase/migrations/APPLY_002_AND_PROMOTE.sql).
3. Click **Run**.

That applies `002_catalog_admin.sql` and promotes `govardhan.reddy.g.94@gmail.com` to `role = 'admin'`.

Or run separately:

```sql
-- after 002
update public.profiles set role = 'admin' where email = 'govardhan.reddy.g.94@gmail.com';
```

Then open http://localhost:3000/admin/

> **Catalog stance:** Keep shipping products from static JSON. Use Supabase tables for orders, coins, coupons, banners, and future admin edits — full catalog cutover only after admin CRUD is proven.

## 2. Edge Functions (optional — deploy when online pay is ready)

Until Razorpay live keys + Edge Functions are deployed, checkout works via **WhatsApp** and **COD** (signed-in).

When ready:

```bash
npx supabase login
npx supabase link --project-ref YOUR_REF
npx supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=xxx
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Dashboard → Settings → API
npx supabase functions deploy place-order
npx supabase functions deploy create-razorpay-order
```

Do **not** put the service role key in the browser or `.env.local` for the Next app.

## 3. Razorpay (no monthly fee)

1. Sign up at [razorpay.com](https://razorpay.com) (India).
2. Use **Test Mode** keys until you are ready to sell.
3. Add to `.env.local`:

```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

`RAZORPAY_KEY_SECRET` belongs only in Edge Function secrets.

## 4. Hosting — Vercel Hobby (free)

Static GitHub Pages remains available, but for Supabase auth redirects prefer Vercel:

1. Import the repo on [vercel.com](https://vercel.com) (Hobby).
2. Root / filter: `apps/web` (or monorepo settings).
3. Add the same env vars.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL.

> Note: `output: "export"` keeps a static build for Pages. Client-side Supabase + Edge Functions work with static export. If you later need Next.js Route Handlers, remove `output: "export"` on the Vercel deploy only.

## 5. PWA install (free — no Play / App Store)

- Manifest: `apps/web/public/manifest.webmanifest`
- Service worker: `apps/web/public/sw.js`
- Install UX: banner, sticky button, exit intent, `/install`

Users install from Chrome/Edge/Safari (Add to Home Screen). Store badges stay hidden until you can afford Play ($25) / Apple ($99/year).

## 6. Social links

Edit `SOCIAL_LINKS` in [`packages/config/src/constants.ts`](../packages/config/src/constants.ts).

- WhatsApp + email are live from `COMPANY` / `WHATSAPP_NUMBER`.
- Leave Instagram / Facebook / YouTube / LinkedIn **empty** until real profiles exist (`getConfiguredSocialLinks()` hides empties).
- GitHub shows in development only.

## 7. Local develop

```bash
cp .env.example apps/web/.env.local
# fill Supabase keys
npm install
npm run dev:web
```

Open http://localhost:3000 — shop home, account, rewards, install prompts.

## Soft-launch checklist (this week)

1. **Admin** — Sign in → `/admin`. If blocked, copy the promote SQL from the page and run it in Supabase, then refresh.
2. **Guest checkout** — Add to cart (no login) → Checkout → Continue as guest → complete address → **Order on WhatsApp**.
3. **COD** — Sign in → Checkout → choose COD → place order (requires signed-in user).
4. **Phone** — Open home, search, wholesale, cart; confirm floating bottom nav and sticky header feel right.
5. **PWA** — Open `/install` on phone → Add to Home Screen (iOS Share sheet / Android Install).
6. **Do not** migrate full catalog to Supabase yet; **do not** deploy Edge Functions until Razorpay test keys are ready.

Local smoke (with `npm run dev:web` running):

```bash
./scripts/smoke-web.sh
```

## Hybrid checkout

- Guests can add to cart freely.
- At checkout: **Sign in** (coins + online pay) or **Continue as guest** (WhatsApp only).

## Animation policy

- **Framer Motion** — navbar, carousel, flips, micro-interactions.
- **GSAP** — scroll-triggered staggered grids only (`StaggeredGrid`, category entrances).
- See [`apps/web/components/premium/README.md`](../apps/web/components/premium/README.md).

## Mobile later

Same Supabase project can power `apps/mobile` with `@supabase/supabase-js` — out of scope for the first web milestone.

## Auto dependency updates

See [AUTO_DEPS.md](./AUTO_DEPS.md) — Dependabot + nightly refresh PRs + deploy-time `npm update` (Node 22 from `.nvmrc`). There is no Nest.js app; web is Next.js.
