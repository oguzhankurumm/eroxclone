'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { calculateDiscount } from '@/lib/format'
import type { Product } from '@/lib/types'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const discount = product.salePrice
    ? calculateDiscount(product.price, product.salePrice)
    : 0

  const hasSecondImage =
    product.images.length > 1 &&
    product.images[1] !== product.images[0]

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    addItem(product)
    toast.success('Ürün sepete eklendi!')
  }

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group block bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0px_4px_16px_rgba(0,0,0,0.1)] transition-shadow overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#F8F8F8] overflow-hidden">
        <Image
          src={hovered && hasSecondImage ? product.images[1] : product.images[0]}
          alt={`${product.name} - ${product.brand}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-[#FEE8F0] text-[#FB4D8A] text-xs font-semibold px-2 py-1 rounded">
            -%{discount}
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded">
              Tükendi
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:text-[#FB4D8A] transition-colors"
          aria-label="Favorilere ekle"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] text-[#77777b] uppercase tracking-wide mb-0.5">
          {product.brand}
        </p>
        <h3 className="text-sm font-medium text-[#003033] line-clamp-2 min-h-[2.5rem] leading-tight mb-2">
          {product.name}
        </h3>

        <PriceDisplay
          price={product.price}
          salePrice={product.salePrice}
          size="sm"
        />

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="mt-2.5 w-full h-[38px] bg-[#FB4D8A] hover:bg-[#e8437d] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Sepete Ekle
        </button>
      </div>
    </Link>
  )
}
