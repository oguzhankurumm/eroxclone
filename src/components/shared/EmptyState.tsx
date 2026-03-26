import Link from 'next/link'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <PackageOpen className="w-16 h-16 text-[#DFE2E6] mb-4" />
      <h3 className="text-lg font-semibold text-[#003033] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#77777b] mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="h-[42px] px-6 bg-[#FB4D8A] text-white text-sm font-medium rounded-xl flex items-center hover:bg-[#e8437d] transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
