import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30'

    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(period))

    const [
      totalCars,
      activeCars,
      featuredCars,
      totalLeads,
      newLeads,
      convertedLeads,
      totalUsers,
      totalDealers,
      totalBlogs,
      recentLeads,
      recentCars,
      leadsByType,
    ] = await Promise.all([
      db.car.count(),
      db.car.count({ where: { status: 'ACTIVE' } }),
      db.car.count({ where: { status: 'FEATURED' } }),
      db.lead.count(),
      db.lead.count({ where: { status: 'NEW' } }),
      db.lead.count({ where: { status: 'CONVERTED' } }),
      db.user.count(),
      db.dealer.count(),
      db.blogPost.count({ where: { status: 'PUBLISHED' } }),
      db.lead.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          car: { select: { id: true, title: true } },
        },
      }),
      db.car.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, title: true, price: true, status: true,
          viewsCount: true, inquiriesCount: true, createdAt: true,
          brand: { select: { name: true } },
          city: { select: { name: true } },
        },
      }),
      db.lead.groupBy({
        by: ['type'],
        _count: true,
      }),
    ])

    // Monthly stats
    const monthlyLeads = await db.lead.count({
      where: { createdAt: { gte: daysAgo } },
    })

    const monthlyCars = await db.car.count({
      where: { createdAt: { gte: daysAgo } },
    })

    // Calculate average price
    const priceStats = await db.car.aggregate({
      where: { status: 'ACTIVE' },
      _avg: { price: true },
      _min: { price: true },
      _max: { price: true },
    })

    // Top cities by car count
    const topCities = await db.car.groupBy({
      by: ['cityId'],
      where: { status: 'ACTIVE', cityId: { not: null } },
      _count: true,
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    })

    const cityDetails = await db.city.findMany({
      where: { id: { in: topCities.map((c) => c.cityId!) } },
      select: { id: true, name: true },
    })

    // Top brands by car count
    const topBrands = await db.car.groupBy({
      by: ['brandId'],
      where: { status: 'ACTIVE' },
      _count: true,
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    })

    const brandDetails = await db.brand.findMany({
      where: { id: { in: topBrands.map((b) => b.brandId) } },
      select: { id: true, name: true, logo: true },
    })

    return NextResponse.json({
      overview: {
        totalCars,
        activeCars,
        featuredCars,
        totalLeads,
        newLeads,
        convertedLeads,
        totalUsers,
        totalDealers,
        totalBlogs,
        monthlyLeads,
        monthlyCars,
      },
      priceStats: {
        average: priceStats._avg.price,
        min: priceStats._min.price,
        max: priceStats._max.price,
      },
      recentLeads,
      recentCars,
      leadsByType: leadsByType.map((l) => ({
        type: l.type,
        count: l._count,
      })),
      topCities: topCities.map((c, i) => ({
        ...cityDetails.find((cd) => cd.id === c.cityId),
        count: c._count,
      })),
      topBrands: topBrands.map((b, i) => ({
        ...brandDetails.find((bd) => bd.id === b.brandId),
        count: b._count,
      })),
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
