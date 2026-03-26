import { formatPrice, calculateDiscount } from '@/lib/format'

interface PriceDisplayProps {
  price: number
  salePrice: number | null
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({ price, salePrice, size = 'md' }: PriceDisplayProps) {
  const discount = salePrice ? calculateDiscount(price, salePrice) : 0
  const currentPrice = salePrice || price

  const sizeClasses = {
    sm: { current: 'text-sm', original: 'text-xs', badge: 'text-[10px] px-1 py-0.5' },
    md: { current: 'text-base', original: 'text-sm', badge: 'text-xs px-1.5 py-0.5' },
    lg: { current: 'text-2xl', original: 'text-base', badge: 'text-sm px-2 py-1' },
  }

  const classes = sizeClasses[size]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`${classes.current} font-bold text-[#1f1f1f]`}>
        {formatPrice(currentPrice)}
      </span>
      {salePrice && salePrice < price && (
        <>
          <span className={`${classes.original} text-[#77777b] line-through`}>
            {formatPrice(price)}
          </span>
          <span className={`${classes.badge} bg-[#FEE8F0] text-[#FB4D8A] font-semibold rounded`}>
            -%{discount}
          </span>
        </>
      )}
    </div>
  )
}
