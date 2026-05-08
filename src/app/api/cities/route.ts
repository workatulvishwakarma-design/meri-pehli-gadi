import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/cities - Get all cities
export async function GET() {
  try {
    const cities = await db.city.findMany({
      where: { state: 'Assam' },  // HARD RULE: Assam-only cities
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { cars: { where: { status: 'ACTIVE' } } },
        },
      },
    })

    return NextResponse.json({ cities })
  } catch (error) {
    console.error('Get cities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
