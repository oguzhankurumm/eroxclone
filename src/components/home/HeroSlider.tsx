'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeroSlide } from '@/lib/types'

interface HeroSliderProps {
  slides: HeroSlide[]
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full bg-[#F8F8F8] overflow-hidden" aria-label="Öne çıkan kampanyalar" aria-roledescription="carousel">
      <div className="relative aspect-[16/6] md:aspect-[16/5] max-h-[500px]" aria-live="off">
        {slides.map((slide, index) => (
          <Link
            key={slide.id}
            href={slide.href}
            aria-hidden={index !== current}
            tabIndex={index === current ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          </Link>
        ))}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
          aria-label="Önceki"
        >
          <ChevronLeft className="w-5 h-5 text-[#003033]" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
          aria-label="Sonraki"
        >
          <ChevronRight className="w-5 h-5 text-[#003033]" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === current ? 'bg-[#FB4D8A]' : 'bg-white/70'
              }`}
              aria-label={`Slide ${index + 1} / ${slides.length}`}
              aria-current={index === current ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
