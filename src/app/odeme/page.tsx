'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Copy, Check, MessageCircle, ArrowRight, ArrowLeft, ShoppingBag, CircleDot, Circle, Banknote, Package, Truck, Shield, Clock } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { getSiteConfig } from '@/lib/data'
import { formatPrice, generateOrderNumber } from '@/lib/format'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { EmptyState } from '@/components/shared/EmptyState'
import toast from 'react-hot-toast'

type Step = 'summary' | 'payment' | 'confirmation'

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const { items, getTotal, getHavaleTotal, clearCart, getItemCount } = useCartStore()
  const config = getSiteConfig()
  const [step, setStep] = useState<Step>('summary')
  const [copiedIban, setCopiedIban] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<{
    grandTotal: number
    itemCount: number
    whatsAppLink: string
  } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const validItems = items.filter(
    (item) => item.product && Array.isArray(item.product.images) && item.product.images.length > 0
  )

  const total = getTotal()
  const havaleTotal = getHavaleTotal()
  const shippingFee = total >= config.shipping.freeShippingThreshold ? 0 : config.shipping.standardShippingFee
  const grandTotal = havaleTotal + shippingFee
  const itemCount = getItemCount()

  function copyIban(iban: string) {
    navigator.clipboard.writeText(iban.replace(/\s/g, ''))
    setCopiedIban(iban)
    toast.success('IBAN kopyalandı!')
    setTimeout(() => setCopiedIban(null), 3000)
  }

  function goToPayment() {
    const num = generateOrderNumber()
    setOrderNumber(num)
    setStep('payment')
    window.scrollTo(0, 0)
  }

  function goToConfirmation() {
    // Snapshot order data before clearing cart
    const productNames = validItems
      .map((i) => `${i.product.name} x${i.quantity}`)
      .join(', ')
    const msg = `Merhaba, sipariş için dekont gönderiyorum.\nSipariş No: ${orderNumber}.\nTutar: ${formatPrice(grandTotal)}.\nÜrünler: ${productNames}`
    setConfirmedOrder({
      grandTotal,
      itemCount,
      whatsAppLink: `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(msg)}`,
    })
    setStep('confirmation')
    clearCart()
    window.scrollTo(0, 0)
  }

  function getWhatsAppLink() {
    const productNames = validItems
      .map((i) => `${i.product.name} x${i.quantity}`)
      .join(', ')
    const msg = `Merhaba, sipariş için dekont gönderiyorum.\nSipariş No: ${orderNumber}.\nTutar: ${formatPrice(grandTotal)}.\nÜrünler: ${productNames}`
    return `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(msg)}`
  }

  if (!mounted) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Sepet', href: '/sepet' }, { label: 'Ödeme' }]} />
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FB4D8A] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (validItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Ödeme' }]} />
        <EmptyState
          title="Sepetiniz boş"
          description="Ödeme yapabilmek için sepetinize ürün eklemeniz gerekiyor."
          actionLabel="Alışverişe Başla"
          actionHref="/"
        />
      </div>
    )
  }

  // Step indicator
  const steps = [
    { key: 'summary', label: 'Sipariş Özeti' },
    { key: 'payment', label: 'Ödeme Bilgileri' },
    { key: 'confirmation', label: 'Onay' },
  ]
  const currentStepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="max-w-[800px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Sepet', href: '/sepet' }, { label: 'Ödeme' }]} />

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i <= currentStepIndex
                ? 'bg-[#FB4D8A] text-white'
                : 'bg-[#DFE2E6] text-[#77777b]'
            }`}>
              {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${
              i <= currentStepIndex ? 'text-[#003033] font-medium' : 'text-[#77777b]'
            }`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${i < currentStepIndex ? 'bg-[#FB4D8A]' : 'bg-[#DFE2E6]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Order Summary */}
      {step === 'summary' && (
        <div>
          <h1 className="text-2xl font-bold text-[#003033] mb-2">Sipariş Özeti</h1>
          <p className="text-sm text-[#77777b] mb-6">
            Siparişinizi kontrol edin ve ödemeye geçin.
          </p>

          {/* Products */}
          <div className="bg-white rounded-xl border border-[#DFE2E6] overflow-hidden mb-4">
            <div className="px-5 py-3 bg-[#F8F8F8] border-b border-[#DFE2E6]">
              <p className="text-xs font-semibold text-[#77777b] uppercase tracking-wide">
                {itemCount} Ürün
              </p>
            </div>
            <div className="divide-y divide-[#F0F0F0]">
              {validItems.map((item) => {
                const price = item.product.salePrice || item.product.price
                return (
                  <div key={item.product.id} className="flex gap-4 p-4">
                    <div className="w-16 h-16 bg-[#F8F8F8] rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#003033] line-clamp-2 leading-snug">{item.product.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-[#77777b]">{item.product.brand}</span>
                        <span className="text-xs text-[#77777b]">·</span>
                        <span className="text-xs bg-[#F0F0F0] text-[#003033] font-medium px-2 py-0.5 rounded-full">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {item.product.salePrice && (
                        <p className="text-xs text-[#77777b] line-through">{formatPrice(item.product.price * item.quantity)}</p>
                      )}
                      <p className="text-sm font-bold text-[#003033]">{formatPrice(price * item.quantity)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Havale discount highlight */}
          <div className="bg-gradient-to-r from-[#FEE8F0] to-[#FFF5F8] rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FB4D8A] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">%3</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#003033]">Havale/EFT İndirimi</p>
              <p className="text-xs text-[#77777b]">Havale ile ödeyerek <strong className="text-[#FB4D8A]">{formatPrice(total - havaleTotal)}</strong> tasarruf edin</p>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-xl border border-[#DFE2E6] overflow-hidden mb-4">
            <div className="p-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#77777b]">Ara Toplam ({itemCount} ürün)</span>
                <span className="text-[#003033]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FB4D8A] font-medium">Havale İndirimi</span>
                <span className="text-[#FB4D8A] font-medium">-{formatPrice(total - havaleTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77777b]">Kargo</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-medium' : 'text-[#003033]'}>
                  {shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}
                </span>
              </div>
            </div>
            <div className="px-5 py-4 bg-[#F8F8F8] border-t border-[#DFE2E6] flex justify-between items-center">
              <span className="font-bold text-[#003033] text-base">Toplam</span>
              <span className="font-bold text-xl text-[#003033]">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-[#F8F8F8] rounded-lg p-3 text-center">
              <Package className="w-5 h-5 text-[#FB4D8A] mx-auto mb-1" />
              <p className="text-[10px] font-medium text-[#003033] leading-tight">Gizli Paketleme</p>
            </div>
            <div className="bg-[#F8F8F8] rounded-lg p-3 text-center">
              <Truck className="w-5 h-5 text-[#FB4D8A] mx-auto mb-1" />
              <p className="text-[10px] font-medium text-[#003033] leading-tight">Hızlı Kargo</p>
            </div>
            <div className="bg-[#F8F8F8] rounded-lg p-3 text-center">
              <Shield className="w-5 h-5 text-[#FB4D8A] mx-auto mb-1" />
              <p className="text-[10px] font-medium text-[#003033] leading-tight">Güvenli Ödeme</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/sepet"
              className="h-[44px] px-6 border border-[#DFE2E6] text-[#003033] text-sm font-medium rounded-xl flex items-center gap-2 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Sepete Dön
            </Link>
            <button
              onClick={goToPayment}
              className="flex-1 h-[44px] bg-[#FB4D8A] hover:bg-[#e8437d] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Ödemeye Geç
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: IBAN Payment */}
      {step === 'payment' && (
        <div>
          <h1 className="text-2xl font-bold text-[#003033] mb-6">Havale / EFT ile Ödeme</h1>

          {/* Amount to pay - prominent */}
          <div className="bg-gradient-to-r from-[#FB4D8A] to-[#e8437d] rounded-xl p-5 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Ödenecek Tutar</p>
                <p className="text-2xl font-bold mt-0.5">{formatPrice(grandTotal)}</p>
              </div>
              <Banknote className="w-10 h-10 opacity-80" />
            </div>
          </div>

          {/* Numbered instructions */}
          <div className="bg-[#FFF8F0] border border-[#FFE0B2] rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-[#E65100] mb-2">Ödeme Adımları</p>
            <ol className="space-y-1.5 text-sm text-[#5D4037]">
              <li className="flex gap-2">
                <span className="font-bold text-[#E65100] shrink-0">1.</span>
                Aşağıdaki banka hesaplarından birine havale/EFT yapın
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#E65100] shrink-0">2.</span>
                Açıklama kısmına sipariş numaranızı yazın: <strong className="text-[#E65100]">{orderNumber}</strong>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#E65100] shrink-0">3.</span>
                Ödeme yaptığınız bankayı seçip &quot;Ödemeyi Yaptım&quot; butonuna tıklayın
              </li>
            </ol>
          </div>

          {/* Selectable IBAN accounts */}
          <p className="text-sm font-medium text-[#003033] mb-3">
            Hangi hesaba ödeme yaptınız?
          </p>

          <div className="space-y-3 mb-6">
            {config.payment.ibanAccounts.map((account) => {
              const isSelected = selectedBank === account.id
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedBank(account.id)}
                  className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                    isSelected
                      ? 'border-[#FB4D8A] bg-[#FFF5F8] shadow-sm'
                      : 'border-[#DFE2E6] bg-white hover:border-[#FB4D8A]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio indicator */}
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <CircleDot className="w-5 h-5 text-[#FB4D8A]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#DFE2E6]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-[#003033] mb-2">{account.bankName}</p>
                      <div className="space-y-1 mb-3">
                        <div className="flex gap-2 text-sm">
                          <span className="text-[#77777b] min-w-[90px]">Hesap Sahibi</span>
                          <span className="text-[#003033] font-medium">{account.accountHolder}</span>
                        </div>
                        <div className="flex gap-2 text-sm items-center">
                          <span className="text-[#77777b] min-w-[90px]">IBAN</span>
                          <code className="text-[#003033] font-mono text-xs">{account.ibanNumber}</code>
                        </div>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); copyIban(account.ibanNumber) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); copyIban(account.ibanNumber) } }}
                        className="inline-flex h-[32px] px-3 border border-[#DFE2E6] rounded-lg text-xs font-medium items-center gap-1.5 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors cursor-pointer"
                      >
                        {copiedIban === account.ibanNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            Kopyalandı
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            IBAN Kopyala
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Order number reminder */}
          <div className="bg-[#FEE8F0] rounded-xl p-3 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FB4D8A] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">#</span>
            </div>
            <div>
              <p className="text-xs text-[#77777b]">Sipariş Numaranız</p>
              <p className="text-sm font-bold text-[#FB4D8A]">{orderNumber}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setStep('summary'); window.scrollTo(0, 0) }}
              className="h-[44px] px-6 border border-[#DFE2E6] text-[#003033] text-sm font-medium rounded-xl flex items-center gap-2 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <button
              onClick={goToConfirmation}
              disabled={!selectedBank}
              className={`flex-1 h-[44px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${
                selectedBank
                  ? 'bg-[#FB4D8A] hover:bg-[#e8437d] text-white'
                  : 'bg-[#DFE2E6] text-[#77777b] cursor-not-allowed'
              }`}
            >
              Ödemeyi Yaptım
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation - WhatsApp Dekont */}
      {step === 'confirmation' && (
        <div>
          {/* Success animation */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-[bounce_0.6s_ease-in-out]">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#003033] mb-2">
              Ödemeniz Alındı!
            </h1>
            <p className="text-sm text-[#77777b]">
              Son adım olarak dekontunuzu WhatsApp ile gönderin.
            </p>
          </div>

          {/* Order details card */}
          <div className="bg-white rounded-xl border border-[#DFE2E6] overflow-hidden mb-6">
            <div className="px-5 py-3 bg-[#F8F8F8] border-b border-[#DFE2E6] flex items-center justify-between">
              <p className="text-xs font-semibold text-[#77777b] uppercase tracking-wide">Sipariş Detayları</p>
              <span className="text-xs font-bold text-[#FB4D8A]">{orderNumber}</span>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#77777b]">Toplam Ürün</span>
                <span className="text-[#003033] font-medium">{confirmedOrder?.itemCount ?? itemCount} adet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77777b]">Ödeme Yöntemi</span>
                <span className="text-[#003033] font-medium">Havale / EFT</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#DFE2E6]">
                <span className="font-bold text-[#003033]">Ödenen Tutar</span>
                <span className="font-bold text-xl text-[#003033]">{formatPrice(confirmedOrder?.grandTotal ?? grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA - prominent */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 mb-4">
            <div className="text-center text-white mb-3">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-base">Dekontu WhatsApp ile Gönderin</p>
              <p className="text-xs opacity-90 mt-1">
                Ödeme dekontunuzun fotoğrafını bize iletin, siparişiniz hemen işleme alınsın.
              </p>
            </div>
            <a
              href={confirmedOrder?.whatsAppLink ?? getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[48px] bg-white text-green-600 font-bold rounded-lg flex items-center justify-center gap-2 text-base hover:bg-green-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Hemen Dekont Gönder
            </a>
          </div>

          {/* What happens next */}
          <div className="bg-[#F8F8F8] rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-[#003033] mb-3">Sırada Ne Var?</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-[#FB4D8A] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#003033]">Dekont Onayı</p>
                  <p className="text-xs text-[#77777b]">WhatsApp&apos;tan gönderdiğiniz dekont kontrol edilecek</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-[#FB4D8A] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#003033]">Kargoya Verilecek</p>
                  <p className="text-xs text-[#77777b]">Onaydan sonra siparişiniz aynı gün kargoya verilir</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-[#FB4D8A] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#003033]">Gizli Paketleme ile Teslim</p>
                  <p className="text-xs text-[#77777b]">Ürün bilgisi olmadan, sade kutu ile adresinize gelir</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust reassurance */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 bg-white rounded-lg border border-[#DFE2E6] p-3 text-center">
              <Package className="w-4 h-4 text-[#FB4D8A] mx-auto mb-1" />
              <p className="text-[10px] font-medium text-[#003033]">Gizli Paketleme</p>
            </div>
            <div className="flex-1 bg-white rounded-lg border border-[#DFE2E6] p-3 text-center">
              <Clock className="w-4 h-4 text-[#FB4D8A] mx-auto mb-1" />
              <p className="text-[10px] font-medium text-[#003033]">1-3 İş Günü</p>
            </div>
            <div className="flex-1 bg-white rounded-lg border border-[#DFE2E6] p-3 text-center">
              <Shield className="w-4 h-4 text-[#FB4D8A] mx-auto mb-1" />
              <p className="text-[10px] font-medium text-[#003033]">Orijinal Ürün</p>
            </div>
          </div>

          <Link
            href="/"
            className="w-full h-[44px] border border-[#DFE2E6] text-[#003033] text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Alışverişe Devam Et
          </Link>
        </div>
      )}
    </div>
  )
}
