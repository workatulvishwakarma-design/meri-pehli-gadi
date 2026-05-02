import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlists = await db.wishlist.findMany({
      where: { userId: user.id },
      include: {
        car: {
          include: {
            brand: { select: { id: true, name: true, slug: true, logo: true } },
            model: { select: { id: true, name: true, slug: true } },
            city: { select: { id: true, name: true, slug: true } },
            images: { select: { id: true, url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ wishlists })
  } catch (error) {
    console.error('Get wishlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add car to wishlist
const addWishlistSchema = z.object({
  carId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { carId } = addWishlistSchema.parse(body)

    // Check car exists
    const car = await db.car.findUnique({ where: { id: carId } })
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    // Check if already wishlisted
    const existing = await db.wishlist.findUnique({
      where: {
        userId_carId: { userId: user.id, carId },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Car already in wishlist' },
        { status: 409 }
      )
    }

    const wishlist = await db.wishlist.create({
      data: { userId: user.id, carId },
      include: {
        car: {
          include: {
            brand: { select: { id: true, name: true, slug: true } },
            model: { select: { id: true, name: true, slug: true } },
            images: { select: { id: true, url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
          },
        },
      },
    })

    return NextResponse.json({ wishlist }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Add wishlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist?carId=xxx - Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const carId = searchParams.get('carId')

    if (!carId) {
      return NextResponse.json(
        { error: 'carId query parameter is required' },
        { status: 400 }
      )
    }

    await db.wishlist.delete({
      where: {
        userId_carId: { userId: user.id, carId },
      },
    })

    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error) {
    console.error('Remove wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist. It may not exist.' },
      { status: 400 }
    )
  }
}
