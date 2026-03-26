import Image from 'next/image'
import Link from 'next/link'
import type { PromoImages } from '@/lib/types'

interface PromoBannersProps {
  promoImages: PromoImages
}

export function PromoBanners({ promoImages }: PromoBannersProps) {
  const banners = promoImages.promoBanners

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {banners.map((banner) => (
            <Link
              key={banner.alt}
              href={banner.href}
              className="group relative aspect-[510/290] rounded-xl overflow-hidden"
            >
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
