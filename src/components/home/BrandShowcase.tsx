import Image from 'next/image'
import Link from 'next/link'
import type { Brand } from '@/lib/types'

interface BrandShowcaseProps {
  brands: Brand[]
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  const brandsWithLogos = brands.filter((b) => b.logo)

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#003033] mb-6">
          Favori Markalarımız
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {brandsWithLogos.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marka/${brand.slug}`}
              className="group flex items-center justify-center aspect-square bg-white rounded-xl border border-[#DFE2E6] hover:border-[#FB4D8A] transition-colors p-4"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={120}
                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
