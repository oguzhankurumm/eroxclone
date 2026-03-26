import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, MessageCircle, Store } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getStaticPages, getSiteConfig } from '@/lib/data'

export function generateMetadata(): Metadata {
  const config = getSiteConfig()
  return {
    title: `İletişim | ${config.siteName}`,
    description: `${config.siteName} ile iletişime geçin. Telefon, e-posta ve adres bilgileri.`,
  }
}

export default function ContactPage() {
  const data = getStaticPages().iletisim
  const config = getSiteConfig()

  const contactItems = [
    { icon: Phone, label: 'Telefon', value: data.info.phone, href: `tel:${data.info.phone.replace(/\s/g, '')}`, color: 'bg-green-50', iconColor: 'text-green-600' },
    { icon: Mail, label: 'E-posta', value: data.info.email, href: `mailto:${data.info.email}`, color: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: MapPin, label: 'Adres', value: data.info.address, color: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: Clock, label: 'Çalışma Saatleri', value: data.info.workingHours, color: 'bg-purple-50', iconColor: 'text-purple-600' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'İletişim' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FB4D8A] to-[#e8437d] rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Bize Ulaşın</h1>
            <p className="text-white/80 text-sm mt-1">Sorularınız için 7/24 WhatsApp destek hattımızdan bize yazabilirsiniz</p>
          </div>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={`https://wa.me/${config.contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-8 hover:border-green-400 transition-colors group"
      >
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-green-800">WhatsApp ile Hızlı İletişim</p>
          <p className="text-sm text-green-600">Hemen mesaj gönderin, en kısa sürede yanıt verelim</p>
        </div>
        <span className="hidden md:inline-flex h-[40px] px-5 bg-green-500 text-white font-semibold rounded-lg items-center text-sm hover:bg-green-600 transition-colors">
          Mesaj Gönder
        </span>
      </a>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {contactItems.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-[#DFE2E6] p-5 hover:border-[#FB4D8A]/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#003033] mb-1">{item.label}</h2>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-[#77777b] hover:text-[#FB4D8A] transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-[#77777b]">{item.value}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stores */}
      {config.stores.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FEE8F0] flex items-center justify-center">
              <Store className="w-5 h-5 text-[#FB4D8A]" />
            </div>
            <h2 className="text-xl font-bold text-[#003033]">Mağazalarımız</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.stores.map((store) => (
              <div
                key={store.slug}
                className="bg-white rounded-xl border border-[#DFE2E6] p-5 hover:border-[#FB4D8A]/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#FEE8F0] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#FB4D8A]" />
                  </div>
                  <h3 className="font-semibold text-[#003033] text-sm">{store.name}</h3>
                </div>
                <div className="pl-11">
                  <p className="text-xs font-medium text-[#FB4D8A] mb-1">
                    {store.district}, {store.city}
                  </p>
                  <p className="text-xs text-[#77777b] leading-relaxed">{store.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
