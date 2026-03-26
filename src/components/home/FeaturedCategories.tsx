import Image from 'next/image'
import Link from 'next/link'
import type { PromoImages } from '@/lib/types'

interface FeaturedCategoriesProps {
  promoImages: PromoImages
}

export function FeaturedCategories({ promoImages }: FeaturedCategoriesProps) {
  const promoBoxes = promoImages.categoryShowcase.section1_promoBoxes
  const categories = promoImages.categoryShowcase.section2_featuredCategories

  return (
    <>
      {/* 3 Promo Boxes — Erkekler / Kadınlar / Çiftler */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {promoBoxes.map((box) => (
              <Link
                key={box.title}
                href={box.href}
                className="group relative aspect-[1/1] md:aspect-[510/494] rounded-xl overflow-hidden"
              >
                <Image
                  src={box.image}
                  alt={box.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    {box.title}
                  </h3>
                  <span className="inline-flex items-center text-sm text-white font-medium border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
                    Tümünü Gör →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-8 md:py-12 bg-[#F8F8F8]">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#003033] mb-6">
            Öne Çıkan Kategoriler
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold text-white">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
