import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Package, Truck, Shield, Phone } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { ProductGallery } from '@/components/product/ProductGallery'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { ProductCarousel } from '@/components/home/ProductCarousel'
import { JsonLd } from '@/components/shared/JsonLd'
import { ProductDescription } from '@/components/product/ProductDescription'
import { getProducts, getProductBySlug, getProductsByCategory, getSiteConfig, getCategoryBySlug } from '@/lib/data'
import { formatPrice } from '@/lib/format'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  const config = getSiteConfig()
  return {
    title: `${product.name} | ${config.siteName}`,
    description: `${product.name} - ${product.brand}. ${formatPrice(product.salePrice || product.price)} fiyatla ${config.siteName}'da.`,
    openGraph: {
      title: `${product.name} | ${config.siteName}`,
      description: `${product.name} - ${product.brand}`,
      images: [{ url: product.images[0], width: 1080, height: 1080 }],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const config = getSiteConfig()
  const category = getCategoryBySlug(product.categorySlug)
  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 12)

  const havalePrice = (product.salePrice || product.price) * 0.97

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images[0],
    description: product.description.replace(/<[^>]*>/g, '').slice(0, 200),
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: 'TRY',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: config.siteName },
    },
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb
        items={[
          ...(category ? [{ label: category.name, href: `/kategori/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Product Info */}
        <div>
          <p className="text-sm text-[#77777b] uppercase tracking-wide mb-1">
            {product.brand}
          </p>

          <h1 className="text-xl md:text-2xl font-bold text-[#003033] mb-2">
            {product.name}
          </h1>

          <p className="text-xs text-[#77777b] mb-4">
            Ürün Kodu: {product.sku}
          </p>

          <div className="mb-2">
            <PriceDisplay price={product.price} salePrice={product.salePrice} size="lg" />
          </div>

          <p className="text-sm text-[#FB4D8A] font-medium mb-4">
            Havale ile {formatPrice(havalePrice)} ({config.payment.havaleDiscountText})
          </p>

          <div className="mb-6">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Stokta
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-red-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Tükendi
              </span>
            )}
          </div>

          <div className="mb-8">
            <AddToCartButton product={product} />
          </div>

          {/* Trust info */}
          <div className="space-y-3 border-t border-[#DFE2E6] pt-6">
            <TrustRow icon={Package} title="Gizli Paketleme" text="Ürün içeriğini belli etmeyecek şekilde paketlenir" />
            <TrustRow icon={Truck} title="Hızlı Kargo" text={`${config.shipping.estimatedDelivery} içinde teslimat`} />
            <TrustRow icon={Shield} title="Orijinal Ürün" text="Tüm ürünler orijinal ve garantilidir" />
            <TrustRow icon={Phone} title="İletişim" text={config.contact.phone} />
          </div>

          {Object.keys(product.specs).length > 0 && (
            <div className="mt-6 border-t border-[#DFE2E6] pt-6">
              <h3 className="text-base font-semibold text-[#003033] mb-3">Ürün Özellikleri</h3>
              <dl className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <dt className="text-[#77777b] min-w-[120px]">{key}:</dt>
                    <dd className="text-[#003033]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mb-12 border-t border-[#DFE2E6] pt-8">
          <h2 className="text-lg font-semibold text-[#003033] mb-4">Ürün Açıklaması</h2>
          <ProductDescription html={product.description} />
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <ProductCarousel title="Birlikte Alabileceğiniz Ürünler" products={related} />
      )}

      <JsonLd data={productLd} />
    </div>
  )
}

function TrustRow({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-[#FEE8F0] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#FB4D8A]" />
      </div>
      <div>
        <p className="text-sm font-medium text-[#003033]">{title}</p>
        <p className="text-xs text-[#77777b]">{text}</p>
      </div>
    </div>
  )
}
