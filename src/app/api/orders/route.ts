import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const session = await getSession()
  const data = await request.json()
  const { items, address, totalAmount, bankName, guestName, guestPhone } = data

  if (!items?.length || !address || !totalAmount || !bankName) {
    return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
  }

  // Guest checkout: require name and phone
  if (!session && (!guestName || !guestPhone)) {
    return NextResponse.json({ error: 'Ad soyad ve telefon zorunludur' }, { status: 400 })
  }

  const orderNumber = `ERX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session?.userId || null,
      guestName: session ? null : guestName,
      guestPhone: session ? null : guestPhone,
      address,
      totalAmount,
      bankName,
      items: {
        create: items.map((item: { productSlug: string; productName: string; productPrice: number; quantity: number }) => ({
          productSlug: item.productSlug,
          productName: item.productName,
          productPrice: item.productPrice,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  })

  return NextResponse.json(order)
}
