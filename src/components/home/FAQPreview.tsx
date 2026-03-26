'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FAQ } from '@/lib/types'

interface FAQPreviewProps {
  faqs: FAQ[]
}

export function FAQPreview({ faqs }: FAQPreviewProps) {
  const previewFaqs = faqs.slice(0, 4)

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#003033] mb-6">
          Sıkça Sorulan Sorular
        </h2>
        <div className="max-w-3xl">
          {previewFaqs.map((faq) => (
            <FAQItem key={faq.id} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[#DFE2E6]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm md:text-base font-medium text-[#003033] pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#77777b] shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-sm text-[#77777b] leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}
