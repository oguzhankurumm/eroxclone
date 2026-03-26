import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center gap-1 text-sm flex-wrap">
        <li>
          <Link href="/" className="text-[#77777b] hover:text-[#FB4D8A] transition-colors">
            Anasayfa
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-[#DFE2E6]" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-[#77777b] hover:text-[#FB4D8A] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#003033] font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
