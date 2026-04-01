'use client'

import { useState } from 'react'
import { Search, Package, Clock, Truck, Check, X, Banknote, AlertCircle } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { formatPrice } from '@/lib/format'

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Ödeme Bekleniyor', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
  PAYMENT_RECEIVED: { label: 'Ödeme Alındı', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Banknote },
  PROCESSING: { label: 'Hazırlanıyor', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Package },
  SHIPPED: { label: 'Kargoya Verildi', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: Truck },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-green-600 bg-green-50 border-green-200', icon: Check },
  CANCELLED: { label: 'İptal Edildi', color: 'text-red-600 bg-red-50 border-red-200', icon: X },
}

interface OrderResult {
  orderNumber: string
  status: string
  totalAmount: number
  bankName: string
  items: { productName: string; productPrice: number; quantity: number }[]
  createdAt: string
}

export default function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<OrderResult | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNumber.trim() || !phone.trim()) {
      setError('Lütfen sipariş numarası ve telefon numaranızı girin')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/lookup?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      } else {
        setError('Sipariş bulunamadı. Lütfen bilgilerinizi kontrol edin.')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = order ? STATUS_MAP[order.status] || STATUS_MAP.PENDING : null

  return (
    <div className="max-w-[600px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Sipariş Sorgula' }]} />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#FB4D8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-[#FB4D8A]" />
        </div>
        <h1 className="text-2xl font-bold text-[#003033] mb-2">Sipariş Sorgula</h1>
        <p className="text-sm text-[#77777b]">Sipariş numaranız ve telefon numaranız ile siparişinizi takip edin.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#003033] mb-1.5">Sipariş Numarası</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ERX-XXXXXXXX-XXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#003033] mb-1.5">Telefon Numarası</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 h-[48px] bg-[#FB4D8A] hover:bg-[#e8437d] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Search className="w-4 h-4" /> Sipariş Sorgula</>
          )}
        </button>
      </form>

      {order && statusInfo && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-[#F8F8F8] border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#77777b]">Sipariş No</p>
              <p className="text-sm font-bold text-[#FB4D8A]">{order.orderNumber}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${statusInfo.color}`}>
              <statusInfo.icon className="w-3.5 h-3.5" />
              {statusInfo.label}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#003033]">{item.productName} <span className="text-[#77777b]">x{item.quantity}</span></span>
                  <span className="font-medium text-[#003033]">{formatPrice(Number(item.productPrice) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-[#003033]">Toplam</span>
              <span className="font-bold text-xl text-[#003033]">{formatPrice(Number(order.totalAmount))}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#77777b] text-xs">Ödeme Yöntemi</p>
                <p className="text-[#003033] font-medium">{order.bankName}</p>
              </div>
              <div>
                <p className="text-[#77777b] text-xs">Sipariş Tarihi</p>
                <p className="text-[#003033] font-medium">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
