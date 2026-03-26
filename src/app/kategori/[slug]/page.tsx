import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ProductListClient } from '@/components/product/ProductListClient'
import { getCategories, getCategoryBySlug, getProductsByCategory, getSiteConfig } from '@/lib/data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  const config = getSiteConfig()
  return {
    title: `${category.name} | ${config.siteName}`,
    description: `${category.name} kategorisindeki tüm ürünleri keşfedin. ${config.siteName}'da en iyi fiyatlarla.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params

  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const allProducts = getProductsByCategory(slug)

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: category.name }]} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003033] mb-2">
          {category.name}
        </h1>
        <p className="text-sm text-[#77777b]">
          Toplam {allProducts.length} ürün
        </p>
      </div>

      {/* Subcategory chips */}
      {category.subcategories.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <Link
            href={`/kategori/${slug}`}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-[#FB4D8A] text-white"
          >
            Tümü
          </Link>
          {category.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/kategori/${slug}/${sub.slug}`}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-[#DFE2E6] text-[#003033] hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <ProductListClient
        products={allProducts}
        basePath={`/kategori/${slug}`}
      />
    </div>
  )
}
