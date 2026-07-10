# Admin guide

## Access

1. Sign in at `/login` with your store email.
2. Open `/admin`.
3. If you see “Admin access needed”, run in Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'govardhan.reddy.g.94@gmail.com';
```

## Products (AI)

1. Go to **Products** (`/admin/products`).
2. Upload 1–6 photos (AI analyzes the first 3).
3. Click **Analyze with AI** (requires Edge Function `analyze-product-images` + `GEMINI_API_KEY` secret).
4. Edit any field (name, descriptions, specs, SEO, price).
5. **Save product** → writes `catalog_products` + `product_images`.

Low-confidence fields show **Needs Manual Review**.

## Orders / Coupons / Banners

- Lists refresh automatically via **Supabase Realtime** when another admin (or the system) changes data.
- Order status updates are optimistic, then confirmed from the database.

## Migrations to run (SQL Editor)

| File                                                  | Purpose                         |
| ----------------------------------------------------- | ------------------------------- |
| `001_jff_schema.sql`                                  | Core auth/orders/coins          |
| `002_catalog_admin.sql` / `APPLY_002_AND_PROMOTE.sql` | Catalog admin + promote         |
| `004_product_ai_fields.sql`                           | AI columns + Storage bucket     |
| `005_realtime_publication.sql`                        | Realtime + push preference stub |

## Edge Functions

```bash
npx supabase functions deploy analyze-product-images
npx supabase secrets set GEMINI_API_KEY=...
```

Optional: `place-order`, `create-razorpay-order` when online pay is ready.
