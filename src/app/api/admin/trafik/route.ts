import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const EMPTY_STATS = {
  overview: {
    totalViews: 0,
    uniqueSessions: 0,
    todayViews: 0,
    yesterdayViews: 0,
    avgViewsPerSession: 0,
  },
  bySource: [],
  byDevice: [],
  byBrowser: [],
  byOS: [],
  byMedium: [],
  byCampaign: [],
  topPages: [],
  dailyViews: [],
  hourlyToday: [],
  recentViews: [],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const days = parseInt(searchParams.get('days') || '30', 10)
    const since = new Date()
    since.setDate(since.getDate() - days)
    since.setHours(0, 0, 0, 0)

    const [
      totalViews,
      uniqueSessions,
      viewsBySource,
      viewsByDevice,
      viewsByBrowser,
      viewsByOS,
      viewsByPath,
      dailyViews,
      viewsByMedium,
      viewsByCampaign,
      todayViews,
      yesterdayViews,
      hourlyToday,
      recentViews,
    ] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),

      prisma.pageView.groupBy({
        by: ['sessionId'],
        where: { createdAt: { gte: since }, sessionId: { not: null } },
      }).then((r) => r.length),

      prisma.$queryRawUnsafe<Array<{ source: string; count: bigint }>>(
        `SELECT source, COUNT(*) as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY source ORDER BY count DESC`,
        since
      ),

      prisma.$queryRawUnsafe<Array<{ device: string; count: bigint }>>(
        `SELECT device, COUNT(*) as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY device ORDER BY count DESC`,
        since
      ),

      prisma.$queryRawUnsafe<Array<{ browser: string; count: bigint }>>(
        `SELECT browser, COUNT(*) as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY browser ORDER BY count DESC`,
        since
      ),

      prisma.$queryRawUnsafe<Array<{ os: string; count: bigint }>>(
        `SELECT os, COUNT(*) as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY os ORDER BY count DESC`,
        since
      ),

      prisma.$queryRawUnsafe<Array<{ path: string; count: bigint; unique_sessions: bigint }>>(
        `SELECT path, COUNT(*) as count, COUNT(DISTINCT "sessionId") as unique_sessions FROM "PageView" WHERE "createdAt" >= $1 GROUP BY path ORDER BY count DESC LIMIT 20`,
        since
      ),

      prisma.$queryRawUnsafe<Array<{ date: string; views: bigint; sessions: bigint }>>(
        `SELECT DATE("createdAt") as date, COUNT(*) as views, COUNT(DISTINCT "sessionId") as sessions FROM "PageView" WHERE "createdAt" >= $1 GROUP BY DATE("createdAt") ORDER BY date ASC`,
        since
      ),

      prisma.$queryRawUnsafe<Array<{ medium: string; count: bigint }>>(
        `SELECT medium, COUNT(*) as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY medium ORDER BY count DESC`,
        since
      ),

      prisma.$queryRawUnsafe<Array<{ campaign: string; count: bigint }>>(
        `SELECT campaign, COUNT(*) as count FROM "PageView" WHERE "createdAt" >= $1 AND campaign IS NOT NULL GROUP BY campaign ORDER BY count DESC LIMIT 10`,
        since
      ),

      (() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return prisma.pageView.count({ where: { createdAt: { gte: today } } })
      })(),

      (() => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return prisma.pageView.count({ where: { createdAt: { gte: yesterday, lt: today } } })
      })(),

      (() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return prisma.$queryRawUnsafe<Array<{ hour: number; count: bigint }>>(
          `SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*) as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY hour ORDER BY hour ASC`,
          today
        )
      })(),

      prisma.pageView.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          path: true,
          source: true,
          medium: true,
          campaign: true,
          device: true,
          browser: true,
          os: true,
          referrer: true,
          createdAt: true,
        },
      }),
    ])

    const serialize = (arr: Array<{ [key: string]: unknown }>) =>
      arr.map((item) => {
        const obj: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(item)) {
          obj[k] = typeof v === 'bigint' ? Number(v) : v
        }
        return obj
      })

    return NextResponse.json({
      overview: {
        totalViews,
        uniqueSessions,
        todayViews,
        yesterdayViews,
        avgViewsPerSession: uniqueSessions > 0 ? +(totalViews / uniqueSessions).toFixed(1) : 0,
      },
      bySource: serialize(viewsBySource),
      byDevice: serialize(viewsByDevice),
      byBrowser: serialize(viewsByBrowser),
      byOS: serialize(viewsByOS),
      byMedium: serialize(viewsByMedium),
      byCampaign: serialize(viewsByCampaign),
      topPages: serialize(viewsByPath),
      dailyViews: serialize(dailyViews),
      hourlyToday: serialize(hourlyToday),
      recentViews,
    })
  } catch {
    return NextResponse.json(EMPTY_STATS)
  }
}
