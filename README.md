# JFF Footwear

Premium slippers manufacturer website built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **Lucide React** icons
- **JSON-only** product data — no database, no backend, no paid services

## Quick Start

```bash
npm install
npm run generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live Site

**https://ggovardhanreddy.github.io/jff-footwear/**

Deployed automatically via GitHub Pages on every push to `main`.

## Product Discovery

Products are **automatically generated** from image folders in:

```
public/images/products/
```

Supported image formats: `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`

### Adding New Products

1. Create a folder inside `public/images/products/` with your product images
2. Run `npm run generate`
3. The new product appears on the website automatically

### Folder Structure Examples

```
public/images/products/jff-051/main.png
public/images/products/Men/Bathroom/Black/F1.png
public/images/products/Women/Fashion/Red/
public/images/products/Unisex/EVA/
```

The generator infers **gender**, **category**, **material**, and **color** from folder names.

## Project Structure

```
app/                  # Pages (App Router)
components/           # UI components
data/                 # Generated products + static content
hooks/                # Custom React hooks
lib/                  # Utilities, constants, SEO
public/images/        # Static assets
scripts/              # Product generator
styles/               # Global CSS
types/                # TypeScript types
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured, categories, testimonials |
| `/products` | Product catalog with filters |
| `/products/[slug]` | Product detail with gallery & WhatsApp inquiry |
| `/about` | Company story, mission, manufacturing |
| `/gallery` | Masonry gallery with lightbox |
| `/contact` | Contact form & WhatsApp |
| `/faq` | FAQ accordion |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms of service |

## WhatsApp Inquiries

Instead of a cart, customers use **Send Inquiry** which opens WhatsApp with pre-filled product details.

Update the WhatsApp number in `lib/constants.ts`:

```ts
export const WHATSAPP_NUMBER = "918106407372";
```

## SEO

- Dynamic metadata per page
- OpenGraph & Twitter Cards
- `robots.txt` and `sitemap.xml`
- Schema.org JSON-LD (Organization, Product, Breadcrumb)

## License

Private — JFF Footwear © 2026
