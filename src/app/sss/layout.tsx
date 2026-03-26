import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/data'

export function generateMetadata(): Metadata {
  const config = getSiteConfig()
  return {
    title: `Sıkça Sorulan Sorular | ${config.siteName}`,
    description: `${config.siteName} hakkında sıkça sorulan sorular ve yanıtları. Kargo, iade, ödeme ve gizlilik bilgileri.`,
  }
}

export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return children
}
