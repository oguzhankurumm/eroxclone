'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, Minus, Plus, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/types'
import toast from 'react-hot-toast'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function handleAdd() {
    addItem(product, quantity)
    toast.success(`${quantity} ürün sepete eklendi!`)
    setAdded(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-[#DFE2E6] rounded-xl overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-[42px] flex items-center justify-center hover:bg-[#F8F8F8] transition-colors"
          aria-label="Azalt"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 h-[42px] flex items-center justify-center text-sm font-medium border-x border-[#DFE2E6]">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-[42px] flex items-center justify-center hover:bg-[#F8F8F8] transition-colors"
          aria-label="Artır"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={!product.inStock || added}
        className={`flex-1 h-[44px] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${
          added
            ? 'bg-green-500'
            : 'bg-[#FB4D8A] hover:bg-[#e8437d] disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Sepete Eklendi
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Sepete Ekle
          </>
        )}
      </button>
    </div>
  )
}
