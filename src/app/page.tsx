import { HeroSlider } from '@/components/home/HeroSlider'
import { TrustBadges } from '@/components/home/TrustBadges'
import { ProductCarousel } from '@/components/home/ProductCarousel'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { BrandShowcase } from '@/components/home/BrandShowcase'
import { PromoBanners } from '@/components/home/PromoBanners'
import { FAQPreview } from '@/components/home/FAQPreview'
import { Newsletter } from '@/components/home/Newsletter'
import { JsonLd } from '@/components/shared/JsonLd'
import {
  getProducts,
  getHeroSlides,
  getTrustBadges,
  getPromoImages,
  getBrands,
  getFAQ,
  getSiteConfig,
} from '@/lib/data'

export default function HomePage() {
  const products = getProducts()
  const heroSlides = getHeroSlides()
  const trustBadges = getTrustBadges()
  const promoImages = getPromoImages()
  const brands = getBrands()
  const faq = getFAQ()
  const config = getSiteConfig()

  // Curate product sections
  const newest = products.slice(0, 12)
  const onSale = products.filter((p) => p.salePrice).slice(0, 12)
  const bestSellers = products.slice(100, 112)
  const newArrivals = products.slice(200, 212)

  // If no sale products, show a different segment
  const discountSection = onSale.length > 0 ? onSale : products.slice(50, 62)

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: config.logo,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.contact.phone,
      email: config.contact.email,
      contactType: 'customer service',
    },
    sameAs: [
      config.social.instagram,
      config.social.youtube,
      config.social.tiktok,
    ],
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.siteUrl}/arama?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <TrustBadges badges={trustBadges} />
      <ProductCarousel title="En Yeni Ürünler" products={newest} />
      <ProductCarousel title="İndirimler" products={discountSection} />
      <FeaturedCategories promoImages={promoImages} />
      <BrandShowcase brands={brands} />
      <PromoBanners promoImages={promoImages} />
      <ProductCarousel title="En Çok Satanlar" products={bestSellers} />
      <ProductCarousel title="Yeni Gelen Ürünler" products={newArrivals} />
      <FAQPreview faqs={faq} />
      <Newsletter />
      <JsonLd data={organizationLd} />
      <JsonLd data={websiteLd} />
    </>
  )
}
