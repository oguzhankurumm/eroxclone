import { Package, Shield, Award, RefreshCw } from 'lucide-react'
import type { TrustBadge } from '@/lib/types'

const iconMap: Record<string, React.ElementType> = {
  Package,
  Shield,
  Award,
  RefreshCw,
}

interface TrustBadgesProps {
  badges: TrustBadge[]
}

export function TrustBadges({ badges }: TrustBadgesProps) {
  return (
    <section className="py-6 md:py-8 border-b border-[#DFE2E6]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon] || Package
            return (
              <div
                key={badge.id}
                className="flex items-center gap-3 md:justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#FEE8F0] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#FB4D8A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#003033]">
                    {badge.title}
                  </p>
                  <p className="text-xs text-[#77777b] hidden md:block">
                    {badge.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
