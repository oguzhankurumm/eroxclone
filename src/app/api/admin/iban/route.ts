import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const accounts = await prisma.ibanAccount.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ accounts })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const { bankName, accountHolder, ibanNumber } = await request.json()

    if (!bankName || !accountHolder || !ibanNumber) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 })
    }

    const count = await prisma.ibanAccount.count()
    const account = await prisma.ibanAccount.create({
      data: { bankName, accountHolder, ibanNumber, sortOrder: count },
    })
    return NextResponse.json({ account }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const { id, bankName, accountHolder, ibanNumber, isActive, sortOrder } = await request.json()

    if (!id) return NextResponse.json({ error: 'ID zorunludur' }, { status: 400 })

    const account = await prisma.ibanAccount.update({
      where: { id },
      data: {
        ...(bankName !== undefined && { bankName }),
        ...(accountHolder !== undefined && { accountHolder }),
        ...(ibanNumber !== undefined && { ibanNumber }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    })
    return NextResponse.json({ account })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { id } = await request.json()

    if (!id) return NextResponse.json({ error: 'ID zorunludur' }, { status: 400 })

    await prisma.ibanAccount.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
