import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ProductListClient } from '@/components/product/ProductListClient'
import { getCategories, getCategoryBySlug, getProductsByCategory, getSiteConfig } from '@/lib/data'

interface PageProps {
  params: Promise<{ slug: string; subSlug: string }>
}

export async function generateStaticParams() {
  const categories = getCategories()
  const params: { slug: string; subSlug: string }[] = []
  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      params.push({ slug: cat.slug, subSlug: sub.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subSlug } = await params
  const category = getCategoryBySlug(slug)
  const sub = category?.subcategories.find((s) => s.slug === subSlug)
  if (!category || !sub) return {}
  const config = getSiteConfig()
  return {
    title: `${sub.name} - ${category.name} | ${config.siteName}`,
    description: `${sub.name} ürünlerini keşfedin. ${category.name} kategorisinde en iyi fiyatlar.`,
  }
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, subSlug } = await params

  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  const sub = category.subcategories.find((s) => s.slug === subSlug)
  if (!sub) notFound()

  const categoryProducts = getProductsByCategory(slug)
  const allProducts = categoryProducts.filter(
    (p) =>
      p.subcategorySlug === subSlug ||
      p.name.toLowerCase().includes(sub.name.toLowerCase()) ||
      p.description.toLowerCase().includes(sub.name.toLowerCase())
  )

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb
        items={[
          { label: category.name, href: `/kategori/${slug}` },
          { label: sub.name },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003033] mb-2">
          {sub.name}
        </h1>
        <p className="text-sm text-[#77777b]">
          {category.name} &gt; {sub.name} — {allProducts.length} ürün
        </p>
      </div>

      {/* Subcategory chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <Link
          href={`/kategori/${slug}`}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-[#DFE2E6] text-[#003033] hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
        >
          Tümü
        </Link>
        {category.subcategories.map((s) => (
          <Link
            key={s.slug}
            href={`/kategori/${slug}/${s.slug}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              s.slug === subSlug
                ? 'bg-[#FB4D8A] text-white'
                : 'border border-[#DFE2E6] text-[#003033] hover:border-[#FB4D8A] hover:text-[#FB4D8A]'
            }`}
          >
            {s.name}
          </Link>
        ))}
      </div>

      <ProductListClient
        products={allProducts}
        basePath={`/kategori/${slug}/${subSlug}`}
      />
    </div>
  )
}
