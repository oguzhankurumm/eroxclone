// JSON-LD structured data component for SEO.
// Data is hardcoded from our own static config — not user-generated content.
// JSON.stringify is safe here as it produces valid JSON without script injection risk.
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonString = JSON.stringify(data)
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  )
}
