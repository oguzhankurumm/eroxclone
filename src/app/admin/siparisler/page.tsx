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
  { value: 'PENDING', label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'PAYMENT_RECEIVED', label: 'Ödeme Alındı', color: 'bg-blue-100 text-blue-700' },
  { value: 'PROCESSING', label: 'Hazırlanıyor', color: 'bg-purple-100 text-purple-700' },
  { value: 'SHIPPED', label: 'Kargoda', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'DELIVERED', label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  { value: 'CANCELLED', label: 'İptal', color: 'bg-red-100 text-red-700' },
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
        <div className="w-8 h-8 border-4 border-[#FB4D8A]/30 border-t-[#FB4D8A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003033]">Siparişler</h1>
          <p className="text-sm text-[#77777b] mt-1">{orders.length} sipariş</p>
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none"
          >
            <option value="ALL">Tüm Durumlar</option>
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77777b] pointer-events-none" />
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#003033]">{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-[#77777b]">{new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#77777b] hover:text-[#003033]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-[#003033] mb-2">Müşteri Bilgileri</h3>
              {selectedOrder.user ? (
                <>
                  <p className="text-sm text-[#77777b]">{selectedOrder.user.name || '-'}</p>
                  <p className="text-sm text-[#77777b]">{selectedOrder.user.email}</p>
                  <p className="text-sm text-[#77777b]">{selectedOrder.user.phone}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-[#77777b]">{selectedOrder.guestName || '-'} <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium ml-1">Misafir</span></p>
                  <p className="text-sm text-[#77777b]">{selectedOrder.guestPhone || '-'}</p>
                </>
              )}
            </div>

            {/* Address */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-[#003033] mb-2">Teslimat Adresi</h3>
              <p className="text-sm text-[#77777b]">
                {typeof selectedOrder.address === 'object'
                  ? Object.values(selectedOrder.address).filter(Boolean).join(', ')
                  : String(selectedOrder.address)}
              </p>
            </div>

            {/* Items */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#003033] mb-2">Ürünler</h3>
              <div className="space-y-2">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                    <div>
                      <p className="text-sm font-medium text-[#003033]">{item.productName}</p>
                      <p className="text-xs text-[#77777b]">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#003033]">
                      ₺{(parseFloat(item.productPrice) * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank & Total */}
            <div className="flex justify-between items-center bg-[#FB4D8A]/5 rounded-xl p-4 mb-4">
              <div>
                <p className="text-xs text-[#77777b]">Seçilen Banka</p>
                <p className="text-sm font-medium text-[#003033]">{selectedOrder.bankName || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#77777b]">Toplam Tutar</p>
                <p className="text-xl font-bold text-[#FB4D8A]">
                  ₺{parseFloat(selectedOrder.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="text-sm font-semibold text-[#003033] mb-2">Durumu Güncelle</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(s => (
                  <button
                    key={s.value}
                    onClick={() => { updateStatus(selectedOrder.id, s.value); setSelectedOrder({ ...selectedOrder, status: s.value }) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedOrder.status === s.value
                        ? s.color + ' ring-2 ring-offset-1 ring-current'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-[#77777b]/40 mx-auto mb-4" />
          <p className="text-[#77777b]">Sipariş bulunamadı</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Sipariş No</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Banka</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => {
                  const s = statusOptions.find(so => so.value === order.status) || { label: order.status, color: 'bg-gray-100 text-gray-700' }
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-[#003033]">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#003033]">{order.user?.name || order.guestName || '-'} {!order.user && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">Misafir</span>}</p>
                        <p className="text-xs text-[#77777b]">{order.user?.email || order.guestPhone || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#003033]">
                        ₺{parseFloat(order.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#77777b]">{order.bankName || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#77777b]">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-[#77777b] hover:text-[#FB4D8A] transition"
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
