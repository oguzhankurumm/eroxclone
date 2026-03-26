import type { Metadata } from 'next'
import { Shield, Eye, Lock, FileText } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getStaticPages, getSiteConfig } from '@/lib/data'

export function generateMetadata(): Metadata {
  const config = getSiteConfig()
  return {
    title: `Gizlilik Politikası | ${config.siteName}`,
    description: `${config.siteName} gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.`,
  }
}

const sectionIcons: Record<string, React.ElementType> = {
  'Kişisel Verilerin Korunması': Shield,
  'Toplanan Veriler': Eye,
  'Veri Güvenliği': Lock,
}

export default function PrivacyPage() {
  const data = getStaticPages().gizlilik

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Gizlilik Politikası' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#003033] to-[#005055] rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Gizliliğiniz Bizim İçin Önemli</h1>
            <p className="text-white/80 text-sm mt-1">6698 sayılı KVKK kapsamında kişisel verileriniz güvende</p>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Lock, label: 'SSL Şifreleme' },
          { icon: FileText, label: 'KVKK Uyumlu' },
          { icon: Shield, label: 'Güvenli Alışveriş' },
        ].map((badge) => (
          <div key={badge.label} className="bg-[#F8F8F8] rounded-xl p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <badge.icon className="w-5 h-5 text-[#003033]" />
            </div>
            <span className="text-xs font-semibold text-[#003033]">{badge.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {data.sections.map((section) => {
          const Icon = sectionIcons[section.heading] || Shield
          return (
            <div
              key={section.heading}
              className="bg-white rounded-xl border border-[#DFE2E6] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#E6F7F8] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#003033]" />
                </div>
                <h2 className="text-lg font-bold text-[#003033]">{section.heading}</h2>
              </div>

              {section.content && (
                <p className="text-sm text-[#77777b] leading-relaxed pl-13">{section.content}</p>
              )}

              {section.items && (
                <div className="pl-13 space-y-2.5">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#E6F7F8] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#003033]">{i + 1}</span>
                      </div>
                      <p className="text-sm text-[#77777b] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="mt-6 bg-[#F8F8F8] rounded-xl p-5 text-center">
        <p className="text-xs text-[#77777b]">
          Bu gizlilik politikası en son <span className="font-medium text-[#003033]">2024</span> tarihinde güncellenmiştir.
          Sorularınız için <span className="font-medium text-[#FB4D8A]">info@erox.com.tr</span> adresine yazabilirsiniz.
        </p>
      </div>
    </div>
  )
}
