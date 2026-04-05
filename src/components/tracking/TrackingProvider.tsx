'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function getSessionId(): string {
  const key = '_erox_sid'
  let sid = sessionStorage.getItem(key)
  if (!sid) {
    sid = Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem(key, sid)
  }
  return sid
}

export function TrackingProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTracked = useRef('')

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return

    const trackKey = pathname + (searchParams?.toString() || '')
    if (trackKey === lastTracked.current) return
    lastTracked.current = trackKey

    const sessionId = getSessionId()

    const data: Record<string, string | null> = {
      path: pathname,
      referrer: document.referrer || null,
      sessionId,
      utm_source: searchParams?.get('utm_source') || null,
      utm_medium: searchParams?.get('utm_medium') || null,
      utm_campaign: searchParams?.get('utm_campaign') || null,
    }

    // Also check for fbclid / gclid
    if (searchParams?.get('fbclid') && !data.utm_source) {
      data.utm_source = 'facebook'
      data.utm_medium = 'cpc'
    }
    if (searchParams?.get('gclid') && !data.utm_source) {
      data.utm_source = 'google'
      data.utm_medium = 'cpc'
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {})
  }, [pathname, searchParams])

  return null
}
