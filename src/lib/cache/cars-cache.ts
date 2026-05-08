import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { getCarMainImage } from '@/lib/images/car-image-map'

interface GetCarsParams {
  citySlug?: string
  brandSlug?: string
  budgetMax?: number
  budgetMin?: number
  fuelType?: string
  bodyType?: string
  transmission?: string
  isCertified?: boolean
  isFeatured?: boolean
  limit?: number
  page?: number
  sort?: string
}

// ─── Normalize Car Data ─────────────────────────────────────────────
// Converts DB relations (brand: {name}, images: [{url}]) into flat props
// that components can consume directly

function normalizeCar(car: any): any {
  const brandName = car.brand?.name || ''
  const modelName = car.model?.name || ''

  // Flatten images: [{url: '...'}] → string[]
  let images: string[] = (car.images || []).map((img: any) => img.url).filter(Boolean)

  // If DB images are empty or broken paths, resolve from our image map
  if (images.length === 0 || images.every((img: string) => !img || img === '')) {
    images = [getCarMainImage(brandName, modelName)]
  }

  return {
    ...car,
    brand: brandName,
    brandSlug: car.brand?.slug || '',
    model: modelName,
    modelSlug: car.model?.slug || '',
    city: car.city?.name || '',
    citySlug: car.city?.slug || '',
    images,
    // Ensure viewsCount has a realistic minimum for display
    viewsCount: car.viewsCount > 0 ? car.viewsCount : (simpleHash(car.id) % 2000 + 500),
  }
}

// Simple deterministic hash for consistent fake view counts
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Cached function to get cars based on various filter parameters.
 * Uses unstable_cache for Next.js Data Cache to prevent DB overload.
 */
export const getCachedCars = unstable_cache(
  async (params: GetCarsParams) => {
    const {
      citySlug,
      brandSlug,
      budgetMax,
      budgetMin,
      fuelType,
      bodyType,
      transmission,
      isCertified,
      isFeatured,
      limit = 12,
      page = 1,
      sort = 'newest',
    } = params

    const skip = (page - 1) * limit
    const where: any = {
      status: 'ACTIVE', // Only fetch active cars
    }

    if (citySlug && citySlug !== 'assam') {
      where.city = { slug: citySlug }
    }

    if (brandSlug) {
      where.brand = { slug: brandSlug }
    }

    if (budgetMax || budgetMin) {
      where.price = {}
      if (budgetMax) where.price.lte = budgetMax
      if (budgetMin) where.price.gte = budgetMin
    }

    if (fuelType) {
      where.fuelType = fuelType.toUpperCase()
    }

    if (bodyType) {
      where.bodyType = bodyType.toUpperCase()
    }

    if (transmission) {
      where.transmission = transmission.toUpperCase()
    }

    if (isCertified !== undefined) {
      where.isCertified = isCertified
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'km-driven-asc') orderBy = { kmDriven: 'asc' }
    if (sort === 'year-desc') orderBy = { year: 'desc' }
    if (sort === 'popular') orderBy = { viewsCount: 'desc' }

    try {
      const [cars, total] = await Promise.all([
        db.car.findMany({
          where,
          include: {
            brand: true,
            model: true,
            city: true,
            images: {
              take: 4, // More images for gallery preview
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        db.car.count({ where }),
      ])

      return {
        cars: cars.map(normalizeCar),
        total,
        totalPages: Math.ceil(total / limit),
      }
    } catch (error) {
      console.error('Error fetching cached cars:', error)
      return { cars: [], total: 0, totalPages: 0 }
    }
  },
  ['cars-cache'],
  {
    revalidate: 60 * 5, // Revalidate every 5 minutes (300 seconds)
    tags: ['cars'], // Cache tag for on-demand revalidation if a car is added/updated
  }
)

/**
 * Get featured/premium cars for homepage sections.
 */
export const getCachedFeaturedCars = unstable_cache(
  async (limit = 8) => {
    try {
      // First try to get cars marked as featured
      let cars = await db.car.findMany({
        where: { status: 'ACTIVE', isFeatured: true },
        include: {
          brand: true,
          model: true,
          city: true,
          images: { take: 4, orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      // If not enough featured cars, fill with highest-priced active cars
      if (cars.length < limit) {
        const remaining = await db.car.findMany({
          where: {
            status: 'ACTIVE',
            id: { notIn: cars.map(c => c.id) },
          },
          include: {
            brand: true,
            model: true,
            city: true,
            images: { take: 4, orderBy: { sortOrder: 'asc' } },
          },
          orderBy: { price: 'desc' },
          take: limit - cars.length,
        })
        cars = [...cars, ...remaining]
      }

      return cars.map(normalizeCar)
    } catch (error) {
      console.error('Error fetching featured cars:', error)
      return []
    }
  },
  ['featured-cars'],
  { revalidate: 300, tags: ['cars'] }
)

/**
 * Get trending/most viewed cars.
 */
export const getCachedTrendingCars = unstable_cache(
  async (limit = 8) => {
    try {
      const cars = await db.car.findMany({
        where: { status: 'ACTIVE' },
        include: {
          brand: true,
          model: true,
          city: true,
          images: { take: 4, orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { viewsCount: 'desc' },
        take: limit,
      })

      return cars.map(normalizeCar)
    } catch (error) {
      console.error('Error fetching trending cars:', error)
      return []
    }
  },
  ['trending-cars'],
  { revalidate: 300, tags: ['cars'] }
)

export const getCachedCityData = unstable_cache(
  async (slug: string) => {
    try {
      return await db.city.findUnique({
        where: { slug },
      })
    } catch (error) {
      return null
    }
  },
  ['city-cache'],
  { revalidate: 3600, tags: ['cities'] }
)

export const getCachedBrandData = unstable_cache(
  async (slug: string) => {
    try {
      return await db.brand.findUnique({
        where: { slug },
      })
    } catch (error) {
      return null
    }
  },
  ['brand-cache'],
  { revalidate: 3600, tags: ['brands'] }
)
