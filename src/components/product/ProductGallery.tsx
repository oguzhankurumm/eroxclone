'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const uniqueImages = images.filter((img, i, arr) => arr.indexOf(img) === i)

  function goNext() {
    setSelected((s) => (s + 1) % uniqueImages.length)
  }
  function goPrev() {
    setSelected((s) => (s - 1 + uniqueImages.length) % uniqueImages.length)
  }

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-3">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px]" style={{ scrollbarWidth: 'none' }}>
          {uniqueImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                i === selected ? 'border-[#FB4D8A]' : 'border-[#DFE2E6] hover:border-[#FB4D8A]/50'
              }`}
            >
              <Image
                src={img}
                alt={`${name} - ${i + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-contain bg-[#F8F8F8]"
              />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div
          className="relative flex-1 aspect-square bg-[#F8F8F8] rounded-xl overflow-hidden cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={uniqueImages[selected]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
            priority
          />

          {/* Mobile swipe arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow md:hidden"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow md:hidden"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative w-[90vw] h-[80vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={uniqueImages[selected]}
              alt={name}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {uniqueImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelected(i) }}
                className={`w-2.5 h-2.5 rounded-full ${i === selected ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
