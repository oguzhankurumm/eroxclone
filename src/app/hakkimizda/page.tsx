import type { Metadata } from 'next'
import { Award, Users, Package, Store } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getStaticPages, getSiteConfig } from '@/lib/data'

export function generateMetadata(): Metadata {
  const config = getSiteConfig()
  return {
    title: `Hakkımızda | ${config.siteName}`,
    description: `${config.siteName} hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz.`,
  }
}

const statIcons: Record<string, React.ElementType> = {
  'Yıllık Deneyim': Award,
  'Mutlu Müşteri': Users,
  'Ürün Çeşidi': Package,
  'Marka': Store,
}

export default function AboutPage() {
  const data = getStaticPages().hakkimizda

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Hakkımızda' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#003033] to-[#005055] rounded-2xl p-8 md:p-12 mb-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{data.title}</h1>
        <p className="text-white/80 leading-relaxed max-w-2xl">
          {data.sections[0]?.content}
        </p>
      </div>

      <div className="space-y-6">
        {data.sections.slice(1).map((section) => (
          <div key={section.heading}>
            {section.stats ? (
              <div>
                <h2 className="text-xl font-bold text-[#003033] mb-4">{section.heading}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.stats.map((stat) => {
                    const Icon = statIcons[stat.label] || Award
                    return (
                      <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-[#DFE2E6] p-6 text-center hover:border-[#FB4D8A] transition-colors"
                      >
                        <div className="w-12 h-12 bg-[#FEE8F0] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-6 h-6 text-[#FB4D8A]" />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-[#FB4D8A]">{stat.value}</p>
                        <p className="text-sm text-[#77777b] mt-1">{stat.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#DFE2E6] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-6 bg-[#FB4D8A] rounded-full" />
                  <h2 className="text-lg font-bold text-[#003033]">{section.heading}</h2>
                </div>
                <p className="text-[#77777b] leading-relaxed pl-4">{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
