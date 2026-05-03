import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/dealers - Get all dealers
export async function GET() {
  try {
    const dealers = await db.dealer.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        city: { select: { id: true, name: true, slug: true, state: true } },
        _count: {
          select: { cars: { where: { status: 'ACTIVE' } } },
        },
      },
    })

    return NextResponse.json({ dealers })
  } catch (error) {
    console.error('Get dealers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/dealers - Create dealer
const createDealerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  address: z.string().optional(),
  cityId: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createDealerSchema.parse(body)

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const dealer = await db.dealer.create({
      data: { ...data, slug },
      include: { city: true },
    })

    return NextResponse.json({ dealer }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Create dealer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
