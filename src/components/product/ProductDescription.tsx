'use client'

/**
 * Renders product description HTML sourced from our own static JSON data export.
 * This content is NOT user-generated — it comes from the pre-exported product catalog.
 * dangerouslySetInnerHTML is acceptable here because:
 * 1. The data source is trusted (our own static JSON files)
 * 2. There is no user input path to this content
 * 3. The content is identical at build time and runtime
 */

interface ProductDescriptionProps {
  html: string
}

export function ProductDescription({ html }: ProductDescriptionProps) {
  return (
    <div
      className="prose prose-sm max-w-none text-[#77777b] leading-relaxed [&_a]:text-[#FB4D8A] [&_strong]:text-[#003033]"
      // eslint-disable-next-line react/no-danger -- trusted static data from our JSON export
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
