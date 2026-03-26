'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SortSelect } from '@/components/shared/SortSelect'
import { Pagination } from '@/components/shared/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import { sortProducts, PRODUCTS_PER_PAGE } from '@/lib/sort'
import type { Product } from '@/lib/types'

interface ProductListClientProps {
  products: Product[]
  basePath: string
  emptyTitle?: string
  emptyDescription?: string
}

function ProductListInner({ products, basePath, emptyTitle, emptyDescription }: ProductListClientProps) {
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || ''
  const sayfa = searchParams.get('sayfa') || '1'

  const sorted = sortProducts(products, sort)
  const page = Math.max(1, parseInt(sayfa) || 1)
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE)
  const paged = sorted.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  const currentSearchParams: Record<string, string> = {}
  if (sort) currentSearchParams.sort = sort

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'Ürün bulunamadı'}
        description={emptyDescription || 'Bu kategoride henüz ürün bulunmuyor.'}
        actionLabel="Alışverişe Devam Et"
        actionHref="/"
      />
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-[#77777b]">
          Sayfa {page} / {totalPages || 1}
        </span>
        <SortSelect />
      </div>
      <ProductGrid products={paged} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={basePath}
        searchParams={currentSearchParams}
      />
    </>
  )
}

export function ProductListClient(props: ProductListClientProps) {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-[#77777b]">Yükleniyor...</div>}>
      <ProductListInner {...props} />
    </Suspense>
  )
}
