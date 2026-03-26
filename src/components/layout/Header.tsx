'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { SearchBar } from '@/components/shared/SearchBar'
import { MobileMenu } from '@/components/layout/MobileMenu'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#DFE2E6]">
        <div className="max-w-[1400px] mx-auto px-4 h-[70px] flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-[#003033]" />
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="https://cdn.myikas.com/images/theme-images/9701a935-cb41-4613-a6b2-0cd7b46bc922/image_1080.webp"
              alt="EROX"
              width={130}
              height={45}
              className="h-[40px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-[65%] mx-auto">
            <SearchBar />
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 ml-auto"
            aria-label="Ara"
          >
            <Search className="w-5 h-5 text-[#003033]" />
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-1 md:gap-3">
            <Link
              href="/hesabim"
              className="hidden md:flex p-2 hover:text-[#FB4D8A] transition-colors"
              aria-label="Hesabım"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/favoriler"
              className="hidden md:flex p-2 hover:text-[#FB4D8A] transition-colors"
              aria-label="Favoriler"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/sepet"
              className="relative p-2 hover:text-[#FB4D8A] transition-colors"
              aria-label="Sepet"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FB4D8A] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-3">
            <SearchBar onSearch={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Desktop Navigation */}
        <DesktopNav />
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}

function DesktopNav() {
  return (
    <nav className="hidden lg:block border-t border-[#DFE2E6]">
      <div className="max-w-[1400px] mx-auto px-4">
        <ul className="flex items-center gap-1 overflow-x-auto">
          <NavItem href="/kategori/vibratorler" label="Vibratörler" />
          <NavItem href="/kategori/realistik-penis" label="Realistik Penis" />
          <NavItem href="/kategori/masturbatorler" label="Masturbatörler" />
          <NavItem href="/kategori/anal-urunler" label="Anal Ürünler" />
          <NavItem href="/kategori/fantezi-giyim" label="Fantezi Giyim" />
          <NavItem href="/kategori/kayganlastirici-jel" label="Kayganlaştırıcılar" />
          <NavItem href="/kategori/fetish-urunler" label="Fetiş Ürünler" />
          <NavItem href="/kategori/erkekler-icin" label="Erkekler İçin" />
          <NavItem href="/kategori/kadinlar-icin" label="Kadınlar İçin" />
        </ul>
      </div>
    </nav>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="block px-3 py-3 text-sm font-medium text-[#003033] hover:text-[#FB4D8A] transition-colors whitespace-nowrap"
      >
        {label}
      </Link>
    </li>
  )
}
