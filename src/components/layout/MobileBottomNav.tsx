'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, Search, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { MobileMenu } from './MobileMenu'

export function MobileBottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.getItemCount())
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#DFE2E6] lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-[60px]">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
              isActive('/') ? 'text-[#FB4D8A]' : 'text-[#77777b]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Ana Sayfa</span>
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#77777b]"
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Kategoriler</span>
          </button>

          <Link
            href="/arama"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
              isActive('/arama') ? 'text-[#FB4D8A]' : 'text-[#77777b]'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Ara</span>
          </Link>

          <Link
            href="/sepet"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${
              isActive('/sepet') ? 'text-[#FB4D8A]' : 'text-[#77777b]'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#FB4D8A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Sepet</span>
          </Link>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
