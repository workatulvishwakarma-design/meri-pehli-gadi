import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/testimonials - Get all testimonials
export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Get testimonials error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/testimonials - Create testimonial
const createTestimonialSchema = z.object({
  name: z.string().min(2),
  designation: z.string().optional(),
  city: z.string().optional(),
  content: z.string().min(10),
  rating: z.number().int().min(1).max(5).default(5),
  avatar: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createTestimonialSchema.parse(body)

    const testimonial = await db.testimonial.create({ data })

    return NextResponse.json({ testimonial }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Create testimonial error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
