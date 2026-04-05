import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

function startOf(unit: 'day' | 'week' | 'month', offset = 0): Date {
  const d = new Date()
  if (unit === 'day') {
    d.setDate(d.getDate() + offset)
    d.setHours(0, 0, 0, 0)
  } else if (unit === 'week') {
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
  } else if (unit === 'month') {
    d.setMonth(d.getMonth() + offset, 1)
    d.setHours(0, 0, 0, 0)
  }
  return d
}

function endOf(unit: 'week' | 'month', offset = 0): Date {
  if (unit === 'week') {
    const s = startOf('week', offset)
    s.setDate(s.getDate() + 7)
    return s
  }
  const s = startOf('month', offset)
  s.setMonth(s.getMonth() + 1)
  return s
}

export async function GET() {
  try {
    await requireAdmin()

    const today = startOf('day')
    const yesterday = startOf('day', -1)
    const thisWeek = startOf('week')
    const lastWeekStart = startOf('week', -1)
    const lastWeekEnd = endOf('week', -1)
    const thisMonth = startOf('month')
    const lastMonthStart = startOf('month', -1)
    const lastMonthEnd = endOf('month', -1)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const [
      totalOrders,
      totalRevenue,
      todayStats,
      yesterdayStats,
      thisWeekStats,
      lastWeekStats,
      thisMonthStats,
      lastMonthStats,
      ordersByStatus,
      dailyRevenue,
      topProducts,
      totalUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      returningCustomers,
      uniqueCustomers,
      avgItemsPerOrder,
      pendingOrders,
      paymentReceivedOrders,
      activeIbans,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      // 1. Total orders
      prisma.order.count(),
      // 2. Total revenue
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      // 3. Today
      prisma.order.aggregate({ where: { createdAt: { gte: today } }, _count: true, _sum: { totalAmount: true } }),
      // 4. Yesterday
      prisma.order.aggregate({ where: { createdAt: { gte: yesterday, lt: today } }, _count: true, _sum: { totalAmount: true } }),
      // 5. This week
      prisma.order.aggregate({ where: { createdAt: { gte: thisWeek } }, _count: true, _sum: { totalAmount: true } }),
      // 6. Last week
      prisma.order.aggregate({ where: { createdAt: { gte: lastWeekStart, lt: lastWeekEnd } }, _count: true, _sum: { totalAmount: true } }),
      // 7. This month
      prisma.order.aggregate({ where: { createdAt: { gte: thisMonth } }, _count: true, _sum: { totalAmount: true } }),
      // 8. Last month
      prisma.order.aggregate({ where: { createdAt: { gte: lastMonthStart, lt: lastMonthEnd } }, _count: true, _sum: { totalAmount: true } }),
      // 9. Orders by status
      prisma.order.groupBy({ by: ['status'], _count: true, _sum: { totalAmount: true } }),
      // 10. Daily revenue last 30 days
      prisma.$queryRaw<Array<{ date: string; orders: number; revenue: number }>>`
        SELECT DATE("createdAt")::text as date, COUNT(*)::int as orders, COALESCE(SUM("totalAmount")::float, 0) as revenue
        FROM "Order"
        WHERE "createdAt" >= ${thirtyDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      // 11. Top 10 products
      prisma.$queryRaw<Array<{ productSlug: string; productName: string; totalQuantity: number; totalRevenue: number }>>`
        SELECT "productSlug", "productName", SUM(quantity)::int as "totalQuantity",
               SUM("productPrice" * quantity)::float as "totalRevenue"
        FROM "OrderItem"
        GROUP BY "productSlug", "productName"
        ORDER BY "totalQuantity" DESC
        LIMIT 10
      `,
      // 12. Total users
      prisma.user.count(),
      // 13. New users today
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      // 14. New users this week
      prisma.user.count({ where: { createdAt: { gte: thisWeek } } }),
      // 15. New users this month
      prisma.user.count({ where: { createdAt: { gte: thisMonth } } }),
      // 16. Returning customers
      prisma.$queryRaw<[{ count: number }]>`
        SELECT COUNT(*)::int as count FROM (
          SELECT "userId" FROM "Order" GROUP BY "userId" HAVING COUNT(*) > 1
        ) sub
      `,
      // 17. Unique ordering customers
      prisma.$queryRaw<[{ count: number }]>`
        SELECT COUNT(DISTINCT "userId")::int as count FROM "Order"
      `,
      // 18. Avg items per order
      prisma.$queryRaw<[{ avg: number }]>`
        SELECT COALESCE(AVG(item_count)::float, 0) as avg FROM (
          SELECT COUNT(*)::int as item_count FROM "OrderItem" GROUP BY "orderId"
        ) sub
      `,
      // 19. Pending orders
      prisma.order.count({ where: { status: 'PENDING' } }),
      // 20. Payment received
      prisma.order.count({ where: { status: 'PAYMENT_RECEIVED' } }),
      // 21. Active IBANs
      prisma.ibanAccount.count({ where: { isActive: true } }),
      // 22. Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: { select: { productName: true, quantity: true } },
        },
      }),
      // 23. Recent users
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, phone: true, createdAt: true },
      }),
    ])

    const totalRev = Number(totalRevenue._sum.totalAmount || 0)
    const todayRev = Number(todayStats._sum.totalAmount || 0)
    const yesterdayRev = Number(yesterdayStats._sum.totalAmount || 0)
    const thisWeekRev = Number(thisWeekStats._sum.totalAmount || 0)
    const lastWeekRev = Number(lastWeekStats._sum.totalAmount || 0)
    const thisMonthRev = Number(thisMonthStats._sum.totalAmount || 0)
    const lastMonthRev = Number(lastMonthStats._sum.totalAmount || 0)

    return NextResponse.json({
      revenue: {
        total: totalRev,
        today: todayRev,
        yesterday: yesterdayRev,
        thisWeek: thisWeekRev,
        lastWeek: lastWeekRev,
        thisMonth: thisMonthRev,
        lastMonth: lastMonthRev,
        dailyChart: dailyRevenue,
      },
      orders: {
        total: totalOrders,
        today: todayStats._count || 0,
        thisWeek: thisWeekStats._count || 0,
        thisMonth: thisMonthStats._count || 0,
        averageValue: totalOrders > 0 ? totalRev / totalOrders : 0,
        byStatus: ordersByStatus.map((s) => ({
          status: s.status,
          count: s._count,
          revenue: Number(s._sum.totalAmount || 0),
        })),
      },
      topProducts,
      customers: {
        total: totalUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersWeek,
        newThisMonth: newUsersMonth,
        returning: returningCustomers[0]?.count || 0,
        uniqueOrdering: uniqueCustomers[0]?.count || 0,
      },
      conversion: {
        averageCartValue: totalOrders > 0 ? totalRev / totalOrders : 0,
        averageItemsPerOrder: avgItemsPerOrder[0]?.avg || 0,
      },
      alerts: {
        pendingOrders,
        awaitingPayment: paymentReceivedOrders,
        activeIbans,
      },
      recentOrders: recentOrders.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
      })),
      recentUsers,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 403 })
    }
    const code = (e as { code?: string })?.code
    if (code !== 'ECONNREFUSED') {
      console.error('Dashboard stats error:', e)
    }
    return NextResponse.json({
      revenue: { total: 0, today: 0, yesterday: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0, lastMonth: 0, dailyChart: [] },
      orders: { total: 0, today: 0, thisWeek: 0, thisMonth: 0, averageValue: 0, byStatus: [] },
      topProducts: [],
      customers: { total: 0, newToday: 0, newThisWeek: 0, newThisMonth: 0, returning: 0, uniqueOrdering: 0 },
      conversion: { averageCartValue: 0, averageItemsPerOrder: 0 },
      alerts: { pendingOrders: 0, awaitingPayment: 0, activeIbans: 0 },
      recentOrders: [],
      recentUsers: [],
    })
  }
}
