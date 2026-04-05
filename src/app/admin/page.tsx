'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, CreditCard,
  ArrowUpRight, ArrowDownRight, Clock, Package, Truck, CheckCircle, XCircle,
  AlertTriangle, UserPlus, BarChart3, ShoppingBag, Star, RefreshCw
} from 'lucide-react'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { OrderStatusChart } from '@/components/admin/OrderStatusChart'

interface DashboardStats {
  revenue: {
    total: number; today: number; yesterday: number
    thisWeek: number; lastWeek: number; thisMonth: number; lastMonth: number
    dailyChart: Array<{ date: string; revenue: number; orders: number }>
  }
  orders: {
    total: number; today: number; thisWeek: number; thisMonth: number
    averageValue: number
    byStatus: Array<{ status: string; count: number; revenue: number }>
  }
  topProducts: Array<{ productSlug: string; productName: string; totalQuantity: number; totalRevenue: number }>
  customers: {
    total: number; newToday: number; newThisWeek: number; newThisMonth: number
    returning: number; uniqueOrdering: number
  }
  conversion: { averageCartValue: number; averageItemsPerOrder: number }
  alerts: { pendingOrders: number; awaitingPayment: number; activeIbans: number }
  recentOrders: Array<{
    id: string; orderNumber: string; totalAmount: number; status: string; createdAt: string
    user: { name: string | null; email: string }
    items: Array<{ productName: string; quantity: number }>
  }>
  recentUsers: Array<{ id: string; name: string | null; email: string; phone: string; createdAt: string }>
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: { label: 'Bekliyor', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  PAYMENT_RECEIVED: { label: 'Ödeme Alındı', color: 'text-blue-700', bg: 'bg-blue-100', icon: DollarSign },
  PROCESSING: { label: 'Hazırlanıyor', color: 'text-purple-700', bg: 'bg-purple-100', icon: Package },
  SHIPPED: { label: 'Kargoda', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Truck },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  CANCELLED: { label: 'İptal', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
}

function fmt(n: number) {
  return `₺${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function pctChange(current: number, previous: number): { value: string; positive: boolean } {
  if (previous === 0) return { value: current > 0 ? '+100%' : '0%', positive: current >= 0 }
  const pct = ((current - previous) / previous) * 100
  return { value: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, positive: pct >= 0 }
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('/api/admin/dashboard/stats')
  if (!res.ok) throw new Error('Dashboard verileri yuklenemedi')
  return res.json()
}

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: fetchDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 h-[360px] animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-40 mb-6" />
              <div className="h-[280px] bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-[#77777b]">{error instanceof Error ? error.message : 'Dashboard yuklenemedi'}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 rounded-xl bg-[#FB4D8A] text-white text-sm font-medium hover:bg-[#e8437d] transition inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tekrar Dene
        </button>
      </div>
    )
  }

  const todayVsYesterday = pctChange(stats.revenue.today, stats.revenue.yesterday)
  const monthVsLastMonth = pctChange(stats.revenue.thisMonth, stats.revenue.lastMonth)
  const weekVsLastWeek = pctChange(stats.revenue.thisWeek, stats.revenue.lastWeek)

  return (
    <div className="space-y-6">
      {/* Alerts Bar */}
      {(stats.alerts.pendingOrders > 0 || stats.alerts.awaitingPayment > 0) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          {stats.alerts.pendingOrders > 0 && (
            <Link href="/admin/siparisler" className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium hover:bg-yellow-200 transition">
              <Clock className="w-3.5 h-3.5" />
              {stats.alerts.pendingOrders} sipariş onay bekliyor
            </Link>
          )}
          {stats.alerts.awaitingPayment > 0 && (
            <Link href="/admin/siparisler" className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition">
              <DollarSign className="w-3.5 h-3.5" />
              {stats.alerts.awaitingPayment} ödeme onaylandı
            </Link>
          )}
          <Link href="/admin/iban" className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition ml-auto">
            <CreditCard className="w-3.5 h-3.5" />
            {stats.alerts.activeIbans} aktif IBAN
          </Link>
        </div>
      )}

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className={`flex items-center gap-0.5 text-xs font-semibold ${todayVsYesterday.positive ? 'text-green-600' : 'text-red-500'}`}>
              {todayVsYesterday.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {todayVsYesterday.value}
            </span>
          </div>
          <p className="text-2xl font-bold text-[#003033]">{fmt(stats.revenue.today)}</p>
          <p className="text-xs text-[#77777b] mt-1">Bugünkü Gelir</p>
          <p className="text-[10px] text-[#77777b] mt-0.5">Dün: {fmt(stats.revenue.yesterday)}</p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className={`flex items-center gap-0.5 text-xs font-semibold ${monthVsLastMonth.positive ? 'text-green-600' : 'text-red-500'}`}>
              {monthVsLastMonth.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {monthVsLastMonth.value}
            </span>
          </div>
          <p className="text-2xl font-bold text-[#003033]">{fmt(stats.revenue.thisMonth)}</p>
          <p className="text-xs text-[#77777b] mt-1">Aylık Gelir</p>
          <p className="text-[10px] text-[#77777b] mt-0.5">Geçen ay: {fmt(stats.revenue.lastMonth)}</p>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-[#77777b]">
              Bugün: {stats.orders.today}
            </span>
          </div>
          <p className="text-2xl font-bold text-[#003033]">{stats.orders.total}</p>
          <p className="text-xs text-[#77777b] mt-1">Toplam Sipariş</p>
          <p className="text-[10px] text-[#77777b] mt-0.5">Bu hafta: {stats.orders.thisWeek} | Bu ay: {stats.orders.thisMonth}</p>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
              <UserPlus className="w-3.5 h-3.5" />
              +{stats.customers.newThisMonth}
            </span>
          </div>
          <p className="text-2xl font-bold text-[#003033]">{stats.customers.total}</p>
          <p className="text-xs text-[#77777b] mt-1">Toplam Müşteri</p>
          <p className="text-[10px] text-[#77777b] mt-0.5">Bugün: +{stats.customers.newToday} | Bu hafta: +{stats.customers.newThisWeek}</p>
        </div>
      </div>

      {/* Row 2: This Week Revenue + Avg Order */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-[#77777b] mb-1">Haftalık Gelir</p>
          <p className="text-lg font-bold text-[#003033]">{fmt(stats.revenue.thisWeek)}</p>
          <span className={`text-[10px] font-semibold ${weekVsLastWeek.positive ? 'text-green-600' : 'text-red-500'}`}>
            {weekVsLastWeek.value} geçen haftaya göre
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-[#77777b] mb-1">Toplam Gelir</p>
          <p className="text-lg font-bold text-[#003033]">{fmt(stats.revenue.total)}</p>
          <span className="text-[10px] text-[#77777b]">Tüm zamanlar</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-[#77777b] mb-1">Ort. Sipariş Değeri</p>
          <p className="text-lg font-bold text-[#003033]">{fmt(stats.conversion.averageCartValue)}</p>
          <span className="text-[10px] text-[#77777b]">Sipariş başına</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-[#77777b] mb-1">Ort. Ürün / Sipariş</p>
          <p className="text-lg font-bold text-[#003033]">{stats.conversion.averageItemsPerOrder.toFixed(1)}</p>
          <span className="text-[10px] text-[#77777b]">ürün/sipariş</span>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart - 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FB4D8A]" />
              <h3 className="text-base font-bold text-[#003033]">Son 30 Gün Gelir</h3>
            </div>
          </div>
          {stats.revenue.dailyChart.length > 0 ? (
            <RevenueChart data={stats.revenue.dailyChart} />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-[#77777b]">
              Henüz yeterli veri yok
            </div>
          )}
        </div>

        {/* Order Status - 1/3 width */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-[#FB4D8A]" />
            <h3 className="text-base font-bold text-[#003033]">Sipariş Durumları</h3>
          </div>
          <OrderStatusChart data={stats.orders.byStatus} />
        </div>
      </div>

      {/* Row 4: Top Products + Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FB4D8A]" />
            <h3 className="text-base font-bold text-[#003033]">En Çok Satan Ürünler</h3>
          </div>
          {stats.topProducts.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {stats.topProducts.map((p, i) => (
                <div key={p.productSlug} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i < 3 ? 'bg-[#FB4D8A] text-white' : 'bg-gray-100 text-[#77777b]'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#003033] truncate">{p.productName}</p>
                    <p className="text-xs text-[#77777b]">{p.totalQuantity} adet satıldı</p>
                  </div>
                  <p className="text-sm font-semibold text-[#003033] shrink-0">{fmt(p.totalRevenue)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#77777b]">Henüz satış verisi yok</div>
          )}
        </div>

        {/* Customer Analytics */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FB4D8A]" />
            <h3 className="text-base font-bold text-[#003033]">Müşteri Analizi</h3>
          </div>
          <div className="p-5 space-y-4">
            {/* New vs Returning */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#77777b]">Yeni vs Geri Dönen</span>
                <span className="font-medium text-[#003033]">
                  {stats.customers.uniqueOrdering} sipariş veren müşteri
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                {stats.customers.uniqueOrdering > 0 && (
                  <>
                    <div
                      className="h-full bg-[#FB4D8A] rounded-l-full"
                      style={{
                        width: `${(((stats.customers.uniqueOrdering - stats.customers.returning) / stats.customers.uniqueOrdering) * 100).toFixed(0)}%`,
                      }}
                    />
                    <div
                      className="h-full bg-[#003033]"
                      style={{
                        width: `${((stats.customers.returning / stats.customers.uniqueOrdering) * 100).toFixed(0)}%`,
                      }}
                    />
                  </>
                )}
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#FB4D8A]" />
                  Yeni: {stats.customers.uniqueOrdering - stats.customers.returning}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#003033]" />
                  Geri dönen: {stats.customers.returning}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-[#003033]">{stats.customers.newToday}</p>
                <p className="text-[10px] text-[#77777b]">Bugün</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-[#003033]">{stats.customers.newThisWeek}</p>
                <p className="text-[10px] text-[#77777b]">Bu Hafta</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-[#003033]">{stats.customers.newThisMonth}</p>
                <p className="text-[10px] text-[#77777b]">Bu Ay</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#77777b]">Toplam Kayıtlı Kullanıcı</span>
                <span className="font-semibold text-[#003033]">{stats.customers.total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#77777b]">Sipariş Veren Müşteriler</span>
                <span className="font-semibold text-[#003033]">{stats.customers.uniqueOrdering}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#77777b]">Tekrarlayan Müşteriler</span>
                <span className="font-semibold text-[#003033]">{stats.customers.returning}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Recent Orders + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders - 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#003033]">Son Siparişler</h3>
            <Link href="/admin/siparisler" className="text-sm text-[#FB4D8A] font-medium hover:underline">
              Tümünü Gör →
            </Link>
          </div>
          {stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-5 py-2.5 text-[10px] font-semibold text-[#77777b] uppercase tracking-wider">Sipariş</th>
                    <th className="px-5 py-2.5 text-[10px] font-semibold text-[#77777b] uppercase tracking-wider">Müşteri</th>
                    <th className="px-5 py-2.5 text-[10px] font-semibold text-[#77777b] uppercase tracking-wider">Ürünler</th>
                    <th className="px-5 py-2.5 text-[10px] font-semibold text-[#77777b] uppercase tracking-wider">Tutar</th>
                    <th className="px-5 py-2.5 text-[10px] font-semibold text-[#77777b] uppercase tracking-wider">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentOrders.map((order) => {
                    const s = statusConfig[order.status]
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <p className="text-xs font-mono font-semibold text-[#003033]">{order.orderNumber}</p>
                          <p className="text-[10px] text-[#77777b]">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#77777b]">{order.user?.name || order.user?.email}</td>
                        <td className="px-5 py-3 text-xs text-[#77777b]">
                          {order.items.length} ürün
                        </td>
                        <td className="px-5 py-3 text-xs font-semibold text-[#003033]">{fmt(order.totalAmount)}</td>
                        <td className="px-5 py-3">
                          {s && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.bg} ${s.color}`}>
                              {s.label}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#77777b]">Henüz sipariş yok</div>
          )}
        </div>

        {/* Recent Users - 1/3 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#003033]">Yeni Üyeler</h3>
            <Link href="/admin/kullanicilar" className="text-sm text-[#FB4D8A] font-medium hover:underline">
              Tümü →
            </Link>
          </div>
          {stats.recentUsers.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FB4D8A] to-[#e8437d] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#003033] truncate">{user.name || '-'}</p>
                    <p className="text-[10px] text-[#77777b] truncate">{user.email}</p>
                  </div>
                  <p className="text-[10px] text-[#77777b] shrink-0">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#77777b]">Henüz üye yok</div>
          )}
        </div>
      </div>
    </div>
  )
}
