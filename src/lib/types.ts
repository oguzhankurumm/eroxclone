export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  salePrice: number | null
  description: string
  images: string[]
  originalImages: string[]
  category: string
  categorySlug: string
  subcategorySlug: string | null
  sku: string
  inStock: boolean
  specs: Record<string, string>
}

export interface Subcategory {
  slug: string
  name: string
}

export interface Category {
  slug: string
  name: string
  subcategories: Subcategory[]
}

export interface SiteConfig {
  siteName: string
  siteTagline: string
  siteUrl: string
  logo: string
  favicon: string
  contact: {
    phone: string
    email: string
    whatsapp: string
  }
  social: {
    instagram: string
    youtube: string
    tiktok: string
  }
  payment: {
    methods: string[]
    ibanAccounts: {
      id: string
      bankName: string
      accountHolder: string
      ibanNumber: string
    }[]
    havaleDiscount: number
    havaleDiscountText: string
  }
  shipping: {
    freeShippingThreshold: number
    standardShippingFee: number
    estimatedDelivery: string
    expressDelivery: string
    carriers: string[]
  }
  stores: {
    name: string
    city: string
    district: string
    address: string
    slug: string
  }[]
  seo: {
    defaultTitle: string
    defaultDescription: string
    keywords: string
  }
}

export interface HeroSlide {
  id: string
  src: string
  alt: string
  href: string
  title: string
}

export interface Brand {
  name: string
  slug: string
  logo: string
  categorySlug: string
  productCount: number
}

export interface Navigation {
  announcementBar: {
    text: string
    enabled: boolean
  }
  navLinks: { label: string; href: string }[]
  footerLinks: {
    kategoriler: { label: string; href: string }[]
    kurumsal: { label: string; href: string }[]
    yardim: { label: string; href: string }[]
  }
}

export interface PromoImages {
  categoryShowcase: {
    section1_promoBoxes: {
      title: string
      href: string
      image: string
    }[]
    section2_featuredCategories: {
      name: string
      slug: string
      image: string
    }[]
  }
  promoBanners: {
    alt: string
    href: string
    image: string
  }[]
}

export interface TrustBadge {
  id: string
  icon: string
  title: string
  description: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export interface StaticPageSection {
  heading: string
  content?: string
  icon?: string
  items?: string[]
  steps?: string[]
  stats?: { value: string; label: string }[]
}

export interface StaticPages {
  hakkimizda: {
    title: string
    sections: StaticPageSection[]
  }
  kargo: {
    title: string
    sections: StaticPageSection[]
  }
  iade: {
    title: string
    sections: StaticPageSection[]
  }
  gizlilik: {
    title: string
    sections: StaticPageSection[]
  }
  iletisim: {
    title: string
    info: {
      phone: string
      email: string
      address: string
      workingHours: string
    }
  }
}

export interface CartItem {
  product: Product
  quantity: number
}
