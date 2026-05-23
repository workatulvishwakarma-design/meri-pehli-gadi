import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/cars - List cars with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const city = searchParams.get('city')
    const brandId = searchParams.get('brandId')
    const modelId = searchParams.get('modelId')
    const budgetMin = searchParams.get('budgetMin')
    const budgetMax = searchParams.get('budgetMax')
    const fuelType = searchParams.get('fuelType')
    const bodyType = searchParams.get('bodyType')
    const year = searchParams.get('year')
    const transmission = searchParams.get('transmission')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'ACTIVE'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'createdAt'
    const isFeatured = searchParams.get('isFeatured')
    const isCertified = searchParams.get('isCertified')
    const isFinanceAvailable = searchParams.get('isFinanceAvailable')

    const where: Record<string, unknown> = {}

    if (status !== 'ALL') {
      where.status = status
    }

    if (city) {
      where.city = { slug: city }
    }

    if (brandId) {
      where.brandId = brandId
    }

    if (modelId) {
      where.modelId = modelId
    }

    if (budgetMin) {
      where.price = { ...(where.price as Record<string, unknown> | undefined), gte: parseFloat(budgetMin) }
    }
    if (budgetMax) {
      where.price = { ...(where.price as Record<string, unknown> | undefined), lte: parseFloat(budgetMax) }
    }

    if (fuelType) {
      where.fuelType = fuelType
    }

    if (bodyType) {
      where.bodyType = bodyType
    }

    if (year) {
      where.year = { gte: parseInt(year) }
    }

    if (transmission) {
      where.transmission = transmission
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { brand: { name: { contains: search } } },
        { model: { name: { contains: search } } },
      ]
    }

    if (isFeatured === 'true') {
      where.isFeatured = true
    }

    if (isCertified === 'true') {
      where.isCertified = true
    }

    if (isFinanceAvailable === 'true') {
      where.isFinanceAvailable = true
    }

    type SortOrder = 'asc' | 'desc'
    let orderBy: Record<string, SortOrder> | Record<string, Record<string, SortOrder>> = { createdAt: 'desc' as SortOrder }

    if (sort === 'price-asc') orderBy = { price: 'asc' as SortOrder }
    if (sort === 'price-desc') orderBy = { price: 'desc' as SortOrder }
    if (sort === 'year-desc') orderBy = { year: 'desc' as SortOrder }
    if (sort === 'km-driven-asc') orderBy = { kmDriven: 'asc' as SortOrder }
    if (sort === 'newest') orderBy = { createdAt: 'desc' as SortOrder }
    if (sort === 'popular') orderBy = { viewsCount: 'desc' as SortOrder }

    let [cars, total] = await Promise.all([
      db.car.findMany({
        where,
        include: {
          brand: { select: { id: true, name: true, slug: true, logo: true } },
          model: { select: { id: true, name: true, slug: true } },
          city: { select: { id: true, name: true, slug: true } },
          images: { select: { id: true, url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
          dealer: { select: { id: true, name: true, slug: true, logo: true, rating: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.car.count({ where }),
    ])

    // Fallback: If they requested isFeatured but none exist, just return the latest active cars
    if (isFeatured === 'true' && cars.length === 0) {
      delete where.isFeatured
      const [fallbackCars, fallbackTotal] = await Promise.all([
        db.car.findMany({
          where,
          include: {
            brand: { select: { id: true, name: true, slug: true, logo: true } },
            model: { select: { id: true, name: true, slug: true } },
            city: { select: { id: true, name: true, slug: true } },
            images: { select: { id: true, url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
            dealer: { select: { id: true, name: true, slug: true, logo: true, rating: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.car.count({ where }),
      ])
      cars = fallbackCars
      total = fallbackTotal
    }

    return NextResponse.json({
      cars,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get cars error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/cars - Create car
const createCarSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  brandId: z.string(),
  modelId: z.string(),
  variantId: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive(),
  emiPrice: z.number().optional(),
  kmDriven: z.number().int().min(0),
  fuelType: z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID', 'LPG']).default('PETROL'),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'CVT', 'DCT', 'AMT']).default('MANUAL'),
  ownerType: z.enum(['FIRST', 'SECOND', 'THIRD', 'FOURTH_PLUS']).default('FIRST'),
  bodyType: z.enum(['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'VAN', 'TRUCK', 'MPV', 'PICKUP', 'WAGON']).default('HATCHBACK'),
  color: z.string().optional(),
  rto: z.string().optional(),
  regYear: z.number().int().optional(),
  insuranceValidTill: z.string().optional(),
  cityId: z.string().optional(),
  badge: z.string().optional(),
  isCertified: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isFinanceAvailable: z.boolean().default(false),
  isInsuranceAvailable: z.boolean().default(false),
  conditionScore: z.number().int().min(1).max(10).optional(),
  trustScore: z.number().int().min(1).max(100).optional(),
  features: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  dealerId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createCarSchema.parse(body)

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now()

    const car = await db.car.create({
      data: {
        ...data,
        slug,
        sellerId: user.id,
        status: 'ACTIVE',
        features: data.features
          ? { create: data.features.map((name) => ({ name })) }
          : undefined,
      },
      include: {
        brand: true,
        model: true,
        city: true,
        images: true,
        features: true,
        dealer: true,
      },
    })

    return NextResponse.json({ car }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Create car error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
