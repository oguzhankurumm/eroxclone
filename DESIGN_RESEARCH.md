# EROX Clone — Design Research (erox.com.tr)

## Source Site Analysis: erox.com.tr

### Color Palette (extracted from live CSS)

| Role | Color | Hex |
|------|-------|-----|
| Background (page) | White | `#FFFFFF` |
| Background (footer/sections) | Warm off-white | `#F8F8F8` |
| Primary accent | Vibrant pink | `#FB4D8A` |
| Secondary accent | Deep purple | `#393085` / `#3A3285` |
| Gradient (announcement bar, footer copyright) | Purple → Pink | `#393185 → #FB4D8A` |
| Text primary | Dark teal | `#003033` |
| Text body | Dark gray | `#1F1F1F` |
| Text secondary / muted | Gray | `#77777B` |
| Discount badge bg | Light pink | `#FEE8F0` |
| Border / inputs | Light gray | `#DFE2E6` |
| Sold out | Red | `#FF0000` |
| Star ratings | Pink (matches accent) | `#FB4D8A` |
| Pagination active | Pink | `#FB4D8A` |

### Typography

- **Font family:** "DM Sans" with system fallbacks
- **Weights:** 300 (light body), 400 (regular), 500 (medium - titles), 700 (bold - headlines)
- **Sizes:** Headlines 25px, Product titles 16px, Body 14px, Small 10-12px

### Homepage Section-by-Section Structure

1. **Announcement Bar** — gradient purple→pink bg, centered white text
2. **Header** — white bg, logo left (150px), search center (65% width), account/favorites/cart icons right
3. **Hero Carousel** — full-width, ~400-500px height, 5 slides with dots, #F8F8F8 background
4. **"En Yeni Urunler"** — 10-product horizontal Swiper carousel
5. **"Indirimler"** — 10-product carousel with discount badges
6. **3 Category Promo Boxes** — "Erkekler/Kadinlar/Ciftler Icin", 3-column grid, ~500x494px images
7. **"Favori Markalarimiz"** — 6 brand logos in a row, 190x190px each
8. **"One Cikan Kategoriler"** — 8-12 category tiles, ~194x194px, 4-col grid
9. **Promo Cards** — 2-column grid, ~510x290px, campaign messaging
10. **"En Cok Satanlar"** — product carousel
11. **"Yeni Gelen Urunler"** — product carousel
12. **More Category Banners** — 2-column grid
13. **FAQ Section** — 4 items, accordion style
14. **Blog Section** — 4 blog cards, 4-column grid
15. **E-Bulten (Newsletter)** — email input + subscribe button
16. **Footer** — #F8F8F8 bg, 4 link columns, store locations, social icons, copyright bar (#3A3285)

### Product Card Design

- Box shadow: `0px 4px 4px`, border-radius: 10px
- Image with maintained aspect ratio, rounded top corners
- Discount badge: top-right, pink bg (#FEE8F0), percentage text
- Favorite heart: top-right, 45px white circle
- Title: 2-line clamp, 16px, weight 500
- Star rating: inline, pink fill
- Price: current 18px bold, original strikethrough gray
- "Sepete Ekle" button: 43px height, rounded 12px, pink bg
- Grid gaps: 20px column, 40px row on desktop

### Category Page Layout

- Left sidebar: "FILTRELER" filter panel
- Top bar: "SIRALA" sort dropdown, total product count
- Grid: 3-col desktop, 2-col mobile
- Pagination: numbered with arrows, pink active state
- Breadcrumb navigation above

### Product Detail Page

- Left: thumbnails sidebar (100px wide) + large main image with zoom
- Right: brand logo, product title, SKU, price section, quantity +/-, "SEPETE EKLE" button
- Below: collapsible sections (specs, dimensions, privacy, shipping, trust)
- Related products: horizontal Swiper carousel
- Mobile: image carousel, stacked layout, fixed bottom cart bar (72px)

### Mobile Patterns

- Hamburger menu → slide-out sidenav
- Bottom fixed cart bar (72px) on product pages
- 2-col product grid with 7px gaps
- Search full-width in header
- Swiper carousels for all product sections
- Breakpoints: 340px, 720px, 960px, 1140px, 1320px

### Design Principles (from erox.com.tr)

1. **Light, clean, white-dominant** — products pop against white
2. **Pink is the brand** — #FB4D8A on buttons, badges, active states, stars
3. **Purple for authority** — header gradient, footer, structural elements
4. **Product carousels everywhere** — horizontal Swiper for browsing sections
5. **Rounded, soft UI** — border-radius 10-12px, box shadows, friendly feel
6. **Discrete but professional** — no explicit imagery in chrome, clean presentation
7. **Trust-forward** — privacy, shipping, trust sections prominent on product pages
