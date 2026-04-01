import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const orderNumber = searchParams.get('orderNumber')?.trim()
  const phone = searchParams.get('phone')?.trim().replace(/\s/g, '')

  if (!orderNumber || !phone) {
    return NextResponse.json({ error: 'Sipariş numarası ve telefon gerekli' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  })

  if (!order) {
    return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
  }

  // Verify phone matches either guest phone or address phone
  const addressPhone = (order.address as { phone?: string })?.phone?.replace(/\s/g, '') || ''
  const guestPhone = order.guestPhone?.replace(/\s/g, '') || ''
  const normalizedPhone = phone.replace(/\s/g, '')

  if (guestPhone !== normalizedPhone && addressPhone !== normalizedPhone) {
    return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount,
    bankName: order.bankName,
    items: order.items.map(i => ({
      productName: i.productName,
      productPrice: i.productPrice,
      quantity: i.quantity,
    })),
    createdAt: order.createdAt,
  })
}
