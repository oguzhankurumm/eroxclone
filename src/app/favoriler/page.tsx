import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { EmptyState } from '@/components/shared/EmptyState'

export const metadata: Metadata = {
  title: 'Favorilerim | EROX',
  description: 'Favori ürünlerinizi görüntüleyin.',
}

export default function FavoritesPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Favorilerim' }]} />
      <EmptyState
        title="Favorileriniz boş"
        description="Beğendiğiniz ürünleri favorilerinize ekleyerek daha sonra kolayca ulaşabilirsiniz."
        actionLabel="Ürünleri Keşfet"
        actionHref="/"
      />
    </div>
  )
}
