'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Copy, Check, MessageCircle, ArrowRight, ArrowLeft, ShoppingBag,
  CircleDot, Circle, Banknote, Package, Truck, Shield, Clock,
  MapPin, Plus, X, User
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { getSiteConfig } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { EmptyState } from '@/components/shared/EmptyState'
import toast from 'react-hot-toast'

type Step = 'address' | 'payment' | 'confirmation'

interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  address: string
  zipCode?: string
  isDefault: boolean
}

interface IbanAccount {
  id: string
  bankName: string
  accountHolder: string
  ibanNumber: string
}

const CITIES = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya',
  'Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik',
  'Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum',
  'Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir',
  'Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul',
  'İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale',
  'Kırklareli','Kırşehir','Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa',
  'Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye',
  'Rize','Sakarya','Samsun','Şanlıurfa','Siirt','Sinop','Sivas','Şırnak',
  'Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'
]

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const { items, getTotal, getHavaleTotal, clearCart, getItemCount } = useCartStore()
  const { user, fetchUser } = useAuthStore()
  const config = getSiteConfig()

  const [step, setStep] = useState<Step>('address')
  const [copiedIban, setCopiedIban] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    title: '', fullName: '', phone: '', city: '', district: '', address: '', zipCode: ''
  })

  // IBAN from DB
  const [ibanAccounts, setIbanAccounts] = useState<IbanAccount[]>([])

  // Confirmed order snapshot
  const [confirmedOrder, setConfirmedOrder] = useState<{
    grandTotal: number; itemCount: number; whatsAppLink: string; orderNumber: string
  } | null>(null)

  const [submitting, setSubmitting] = useState(false)

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/addresses')
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
        const def = data.find((a: Address) => a.isDefault)
        if (def) setSelectedAddress(def.id)
        else if (data.length > 0) setSelectedAddress(data[0].id)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchUser()
    fetch('/api/iban').then(r => r.json()).then(setIbanAccounts).catch(() => {})
  }, [fetchUser])

  useEffect(() => {
    if (user) fetchAddresses()
  }, [user, fetchAddresses])

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

  async function saveAddress() {
    if (!addressForm.fullName || !addressForm.phone || !addressForm.city || !addressForm.district || !addressForm.address) {
      toast.error('Lütfen zorunlu alanları doldurun')
      return
    }
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addressForm, title: addressForm.title || 'Adresim', isDefault: addresses.length === 0 }),
      })
      if (res.ok) {
        const newAddr = await res.json()
        toast.success('Adres kaydedildi')
        setShowAddressForm(false)
        setAddressForm({ title: '', fullName: '', phone: '', city: '', district: '', address: '', zipCode: '' })
        await fetchAddresses()
        setSelectedAddress(newAddr.id)
      }
    } catch {
      toast.error('Adres kaydedilemedi')
    }
  }

  function goToPayment() {
    if (!selectedAddress) {
      toast.error('Lütfen bir teslimat adresi seçin')
      return
    }
    const num = `ERX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    setOrderNumber(num)
    setStep('payment')
    window.scrollTo(0, 0)
  }

  async function goToConfirmation() {
    if (!selectedBank) return
    setSubmitting(true)

    const selectedAddr = addresses.find(a => a.id === selectedAddress)
    const bankAccount = ibanAccounts.find(a => a.id === selectedBank)

    // Save order to DB
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: validItems.map(i => ({
            productSlug: i.product.slug,
            productName: i.product.name,
            productPrice: i.product.salePrice || i.product.price,
            quantity: i.quantity,
          })),
          address: selectedAddr || {},
          totalAmount: grandTotal,
          bankName: bankAccount?.bankName || 'Bilinmeyen',
        }),
      })

      if (res.ok) {
        const order = await res.json()
        const productNames = validItems.map(i => `${i.product.name} x${i.quantity}`).join(', ')
        const msg = `Merhaba, sipariş için dekont gönderiyorum.\nSipariş No: ${order.orderNumber}.\nTutar: ${formatPrice(grandTotal)}.\nÜrünler: ${productNames}`

        setConfirmedOrder({
          grandTotal,
          itemCount,
          whatsAppLink: `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(msg)}`,
          orderNumber: order.orderNumber,
        })
        setOrderNumber(order.orderNumber)
      } else {
        // Fallback if API fails
        const productNames = validItems.map(i => `${i.product.name} x${i.quantity}`).join(', ')
        const msg = `Merhaba, sipariş için dekont gönderiyorum.\nSipariş No: ${orderNumber}.\nTutar: ${formatPrice(grandTotal)}.\nÜrünler: ${productNames}`
        setConfirmedOrder({
          grandTotal,
          itemCount,
          whatsAppLink: `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(msg)}`,
          orderNumber,
        })
      }
    } catch {
      const productNames = validItems.map(i => `${i.product.name} x${i.quantity}`).join(', ')
      const msg = `Merhaba, sipariş için dekont gönderiyorum.\nSipariş No: ${orderNumber}.\nTutar: ${formatPrice(grandTotal)}.\nÜrünler: ${productNames}`
      setConfirmedOrder({
        grandTotal,
        itemCount,
        whatsAppLink: `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(msg)}`,
        orderNumber,
      })
    }

    setStep('confirmation')
    clearCart()
    setSubmitting(false)
    window.scrollTo(0, 0)
  }

  if (!mounted) {
    return (
      <div className="max-w-[800px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Sepet', href: '/sepet' }, { label: 'Ödeme' }]} />
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FB4D8A] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // Require login
  if (!user) {
    return (
      <div className="max-w-[800px] mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Sepet', href: '/sepet' }, { label: 'Ödeme' }]} />
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center mt-8">
          <div className="w-16 h-16 bg-[#FB4D8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#FB4D8A]" />
          </div>
          <h2 className="text-xl font-bold text-[#003033] mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-sm text-[#77777b] mb-6">Sipariş verebilmek için hesabınıza giriş yapın veya yeni bir hesap oluşturun.</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/giris?redirect=/odeme"
              className="px-6 py-3 rounded-xl bg-[#FB4D8A] text-white font-semibold hover:bg-[#e8437d] transition"
            >
              Giriş Yap
            </Link>
            <Link
              href="/kayit?redirect=/odeme"
              className="px-6 py-3 rounded-xl border-2 border-[#003033] text-[#003033] font-semibold hover:bg-[#003033] hover:text-white transition"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (validItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-[800px] mx-auto px-4 pb-12">
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

  const steps = [
    { key: 'address', label: 'Adres & Özet' },
    { key: 'payment', label: 'Ödeme' },
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
              i <= currentStepIndex ? 'bg-[#FB4D8A] text-white' : 'bg-[#DFE2E6] text-[#77777b]'
            }`}>
              {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${
              i <= currentStepIndex ? 'text-[#003033] font-medium' : 'text-[#77777b]'
            }`}>{s.label}</span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${i < currentStepIndex ? 'bg-[#FB4D8A]' : 'bg-[#DFE2E6]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Address + Order Summary */}
      {step === 'address' && (
        <div>
          <h1 className="text-2xl font-bold text-[#003033] mb-6">Teslimat Adresi & Sipariş Özeti</h1>

          {/* Address Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#003033] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FB4D8A]" />
                Teslimat Adresi
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-sm text-[#FB4D8A] font-medium flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Yeni Adres
              </button>
            </div>

            {/* New Address Form */}
            {showAddressForm && (
              <div className="bg-white rounded-xl border-2 border-[#FB4D8A] p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#003033]">Yeni Adres Ekle</h3>
                  <button onClick={() => setShowAddressForm(false)} className="text-[#77777b] hover:text-[#003033]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={addressForm.title}
                      onChange={(e) => setAddressForm({...addressForm, title: e.target.value})}
                      placeholder="Adres Başlığı (örn: Ev, İş)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                      placeholder="Ad Soyad *"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      placeholder="Telefon *"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <select
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
                    >
                      <option value="">İl Seçin *</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={addressForm.district}
                      onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                      placeholder="İlçe *"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <textarea
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                      placeholder="Açık Adres (Mahalle, Sokak, Bina No, Daire No) *"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-[#77777b] text-sm font-medium hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={saveAddress}
                      className="px-6 py-2.5 rounded-xl bg-[#FB4D8A] text-white text-sm font-medium hover:bg-[#e8437d] transition"
                    >
                      Adresi Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showAddressForm ? (
              <div className="bg-[#F8F8F8] rounded-xl p-6 text-center">
                <MapPin className="w-8 h-8 text-[#77777b]/40 mx-auto mb-2" />
                <p className="text-sm text-[#77777b] mb-3">Henüz kayıtlı adresiniz yok</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-sm text-[#FB4D8A] font-medium hover:underline"
                >
                  Yeni adres ekleyin →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition ${
                      selectedAddress === addr.id
                        ? 'border-[#FB4D8A] bg-[#FFF5F8]'
                        : 'border-gray-200 bg-white hover:border-[#FB4D8A]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {selectedAddress === addr.id ? (
                        <CircleDot className="w-5 h-5 text-[#FB4D8A] mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-[#003033]">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#FB4D8A]/10 text-[#FB4D8A] px-2 py-0.5 rounded-full font-medium">Varsayılan</span>
                          )}
                        </div>
                        <p className="text-sm text-[#003033]">{addr.fullName} - {addr.phone}</p>
                        <p className="text-xs text-[#77777b] mt-0.5">{addr.address}, {addr.district}/{addr.city}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-[#DFE2E6] overflow-hidden mb-4">
            <div className="px-5 py-3 bg-[#F8F8F8] border-b border-[#DFE2E6]">
              <p className="text-xs font-semibold text-[#77777b] uppercase tracking-wide">{itemCount} Ürün</p>
            </div>
            <div className="divide-y divide-[#F0F0F0]">
              {validItems.map((item) => {
                const price = item.product.salePrice || item.product.price
                return (
                  <div key={item.product.id} className="flex gap-4 p-4">
                    <div className="w-14 h-14 bg-[#F8F8F8] rounded-lg overflow-hidden shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} width={56} height={56} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#003033] line-clamp-1">{item.product.name}</p>
                      <span className="text-xs text-[#77777b]">x{item.quantity}</span>
                    </div>
                    <p className="text-sm font-bold text-[#003033] shrink-0">{formatPrice(price * item.quantity)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Havale discount */}
          <div className="bg-gradient-to-r from-[#FEE8F0] to-[#FFF5F8] rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FB4D8A] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">%3</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#003033]">Havale/EFT İndirimi</p>
              <p className="text-xs text-[#77777b]">Havale ile <strong className="text-[#FB4D8A]">{formatPrice(total - havaleTotal)}</strong> tasarruf</p>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-xl border border-[#DFE2E6] overflow-hidden mb-6">
            <div className="p-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#77777b]">Ara Toplam</span>
                <span className="text-[#003033]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FB4D8A] font-medium">Havale İndirimi</span>
                <span className="text-[#FB4D8A] font-medium">-{formatPrice(total - havaleTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77777b]">Kargo</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>{shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}</span>
              </div>
            </div>
            <div className="px-5 py-4 bg-[#F8F8F8] border-t border-[#DFE2E6] flex justify-between items-center">
              <span className="font-bold text-[#003033]">Toplam</span>
              <span className="font-bold text-xl text-[#003033]">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/sepet" className="h-[44px] px-6 border border-[#DFE2E6] text-[#003033] text-sm font-medium rounded-xl flex items-center gap-2 hover:border-[#FB4D8A] transition">
              <ArrowLeft className="w-4 h-4" /> Sepet
            </Link>
            <button
              onClick={goToPayment}
              disabled={!selectedAddress}
              className={`flex-1 h-[44px] font-semibold rounded-xl flex items-center justify-center gap-2 transition ${
                selectedAddress ? 'bg-[#FB4D8A] hover:bg-[#e8437d] text-white' : 'bg-[#DFE2E6] text-[#77777b] cursor-not-allowed'
              }`}
            >
              Ödemeye Geç <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 'payment' && (
        <div>
          <h1 className="text-2xl font-bold text-[#003033] mb-6">Havale / EFT ile Ödeme</h1>

          <div className="bg-gradient-to-r from-[#FB4D8A] to-[#e8437d] rounded-xl p-5 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Ödenecek Tutar</p>
                <p className="text-2xl font-bold mt-0.5">{formatPrice(grandTotal)}</p>
              </div>
              <Banknote className="w-10 h-10 opacity-80" />
            </div>
          </div>

          <div className="bg-[#FFF8F0] border border-[#FFE0B2] rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-[#E65100] mb-2">Ödeme Adımları</p>
            <ol className="space-y-1.5 text-sm text-[#5D4037]">
              <li className="flex gap-2"><span className="font-bold text-[#E65100] shrink-0">1.</span>Aşağıdaki banka hesaplarından birine havale/EFT yapın</li>
              <li className="flex gap-2"><span className="font-bold text-[#E65100] shrink-0">2.</span>Açıklamaya sipariş numaranızı yazın: <strong className="text-[#E65100]">{orderNumber}</strong></li>
              <li className="flex gap-2"><span className="font-bold text-[#E65100] shrink-0">3.</span>Ödeme yaptığınız bankayı seçip &quot;Ödemeyi Yaptım&quot; butonuna tıklayın</li>
            </ol>
          </div>

          <p className="text-sm font-medium text-[#003033] mb-3">Hangi hesaba ödeme yaptınız?</p>

          <div className="space-y-3 mb-6">
            {ibanAccounts.length > 0 ? ibanAccounts.map((account) => {
              const isSelected = selectedBank === account.id
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedBank(account.id)}
                  className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                    isSelected ? 'border-[#FB4D8A] bg-[#FFF5F8] shadow-sm' : 'border-[#DFE2E6] bg-white hover:border-[#FB4D8A]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? <CircleDot className="w-5 h-5 text-[#FB4D8A]" /> : <Circle className="w-5 h-5 text-[#DFE2E6]" />}
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
                        className="inline-flex h-[32px] px-3 border border-[#DFE2E6] rounded-lg text-xs font-medium items-center gap-1.5 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition cursor-pointer"
                      >
                        {copiedIban === account.ibanNumber ? <><Check className="w-3.5 h-3.5 text-green-600" />Kopyalandı</> : <><Copy className="w-3.5 h-3.5" />IBAN Kopyala</>}
                      </div>
                    </div>
                  </div>
                </button>
              )
            }) : (
              // Fallback to static config if DB has no accounts
              config.payment.ibanAccounts.map((account) => {
                const isSelected = selectedBank === account.id
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedBank(account.id)}
                    className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                      isSelected ? 'border-[#FB4D8A] bg-[#FFF5F8] shadow-sm' : 'border-[#DFE2E6] bg-white hover:border-[#FB4D8A]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isSelected ? <CircleDot className="w-5 h-5 text-[#FB4D8A]" /> : <Circle className="w-5 h-5 text-[#DFE2E6]" />}
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
                          className="inline-flex h-[32px] px-3 border border-[#DFE2E6] rounded-lg text-xs font-medium items-center gap-1.5 hover:border-[#FB4D8A] hover:text-[#FB4D8A] transition cursor-pointer"
                        >
                          {copiedIban === account.ibanNumber ? <><Check className="w-3.5 h-3.5 text-green-600" />Kopyalandı</> : <><Copy className="w-3.5 h-3.5" />IBAN Kopyala</>}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>

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
              onClick={() => { setStep('address'); window.scrollTo(0, 0) }}
              className="h-[44px] px-6 border border-[#DFE2E6] text-[#003033] text-sm font-medium rounded-xl flex items-center gap-2 hover:border-[#FB4D8A] transition"
            >
              <ArrowLeft className="w-4 h-4" /> Geri
            </button>
            <button
              onClick={goToConfirmation}
              disabled={!selectedBank || submitting}
              className={`flex-1 h-[44px] font-semibold rounded-xl flex items-center justify-center gap-2 transition ${
                selectedBank && !submitting ? 'bg-[#FB4D8A] hover:bg-[#e8437d] text-white' : 'bg-[#DFE2E6] text-[#77777b] cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Ödemeyi Yaptım <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 'confirmation' && (
        <div>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#003033] mb-2">Siparişiniz Alındı!</h1>
            <p className="text-sm text-[#77777b]">Son adım olarak dekontunuzu WhatsApp ile gönderin.</p>
          </div>

          <div className="bg-white rounded-xl border border-[#DFE2E6] overflow-hidden mb-6">
            <div className="px-5 py-3 bg-[#F8F8F8] border-b border-[#DFE2E6] flex items-center justify-between">
              <p className="text-xs font-semibold text-[#77777b] uppercase tracking-wide">Sipariş Detayları</p>
              <span className="text-xs font-bold text-[#FB4D8A]">{confirmedOrder?.orderNumber || orderNumber}</span>
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

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 mb-4">
            <div className="text-center text-white mb-3">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-base">Dekontu WhatsApp ile Gönderin</p>
              <p className="text-xs opacity-90 mt-1">Ödeme dekontunuzun fotoğrafını bize iletin.</p>
            </div>
            <a
              href={confirmedOrder?.whatsAppLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[48px] bg-white text-green-600 font-bold rounded-lg flex items-center justify-center gap-2 text-base hover:bg-green-50 transition"
            >
              <MessageCircle className="w-5 h-5" /> Hemen Dekont Gönder
            </a>
          </div>

          <div className="bg-[#F8F8F8] rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-[#003033] mb-3">Sırada Ne Var?</p>
            <div className="space-y-3">
              {[
                { num: '1', title: 'Dekont Onayı', desc: 'WhatsApp\'tan gönderdiğiniz dekont kontrol edilecek' },
                { num: '2', title: 'Kargoya Verilecek', desc: 'Onaydan sonra siparişiniz aynı gün kargoya verilir' },
                { num: '3', title: 'Gizli Paketleme ile Teslim', desc: 'Ürün bilgisi olmadan, sade kutu ile adresinize gelir' },
              ].map(s => (
                <div key={s.num} className="flex gap-3">
                  <div className="w-7 h-7 bg-[#FB4D8A] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{s.num}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#003033]">{s.title}</p>
                    <p className="text-xs text-[#77777b]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { icon: Package, label: 'Gizli Paketleme' },
              { icon: Clock, label: '1-3 İş Günü' },
              { icon: Shield, label: 'Orijinal Ürün' },
            ].map(b => (
              <div key={b.label} className="bg-white rounded-lg border border-[#DFE2E6] p-3 text-center">
                <b.icon className="w-4 h-4 text-[#FB4D8A] mx-auto mb-1" />
                <p className="text-[10px] font-medium text-[#003033]">{b.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link href="/hesabim" className="flex-1 h-[44px] border border-[#DFE2E6] text-[#003033] text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:border-[#FB4D8A] transition">
              <Truck className="w-4 h-4" /> Siparişlerim
            </Link>
            <Link href="/" className="flex-1 h-[44px] bg-[#FB4D8A] hover:bg-[#e8437d] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition">
              <ShoppingBag className="w-4 h-4" /> Alışverişe Devam
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
