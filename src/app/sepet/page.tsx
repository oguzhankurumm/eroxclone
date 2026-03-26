'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import { EmptyState } from '@/components/shared/EmptyState'
import { Breadcrumb } from '@/components/shared/Breadcrumb'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getTotal, getHavaleTotal } = useCartStore()

  useEffect(() => { setMounted(true) }, [])

  // Filter out corrupted items (missing product data from stale localStorage)
  const validItems = items.filter(
    (item) => item.product && Array.isArray(item.product.images) && item.product.images.length > 0
  )

  const total = getTotal()
  const havaleTotal = getHavaleTotal()
  const freeShippingThreshold = 300
  const shippingFee = total >= freeShippingThreshold ? 0 : 29.90
  const remaining = freeShippingThreshold - total

  if (!mounted) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Sepet' }]} />
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FB4D8A] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (validItems.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Sepet' }]} />
        <EmptyState
          title="Sepetiniz boş"
          description="Sepetinizde henüz ürün bulunmuyor. Hemen alışverişe başlayın!"
          actionLabel="Alışverişe Başla"
          actionHref="/"
        />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Sepet' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-[#003033] mb-6">
        Sepetim ({validItems.length} ürün)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free shipping bar */}
          {remaining > 0 && (
            <div className="bg-[#FEE8F0] rounded-xl p-4">
              <p className="text-sm text-[#FB4D8A] font-medium">
                Ücretsiz kargo için {formatPrice(remaining)} daha eklemeniz gerekiyor!
              </p>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FB4D8A] rounded-full transition-all"
                  style={{ width: `${Math.min(100, (total / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {remaining <= 0 && (
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-green-600 font-medium">
                ✓ Ücretsiz kargo hakkı kazandınız!
              </p>
            </div>
          )}

          {validItems.map((item) => {
            const price = item.product.salePrice || item.product.price
            return (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-[#DFE2E6]"
              >
                <Link href={`/urun/${item.product.slug}`} className="shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="w-20 h-20 md:w-24 md:h-24 object-contain bg-[#F8F8F8] rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/urun/${item.product.slug}`}>
                    <h3 className="text-sm font-medium text-[#003033] line-clamp-2 hover:text-[#FB4D8A] transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#77777b] mt-0.5">{item.product.brand}</p>
                  <p className="text-base font-bold text-[#003033] mt-2">
                    {formatPrice(price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-[#77777b]">
                      Birim: {formatPrice(price)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 text-[#77777b] hover:text-red-500 transition-colors"
                    aria-label="Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center border border-[#DFE2E6] rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#F8F8F8]"
                      aria-label="Azalt"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-[#DFE2E6]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#F8F8F8]"
                      aria-label="Artır"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-[120px] bg-white rounded-xl border border-[#DFE2E6] p-6">
            <h2 className="text-lg font-bold text-[#003033] mb-4">Sipariş Özeti</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-[#77777b]">Ara Toplam</span>
                <span className="text-[#003033] font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77777b]">Kargo</span>
                <span className={`font-medium ${shippingFee === 0 ? 'text-green-600' : 'text-[#003033]'}`}>
                  {shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#FB4D8A]">
                <span>Havale ile (%3 indirimli)</span>
                <span className="font-medium">{formatPrice(havaleTotal + shippingFee)}</span>
              </div>
              <div className="border-t border-[#DFE2E6] pt-3 flex justify-between">
                <span className="font-bold text-[#003033]">Toplam</span>
                <span className="font-bold text-lg text-[#003033]">{formatPrice(total + shippingFee)}</span>
              </div>
            </div>

            <Link
              href="/odeme"
              className="w-full h-[44px] bg-[#FB4D8A] hover:bg-[#e8437d] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Ödemeye Geç
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full h-[40px] mt-3 border border-[#DFE2E6] text-[#003033] text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
