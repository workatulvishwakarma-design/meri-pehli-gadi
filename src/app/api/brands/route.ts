import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/brands - Get all brands
export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { cars: { where: { status: 'ACTIVE' } } },
        },
      },
    })

    return NextResponse.json({ brands })
  } catch (error) {
    console.error('Get brands error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
