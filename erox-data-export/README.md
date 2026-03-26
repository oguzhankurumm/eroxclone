# EROX Data Export — Yeni Proje İçin Hazır Veri Paketi

## Dosya Listesi

| Dosya | Boyut | İçerik |
|-------|-------|--------|
| `products.json` | 6.2 MB | 3,519 ürün (id, slug, name, brand, price, salePrice, description, images, originalImages, category, categorySlug, subcategorySlug, sku, inStock, specs) |
| `categories.json` | 6.6 KB | 15 ana kategori + 58 alt kategori (slug, name, subcategories) |
| `site-config.json` | — | Site ayarları: logo URL, iletişim, sosyal medya, ödeme (IBAN'lar), kargo, mağazalar, SEO |
| `hero-slides.json` | — | 5 hero slider görseli (CDN URL'leri, başlıklar, linkler) |
| `brands.json` | — | 10 ana marka (logo URL'leri, ürün sayıları, kategori bağlantıları) |
| `promo-images.json` | — | Kategori showcase görselleri (3 promo box + 8 kategori grid) + 3 promo banner |
| `faq.json` | — | 10 SSS sorusu ve cevabı (kategorilere ayrılmış) |
| `trust-badges.json` | — | 4 güven rozeti (ikon, başlık, açıklama) |
| `navigation.json` | — | Header nav linkleri, duyuru çubuğu, footer link grupları |
| `static-pages.json` | — | Hakkımızda, Kargo, İade, Gizlilik, İletişim sayfa içerikleri |

## İstatistikler

- **Toplam Ürün**: 3,519
- **Toplam Kategori**: 15 ana + 58 alt = 73
- **Toplam Marka**: 107 benzersiz marka
- **Toplam Resim URL**: 14,251 (ürün başına ortalama 4.0)
- **Fiyat Aralığı**: ₺49 — ₺179,999 (ortalama ₺3,819)

## Marka Dağılımı (İlk 10)

| Marka | Ürün Sayısı |
|-------|-------------|
| Erox | 909 |
| Lovetoy | 309 |
| Shequ | 286 |
| Xise | 196 |
| Pipedream | 149 |
| Satisfyer | 103 |
| ToyJoy | 94 |
| Lelo | 91 |
| Pretty Love | 91 |
| Pjur | 76 |

## Kategori Dağılımı

| Kategori | Ürün Sayısı |
|----------|-------------|
| Vibratörler | 1,626 |
| Realistik Penis | 554 |
| Mastürbatörler | 330 |
| Anal Ürünler | 246 |
| Kayganlaştırıcı Jel | 192 |
| Fetish Ürünler | 154 |
| Straponlar | 108 |
| Fantezi Giyim | 96 |
| Penis Halkası | 94 |
| Penis Pompası | 44 |
| Kadınlar İçin | 27 |
| Seks Makinesi | 20 |
| Erkekler İçin | 15 |
| Erotik Oyunlar | 13 |

## Ürün Veri Yapısı (products.json)

```json
{
  "id": "product-1",
  "slug": "lelo-noa-deep-rose-ciftler-icin-vibrator",
  "name": "Lelo Noa Deep Rose Giyilebilir Couples Vibratör",
  "brand": "Lelo",
  "price": 6999,
  "salePrice": null,
  "description": "...",
  "images": ["https://cdn.myikas.com/..."],
  "originalImages": ["https://cdn.myikas.com/..."],
  "category": "Vibratörler",
  "categorySlug": "vibratorler",
  "subcategorySlug": null,
  "sku": "DV785",
  "inStock": true,
  "specs": {}
}
```

## Önemli CDN URL'leri

- **Logo**: `https://cdn.myikas.com/images/theme-images/9701a935-cb41-4613-a6b2-0cd7b46bc922/image_1080.webp`
- **Tüm ürün resimleri**: `https://cdn.myikas.com/images/...` formatında
- **Hero slider resimleri**: `https://cdn.myikas.com/images/theme-images/...` formatında

## Ödeme Akışı

Sipariş → IBAN göster → Müşteri havale yapar → WhatsApp'tan dekont gönderir → Sipariş onaylanır → Kargoya verilir

- WhatsApp: +90 532 384 33 37
- IBAN'lar: site-config.json içinde
- Havale indirimi: %3

## Yeni Projede Kullanım

1. Bu klasörü yeni projenin `src/data/` dizinine kopyalayın
2. `products.json` ve `categories.json` doğrudan kullanılabilir
3. Diğer JSON'lar component'lere import edilebilir veya config olarak kullanılabilir
4. Tüm resimler CDN'den yükleniyor — next.config.ts'te `cdn.myikas.com` domain'ini `images.remotePatterns`'a ekleyin
