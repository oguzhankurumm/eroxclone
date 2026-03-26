'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { searchProducts } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/lib/types'

interface SearchBarProps {
  onSearch?: () => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchProducts(query).slice(0, 6)
      setResults(found)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/arama?q=${encodeURIComponent(query.trim())}`)
      setShowResults(false)
      onSearch?.()
    }
  }

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün, marka veya kategori ara..."
          className="w-full h-[42px] pl-4 pr-10 bg-[#F8F8F8] border border-[#DFE2E6] rounded-xl text-sm text-[#003033] placeholder:text-[#77777b] focus:outline-none focus:border-[#FB4D8A] transition-colors"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setShowResults(false)
            }}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1"
            aria-label="Temizle"
          >
            <X className="w-4 h-4 text-[#77777b]" />
          </button>
        ) : null}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#77777b] hover:text-[#FB4D8A]"
          aria-label="Ara"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DFE2E6] rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/urun/${product.slug}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F8F8] transition-colors"
              onClick={() => {
                setShowResults(false)
                setQuery('')
                onSearch?.()
              }}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#003033] truncate">{product.name}</p>
                <p className="text-xs text-[#77777b]">{product.brand}</p>
              </div>
              <span className="text-sm font-medium text-[#FB4D8A] whitespace-nowrap">
                {formatPrice(product.salePrice || product.price)}
              </span>
            </Link>
          ))}
          <Link
            href={`/arama?q=${encodeURIComponent(query)}`}
            className="block px-4 py-3 text-sm text-center text-[#FB4D8A] font-medium hover:bg-[#FEE8F0] transition-colors border-t border-[#DFE2E6]"
            onClick={() => {
              setShowResults(false)
              onSearch?.()
            }}
          >
            Tüm sonuçları gör →
          </Link>
        </div>
      )}
    </div>
  )
}
