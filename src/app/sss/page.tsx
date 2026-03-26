'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, Package, Truck, RotateCcw, ShoppingBag, CreditCard, ShieldCheck, MessageCircle } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getFAQ, getSiteConfig } from '@/lib/data'

const categoryMeta: Record<string, { label: string; icon: React.ElementType; color: string; iconColor: string }> = {
  gizlilik: { label: 'Gizlilik', icon: ShieldCheck, color: 'bg-purple-50', iconColor: 'text-purple-600' },
  kargo: { label: 'Kargo', icon: Truck, color: 'bg-green-50', iconColor: 'text-green-600' },
  iade: { label: 'İade', icon: RotateCcw, color: 'bg-orange-50', iconColor: 'text-orange-600' },
  siparis: { label: 'Sipariş', icon: ShoppingBag, color: 'bg-blue-50', iconColor: 'text-blue-600' },
  odeme: { label: 'Ödeme', icon: CreditCard, color: 'bg-pink-50', iconColor: 'text-pink-600' },
  urun: { label: 'Ürünler', icon: Package, color: 'bg-teal-50', iconColor: 'text-teal-600' },
  guvenlik: { label: 'Güvenlik', icon: ShieldCheck, color: 'bg-indigo-50', iconColor: 'text-indigo-600' },
}

export default function FAQPage() {
  const faqs = getFAQ()
  const config = getSiteConfig()
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [...new Set(faqs.map((f) => f.category))]
  const filteredFaqs = activeCategory ? faqs.filter((f) => f.category === activeCategory) : faqs

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Sıkça Sorulan Sorular' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#003033] to-[#005055] rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Sıkça Sorulan Sorular</h1>
            <p className="text-white/80 text-sm mt-1">Merak ettiklerinize hızlıca yanıt bulun</p>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`h-9 px-4 rounded-full text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'bg-[#003033] text-white'
              : 'bg-[#F8F8F8] text-[#77777b] hover:bg-[#DFE2E6]'
          }`}
        >
          Tümü
        </button>
        {categories.map((cat) => {
          const meta = categoryMeta[cat] || { label: cat, icon: HelpCircle, color: 'bg-gray-50', iconColor: 'text-gray-600' }
          const Icon = meta.icon
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`h-9 px-4 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-[#003033] text-white'
                  : 'bg-[#F8F8F8] text-[#77777b] hover:bg-[#DFE2E6]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {meta.label}
            </button>
          )
        })}
      </div>

      {/* FAQ items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const meta = categoryMeta[faq.category] || { label: faq.category, icon: HelpCircle, color: 'bg-gray-50', iconColor: 'text-gray-600' }
          const isOpen = openId === faq.id
          return (
            <div
              key={faq.id}
              className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                isOpen ? 'border-[#FB4D8A]/40' : 'border-[#DFE2E6]'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className={`w-8 h-8 rounded-full ${meta.color} flex items-center justify-center shrink-0`}>
                  <meta.icon className={`w-4 h-4 ${meta.iconColor}`} />
                </div>
                <span className="flex-1 text-sm font-medium text-[#003033] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#77777b] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pl-[60px]">
                  <p className="text-sm text-[#77777b] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Contact CTA */}
      <div className="mt-8 bg-[#F8F8F8] rounded-xl p-6 text-center">
        <p className="text-sm font-semibold text-[#003033] mb-1">Sorunuzun yanıtını bulamadınız mı?</p>
        <p className="text-xs text-[#77777b] mb-4">Bize WhatsApp üzerinden ulaşın, hemen yardımcı olalım</p>
        <a
          href={`https://wa.me/${config.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[40px] px-6 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl items-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp ile Sorun
        </a>
      </div>
    </div>
  )
}
