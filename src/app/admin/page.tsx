'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Users, CreditCard, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  activeIbans: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    totalAmount: string
    status: string
    createdAt: string
    user: { name: string | null; email: string }
  }>
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-700' },
  PAYMENT_RECEIVED: { label: 'Ödeme Alındı', color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Hazırlanıyor', color: 'bg-purple-100 text-purple-700' },
  SHIPPED: { label: 'Kargoda', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-700' },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, usersRes, ibanRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/admin/users'),
          fetch('/api/admin/iban'),
        ])
        const [ordersData, usersData, ibanData] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
          ibanRes.json(),
        ])

        const orders = ordersData.orders || []
        const totalRevenue = orders.reduce((sum: number, o: { totalAmount: string }) => sum + parseFloat(o.totalAmount || '0'), 0)

        setStats({
          totalOrders: orders.length,
          totalUsers: (usersData.users || []).length,
          totalRevenue,
          activeIbans: (ibanData.accounts || []).filter((a: { isActive: boolean }) => a.isActive).length,
          recentOrders: orders.slice(0, 5),
        })
      } catch (err) {
        console.error('Stats error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FB4D8A]/30 border-t-[#FB4D8A] rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: 'Toplam Sipariş', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500', href: '/admin/siparisler' },
    { label: 'Toplam Gelir', value: `₺${(stats?.totalRevenue || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'bg-green-500', href: '/admin/siparisler' },
    { label: 'Kullanıcılar', value: stats?.totalUsers || 0, icon: Users, color: 'bg-purple-500', href: '/admin/kullanicilar' },
    { label: 'Aktif IBAN', value: stats?.activeIbans || 0, icon: CreditCard, color: 'bg-orange-500', href: '/admin/iban' },
  ]

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#003033]">{card.value}</p>
            <p className="text-sm text-[#77777b] mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#003033]">Son Siparişler</h3>
          <Link href="/admin/siparisler" className="text-sm text-[#FB4D8A] hover:underline font-medium">
            Tümünü Gör →
          </Link>
        </div>

        {stats?.recentOrders?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Sipariş No</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order) => {
                  const s = statusLabels[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' }
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-[#003033]">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-[#77777b]">{order.user?.name || order.user?.email}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#003033]">₺{parseFloat(order.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#77777b]">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-[#77777b]">Henüz sipariş bulunmuyor</div>
        )}
      </div>
    </div>
  )
}
