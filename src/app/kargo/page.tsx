import type { Metadata } from 'next'
import { Package, Truck, Clock, MapPin } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getStaticPages, getSiteConfig } from '@/lib/data'

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Package,
  Clock,
  MapPin,
}

export function generateMetadata(): Metadata {
  const config = getSiteConfig()
  return {
    title: `Kargo Bilgileri | ${config.siteName}`,
    description: `${config.siteName} kargo bilgileri, ücretsiz kargo koşulları ve teslimat süreleri.`,
  }
}

export default function ShippingPage() {
  const data = getStaticPages().kargo
  const config = getSiteConfig()

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Kargo Bilgileri' }]} />

      {/* Free shipping highlight */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{config.shipping.freeShippingThreshold} TL ve Üzeri Ücretsiz Kargo</h1>
            <p className="text-white/80 text-sm mt-1">Tüm Türkiye genelinde geçerli · Tahmini teslimat: {config.shipping.estimatedDelivery}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.sections.map((section) => {
          const Icon = section.icon ? iconMap[section.icon] : Package
          return (
            <div
              key={section.heading}
              className="bg-white rounded-xl border border-[#DFE2E6] p-6 hover:border-[#FB4D8A]/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FEE8F0] flex items-center justify-center shrink-0">
                  {Icon && <Icon className="w-5 h-5 text-[#FB4D8A]" />}
                </div>
                <h2 className="text-base font-bold text-[#003033]">{section.heading}</h2>
              </div>
              <p className="text-sm text-[#77777b] leading-relaxed">{section.content}</p>
            </div>
          )
        })}
      </div>

      {/* Carriers */}
      <div className="mt-6 bg-[#F8F8F8] rounded-xl p-5">
        <p className="text-sm font-semibold text-[#003033] mb-3">Anlaşmalı Kargo Firmaları</p>
        <div className="flex flex-wrap gap-3">
          {config.shipping.carriers.map((carrier) => (
            <span key={carrier} className="bg-white border border-[#DFE2E6] rounded-lg px-4 py-2 text-sm font-medium text-[#003033]">
              {carrier}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
