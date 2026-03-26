'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown, ChevronRight } from 'lucide-react'
import { getCategories } from '@/lib/data'
import type { Category } from '@/lib/types'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const categories = getCategories()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] lg:hidden transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#DFE2E6]">
          <span className="text-lg font-bold text-[#003033]">Kategoriler</span>
          <button onClick={onClose} className="p-1" aria-label="Kapat">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-65px)]">
          {categories.map((cat) => (
            <CategoryAccordion key={cat.slug} category={cat} onClose={onClose} />
          ))}
        </div>
      </div>
    </>
  )
}

function CategoryAccordion({
  category,
  onClose,
}: {
  category: Category
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasSubs = category.subcategories.length > 0

  return (
    <div className="border-b border-[#DFE2E6]">
      <div className="flex items-center">
        <Link
          href={`/kategori/${category.slug}`}
          className="flex-1 px-4 py-3 text-sm font-medium text-[#003033] hover:text-[#FB4D8A]"
          onClick={onClose}
        >
          {category.name}
        </Link>
        {hasSubs && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-3"
            aria-label={expanded ? 'Daralt' : 'Genişlet'}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-[#77777b]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#77777b]" />
            )}
          </button>
        )}
      </div>

      {expanded && hasSubs && (
        <div className="bg-[#F8F8F8]">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/kategori/${category.slug}/${sub.slug}`}
              className="block px-8 py-2.5 text-sm text-[#77777b] hover:text-[#FB4D8A]"
              onClick={onClose}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
