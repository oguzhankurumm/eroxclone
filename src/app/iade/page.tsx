import type { Metadata } from 'next'
import { RotateCcw } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getStaticPages, getSiteConfig } from '@/lib/data'

export function generateMetadata(): Metadata {
  const config = getSiteConfig()
  return {
    title: `İade ve Değişim | ${config.siteName}`,
    description: `${config.siteName} iade ve değişim koşulları, iade süreci ve para iadesi bilgileri.`,
  }
}

export default function ReturnPage() {
  const data = getStaticPages().iade

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'İade ve Değişim' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FB4D8A] to-[#e8437d] rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <RotateCcw className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">14 Gün İçinde Koşulsuz İade</h1>
            <p className="text-white/80 text-sm mt-1">6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.sections.map((section) => (
          <div
            key={section.heading}
            className="bg-white rounded-xl border border-[#DFE2E6] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#FB4D8A] rounded-full" />
              <h2 className="text-lg font-bold text-[#003033]">{section.heading}</h2>
            </div>

            {section.content && (
              <p className="text-sm text-[#77777b] leading-relaxed pl-4">{section.content}</p>
            )}

            {section.steps && (
              <div className="pl-4 space-y-4">
                {section.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FB4D8A] text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      {i < section.steps!.length - 1 && (
                        <div className="w-0.5 flex-1 bg-[#FEE8F0] mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-[#77777b] leading-relaxed pt-1.5 pb-2">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
