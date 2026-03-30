'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, ShoppingBag, MapPin, LogOut, Package, ChevronRight, Clock, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/shared/Breadcrumb'

interface OrderItem {
  id: string
  productName: string
  productPrice: string
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  totalAmount: string
  status: string
  createdAt: string
  items: OrderItem[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-700' },
  PAYMENT_RECEIVED: { label: 'Ödeme Alındı', color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Hazırlanıyor', color: 'bg-purple-100 text-purple-700' },
  SHIPPED: { label: 'Kargoda', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-700' },
}

export default function AccountPage() {
  const { user, loading, fetchUser, logout } = useAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => { fetchUser() }, [fetchUser])

  useEffect(() => {
    if (user) {
      fetch('/api/orders')
        .then(r => r.json())
        .then(setOrders)
        .catch(() => {})
        .finally(() => setOrdersLoading(false))
    }
  }, [user])

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Hesabım' }]} />
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FB4D8A] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Hesabım' }]} />
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 mt-8">
            <div className="w-20 h-20 rounded-full bg-[#FEE8F0] flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-[#FB4D8A]" />
            </div>
            <h1 className="text-2xl font-bold text-[#003033] mb-2">Hesabım</h1>
            <p className="text-sm text-[#77777b] mb-6">Giriş yaparak siparişlerinizi takip edebilirsiniz.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/giris" className="px-6 py-3 rounded-xl bg-[#FB4D8A] text-white font-semibold hover:bg-[#e8437d] transition">
                Giriş Yap
              </Link>
              <Link href="/kayit" className="px-6 py-3 rounded-xl border-2 border-[#003033] text-[#003033] font-semibold hover:bg-[#003033] hover:text-white transition">
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Hesabım' }]} />

      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FB4D8A] to-[#e8437d] flex items-center justify-center text-white text-xl font-bold">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#003033]">{user.name || 'Kullanıcı'}</h1>
              <p className="text-sm text-[#77777b]">{user.email}</p>
              <p className="text-sm text-[#77777b]">{user.phone}</p>
            </div>
            <div className="flex gap-2">
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="px-4 py-2 rounded-xl bg-[#003033] text-white text-sm font-medium hover:bg-[#004040] transition flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-gray-200 text-[#77777b] text-sm font-medium hover:border-red-300 hover:text-red-500 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Çıkış
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {[
            { href: '/favoriler', icon: ShoppingBag, label: 'Favorilerim' },
            { href: '/sepet', icon: Package, label: 'Sepetim' },
            { href: '/iletisim', icon: MapPin, label: 'Mağazalar' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:border-[#FB4D8A]/40 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FB4D8A]/10 flex items-center justify-center group-hover:bg-[#FB4D8A]/20 transition">
                <link.icon className="w-5 h-5 text-[#FB4D8A]" />
              </div>
              <span className="text-sm font-medium text-[#003033]">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Orders */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#003033] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FB4D8A]" />
            Siparişlerim
          </h2>

          {ordersLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#FB4D8A]/30 border-t-[#FB4D8A] rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Package className="w-10 h-10 text-[#77777b]/30 mx-auto mb-3" />
              <p className="text-sm text-[#77777b] mb-3">Henüz siparişiniz bulunmuyor</p>
              <Link href="/" className="text-sm text-[#FB4D8A] font-medium hover:underline">
                Alışverişe başlayın →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const s = statusLabels[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' }
                return (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#FB4D8A]/30 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-mono font-semibold text-[#003033]">{order.orderNumber}</span>
                        <span className="text-xs text-[#77777b] ml-3">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-[#77777b] truncate mr-4">{item.productName} <span className="text-[#003033]">x{item.quantity}</span></span>
                          <span className="text-[#003033] font-medium shrink-0">
                            ₺{(parseFloat(item.productPrice) * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-[#77777b]">+{order.items.length - 3} ürün daha</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm font-bold text-[#003033]">
                        ₺{parseFloat(order.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#77777b]" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
