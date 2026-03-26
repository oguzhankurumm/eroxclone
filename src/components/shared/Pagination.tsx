'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('sayfa', String(page))
    } else {
      params.delete('sayfa')
    }
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return (
    <nav aria-label="Sayfalama" className="flex items-center justify-center gap-1.5 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#DFE2E6] hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
          aria-label="Önceki sayfa"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-[#77777b] text-sm">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-[#FB4D8A] text-white'
                : 'border border-[#DFE2E6] hover:border-[#FB4D8A] hover:text-[#FB4D8A] text-[#003033]'
            }`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#DFE2E6] hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
          aria-label="Sonraki sayfa"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  )
}
