'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SortSelect } from '@/components/shared/SortSelect'
import { Pagination } from '@/components/shared/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import { searchProducts } from '@/lib/data'
import { sortProducts, PRODUCTS_PER_PAGE } from '@/lib/sort'

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || ''
  const sayfa = searchParams.get('sayfa') || '1'

  const allResults = searchProducts(q)
  const sorted = sortProducts(allResults, sort)

  const page = Math.max(1, parseInt(sayfa) || 1)
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE)
  const products = sorted.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  const currentSearchParams: Record<string, string> = {}
  if (q) currentSearchParams.q = q
  if (sort) currentSearchParams.sort = sort

  return (
    <>
      {q ? (
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#003033] mb-2">
            &ldquo;{q}&rdquo; için arama sonuçları
          </h1>
          <p className="text-sm text-[#77777b]">
            {allResults.length} ürün bulundu
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#003033]">Arama</h1>
        </div>
      )}

      {q && allResults.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-[#77777b]">
              Sayfa {page} / {totalPages || 1}
            </span>
            <SortSelect />
          </div>
          <ProductGrid products={products} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/arama"
            searchParams={currentSearchParams}
          />
        </>
      )}

      {q && allResults.length === 0 && (
        <EmptyState
          title="Sonuç bulunamadı"
          description={`"${q}" ile eşleşen ürün bulunamadı. Farklı bir arama terimi deneyin.`}
          actionLabel="Ana Sayfaya Dön"
          actionHref="/"
        />
      )}

      {!q && (
        <EmptyState
          title="Arama yapın"
          description="Ürün adı, marka veya kategori yazarak arama yapabilirsiniz."
          actionLabel="Ana Sayfaya Dön"
          actionHref="/"
        />
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Arama' }]} />
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-[#77777b]">Yükleniyor...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
