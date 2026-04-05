'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, CreditCard, Settings, ShoppingCart, Users,
  LogOut, ChevronLeft, Menu, X, BarChart3
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/trafik', label: 'Trafik Analizi', icon: BarChart3 },
  { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingCart },
  { href: '/admin/iban', label: 'IBAN Hesapları', icon: CreditCard },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, fetchUser, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchUser() }, [fetchUser])

  async function handleLogout() {
    await logout()
    router.push('/giris')
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#003033] text-white flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto lg:shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="shrink-0 p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold">
              EROX <span className="text-[#FB4D8A]">Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          {user && (
            <p className="mt-1.5 text-xs text-white/50 truncate">{user.email}</p>
          )}
        </div>

        {/* Navigation - scrollable */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-[#FB4D8A] text-white shadow-lg shadow-[#FB4D8A]/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition mb-1"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            Siteye Dön
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#003033] hover:text-[#FB4D8A] transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-[#003033]">
            {navItems.find(n => n.href === pathname)?.label || 'Admin Panel'}
          </h2>
        </header>

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
