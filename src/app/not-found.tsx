import Link from 'next/link'
import { Home, Search, ShoppingBag, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
      {/* Illustration */}
      <div className="w-24 h-24 bg-[#FEE8F0] rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl font-bold text-[#FB4D8A]">404</span>
      </div>

      <h1 className="text-2xl font-bold text-[#003033] mb-2">Sayfa Bulunamadı</h1>
      <p className="text-[#77777b] mb-8">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <Link
          href="/"
          className="inline-flex h-[44px] px-6 bg-[#FB4D8A] hover:bg-[#e8437d] text-white font-semibold rounded-xl items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/arama"
          className="inline-flex h-[44px] px-6 border border-[#DFE2E6] text-[#003033] font-semibold rounded-xl items-center justify-center gap-2 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
        >
          <Search className="w-4 h-4" />
          Ürün Ara
        </Link>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/kategori/vibrator', label: 'Popüler Ürünler', icon: ShoppingBag },
          { href: '/sss', label: 'Yardım Merkezi', icon: HelpCircle },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-[#F8F8F8] rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-[#FEE8F0] transition-colors"
          >
            <link.icon className="w-5 h-5 text-[#77777b]" />
            <span className="text-xs font-medium text-[#003033]">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
