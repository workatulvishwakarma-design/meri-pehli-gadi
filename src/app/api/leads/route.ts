import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/leads - Get all leads (admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        include: {
          car: { select: { id: true, title: true, price: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.lead.count({ where }),
    ])

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get leads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create lead (contact)
const createLeadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number is required'),
  message: z.string().optional(),
  carId: z.string().optional(),
  cityId: z.string().optional(),
  dealerId: z.string().optional(),
  type: z.enum(['CONTACT', 'TEST_DRIVE', 'FINANCE', 'INSURANCE', 'SELL_CAR', 'VALUATION', 'MAKE_OFFER', 'DEALER_INQUIRY']).default('CONTACT'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createLeadSchema.parse({
      ...body,
      email: body.email || undefined,
    })

    // Check if user is logged in
    const user = await getUserFromRequest(request)

    const lead = await db.lead.create({
      data: {
        ...data,
        userId: user?.id,
      },
      include: {
        car: { select: { id: true, title: true, price: true } },
      },
    })

    // Increment inquiries count if carId provided
    if (data.carId) {
      await db.car.update({
        where: { id: data.carId },
        data: { inquiriesCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Create lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
