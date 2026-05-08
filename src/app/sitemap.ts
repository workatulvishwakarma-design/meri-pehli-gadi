import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE_URL = 'https://meripehligadi.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch active cars
  const cars = await db.car.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true, updatedAt: true }
  })

  // Fetch active brands
  const brands = await db.brand.findMany({
    select: { slug: true }
  })

  // Fetch active cities
  const cities = await db.city.findMany({
    select: { slug: true }
  })

  const carUrls = cars.map((car) => ({
    url: `${BASE_URL}/car/${car.slug}`,
    lastModified: car.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const brandUrls = brands.map((brand) => ({
    url: `${BASE_URL}/used-cars/brand/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const cityUrls = cities.map((city) => ({
    url: `${BASE_URL}/used-cars/in/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/used-cars`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/insurance`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/sell-car`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  return [...staticUrls, ...cityUrls, ...brandUrls, ...carUrls]
}
