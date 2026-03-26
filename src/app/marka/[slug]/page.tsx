import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ProductListClient } from '@/components/product/ProductListClient'
import { getBrands, getProductsByBrand, getSiteConfig } from '@/lib/data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getBrands().map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const brand = getBrands().find((b) => b.slug === slug)
  if (!brand) return {}
  const config = getSiteConfig()
  return {
    title: `${brand.name} Ürünleri | ${config.siteName}`,
    description: `${brand.name} markasına ait tüm ürünleri keşfedin. ${config.siteName}'da en iyi fiyatlarla.`,
  }
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params

  const brand = getBrands().find((b) => b.slug === slug)
  if (!brand) notFound()

  const allProducts = getProductsByBrand(slug)

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Markalar', href: '/' }, { label: brand.name }]} />

      <div className="flex items-center gap-4 mb-6">
        {brand.logo && (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={80}
            height={80}
            className="w-16 h-16 object-contain bg-[#F8F8F8] rounded-xl p-2"
          />
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#003033]">
            {brand.name}
          </h1>
          <p className="text-sm text-[#77777b]">
            Toplam {allProducts.length} ürün
          </p>
        </div>
      </div>

      <ProductListClient
        products={allProducts}
        basePath={`/marka/${slug}`}
        emptyTitle="Ürün bulunamadı"
        emptyDescription={`${brand.name} markasında şu an ürün bulunmuyor.`}
      />
    </div>
  )
}
