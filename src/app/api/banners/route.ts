import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/banners - Get all banners
export async function GET() {
  try {
    const banners = await db.banner.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ banners })
  } catch (error) {
    console.error('Get banners error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
