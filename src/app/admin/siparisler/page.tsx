'use client'

import { useEffect, useState } from 'react'
import { Package, ChevronDown, Eye, X } from 'lucide-react'

interface OrderItem {
  id: string
  productSlug: string
  productName: string
  productPrice: string
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  totalAmount: string
  status: string
  bankName: string | null
  notes: string | null
  createdAt: string
  address: Record<string, string>
  items: OrderItem[]
  user: { id: string; email: string; name: string | null; phone: string } | null
  guestName: string | null
  guestPhone: string | null
}

const statusOptions = [
  { value: 'PENDING', label: 'Bekliyor', color: 'bg-yellow-500/10 text-yellow-400' },
  { value: 'PAYMENT_RECEIVED', label: 'Ödeme Alındı', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'PROCESSING', label: 'Hazırlanıyor', color: 'bg-purple-500/10 text-purple-400' },
  { value: 'SHIPPED', label: 'Kargoda', color: 'bg-indigo-500/10 text-indigo-400' },
  { value: 'DELIVERED', label: 'Teslim Edildi', color: 'bg-green-500/10 text-green-400' },
  { value: 'CANCELLED', label: 'İptal', color: 'bg-red-500/10 text-red-400' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  async function fetchOrders() {
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  async function updateStatus(orderId: string, status: string) {
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    })
    fetchOrders()
  }

  const filtered = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Siparişler</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{orders.length} sipariş</p>
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 rounded-xl border border-[var(--border)] bg-[var(--input)] text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
          >
            <option value="ALL">Tüm Durumlar</option>
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer */}
            <div className="bg-[var(--surface-2)] rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Müşteri Bilgileri</h3>
              {selectedOrder.user ? (
                <>
                  <p className="text-sm text-[var(--muted-foreground)]">{selectedOrder.user.name || '-'}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{selectedOrder.user.email}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{selectedOrder.user.phone}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-[var(--muted-foreground)]">{selectedOrder.guestName || '-'} <span className="text-xs bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded-full font-medium ml-1">Misafir</span></p>
                  <p className="text-sm text-[var(--muted-foreground)]">{selectedOrder.guestPhone || '-'}</p>
                </>
              )}
            </div>

            {/* Address */}
            <div className="bg-[var(--surface-2)] rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Teslimat Adresi</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {typeof selectedOrder.address === 'object'
                  ? Object.values(selectedOrder.address).filter(Boolean).join(', ')
                  : String(selectedOrder.address)}
              </p>
            </div>

            {/* Items */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Ürünler</h3>
              <div className="space-y-2">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-[var(--surface-2)] rounded-xl p-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.productName}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      ₺{(parseFloat(item.productPrice) * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank & Total */}
            <div className="flex justify-between items-center bg-[var(--primary)]/5 rounded-xl p-4 mb-4">
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Seçilen Banka</p>
                <p className="text-sm font-medium text-[var(--foreground)]">{selectedOrder.bankName || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted-foreground)]">Toplam Tutar</p>
                <p className="text-xl font-bold text-[var(--primary)]">
                  ₺{parseFloat(selectedOrder.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Durumu Güncelle</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(s => (
                  <button
                    key={s.value}
                    onClick={() => { updateStatus(selectedOrder.id, s.value); setSelectedOrder({ ...selectedOrder, status: s.value }) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedOrder.status === s.value
                        ? s.color + ' ring-2 ring-offset-1 ring-current'
                        : 'bg-[var(--surface-3)] text-[var(--muted-foreground)] hover:bg-[var(--surface-4)]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-12 text-center">
          <Package className="w-12 h-12 text-[var(--muted-foreground)]/40 mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Sipariş bulunamadı</p>
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Sipariş No</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Banka</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((order) => {
                  const s = statusOptions.find(so => so.value === order.status) || { label: order.status, color: 'bg-[var(--surface-3)] text-[var(--muted-foreground)]' }
                  return (
                    <tr key={order.id} className="hover:bg-[var(--surface-2)]">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-[var(--foreground)]">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--foreground)]">{order.user?.name || order.guestName || '-'} {!order.user && <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded-full font-medium">Misafir</span>}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{order.user?.email || order.guestPhone || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                        ₺{parseFloat(order.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{order.bankName || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
