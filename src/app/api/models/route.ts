import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/models?brandId=xxx - Get models by brand
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')

    if (!brandId) {
      return NextResponse.json(
        { error: 'brandId query parameter is required' },
        { status: 400 }
      )
    }

    const models = await db.model.findMany({
      where: { brandId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { cars: { where: { status: 'ACTIVE' } } },
        },
      },
    })

    return NextResponse.json({ models })
  } catch (error) {
    console.error('Get models error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
