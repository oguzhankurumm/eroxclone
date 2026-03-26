import type {
  Product,
  Category,
  SiteConfig,
  HeroSlide,
  Brand,
  Navigation,
  PromoImages,
  TrustBadge,
  FAQ,
  StaticPages,
} from './types'

import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'
import siteConfigData from '@/data/site-config.json'
import heroSlidesData from '@/data/hero-slides.json'
import brandsData from '@/data/brands.json'
import navigationData from '@/data/navigation.json'
import promoImagesData from '@/data/promo-images.json'
import trustBadgesData from '@/data/trust-badges.json'
import faqData from '@/data/faq.json'
import staticPagesData from '@/data/static-pages.json'

const products = productsData as Product[]
const categories = categoriesData as Category[]

export function getProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug)
}

export function getProductsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
): Product[] {
  return products.filter(
    (p) => p.categorySlug === categorySlug && p.subcategorySlug === subcategorySlug
  )
}

export function getProductsByBrand(brandSlug: string): Product[] {
  const brandName = getBrands().find((b) => b.slug === brandSlug)?.name
  if (!brandName) return []
  return products.filter(
    (p) => p.brand.toLowerCase() === brandName.toLowerCase()
  )
}

export function getCategories(): Category[] {
  return categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getSiteConfig(): SiteConfig {
  return siteConfigData as SiteConfig
}

export function getHeroSlides(): HeroSlide[] {
  return heroSlidesData as HeroSlide[]
}

export function getBrands(): Brand[] {
  return brandsData as Brand[]
}

export function getNavigation(): Navigation {
  return navigationData as Navigation
}

export function getPromoImages(): PromoImages {
  return promoImagesData as PromoImages
}

export function getTrustBadges(): TrustBadge[] {
  return trustBadgesData as TrustBadge[]
}

export function getFAQ(): FAQ[] {
  return faqData as FAQ[]
}

export function getStaticPages(): StaticPages {
  return staticPagesData as StaticPages
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  )
}

export function getProductCount(): number {
  return products.length
}

export function getCategoryProductCount(categorySlug: string): number {
  return products.filter((p) => p.categorySlug === categorySlug).length
}
