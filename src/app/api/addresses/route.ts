import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: { isDefault: 'desc' },
  })
  return NextResponse.json(addresses)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const { title, fullName, phone, city, district, address, zipCode, isDefault } = data

  if (!title || !fullName || !phone || !city || !district || !address) {
    return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 })
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId },
      data: { isDefault: false },
    })
  }

  const addr = await prisma.address.create({
    data: {
      userId: session.userId,
      title,
      fullName,
      phone,
      city,
      district,
      address,
      zipCode: zipCode || null,
      isDefault: isDefault || false,
    },
  })

  return NextResponse.json(addr)
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const { id, ...updateData } = data

  if (updateData.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId },
      data: { isDefault: false },
    })
  }

  const addr = await prisma.address.update({
    where: { id, userId: session.userId },
    data: updateData,
  })

  return NextResponse.json(addr)
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  await prisma.address.delete({ where: { id, userId: session.userId } })
  return NextResponse.json({ success: true })
}
