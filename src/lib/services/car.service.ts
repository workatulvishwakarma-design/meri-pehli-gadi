import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { getCarMainImage } from '@/lib/images/car-image-map'

// ─── Normalize Car Data ─────────────────────────────────────────────
function normalizeCar(car: any): any {
  if (!car) return null
  const brandName = car.brand?.name || ''
  const modelName = car.model?.name || ''

  // Flatten images
  let images: string[] = (car.images || []).map((img: any) => img.url).filter(Boolean)

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
    viewsCount: car.viewsCount || Math.floor(Math.random() * 1000) + 500,
  }
}

// ─── Core Service Methods ───────────────────────────────────────────

export const CarService = {
  /**
   * Get paginated cars based on filters
   */
  getCars: unstable_cache(
    async (params: {
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
      search?: string
    }) => {
      const {
        citySlug, brandSlug, budgetMax, budgetMin,
        fuelType, bodyType, transmission, isCertified, isFeatured,
        limit = 12, page = 1, sort = 'newest', search
      } = params

      const skip = (page - 1) * limit
      const where: any = { status: 'ACTIVE' }

      if (citySlug && citySlug !== 'assam') where.city = { slug: citySlug }
      if (brandSlug) where.brand = { slug: brandSlug }
      if (budgetMax || budgetMin) {
        where.price = {}
        if (budgetMax) where.price.lte = budgetMax
        if (budgetMin) where.price.gte = budgetMin
      }
      if (fuelType) where.fuelType = fuelType.toUpperCase()
      if (bodyType) {
        let b = bodyType.toUpperCase()
        if (b === 'MUV' || b === 'MUV_MPV' || b === 'MUV-MPV') b = 'MPV'
        where.bodyType = b
      }
      if (transmission) where.transmission = transmission.toUpperCase()
      if (isCertified !== undefined) where.isCertified = isCertified
      if (isFeatured !== undefined) where.isFeatured = isFeatured
      
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { brand: { name: { contains: search } } },
          { model: { name: { contains: search } } },
          { city: { name: { contains: search } } }
        ]
      }

      let orderBy: any = { createdAt: 'desc' }
      if (sort === 'price-asc') orderBy = { price: 'asc' }
      if (sort === 'price-desc') orderBy = { price: 'desc' }
      if (sort === 'km-driven-asc') orderBy = { kmDriven: 'asc' }
      if (sort === 'popular') orderBy = { viewsCount: 'desc' }

      try {
        const [cars, total] = await Promise.all([
          db.car.findMany({
            where,
            include: { brand: true, model: true, city: true, images: { take: 4, orderBy: { sortOrder: 'asc' } } },
            orderBy,
            skip,
            take: limit,
          }),
          db.car.count({ where }),
        ])
        return { cars: cars.map(normalizeCar), total, totalPages: Math.ceil(total / limit) }
      } catch (error) {
        console.error('Error in CarService.getCars:', error)
        return { cars: [], total: 0, totalPages: 0 }
      }
    },
    ['cars-service'],
    { revalidate: 300, tags: ['cars'] }
  ),

  /**
   * Get featured cars
   */
  getFeaturedCars: unstable_cache(
    async (limit = 8) => {
      try {
        let cars = await db.car.findMany({
          where: { status: 'ACTIVE', isFeatured: true },
          include: { brand: true, model: true, city: true, images: { take: 4, orderBy: { sortOrder: 'asc' } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        
        // Fallback: If no featured cars exist, just grab the latest active cars
        if (!cars || cars.length === 0) {
          cars = await db.car.findMany({
            where: { status: 'ACTIVE' },
            include: { brand: true, model: true, city: true, images: { take: 4, orderBy: { sortOrder: 'asc' } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
          })
        }
        
        return cars.map(normalizeCar)
      } catch (error) {
        return []
      }
    },
    ['featured-cars'],
    { revalidate: 300, tags: ['cars'] }
  ),

  /**
   * Get trending cars (most viewed)
   */
  getTrendingCars: unstable_cache(
    async (limit = 8) => {
      try {
        const cars = await db.car.findMany({
          where: { status: 'ACTIVE' },
          include: { brand: true, model: true, city: true, images: { take: 4, orderBy: { sortOrder: 'asc' } } },
          orderBy: { viewsCount: 'desc' },
          take: limit,
        })
        return cars.map(normalizeCar)
      } catch (error) {
        return []
      }
    },
    ['trending-cars'],
    { revalidate: 300, tags: ['cars'] }
  ),

  /**
   * Increment view count for a specific car
   */
  incrementCarViews: async (carId: string) => {
    try {
      await db.car.update({
        where: { id: carId },
        data: { viewsCount: { increment: 1 } }
      })
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }
}
