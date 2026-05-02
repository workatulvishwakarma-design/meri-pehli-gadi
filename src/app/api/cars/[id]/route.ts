import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/cars/[id] - Get single car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const car = await db.car.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        model: { select: { id: true, name: true, slug: true, bodyType: true } },
        variant: { select: { id: true, name: true } },
        city: { select: { id: true, name: true, slug: true, state: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
        seller: {
          select: { id: true, name: true, phone: true, avatar: true },
        },
        dealer: {
          select: {
            id: true, name: true, slug: true, phone: true,
            address: true, logo: true, rating: true, totalCars: true,
          },
        },
      },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    // Increment views count
    await db.car.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    })

    // Get similar cars
    const similarCars = await db.car.findMany({
      where: {
        id: { not: id },
        brandId: car.brandId,
        status: 'ACTIVE',
      },
      take: 6,
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        model: { select: { id: true, name: true, slug: true } },
        city: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ car, similarCars })
  } catch (error) {
    console.error('Get car error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/cars/[id] - Update car
const updateCarSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  brandId: z.string().optional(),
  modelId: z.string().optional(),
  variantId: z.string().nullable().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  price: z.number().positive().optional(),
  emiPrice: z.number().optional(),
  kmDriven: z.number().int().min(0).optional(),
  fuelType: z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID', 'LPG']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'CVT', 'DCT', 'AMT']).optional(),
  ownerType: z.enum(['FIRST', 'SECOND', 'THIRD', 'FOURTH_PLUS']).optional(),
  bodyType: z.enum(['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'VAN', 'TRUCK', 'MPV', 'PICKUP', 'WAGON']).optional(),
  color: z.string().optional(),
  rto: z.string().optional(),
  regYear: z.number().int().optional(),
  insuranceValidTill: z.string().nullable().optional(),
  cityId: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PENDING', 'ACTIVE', 'SOLD', 'FEATURED']).optional(),
  badge: z.string().nullable().optional(),
  isCertified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isFinanceAvailable: z.boolean().optional(),
  isInsuranceAvailable: z.boolean().optional(),
  conditionScore: z.number().int().min(1).max(10).nullable().optional(),
  trustScore: z.number().int().min(1).max(100).nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  dealerId: z.string().nullable().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateCarSchema.parse(body)

    const existing = await db.car.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    const car = await db.car.update({
      where: { id },
      data,
      include: {
        brand: true,
        model: true,
        variant: true,
        city: true,
        images: true,
        features: true,
        dealer: true,
      },
    })

    return NextResponse.json({ car })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Update car error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/cars/[id] - Delete car
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await db.car.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    await db.car.delete({ where: { id } })

    return NextResponse.json({ message: 'Car deleted successfully' })
  } catch (error) {
    console.error('Delete car error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
