'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, CreditCard, Settings, ShoppingCart, Users,
  LogOut, ChevronLeft, Menu, X, BarChart3, PanelLeftClose, PanelLeft
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
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => { fetchUser() }, [fetchUser])

  async function handleLogout() {
    await logout()
    router.push('/giris')
  }

  return (
    <div data-admin-theme className="h-screen flex overflow-hidden bg-[var(--background)] font-body text-[var(--foreground)]">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        bg-[var(--surface-0)] border-r border-[var(--border)]
        transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto lg:shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'w-[68px]' : 'w-64'}
      `}>
        {/* Header */}
        <div className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-[var(--border)]">
          {!collapsed && (
            <Link href="/admin" className="font-display text-xl font-bold tracking-tight">
              <span className="text-[var(--foreground)]">EROX</span>{' '}
              <span className="text-[var(--primary)]">Admin</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="font-display text-xl font-bold text-[var(--primary)] mx-auto">
              E
            </Link>
          )}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors
                  ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                  ${active
                    ? 'bg-[var(--primary-muted)] text-[var(--primary)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
                  }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-3 border-t border-[var(--border)] space-y-1">
          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`hidden lg:flex items-center gap-3 rounded-lg text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors w-full
              ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}`}
          >
            {collapsed ? <PanelLeft className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
            {!collapsed && <span>Daralt</span>}
          </button>

          <Link
            href="/"
            title={collapsed ? 'Siteye Dön' : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors
              ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}`}
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Siteye Dön</span>}
          </Link>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Çıkış Yap' : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors w-full
              ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Çıkış Yap</span>}
          </button>

          {/* User info */}
          {user && !collapsed && (
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-3 px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] text-xs font-bold shrink-0">
                  {user.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 h-14 bg-[var(--surface-0)]/80 backdrop-blur-lg border-b border-[var(--border)] px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-medium text-[var(--foreground)] font-display">
              {navItems.find(n => n.href === pathname)?.label || 'Admin Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">{user.email}</span>
                <div className="w-7 h-7 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] text-[10px] font-bold">
                  {user.email?.[0]?.toUpperCase() || 'A'}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
