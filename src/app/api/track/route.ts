import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile'
  if (/ipad|tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}

function parseBrowser(ua: string): string {
  if (/edg/i.test(ua)) return 'Edge'
  if (/opr|opera/i.test(ua)) return 'Opera'
  if (/chrome|crios/i.test(ua)) return 'Chrome'
  if (/firefox|fxios/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
  return 'Other'
}

function parseOS(ua: string): string {
  if (/windows/i.test(ua)) return 'Windows'
  if (/macintosh|mac os/i.test(ua)) return 'macOS'
  if (/android/i.test(ua)) return 'Android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS'
  if (/linux/i.test(ua)) return 'Linux'
  return 'Other'
}

function parseSource(referrer: string | null, utmSource: string | null): string {
  if (utmSource) return utmSource.toLowerCase()
  if (!referrer) return 'direct'
  const r = referrer.toLowerCase()
  if (r.includes('google')) return 'google'
  if (r.includes('facebook') || r.includes('fb.com') || r.includes('fbclid')) return 'facebook'
  if (r.includes('instagram')) return 'instagram'
  if (r.includes('twitter') || r.includes('t.co') || r.includes('x.com')) return 'twitter'
  if (r.includes('youtube')) return 'youtube'
  if (r.includes('tiktok')) return 'tiktok'
  if (r.includes('pinterest')) return 'pinterest'
  if (r.includes('linkedin')) return 'linkedin'
  if (r.includes('bing')) return 'bing'
  if (r.includes('yandex')) return 'yandex'
  return 'referral'
}

function parseMedium(referrer: string | null, utmMedium: string | null, source: string): string {
  if (utmMedium) return utmMedium.toLowerCase()
  if (source === 'direct') return 'none'
  if (['google', 'bing', 'yandex'].includes(source)) return 'organic'
  if (['facebook', 'instagram', 'twitter', 'tiktok', 'pinterest', 'linkedin', 'youtube'].includes(source)) return 'social'
  return 'referral'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, referrer, utm_source, utm_medium, utm_campaign, sessionId } = body

    const ua = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || null

    const source = parseSource(referrer, utm_source)
    const medium = parseMedium(referrer, utm_medium, source)

    await prisma.pageView.create({
      data: {
        path: path || '/',
        referrer: referrer || null,
        source,
        medium,
        campaign: utm_campaign || null,
        userAgent: ua.substring(0, 500),
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        os: parseOS(ua),
        ip,
        sessionId: sessionId || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Tracking is fire-and-forget - always return 200 to avoid client errors
    return NextResponse.json({ ok: false })
  }
}
