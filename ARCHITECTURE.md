# EROX Clone — Architecture Document

## Overview

Full-featured e-commerce website for an adult wellness brand. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, and Zustand. All product data is static JSON (3,519 products), served via SSG.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, `src/` directory) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Zustand (cart, persisted to localStorage) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Carousel | Embla Carousel (via shadcn) |
| Image Zoom | react-medium-image-zoom |
| Lightbox | yet-another-react-lightbox |
| Toast | react-hot-toast |
| Slider | Swiper (hero, brand carousel) |

---

## Data Model

### Product
```typescript
interface Product {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  salePrice: number | null
  description: string          // HTML content
  images: string[]             // CDN URLs (avg 4 per product)
  originalImages: string[]
  category: string             // Display name
  categorySlug: string
  subcategorySlug: string | null
  sku: string
  inStock: boolean
  specs: Record<string, string>
}
```

### Category
```typescript
interface Category {
  slug: string
  name: string
  subcategories: { slug: string; name: string }[]
}
```

### Other Data Types
- **SiteConfig** — branding, contact, payment (IBAN), shipping, stores, SEO
- **HeroSlide** — id, src, alt, href, title
- **Brand** — name, slug, logo, categorySlug, productCount
- **Navigation** — announcementBar, navLinks, footerLinks
- **PromoImages** — categoryShowcase, promoBanners
- **TrustBadge** — id, icon, title, description
- **FAQ** — id, question, answer, category
- **StaticPages** — hakkimizda, kargo, iade, gizlilik, iletisim

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, theme, providers)
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx           # Custom 404
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── robots.ts               # Robots.txt
│   ├── kategori/
│   │   └── [slug]/
│   │       ├── page.tsx        # Category page
│   │       └── [subSlug]/
│   │           └── page.tsx    # Subcategory page
│   ├── urun/
│   │   └── [slug]/
│   │       └── page.tsx        # Product detail page
│   ├── sepet/
│   │   └── page.tsx            # Cart page
│   ├── odeme/
│   │   └── page.tsx            # Checkout page
│   ├── arama/
│   │   └── page.tsx            # Search results
│   ├── marka/
│   │   └── [slug]/
│   │       └── page.tsx        # Brand page
│   ├── hakkimizda/page.tsx
│   ├── kargo/page.tsx
│   ├── iade/page.tsx
│   ├── gizlilik/page.tsx
│   ├── iletisim/page.tsx
│   └── sss/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── AnnouncementBar.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductInfo.tsx
│   │   └── RelatedProducts.tsx
│   ├── home/
│   │   ├── HeroSlider.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── FeaturedCategories.tsx
│   │   ├── TrendingProducts.tsx
│   │   ├── PromoBanners.tsx
│   │   ├── BrandShowcase.tsx
│   │   ├── FAQPreview.tsx
│   │   └── Newsletter.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   ├── shared/
│   │   ├── PriceDisplay.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── SortSelect.tsx
│   │   ├── Pagination.tsx
│   │   ├── CategoryCard.tsx
│   │   └── EmptyState.tsx
│   └── ui/                     # shadcn/ui components
├── data/                       # JSON data files (copied from erox-data-export)
│   ├── products.json
│   ├── categories.json
│   ├── site-config.json
│   ├── hero-slides.json
│   ├── brands.json
│   ├── navigation.json
│   ├── promo-images.json
│   ├── trust-badges.json
│   ├── faq.json
│   └── static-pages.json
├── lib/
│   ├── data.ts                 # Data access functions
│   ├── utils.ts                # cn() utility + helpers
│   ├── format.ts               # Price formatting, discount calc
│   └── types.ts                # TypeScript interfaces
├── store/
│   └── cart.ts                 # Zustand cart store
└── hooks/
    └── useMediaQuery.ts        # Responsive hooks
```

---

## Pages & Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSG | Homepage — hero, categories, products, brands, FAQ |
| `/kategori/[slug]` | SSG | Category page — product grid, subcategory filters, sort, pagination |
| `/kategori/[slug]/[subSlug]` | SSG | Subcategory filtered view |
| `/urun/[slug]` | SSG | Product detail — gallery, specs, price, add to cart, related |
| `/sepet` | Client | Cart — item list, totals, shipping threshold |
| `/odeme` | Client | Checkout — customer form, IBAN display, WhatsApp flow |
| `/arama` | Client | Search results — text search across products |
| `/marka/[slug]` | SSG | Brand page — all products by brand |
| `/hakkimizda` | SSG | About page |
| `/kargo` | SSG | Shipping info |
| `/iade` | SSG | Returns policy |
| `/gizlilik` | SSG | Privacy policy |
| `/iletisim` | SSG | Contact page |
| `/sss` | SSG | FAQ page |

### Static Generation
- `generateStaticParams` on all dynamic routes
- 3,519 product pages, 15 category pages, ~58 subcategory pages, 10 brand pages
- All generated at build time from JSON data

---

## State Management

### Cart (Zustand + localStorage)
```
CartStore:
  items: CartItem[]
  addItem(product, quantity)
  removeItem(productId)
  updateQuantity(productId, quantity)
  clearCart()
  getTotal() → number
  getItemCount() → number
  getHavaleTotal() → number  // 3% discount
```

### URL State
- `/kategori/[slug]?sort=price-asc&page=2` — Sort and pagination via searchParams
- `/arama?q=lovense` — Search query via searchParams

---

## Image Strategy

- All images from `cdn.myikas.com` — configured in `next.config.ts` remotePatterns
- `next/image` with proper width/height for all product images
- Priority loading on hero images and above-fold product cards
- Lazy loading on below-fold images
- Lightbox for product detail gallery (yet-another-react-lightbox)
- Zoom on hover for product detail main image

---

## SEO Strategy

- Dynamic `metadata` on every page
- Product pages: JSON-LD Product schema
- Homepage: JSON-LD Organization + WebSite schema
- `sitemap.ts` covers all products, categories, brands, static pages
- `robots.ts` allows all
- Canonical URLs on all pages
- OG images set to product images / site logo

---

## Payment Flow

1. User adds products to cart
2. Proceeds to checkout
3. Fills customer info (name, phone, address)
4. Selects Havale/EFT (3% discount applied)
5. IBAN accounts displayed (Ziraat, Garanti)
6. Order number generated (client-side)
7. WhatsApp link opens with pre-filled order summary
8. User sends dekont (receipt) via WhatsApp
